'use client';
import { useId, useState } from 'react';
import { compact, nf, shortDay } from './utils';

export const COLORS = { ink: '#17130e', gold: '#b8925a', goldD: '#7f6232', green: '#2f7a4a', sand: '#e2c79a', blue: '#4c6a8a' };

type Series = { name: string; color: string; values: number[] };

/** Round the axis maximum up to a "nice" number so the 4 grid steps read cleanly (e.g. 8, 20, 40, 100). */
function niceMax(m: number) {
  const raw = Math.max(m, 4) / 4, p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p * 4;
}

/** Smooth multi-series area/line chart with hover tooltip. Pure SVG, no dependencies. */
export function LineChart({ labels, series, height = 220 }: { labels: string[]; series: Series[]; height?: number }) {
  const id = useId().replace(/:/g, '');
  const [hover, setHover] = useState<number | null>(null);
  const W = 640, H = height, P = { l: 8, r: 8, t: 14, b: 8 };
  const n = labels.length;
  const max = Math.max(1, ...series.flatMap((s) => s.values));
  const nice = niceMax(max);
  const x = (i: number) => P.l + (n <= 1 ? (W - P.l - P.r) / 2 : (i / (n - 1)) * (W - P.l - P.r));
  const y = (v: number) => P.t + (1 - v / nice) * (H - P.t - P.b);
  const path = (vals: number[]) => {
    if (!vals.length) return '';
    let d = `M${x(0)},${y(vals[0])}`;
    for (let i = 1; i < vals.length; i++) { const cx = (x(i - 1) + x(i)) / 2; d += ` C${cx},${y(vals[i - 1])} ${cx},${y(vals[i])} ${x(i)},${y(vals[i])}`; }
    return d;
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const rel = ((e.clientX - r.left) / r.width) * W;
    setHover(Math.max(0, Math.min(n - 1, Math.round(((rel - P.l) / (W - P.l - P.r)) * (n - 1)))));
  };
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  return (
    <div className="ad-chart" style={{ ['--h' as string]: `${H}px` }}>
      <div className="ad-chart__y">{[...ticks].reverse().map((t) => <span key={t}>{compact(nice * t)}</span>)}</div>
      <div className="ad-chart__plot">
        <div className="ad-chart__box">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" onPointerMove={onMove} onPointerLeave={() => setHover(null)} role="img" aria-label="Trend chart">
          <defs>{series.map((s, i) => <linearGradient key={i} id={`${id}g${i}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={s.color} stopOpacity=".22" /><stop offset="1" stopColor={s.color} stopOpacity="0" /></linearGradient>)}</defs>
          {ticks.map((t) => <line key={t} x1={P.l} x2={W - P.r} y1={y(nice * t)} y2={y(nice * t)} className="ad-grid" />)}
          {series.map((s, i) => (
            <g key={s.name}>
              {i === 0 && n > 1 && <path d={`${path(s.values)} L${x(n - 1)},${H - P.b} L${x(0)},${H - P.b} Z`} fill={`url(#${id}g${i})`} />}
              <path d={path(s.values)} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="ad-line" />
            </g>
          ))}
          {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={P.t} y2={H - P.b} className="ad-cursor" vectorEffect="non-scaling-stroke" />}
        </svg>
        {hover !== null && series.map((s) => <i key={s.name} className="ad-dot" style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(s.values[hover]) / H) * 100}%`, background: s.color }} />)}
        {hover !== null && (
          <div className="ad-tip" style={{ left: `${(x(hover) / W) * 100}%`, transform: `translateX(${hover > n * 0.65 ? '-105%' : '12px'})` }}>
            <b>{shortDay(labels[hover])}</b>
            {series.map((s) => <span key={s.name}><i style={{ background: s.color }} />{s.name}<em>{nf(s.values[hover])}</em></span>)}
          </div>
        )}
        </div>
        <div className="ad-chart__x"><span>{shortDay(labels[0] || '')}</span><span>{shortDay(labels[Math.floor((n - 1) / 2)] || '')}</span><span>{shortDay(labels[n - 1] || '')}</span></div>
      </div>
    </div>
  );
}

export function Legend({ items }: { items: { name: string; color: string }[] }) {
  return <div className="ad-legend">{items.map((i) => <span key={i.name}><i style={{ background: i.color }} />{i.name}</span>)}</div>;
}

/** Horizontal bar list. */
export function BarList({ rows, color = COLORS.gold, format = nf, empty = 'No data yet', render }: { rows: { k: string; v: number }[]; color?: string; format?: (n: number) => string; empty?: string; render?: (k: string) => React.ReactNode }) {
  const max = Math.max(1, ...rows.map((r) => r.v));
  if (!rows.length) return <p className="ad-empty">{empty}</p>;
  return (
    <ul className="ad-bars">
      {rows.map((r) => (
        <li key={r.k}>
          <div className="ad-bars__top"><span title={r.k}>{render ? render(r.k) : r.k}</span><b>{format(r.v)}</b></div>
          <div className="ad-bars__track"><i style={{ width: `${(r.v / max) * 100}%`, background: color }} /></div>
        </li>
      ))}
    </ul>
  );
}

/** Donut with centre total and legend. */
export function Donut({ rows, palette = [COLORS.ink, COLORS.gold, COLORS.sand, COLORS.green, COLORS.blue, COLORS.goldD] }: { rows: { k: string; v: number }[]; palette?: string[] }) {
  const total = rows.reduce((a, r) => a + r.v, 0);
  if (!total) return <p className="ad-empty">No data yet</p>;
  const R = 42, C = 2 * Math.PI * R;
  let off = 0;
  return (
    <div className="ad-donut">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r={R} fill="none" stroke="var(--paper-3)" strokeWidth="12" />
        {rows.map((r, i) => { const len = (r.v / total) * C; const el = <circle key={r.k} cx="50" cy="50" r={R} fill="none" stroke={palette[i % palette.length]} strokeWidth="12" strokeDasharray={`${Math.max(len - 1.5, 0)} ${C}`} strokeDashoffset={-off} transform="rotate(-90 50 50)" />; off += len; return el; })}
        <text x="50" y="49" textAnchor="middle" className="ad-donut__n">{compact(total)}</text>
        <text x="50" y="62" textAnchor="middle" className="ad-donut__l">total</text>
      </svg>
      <ul>{rows.map((r, i) => <li key={r.k}><i style={{ background: palette[i % palette.length] }} />{r.k}<b>{Math.round((r.v / total) * 100)}%</b></li>)}</ul>
    </div>
  );
}

/** 24h activity columns. */
export function HourBars({ hours }: { hours: number[] }) {
  const max = Math.max(1, ...hours);
  return (
    <div className="ad-hours" role="img" aria-label="Visits by hour of day (Dubai time)">
      {hours.map((v, h) => <div key={h} title={`${String(h).padStart(2, '0')}:00 · ${v} views`}><i style={{ height: `${Math.max((v / max) * 100, v ? 6 : 2)}%`, opacity: v ? 0.35 + 0.65 * (v / max) : 0.18 }} />{h % 6 === 0 && <span>{String(h).padStart(2, '0')}</span>}</div>)}
    </div>
  );
}

/** Tiny inline sparkline for KPI cards. */
export function Spark({ values, color = COLORS.gold }: { values: number[]; color?: string }) {
  const W = 100, H = 28, max = Math.max(1, ...values);
  if (values.length < 2) return null;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * W},${H - 2 - (v / max) * (H - 6)}`).join(' ');
  return <svg className="ad-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true"><polyline points={pts} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" /></svg>;
}
