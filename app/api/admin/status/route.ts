import { isAdminRequest } from '@/lib/auth';
import { getStore } from '@/lib/store';
import { gaConfigured } from '@/lib/ga';
import { json } from '@/lib/request';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!(await isAdminRequest(req))) return json({ error: 'Unauthorized' }, 401);
  const s = getStore();
  return json({
    storage: s.kind,
    durable: s.durable,
    ga: { trackingId: process.env.NEXT_PUBLIC_GA_ID || '', dataApi: gaConfigured() },
    metaPixel: !!process.env.NEXT_PUBLIC_META_PIXEL_ID,
    notifications: { webhook: !!process.env.LEAD_WEBHOOK_URL, email: !!(process.env.RESEND_API_KEY && process.env.LEAD_NOTIFY_EMAIL) },
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || '',
  });
}
