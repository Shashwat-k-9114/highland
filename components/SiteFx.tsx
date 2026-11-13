'use client';
import { useEffect } from 'react';
import { openLead } from '@/lib/track';

/**
 * Progressive enhancement for the server-rendered page: smooth scroll (Lenis, loaded lazily), scroll reveals,
 * counters, parallax, nav state, ripple, tilt and magnetic buttons. Everything here is cosmetic: the page is
 * fully readable and usable without it.
 */
export default function SiteFx() {
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
    const wide = () => matchMedia('(min-width: 821px)').matches;
    const $ = (s: string) => document.querySelector<HTMLElement>(s);
    const $$ = (s: string) => [...document.querySelectorAll<HTMLElement>(s)];
    const off: (() => void)[] = [];
    const nav = $('#nav'), rail = $('#rail'), heroFrame = $('#heroFrame'), hero = $('.hero');

    /* ── Lead popup triggers (any [data-xp]) ── */
    const onOpen = (e: MouseEvent) => {
      const t = (e.target as Element).closest?.('[data-xp]');
      if (!t || t.closest('#xp')) return;
      e.preventDefault();
      openLead();
    };
    document.addEventListener('click', onOpen);
    off.push(() => document.removeEventListener('click', onOpen));

    /* ── Reveals + headline lines (IntersectionObserver, staggered per batch) ── */
    const showQ: HTMLElement[] = [];
    let qt: ReturnType<typeof setTimeout> | null = null;
    const flush = () => {
      showQ.splice(0).forEach((el, i) => {
        el.style.transitionDelay = `${i * 70}ms`;
        el.classList.add('in');
        if (el.classList.contains('reveal')) setTimeout(() => { el.classList.remove('reveal', 'in'); el.style.transitionDelay = ''; }, 1400 + i * 70);
      });
      qt = null;
    };
    const rio = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { rio.unobserve(en.target); showQ.push(en.target as HTMLElement); qt ||= setTimeout(flush, 30); } }), { rootMargin: '0px 0px -6% 0px' });
    $$('.reveal, section:not(.hero) .d2').forEach((el) => rio.observe(el));
    off.push(() => rio.disconnect());

    /* ── Counters ── */
    const cio = new IntersectionObserver((es) => es.forEach((en) => {
      if (!en.isIntersecting) return;
      cio.unobserve(en.target);
      const el = en.target as HTMLElement, to = parseFloat(el.dataset.count || '0'), dec = +(el.dataset.dec || 0);
      if (reduced) { el.textContent = to.toFixed(dec); return; }
      const t0 = performance.now();
      const step = (t: number) => { const p = Math.min((t - t0) / 2000, 1); el.textContent = (to * (1 - (1 - p) ** 2)).toFixed(dec); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }), { threshold: 0.4 });
    $$('[data-count]').forEach((el) => { if (!reduced) el.textContent = (0).toFixed(+(el.dataset.dec || 0)); cio.observe(el); });
    off.push(() => cio.disconnect());

    /* ── Scroll spy ── */
    const links = $$('[data-spy]');
    const spy = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) links.forEach((l) => l.classList.toggle('active', l.dataset.spy === en.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
    links.forEach((l) => { const t = document.getElementById(l.dataset.spy || ''); t && spy.observe(t); });
    off.push(() => spy.disconnect());

    /* ── Scroll-linked: nav, progress rail, hero drift, photo parallax (single rAF-throttled listener) ── */
    const par = new Set<HTMLElement>();
    const pio = new IntersectionObserver((es) => es.forEach((en) => (en.isIntersecting ? par.add(en.target as HTMLElement) : par.delete(en.target as HTMLElement))), { rootMargin: '10% 0px' });
    if (!reduced) $$('[data-par], .lcard .ph, .band > .vid').forEach((el) => pio.observe(el));
    off.push(() => pio.disconnect());
    let ticking = false;
    const frame = () => {
      ticking = false;
      const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
      nav?.classList.toggle('scrolled', y > 80);
      if (rail) rail.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      if (reduced || !wide()) return;
      if (heroFrame && hero) heroFrame.style.setProperty('--hy', Math.min(Math.max(y / hero.offsetHeight, 0), 1) * 14 + '%');
      par.forEach((el) => {
        const r = el.getBoundingClientRect(), p = (innerHeight - r.top) / (innerHeight + r.height);
        el.style.setProperty('--py', ((p - 0.5) * (el.classList.contains('vid') ? 8 : 6)).toFixed(2) + '%');
      });
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    frame();
    off.push(() => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); });

    /* ── Smooth scroll (Lenis, lazy) + in-page anchors ── */
    let lenis: NonNullable<Window['__hcLenis']> | null = null;
    let raf = 0, dead = false;
    const initLenis = async () => {
      if (reduced || dead) return;
      const { default: Lenis } = await import('lenis');
      if (dead) return;
      const l = new Lenis({ duration: 1.1, easing: (t: number) => 1 - Math.pow(1 - t, 3), smoothWheel: true, wheelMultiplier: 0.95, prevent: (n: Element) => !!n.closest?.('#xp') });
      lenis = l as unknown as NonNullable<Window['__hcLenis']>;
      window.__hcLenis = lenis;
      const loop = (t: number) => { l.raf(t); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
      off.push(() => { l.destroy(); window.__hcLenis = undefined; });
    };
    const ric = (window as unknown as { requestIdleCallback?: (f: () => void, o?: object) => number }).requestIdleCallback;
    const lt = ric ? ric(() => { initLenis(); }, { timeout: 1500 }) : (setTimeout(initLenis, 600) as unknown as number);
    off.push(() => { dead = true; cancelAnimationFrame(raf); if (!ric) clearTimeout(lt); });

    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin || u.pathname !== location.pathname || !u.hash) return;
      const id = u.hash.slice(1);
      const el = id === 'top' ? document.body : document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      history.pushState(null, '', u.hash);
      if (id === 'top') lenis ? lenis.scrollTo(0, { duration: 1.6 }) : scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      else lenis ? lenis.scrollTo(el, { duration: 1.6, offset: -80 }) : el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    };
    document.addEventListener('click', onAnchor);
    off.push(() => document.removeEventListener('click', onAnchor));

    /* ── Button ripple ── */
    const onDown = (e: PointerEvent) => {
      const b = (e.target as Element).closest?.('.btn') as HTMLElement | null;
      if (!b || reduced) return;
      const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height), s = document.createElement('span');
      s.className = 'ripple';
      s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
      b.appendChild(s);
      setTimeout(() => s.remove(), 750);
    };
    document.addEventListener('pointerdown', onDown);
    off.push(() => document.removeEventListener('pointerdown', onDown));

    /* ── Card tilt + magnetic buttons (mouse only) ── */
    if (fine && !reduced) {
      $$('.ccard').forEach((el) => el.setAttribute('data-tilt', ''));
      $$('[data-tilt], .lcard').forEach((el) => {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
          el.style.setProperty('--mx', x * 100 + '%'); el.style.setProperty('--my', y * 100 + '%');
          el.style.setProperty('--ry', ((x - 0.5) * 6).toFixed(2) + 'deg'); el.style.setProperty('--rx', ((0.5 - y) * 5).toFixed(2) + 'deg');
        };
        const leave = () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); };
        el.classList.add('tilt'); el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
        off.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); });
      });
      $$('[data-magnetic]').forEach((b) => {
        const move = (e: PointerEvent) => { const r = b.getBoundingClientRect(); b.style.setProperty('--bx', (e.clientX - r.left - r.width / 2) * 0.18 + 'px'); b.style.setProperty('--by', (e.clientY - r.top - r.height / 2) * 0.28 + 'px'); };
        const leave = () => { b.style.setProperty('--bx', '0px'); b.style.setProperty('--by', '0px'); };
        b.addEventListener('pointermove', move); b.addEventListener('pointerleave', leave);
        off.push(() => { b.removeEventListener('pointermove', move); b.removeEventListener('pointerleave', leave); });
      });
    }

    return () => off.forEach((f) => f());
  }, []);
  return null;
}
