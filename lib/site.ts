/**
 * Single source of truth for site copy, contact details and media.
 * Edit here; the page, SEO metadata, JSON-LD and llms.txt all read from this file.
 */

export const SITE = {
  name: 'Highland Capitals',
  legalName: 'Highland Capitals',
  tagline: 'Commercial Real Estate Advisory · Dubai',
  // Set NEXT_PUBLIC_SITE_URL to the live domain. On Vercel we fall back to the project's production domain.
  url: (process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')).replace(/\/$/, ''),
  locale: 'en_AE',
  title: 'Highland Capitals: Commercial Real Estate Investment Advisory, Dubai',
  description:
    'Private commercial real estate advisory in Dubai for founders, CEOs and senior executives: offices, retail, logistics, industrial assets and business parks aligned with the Dubai Economic Agenda D33.',
  shortDescription:
    'Dubai 2033. Invest in what\'s next. A proposed commercial development bringing together EV infrastructure, industrial facilities, hospitality and business conveniences.',
  keywords: [
    'Dubai commercial real estate',
    'commercial property investment Dubai',
    'invest in Dubai from India',
    'Dubai D33 economic agenda',
    'Dubai offices for sale',
    'warehouse investment Dubai',
    'industrial property Dubai',
    'Dubai South investment',
    'JAFZA warehousing',
    'DIFC office investment',
    'Business Bay commercial property',
    'EV charging infrastructure Dubai',
  ],
  ogImage: '/opengraph-image',
  // Contact: set these in the environment (see .env.example). The fallbacks are placeholders.
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP || '971500000000').replace(/\D/g, ''),
  phone: process.env.NEXT_PUBLIC_PHONE || '+971500000000',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  address: process.env.NEXT_PUBLIC_OFFICE_ADDRESS || '[Office address]',
  indiaOffice: process.env.NEXT_PUBLIC_INDIA_OFFICE || '[Representative office]',
  registration: process.env.NEXT_PUBLIC_REGISTRATION || '[RERA / regulatory registration details.]',
  sameAs: (process.env.NEXT_PUBLIC_SOCIAL_LINKS || '').split(',').map((s) => s.trim()).filter(Boolean),
  whatsappText: 'Hello Highland Capitals, I would like commercial investment options in Dubai.',
  gaId: process.env.NEXT_PUBLIC_GA_ID || '',
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
} as const;

export const waLink = (text: string = SITE.whatsappText) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
export const telLink = () => `tel:${SITE.phone.replace(/[^\d+]/g, '')}`;

export const NAV = [
  { href: '#top', spy: 'top', label: 'Home' },
  { href: '#about', spy: 'about', label: 'About Us' },
  { href: '#opportunities', spy: 'opportunities', label: 'Investment Opportunities' },
  { href: '#locations', spy: 'locations', label: 'Locations' },
  { href: '#contact', spy: 'contact', label: 'Contact' },
] as const;

export type Component = { key: string; tag: string; pos: string; photo: string; alt: string; video?: { src: string; mobile?: boolean }; still?: string };

/* Self-hosted, optimised footage lives in /public/videos (see scripts/optimise-videos.mjs). */
export const COMPONENTS: Component[] = [
  { key: 'EV infrastructure', tag: 'Electric mobility', pos: 'Charging infrastructure for the shift to electric mobility, built for fleets, logistics operators and everyday drivers.', photo: 'photo-1707758283052-f1e3a2d42333', alt: 'Solar-powered EV charging station in an urban car park', video: { src: '/videos/comp0' } },
  { key: 'Industrial facilities', tag: 'Business operations', pos: 'Operational space and infrastructure designed around the way modern industry and business actually work.', photo: 'photo-1727870752423-4d51d5b500c7', alt: 'Aerial view of a modern industrial complex', video: { src: '/videos/comp1' } },
  { key: 'Sleeping pods', tag: 'Short-stay rest', pos: 'Private, comfortable short-stay accommodation for drivers, crews and business travellers on the move.', photo: 'photo-1539606420556-14c457c45507', alt: 'Short-stay sleeping pods for travellers', still: 'https://images.pexels.com/photos/4090093/pexels-photo-4090093.jpeg?auto=compress&cs=tinysrgb&w=1600' },
  { key: 'Restaurants', tag: 'Food and hospitality', pos: 'Dining and hospitality that keeps the destination active, from the first coffee of the day to the last order.', photo: 'photo-1727595237668-cf73e6a2d927', alt: 'Restaurant dining hall', video: { src: '/videos/comp3' } },
  { key: 'Commercial amenities', tag: 'Business support', pos: 'Everyday business conveniences and supporting facilities that keep tenants and visitors productive on site.', photo: 'photo-1758448500688-3ababa93fd67', alt: 'Travellers entering a modern hotel lobby', video: { src: '/videos/comp4' } },
];

