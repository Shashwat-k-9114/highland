'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Photo from './Photo';
import { COUNTRY_CODES, PHOTOS, waLink } from '@/lib/site';
import { emailOk, nameOk, phoneOk } from '@/lib/validate';
import { newPassNo, submitLead } from '@/lib/lead-client';
import { track } from '@/lib/track';

type Step = 'form' | 'done';
type Errs = Partial<Record<'name' | 'phone' | 'email' | 'consent', boolean>>;

const POPUP_DELAY = 12000; // ms after page load before the invite opens (0 = never)
const POPUP_SCROLL = 0.45; // …or once the visitor has scrolled this far
const EXIT_INTENT = true;

const ss = {
  get: (k: string) => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { sessionStorage.setItem(k, v); } catch { /* private mode */ } },
};
const E_OUT = 'cubic-bezier(.16,1,.3,1)';
const E_INOUT = 'cubic-bezier(.87,0,.13,1)';

export default function LeadPopup() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('form');
  const [f, setF] = useState({ name: '', cc: '+91', phone: '', email: '', consent: false });
  const [err, setErr] = useState<Errs>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [passNo, setPassNo] = useState('');
  const [sent, setSent] = useState(false);
  const [pillOn, setPillOn] = useState(false);

  const xp = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const backdrop = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const pass = useRef<HTMLDivElement>(null);
  const burst = useRef<HTMLDivElement>(null);
  const passWrap = useRef<HTMLDivElement>(null);
  const nameIn = useRef<HTMLInputElement>(null);
  const hp = useRef<HTMLInputElement>(null);
  const opener = useRef<Element | null>(null);

  // Mutable mirror of state for long-lived listeners (timers, scroll, exit-intent).
  const S = useRef({ open: false, sent: false, heroUsed: false, autoCount: 0, lastClose: 0, heroVisible: true, started: false });
  const SMALL = () => matchMedia('(max-width: 820px)').matches;
  const REDUCED = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  const digits = f.phone.replace(/\D/g, '');
  const valid = { name: nameOk(f.name), phone: phoneOk(f.cc, digits), email: emailOk(f.email) };
  const allValid = valid.name && valid.phone && valid.email;
  const progress = sent ? 1 : ([valid.name, valid.phone, valid.email, f.consent].filter(Boolean).length / 4);
  const touched = !!(f.name || f.phone || f.email);
  S.current.sent = sent;
  S.current.started = touched;

  const updatePill = useCallback(() => {
    setPillOn(!S.current.heroVisible && !S.current.open && ss.get('hcPill') !== 'off');
  }, []);

  /* ── open / close ── */
  const openXP = useCallback((o?: { start?: 'form' | 'done' }) => {
    if (S.current.open) return;
    S.current.open = true;
    opener.current = document.activeElement;
    const lead = window.__hcLead;
    if (o?.start === 'done' && lead) {
      setF((p) => ({ ...p, name: lead.name, email: lead.email, phone: lead.phone.replace(/^\+\d{1,4}/, '') }));
      setPassNo(lead.passNo); setSent(true); S.current.sent = true; ss.set('hcXP', 'done'); setStep('done');
    } else {
      setPassNo((p) => p || newPassNo());
      setStep(S.current.sent ? 'done' : 'form');
    }
    setOpen(true);
    setPillOn(false);
    track('popup_open');
  }, []);

  const closeXP = useCallback(() => {
    if (!S.current.open) return;
    const fin = () => {
      S.current.open = false; S.current.lastClose = Date.now();
      if (!S.current.sent) ss.set('hcXP', 'dismissed');
      setOpen(false);
      document.body.classList.remove('locked');
      window.__hcLenis?.start();
      if (frame.current) frame.current.style.transform = '';
      (opener.current as HTMLElement | null)?.focus?.({ preventScroll: true });
      updatePill();
    };
    const fr = frame.current, bd = backdrop.current;
    if (REDUCED() || !fr || !bd) return fin();
    bd.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' });
    const a = SMALL()
      ? fr.animate([{ transform: fr.style.transform || 'none' }, { transform: 'translateY(100%)' }], { duration: 650, easing: 'cubic-bezier(.7,0,.84,0)', fill: 'forwards' })
      : fr.animate([{ clipPath: 'inset(0% 0% 0% 0% round 28px)', scale: 1 }, { clipPath: 'inset(50% 0% 50% 0% round 28px)', scale: 0.96 }], { duration: 800, easing: E_INOUT, fill: 'forwards' });
    a.onfinish = () => { fin(); a.cancel(); bd.getAnimations().forEach((x) => x.cancel()); };
  }, [updatePill]);

  // Public API for the rest of the site (buttons, contact form).
  useEffect(() => {
    window.__hcOpen = openXP;
    if (window.__hcPending) { window.__hcPending = false; openXP(window.__hcLead ? { start: 'done' } : undefined); }
    return () => { window.__hcOpen = undefined; };
  }, [openXP]);

  /* ── enter animation ── */
  useEffect(() => {
    if (!open) return;
    document.body.classList.add('locked');
    window.__hcLenis?.stop();
    const fr = frame.current, bd = backdrop.current, pw = passWrap.current;
    if (!REDUCED() && fr && bd && pw) {
      bd.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600 });
      if (SMALL()) fr.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], { duration: 1000, easing: E_OUT });
      else fr.animate([{ clipPath: 'inset(50% 0% 50% 0% round 28px)', scale: 0.96 }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', scale: 1 }], { duration: 1200, easing: E_INOUT });
      pw.animate([{ opacity: 0, transform: 'translateY(60px) rotateX(25deg)' }, { opacity: 1, transform: 'none' }], { duration: 1600, delay: 600, easing: E_OUT, fill: 'backwards' });
    }
    const t = setTimeout(() => { (step === 'form' ? nameIn.current : xp.current?.querySelector<HTMLElement>('[data-first]'))?.focus({ preventScroll: true }); }, 750);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* ── step change: content glides in; on success the pass flips ── */
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    if (!open || REDUCED()) return;
    body.current?.scrollTo({ top: 0 });
    xp.current?.querySelector('.step.on')?.animate([{ opacity: 0, transform: 'translateY(50px)', filter: 'blur(10px)' }, { opacity: 1, transform: 'none', filter: 'blur(0)' }], { duration: 900, delay: 250, easing: E_OUT, fill: 'backwards' });
    if (step === 'done') {
      pass.current?.animate([{ rotate: 'y -180deg' }, { rotate: 'y 0deg' }], { duration: 1600, delay: 300, easing: E_OUT });
      burst.current?.animate([{ opacity: 0, transform: 'scale(.4)' }, { opacity: 1, transform: 'scale(1.2)', offset: 0.28 }, { opacity: 0, transform: 'scale(1.2)' }], { duration: 1900, delay: 900, easing: 'ease-out' });
      pass.current?.classList.remove('flash'); void pass.current?.offsetWidth; pass.current?.classList.add('flash');
    }
  }, [step, open]);

  /* ── keyboard: Esc, focus trap ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!S.current.open) return;
      if (e.key === 'Escape') { closeXP(); return; }
      if (e.key !== 'Tab' || !frame.current) return;
      const els = [...frame.current.querySelectorAll<HTMLElement>('button,a[href],input,select,[tabindex]:not([tabindex="-1"])')].filter((x) => !x.hasAttribute('disabled') && x.offsetParent !== null);
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [closeXP]);

  /* ── sticky pill visibility + auto-invite ── */
  useEffect(() => {
    const hero = document.querySelector('.hero');
    let io: IntersectionObserver | undefined;
    if (hero) {
      io = new IntersectionObserver(([en]) => { S.current.heroVisible = en.isIntersecting; updatePill(); }, { threshold: 0.05 });
      io.observe(hero);
    }
    const already = () => ['done', 'dismissed'].includes(ss.get('hcXP') || '');
    const auto = () => { const s = S.current; if (s.open || s.sent || s.heroUsed || already()) return; s.autoCount++; openXP(); };
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (POPUP_DELAY > 0) timer = setTimeout(auto, Math.max(0, POPUP_DELAY - performance.now()));
    const onScroll = () => {
      const m = document.documentElement.scrollHeight - innerHeight;
      if (m > 0 && scrollY / m >= POPUP_SCROLL) { removeEventListener('scroll', onScroll); auto(); }
    };
    if (POPUP_SCROLL > 0) addEventListener('scroll', onScroll, { passive: true });
    const heroClick = (e: Event) => { if ((e.target as Element).closest?.('#heroCard')) { S.current.heroUsed = true; clearTimeout(timer); } };
    document.addEventListener('click', heroClick);
    const onOut = (e: MouseEvent) => {
      const s = S.current;
      if (e.relatedTarget || e.clientY > 4 || s.open || s.sent || s.autoCount >= 2 || Date.now() - s.lastClose < 20000 || ss.get('hcExit')) return;
      ss.set('hcExit', '1'); s.autoCount++; openXP();
    };
    if (EXIT_INTENT && matchMedia('(hover:hover)').matches) document.addEventListener('mouseout', onOut);
    return () => { io?.disconnect(); clearTimeout(timer); removeEventListener('scroll', onScroll); document.removeEventListener('click', heroClick); document.removeEventListener('mouseout', onOut); };
  }, [openXP, updatePill]);

  /* ── mobile bottom-bar label ── */
  useEffect(() => {
    const b = document.querySelector<HTMLElement>('.mbar button');
    if (!b) return;
    b.textContent = sent ? 'My Investor Pass' : touched ? 'Continue' : 'Enquire';
    b.classList.toggle('glow', !sent);
  }, [sent, touched]);

  /* ── pass tilt + swipe-to-close ── */
  useEffect(() => {
    const el = xp.current, fr = frame.current, bd = body.current;
    if (!el || !fr || !bd) return;
    const move = (e: PointerEvent) => {
      const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5, p = pass.current;
      if (!p) return;
      p.style.setProperty('--ry', (x * 16).toFixed(2) + 'deg'); p.style.setProperty('--rx', (-y * 12).toFixed(2) + 'deg'); p.style.setProperty('--sx', 45 + x * 60 + '%');
      el.style.setProperty('--lx', 60 + x * 20 + '%'); el.style.setProperty('--ly', 40 + y * 20 + '%');
    };
    let y0: number | null = null, dy = 0;
    const ts = (e: TouchEvent) => { y0 = (e.target as Element).closest('#xpHandle,.xp__top') || bd.scrollTop <= 0 ? e.touches[0].clientY : null; dy = 0; };
    const tm = (e: TouchEvent) => { if (y0 === null) return; dy = e.touches[0].clientY - y0; if (dy > 0 && SMALL()) fr.style.transform = `translateY(${dy * 0.6}px)`; };
    const te = () => { if (y0 === null) return; if (dy > 90 && SMALL()) closeXP(); else fr.style.transform = ''; y0 = null; };
    el.addEventListener('pointermove', move);
    fr.addEventListener('touchstart', ts, { passive: true }); fr.addEventListener('touchmove', tm, { passive: true }); fr.addEventListener('touchend', te);
    return () => { el.removeEventListener('pointermove', move); fr.removeEventListener('touchstart', ts); fr.removeEventListener('touchmove', tm); fr.removeEventListener('touchend', te); };
  }, [closeXP]);

  /* ── form ── */
  const set = (k: keyof typeof f, v: string | boolean) => { setF((p) => ({ ...p, [k]: v })); setErr((p) => ({ ...p, [k]: false })); setMsg(''); };
  const firstName = f.name.trim().split(/\s+/)[0] || '';

  async function submit() {
    if (busy) return;
    const next: Errs = { name: !valid.name, phone: !valid.phone, email: !valid.email, consent: !f.consent };
    setErr(next);
    if (Object.values(next).some(Boolean)) return;
    setBusy(true); setMsg('');
    try {
      await submitLead(f, 'Pop-up · Investor Pass', passNo, hp.current?.value);
      setSent(true); S.current.sent = true; ss.set('hcXP', 'done');
      track('generate_lead', { source: 'popup' });
      setStep('done');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Please try again.');
    }
    setBusy(false);
  }

  const phoneShown = f.phone ? `${f.cc} ${f.phone.trim()}` : '';
  const waHref = waLink(`Hello Highland Capitals, I'm ${f.name || 'a prospective investor'}, Investor Pass HC-${passNo}. Please share the project specifications.`);
  const cell = (v: string) => <b className={v ? '' : 'empty'}>{v || '·'}</b>;
  const pillTitle = sent ? 'Your Investor Pass' : touched ? 'Continue your enquiry' : 'Request project information';
  const pillSub = sent ? `HC-${passNo} · tap to view` : touched ? 'Almost done · tap to continue' : 'Free · no obligation · 30 seconds';
  const dots = [0, 1, 2, 3];
  const lit = (k: number) => progress >= [0.01, 0.5, 0.75, 1][k];

  return (
    <>
      <div className={`xp${open ? ' open' : ''}`} id="xp" ref={xp} role="dialog" aria-modal="true" aria-label="Get your Highland Investor Pass" aria-hidden={!open} data-lenis-prevent>
        <div className="xp__backdrop" ref={backdrop} onClick={closeXP} onWheel={closeXP} />
        <div className="xp__frame" ref={frame}>
          <div className="xp__handle" id="xpHandle" aria-hidden="true"><i /></div>
          <div className="xp__bg"><Photo id={PHOTOS.xp} alt="" sizes="(max-width: 980px) 100vw, 45vw" w={1600} /><div className="xp__shade" /><div className="xp__light" /></div>
          <div className="xp__top">
            <div className="brand"><svg aria-hidden="true"><use href="#i-mark" /></svg><span><b>HIGHLAND</b><small>CAPITALS · DUBAI</small></span></div>
            <div className="xp__time" aria-hidden="true"><span>2026</span>
              <div className="xp__track"><i style={{ transform: `scaleX(${progress})` }} />{dots.map((k) => <b key={k} className={lit(k) ? 'on' : ''} style={{ left: `${(k / 3) * 100}%` }} />)}</div>
              <span>2033</span></div>
            <button type="button" className="xp__close" onClick={closeXP} aria-label="Close and keep browsing"><span>Keep browsing</span> <i /></button>
          </div>
          <div className="xp__body" ref={body} data-lenis-prevent>
            <div className="xp__stage">
              {/* STEP: details */}
              <div className={`step${step === 'form' ? ' on' : ''}`} aria-hidden={step !== 'form'}>
                <span className="tag">Dubai 2033. Invest in What&apos;s Next.</span>
                <h2>Whose name should <span className="c">your pass carry?</span></h2>
                <p className="lede">Share your name, email and phone to receive your personal Highland Investor Pass. A senior advisor then sends the project specifications and options within one business day.</p>
                <form noValidate onSubmit={(e) => { e.preventDefault(); submit(); }}>
                  <div className={`xfield xfield--name${err.name ? ' invalid' : ''}`}><input ref={nameIn} id="xName" name="name" type="text" placeholder=" " autoComplete="name" maxLength={40} value={f.name} onChange={(e) => set('name', e.target.value)} /><label htmlFor="xName">Full name</label><span className="err">Please add your name</span></div>
                  <div className="xrow">
                    <div className="xfield"><select id="xCC" name="cc" autoComplete="tel-country-code" value={f.cc} onChange={(e) => set('cc', e.target.value)}>{COUNTRY_CODES.map(([c, n]) => <option key={c} value={c}>{n} {c}</option>)}</select><label htmlFor="xCC">Code</label></div>
                    <div className={`xfield${err.phone ? ' invalid' : ''}`}><input id="xPhone" name="phone" type="tel" inputMode="numeric" placeholder=" " autoComplete="tel-national" maxLength={16} value={f.phone} onChange={(e) => set('phone', e.target.value.replace(/[^\d\s]/g, ''))} /><label htmlFor="xPhone">Phone / WhatsApp</label><span className="err">Check the number</span></div>
                  </div>
                  <div className={`xfield${err.email ? ' invalid' : ''}`}><input id="xEmail" name="email" type="email" placeholder=" " autoComplete="email" maxLength={160} value={f.email} onChange={(e) => set('email', e.target.value)} /><label htmlFor="xEmail">Email address</label><span className="err">Check the email</span></div>
                  <input ref={hp} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: -9999, opacity: 0 }} />
                  <label className={`xcheck${err.consent ? ' invalid' : ''}`}><input type="checkbox" checked={f.consent} onChange={(e) => set('consent', e.target.checked)} /><span>Send my pass and have an advisor contact me by phone, WhatsApp or email. I accept the <a href="/privacy" target="_blank" rel="noopener" className="link">privacy policy</a>.</span></label>
                  <p className="xerr" role="alert">{msg}</p>
                  <div className="xnav"><button type="submit" className="btn btn--gold" disabled={busy}><span>{busy ? 'Preparing…' : 'Generate my Investor Pass'}</span> <i className="arr" /></button></div>
                  <p className="small" style={{ marginTop: 10 }}>Private and confidential. We never share your details.</p>
                </form>
              </div>
              {/* STEP: done */}
              <div className={`step${step === 'done' ? ' on' : ''}`} aria-hidden={step !== 'done'}>
                <span className="tag">Welcome to Highland</span>
                <h2>{firstName ? <>Welcome to Highland, <span className="c">{firstName}.</span></> : <>Your pass is <span className="c">live.</span></>}</h2>
                <p className="lede">Your Investor Pass is live. A senior advisor will contact you on {phoneShown || 'your phone'} within one business day with the project specifications and investment options.</p>
                <div className="xp__done-actions">
                  <a href={waHref} target="_blank" rel="noopener" className="btn btn--gold" data-wa data-first><svg className="wa-ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-wa" /></svg>Continue on WhatsApp</a>
                  <button type="button" className="btn" onClick={closeXP}>Keep exploring</button>
                </div>
                <p className="small" style={{ marginTop: 14 }}>Screenshot your pass and keep it for your consultation.</p>
              </div>
            </div>
            <div className="xp__pass" ref={passWrap}>
              <div>
                <div className="pass" ref={pass}>
                  <div className="burst" ref={burst} />
                  <div className="pass__top"><div className="pass__brand"><svg aria-hidden="true"><use href="#i-mark" /></svg><span><b>HIGHLAND</b><small>INVESTOR PASS · DUBAI 2033</small></span></div><div className="pass__chip" /></div>
                  <div className={`pass__name${f.name.trim() ? '' : ' ph'}`}>{f.name.trim() || 'Your name'}</div>
                  <div className="pass__grid">
                    <div><small>Phone</small>{cell(phoneShown)}</div>
                    <div className="wide"><small>Email</small>{cell(f.email.trim())}</div>
                    <div><small>Pack</small>{cell(allValid ? 'Specifications' : '')}</div>
                    <div><small>Advisor</small>{cell(sent ? 'Assigned' : '')}</div>
                    <div><small>Next</small>{cell(sent ? 'Consultation' : '')}</div>
                  </div>
                  <div className="pass__foot"><span>HC · {passNo || '······'}</span><span className="pass__gv yes">DUBAI 2033</span></div>
                </div>
                <p className="xp__passcap">{sent ? 'Screenshot your pass · Valid for your private consultation' : 'Your pass builds as you type'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`xp-pill${pillOn ? ' show' : ''}`} role="region" aria-label="Investor Pass">
        <button type="button" className="xp-pill__go" tabIndex={pillOn ? 0 : -1} onClick={() => openXP(sent && window.__hcLead ? { start: 'done' } : undefined)}>
          <span className="xp-pill__card" /><span><b>{pillTitle}</b><small>{pillSub}</small></span><i className="arr" />
        </button>
        <button type="button" className="xp-pill__x" tabIndex={pillOn ? 0 : -1} aria-label="Dismiss" onClick={() => { setPillOn(false); ss.set('hcPill', 'off'); }}>×</button>
      </div>
    </>
  );
}
