import { isAdminRequest } from '@/lib/auth';
import { readAnalytics } from '@/lib/analytics';
import { gaConfigured, readGA } from '@/lib/ga';
import { json } from '@/lib/request';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (!(await isAdminRequest(req))) return json({ error: 'Unauthorized' }, 401);
  const q = Number(new URL(req.url).searchParams.get('days'));
  const days = [7, 14, 30, 90].includes(q) ? q : 30;
  const first = await readAnalytics(days);
  let ga: unknown = null;
  let gaError = '';
  if (gaConfigured()) {
    try { ga = await readGA(days); } catch (e) { gaError = e instanceof Error ? e.message : 'GA request failed'; }
  }
  return json({ days, first, ga, gaError, gaConfigured: gaConfigured(), gaId: process.env.NEXT_PUBLIC_GA_ID || '' });
}
