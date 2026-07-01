'use client';

import type { MahjongEvent } from '../data/events';

// The RSVP button. For a REAL Partiful event (ev.rsvpUrl set) it deep-links
// straight to that event's Partiful page, where RSVPs are actually tracked.
// Otherwise it opens our on-page RSVP modal (see Rsvp.tsx), mounted once and
// listening for 'open-rsvp'. The modal collects Going / Maybe / Can't + a guest
// count and routes the reply to Caroline by mail — her address is only assembled
// client-side, never in HTML.
export default function RsvpButton({ ev }: { ev: MahjongEvent }) {
  const soldOut = ev.status === 'sold-out';

  // Real Partiful event → link out to Partiful to RSVP.
  if (ev.rsvpUrl && !soldOut) {
    return (
      <a
        href={ev.rsvpUrl}
        target="_blank"
        rel="noopener"
        className="btn-gold whitespace-nowrap"
      >
        RSVP on Partiful
      </a>
    );
  }

  const onClick = () => {
    window.dispatchEvent(
      new CustomEvent('open-rsvp', { detail: { eventId: ev.id } })
    );
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
