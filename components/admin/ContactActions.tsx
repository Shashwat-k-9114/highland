'use client';
import { Icon } from './ui';
import type { Lead } from './types';
import { digitsOf } from './utils';

export type Channel = 'call' | 'whatsapp' | 'email' | 'sms';

const first = (l: Lead) => l.name.split(' ')[0] || 'there';
const MSG = (l: Lead) => `Hello ${first(l)}, this is Highland Capitals following up on your enquiry about commercial investment in Dubai.`;

export function contactHref(l: Lead, c: Channel): string {
  const tel = l.phone.replace(/[^\d+]/g, '');
  switch (c) {
    case 'call': return `tel:${tel}`;
    case 'sms': return `sms:${tel}?&body=${encodeURIComponent(MSG(l))}`;
    case 'whatsapp': return `https://wa.me/${digitsOf(l.phone)}?text=${encodeURIComponent(MSG(l))}`;
    case 'email': return `mailto:${l.email}?subject=${encodeURIComponent('Your Highland Capitals enquiry')}&body=${encodeURIComponent(`Hello ${first(l)},\n\nThank you for your interest in commercial investment in Dubai.\n\nKind regards,\nHighland Capitals`)}`;
  }
}

const META: Record<Channel, { label: string; icon: string }> = {
  call: { label: 'Call', icon: 'phone' },
  whatsapp: { label: 'WhatsApp', icon: 'whatsapp' },
  sms: { label: 'SMS', icon: 'sms' },
  email: { label: 'Email', icon: 'mail' },
};

/**
 * One-tap contact buttons for a lead. `compact` renders round icon buttons for rows and cards;
 * `full` renders labelled buttons for the lead drawer. Tapping any of them reports back via onContact
 * so the parent can move a "New" lead to "Contacted".
 */
export function ContactActions({ lead, onContact, variant = 'compact', channels = ['call', 'whatsapp', 'email'] }: {
  lead: Lead; onContact: (l: Lead, c: Channel) => void; variant?: 'compact' | 'full'; channels?: Channel[];
}) {
  return (
    <div className={`ad-contact ad-contact--${variant}`} onClick={(e) => e.stopPropagation()}>
      {channels.filter((c) => c !== 'email' || !!lead.email).map((c) => {
        const m = META[c];
        return (
          <a key={c} className={`ad-contact__b ad-contact__b--${c}`} href={contactHref(lead, c)} {...(c === 'whatsapp' ? { target: '_blank', rel: 'noopener' } : {})}
            onClick={() => onContact(lead, c)} aria-label={`${m.label} ${lead.name}`} title={m.label}>
            <Icon name={m.icon} size={variant === 'full' ? 18 : 17} />{variant === 'full' && <span>{m.label}</span>}
          </a>
        );
      })}
    </div>
  );
}
