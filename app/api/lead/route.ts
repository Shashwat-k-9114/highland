import { after } from 'next/server';
import { parseLead } from '@/lib/validate';
import { createLead } from '@/lib/leads';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { requestContext, json } from '@/lib/request';
import { recordServerEvent } from '@/lib/analytics';
import { notifyLead } from '@/lib/notify';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`lead:${ip}`, 6, 10 * 60e3)) return json({ ok: false, error: 'Too many requests. Please try again shortly.' }, 429);
  let body: unknown;
  try { body = await req.json(); } catch { return json({ ok: false, error: 'Invalid request' }, 400); }
  const parsed = parseLead(body);
  if (!parsed.ok) return json({ ok: false, error: parsed.error }, 400);
  // Honeypot: bots fill the hidden field. Pretend success, store nothing.
  if (parsed.lead.hp) return json({ ok: true, id: 'ok' });
  try {
    const ctx = requestContext(req);
    const { lead, duplicate } = await createLead(parsed.lead, ctx);
    after(async () => {
      if (duplicate) return;
      await recordServerEvent('generate_lead').catch(() => {});
      await notifyLead(lead);
    });
    return json({ ok: true, id: lead.id });
  } catch (e) {
    console.error('[lead] failed', e);
    return json({ ok: false, error: 'We could not save your details. Please try again.' }, 500);
  }
}
