import type { Lead } from './types';

export const nf = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n));
export const compact = (n: number) => new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
export const pct = (n: number, d = 1) => (Number.isFinite(n) ? n.toFixed(d) + '%' : '0%');

export function delta(cur: number, prev: number): { text: string; up: boolean | null } {
  if (!prev) return { text: cur ? 'new' : '–', up: cur ? true : null };
  const d = ((cur - prev) / prev) * 100;
  return { text: `${d >= 0 ? '+' : ''}${d.toFixed(0)}%`, up: d === 0 ? null : d > 0 };
}

export function ago(iso: string): string {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const fullDate = (iso: string) => new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
export const shortDay = (d: string) => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
export const dubaiDay = (iso: string) => new Date(new Date(iso).getTime() + 4 * 3600e3).toISOString().slice(0, 10);
export const duration = (s: number) => `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
export const initials = (n: string) => n.split(/\s+/).filter(Boolean).slice(0, 2).map((x) => x[0]?.toUpperCase()).join('') || '?';
export const digitsOf = (p: string) => p.replace(/\D/g, '');

const regionNames = typeof Intl !== 'undefined' && 'DisplayNames' in Intl ? new Intl.DisplayNames(['en'], { type: 'region' }) : null;
export const countryName = (cc: string) => { try { return (cc && cc !== 'XX' && regionNames?.of(cc)) || cc || 'Unknown'; } catch { return cc || 'Unknown'; } };
export const flag = (cc: string) => (/^[A-Z]{2}$/.test(cc) ? String.fromCodePoint(...[...cc].map((c) => 127397 + c.charCodeAt(0))) : '🌐');

export function toCsv(leads: Lead[]): string {
  const cols: [string, (l: Lead) => string][] = [
    ['Name', (l) => l.name], ['Budget', (l) => l.budget || ''], ['City of residence', (l) => l.investorCity || ''], ['Email', (l) => l.email], ['Phone', (l) => l.phone], ['Status', (l) => l.status],
    ['Starred', (l) => (l.starred ? 'yes' : '')], ['Source', (l) => l.source], ['Pass no.', (l) => l.passNo],
    ['Submitted', (l) => l.createdAt], ['Submissions', (l) => String(l.submissions)], ['Country', (l) => l.country], ['City', (l) => l.city],
    ['Device', (l) => l.device], ['UTM source', (l) => l.utm.utm_source || ''], ['UTM medium', (l) => l.utm.utm_medium || ''], ['UTM campaign', (l) => l.utm.utm_campaign || ''],
    ['Page', (l) => l.page], ['Referrer', (l) => l.referrer], ['Notes', (l) => l.notes],
  ];
  // Prefix formula-looking cells so spreadsheets never execute them.
  const cell = (s: string) => { const v = /^[=+\-@]/.test(s) ? "'" + s : s; return `"${v.replace(/"/g, '""')}"`; };
  return [cols.map((c) => c[0]).join(','), ...leads.map((l) => cols.map((c) => cell(c[1](l))).join(','))].join('\n');
}

export function download(name: string, text: string, type = 'text/csv') {
  const url = URL.createObjectURL(new Blob(['﻿' + text], { type: type + ';charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) }, cache: 'no-store' });
  if (r.status === 401) { location.href = '/admin/login'; throw new Error('Session expired'); }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((j as { error?: string }).error || `Request failed (${r.status})`);
  return j as T;
}
