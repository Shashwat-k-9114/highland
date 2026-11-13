'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const LeadPopup = dynamic(() => import('./LeadPopup'), { ssr: false });

/** Loads the Investor Pass popup chunk when the browser is idle (or instantly on the first click). */
export default function PopupLoader() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const go = () => setOn(true);
    window.addEventListener('hc:load-popup', go);
    const ric = (window as unknown as { requestIdleCallback?: (f: () => void, o?: object) => number }).requestIdleCallback;
    const t = ric ? ric(go, { timeout: 4000 }) : (setTimeout(go, 2500) as unknown as number);
    const warm = () => setOn(true);
    document.addEventListener('pointerover', warm, { once: true, passive: true });
    return () => { window.removeEventListener('hc:load-popup', go); document.removeEventListener('pointerover', warm); if (!ric) clearTimeout(t); };
  }, []);
  return on ? <LeadPopup /> : null;
}
