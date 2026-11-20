'use client';
import { useRef, useState } from 'react';
import { emailOk, nameOk, phoneOk } from '@/lib/validate';
import { newPassNo, submitLead } from '@/lib/lead-client';
import { openLead, track } from '@/lib/track';

type K = 'name' | 'email' | 'phone' | 'consent';

/** Three-field above-the-fold lead form for time-poor executives. Same pipeline as the contact form. */
export default function HeroForm({ source = 'Hero form' }: { source?: string }) {
  const [v, setV] = useState({ name: '', email: '', phone: '', consent: true });
  const [err, setErr] = useState<Partial<Record<K, boolean>>>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const started = useRef(false);
  const hp = useRef<HTMLInputElement>(null);
  const cc = '+971';

  const set = (k: keyof typeof v, val: string | boolean) => {
    if (!started.current) { started.current = true; track('form_start', { form: 'hero' }); }
    setV((p) => ({ ...p, [k]: val }));
    setErr((p) => ({ ...p, [k]: false }));
    setMsg('');
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const digits = v.phone.replace(/\D/g, '');
    const next = { name: !nameOk(v.name), email: !emailOk(v.email), phone: !(v.phone.startsWith('+') ? v.phone.replace(/\D/g, '').length >= 8 : phoneOk(cc, digits)), consent: !v.consent };
    setErr(next);
    if (Object.values(next).some(Boolean)) return;
    setBusy(true); setMsg('');
    try {
      const full = v.phone.trim().startsWith('+') ? '+' + digits : cc + digits;
      const passNo = newPassNo();
      await submitLead({ name: v.name, email: v.email, cc: '', phone: full, consent: true, intent: 'Request investment details' }, source, passNo, hp.current?.value);
      window.__hcLead = { name: v.name.trim(), phone: full, email: v.email.trim(), passNo };
      track('generate_lead', { source: 'hero_form' });
      openLead({ start: 'done' });
      setV({ name: '', email: '', phone: '', consent: true });
    } catch (x) {
      setMsg(x instanceof Error ? x.message : 'Please try again.');
    }
    setBusy(false);
  }

  return (
    <form className="hform" noValidate onSubmit={onSubmit} aria-label="Request the EV investment brief">
      <input type="text" name="name" aria-label="Full name" placeholder="Full name" autoComplete="name" maxLength={80} value={v.name} onChange={(e) => set('name', e.target.value)} aria-invalid={!!err.name} className={err.name ? 'bad' : ''} />
      <input type="tel" name="phone" aria-label="Phone or WhatsApp with country code" placeholder="Phone / WhatsApp (with country code)" autoComplete="tel" inputMode="tel" maxLength={18} value={v.phone} onChange={(e) => set('phone', e.target.value.replace(/[^\d\s+]/g, ''))} aria-invalid={!!err.phone} className={err.phone ? 'bad' : ''} />
      <input type="email" name="email" aria-label="Work email" placeholder="Work email" autoComplete="email" maxLength={160} value={v.email} onChange={(e) => set('email', e.target.value)} aria-invalid={!!err.email} className={err.email ? 'bad' : ''} />
      <input ref={hp} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: -9999, opacity: 0 }} />
      <button type="submit" className="btn btn--gold btn--block hcard__go" data-magnetic disabled={busy}>{busy ? 'Sending…' : 'Get the EV investment brief'} <i className="arr" /></button>
      <p className="hform__note" role="alert">{msg || <>By submitting you agree to be contacted about this investment and to our <a href="/privacy" target="_blank" rel="noopener" className="link">privacy policy</a>.</>}</p>
    </form>
  );
}
