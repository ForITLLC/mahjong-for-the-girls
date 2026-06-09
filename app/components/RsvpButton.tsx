'use client';

import type { MahjongEvent } from '../data/events';

// RSVP funnels into the on-page contact form rather than opening a mailto:
// — a mailto would surface Caroline's address in the visitor's mail client.
// We dispatch a prefill event the Contact form listens for, then smooth-scroll
// down to it so the visitor lands on a message that's already filled in.
export default function RsvpButton({ ev }: { ev: MahjongEvent }) {
  const soldOut = ev.status === 'sold-out';

  const onClick = () => {
    const message =
      `I'd love a seat at "${ev.title}" on ${ev.date} (${ev.time}) ` +
      `at ${ev.venue}, ${ev.neighborhood}.`;
    window.dispatchEvent(
      new CustomEvent('rsvp-prefill', { detail: { message } })
    );
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={soldOut}
      className={
        soldOut
          ? 'btn-ghost pointer-events-none opacity-40'
          : 'btn-gold whitespace-nowrap'
      }
    >
      {ev.status === 'waitlist' ? 'Join waitlist' : 'RSVP'}
    </button>
  );
}
