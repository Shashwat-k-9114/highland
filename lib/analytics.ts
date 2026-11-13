import 'server-only';
import { getStore } from './store';

/** First-party, cookie-less-by-design traffic analytics. Aggregated daily counters only; no raw IPs stored. */

export const DUBAI_OFFSET_MS = 4 * 3600e3;
export const dubaiDay = (d: Date = new Date()) => new Date(d.getTime() + DUBAI_OFFSET_MS).toISOString().slice(0, 10);
const dubaiHour = (d: Date = new Date()) => String(new Date(d.getTime() + DUBAI_OFFSET_MS).getUTCHours()).padStart(2, '0');

const BOT = /bot|crawl|spider|slurp|preview|lighthouse|headless|pagespeed|gtmetrix|facebookexternalhit|embedly|monitor|uptime|curl|wget|python-requests|axios|node-fetch/i;
export const isBot = (ua: string) => !ua || BOT.test(ua);

export function parseUA(ua: string) {
  const device = /ipad|tablet|(android(?!.*mobile))/i.test(ua) ? 'Tablet' : /mobi|iphone|android/i.test(ua) ? 'Mobile' : 'Desktop';
  const browser = /edg\//i.test(ua) ? 'Edge' : /opr\/|opera/i.test(ua) ? 'Opera' : /samsungbrowser/i.test(ua) ? 'Samsung' : /chrome|crios/i.test(ua) ? 'Chrome' : /firefox|fxios/i.test(ua) ? 'Firefox' : /safari/i.test(ua) ? 'Safari' : 'Other';
  const os = /windows/i.test(ua) ? 'Windows' : /iphone|ipad|ios/i.test(ua) ? 'iOS' : /android/i.test(ua) ? 'Android' : /mac os/i.test(ua) ? 'macOS' : /linux/i.test(ua) ? 'Linux' : 'Other';
  return { device, browser, os };
}

export function channel(refHost: string, utm: { source?: string; medium?: string; gclid?: boolean }): string {
  const m = (utm.medium || '').toLowerCase();
  if (utm.gclid || /cpc|ppc|paid|display|retarget/.test(m)) return 'Paid';
  if (/email|newsletter/.test(m)) return 'Email';
  if (utm.source) return /facebook|instagram|linkedin|twitter|youtube|whatsapp|social/i.test(utm.source) ? 'Social' : 'Campaign';
  if (!refHost) return 'Direct';
  if (/(^|\.)(google|bing|yahoo|duckduckgo|baidu|yandex|ecosia|brave)\./i.test(refHost)) return 'Organic Search';
  if (/(facebook|instagram|linkedin|twitter|t\.co|x\.com|youtube|whatsapp|reddit|pinterest)/i.test(refHost)) return 'Social';
  return 'Referral';
}

export type TrackPayload = {
  t: 'pv' | 'ev';
  name?: string;
  path?: string;
  vid?: string;
  sid?: string;
  ref?: string;
  us?: string; // utm_source
  um?: string; // utm_medium
  gc?: boolean;
};

const clean = (s: unknown, n = 80) => (typeof s === 'string' ? s.replace(/[^\w\-./:@ ]/g, '').slice(0, n) : '');

export async function record(p: TrackPayload, ctx: { ua: string; country: string }) {
  const store = getStore();
  const now = new Date();
  const day = dubaiDay(now);
  const key = `an:d:${day}`;
  const f: Record<string, number> = {};
  const bump = (k: string, n = 1) => { f[k] = (f[k] || 0) + n; };

  if (p.t === 'pv') {
    const path = clean(p.path, 120) || '/';
    let refHost = '';
    try { refHost = p.ref ? new URL(p.ref).hostname.replace(/^www\./, '') : ''; } catch { /* ignore */ }
    const { device, browser, os } = parseUA(ctx.ua);
    bump('pv'); bump(`pg:${path}`); bump(`hr:${dubaiHour(now)}`);
    bump(`dev:${device}`); bump(`br:${browser}`); bump(`os:${os}`);
    bump(`cty:${ctx.country || 'XX'}`);
    bump(`ref:${refHost || 'direct'}`);
    bump(`src:${channel(refHost, { source: clean(p.us), medium: clean(p.um), gclid: !!p.gc })}`);
    const vid = clean(p.vid, 40), sid = clean(p.sid, 40);
    if (vid && (await store.sadd(`an:v:${day}`, vid))) bump('uv');
    if (sid && (await store.sadd(`an:s:${day}`, sid))) bump('ss');
    if (sid) await store.hset('an:live', sid, JSON.stringify({ t: now.getTime(), p: path }));
  } else if (p.name) {
    const name = clean(p.name, 40).replace(/\s/g, '_');
    if (!name) return;
    bump(`ev:${name}`);
    const sid = clean(p.sid, 40);
    if (sid) await store.hset('an:live', sid, JSON.stringify({ t: now.getTime(), p: clean(p.path, 120) || '/' }));
  }
  if (Object.keys(f).length) await store.hincrMany(key, f);
}

