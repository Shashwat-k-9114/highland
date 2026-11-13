'use client';
import { useEffect, useRef } from 'react';

type Conn = { saveData?: boolean; effectiveType?: string };

/** Lazy background video: nothing downloads until the card is near the viewport; pauses when scrolled away. */
export default function VideoBg({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const conn = (navigator as Navigator & { connection?: Conn }).connection || {};
    if (conn.saveData || /(^|-)2g|3g/.test(conn.effectiveType || '') || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = v.parentElement as HTMLElement;
    const onPlaying = () => box.classList.add('ready');
    v.addEventListener('playing', onPlaying, { once: true });
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !document.hidden) {
        if (!v.src) { v.src = src + '.mp4'; v.load(); }
        v.play().catch(() => {});
      } else if (!v.paused) v.pause();
    }, { rootMargin: '25% 0px' });
    io.observe(box);
    const vis = () => { if (document.hidden) v.pause(); };
    document.addEventListener('visibilitychange', vis);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', vis); v.removeEventListener('playing', onPlaying); };
  }, [src]);
  return <video ref={ref} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} />;
}
