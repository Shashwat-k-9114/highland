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
