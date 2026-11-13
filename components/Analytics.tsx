'use client';
import { useEffect } from 'react';
import { pageview, track } from '@/lib/track';

/** Page view + engagement tracking (scroll depth, 15 s engaged, CTA / WhatsApp / call clicks). */
export default function Analytics() {
  useEffect(() => {
    pageview();
    const sent = new Set<number>();
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (max <= 0) return;
      const pct = (scrollY / max) * 100;
      for (const t of [25, 50, 75, 90]) if (pct >= t && !sent.has(t)) { sent.add(t); track(`scroll_${t}`); }
    };
    addEventListener('scroll', onScroll, { passive: true });
    const engaged = setTimeout(() => track('engaged_15s'), 15000);

    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t?.closest) return;
      const wa = t.closest('[data-wa]'), call = t.closest('[data-call]'), cta = t.closest('[data-xp]');
      const place = (t.closest('section,header,footer,nav')?.id) || t.closest('.mbar') && 'mobile_bar' || t.closest('footer') && 'footer' || 'page';
      if (wa) track('whatsapp_click', { place });
      else if (call) track('call_click', { place });
      else if (cta) track('cta_click', { place, label: (cta.textContent || '').trim().slice(0, 40) });
    };
    document.addEventListener('click', onClick);
    return () => { removeEventListener('scroll', onScroll); clearTimeout(engaged); document.removeEventListener('click', onClick); };
  }, []);
  return null;
}
