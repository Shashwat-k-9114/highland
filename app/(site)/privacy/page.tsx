import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${SITE.name} collects, uses and protects the details you share with us.`,
  alternates: { canonical: '/privacy' },
};

export default function Privacy() {
  return (
    <main className="legal-page">
      <span className="tag">Legal</span>
      <h1>Privacy Policy</h1>
      <p>Last updated: November 2026. This policy explains what {SITE.name} (&ldquo;we&rdquo;) collects when you use this website and enquire about commercial investment opportunities in Dubai.</p>

      <h2>What we collect</h2>
      <ul>
        <li><b>Details you give us:</b> your name, email address and phone number when you request project information or a consultation.</li>
        <li><b>Usage data:</b> pages viewed, approximate location (country / city), device and browser type, referring website and campaign (UTM) parameters, collected through Google Analytics and our own privacy-friendly analytics.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To contact you by phone, WhatsApp or email with the project information you asked for.</li>
        <li>To understand how the website is used and to improve it.</li>
        <li>To measure our advertising, if you arrived from one of our campaigns.</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>We never sell your details. We share them only with service providers that help us run the website and respond to you (such as hosting, analytics, email and CRM tools), and where the law requires it.</p>

      <h2>How long we keep it</h2>
      <p>We keep enquiry details for as long as needed to follow up with you, and then delete or anonymise them. You can ask us to delete your details at any time.</p>

      <h2>Your choices</h2>
      <p>You can ask to access, correct or delete your information, or withdraw your consent to be contacted, by writing to us{SITE.email ? <> at <a href={`mailto:${SITE.email}`}>{SITE.email}</a></> : ' using the contact details on this website'}. You can also block analytics cookies in your browser settings.</p>

      <h2>Security</h2>
      <p>Enquiry details are transmitted over an encrypted connection and stored with access limited to our team.</p>
    </main>
  );
}
