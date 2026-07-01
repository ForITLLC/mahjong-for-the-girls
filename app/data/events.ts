// The site calendar. Two sources, in priority order:
//
// 1. Caroline's REAL Partiful events, scraped at build time into
//    partiful-events.generated.json (see scripts/scrape-partiful.mjs). Partiful
//    doesn't publish a host's event list anywhere public, so the scraper reads
//    the invite links she shares (scripts/partiful-sources.txt) and pulls each
//    event's real title/date/time/location/RSVP-link. When that file has events,
//    they ARE the calendar and each night's RSVP deep-links to Partiful.
//
// 2. A built-in standing cadence (fallback) — two tables every other week —
//    so the section still renders if no Partiful links are configured yet.
//
// Either way, anything BEYOND what's scheduled is handled by the "express
// interest" prompt in the Events section.

import generatedEvents from './partiful-events.generated.json';

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
  /** When set (real Partiful events), RSVP deep-links here instead of the modal */
  rsvpUrl?: string;
  /** Event cover image (available to posters); optional */
  image?: string;
  /** IANA timezone the time is expressed in */
  timezone?: string;
}

// ---------------------------------------------------------------------------
// Source 1 — Caroline's real Partiful events (scraped)
// ---------------------------------------------------------------------------

interface PartifulRecord {
  id: string;
  title: string;
  date: string;
  time: string;
  timezone: string;
  venue: string;
  description: string;
  image: string | null;
  rsvpUrl: string;
  startDate: string;
}

// Keep a card blurb tidy: first paragraph of the Partiful description, capped.
function cardBlurb(description: string): string {
  const first = (description || '').split(/\n\s*\n/)[0].trim();
  if (first.length <= 240) return first;
  return first.slice(0, 237).trimEnd() + '…';
}

function fromPartiful(r: PartifulRecord): MahjongEvent {
  return {
    id: r.id,
    title: r.title,
    date: r.date,
    time: r.time,
    venue: r.venue || 'Address shared when you RSVP',
    neighborhood: 'Seattle',
    blurb: cardBlurb(r.description),
    status: 'open',
    level: 'All levels',
    cadence: '',
    rsvpUrl: r.rsvpUrl,
    image: r.image || undefined,
    timezone: r.timezone,
  };
}

const partifulEvents: MahjongEvent[] = (generatedEvents as PartifulRecord[]).map(
  fromPartiful
);
const hasRealEvents = partifulEvents.length > 0;

// ---------------------------------------------------------------------------
// Source 2 — built-in standing cadence (fallback when no Partiful links yet)
// ---------------------------------------------------------------------------

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

function todayISO(): string {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return toISO(t);
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

const syntheticEvents: MahjongEvent[] = SLOTS.flatMap((slot) =>
  upcomingDates(slot.anchor, UPCOMING_PER_SLOT).map((date) =>
    eventFromSlot(slot, date)
  )
);

// ---------------------------------------------------------------------------
// The public calendar — real events win; else the standing cadence.
// Real past events are hidden from the calendar but still resolvable by id
// (below) so a shared poster/RSVP link to a just-passed night still works.
// ---------------------------------------------------------------------------

const TODAY = todayISO();

export const events: MahjongEvent[] = (hasRealEvents
  ? partifulEvents.filter((e) => e.date >= TODAY)
  : syntheticEvents
).sort((a, b) => a.date.localeCompare(b.date));

// ---------------------------------------------------------------------------
// Poster permalinks (/event/[id]) — resolve an id back to its event.
// ---------------------------------------------------------------------------

const SLOT_BY_KEY: Record<string, Slot> = Object.fromEntries(
  SLOTS.map((s) => [s.key, s])
);
const PARTIFUL_BY_ID: Record<string, MahjongEvent> = Object.fromEntries(
  partifulEvents.map((e) => [e.id, e])
);

// Resolve an event id back to its full event. Real Partiful ids match directly;
// synthetic ids (e.g. 'thu-2026-07-09') encode their slot + date, so a permalink
// renders its own content without relying on the runtime "upcoming" window.
export function eventFromId(id: string): MahjongEvent | null {
  if (PARTIFUL_BY_ID[id]) return PARTIFUL_BY_ID[id];
  const m = id.match(/^([a-z]+)-(\d{4}-\d{2}-\d{2})$/);
  if (!m) return null;
  const slot = SLOT_BY_KEY[m[1]];
  return slot ? eventFromSlot(slot, m[2]) : null;
}

// The set of ids to statically generate poster pages for (output: 'export' must
// enumerate them at build time). Real events: every scraped night (past too, so
// links stay valid). Fallback: a generous ~15-month window per slot.
export function eventPosterParams(): { id: string }[] {
  if (hasRealEvents) return partifulEvents.map((e) => ({ id: e.id }));
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
