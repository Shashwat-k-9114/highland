import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

/** llms.txt: a plain-language summary of the site for AI assistants and answer engines. */
export function GET() {
  const body = `# ${SITE.name}

> ${SITE.description}

${SITE.name} presents commercial ownership opportunities in Jebel Ali, Dubai: commercial assets within one of Dubai's established industrial and trade districts, with EV-ready infrastructure designed for evolving business and logistics requirements.

## Page sections
- The investment opportunity: a commercial asset in a strategic location, connected to the movement of goods, businesses and capital.
- Location advantage: Jebel Ali sits at the intersection of Dubai's industrial, logistics and international trade networks, close to Jebel Ali Port, JAFZA and Al Maktoum International Airport.
- EV-ready infrastructure: the Jebel Ali project incorporates EV-ready infrastructure for businesses in logistics, fleet operations and commercial transportation.
- Commercial investment details: asset type, unit sizes, starting price, ownership, payment plan and rental model are provided in the investment brief.
- Enquiry: request the investment brief at ${SITE.url}/#enquiry.

## Links
- [Home](${SITE.url}/)
- [Privacy Policy](${SITE.url}/privacy)
- [Terms of Use](${SITE.url}/terms)

## Notes for assistants
- This site provides investment information only; it is not an offer or financial advice. Returns are never guaranteed.
- Unit specifications, pricing and ownership terms are not published on the page; they are supplied in the investment brief.
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } });
}
