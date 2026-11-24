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
  title: 'Highland | Jebel Ali Commercial Investment, Dubai',
  description:
    'Commercial real estate in Jebel Ali, Dubai. Invest in commercial assets within one of Dubai’s established industrial and trade districts, with EV-ready infrastructure. Request the investment brief.',
  shortDescription:
    'Commercial Real Estate in Jebel Ali. Built for the Next Phase of Industry. Commercial ownership opportunities in Jebel Ali, Dubai, with EV-ready infrastructure.',
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
    'EV charging station investment Dubai',
    'invest in EV charging stations UAE',
    'Dubai EV charging business',
    'Jebel Ali EV charging',
    'DEWA EV Green Charger',
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
  { href: '#opportunity', spy: 'opportunity', label: 'Opportunity' },
  { href: '#location', spy: 'location', label: 'Location' },
  { href: '#ev-ready', spy: 'ev-ready', label: 'EV-Ready' },
  { href: '#investment-details', spy: 'investment-details', label: 'Investment Details' },
  { href: '#enquiry', spy: 'enquiry', label: 'Enquire' },
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
  { q: 'Why invest in EV charging infrastructure in Dubai?', a: 'Dubai is expanding public charging quickly: DEWA and the Dubai Media Office reported more than 1,270 public charge points in August 2025, and Dubai targets EVs at more than 15% of its vehicle fleet by 2030 under its Green Mobility Strategy. Fleets, taxis and logistics operators need high-power charging near ports and free zones. Highland Capitals is developing multiple stations backed by real estate, with food, rest and business services on site. This is market context, not a projection of returns.' },
  { q: 'Where will the Highland Capitals EV stations be?', a: 'Phase 1 is in the Jebel Ali industrial corridor, close to Jebel Ali Port, JAFZA and the E11 / E311 roads. Further stations are planned in other Dubai locations. Exact sites are subject to confirmation, approvals and DEWA licensing, and are shared in the investment brief.' },
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
  desktop: ['/videos/hero1', '/videos/ev1', '/videos/hero2', '/videos/hero3'],
  mobile: ['/videos/hero-m1', '/videos/ev-m1', '/videos/hero-m2'],
};
export const BAND_VIDEO = '/videos/band';

/* ---------- Jebel Ali project brief (Highland Dubai X JAI) ---------- */
export const JA_INFRA_NEEDS = [
  { k: 'Industrial facilities', d: 'Spaces supporting manufacturing and operations.' },
  { k: 'Logistics infrastructure', d: 'Warehousing, distribution and supply chains.' },
  { k: 'Commercial assets', d: 'Properties supporting business activity.' },
  { k: 'Emerging infrastructure', d: 'EV charging and future mobility facilities.' },
];

export const JA_MOBILITY = [
  { k: 'EV Charging', d: 'Charging infrastructure for electric mobility.', icon: 'M13 2 4 14h7l-1 8 9-12h-7z' },
  { k: 'Commercial Mobility', d: 'Facilities supporting commercial vehicles and fleets.', icon: 'M2 7h12v9H2zM14 10h4l4 3v3h-8zM6 19h.01M18 19h.01' },
  { k: 'Rest & Accommodation', d: 'Short-stay facilities for drivers and travellers.', icon: 'M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 15h18M3 21v-3M21 21v-3M7 9V6h10v3' },
  { k: 'Food & Convenience', d: 'Restaurants and supporting services.', icon: 'M6 3v8a2 2 0 0 0 2 2v8M10 3v8M6 7h4M17 3c-2 2-3 5-3 8h3v10' },
];

export const JA_D33_PILLARS = [
  { k: 'Global Trade', d: 'Expand international trade and connect with more global markets.' },
  { k: 'Logistics & Industry', d: 'Strengthen logistics capabilities and industrial competitiveness.' },
  { k: 'Sustainable Growth', d: 'Support sustainable manufacturing and economic development.' },
  { k: 'Innovation & Technology', d: 'Enable new technologies and future-oriented business sectors.' },
];

export const JA_LOCATION_FACTS = [
  { k: 'Highland Capitals project', d: 'In the Jebel Ali industrial corridor. Exact site to be confirmed.' },
  { k: 'Jebel Ali Port', d: 'International maritime trade.' },
  { k: 'JAFZA', d: 'Established free zone and business ecosystem.' },
  { k: "Al Maktoum Int'l Airport (DWC)", d: 'Long-term aviation and cargo infrastructure expansion.' },
  { k: 'Dubai South', d: 'Logistics and aviation-led district.' },
  { k: 'E11 / E311', d: 'Regional road connectivity.' },
];

