import 'server-only';
import { createSign } from 'node:crypto';

/**
 * Google Analytics 4 Data API connector (read-only), no SDK needed.
 * Needs a service account added as a Viewer on the GA4 property:
 *   GA_PROPERTY_ID, GA_CLIENT_EMAIL, GA_PRIVATE_KEY
 */
export const gaConfigured = () => !!(process.env.GA_PROPERTY_ID && process.env.GA_CLIENT_EMAIL && process.env.GA_PRIVATE_KEY);

const b64u = (b: Buffer | string) => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
let tok: { v: string; exp: number } | null = null;

async function token(): Promise<string> {
  if (tok && tok.exp > Date.now() + 60e3) return tok.v;
  const now = Math.floor(Date.now() / 1000);
  const head = b64u(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64u(JSON.stringify({ iss: process.env.GA_CLIENT_EMAIL, scope: 'https://www.googleapis.com/auth/analytics.readonly', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
  const key = (process.env.GA_PRIVATE_KEY || '').replace(/\\n/g, '\n').replace(/^"|"$/g, '');
  const sig = b64u(createSign('RSA-SHA256').update(`${head}.${claim}`).sign(key));
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${head}.${claim}.${sig}` }) });
  const j = (await r.json()) as { access_token?: string; expires_in?: number; error_description?: string };
  if (!j.access_token) throw new Error(j.error_description || 'GA auth failed');
  tok = { v: j.access_token, exp: Date.now() + (j.expires_in || 3600) * 1000 };
  return tok.v;
}

type Rep = { dimensionHeaders?: { name: string }[]; metricHeaders?: { name: string }[]; rows?: { dimensionValues?: { value: string }[]; metricValues: { value: string }[] }[] };

async function api(path: string, body: unknown): Promise<Rep> {
  const r = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${process.env.GA_PROPERTY_ID}:${path}`, {
    method: 'POST', headers: { Authorization: `Bearer ${await token()}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body), cache: 'no-store',
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j?.error?.message || `GA ${r.status}`);
  return j as Rep;
}

const num = (r: Rep, row: number, col: number) => +(r.rows?.[row]?.metricValues[col]?.value || 0);
const rowsOf = (r: Rep) => (r.rows || []).map((x) => ({ k: x.dimensionValues?.[0]?.value || '(not set)', v: +(x.metricValues[0]?.value || 0), v2: +(x.metricValues[1]?.value || 0) }));

const cache = new Map<number, { at: number; data: unknown }>();

export async function readGA(days: number) {
  const hit = cache.get(days);
  if (hit && Date.now() - hit.at < 120e3) return hit.data;
  const dateRanges = [{ startDate: `${days - 1}daysAgo`, endDate: 'today' }];
  const [overview, byDay, channels, countries, devices, pages, realtime] = await Promise.all([
    api('runReport', { dateRanges, metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }, { name: 'engagementRate' }, { name: 'averageSessionDuration' }, { name: 'keyEvents' }] }),
    api('runReport', { dateRanges, dimensions: [{ name: 'date' }], metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }], orderBys: [{ dimension: { dimensionName: 'date' } }] }),
    api('runReport', { dateRanges, dimensions: [{ name: 'sessionDefaultChannelGroup' }], metrics: [{ name: 'sessions' }, { name: 'activeUsers' }], orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 8 }),
    api('runReport', { dateRanges, dimensions: [{ name: 'country' }], metrics: [{ name: 'activeUsers' }, { name: 'sessions' }], orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }], limit: 10 }),
    api('runReport', { dateRanges, dimensions: [{ name: 'deviceCategory' }], metrics: [{ name: 'sessions' }, { name: 'activeUsers' }], orderBys: [{ metric: { metricName: 'sessions' }, desc: true }] }),
    api('runReport', { dateRanges, dimensions: [{ name: 'pagePath' }], metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }], orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 8 }),
    api('runRealtimeReport', { metrics: [{ name: 'activeUsers' }] }).catch(() => ({} as Rep)),
  ]);
  const data = {
    totals: { users: num(overview, 0, 0), sessions: num(overview, 0, 1), views: num(overview, 0, 2), engagementRate: num(overview, 0, 3), avgDuration: num(overview, 0, 4), keyEvents: num(overview, 0, 5) },
    series: (byDay.rows || []).map((r) => ({ date: `${r.dimensionValues![0].value.slice(0, 4)}-${r.dimensionValues![0].value.slice(4, 6)}-${r.dimensionValues![0].value.slice(6, 8)}`, users: +r.metricValues[0].value, sessions: +r.metricValues[1].value, views: +r.metricValues[2].value })),
    channels: rowsOf(channels), countries: rowsOf(countries), devices: rowsOf(devices), pages: rowsOf(pages),
    realtime: num(realtime, 0, 0),
  };
  cache.set(days, { at: Date.now(), data });
  return data;
}
