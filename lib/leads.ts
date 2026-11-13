import 'server-only';
import { getStore } from './store';
import type { LeadInput } from './validate';

export const STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost'] as const;
export type LeadStatus = (typeof STATUSES)[number];

export type Lead = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  starred: boolean;
  notes: string;
  source: string;
  passNo: string;
  page: string;
  referrer: string;
  utm: Record<string, string>;
  country: string;
  city: string;
  device: string;
  submissions: number;
};

const KEY = 'leads';

const newId = () => 'ld_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export async function listLeads(): Promise<Lead[]> {
  const all = await getStore().hgetall(KEY);
  const out: Lead[] = [];
  for (const v of Object.values(all)) { try { out.push(JSON.parse(v) as Lead); } catch { /* skip corrupt */ } }
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createLead(input: LeadInput, ctx: { country: string; city: string; device: string }): Promise<{ lead: Lead; duplicate: boolean }> {
  const store = getStore();
  const existing = (await listLeads()).find((l) => l.email === input.email || l.phone === input.phone);
  const now = new Date().toISOString();
  if (existing) {
    const upd: Lead = { ...existing, updatedAt: now, submissions: (existing.submissions || 1) + 1 };
    await store.hset(KEY, existing.id, JSON.stringify(upd));
    return { lead: upd, duplicate: true };
  }
  const lead: Lead = {
    id: newId(), createdAt: now, updatedAt: now,
    name: input.name, email: input.email, phone: input.phone,
    status: 'new', starred: false, notes: '',
    source: input.source || 'Website', passNo: input.passNo || '', page: input.page || '', referrer: input.referrer || '',
    utm: input.utm || {}, country: ctx.country, city: ctx.city, device: ctx.device, submissions: 1,
  };
  await store.hset(KEY, lead.id, JSON.stringify(lead));
  return { lead, duplicate: false };
}

export async function updateLead(id: string, patch: Partial<Pick<Lead, 'status' | 'starred' | 'notes' | 'name' | 'email' | 'phone'>>): Promise<Lead | null> {
  const store = getStore();
  const cur = await store.hget(KEY, id);
  if (!cur) return null;
  const lead = JSON.parse(cur) as Lead;
  if (patch.status && (STATUSES as readonly string[]).includes(patch.status)) lead.status = patch.status;
  if (typeof patch.starred === 'boolean') lead.starred = patch.starred;
  if (typeof patch.notes === 'string') lead.notes = patch.notes.slice(0, 5000);
  if (typeof patch.name === 'string' && patch.name.trim().length > 1) lead.name = patch.name.trim().slice(0, 80);
  if (typeof patch.email === 'string' && patch.email.trim()) lead.email = patch.email.trim().slice(0, 160);
  if (typeof patch.phone === 'string' && patch.phone.trim()) lead.phone = patch.phone.trim().slice(0, 24);
  lead.updatedAt = new Date().toISOString();
  await store.hset(KEY, id, JSON.stringify(lead));
  return lead;
}

export async function deleteLeads(ids: string[]): Promise<void> {
  if (ids.length) await getStore().hdel(KEY, ...ids);
}
