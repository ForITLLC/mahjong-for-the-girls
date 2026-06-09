'use client';

import type { MahjongEvent } from '../data/events';
import { buildMailto } from '../lib/email';

// Client-only RSVP action: the mailto is assembled at click time from the
// decoded address, so no email address is baked into the static HTML.
export default function RsvpButton({ ev }: { ev: MahjongEvent }) {
  const soldOut = ev.status === 'sold-out';

  const onClick = () => {
    const subject = `RSVP — ${ev.title}`;
    const body = `Hi,\n\nI'd love a seat at "${ev.title}" on ${ev.date} (${ev.time}) at ${ev.venue}, ${ev.neighborhood}.\n\nName:\nBrought a friend?:\n\nThanks!`;
    const href = buildMailto(subject, body);
    if (href !== '#') window.location.href = href;
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
