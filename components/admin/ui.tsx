'use client';
import { useEffect } from 'react';
import { type LeadStatus, STATUS_LABEL } from './types';

const PATHS: Record<string, string> = {
  overview: 'M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10',
  leads: 'M16 11a4 4 0 10-8 0 4 4 0 008 0zM4 20c0-3.3 3.6-6 8-6s8 2.7 8 6',
  traffic: 'M4 19V9m6 10V5m6 14v-7m4 7H2',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z',
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
  phone: 'M5 3h4l2 5-2.5 1.5a11 11 0 005 5L15 12l5 2v4a2 2 0 01-2 2A16 16 0 013 5a2 2 0 012-2',
  mail: 'M3 6h18v12H3zM3 7l9 7 9-7',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  download: 'M12 4v12m0 0l-4-4m4 4l4-4M4 20h16',
  close: 'M6 6l12 12M18 6L6 18',
  logout: 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10',
  refresh: 'M20 11a8 8 0 10-2.3 5.7M20 4v7h-7',
  board: 'M4 4h5v16H4zM10 4h5v10h-5zM16 4h4v13h-4z',
  list: 'M4 6h16M4 12h16M4 18h16',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  copy: 'M9 9h10v11H9zM5 15V4h10',
  external: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
  up: 'M7 14l5-5 5 5',
  down: 'M7 10l5 5 5-5',
  globe: 'M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  bolt: 'M13 3L5 14h6l-1 7 8-11h-6z',
};

export function Icon({ name, size = 18 }: { name: keyof typeof PATHS | string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={PATHS[name] || ''} /></svg>;
}

export function StatusPill({ status }: { status: LeadStatus }) {
  return <span className={`ad-pill ad-pill--${status}`}>{STATUS_LABEL[status]}</span>;
}

export function Delta({ d }: { d: { text: string; up: boolean | null } }) {
  return <span className={`ad-delta ${d.up === null ? '' : d.up ? 'up' : 'down'}`}>{d.up !== null && <Icon name={d.up ? 'up' : 'down'} size={12} />}{d.text}</span>;
}

export function Card({ title, sub, right, children, className = '' }: { title?: string; sub?: string; right?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={`ad-card ${className}`}>
      {(title || right) && <header><div><h3>{title}</h3>{sub && <p>{sub}</p>}</div>{right}</header>}
      {children}
    </section>
  );
}

export function Confirm({ title, text, action, onYes, onNo }: { title: string; text: string; action: string; onYes: () => void; onNo: () => void }) {
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && onNo(); addEventListener('keydown', k); return () => removeEventListener('keydown', k); }, [onNo]);
  return (
    <div className="ad-modal" role="alertdialog" aria-modal="true" aria-label={title} onClick={onNo}>
      <div onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3><p>{text}</p>
        <div><button className="ad-btn" onClick={onNo}>Cancel</button><button className="ad-btn ad-btn--danger" onClick={onYes} autoFocus>{action}</button></div>
      </div>
    </div>
  );
}

export function Toast({ msg }: { msg: string }) {
  return <div className={`ad-toast${msg ? ' show' : ''}`} role="status" aria-live="polite">{msg}</div>;
}
