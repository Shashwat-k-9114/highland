'use client';
import { useRef, useState } from 'react';
import { BUDGETS, COUNTRY_CODES } from '@/lib/site';
import { nameOk, phoneOk } from '@/lib/validate';
import { newPassNo, submitLead } from '@/lib/lead-client';
import { openLead, track } from '@/lib/track';

type Errs = Partial<Record<'name' | 'phone' | 'city' | 'budget' | 'consent', boolean>>;

/** Final enquiry form: full name, mobile / WhatsApp, city of residence, investment budget. */
export default function EnquiryForm() {
  const [v, setV] = useState({ name: '', cc: '+971', phone: '', city: '', budget: '', consent: false });
  const [err, setErr] = useState<Errs>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const started = useRef(false);
  const hp = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof v, val: string | boolean) => {
    if (!started.current) { started.current = true; track('form_start', { form: 'enquiry' }); }
    setV((p) => ({ ...p, [k]: val }));
    setErr((p) => ({ ...p, [k]: false }));
    setMsg('');
  };
  const digits = v.phone.replace(/\D/g, '');
  const ok = { name: nameOk(v.name), phone: phoneOk(v.cc, digits), city: v.city.trim().length >= 2, budget: !!v.budget };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const next: Errs = { name: !ok.name, phone: !ok.phone, city: !ok.city, budget: !ok.budget, consent: !v.consent };
    setErr(next);
    if (Object.values(next).some(Boolean)) { (e.currentTarget as HTMLFormElement).querySelector('.invalid')?.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
    setBusy(true); setMsg('');
    try {
      const passNo = newPassNo();
      await submitLead({ name: v.name, email: '', cc: v.cc, phone: v.phone, consent: true, intent: 'Request investment brief', investorCity: v.city.trim(), budget: v.budget }, 'Enquiry form', passNo, hp.current?.value);
      window.__hcLead = { name: v.name.trim(), phone: v.cc + digits, email: '', passNo };
      track('generate_lead', { source: 'enquiry_form' });
      openLead({ start: 'done' });
      setV({ name: '', cc: v.cc, phone: '', city: '', budget: '', consent: false });
    } catch (x) {
      setMsg(x instanceof Error ? x.message : 'Please try again.');
    }
    setBusy(false);
  }

  const cls = (k: 'name' | 'phone' | 'city') => `field${err[k] ? ' invalid' : ''}${!err[k] && ok[k] && v[k].length ? ' ok' : ''}`;
  return (
    <form className="lead" id="leadForm" noValidate onSubmit={onSubmit} aria-label="Request the investment brief">
      <div className="grid2">
        <div className={`${cls('name')} grid-full`}><input id="f-name" name="name" type="text" placeholder=" " autoComplete="name" maxLength={80} value={v.name} onChange={(e) => set('name', e.target.value)} aria-invalid={!!err.name} /><label htmlFor="f-name">Full name</label><span className="err">Required</span></div>
        <div className="phone grid-full">
          <div className="field"><select id="f-cc" className="has-value" name="cc" autoComplete="tel-country-code" value={v.cc} onChange={(e) => set('cc', e.target.value)}>{COUNTRY_CODES.map(([c, n]) => <option key={c} value={c}>{n} {c}</option>)}</select><label htmlFor="f-cc">Code</label></div>
          <div className={cls('phone')}><input id="f-phone" name="phone" type="tel" inputMode="numeric" placeholder=" " autoComplete="tel-national" maxLength={16} value={v.phone} onChange={(e) => set('phone', e.target.value.replace(/[^\d\s]/g, ''))} aria-invalid={!!err.phone} /><label htmlFor="f-phone">Mobile / WhatsApp number</label><span className="err">Check number</span></div>
        </div>
        <div className={cls('city')}><input id="f-city" name="city" type="text" placeholder=" " autoComplete="address-level2" maxLength={40} value={v.city} onChange={(e) => set('city', e.target.value)} aria-invalid={!!err.city} /><label htmlFor="f-city">City of residence</label><span className="err">Required</span></div>
        <div className={`field${err.budget ? ' invalid' : ''}${ok.budget ? ' ok' : ''}`}><select id="f-budget" className={v.budget ? 'has-value' : ''} name="budget" value={v.budget} onChange={(e) => set('budget', e.target.value)} aria-invalid={!!err.budget}><option value="" disabled hidden></option>{BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}</select><label htmlFor="f-budget">Investment budget</label><span className="err">Select a range</span></div>
      </div>
      <input ref={hp} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: -9999, opacity: 0 }} />
      <label className={`consent${err.consent ? ' invalid' : ''}`}><input type="checkbox" checked={v.consent} onChange={(e) => set('consent', e.target.checked)} /><span>I agree to be contacted by phone, WhatsApp and email about this investment, and accept the <a href="/privacy" target="_blank" rel="noopener" className="link" onClick={(e) => e.stopPropagation()}>privacy policy</a>.</span></label>
      <button type="submit" className="btn btn--gold submit" data-magnetic disabled={busy}><span className="submit__t">{busy ? 'Sending…' : 'Request Investment Brief'}</span> <i className="arr" /></button>
      <p className="xerr" role="alert" style={{ textAlign: 'center', marginTop: 12 }}>{msg}</p>
      <p className="form-note">🔒 Confidential · No obligation</p>
    </form>
  );
}