export type Location = { key: string; tag: string; prop: string; fact: string; best: string[]; photo: string };
export const LOCATIONS: Location[] = [
  { key: 'Business Bay', tag: 'Central Business District', prop: 'Prime office and retail demand at the heart of the city\'s commercial core.', fact: 'Canal-side CBD beside Downtown Dubai and Burj Khalifa.', best: ['Offices', 'Retail'], photo: 'photo-1721804222977-7c17a905a83a' },
  { key: 'DIFC', tag: 'Financial Centre', prop: 'Office space where regional finance is headquartered.', fact: 'A financial free zone with its own courts and regulator. Home to banks, funds and family offices.', best: ['Premium offices'], photo: 'photo-1600068485426-4d32cd411697' },
  { key: 'JLT', tag: 'DMCC Free Zone', prop: 'Free-zone offices and retail in one of Dubai\'s busiest business communities.', fact: 'Home of DMCC, with 25,000+ registered companies.', best: ['Offices', 'Retail'], photo: 'photo-1527354711091-dfe0e5f699be' },
  { key: 'Dubai South', tag: 'Aviation & Logistics', prop: 'Get in early around what will be the world\'s largest airport.', fact: 'Al Maktoum International: AED 128 bn expansion; all DXB operations set to move here.', best: ['Logistics', 'Business parks', 'Offices'], photo: 'photo-1785255992790-311e2f64b00b' },
  { key: 'JAFZA', tag: 'Port Free Zone', prop: 'Warehousing and industrial units beside the region\'s largest port.', fact: 'The largest customs-bonded zone in the Middle East. 10,700+ companies beside Jebel Ali Port.', best: ['Warehousing', 'Industrial'], photo: 'photo-1553413077-190dd305871c' },
  { key: 'Dubai Industrial City', tag: 'Manufacturing Hub', prop: 'Manufacturing and light-industrial space in a dedicated industrial district.', fact: 'Purpose-built for manufacturing and logistics, between Jebel Ali and Al Maktoum International.', best: ['Industrial', 'Warehousing'], photo: 'photo-1791178960869-031803aa398d' },
];

export const STATS = [
  { prefix: 'AED', count: 32, dec: 0, suffix: 'TN', label: 'Total economic targets set by D33 through 2033.' },
  { prefix: '', count: 100, dec: 0, suffix: '', label: 'Transformative projects across trade, finance, logistics and digital.' },
  { prefix: 'AED', count: 25.6, dec: 1, suffix: 'TN', label: 'Foreign-trade target for the decade, up from AED 14.2 tn.' },
  { prefix: 'AED', count: 650, dec: 0, suffix: 'BN+', label: 'Foreign direct investment targeted over the decade.' },
  { prefix: 'AED', count: 1, dec: 0, suffix: 'TN', label: 'Private-sector investment target, up from AED 790 bn.' },
  { prefix: '', count: 400, dec: 0, suffix: '', label: 'New cities to become key trade partners via Dubai Economic Corridors 2033.' },
];

export const PLAN_ITEMS = [
  'Project location and specifications.',
  'Ownership and investment structure.',
  'Available investment options.',
  'Payment schedule.',
  'Development timeline.',
  'Potential commercial use and income model, if established.',
];

export const INDIA_ITEMS = [
  'Applicable RBI/FEMA remittance regulations.',
  'INR to AED payment considerations.',
  'UAE property ownership procedures.',
  'Indian taxation and compliance considerations.',
];

export const FAQS = [
  { q: 'Can I buy commercial property in Dubai from India?', a: 'Yes. Resident Indians can remit up to USD 250,000 per person per financial year under RBI\'s Liberalised Remittance Scheme, which permits buying residential or commercial property abroad. Family members can pool their limits, and we guide you through the remittance with your bank.' },
  { q: 'How are my payments protected?', a: 'For off-plan purchases, Dubai law requires every project to have its own escrow account at an approved bank. Your instalments go into that account, not to the developer, and are released only against verified construction progress. We check the project\'s registration and escrow details before you pay a single dirham.' },
  { q: 'What is the minimum investment?', a: 'Investment options, pricing and the payment schedule are set out in the project specifications. Request them and your advisor will walk you through each option.' },
  { q: 'Does it qualify me for a UAE Golden Visa?', a: 'Owning property worth AED 2 million or more can make you eligible for the 10-year renewable Golden Visa, including off-plan property under current rules. Final eligibility is decided by UAE authorities.' },
  { q: 'What returns can I expect?', a: 'Returns depend on the asset, location, use and price, and are never guaranteed. Where a commercial use and income model is established, it is shared with the project information so you can judge it yourself.' },
  { q: 'Do I need to travel to Dubai?', a: 'No. Booking, documentation and transfer can all be handled remotely. Many clients like to visit before deciding, and we arrange private viewings when you do.' },
  { q: 'Is there a fee to enquire?', a: 'None. Project information and the advisory call are free and carry no obligation.' },
];

export const COUNTRY_CODES: [string, string][] = [
  ['+91', 'IN'], ['+971', 'AE'], ['+966', 'SA'], ['+974', 'QA'], ['+965', 'KW'], ['+968', 'OM'], ['+973', 'BH'],
  ['+44', 'UK'], ['+1', 'US/CA'], ['+65', 'SG'], ['+61', 'AU'], ['+852', 'HK'], ['+49', 'DE'], ['+254', 'KE'], ['+27', 'ZA'],
];

export const PHOTOS = {
  hero: 'photo-1721807790086-f1a639b15986',
  about: 'photo-1651467606797-e1c660cf3fda',
  contact: 'photo-1706074793638-da28b90ea8ae',
  xp: 'photo-1719474815388-03fdde90a9f8',
  closer: 'photo-1590264539175-39df72442833',
} as const;

export const unsplash = (id: string, w = 1600, q = 75) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;

export const HERO_REEL = {
  desktop: ['/videos/hero1', '/videos/hero2', '/videos/hero3'],
  mobile: ['/videos/hero-m1', '/videos/hero-m2'],
};
export const BAND_VIDEO = '/videos/band';
