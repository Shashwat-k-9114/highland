'use client';
import { useEffect, useMemo, useState } from 'react';
import { Confirm, Icon, StatusPill } from './ui';
import { type Channel, ContactActions } from './ContactActions';
import { type Lead, type LeadStatus, STATUSES, STATUS_LABEL } from './types';
import { ago, countryName, digitsOf, download, flag, fullDate, initials, toCsv } from './utils';

type Props = {
  leads: Lead[];
  loading: boolean;
  onPatch: (ids: string[], patch: Partial<Pick<Lead, 'status' | 'starred' | 'notes'>>) => Promise<void>;
  onDelete: (ids: string[]) => Promise<void>;
  onRefresh: () => void;
  notify: (m: string) => void;
};

const PAGE = 25;

export default function LeadsView({ leads, loading, onPatch, onDelete, onRefresh, notify }: Props) {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'all' | 'starred' | LeadStatus>('all');
  const [source, setSource] = useState('all');
  const [range, setRange] = useState<'all' | '1' | '7' | '30'>('all');
  const [sort, setSort] = useState<'new' | 'old' | 'name'>('new');
  const [view, setView] = useState<'table' | 'board'>('table');
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [confirm, setConfirm] = useState<string[] | null>(null);
  const [filters, setFilters] = useState(false);

  useEffect(() => { const h = location.hash.match(/lead=([\w]+)/); if (h) setOpen(h[1]); }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length, starred: leads.filter((l) => l.starred).length };
    for (const s of STATUSES) c[s] = leads.filter((l) => l.status === s).length;
    return c;
  }, [leads]);
  const sources = useMemo(() => [...new Set(leads.map((l) => l.source))], [leads]);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase(), d = digitsOf(q);
    const since = range === 'all' ? 0 : Date.now() - Number(range) * 86400e3;
    const out = leads.filter((l) =>
      (status === 'all' || (status === 'starred' ? l.starred : l.status === status)) &&
      (source === 'all' || l.source === source) &&
      (!since || new Date(l.createdAt).getTime() >= since) &&
      (!t || l.name.toLowerCase().includes(t) || l.email.includes(t) || (d.length > 2 && digitsOf(l.phone).includes(d)) || l.notes.toLowerCase().includes(t) || l.passNo.toLowerCase().includes(t)));
    out.sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'old' ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt));
    return out;
  }, [leads, q, status, source, range, sort]);

  useEffect(() => { setPage(0); }, [q, status, source, range, sort]);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const visible = rows.slice(page * PAGE, page * PAGE + PAGE);
  const current = open ? leads.find((l) => l.id === open) || null : null;
  const allSel = visible.length > 0 && visible.every((l) => sel.has(l.id));

  const toggle = (id: string) => setSel((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const exportCsv = (list: Lead[]) => { download(`highland-leads-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(list)); notify(`Exported ${list.length} lead${list.length === 1 ? '' : 's'}`); };

  /* Reaching out to a brand-new lead moves it to "Contacted" so the pipeline stays honest. */
  const contacted = (l: Lead, c: Channel) => {
    if (l.status !== 'new') return;
    onPatch([l.id], { status: 'contacted' });
    notify(`${l.name.split(' ')[0]} marked as contacted${c === 'call' ? '' : ' (' + c + ')'}`);
  };

  const doDelete = async () => {
    if (!confirm) return;
    await onDelete(confirm); setSel(new Set()); setConfirm(null); if (open && confirm.includes(open)) setOpen(null);
  };

  return (
    <div className="ad-leads">
      <div className={`ad-toolbar${filters ? ' open' : ''}`}>
        <label className="ad-search"><Icon name="search" size={16} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, phone, notes…" aria-label="Search leads" /></label>
        <button className={`ad-btn ad-filterbtn${filters ? ' on' : ''}`} onClick={() => setFilters(!filters)} aria-expanded={filters} aria-label="Filters"><Icon name="menu" size={16} /><span>Filters</span></button>
        <select value={source} onChange={(e) => setSource(e.target.value)} aria-label="Filter by source"><option value="all">All sources</option>{sources.map((s) => <option key={s}>{s}</option>)}</select>
        <select value={range} onChange={(e) => setRange(e.target.value as typeof range)} aria-label="Filter by date"><option value="all">All time</option><option value="1">Last 24 hours</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option></select>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort"><option value="new">Newest first</option><option value="old">Oldest first</option><option value="name">Name A–Z</option></select>
        <div className="ad-seg" role="tablist" aria-label="View">
          <button role="tab" aria-selected={view === 'table'} className={view === 'table' ? 'on' : ''} onClick={() => setView('table')} title="Table"><Icon name="list" size={16} /></button>
          <button role="tab" aria-selected={view === 'board'} className={view === 'board' ? 'on' : ''} onClick={() => setView('board')} title="Pipeline board"><Icon name="board" size={16} /></button>
        </div>
        <button className="ad-btn" onClick={onRefresh} title="Refresh"><Icon name="refresh" size={16} /></button>
        <button className="ad-btn" onClick={() => exportCsv(rows)} disabled={!rows.length}><Icon name="download" size={16} />Export CSV</button>
      </div>

      <div className="ad-chips" role="tablist" aria-label="Status">
        {(['all', ...STATUSES, 'starred'] as const).map((s) => (
          <button key={s} role="tab" aria-selected={status === s} className={`ad-chip${status === s ? ' on' : ''}`} onClick={() => setStatus(s)}>
            {s === 'all' ? 'All' : s === 'starred' ? '★ Starred' : STATUS_LABEL[s]}<em>{counts[s]}</em>
          </button>
        ))}
      </div>

      {sel.size > 0 && (
        <div className="ad-bulk" role="region" aria-label="Bulk actions">
          <b>{sel.size} selected</b>
          <select defaultValue="" onChange={async (e) => { const v = e.target.value as LeadStatus; if (v) { await onPatch([...sel], { status: v }); notify(`Marked ${sel.size} as ${STATUS_LABEL[v]}`); e.target.value = ''; } }} aria-label="Set status for selected">
            <option value="" disabled>Set status…</option>{STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
          <button className="ad-btn" onClick={() => exportCsv(leads.filter((l) => sel.has(l.id)))}><Icon name="download" size={16} />Export</button>
          <button className="ad-btn ad-btn--danger" onClick={() => setConfirm([...sel])}><Icon name="trash" size={16} />Delete</button>
          <button className="ad-btn ad-btn--ghost" onClick={() => setSel(new Set())}>Clear</button>
        </div>
      )}

      {loading && !leads.length ? <div className="ad-skel">{Array.from({ length: 6 }, (_, i) => <i key={i} />)}</div>
        : !rows.length ? (
          <div className="ad-emptybox">
            <Icon name="leads" size={34} />
            <h3>{leads.length ? 'No leads match these filters' : 'No leads yet'}</h3>
            <p>{leads.length ? 'Try clearing the search or filters.' : 'Submissions from the website form and the Investor Pass pop-up will appear here the moment they come in.'}</p>
          </div>
        ) : view === 'table' ? (
          <>
            <div className="ad-tablewrap">
              <table className="ad-table">
                <thead><tr>
                  <th className="c"><input type="checkbox" checked={allSel} onChange={() => setSel((s) => { const n = new Set(s); visible.forEach((l) => (allSel ? n.delete(l.id) : n.add(l.id))); return n; })} aria-label="Select all on page" /></th>
                  <th>Lead</th><th>Phone</th><th>Contact</th><th>Source</th><th>Status</th><th>Received</th><th className="c" aria-label="Starred" />
                </tr></thead>
                <tbody>
                  {visible.map((l) => (
                    <tr key={l.id} className={`${open === l.id ? 'on' : ''}${sel.has(l.id) ? ' sel' : ''}`} onClick={() => setOpen(l.id)}>
                      <td className="c" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={sel.has(l.id)} onChange={() => toggle(l.id)} aria-label={`Select ${l.name}`} /></td>
                      <td><div className="ad-who"><span className="ad-av">{initials(l.name)}</span><div><b>{l.name}{l.submissions > 1 && <em title="Submitted again">×{l.submissions}</em>}</b><small>{l.email}</small></div></div></td>
                      <td className="ad-mono">{l.phone}</td>
                      <td><ContactActions lead={l} onContact={contacted} /></td>
                      <td><span className="ad-src">{l.source}</span></td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <select className={`ad-statsel ad-pill--${l.status}`} value={l.status} onChange={(e) => onPatch([l.id], { status: e.target.value as LeadStatus })} aria-label={`Status for ${l.name}`}>
                          {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                        </select>
                      </td>
                      <td title={fullDate(l.createdAt)}>{ago(l.createdAt)}</td>
                      <td className="c" onClick={(e) => e.stopPropagation()}><button className={`ad-star${l.starred ? ' on' : ''}`} onClick={() => onPatch([l.id], { starred: !l.starred })} aria-label={l.starred ? 'Unstar' : 'Star'} aria-pressed={l.starred}><Icon name="star" size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="ad-cards">
              {visible.map((l) => (
                <li key={l.id} className="ad-lcard" onClick={() => setOpen(l.id)}>
                  <div className="ad-lcard__top">
                    <span className="ad-av">{initials(l.name)}</span>
                    <div><b>{l.name}</b><small>{ago(l.createdAt)} · {l.source}</small></div>
                    <button className={`ad-star${l.starred ? ' on' : ''}`} onClick={(e) => { e.stopPropagation(); onPatch([l.id], { starred: !l.starred }); }} aria-label={l.starred ? 'Unstar' : 'Star'} aria-pressed={l.starred}><Icon name="star" size={18} /></button>
                  </div>
                  <div className="ad-lcard__info"><span className="ad-mono">{l.phone}</span><span>{l.email}</span></div>
                  <div className="ad-lcard__foot"><StatusPill status={l.status} /><ContactActions lead={l} onContact={contacted} channels={['call', 'whatsapp', 'sms', 'email']} /></div>
                </li>
              ))}
            </ul>
            <div className="ad-pager"><span>{rows.length} lead{rows.length === 1 ? '' : 's'}</span>
              <div><button className="ad-btn" disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</button><span>Page {page + 1} of {pages}</span><button className="ad-btn" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Next</button></div></div>
          </>
        ) : (
          <div className="ad-board">
            {STATUSES.map((s) => {
              const col = rows.filter((l) => l.status === s);
              return (
                <div key={s} className={`ad-col ad-col--${s}`} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { const id = e.dataTransfer.getData('text/plain'); if (id) onPatch([id], { status: s }); }}>
                  <h4><StatusPill status={s} /><em>{col.length}</em></h4>
                  <div>
                    {col.map((l) => (
                      <article key={l.id} className="ad-kcard" draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', l.id)} onClick={() => setOpen(l.id)}>
                        <div className="ad-who"><span className="ad-av">{initials(l.name)}</span><div><b>{l.name}</b><small>{ago(l.createdAt)}</small></div>{l.starred && <span className="ad-star on"><Icon name="star" size={14} /></span>}</div>
                        <p>{l.phone}</p><p className="mut">{l.email}</p>
                        <ContactActions lead={l} onContact={contacted} />
                      </article>
                    ))}
                    {!col.length && <p className="ad-empty">Drop leads here</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {current && <Drawer lead={current} onContact={contacted} onClose={() => setOpen(null)} onPatch={onPatch} onDelete={() => setConfirm([current.id])} notify={notify} />}
      {confirm && <Confirm title={`Delete ${confirm.length} lead${confirm.length === 1 ? '' : 's'}?`} text="This permanently removes the lead and its notes. This cannot be undone." action="Delete" onYes={doDelete} onNo={() => setConfirm(null)} />}
    </div>
  );
}

function Drawer({ lead, onContact, onClose, onPatch, onDelete, notify }: { lead: Lead; onContact: (l: Lead, c: Channel) => void; onClose: () => void; onPatch: Props['onPatch']; onDelete: () => void; notify: (m: string) => void }) {
  const [notes, setNotes] = useState(lead.notes);
  const [saved, setSaved] = useState(false);
  useEffect(() => { setNotes(lead.notes); setSaved(false); }, [lead.id, lead.notes]);
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); addEventListener('keydown', k); return () => removeEventListener('keydown', k); }, [onClose]);
  const saveNotes = async () => { if (notes === lead.notes) return; await onPatch([lead.id], { notes }); setSaved(true); setTimeout(() => setSaved(false), 1800); };
  const copy = (t: string) => { navigator.clipboard?.writeText(t); notify('Copied'); };
  const utm = Object.entries(lead.utm);
  return (
    <>
      <div className="ad-scrim" onClick={onClose} />
      <aside className="ad-drawer" role="dialog" aria-label={`Lead: ${lead.name}`}>
        <header>
          <span className="ad-av ad-av--lg">{initials(lead.name)}</span>
          <div><h3>{lead.name}</h3><p>Received {fullDate(lead.createdAt)}</p></div>
          <button className={`ad-star${lead.starred ? ' on' : ''}`} onClick={() => onPatch([lead.id], { starred: !lead.starred })} aria-label="Star" aria-pressed={lead.starred}><Icon name="star" size={18} /></button>
          <button className="ad-x" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        </header>
        <div className="ad-drawer__body">
          <ContactActions lead={lead} onContact={onContact} variant="full" channels={['call', 'whatsapp', 'sms', 'email']} />

          <h4>Pipeline stage</h4>
          <div className="ad-stages">{STATUSES.map((s) => <button key={s} className={`ad-pill ad-pill--${s}${lead.status === s ? ' on' : ''}`} onClick={() => onPatch([lead.id], { status: s })}>{lead.status === s && <Icon name="check" size={12} />}{STATUS_LABEL[s]}</button>)}</div>

          <h4>Contact</h4>
          <dl className="ad-dl">
            <div><dt>Email</dt><dd>{lead.email}<button onClick={() => copy(lead.email)} aria-label="Copy email"><Icon name="copy" size={14} /></button></dd></div>
            <div><dt>Phone</dt><dd className="ad-mono">{lead.phone}<button onClick={() => copy(lead.phone)} aria-label="Copy phone"><Icon name="copy" size={14} /></button></dd></div>
            <div><dt>Location</dt><dd>{lead.country ? `${flag(lead.country)} ${lead.city ? lead.city + ', ' : ''}${countryName(lead.country)}` : 'Unknown'}</dd></div>
            <div><dt>Device</dt><dd>{lead.device || 'Unknown'}</dd></div>
          </dl>

          <h4>Notes <em className={`ad-saved${saved ? ' show' : ''}`}>Saved ✓</em></h4>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={saveNotes} placeholder="Call notes, budget discussed, next step…" rows={5} maxLength={5000} aria-label="Notes" />

          <h4>Where they came from</h4>
          <dl className="ad-dl">
            <div><dt>Source</dt><dd>{lead.source}</dd></div>
            {lead.intent && <div><dt>Interested in</dt><dd>{lead.intent}</dd></div>}
            {lead.company && <div><dt>Company</dt><dd>{lead.company}</dd></div>}
            {lead.investorCity && <div><dt>Investor city</dt><dd>{lead.investorCity}</dd></div>}
            <div><dt>Pass no.</dt><dd className="ad-mono">{lead.passNo || '·'}</dd></div>
            {lead.submissions > 1 && <div><dt>Submissions</dt><dd>{lead.submissions} (they enquired again)</dd></div>}
            <div><dt>Page</dt><dd className="ad-trunc" title={lead.page}>{/^https?:\/\//.test(lead.page) ?<a href={lead.page} target="_blank" rel="noopener">{lead.page.replace(/^https?:\/\//, '')}<Icon name="external" size={12} /></a> : '·'}</dd></div>
            <div><dt>Referrer</dt><dd className="ad-trunc" title={lead.referrer}>{lead.referrer ? lead.referrer.replace(/^https?:\/\//, '') : 'Direct'}</dd></div>
            {utm.map(([k, v]) => <div key={k}><dt>{k.replace('utm_', 'UTM ')}</dt><dd>{v}</dd></div>)}
          </dl>
        </div>
        <footer><button className="ad-btn ad-btn--danger" onClick={onDelete}><Icon name="trash" size={16} />Delete lead</button><span>Updated {ago(lead.updatedAt)}</span></footer>
      </aside>
    </>
  );
}
