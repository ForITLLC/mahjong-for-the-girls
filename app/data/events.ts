// The real cadence: Caroline runs two standing tables, every other week —
// Thursday evenings at 6:30 and Saturday afternoons at 12:30. Rather than hand-
// maintain a list, we generate the next few upcoming instances from each slot's
// anchor date (her first real sessions) so the calendar stays current between
// deploys. Edit the slots below to change the pattern.

export type EventStatus = 'open' | 'waitlist' | 'sold-out';

export interface MahjongEvent {
  id: string;
  title: string;
  /** ISO date, e.g. '2026-07-09' */
  date: string;
  /** Free-form display time, e.g. '6:30 PM' */
  time: string;
  venue: string;
  neighborhood: string;
  blurb: string;
  status: EventStatus;
  /** Level cue for newcomers vs regulars */
  level: 'All levels' | 'Beginners welcome' | 'Regulars';
  /** Shown as a small cue that this is a standing, recurring table */
  cadence: string;
}

interface Slot {
  key: string;
  title: string;
  /** Anchor: a real past/known occurrence (any date on the right weekday). */
  anchor: string;
  time: string;
  blurb: string;
  level: MahjongEvent['level'];
}

// Every other week (14-day cadence) anchored to Caroline's first two sessions.
const INTERVAL_DAYS = 14;
const UPCOMING_PER_SLOT = 4;

const SLOTS: Slot[] = [
  {
    key: 'thu',
    title: 'Thursday Evening Table',
    anchor: '2026-06-25', // Thursday
    time: '6:30 PM',
    blurb:
      'Our standing weeknight game. Wind down with tiles, snacks, and good company — beginners and regulars at the same table.',
    level: 'All levels',
  },
  {
    key: 'sat',
    title: 'Saturday Afternoon Table',
    anchor: '2026-06-27', // Saturday
    time: '12:30 PM',
    blurb:
      'A relaxed weekend session with plenty of daylight. The easiest place to start if you have never touched a tile.',
    level: 'Beginners welcome',
  },
];

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function upcomingDates(anchorISO: string, count: number): string[] {
  const [ay, am, ad] = anchorISO.split('-').map(Number);
  const cursor = new Date(ay, am - 1, ad);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Step forward in INTERVAL_DAYS until we reach today or later.
  while (cursor < today) {
    cursor.setDate(cursor.getDate() + INTERVAL_DAYS);
  }
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(toISO(cursor));
    cursor.setDate(cursor.getDate() + INTERVAL_DAYS);
  }
  return out;
}

export const events: MahjongEvent[] = SLOTS.flatMap((slot) =>
  upcomingDates(slot.anchor, UPCOMING_PER_SLOT).map((date) => ({
    id: `${slot.key}-${date}`,
    title: slot.title,
    date,
    time: slot.time,
    venue: 'Address shared when you RSVP',
    neighborhood: 'Seattle',
    blurb: slot.blurb,
    status: 'open' as EventStatus,
    level: slot.level,
    cadence: 'Every other week',
  }))
).sort((a, b) => a.date.localeCompare(b.date));
