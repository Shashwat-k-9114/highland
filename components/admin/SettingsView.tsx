'use client';
import { Card, Icon } from './ui';
import type { Status } from './types';

const Row = ({ ok, warn, title, children }: { ok: boolean; warn?: boolean; title: string; children: React.ReactNode }) => (
  <li className={ok ? 'ok' : warn ? 'warn' : 'no'}>
    <span className="ad-tick">{ok ? <Icon name="check" size={14} /> : warn ? '!' : '·'}</span>
    <div><b>{title}</b><p>{children}</p></div>
  </li>
);

export default function SettingsView({ status }: { status: Status | null }) {
  if (!status) return <div className="ad-skel ad-skel--chart" />;
  const code = (s: string) => <code>{s}</code>;
  return (
    <div className="ad-grid-page">
      <Card title="Setup checklist" sub="Everything the admin and the site depend on">
        <ul className="ad-check">
          <Row ok={status.durable} warn={!status.durable} title={`Lead storage: ${status.storage === 'redis' ? 'Redis (Upstash)' : 'local file'}`}>
            {status.durable
              ? 'Leads and analytics are saved durably.'
              : <>Leads are stored in a temporary file. <b>On Vercel this is wiped regularly.</b> Add the Upstash Redis integration (Vercel Marketplace → Storage) so {code('UPSTASH_REDIS_REST_URL')} and {code('UPSTASH_REDIS_REST_TOKEN')} are set, then redeploy.</>}
          </Row>
          <Row ok={!!status.ga.trackingId} title="Google Analytics 4 tracking">
            {status.ga.trackingId ? <>Tracking ID {code(status.ga.trackingId)} is live on the website.</> : <>Set {code('NEXT_PUBLIC_GA_ID')} to your GA4 measurement ID (looks like G-XXXXXXXXXX) and redeploy.</>}
          </Row>
          <Row ok={status.ga.dataApi} title="Google Analytics reports in this panel">
            {status.ga.dataApi ? 'Connected: see Traffic → Google Analytics 4.' : <>Optional. Create a Google Cloud service account, enable the “Google Analytics Data API”, add its email as a <b>Viewer</b> on your GA4 property, then set {code('GA_PROPERTY_ID')}, {code('GA_CLIENT_EMAIL')} and {code('GA_PRIVATE_KEY')}.</>}
          </Row>
          <Row ok warn={false} title="Built-in site analytics">Always on. Counts visitors, sessions, page views, channels, devices, countries and CTA / form events with no cookies, and powers the Overview and Traffic pages even before GA is connected.</Row>
          <Row ok={status.notifications.email || status.notifications.webhook} warn={!(status.notifications.email || status.notifications.webhook)} title="New-lead notifications">
            {status.notifications.email || status.notifications.webhook
              ? `Active${status.notifications.email ? ': email' : ''}${status.notifications.email && status.notifications.webhook ? ' +' : ''}${status.notifications.webhook ? ' webhook' : ''}.`
              : <>Not set. To get an email the moment a lead arrives, set {code('RESEND_API_KEY')} and {code('LEAD_NOTIFY_EMAIL')}; or set {code('LEAD_WEBHOOK_URL')} to push leads to a CRM, Zapier or Slack.</>}
          </Row>
          <Row ok={status.metaPixel} warn={false} title="Meta (Facebook) Pixel">{status.metaPixel ? 'Active.' : <>Optional. Set {code('NEXT_PUBLIC_META_PIXEL_ID')} if you run Meta ads.</>}</Row>
          <Row ok={!!status.siteUrl} warn={!status.siteUrl} title="Canonical site URL">{status.siteUrl ? <>{code(status.siteUrl)}</> : <>Set {code('NEXT_PUBLIC_SITE_URL')} to the live domain so sitemaps, canonical tags and social previews point to the right address.</>}</Row>
        </ul>
      </Card>
      <Card title="Good to know">
        <ul className="ad-notes">
          <li>The website’s lead form asks only for <b>name, email and phone</b>. Repeat submissions from the same email or phone are merged into one lead (shown as ×2, ×3…).</li>
          <li>Country and city come from Vercel’s edge headers, so they show on the deployed site, not on localhost.</li>
          <li>Your session lasts 12 hours. Change the admin password any time by updating {code('ADMIN_PASSWORD')}.</li>
        </ul>
      </Card>
    </div>
  );
}
