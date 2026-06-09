// Upcoming mahjong events. Edit this list to manage the calendar —
// no database, no admin panel. Keep `date` in ISO (YYYY-MM-DD) so the
// calendar sorts correctly. `status` drives the badge on each card.

export type EventStatus = 'open' | 'waitlist' | 'sold-out';

export interface MahjongEvent {
  id: string;
  title: string;
  /** ISO date, e.g. '2026-06-21' */
  date: string;
  /** Free-form display time, e.g. '6:30 PM' */
  time: string;
  venue: string;
  neighborhood: string;
  blurb: string;
  status: EventStatus;
  /** Level cue for newcomers vs regulars */
  level: 'All levels' | 'Beginners welcome' | 'Regulars';
}

export const events: MahjongEvent[] = [
  {
    id: 'solstice-social',
    title: 'Solstice Social',
    date: '2026-06-20',
    time: '6:30 PM',
    venue: 'The Conservatory',
    neighborhood: 'Capitol Hill',
    blurb:
      'Long light, low music, and tiles on the table. Our first night of summer — bring a friend, leave with three.',
    status: 'open',
    level: 'All levels',
  },
  {
    id: 'beginners-table',
    title: "Beginners' Table",
    date: '2026-06-28',
    time: '2:00 PM',
    venue: 'Analog Coffee back room',
    neighborhood: 'Capitol Hill',
    blurb:
      'Never touched a tile? Perfect. We teach the whole thing over an afternoon and an iced matcha. No experience, no pressure.',
    status: 'open',
    level: 'Beginners welcome',
  },
  {
    id: 'rooftop-rounds',
    title: 'Rooftop Rounds',
    date: '2026-07-11',
    time: '7:00 PM',
    venue: 'Thompson Hotel Rooftop',
    neighborhood: 'Downtown',
    blurb:
      'Golden hour over Elliott Bay, a drink in hand, and a fast little tournament for anyone who wants one.',
    status: 'waitlist',
    level: 'All levels',
  },
  {
    id: 'sunday-house-game',
    title: 'The Sunday House Game',
    date: '2026-07-19',
    time: '4:00 PM',
    venue: "Caroline's place",
    neighborhood: 'Madrona',
    blurb:
      'The standing game. Small, warm, a little competitive. Address shared with confirmed guests.',
    status: 'open',
    level: 'Regulars',
  },
  {
    id: 'late-summer-salon',
    title: 'Late-Summer Salon',
    date: '2026-08-09',
    time: '6:00 PM',
    venue: 'Sit & Spin Studio',
    neighborhood: 'Fremont',
    blurb:
      'Multiple tables, rotating partners, and a host who makes sure no one sits out. The big one.',
    status: 'open',
    level: 'All levels',
  },
];
