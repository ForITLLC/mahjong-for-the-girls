'use client';

import type { MahjongEvent } from '../data/events';

// The RSVP button opens our on-page RSVP modal (see Rsvp.tsx), which is
// mounted once on the page and listens for this 'open-rsvp' event. The modal
// collects Going / Maybe / Can't + a guest count and routes the reply to
// Caroline by mail — her address is only assembled client-side, never in HTML.
export default function RsvpButton({ ev }: { ev: MahjongEvent }) {
  const soldOut = ev.status === 'sold-out';

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
