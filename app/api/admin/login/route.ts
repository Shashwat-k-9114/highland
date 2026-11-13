import { COOKIE, SESSION_SECONDS, authConfigured, createSession, passwordMatches } from '@/lib/auth';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { json } from '@/lib/request';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  if (!authConfigured()) return json({ ok: false, error: 'Admin is not configured. Set ADMIN_PASSWORD and ADMIN_SECRET.' }, 503);
  if (!rateLimit(`login:${clientIp(req)}`, 6, 15 * 60e3)) return json({ ok: false, error: 'Too many attempts. Try again in 15 minutes.' }, 429);
  let pw = '';
  try { pw = String((await req.json()).password ?? ''); } catch { /* empty */ }
  if (!(await passwordMatches(pw))) {
    await new Promise((r) => setTimeout(r, 600));
    return json({ ok: false, error: 'Incorrect password.' }, 401);
  }
  const res = json({ ok: true });
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.headers.append('Set-Cookie', `${COOKIE}=${await createSession()}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_SECONDS}${secure}`);
  return res;
}
