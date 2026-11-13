import { COOKIE } from '@/lib/auth';
import { json } from '@/lib/request';

export const dynamic = 'force-dynamic';

export async function POST() {
  const res = json({ ok: true });
  res.headers.append('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`);
  return res;
}