/** Server-side event (e.g. a lead that definitely landed). */
export const recordServerEvent = (name: string) => getStore().hincr(`an:d:${dubaiDay()}`, `ev:${name}`, 1);

/* ───────────── Reading ───────────── */
type Row = { k: string; v: number };
const top = (m: Map<string, number>, n = 8): Row[] => [...m.entries()].map(([k, v]) => ({ k, v })).sort((a, b) => b.v - a.v).slice(0, n);

function addDays(day: string, n: number) { const d = new Date(day + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }

export type DayRow = { date: string; pv: number; uv: number; ss: number; leads: number };
export type Totals = { pv: number; uv: number; ss: number; leads: number; cta: number; popup: number; wa: number; call: number; formStart: number };

const sumTotals = (rows: Record<string, string>[]): Totals => {
  const t: Totals = { pv: 0, uv: 0, ss: 0, leads: 0, cta: 0, popup: 0, wa: 0, call: 0, formStart: 0 };
  for (const h of rows) {
    t.pv += +(h.pv || 0); t.uv += +(h.uv || 0); t.ss += +(h.ss || 0);
    t.leads += +(h['ev:generate_lead'] || 0); t.cta += +(h['ev:cta_click'] || 0); t.popup += +(h['ev:popup_open'] || 0);
    t.wa += +(h['ev:whatsapp_click'] || 0); t.call += +(h['ev:call_click'] || 0); t.formStart += +(h['ev:form_start'] || 0);
  }
  return t;
};

export async function readAnalytics(days: number) {
  const store = getStore();
  const today = dubaiDay();
  const dates = Array.from({ length: days }, (_, i) => addDays(today, -(days - 1 - i)));
  const prevDates = Array.from({ length: days }, (_, i) => addDays(today, -(2 * days - 1 - i)));
  const all = await store.hgetallMany([...dates, ...prevDates].map((d) => `an:d:${d}`));
  const cur = all.slice(0, days), prev = all.slice(days);

  const series: DayRow[] = cur.map((h, i) => ({ date: dates[i], pv: +(h.pv || 0), uv: +(h.uv || 0), ss: +(h.ss || 0), leads: +(h['ev:generate_lead'] || 0) }));
  const groups: Record<string, Map<string, number>> = { dev: new Map(), br: new Map(), os: new Map(), cty: new Map(), src: new Map(), ref: new Map(), pg: new Map(), ev: new Map() };
  const hours = Array.from({ length: 24 }, () => 0);
  for (const h of cur) {
    for (const [k, v] of Object.entries(h)) {
      const i = k.indexOf(':'); if (i < 0) continue;
      const g = k.slice(0, i), name = k.slice(i + 1), n = +v || 0;
      if (g === 'hr') hours[+name] += n;
      else if (groups[g]) groups[g].set(name, (groups[g].get(name) || 0) + n);
    }
  }
  const live = await store.hgetall('an:live');
  const cutoff = Date.now() - 5 * 60e3;
  let liveNow = 0; const stale: string[] = []; const livePages = new Map<string, number>();
  for (const [sid, raw] of Object.entries(live)) {
    try { const o = JSON.parse(raw) as { t: number; p: string }; if (o.t >= cutoff) { liveNow++; livePages.set(o.p, (livePages.get(o.p) || 0) + 1); } else if (o.t < Date.now() - 3600e3) stale.push(sid); } catch { stale.push(sid); }
  }
  if (stale.length) store.hdel('an:live', ...stale).catch(() => {});

  return {
    series,
    totals: sumTotals(cur),
    prev: sumTotals(prev),
    devices: top(groups.dev), browsers: top(groups.br), os: top(groups.os), countries: top(groups.cty, 10),
    channels: top(groups.src), referrers: top(groups.ref, 8).filter((r) => r.k !== 'direct'), pages: top(groups.pg, 8),
    events: top(groups.ev, 14), hours, live: liveNow, livePages: top(livePages, 5),
  };
}
