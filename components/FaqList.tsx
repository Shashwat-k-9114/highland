'use client';
import { useState } from 'react';

/** Accessible accordion. Answers stay in the DOM (crawlable); open/close is a CSS grid-rows transition. */
export default function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number>(0);
  return (
    <div className="faq" id="faqList">
      {items.map((f, i) => (
        <div className={`faq__item reveal${open === i ? ' open' : ''}`} key={f.q}>
          <h3>
            <button type="button" className="faq__q" aria-expanded={open === i} aria-controls={`faq-a-${i}`} id={`faq-q-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
              <span>{f.q}</span>
            </button>
          </h3>
          <div className="faq__a" id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>
            <div><p>{f.a}</p></div>
          </div>
        </div>
      ))}
    </div>
  );
}
