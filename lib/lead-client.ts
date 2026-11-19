import { sessionId, track, utmParams, visitorId } from './track';

export type LeadForm = { name: string; cc: string; phone: string; email: string; consent: boolean; intent?: string; company?: string; investorCity?: string };

export const newPassNo = () => String(Math.floor(100000 + Math.random() * 900000));

/** Sends the lead to /api/lead. Resolves with the saved lead id; throws an Error with a user-friendly message. */
export async function submitLead(f: LeadForm, source: string, passNo: string, hp = ''): Promise<string> {
  const res = await fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: f.name.trim(), email: f.email.trim(), phone: f.cc + f.phone.replace(/\D/g, ''), consent: f.consent, intent: f.intent, company: f.company?.trim(), investorCity: f.investorCity,
      passNo: 'HC-' + passNo, source, page: location.href, referrer: document.referrer, utm: utmParams(), vid: visitorId(), sid: sessionId(), hp,
    }),
  });
  const j = (await res.json().catch(() => ({}))) as { ok?: boolean; id?: string; error?: string };
  if (!res.ok || !j.ok) throw new Error(j.error || 'Something went wrong. Please try again.');
  track('generate_lead_client', { source });
  return j.id || '';
}
