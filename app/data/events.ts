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
      'Our standing weeknight game. Tiles, snacks, and the girls — beginners and regulars at the same table, zero pressure. Come straight from work. ✨',
    level: 'All levels',
  },
  {
    key: 'sat',
    title: 'Saturday Afternoon Table',
    anchor: '2026-06-27', // Saturday
    time: '12:30 PM',
    blurb:
      'A chilled weekend session with good daylight and better snacks. The easiest place to start if you’ve never touched a tile in your life. 🀄️',
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

function eventFromSlot(slot: Slot, date: string): MahjongEvent {
  return {
    id: `${slot.key}-${date}`,
    title: slot.title,
    date,
    time: slot.time,
    venue: 'Address shared when you RSVP',
    neighborhood: 'Seattle',
    blurb: slot.blurb,
    status: 'open',
    level: slot.level,
    cadence: 'Every other week',
  };
}

export const events: MahjongEvent[] = SLOTS.flatMap((slot) =>
  upcomingDates(slot.anchor, UPCOMING_PER_SLOT).map((date) =>
    eventFromSlot(slot, date)
  )
).sort((a, b) => a.date.localeCompare(b.date));

const SLOT_BY_KEY: Record<string, Slot> = Object.fromEntries(
  SLOTS.map((s) => [s.key, s])
);

// Resolve an event id (e.g. 'thu-2026-07-09') back to its full event by parsing
// the encoded date and looking up its slot. The id carries the date, so the
// per-event poster permalink (/event/[id]) can render ANY night without relying
// on the runtime "upcoming" window — robust to the rolling 14-day cadence.
export function eventFromId(id: string): MahjongEvent | null {
  const m = id.match(/^([a-z]+)-(\d{4}-\d{2}-\d{2})$/);
  if (!m) return null;
  const slot = SLOT_BY_KEY[m[1]];
  return slot ? eventFromSlot(slot, m[2]) : null;
}

// A wide window of event ids for static generation of the poster permalinks
// (output: 'export' must enumerate them at build time). Deliberately generous —
// ~15 months per slot — so every link the live calendar can produce stays valid
// well past a deploy. Each deploy refreshes the window.
export function eventPosterParams(): { id: string }[] {
  const STEPS = 40; // ~15 months at the 14-day cadence
  const out: { id: string }[] = [];
  for (const slot of SLOTS) {
    const [ay, am, ad] = slot.anchor.split('-').map(Number);
    const cursor = new Date(ay, am - 1, ad);
    for (let i = 0; i < STEPS; i++) {
      out.push({ id: `${slot.key}-${toISO(cursor)}` });
      cursor.setDate(cursor.getDate() + INTERVAL_DAYS);
    }
  }
  return out;
}
