'use client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { HERO_REEL, PHOTOS, unsplash } from '@/lib/site';

type Conn = { saveData?: boolean; effectiveType?: string };

/**
 * Hero: the poster photo is the LCP element (priority, optimised). The cinematic reel (self-hosted, ~1-2 MB per clip)
 * starts only after the page has loaded, and two stacked <video>s crossfade between clips.
 */
export default function HeroReel() {
  const box = useRef<HTMLDivElement>(null);
  const a = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = box.current, A = a.current, B = b.current;
    if (!el || !A || !B) return;
    const conn = (navigator as Navigator & { connection?: Conn }).connection || {};
    if (conn.saveData || /(^|-)2g|3g/.test(conn.effectiveType || '') || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const list = (matchMedia('(max-width: 820px)').matches ? HERO_REEL.mobile : HERO_REEL.desktop).map((s) => s + '.mp4');
    let cur = A, nxt = B, i = 0, fading = false, failed = 0, stopped = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const load = (v: HTMLVideoElement, k: number) => { v.src = list[k % list.length]; v.load(); };
    const cleanups: (() => void)[] = [];

    const start = () => {
      if (stopped) return;
      A.preload = 'auto'; load(A, 0);
      A.classList.add('on');
      const onPlay = () => { el.classList.add('ready'); if (!nxt.src) { nxt.preload = 'auto'; load(nxt, 1); } };
      A.addEventListener('playing', onPlay, { once: true });
      for (const v of [A, B]) {
        const err = () => { if (++failed >= list.length) return; if (v === cur) { i++; load(v, i); v.play().catch(() => {}); } };
        const tu = () => {
          if (v !== cur || fading || list.length < 2 || !v.duration) return;
          if (v.duration - v.currentTime < 1.4) {
            fading = true; i++;
            nxt.currentTime = 0; nxt.play().catch(() => {});
            nxt.classList.add('on'); cur.classList.remove('on');
            timers.push(setTimeout(() => { const old = cur; cur = nxt; nxt = old; old.pause(); load(old, i + 1); fading = false; }, 1500));
          }
        };
        v.addEventListener('error', err); v.addEventListener('timeupdate', tu);
        cleanups.push(() => { v.removeEventListener('error', err); v.removeEventListener('timeupdate', tu); });
      }
      A.play().catch(() => {});
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !document.hidden) cur.play().catch(() => {}); else cur.pause(); }, { rootMargin: '25% 0px' });
      io.observe(el); cleanups.push(() => io.disconnect());
      const vis = () => { if (document.hidden) cur.pause(); };
      document.addEventListener('visibilitychange', vis); cleanups.push(() => document.removeEventListener('visibilitychange', vis));
    };

    // Wait for the page to finish loading so the reel never competes with the LCP image.
    const kick = () => { const ric = (window as unknown as { requestIdleCallback?: (f: () => void, o?: object) => void }).requestIdleCallback; ric ? ric(start, { timeout: 2500 }) : timers.push(setTimeout(start, 800)); };
    if (document.readyState === 'complete') kick(); else window.addEventListener('load', kick, { once: true });
    return () => { stopped = true; timers.forEach(clearTimeout); cleanups.forEach((f) => f()); window.removeEventListener('load', kick); };
  }, []);

  return (
    <div className="vid" ref={box}>
      <Image src={unsplash(PHOTOS.hero, 2400, 80)} alt="" fill priority fetchPriority="high" sizes="100vw" quality={70} className="vid__poster" />
      <video ref={a} className="reel" muted playsInline preload="none" aria-hidden="true" tabIndex={-1} />
      <video ref={b} className="reel" muted playsInline preload="none" aria-hidden="true" tabIndex={-1} />
    </div>
  );
}
