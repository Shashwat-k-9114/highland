/** Shared (client + server) lead validation. The form only asks for name, email and phone. */

export const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) && v.length <= 160;

/** `cc` like "+91"; `digits` is the national number without punctuation. */
export const phoneOk = (cc: string, digits: string) => (cc === '+91' ? /^[6-9]\d{9}$/.test(digits) : digits.length >= 7 && digits.length <= 13);

export const nameOk = (v: string) => v.trim().length >= 2 && v.trim().length <= 80;

export type LeadInput = {
  name: string;
  email: string;
  phone: string; // E.164-ish: +<cc><digits>
  consent: boolean;
  passNo?: string;
  source?: string;
  page?: string;
  referrer?: string;
  utm?: Record<string, string>;
  vid?: string;
  hp?: string;
  intent?: string;
  company?: string;
  investorCity?: string;
};

export function parseLead(raw: unknown): { ok: true; lead: LeadInput } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object') return { ok: false, error: 'Invalid request' };
  const r = raw as Record<string, unknown>;
  const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const url = (x: unknown) => { try { const u = new URL(String(x)); return u.protocol === 'http:' || u.protocol === 'https:' ? u.toString().slice(0, 300) : ''; } catch { return ''; } };
  const name = str(r.name, 80).replace(/[<>]/g, '');
  const email = str(r.email, 160).toLowerCase();
  const phone = str(r.phone, 24).replace(/[^\d+]/g, '');
  if (!nameOk(name)) return { ok: false, error: 'Please enter your name' };
  if (!emailOk(email)) return { ok: false, error: 'Please enter a valid email' };
  const m = phone.match(/^\+(\d{1,4})(\d{6,14})$/);
  if (!m) return { ok: false, error: 'Please enter a valid phone number' };
  if (r.consent !== true) return { ok: false, error: 'Consent is required' };
  const utm: Record<string, string> = {};
  if (r.utm && typeof r.utm === 'object') {
    for (const [k, v] of Object.entries(r.utm as Record<string, unknown>)) {
      if (/^(utm_[a-z_]+|gclid|fbclid)$/.test(k) && typeof v === 'string') utm[k] = v.slice(0, 120);
    }
  }
  return {
    ok: true,
    lead: {
      name, email, phone, consent: true,
      passNo: str(r.passNo, 24),
      source: str(r.source, 60) || 'Website',
      page: url(r.page),
      referrer: url(r.referrer),
      utm,
      vid: str(r.vid, 40),
      hp: str(r.hp, 40),
      intent: str(r.intent, 60),
      company: str(r.company, 80).replace(/[<>]/g, ''),
      investorCity: str(r.investorCity, 40).replace(/[<>]/g, ''),
    },
  };
}
