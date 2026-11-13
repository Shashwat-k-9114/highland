import { record, isBot, type TrackPayload } from '@/lib/analytics';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { requestContext } from '@/lib/request';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const ctx = requestContext(req);
  if (isBot(ctx.ua) || !rateLimit(`trk:${clientIp(req)}`, 120, 60e3)) return new Response(null, { status: 204 });
  try {
    const p = JSON.parse(await req.text()) as TrackPayload;
    if ((p.t !== 'pv' && p.t !== 'ev') || (p.path || '').startsWith('/admin')) return new Response(null, { status: 204 });
    await record(p, ctx);
  } catch {
    /* never surface tracking errors */
  }
  return new Response(null, { status: 204 });
}
