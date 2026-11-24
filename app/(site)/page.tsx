import type { Metadata } from 'next';
import EnquiryForm from '@/components/EnquiryForm';
import FaqList from '@/components/FaqList';
import HeroForm from '@/components/HeroForm';
import HeroReel from '@/components/HeroReel';
import Photo from '@/components/Photo';
import VideoBg from '@/components/VideoBg';
import { homeJsonLd, jsonLdString } from '@/lib/jsonld';
import { EV_FACTS, EV_STATIONS, EV_WHY, FAQS, IN_BRIEF, JA_D33_PILLARS, JA_EV_POINTS, JA_HIGHLIGHTS, JA_MAP_LABELS, JA_SNAPSHOT, PHOTOS, telLink, waLink } from '@/lib/site';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const Arr = () => <i className="arr" />;
const Go = ({ href, children, tone = 'gold' }: { href: string; children: React.ReactNode; tone?: 'gold' | 'glass' }) => (
  <a href={href} className={`btn btn--${tone}`} data-magnetic>{children} <Arr /></a>
);

export default function Home() {
  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(homeJsonLd()) }} />

      {/* 01 HERO */}
      <section className="hero on-dark" id="top" aria-labelledby="hero-title">
        <div className="hero__frame" id="heroFrame"><HeroReel /><div className="hero__shade" /></div>
        <div className="hero__grid">
          <div className="hero__copy" id="heroContent">
            <span className="tag h-in">DUBAI · JEBEL ALI</span>
            <h1 className="d1 hero__title" id="hero-title"><span className="line"><span>Commercial Real Estate in Jebel Ali.</span></span><span className="line"><span><span className="c">Built for the Next Phase of Industry.</span></span></span></h1>
            <p className="lede h-in">Invest in commercial assets within one of Dubai&apos;s established industrial and trade districts, with EV-ready infrastructure designed for evolving business and logistics requirements.</p>
            <p className="hero__support h-in">Commercial ownership opportunities in Jebel Ali, Dubai.</p>
            <div className="hero__ctas h-in"><Go href="#investment-details">View Investment Details</Go></div>
          </div>
          <aside className="hcard h-in" id="heroCard" aria-label="Request the EV investment brief">
            <div className="hcard__head"><span className="hcard__live"><i />Phase 1 brief</span>
              <h2>See the EV station <span className="c">investment case.</span></h2></div>
            <p>Entry pricing, station economics and timeline. Sent within one business day.</p>
            <HeroForm />
          </aside>
        </div>
        <div className="hero__scroll" aria-hidden="true" />
      </section>

      {/* 02 THE INVESTMENT OPPORTUNITY */}
      <section className="pad wrap section-light" id="opportunity" aria-labelledby="opp-title">
        <div className="about">
          <div>
            <span className="tag reveal">( 02 ) &nbsp;The Investment Opportunity</span>
            <h2 className="d2" id="opp-title" style={{ marginTop: 20 }}><span className="line"><span>A Commercial Asset.</span></span><span className="line"><span className="c">A Strategic Location.</span></span></h2>
            <div className="reveal" style={{ marginTop: 28 }}>
              <p className="lede">Jebel Ali brings together industrial activity, international trade and logistics infrastructure within Dubai&apos;s commercial landscape.</p>
              <p className="lede" style={{ marginTop: 16 }}>Highland presents an opportunity to own commercial real estate in this established business district, with assets designed to serve the operational needs of modern businesses.</p>
              <p className="lede" style={{ marginTop: 16 }}>For investors, the proposition is straightforward: commercial property in a location connected to the movement of goods, businesses and capital.</p>
            </div>
          </div>
          <Photo as="figure" id={PHOTOS.about} alt="Dubai commercial and industrial skyline" sizes="(max-width: 900px) 100vw, 50vw" par className="about__img reveal"><figcaption>Dubai</figcaption></Photo>
        </div>
        <ul className="ja-points">
          {JA_HIGHLIGHTS.map((h, i) => (
            <li className="reveal" key={h.k}><i>0{i + 1}</i><b>{h.k}</b>{h.pending && <span>{IN_BRIEF}</span>}</li>
          ))}
        </ul>
      </section>

      {/* 03 LOCATION ADVANTAGE */}
      <section className="pad wrap section-alt" id="location" aria-labelledby="loc-title">
        <div className="split">
          <div>
            <span className="tag reveal">( 03 ) &nbsp;Location Advantage</span>
            <h2 className="d2" id="loc-title" style={{ marginTop: 20 }}><span className="line"><span>Jebel Ali Is More Than</span></span><span className="line"><span className="c">a Business Address.</span></span></h2>
            <div className="reveal" style={{ marginTop: 28 }}>
              <p className="lede">Jebel Ali sits at the intersection of Dubai&apos;s industrial, logistics and international trade networks.</p>
              <p className="lede" style={{ marginTop: 16 }}>Its commercial relevance is supported by proximity to major infrastructure, including Jebel Ali Port, JAFZA and Al Maktoum International Airport.</p>
              <p className="lede" style={{ marginTop: 16 }}>For businesses operating across regional and international markets, location is an operational consideration. For commercial property investors, it is a key factor in evaluating long-term asset demand.</p>
            </div>
          </div>
          <figure className="ja-map reveal" aria-label="Indicative location diagram: Jebel Ali Port, JAFZA, Al Maktoum International Airport and the project location">
            <svg viewBox="0 0 400 300" role="img" aria-hidden="true">
              <path className="ja-map__sea" d="M0 0h400v70c-60 22-120-16-190 6S70 70 0 52z" />
              <path className="ja-map__link" d="M95 112 200 176M305 112 200 176M200 176v68" />
              <circle className="ja-map__n" cx="95" cy="112" r="9" /><circle className="ja-map__n" cx="305" cy="112" r="9" />
              <circle className="ja-map__pulse" cx="200" cy="176" r="20" /><circle className="ja-map__me" cx="200" cy="176" r="10" />
            </svg>
            <span className="ja-map__l" style={{ left: '24%', top: '30%' }}>{JA_MAP_LABELS[0]}</span>
            <span className="ja-map__l" style={{ left: '76%', top: '30%' }}>{JA_MAP_LABELS[1]}</span>
            <span className="ja-map__l ja-map__l--me" style={{ left: '50%', top: '51%' }}>{JA_MAP_LABELS[3]}</span>
            <span className="ja-map__l" style={{ left: '50%', top: '85%' }}>{JA_MAP_LABELS[2]}</span>
            <figcaption>Indicative diagram, not to scale. Verified distances and travel times are shared in the investment brief.</figcaption>
          </figure>
        </div>
      </section>

      {/* 04 EV-READY INFRASTRUCTURE */}
      <section className="pad wrap section-light" id="ev-ready" aria-labelledby="ev-title">
        <div className="head-row">
          <div><span className="tag reveal">( 04 ) &nbsp;EV-Ready Infrastructure</span>
            <h2 className="d2" id="ev-title" style={{ marginTop: 20 }}><span className="line"><span>Commercial Property Designed</span></span><span className="line"><span className="c">Around the EV Economy.</span></span></h2></div>
          <div className="reveal">
            <p className="lede">As electric mobility expands across logistics, fleet operations and commercial transportation, infrastructure requirements are changing.</p>
            <p className="lede" style={{ marginTop: 16 }}>Highland&apos;s Jebel Ali project incorporates EV-ready infrastructure to support the evolving needs of businesses operating in this sector.</p>
            <p className="lede" style={{ marginTop: 16 }}>This adds a practical dimension to the investment: commercial space designed with the infrastructure requirements of tomorrow&apos;s business operations in mind.</p>
          </div>
        </div>
        <div className="evstrip reveal">
          {[['/videos/ev3', 'EV charging'], ['/videos/ev2', 'Fleet-ready power'], ['/videos/ev4', 'Always-on network']].map(([src, cap]) => (
            <figure key={src}><div className="vid"><VideoBg src={src} /></div><figcaption>{cap}</figcaption></figure>
          ))}
        </div>
        <ul className="ja-points">
          {JA_EV_POINTS.map((h, i) => (
            <li className="reveal" key={h.k}><i>0{i + 1}</i><b>{h.k}</b>{h.pending && <span>{IN_BRIEF}</span>}</li>
          ))}
        </ul>
      </section>

      {/* EV x DUBAI */}
      <section className="pad wrap section-light" id="ev" aria-labelledby="evx-title">
        <div className="head-row">
          <div><span className="tag reveal">EV × Dubai</span>
            <h2 className="d2" id="evx-title" style={{ marginTop: 20 }}><span className="line"><span>The demand is here.</span></span><span className="line"><span className="c">The infrastructure is the opportunity.</span></span></h2></div>
          <p className="lede reveal">Dubai is adding charge points at record pace to meet policy targets and fleet electrification. Highland Capitals is developing multiple EV stations to serve it, each backed by real estate and on-site income.</p>
        </div>
        <div className="stats evfacts">
          {EV_FACTS.map((f) => (
            <div className="stat reveal" key={f.label}>
              <div className="stat__n"><span data-count={f.n} data-dec={0}>{f.n.toLocaleString("en-US")}</span><sup>{f.suffix}</sup></div>
              <p className="stat__l">{f.label}</p>
              <p className="small" style={{ marginTop: 8 }}>{f.src}</p>
            </div>
          ))}
        </div>
        <div className="ja-cards ja-cards--4" style={{ marginTop: 56 }}>
          {EV_WHY.map((c, i) => <div className="ja-card reveal" key={c.k}><i>0{i + 1}</i><h4>{c.k}</h4><p>{c.d}</p></div>)}
        </div>
        <h3 className="ja-sub reveal">A network, not a single site.</h3>
        <div className="evnet">
          {EV_STATIONS.map((s) => (
            <div className="evnet__s reveal" key={s.k}><span className="evnet__dot" /><small>{s.k} · {s.s}</small><h4>{s.t}</h4><p>{s.d}</p></div>
          ))}
        </div>
        <p className="small reveal" style={{ marginTop: 18 }}>Station locations are indicative and subject to site confirmation, approvals and DEWA licensing. Sources: DEWA; Dubai Media Office; Arthur D. Little; Dubai Green Mobility Strategy 2030.</p>
        <div className="reveal" style={{ textAlign: 'center', marginTop: 40 }}><Go href="#enquiry">Get the EV investment brief</Go></div>
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

      {/* 05 COMMERCIAL INVESTMENT DETAILS */}
      <section className="pad wrap section-alt" id="investment-details" aria-labelledby="det-title">
        <div className="head-row">
          <div><span className="tag reveal">( 05 ) &nbsp;Commercial Investment Details</span>
            <h2 className="d2" id="det-title" style={{ marginTop: 20 }}><span className="line"><span>Evaluate the Asset.</span></span><span className="line"><span className="c">Understand the Investment.</span></span></h2></div>
          <div className="reveal">
            <p className="lede">A commercial property investment should be evaluated through its fundamentals: asset specifications, acquisition cost, ownership structure and income potential.</p>
            <p className="lede" style={{ marginTop: 16 }}>Explore the available commercial units at Highland Jebel Ali and review the investment terms before making an informed decision.</p>
          </div>
        </div>
        <table className="ja-table reveal">
          <caption className="sr-only">Investment snapshot</caption>
          <thead><tr><th scope="col">Investment detail</th><th scope="col">Project information</th></tr></thead>
          <tbody>
            {JA_SNAPSHOT.map((r) => (
              <tr key={r.k}><th scope="row">{r.k}</th><td className={r.v ? '' : 'ja-table__pending'}>{r.v || IN_BRIEF}</td></tr>
            ))}
          </tbody>
        </table>
        <div className="reveal" style={{ marginTop: 34 }}><Go href="#enquiry">Request Investment Brief</Go></div>
      </section>

      {/* FAQ */}
      <section className="pad wrap section-light" id="faq" aria-labelledby="faq-title">
        <div className="faq__grid">
          <div className="faq__side"><span className="tag reveal">Questions investors ask</span>
            <h2 className="d2" id="faq-title" style={{ marginTop: 20 }}><span className="line"><span>Clear answers,</span></span><span className="line"><span className="c">before you commit.</span></span></h2>
            <p className="lede reveal" style={{ marginTop: 20 }}>Anything else on your mind? Your advisor will answer it on the first call.</p>
            <div className="reveal" style={{ marginTop: 28 }}><Go href="#enquiry">Speak to an advisor</Go></div></div>
          <FaqList items={FAQS} />
        </div>
      </section>

      {/* 06 FINAL ENQUIRY */}
      <section className="pad wrap section-light" id="enquiry" aria-labelledby="enq-title">
        <div className="panel contact__card reveal">
          <aside className="contact__aside on-dark">
            <Photo id={PHOTOS.contact} alt="" sizes="(max-width: 980px) 100vw, 45vw" par />
            <div><span className="tag">( 06 ) &nbsp;Enquire</span>
              <h2 className="d2" id="enq-title" style={{ marginTop: 20, fontSize: 'clamp(36px,3.8vw,62px)' }}>Explore Commercial Ownership <span className="c">in Jebel Ali.</span></h2>
              <p className="lede" style={{ marginTop: 18 }}>Review the available inventory, pricing, unit specifications and ownership terms for Highland&apos;s Jebel Ali commercial real estate opportunity.</p>
              <p className="lede" style={{ marginTop: 14 }}>Receive the project investment brief with the information required to assess the asset.</p></div>
            <div className="contact__quick"><a href={waLink()} className="btn btn--glass btn--sm" data-wa target="_blank" rel="noopener"><svg className="wa-ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-wa" /></svg>WhatsApp</a><a href={telLink()} className="btn btn--glass btn--sm" data-call>Call us</a></div>
          </aside>
          <EnquiryForm />
        </div>
      </section>
    </main>
  );
}
