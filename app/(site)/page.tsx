import Image from 'next/image';
import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import FaqList from '@/components/FaqList';
import HeroReel from '@/components/HeroReel';
import Photo from '@/components/Photo';
import VideoBg from '@/components/VideoBg';
import { homeJsonLd, jsonLdString } from '@/lib/jsonld';
import { BAND_VIDEO, COMPONENTS, FAQS, INDIA_ITEMS, JA_D33_PILLARS, JA_INFRA_NEEDS, JA_LOCATION_FACTS, JA_MOBILITY, JA_RENT_GROWTH, LOCATIONS, PHOTOS, PLAN_ITEMS, STATS, telLink, unsplash, waLink } from '@/lib/site';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const Arr = () => <i className="arr" />;
const Cta = ({ children, ...p }: { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button type="button" className="btn btn--gold" data-xp data-magnetic {...p}>{children} <Arr /></button>
);

export default function Home() {
  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(homeJsonLd()) }} />

      {/* HERO */}
      <section className="hero on-dark" id="top" aria-labelledby="hero-title">
        <div className="hero__frame" id="heroFrame"><HeroReel /><div className="hero__shade" /></div>
        <div className="hero__grid">
          <div className="hero__copy" id="heroContent">
            <span className="tag h-in">Dubai 2033. Invest in What&apos;s Next.</span>
            <h1 className="d1 hero__title" id="hero-title"><span className="line"><span>A New-Age Commercial</span></span><span className="line"><span><span className="c">Investment Opportunity.</span></span></span></h1>
            <p className="lede h-in">Explore a proposed commercial development bringing together EV infrastructure, industrial facilities, hospitality and business conveniences in Dubai.</p>
          </div>
          <aside className="hcard h-in" id="heroCard" aria-label="Project enquiry">
            <div className="hcard__head"><span className="hcard__live"><i />Project enquiry</span>
              <h2>Explore the <span className="c">development.</span></h2></div>
            <ul className="henq">
              {['View investment options.', 'Receive project specifications.', 'Request a consultation.'].map((t) => <li key={t}><i><svg aria-hidden="true"><use href="#i-check" /></svg></i><span>{t}</span></li>)}
            </ul>
            <button type="button" className="btn btn--gold btn--block hcard__go" data-xp data-magnetic>Request a consultation <Arr /></button>
            <p className="hcard__note"><span>✓ Free</span><span>✓ No obligation</span><span>✓ 30 seconds</span></p>
          </aside>
        </div>
        <div className="hero__scroll" aria-hidden="true" />
      </section>

      {/* ONE DESTINATION */}
      <section className="pad wrap section-light" id="opportunities" aria-labelledby="opp-title">
        <div className="head-row">
          <div><span className="tag reveal">( 01 ) &nbsp;Investment Opportunities</span>
            <h2 className="d2" id="opp-title" style={{ marginTop: 20 }}><span className="line"><span>One Destination.</span></span><span className="line"><span className="c">Multiple Commercial Opportunities.</span></span></h2></div>
          <p className="lede reveal">A proposed commercial development designed around the next generation of industrial and business requirements.</p>
        </div>
        <div className="ccards" id="compGrid">
          {COMPONENTS.map((c, i) => (
            <article className="ccard reveal" key={c.key}>
              {c.still
                ? <div className="kb"><Image src={c.still} alt={c.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw" quality={70} /></div>
                : <div className="vid"><Image className="vid__poster" src={unsplash(c.photo, 1400, 80)} alt={c.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw" quality={70} />{c.video && <VideoBg src={c.video.src} />}</div>}
              <div className="ccard__shade" />
              <span className="ccard__n">0{i + 1}</span><span className="ccard__tag">{c.tag}</span>
              <div className="ccard__body"><h3>{c.key}</h3><p>{c.pos}</p></div>
            </article>
          ))}
        </div>
        <p className="comp__end reveal">Discover a commercial development concept designed around Dubai&apos;s evolving business landscape.</p>
        <div className="reveal" style={{ textAlign: 'center', marginTop: 34 }}><Cta>Request a consultation</Cta></div>
      </section>

      {/* ABOUT */}
      <section className="pad wrap section-alt" id="about" aria-labelledby="about-title">
        <div className="about">
          <div>
            <span className="tag reveal">( 02 ) &nbsp;About Us</span>
            <h2 className="d2" id="about-title" style={{ marginTop: 20 }}><span className="line"><span>Beyond Real Estate.</span></span><span className="line"><span className="c">Into Dubai&apos;s Economic Future.</span></span></h2>
            <div className="reveal" style={{ marginTop: 28 }}>
              <p className="lede">Dubai is evolving into one of the world&apos;s most influential business and investment destinations.</p>
              <p className="lede" style={{ marginTop: 16 }}>With its D33 economic agenda targeting a doubling of the city&apos;s economy by 2033, the opportunities extend beyond residential property into commercial real estate, manufacturing, logistics, financial services and emerging industries.</p>
              <p className="lede" style={{ marginTop: 16 }}>At Highland Capitals, we help investors explore strategically located commercial properties aligned with Dubai&apos;s evolving business landscape.</p>
            </div>
          </div>
          <Photo as="figure" id={PHOTOS.about} alt="Burj Khalifa and the Downtown Dubai skyline" sizes="(max-width: 900px) 100vw, 50vw" par className="about__img reveal"><figcaption>Downtown Dubai</figcaption></Photo>
        </div>
        <div className="stats">
          {STATS.map((s) => (
            <div className="stat reveal" key={s.label}>
              <div className="stat__n">{s.prefix && <small>{s.prefix}</small>}<span data-count={s.count} data-dec={s.dec}>{s.count.toFixed(s.dec)}</span>{s.suffix && <sup>{s.suffix}</sup>}</div>
              <p className="stat__l">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="small reveal" style={{ marginTop: 20 }}>Source: Dubai Economic Agenda D33, Government of Dubai Media Office, Jan 2023. Government targets, not projections of investment returns.</p>
      </section>

      {/* DUBAI'S NEXT ECONOMIC CHAPTER */}
      <section className="band on-dark" id="future" aria-labelledby="future-title">
        <div className="vid"><Image className="vid__poster" src={unsplash(PHOTOS.about, 1800, 78)} alt="" fill sizes="100vw" quality={65} /><VideoBg src={BAND_VIDEO} /></div>
        <div className="band__shade" />
        <div className="band__in">
          <span className="tag reveal">( 03 ) &nbsp;The City Ahead</span>
          <h2 className="d2" id="future-title" style={{ marginTop: 20 }}><span className="line"><span>Dubai Is Building Its</span></span><span className="line"><span className="c">Next Economic Chapter.</span></span></h2>
          <p className="lede reveal">Dubai publishes its plans years in advance. Smart capital moves first. Our advisory starts there.</p>
          <div className="hl3">
            <div className="hl reveal"><svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="17" /><path d="M7 24h34M24 7c-6 5-6 29 0 34M24 7c6 5 6 29 0 34" /></svg><h3>Global trade and logistics.</h3></div>
            <div className="hl reveal"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M5 40V22l11 6V22l11 6V14h8v26z" /><path d="M5 40h38M39 14V7" /></svg><h3>Industrial and manufacturing growth.</h3></div>
            <div className="hl reveal"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M27 4 12 26h10l-3 18 17-24H26z" /></svg><h3>Technology and sustainable mobility.</h3></div>
          </div>
          <div className="reveal" style={{ marginTop: 34 }}><Cta>Find property near this growth</Cta></div>
        </div>
      </section>

      {/* JEBEL ALI: INFRASTRUCTURE CASE */}
      <section className="pad wrap section-alt" id="jebel-ali" aria-labelledby="ja-title">
        <div className="head-row">
          <div><span className="tag reveal">Highland Capitals · Jebel Ali</span>
            <h2 className="d2" id="ja-title" style={{ marginTop: 20 }}><span className="line"><span>Dubai is investing in its</span></span><span className="line"><span className="c">next decade of growth.</span></span></h2></div>
          <p className="lede reveal">Economic growth needs physical infrastructure. Dubai&apos;s non-oil economy is expanding across trade, logistics, construction, manufacturing and services.</p>
        </div>
        <div className="ja-stats">
          <div className="ja-stat reveal"><div className="ja-stat__n"><small>AED</small>99.5<sup>BN</sup></div><p>2026 Dubai government budget.</p></div>
          <div className="ja-stat reveal"><div className="ja-stat__n">48<sup>%</sup></div><p>of 2026 government expenditure is allocated to infrastructure, continuing Dubai&apos;s investment in the physical foundations of its future economy.</p></div>
          <div className="ja-stat reveal"><div className="ja-stat__n">77.5<sup>%</sup></div><p>of UAE real GDP came from non-oil activities in H1 2025. Non-oil GDP grew 5.7% year-on-year. A UAE-wide statistic, not Dubai-specific.</p></div>
        </div>
        <h3 className="ja-sub reveal">As these sectors grow, they require more than office space.</h3>
        <div className="ja-cards ja-cards--4">
          {JA_INFRA_NEEDS.map((c, i) => <div className="ja-card reveal" key={c.k}><i>0{i + 1}</i><h4>{c.k}</h4><p>{c.d}</p></div>)}
        </div>
        <p className="lede reveal" style={{ marginTop: 34, maxWidth: 720 }}>That is where income-generating industrial real estate comes in.</p>
        <p className="small reveal" style={{ marginTop: 18 }}>Sources: Government of Dubai 2026 budget; UAE Federal Competitiveness and Statistics Centre.</p>
      </section>

      {/* THE OPPORTUNITY: MOBILITY */}
      <section className="pad wrap section-light" id="mobility" aria-labelledby="mob-title">
        <div className="head-row">
          <div><span className="tag reveal">The Opportunity</span>
            <h2 className="d2" id="mob-title" style={{ marginTop: 20 }}><span className="line"><span>Mobility infrastructure is</span></span><span className="line"><span className="c">part of the economic conversation.</span></span></h2></div>
          <p className="lede reveal">As trade, transportation and industrial activity evolve, the infrastructure supporting the movement of goods and people also needs to evolve. The opportunity extends beyond charging points to the supporting ecosystem around mobility.</p>
        </div>
        <div className="ja-cards ja-cards--4">
          {JA_MOBILITY.map((c) => <div className="ja-card reveal" key={c.k}><svg viewBox="0 0 24 24" aria-hidden="true"><path d={c.icon} /></svg><h4>{c.k}</h4><p>{c.d}</p></div>)}
        </div>
      </section>

      {/* D33 CONNECTION */}
      <section className="pad wrap section-alt" id="d33" aria-labelledby="d33-title">
        <div className="head-row">
          <div><span className="tag reveal">Dubai Economic Agenda 2033</span>
            <h2 className="d2" id="d33-title" style={{ marginTop: 20 }}><span className="line"><span>Dubai is planning its next</span></span><span className="line"><span className="c">decade of economic growth.</span></span></h2></div>
          <p className="lede reveal">The D33 agenda aims to double the size of Dubai&apos;s economy by 2033 and strengthen its position among the world&apos;s leading global cities. Its priorities include expanding foreign trade, strengthening logistics, developing sustainable manufacturing and attracting investment.</p>
        </div>
        <div className="ja-cards ja-cards--4">
          {JA_D33_PILLARS.map((c, i) => <div className="ja-card reveal" key={c.k}><i>0{i + 1}</i><h4>{c.k}</h4><p>{c.d}</p></div>)}
        </div>
        <div className="ja-stat ja-stat--wide reveal"><div className="ja-stat__n"><small>AED</small>25.6<sup>trillion</sup></div><p>D33 target for foreign trade in goods and services over the next decade. An official D33 target, not a forecast of project revenue.</p></div>
      </section>

      {/* JEBEL ALI LOCATION + MARKET */}
      <section className="pad wrap section-light" id="jebel-location" aria-labelledby="jl-title">
        <div className="head-row">
          <div><span className="tag reveal">Key differentiator</span>
            <h2 className="d2" id="jl-title" style={{ marginTop: 20 }}><span className="line"><span>Location is not just an advantage.</span></span><span className="line"><span className="c">It is part of the investment case.</span></span></h2></div>
        </div>
        <div className="ja-cards ja-cards--3">
          {JA_LOCATION_FACTS.map((c) => <div className="ja-card reveal" key={c.k}><h4>{c.k}</h4><p>{c.d}</p></div>)}
        </div>
        <div className="ja-rent reveal">
          <span className="tag">Knight Frank · 2025 year-on-year industrial rental growth</span>
          <h3 className="d3">An established industrial market. Growing rental demand. Limited quality supply.</h3>
          <ul>
            {JA_RENT_GROWTH.map((r) => <li key={r.k}><span>{r.k}</span><b style={{ width: `${(r.v / 39) * 100}%` }}><em>+{r.v}%</em></b></li>)}
          </ul>
          <p className="small">Source: Knight Frank, UAE Industrial and Logistics Market Review 2025-26. Reported rental growth across selected Dubai industrial markets, not capital appreciation, investment yields or returns.</p>
        </div>
        <div className="ja-phase reveal">
          <div><span className="tag">Phase 1 · Initial development</span>
            <h3 className="d3">Be part of the first development phase.</h3>
            <p className="lede">An opportunity to evaluate participation at the initial stage of Highland Capitals&apos; Jebel Ali development. Phase 1 allocation, entry pricing, development stage and timeline are shared in the investment brief.</p></div>
          <Cta>Request the Phase 1 investment brief</Cta>
        </div>
      </section>

      {/* LOCATIONS */}
      <section className="pad wrap section-light" id="locations" aria-labelledby="loc-title">
        <div className="head-row">
          <div><span className="tag reveal">( 04 ) &nbsp;Investment Locations</span>
            <h2 className="d2" id="loc-title" style={{ marginTop: 20 }}><span className="line"><span>Six addresses.</span></span><span className="line"><span className="c">Six investment cases.</span></span></h2></div>
          <p className="lede reveal">From the financial centre to the port, each location answers a different brief. Pick yours, or ask us which one fits.</p>
        </div>
        <div className="locgrid" id="locGrid">
          {LOCATIONS.map((l, i) => (
            <article className="lcard reveal" key={l.key}>
              <Photo id={l.photo} alt={`${l.key}, Dubai`} sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw" w={1400} />
              <div className="lcard__top"><span>0{i + 1}</span><span>{l.tag}</span></div>
              <div className="lcard__body"><h3>{l.key}</h3><p className="lcard__prop">{l.prop}</p><p className="lcard__fact">{l.fact}</p>
                <div className="lcard__best">{l.best.map((b) => <span key={b}>{b}</span>)}</div>
                <button type="button" className="btn btn--glass" data-xp>Explore {l.key} <Arr /></button></div>
            </article>
          ))}
        </div>
        <div className="reveal" style={{ textAlign: 'center', marginTop: 44 }}><Cta>Not sure where? Let us advise</Cta></div>
      </section>

      {/* UNDERSTAND THE INVESTMENT */}
      <section className="pad wrap section-alt" id="plan" aria-labelledby="plan-title">
        <div className="split">
          <div>
            <span className="tag reveal">( 05 ) &nbsp;The Investment</span>
            <h2 className="d2" id="plan-title" style={{ marginTop: 20 }}><span className="line"><span>Understand the Investment</span></span><span className="line"><span className="c">Before You Decide.</span></span></h2>
            <div className="reveal" style={{ marginTop: 34 }}><Cta>Request Detailed Investment Information</Cta></div>
          </div>
          <ul className="clist">{PLAN_ITEMS.map((t, i) => <li className="reveal" key={t}><i>0{i + 1}</i><span>{t}</span></li>)}</ul>
        </div>
      </section>

      {/* INDIA */}
      <section className="pad wrap section-light" id="india" aria-labelledby="india-title">
        <div className="split">
          <div>
            <span className="tag reveal">( 06 ) &nbsp;Investing from India</span>
            <h2 className="d2" id="india-title" style={{ marginTop: 20 }}><span className="line"><span>Investing in Dubai</span></span><span className="line"><span className="c">from India.</span></span></h2>
            <p className="lede reveal" style={{ marginTop: 22 }}>Explore international commercial property investment with guidance on:</p>
            <div className="reveal" style={{ marginTop: 30 }}><Cta>Speak to an Investment Advisor</Cta></div>
          </div>
          <ul className="clist">{INDIA_ITEMS.map((t, i) => <li className="reveal" key={t}><i>0{i + 1}</i><span>{t}</span></li>)}</ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="pad wrap section-light" id="faq" aria-labelledby="faq-title">
        <div className="faq__grid">
          <div className="faq__side"><span className="tag reveal">Questions investors ask</span>
            <h2 className="d2" id="faq-title" style={{ marginTop: 20 }}><span className="line"><span>Clear answers,</span></span><span className="line"><span className="c">before you commit.</span></span></h2>
            <p className="lede reveal" style={{ marginTop: 20 }}>Anything else on your mind? Your advisor will answer it on the first call.</p>
            <div className="reveal" style={{ marginTop: 28 }}><Cta>Speak to an advisor</Cta></div></div>
          <FaqList items={FAQS} />
        </div>
      </section>

      {/* CONTACT */}
      <section className="pad wrap section-alt" id="contact" aria-labelledby="contact-title">
        <div className="panel contact__card reveal">
          <aside className="contact__aside on-dark">
            <Photo id={PHOTOS.contact} alt="" sizes="(max-width: 980px) 100vw, 45vw" par />
            <div><span className="tag">( 07 ) &nbsp;Take the next step</span>
              <h2 className="d2" id="contact-title" style={{ marginTop: 20, fontSize: 'clamp(36px,3.8vw,62px)' }}>Find Your Next Commercial Investment <span className="c">in Dubai.</span></h2>
              <p className="contact__urgency"><i className="pulse" />Project information sent within one business day</p>
              <p className="lede" style={{ marginTop: 14 }}>Explore the Highland Capitals Jebel Ali project and request information relevant to your requirements.</p></div>
            <ul className="contact__list"><li>Project specifications and investment options</li><li>Payment schedule and development timeline</li><li>Guidance on RBI/FEMA remittance for Indian investors</li><li>Strict discretion. Your details are never shared.</li></ul>
            <div className="contact__quick"><a href={waLink()} className="btn btn--glass btn--sm" data-wa target="_blank" rel="noopener"><svg className="wa-ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-wa" /></svg>WhatsApp</a><a href={telLink()} className="btn btn--glass btn--sm" data-call>Call us</a></div>
          </aside>
          <ContactForm />
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="closer on-dark" aria-label="Get started">
        <Photo id={PHOTOS.closer} alt="Dubai skyline at night" sizes="100vw" w={2200} />
        <div className="closer__shade" />
        <div className="closer__in wrap">
          <span className="tag reveal" style={{ justifyContent: 'center' }}>Dubai 2033. Invest in What&apos;s Next.</span>
          <h2 className="d2" style={{ marginTop: 20 }}><span className="line"><span>Discover what Dubai</span></span><span className="line"><span className="c">is building next.</span></span></h2>
          <p className="lede reveal">Thirty seconds now. Project information within one business day. No obligation, ever.</p>
          <div className="closer__ctas reveal"><Cta>Request a consultation</Cta><a href={waLink()} className="btn btn--glass" data-wa target="_blank" rel="noopener"><svg className="wa-ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-wa" /></svg>WhatsApp an advisor</a></div>
        </div>
      </section>
    </main>
  );
}
