'use client';
import { useMemo } from 'react';
import { BarList, COLORS, Donut, Legend, LineChart, Spark } from './charts';
import { Card, Delta, Icon, StatusPill } from './ui';
import type { AnalyticsResponse, Lead } from './types';
import { ago, compact, countryName, delta, dubaiDay, flag, initials, nf, pct } from './utils';

type Props = { leads: Lead[]; data: AnalyticsResponse | null; days: number; goto: (tab: 'leads' | 'traffic' | 'settings', lead?: string) => void };

export default function OverviewView({ leads, data, days, goto }: Props) {
  const f = data?.first;
  const labels = useMemo(() => f?.series.map((s) => s.date) || [], [f]);

  // Leads per day from the lead records themselves (the source of truth)
  const leadSeries = useMemo(() => {
    const m = new Map<string, number>();
    for (const l of leads) { const d = dubaiDay(l.createdAt); m.set(d, (m.get(d) || 0) + 1); }
    return labels.map((d) => m.get(d) || 0);
  }, [leads, labels]);
  const leadsInRange = leadSeries.reduce((a, b) => a + b, 0);
  const prevCutoff = Date.now() - days * 2 * 86400e3, curCutoff = Date.now() - days * 86400e3;
  const leadsPrev = leads.filter((l) => { const t = new Date(l.createdAt).getTime(); return t >= prevCutoff && t < curCutoff; }).length;
  const newCount = leads.filter((l) => l.status === 'new').length;
  const won = leads.filter((l) => l.status === 'won').length;

  const t = f?.totals, p = f?.prev;
  const conv = t && t.uv ? Math.min((leadsInRange / t.uv) * 100, 100) : 0;
  const convPrev = p && p.uv ? Math.min((leadsPrev / p.uv) * 100, 100) : 0;

  const funnel = t ? [
    { k: 'Visitors', v: t.uv, hint: 'unique people' },
    { k: 'Clicked a CTA', v: t.cta, hint: 'consultation / enquiry buttons' },
    { k: 'Opened Investor Pass', v: t.popup, hint: 'pop-up viewed' },
    { k: 'Started a form', v: t.formStart, hint: 'typed in the contact form' },
    { k: 'Became a lead', v: leadsInRange, hint: 'submitted details' },
  ] : [];
  const fmax = Math.max(1, ...funnel.map((x) => x.v));
  const recent = leads.slice(0, 6);

  return (
    <div className="ad-grid-page">
      <div className="ad-kpis">
        <Kpi label="New leads" value={nf(leadsInRange)} d={delta(leadsInRange, leadsPrev)} sub={`last ${days} days`} spark={leadSeries} color={COLORS.green} onClick={() => goto('leads')} />
        <Kpi label="Visitors" value={compact(t?.uv || 0)} d={delta(t?.uv || 0, p?.uv || 0)} sub="unique people" spark={f?.series.map((s) => s.uv)} />
        <Kpi label="Page views" value={compact(t?.pv || 0)} d={delta(t?.pv || 0, p?.pv || 0)} sub={`${t?.ss ? (t.pv / t.ss).toFixed(1) : '0'} per session`} spark={f?.series.map((s) => s.pv)} color={COLORS.ink} />
        <Kpi label="Conversion" value={pct(conv, 2)} d={delta(conv, convPrev)} sub="visitors → leads" />
        <div className="ad-kpi ad-kpi--live" onClick={() => goto('traffic')} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && goto('traffic')}>
          <span className="ad-kpi__l">Live now</span>
          <b><i className="ad-livedot" />{f?.live ?? 0}</b>
          <small>{f?.livePages[0] ? `mostly on ${f.livePages[0].k}` : 'active in last 5 min'}</small>
        </div>
      </div>

      <div className="ad-row ad-row--2-1">
        <Card title="Traffic & leads" sub={`Daily, last ${days} days (Dubai time)`} right={<Legend items={[{ name: 'Visitors', color: COLORS.ink }, { name: 'Page views', color: COLORS.gold }, { name: 'Leads', color: COLORS.green }]} />}>
          {f ? <LineChart labels={labels} series={[{ name: 'Page views', color: COLORS.gold, values: f.series.map((s) => s.pv) }, { name: 'Visitors', color: COLORS.ink, values: f.series.map((s) => s.uv) }, { name: 'Leads', color: COLORS.green, values: leadSeries }]} /> : <div className="ad-skel ad-skel--chart" />}
        </Card>
        <Card title="Conversion funnel" sub="From first visit to lead">
          <ol className="ad-funnel">
            {funnel.map((s, i) => (
              <li key={s.k}>
                <div className="ad-funnel__top"><span>{s.k}</span><b>{nf(s.v)}</b></div>
                <div className="ad-bars__track"><i style={{ width: `${Math.max((s.v / fmax) * 100, s.v ? 3 : 0)}%`, background: i === funnel.length - 1 ? COLORS.green : COLORS.gold }} /></div>
                <small>{i === 0 ? s.hint : `${funnel[i - 1].v ? Math.round((s.v / funnel[i - 1].v) * 100) : 0}% of previous · ${s.hint}`}</small>
              </li>
            ))}
            {!funnel.length && <div className="ad-skel ad-skel--chart" />}
          </ol>
        </Card>
      </div>

      <div className="ad-row ad-row--3">
        <Card title="Recent leads" right={<button className="ad-link" onClick={() => goto('leads')}>View all →</button>}>
          {recent.length ? (
            <ul className="ad-recent">
              {recent.map((l) => (
                <li key={l.id} onClick={() => goto('leads', l.id)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && goto('leads', l.id)}>
                  <span className="ad-av">{initials(l.name)}</span>
                  <div><b>{l.name}</b><small>{l.phone} · {l.source}</small></div>
                  <div className="ad-recent__r"><StatusPill status={l.status} /><small>{ago(l.createdAt)}</small></div>
                </li>
              ))}
            </ul>
          ) : <p className="ad-empty">No leads yet. They appear here instantly.</p>}
          <div className="ad-mini">
            <div><b>{nf(leads.length)}</b><span>total leads</span></div>
            <div><b>{nf(newCount)}</b><span>need a first call</span></div>
            <div><b>{nf(won)}</b><span>won</span></div>
          </div>
        </Card>
        <Card title="Where visitors come from"><BarList rows={f?.channels || []} color={COLORS.gold} /></Card>
        <Card title="Devices"><Donut rows={f?.devices || []} /></Card>
      </div>

      <div className="ad-row ad-row--3">
        <Card title="Top countries"><BarList rows={f?.countries || []} color={COLORS.ink} render={(k) => <>{flag(k)} {countryName(k)}</>} empty="Locations appear once the site is live on Vercel" /></Card>
        <Card title="Top pages"><BarList rows={f?.pages || []} color={COLORS.gold} /></Card>
        <Card title="Visitor actions" sub="What people do on the site">
          <ul className="ad-actions-list">
            <li><Icon name="bolt" size={16} />CTA clicks<b>{nf(t?.cta || 0)}</b></li>
            <li><Icon name="leads" size={16} />Pass pop-ups opened<b>{nf(t?.popup || 0)}</b></li>
            <li><Icon name="phone" size={16} />Call taps<b>{nf(t?.call || 0)}</b></li>
            <li><Icon name="mail" size={16} />WhatsApp taps<b>{nf(t?.wa || 0)}</b></li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Kpi({ label, value, d, sub, spark, color, onClick }: { label: string; value: string; d: { text: string; up: boolean | null }; sub: string; spark?: number[]; color?: string; onClick?: () => void }) {
  return (
    <div className="ad-kpi" onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined} onKeyDown={(e) => onClick && e.key === 'Enter' && onClick()}>
      <span className="ad-kpi__l">{label}</span>
      <b>{value}</b>
      <div className="ad-kpi__f"><Delta d={d} /><small>{sub}</small></div>
      {spark && <Spark values={spark} color={color} />}
    </div>
  );
}
