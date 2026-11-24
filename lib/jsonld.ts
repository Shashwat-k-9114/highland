import { FAQS, SITE } from './site';

const ORG = `${SITE.url}/#organization`;
const SERVICES = ['Commercial real estate in Jebel Ali', 'Industrial and commercial assets', 'EV-ready commercial property'];
const hasRealPhone = !!process.env.NEXT_PUBLIC_PHONE;

/** Structured data for search + answer engines (Google, Bing, ChatGPT, Perplexity, Gemini). Mirrors visible page content only. */
export function homeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['RealEstateAgent', 'Organization'],
        '@id': ORG,
        name: SITE.name,
        legalName: SITE.legalName,
        url: SITE.url,
        logo: { '@type': 'ImageObject', url: `${SITE.url}/logo.png`, width: 840, height: 405 },
        image: `${SITE.url}/opengraph-image`,
        description: SITE.description,
        slogan: 'Commercial Real Estate in Jebel Ali. Built for the Next Phase of Industry.',
        address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' },
        areaServed: [{ '@type': 'City', name: 'Dubai' }, { '@type': 'Country', name: 'India' }, { '@type': 'Country', name: 'United Arab Emirates' }],
        knowsAbout: ['Commercial real estate in Jebel Ali, Dubai', 'Industrial and logistics property', 'EV-ready commercial infrastructure'],
        ...(hasRealPhone ? { telephone: SITE.phone } : {}),
        ...(SITE.email ? { email: SITE.email } : {}),
        ...(hasRealPhone || SITE.email ? { contactPoint: [{ '@type': 'ContactPoint', contactType: 'sales', areaServed: ['AE', 'IN'], availableLanguage: ['en'], ...(hasRealPhone ? { telephone: SITE.phone } : {}), ...(SITE.email ? { email: SITE.email } : {}) }] } : {}),
        ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Commercial real estate advisory',
          itemListElement: SERVICES.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: `${s} investment advisory`, provider: { '@id': ORG }, areaServed: 'Dubai' } })),
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        inLanguage: 'en',
        publisher: { '@id': ORG },
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE.url}/#webpage`,
        url: SITE.url,
        name: SITE.title,
        description: SITE.description,
        inLanguage: 'en',
        isPartOf: { '@id': `${SITE.url}/#website` },
        about: { '@id': ORG },
        primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE.url}/opengraph-image` },
        speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.hero .lede', '#opportunity .lede'] },
      },
      {
        '@type': 'FAQPage',
        '@id': `${SITE.url}/#faq`,
        mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
    ],
  };
}

export const jsonLdString = (o: unknown) => JSON.stringify(o).replace(/</g, '\\u003c');
