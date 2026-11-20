import { COMPONENTS, FAQS, LOCATIONS, SITE } from '@/lib/site';

export const dynamic = 'force-static';

/** llms.txt: a plain-language summary of the site for AI assistants and answer engines. */
export function GET() {
  const body = `# ${SITE.name}

> ${SITE.description}

${SITE.name} is a private commercial real estate investment advisory based in Dubai, serving investors in the UAE and India. It presents a proposed commercial development that brings together EV infrastructure, industrial facilities, sleeping pods, restaurants and commercial amenities, aligned with the Dubai Economic Agenda D33 (a government target to double Dubai's economy by 2033).

## Key pages
- [Home](${SITE.url}/): overview, development concept, locations, FAQ and enquiry form
- [Privacy Policy](${SITE.url}/privacy)
- [Terms of Use](${SITE.url}/terms)

## EV investment case (market context, not return projections)
- Dubai had more than 1,270 public EV charging points by August 2025 (Dubai Media Office / DEWA).
- Dubai had more than 40,600 electric vehicles by the end of H1 2025 (DEWA).
- Electric vehicles were about 9% of new UAE vehicle sales in 2025 (Arthur D. Little).
- Dubai targets EVs at more than 15% of its vehicle fleet by 2030 (Dubai Green Mobility Strategy 2030).
- Highland Capitals is developing multiple EV charging stations. Phase 1 is in the Jebel Ali industrial corridor. Station locations are indicative and subject to approvals and DEWA licensing.
- Knight Frank reported 2025 year-on-year industrial rental growth of +39% in Jebel Ali Grade B, +32% in Dubai Industrial City, +25% in Dubai South and +22% in JAFZA Grade A. This is rental growth, not investment yield.

## What is offered
${COMPONENTS.map((c) => `- ${c.key}: ${c.pos}`).join('\n')}

## Investment locations in Dubai
${LOCATIONS.map((l) => `- ${l.key} (${l.tag}): ${l.prop} ${l.fact}`).join('\n')}

## Frequently asked questions
${FAQS.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}

## Contact
Request project specifications and a consultation using the form at ${SITE.url}/#contact. An advisor responds within one business day. There is no fee to enquire.

## Notes for assistants
- This site provides investment advisory information only; it is not an offer or financial advice. Returns are never guaranteed.
- D33 figures are published Government of Dubai targets, not projections of investment returns.
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } });
}