/** Knight Frank, UAE Industrial and Logistics Market Review 2025-26: 2025 year-on-year rental growth. */
export const JA_RENT_GROWTH = [
  { k: 'Jebel Ali Grade B', v: 39 },
  { k: 'Dubai Industrial City', v: 32 },
  { k: 'Dubai South', v: 25 },
  { k: 'JAFZA Grade A', v: 22 },
];

export const INTENTS = [
  'Request investment details',
  'Schedule a virtual consultation',
  'Plan a Dubai site visit',
  'Explore business partnership opportunities',
] as const;

export const INDIA_CITIES = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Ahmedabad', 'Kolkata', 'Kochi', 'Jaipur', 'Chandigarh', 'Surat', 'Other'];

/* ---------- EV x Dubai ---------- */
/** Sourced market facts (DEWA / Dubai Media Office, Arthur D. Little). Not project returns. */
export const EV_FACTS = [
  { n: 1270, suffix: '+', label: 'Public EV charging points in Dubai by Aug 2025, up sharply year on year.', src: 'Dubai Media Office, Aug 2025' },
  { n: 40600, suffix: '+', label: 'Electric vehicles on Dubai roads by the end of H1 2025.', src: 'DEWA, 2025' },
  { n: 9, suffix: '%', label: 'Share of new UAE vehicle sales that were electric in 2025.', src: 'Arthur D. Little' },
  { n: 15, suffix: '%+', label: 'Dubai target for EVs as a share of its vehicle fleet by 2030.', src: 'Dubai Green Mobility Strategy 2030' },
] as const;

export const EV_WHY = [
  { k: 'Policy tailwind', d: "Dubai's Green Mobility Strategy 2030 and Clean Energy Strategy 2050 put electric mobility at the centre of the city's plan." },
  { k: 'Fleets need depots', d: 'Taxi, delivery and logistics fleets are electrifying. They need high-power charging near ports, free zones and arterial roads.' },
  { k: 'Dwell time is revenue', d: 'A charging stop takes 20 to 40 minutes. Food, rest pods and convenience retail turn that dwell time into extra income per visit.' },
  { k: 'Hard-asset base', d: 'Land, buildings and grid connections sit under the station, so the income model is backed by real estate, not only equipment.' },
] as const;

export const EV_STATIONS = [
  { k: 'Station 01', t: 'Jebel Ali corridor', d: 'Anchor hub beside the port, JAFZA and the E11 / E311. Fleet and logistics focus.', s: 'Phase 1' },
  { k: 'Station 02', t: 'Dubai South', d: 'Airport and logistics district. Cargo, ride-hail and visitor traffic.', s: 'Planned' },
  { k: 'Station 03', t: 'Dubai Industrial City', d: 'Industrial workforce, commercial vehicles and last-mile fleets.', s: 'Planned' },
  { k: 'Station 04', t: 'Sheikh Zayed Road', d: 'High-visibility spine for intercity and everyday drivers.', s: 'Pipeline' },
] as const;


/* ---------- Jebel Ali commercial investment page (copy brief, 24 Nov 2026) ---------- */
/** Only confirmed facts are shown as fact. Anything still unconfirmed points to the investment brief. */
export const IN_BRIEF = 'Provided in the investment brief';

export const JA_HIGHLIGHTS = [
  { k: 'Commercial property in Jebel Ali', pending: false },
  { k: 'Unit types and sizes', pending: true },
  { k: 'Starting investment and ownership structure', pending: true },
];

export const JA_MAP_LABELS = ['Jebel Ali Port', 'JAFZA', 'Al Maktoum International Airport', 'Project Location'];

export const JA_EV_POINTS = [
  { k: 'EV charging infrastructure / charging provisions', pending: false },
  { k: 'Electrical capacity and charging specifications', pending: true },
  { k: 'Fleet or commercial vehicle compatibility', pending: true },
  { k: 'Owner and tenant access details', pending: true },
];

export const JA_SNAPSHOT = [
  { k: 'Asset type', v: '' },
  { k: 'Unit sizes', v: '' },
  { k: 'Starting price', v: '' },
  { k: 'Ownership', v: '' },
  { k: 'Payment plan', v: '' },
  { k: 'Rental model', v: '' },
];

export const BUDGETS = ['Under AED 1M', 'AED 1M to 2M', 'AED 2M to 5M', 'AED 5M to 10M', 'Above AED 10M', 'Prefer to discuss'];
