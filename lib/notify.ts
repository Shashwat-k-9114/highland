import 'server-only';
import type { Lead } from './leads';

/** Optional lead notifications: a webhook (CRM / Zapier / Slack) and/or an email via Resend. Failures never block the lead. */
export async function notifyLead(lead: Lead) {
  const jobs: Promise<unknown>[] = [];
  const hook = process.env.LEAD_WEBHOOK_URL;
  if (hook) jobs.push(fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'lead.created', lead }) }).catch(() => {}));
  const key = process.env.RESEND_API_KEY, to = process.env.LEAD_NOTIFY_EMAIL;
  if (key && to) {
    const esc = (s: string) => s.replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c] as string);
    jobs.push(fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL || 'Highland Capitals <onboarding@resend.dev>',
        to: to.split(',').map((s) => s.trim()), subject: `New lead: ${lead.name}`,
        html: `<h2>New Highland Capitals lead</h2><p><b>${esc(lead.name)}</b><br>${esc(lead.email)}<br>${esc(lead.phone)}</p><p>${lead.intent ? `Interest: ${esc(lead.intent)}<br>` : ''}${lead.company ? `Company: ${esc(lead.company)}<br>` : ''}${lead.investorCity ? `City: ${esc(lead.investorCity)}<br>` : ''}Source: ${esc(lead.source)}<br>Pass: ${esc(lead.passNo)}</p>`,
      }),
    }).catch(() => {}));
  }
  await Promise.all(jobs);
}
