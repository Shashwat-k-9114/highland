import Link from 'next/link';
import { NAV, SITE, telLink, waLink } from '@/lib/site';

export function Sprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs><linearGradient id="g-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f1ddb5" /><stop offset=".5" stopColor="#b8925a" /><stop offset="1" stopColor="#7f6232" /></linearGradient></defs>
      <symbol id="i-mark" viewBox="0 0 40 40"><rect x="1" y="1" width="38" height="38" rx="2" fill="none" stroke="url(#g-gold)" strokeWidth="1" /><path d="M6 31 L15 17 L20 24 L26 12 L34 31" fill="none" stroke="url(#g-gold)" strokeWidth="1.4" strokeLinejoin="round" /><path d="M12 31V22M28 31V18" stroke="url(#g-gold)" strokeWidth="1" /><path d="M12 26.5H28" stroke="url(#g-gold)" strokeWidth="1" /></symbol>
      <symbol id="i-wa" viewBox="0 0 24 24"><path fill="#25D366" d="M12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.8 1 3.8 1.5 5.8 1.5 6.6 0 12-5.4 12-12S18.6 0 12 0zm0 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2S21.8 6.6 21.8 12 17.4 21.8 12 21.8zm5.5-7.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.4-1.5-.9-.8-1.5-1.8-1.6-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4z" /></symbol>
      <symbol id="i-check" viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></symbol>
    </svg>
  );
}

export function Nav() {
  return (
    <header className="nav" id="nav">
      <Link href="/" className="brand" aria-label={`${SITE.name}, home`}>
        <svg aria-hidden="true"><use href="#i-mark" /></svg>
        <span><b>HIGHLAND</b><small>CAPITALS · DUBAI</small></span>
      </Link>
      <nav className="nav__links" aria-label="Primary">
        {NAV.map((n) => <a key={n.spy} href={`/${n.href}`} data-spy={n.spy}>{n.label}</a>)}
      </nav>
      <div className="nav__right">
        <button type="button" className="btn btn--sm btn--gold" data-xp>Request a consultation</button>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="footer__big" aria-hidden="true" style={{ fontFamily: 'var(--display)', letterSpacing: '.1em', fontWeight: 400 }}>HIGHLAND</div>
      <p className="footer__sub">CAPITALS · COMMERCIAL REAL ESTATE ADVISORY · DUBAI</p>
      <div className="footer__row">
        <div><h2>Dubai</h2><p>{SITE.address}<br />Dubai, United Arab Emirates</p></div>
        <div><h2>India</h2><p>{SITE.indiaOffice}<br /><a href={telLink()} data-call>Call</a> · <a href={waLink()} data-wa target="_blank" rel="noopener">WhatsApp</a></p></div>
        <div><h2>Explore</h2><p><a href="/#about">About Us</a><br /><a href="/#opportunities">Investment Opportunities</a><br /><a href="/#locations">Locations</a><br /><a href="/#contact">Contact</a></p></div>
        <div><h2>Begin</h2><p><button type="button" data-xp className="link">Request a consultation →</button></p></div>
      </div>
      <p className="disclaimer">{SITE.name} provides investment advisory information only; this website does not constitute an offer, solicitation or investment advice. Real estate values and rental income can fall as well as rise. The development described is a proposed concept; details, specifications and timelines are subject to change and confirmation. Payment plans vary by project and are confirmed at booking. D33 figures are published government targets. Remittances by Indian residents are subject to RBI/FEMA regulations and Indian tax law; this is information only, not tax or legal advice. Photography: Unsplash. Footage: Pexels. Imagery is illustrative. {SITE.registration}</p>
      <div className="legal"><span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span><span><Link href="/privacy">Privacy</Link> · <Link href="/terms">Terms</Link></span></div>
    </footer>
  );
}

export function FloatingContact() {
  return (
    <>
      <a href={waLink()} className="wa-float" data-wa target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-wa" /></svg></a>
      <nav className="mbar" aria-label="Quick contact">
        <a href={telLink()} data-call><svg viewBox="0 0 24 24" fill="none" stroke="#9f7d48" strokeWidth="1.4" aria-hidden="true"><path d="M5 3h4l2 5-2.5 1.5a11 11 0 005 5L15 12l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2" /></svg>Call</a>
        <a href={waLink()} data-wa target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-wa" /></svg>WhatsApp</a>
        <button type="button" data-xp>Enquire</button>
      </nav>
    </>
  );
}
