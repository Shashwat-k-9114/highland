/** Client-side tracking: GA4 + Meta Pixel (if configured) + first-party analytics beacon (feeds the admin dashboard). */

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...a: unknown[]) => void;
    fbq?: (...a: unknown[]) => void;
    __hcOpen?: (o?: { start?: 'form' | 'done' }) => void;
    __hcPending?: boolean;
    __hcLenis?: { stop(): void; start(): void; scrollTo(t: number | Element, o?: object): void };
    __hcLead?: { name: string; phone: string; email: string; passNo: string };
  }
}

const safe = <T,>(f: () => T, d: T): T => { try { return f(); } catch { return d; } };

export const visitorId = () => safe(() => {
  let v = localStorage.getItem('hc_vid');
  if (!v) { v = (crypto.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36)).replace(/-/g, '').slice(0, 24); localStorage.setItem('hc_vid', v); }
  return v;
}, '');

export const sessionId = () => safe(() => {
  let s = sessionStorage.getItem('hc_sid');
  if (!s) { s = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem('hc_sid', s); }
  return s;
}, '');

export const utmParams = (): Record<string, string> => {
  const o: Record<string, string> = {};
  new URLSearchParams(location.search).forEach((v, k) => { if (/^(utm_[a-z_]+|gclid|fbclid)$/.test(k)) o[k] = v.slice(0, 120); });
  return o;
};

const beacon = (body: object) => {
  if (navigator.doNotTrack === '1') return;
  const data = JSON.stringify(body);
  if (!(navigator.sendBeacon && navigator.sendBeacon('/api/track', data))) fetch('/api/track', { method: 'POST', body: data, keepalive: true }).catch(() => {});
};

export function pageview() {
  const u = utmParams();
  beacon({ t: 'pv', path: location.pathname, vid: visitorId(), sid: sessionId(), ref: document.referrer, us: u.utm_source, um: u.utm_medium, gc: !!u.gclid });
}

export function track(name: string, params: Params = {}) {
  window.gtag?.('event', name, params);
  if (window.fbq) {
    if (name === 'generate_lead') window.fbq('track', 'Lead');
    else if (name === 'whatsapp_click' || name === 'call_click') window.fbq('track', 'Contact');
    else window.fbq('trackCustom', name, params);
  }
  beacon({ t: 'ev', name, path: location.pathname, sid: sessionId() });
}

/** Ask the (lazy-loaded) lead popup to open. */
export function openLead(opts?: { start?: 'form' | 'done' }) {
  if (window.__hcOpen) window.__hcOpen(opts);
  else { window.__hcPending = true; window.dispatchEvent(new Event('hc:load-popup')); }
}
