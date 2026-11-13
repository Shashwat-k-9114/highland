import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: `The terms that apply when you use the ${SITE.name} website.`,
  alternates: { canonical: '/terms' },
};

export default function Terms() {
  return (
    <main className="legal-page">
      <span className="tag">Legal</span>
      <h1>Terms of Use</h1>
      <p>Last updated: November 2026. By using this website you agree to these terms.</p>

      <h2>Information only</h2>
      <p>{SITE.name} provides investment advisory information only. Nothing on this website is an offer, solicitation or investment, tax or legal advice. Real estate values and rental income can fall as well as rise, and returns are never guaranteed.</p>

      <h2>Proposed development</h2>
      <p>The development described is a proposed concept. Details, specifications, pricing and timelines are subject to change and confirmation. Payment plans vary by project and are confirmed at booking. Imagery is illustrative.</p>

      <h2>Government figures</h2>
      <p>Figures relating to the Dubai Economic Agenda D33 are published government targets, not projections of investment returns.</p>

      <h2>Investors in India</h2>
      <p>Remittances by Indian residents are subject to RBI / FEMA regulations and Indian tax law. Guidance on this website is general information, not tax or legal advice. Please consult your own advisers.</p>

      <h2>Intellectual property</h2>
      <p>The content and design of this website belong to {SITE.name} or its licensors. Photography is sourced from Unsplash and footage from Pexels under their free licences.</p>

      <h2>Limitation of liability</h2>
      <p>To the extent permitted by law, we are not liable for losses arising from reliance on the information on this website.</p>

      <h2>Contact</h2>
      <p>Questions about these terms? Use the contact details on this website{SITE.email ? <> or write to <a href={`mailto:${SITE.email}`}>{SITE.email}</a></> : ''}.</p>
    </main>
  );
}
