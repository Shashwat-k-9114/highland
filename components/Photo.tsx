'use client';
import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { unsplash } from '@/lib/site';

type Props = {
  /** Unsplash photo id (without host) or a full https src. */
  id: string;
  alt: string;
  sizes: string;
  /** Pixel width of the origin image the optimiser starts from. */
  w?: number;
  priority?: boolean;
  par?: boolean;
  as?: 'div' | 'figure';
  className?: string;
  children?: ReactNode;
  label?: string;
};

/** A `.ph` photo frame: AVIF/WebP via next/image, responsive srcset, lazy, fades in once decoded. */
export default function Photo({ id, alt, sizes, w = 1800, priority, par, as = 'div', className = '', children }: Props) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  const [broken, setBroken] = useState(false);
  useEffect(() => { if (ref.current?.complete && ref.current.naturalWidth) setLoaded(true); }, []);
  const src = id.startsWith('http') ? id : unsplash(id, w, 80);
  const Tag = as;
  return (
    <Tag className={`ph ${className}${broken ? ' broken' : ''}`} {...(par ? { 'data-par': '' } : {})}>
      <Image ref={ref} src={src} alt={alt} fill sizes={sizes} quality={75} priority={priority} className={loaded ? 'in' : ''} onLoad={() => setLoaded(true)} onError={() => setBroken(true)} />
      {children}
    </Tag>
  );
}
