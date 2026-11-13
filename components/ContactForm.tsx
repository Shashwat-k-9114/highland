'use client';
import { useRef, useState } from 'react';
import { COUNTRY_CODES } from '@/lib/site';
import { emailOk, nameOk, phoneOk } from '@/lib/validate';
import { newPassNo, submitLead } from '@/lib/lead-client';
import { openLead, track } from '@/lib/track';

type Errs = Partial<Record<'name' | 'email' | 'phone' | 'consent', boolean>>;

/** Inline contact form: name, email, phone only. On success it opens the Investor Pass. */
export default function ContactForm() {
  const [v, setV] = useState({ name: '', email: '', cc: '+91', phone: '', consent: false });
  const [err, setErr] = useState<Errs>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const started = useRef(false);
  const hp = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof v, val: string | boolean) => {
    if (!started.current) { started.current = true; track('form_start', { form: 'contact' }); }
    setV((p) => ({ ...p, [k]: val }));
    setErr((p) => ({ ...p, [k]: false }));
    setMsg('');
  };
  const digits = v.phone.replace(/\D/g, '');
  const ok = { name: nameOk(v.name), email: emailOk(v.email), phone: phoneOk(v.cc, digits) };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const next: Errs = { name: !ok.name, email: !ok.email, phone: !ok.phone, consent: !v.consent };
    setErr(next);
    if (Object.values(next).some(Boolean)) { (e.currentTarget as HTMLFormElement).querySelector('.invalid, .consent.invalid')?.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
    setBusy(true); setMsg('');
    try {
      const passNo = newPassNo();
      await submitLead(v, 'Contact form', passNo, hp.current?.value);
      window.__hcLead = { name: v.name.trim(), phone: v.cc + digits, email: v.email.trim(), passNo };
      track('generate_lead', { source: 'contact_form' });
      openLead({ start: 'done' });
      setV({ name: '', email: '', cc: v.cc, phone: '', consent: false });
    } catch (x) {
      setMsg(x instanceof Error ? x.message : 'Please try again.');
    }
    setBusy(false);
  }

  const cls = (k: 'name' | 'email' | 'phone') => `field${err[k] ? ' invalid' : ''}${!err[k] && ok[k] && v[k].length ? ' ok' : ''}`;
  return (
    <form className="lead" id="leadForm" noValidate onSubmit={onSubmit} aria-label="Request investment information">
      <div className="grid2">
        <div className={cls('name')}><input id="f-name" name="name" type="text" placeholder=" " autoComplete="name" maxLength={80} value={v.name} onChange={(e) => set('name', e.target.value)} aria-invalid={!!err.name} /><label htmlFor="f-name">Full Name</label><span className="err">Required</span></div>
        <div className={cls('email')}><input id="f-email" name="email" type="email" placeholder=" " autoComplete="email" maxLength={160} value={v.email} onChange={(e) => set('email', e.target.value)} aria-invalid={!!err.email} /><label htmlFor="f-email">Email Address</label><span className="err">Check email</span></div>
        <div className="phone grid-full">
          <div className="field"><select id="f-cc" className="has-value" name="cc" autoComplete="tel-country-code" value={v.cc} onChange={(e) => set('cc', e.target.value)}>{COUNTRY_CODES.map(([c, n]) => <option key={c} value={c}>{n} {c}</option>)}</select><label htmlFor="f-cc">Code</label></div>
          <div className={cls('phone')}><input id="f-phone" name="phone" type="tel" inputMode="numeric" placeholder=" " autoComplete="tel-national" maxLength={16} value={v.phone} onChange={(e) => set('phone', e.target.value.replace(/[^\d\s]/g, ''))} aria-invalid={!!err.phone} /><label htmlFor="f-phone">Phone Number</label><span className="err">Check number</span></div>
        </div>
      </div>
      <input ref={hp} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: -9999, opacity: 0 }} />
      <label className={`consent${err.consent ? ' invalid' : ''}`}><input type="checkbox" checked={v.consent} onChange={(e) => set('consent', e.target.checked)} /><span>I agree to be contacted by phone, WhatsApp and email about investment opportunities, and accept the <a href="/privacy" target="_blank" rel="noopener" className="link" onClick={(e) => e.stopPropagation()}>privacy policy</a>.</span></label>
      <button type="submit" className="btn btn--gold submit" data-magnetic disabled={busy}><span className="submit__t">{busy ? 'Sending…' : 'Request investment information'}</span> <i className="arr" /></button>
      <p className="xerr" role="alert" style={{ textAlign: 'center', marginTop: 12 }}>{msg}</p>
      <p className="form-note">🔒 Confidential · No obligation · Reply within one business day</p>
    </form>
  );
}
