'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import LeadsView from './LeadsView';
import OverviewView from './OverviewView';
import SettingsView from './SettingsView';
import TrafficView from './TrafficView';
import { Icon, Toast } from './ui';
import type { AnalyticsResponse, Lead, Status } from './types';
import { api } from './utils';

type Tab = 'overview' | 'leads' | 'traffic' | 'settings';
const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: 'overview' },
  { id: 'leads', label: 'Leads', icon: 'leads' },
  { id: 'traffic', label: 'Traffic', icon: 'traffic' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];
const TITLES: Record<Tab, string> = { overview: 'Overview', leads: 'Leads', traffic: 'Traffic & analytics', settings: 'Settings' };

export default function AdminApp() {
  const [tab, setTab] = useState<Tab>('overview');
  const [days, setDays] = useState(30);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [err, setErr] = useState('');
  const tt = useRef<ReturnType<typeof setTimeout>>(undefined);

  const notify = useCallback((m: string) => { setToast(m); clearTimeout(tt.current); tt.current = setTimeout(() => setToast(''), 2400); }, []);

  const loadLeads = useCallback(async () => { try { setLeads((await api<{ leads: Lead[] }>('/api/admin/leads')).leads); setErr(''); } catch (e) { setErr(e instanceof Error ? e.message : 'Failed to load leads'); } }, []);
  const loadData = useCallback(async (d: number) => { try { setData(await api<AnalyticsResponse>(`/api/admin/analytics?days=${d}`)); } catch (e) { setErr(e instanceof Error ? e.message : 'Failed to load analytics'); } }, []);

  useEffect(() => {
    const h = location.hash.replace('#', '').split('&')[0] as Tab;
    if (TABS.some((t) => t.id === h)) setTab(h);
    Promise.all([loadLeads(), api<Status>('/api/admin/status').then(setStatus).catch(() => {})]).finally(() => setLoading(false));
  }, [loadLeads]);
  useEffect(() => { loadData(days); }, [days, loadData]);

  // Auto-refresh every 30 s while the tab is visible, so new leads and live visitors appear on their own.
  useEffect(() => {
    const t = setInterval(() => { if (!document.hidden) { loadLeads(); loadData(days); } }, 30000);
    return () => clearInterval(t);
  }, [days, loadLeads, loadData]);

  const go = useCallback((t: Tab, lead?: string) => { setTab(t); history.replaceState(null, '', `#${t}${lead ? `&lead=${lead}` : ''}`); window.scrollTo({ top: 0 }); if (lead) setTimeout(() => window.dispatchEvent(new HashChangeEvent('hashchange')), 0); }, []);

  const patch = useCallback(async (ids: string[], p: Partial<Pick<Lead, 'status' | 'starred' | 'notes'>>) => {
    const prev = leads;
    setLeads((ls) => ls.map((l) => (ids.includes(l.id) ? { ...l, ...p, updatedAt: new Date().toISOString() } : l)));
    try { await api('/api/admin/leads', { method: 'PATCH', body: JSON.stringify({ ids, patch: p }) }); }
    catch (e) { setLeads(prev); notify(e instanceof Error ? e.message : 'Could not save'); }
  }, [leads, notify]);

  const remove = useCallback(async (ids: string[]) => {
    const prev = leads;
    setLeads((ls) => ls.filter((l) => !ids.includes(l.id)));
    try { await api('/api/admin/leads', { method: 'DELETE', body: JSON.stringify({ ids }) }); notify(`Deleted ${ids.length} lead${ids.length === 1 ? '' : 's'}`); }
    catch (e) { setLeads(prev); notify(e instanceof Error ? e.message : 'Could not delete'); }
  }, [leads, notify]);

  const logout = async () => { await fetch('/api/admin/logout', { method: 'POST' }); location.href = '/admin/login'; };
  const newCount = leads.filter((l) => l.status === 'new').length;

  return (
    <div className="ad-shell">
      <aside className="ad-side">
        <a className="ad-brand" href="/admin"><svg aria-hidden="true" width="30" height="30"><use href="#i-mark" /></svg><span><b>HIGHLAND</b><small>CAPITALS · ADMIN</small></span></a>
        <nav aria-label="Admin">
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => go(t.id)} aria-current={tab === t.id ? 'page' : undefined}>
              <Icon name={t.icon} /><span>{t.label}</span>{t.id === 'leads' && newCount > 0 && <em>{newCount}</em>}
            </button>
          ))}
        </nav>
        <div className="ad-side__foot">
          <a href="/" target="_blank" rel="noopener"><Icon name="external" size={16} /><span>View website</span></a>
          <button onClick={logout}><Icon name="logout" size={16} /><span>Sign out</span></button>
        </div>
      </aside>

      <div className="ad-main">
        <header className="ad-top">
          <div><h1>{TITLES[tab]}</h1><p>{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p></div>
          {(tab === 'overview' || tab === 'traffic') && (
            <div className="ad-range" role="group" aria-label="Date range">{[7, 14, 30, 90].map((d) => <button key={d} className={days === d ? 'on' : ''} onClick={() => setDays(d)}>{d}d</button>)}</div>
          )}
        </header>
        {status && !status.durable && tab !== 'settings' && (
          <button className="ad-banner" onClick={() => go('settings')}><Icon name="bolt" size={16} />Leads are being saved to temporary storage. Connect Redis so nothing is lost. <u>Fix it</u></button>
        )}
        {err && <div className="ad-banner ad-banner--err" role="alert">{err}</div>}
        <div className="ad-content" key={tab}>
          {tab === 'overview' && <OverviewView leads={leads} data={data} days={days} goto={go} />}
          {tab === 'leads' && <LeadsView leads={leads} loading={loading} onPatch={patch} onDelete={remove} onRefresh={() => { loadLeads(); notify('Refreshed'); }} notify={notify} />}
          {tab === 'traffic' && <TrafficView data={data} goSettings={() => go('settings')} />}
          {tab === 'settings' && <SettingsView status={status} />}
        </div>
      </div>

      <nav className="ad-bottom" aria-label="Admin (mobile)">
        {TABS.map((t) => <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => go(t.id)}><Icon name={t.icon} /><span>{t.label}</span>{t.id === 'leads' && newCount > 0 && <em>{newCount}</em>}</button>)}
      </nav>
      <Toast msg={toast} />
    </div>
  );
}
