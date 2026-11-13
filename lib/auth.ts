/**
 * Admin authentication: one shared password (ADMIN_PASSWORD) -> HMAC-signed, expiring, HttpOnly cookie.
 * Uses Web Crypto only, so it runs in both the Node runtime and the Proxy.
 */
export const COOKIE = 'hc_admin';
export const SESSION_SECONDS = 60 * 60 * 12; // 12 h

const enc = new TextEncoder();
const b64u = (buf: ArrayBuffer | Uint8Array) => {
  const b = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = '';
  for (const x of b) s += String.fromCharCode(x);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const key = async (secret: string) => crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
const sign = async (secret: string, data: string) => b64u(await crypto.subtle.sign('HMAC', await key(secret), enc.encode(data)));

export const authConfigured = () => !!process.env.ADMIN_PASSWORD && (process.env.ADMIN_SECRET || '').length >= 16;

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

/** Compare via HMAC so the comparison is constant-length and constant-time. */
export async function passwordMatches(input: string): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET || '';
  const pw = process.env.ADMIN_PASSWORD || '';
  if (!secret || !pw) return false;
  return safeEqual(await sign(secret, 'pw:' + input), await sign(secret, 'pw:' + pw));
}

export async function createSession(): Promise<string> {
  const secret = process.env.ADMIN_SECRET || '';
  const payload = b64u(enc.encode(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS, n: crypto.randomUUID() })));
  return `${payload}.${await sign(secret, payload)}`;
}

export async function verifySession(token: string | undefined | null): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET || '';
  if (!token || !secret) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  if (!safeEqual(sig, await sign(secret, payload))) return false;
  try {
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof json.exp === 'number' && json.exp > Date.now() / 1000;
  } catch { return false; }
}

export async function isAdminRequest(req: Request): Promise<boolean> {
  const m = (req.headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  return verifySession(m?.[1]);
}
