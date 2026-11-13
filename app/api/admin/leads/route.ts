import { isAdminRequest } from '@/lib/auth';
import { listLeads, updateLead, deleteLeads } from '@/lib/leads';
import { json } from '@/lib/request';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const deny = () => json({ error: 'Unauthorized' }, 401);

export async function GET(req: Request) {
  if (!(await isAdminRequest(req))) return deny();
  return json({ leads: await listLeads() });
}

export async function PATCH(req: Request) {
  if (!(await isAdminRequest(req))) return deny();
  const b = (await req.json().catch(() => null)) as { id?: string; ids?: string[]; patch?: Record<string, unknown> } | null;
  if (!b?.patch) return json({ error: 'Bad request' }, 400);
  const ids = b.ids?.length ? b.ids : b.id ? [b.id] : [];
  const out = [];
  for (const id of ids.slice(0, 500)) {
    const l = await updateLead(id, b.patch as never);
    if (l) out.push(l);
  }
  return json({ leads: out });
}

export async function DELETE(req: Request) {
  if (!(await isAdminRequest(req))) return deny();
  const b = (await req.json().catch(() => null)) as { ids?: string[] } | null;
  if (!b?.ids?.length) return json({ error: 'Bad request' }, 400);
  await deleteLeads(b.ids.slice(0, 500));
  return json({ ok: true });
}
