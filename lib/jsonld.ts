import { FAQS, LOCATIONS, SITE } from './site';

const ORG = `${SITE.url}/#organization`;
const SERVICES = ['EV charging station', 'Commercial offices', 'Retail spaces', 'Warehousing and logistics', 'Industrial assets', 'Business parks'];
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
        slogan: 'Dubai is going electric. Own the infrastructure.',
        address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' },
        areaServed: [{ '@type': 'City', name: 'Dubai' }, { '@type': 'Country', name: 'India' }, { '@type': 'Country', name: 'United Arab Emirates' }],
        knowsAbout: ['EV charging infrastructure in Dubai', 'Electric mobility investment', 'Commercial real estate in Dubai', 'Dubai Economic Agenda D33', 'Warehousing and logistics property', 'Industrial property', 'Offshore property investment from India (RBI LRS)'],
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
        speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.hero .lede', '#faq h3 button', '#faq .faq__a p'] },
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE.url}/#locations`,
        name: 'Investment locations in Dubai',
        itemListElement: LOCATIONS.map((l, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'Place', name: l.key, description: `${l.tag}. ${l.prop} ${l.fact}`, containedInPlace: { '@type': 'City', name: 'Dubai' } } })),
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
