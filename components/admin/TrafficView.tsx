'use client';
import { useState } from 'react';
import { BarList, COLORS, Donut, HourBars, Legend, LineChart } from './charts';
import { Card, Delta, Icon } from './ui';
import type { AnalyticsResponse } from './types';
import { compact, countryName, delta, duration, flag, nf, pct } from './utils';

export default function TrafficView({ data, goSettings }: { data: AnalyticsResponse | null; goSettings: () => void }) {
  const [src, setSrc] = useState<'first' | 'ga'>('first');
  if (!data) return <div className="ad-skel ad-skel--chart" />;
  const f = data.first;
  const t = f.totals, p = f.prev;
  const labels = f.series.map((s) => s.date);

  return (
    <div className="ad-grid-page">
      <div className="ad-tabs2" role="tablist" aria-label="Analytics source">
        <button role="tab" aria-selected={src === 'first'} className={src === 'first' ? 'on' : ''} onClick={() => setSrc('first')}>Site analytics<small>live, built-in</small></button>
        <button role="tab" aria-selected={src === 'ga'} className={src === 'ga' ? 'on' : ''} onClick={() => setSrc('ga')}>Google Analytics 4<small>{data.ga ? 'connected' : data.gaConfigured ? 'error' : 'not connected'}</small></button>
      </div>

      {src === 'first' ? (
        <>
          <div className="ad-kpis ad-kpis--4">
            {[['Visitors', t.uv, p.uv], ['Sessions', t.ss, p.ss], ['Page views', t.pv, p.pv], ['Engaged actions', t.cta + t.popup + t.formStart, p.cta + p.popup + p.formStart]].map(([l, c, pv]) => (
              <div className="ad-kpi" key={l as string}><span className="ad-kpi__l">{l as string}</span><b>{compact(c as number)}</b><div className="ad-kpi__f"><Delta d={delta(c as number, pv as number)} /><small>vs previous {data.days}d</small></div></div>
            ))}
          </div>
          <Card title="Visitors, sessions & page views" sub={`Last ${data.days} days · Dubai time`} right={<Legend items={[{ name: 'Visitors', color: COLORS.ink }, { name: 'Sessions', color: COLORS.blue }, { name: 'Page views', color: COLORS.gold }]} />}>
            <LineChart labels={labels} height={260} series={[{ name: 'Page views', color: COLORS.gold, values: f.series.map((s) => s.pv) }, { name: 'Sessions', color: COLORS.blue, values: f.series.map((s) => s.ss) }, { name: 'Visitors', color: COLORS.ink, values: f.series.map((s) => s.uv) }]} />
          </Card>
          <div className="ad-row ad-row--3">
            <Card title="Channels" sub="How people found you"><BarList rows={f.channels} color={COLORS.gold} /></Card>
            <Card title="Top referrers"><BarList rows={f.referrers} color={COLORS.ink} empty="No external referrers yet" /></Card>
            <Card title="Countries"><BarList rows={f.countries} color={COLORS.gold} render={(k) => <>{flag(k)} {countryName(k)}</>} empty="Locations appear once the site is live on Vercel" /></Card>
          </div>
          <div className="ad-row ad-row--3">
            <Card title="Devices"><Donut rows={f.devices} /></Card>
            <Card title="Browsers"><Donut rows={f.browsers} /></Card>
            <Card title="Operating systems"><Donut rows={f.os} /></Card>
          </div>
          <div className="ad-row ad-row--2-1">
            <Card title="When visitors are active" sub="Page views by hour of day (Dubai time)"><HourBars hours={f.hours} /></Card>
            <Card title="Top pages"><BarList rows={f.pages} color={COLORS.gold} /></Card>
          </div>
          <Card title="Events" sub="Everything we track on the site">
            <BarList rows={f.events.map((e) => ({ k: e.k.replace(/_/g, ' '), v: e.v }))} color={COLORS.green} empty="Events appear as visitors interact" />
          </Card>
        </>
      ) : data.ga ? (
        <>
          <div className="ad-kpis ad-kpis--4">
            {[['Active users', compact(data.ga.totals.users)], ['Sessions', compact(data.ga.totals.sessions)], ['Page views', compact(data.ga.totals.views)], ['Engagement rate', pct(data.ga.totals.engagementRate * 100)]].map(([l, v]) => (
              <div className="ad-kpi" key={l}><span className="ad-kpi__l">{l}</span><b>{v}</b><div className="ad-kpi__f"><small>last {data.days} days</small></div></div>
            ))}
          </div>
          <div className="ad-row ad-row--2-1">
            <Card title="Users, sessions & views" sub="Straight from Google Analytics 4" right={<Legend items={[{ name: 'Users', color: COLORS.ink }, { name: 'Sessions', color: COLORS.blue }, { name: 'Views', color: COLORS.gold }]} />}>
              <LineChart labels={data.ga.series.map((s) => s.date)} height={260} series={[{ name: 'Views', color: COLORS.gold, values: data.ga.series.map((s) => s.views) }, { name: 'Sessions', color: COLORS.blue, values: data.ga.series.map((s) => s.sessions) }, { name: 'Users', color: COLORS.ink, values: data.ga.series.map((s) => s.users) }]} />
            </Card>
            <Card title="Right now" sub="Active users on the site">
              <div className="ad-big"><b><i className="ad-livedot" />{data.ga.realtime}</b><span>avg session {duration(data.ga.totals.avgDuration)}</span><span>{nf(data.ga.totals.keyEvents)} key events</span></div>
            </Card>
          </div>
          <div className="ad-row ad-row--3">
            <Card title="Channels"><BarList rows={data.ga.channels} color={COLORS.gold} /></Card>
            <Card title="Countries"><BarList rows={data.ga.countries} color={COLORS.ink} render={(k) => <>{countryName(k)}</>} /></Card>
            <Card title="Devices"><Donut rows={data.ga.devices} /></Card>
          </div>
          <Card title="Top pages"><BarList rows={data.ga.pages} color={COLORS.gold} /></Card>
        </>
      ) : (
        <Card className="ad-setup">
          <Icon name="globe" size={30} />
          <h3>{data.gaConfigured ? 'Google Analytics could not be reached' : 'Connect Google Analytics 4'}</h3>
          {data.gaConfigured ? <p className="ad-err">{data.gaError || 'Unknown error'}. Check the service-account email has Viewer access to the property and the Analytics Data API is enabled.</p> : (
            <>
              <p>Your site already loads GA4 tracking{data.gaId ? ` (${data.gaId})` : ' once you set NEXT_PUBLIC_GA_ID'}. To see its reports inside this panel, add a read-only service account. It takes about five minutes.</p>
              <button className="ad-btn ad-btn--gold" onClick={goSettings}>Open setup guide</button>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
