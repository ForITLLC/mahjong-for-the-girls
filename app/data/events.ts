// Event types + poster permalink resolution.
//
// The live calendar list is NOT built here: <Events> fetches /api/calendar,
// which resolves admin-published events, Caroline's Partiful events and the
// standing every-other-week cadence at request time (api/src/calendar.js), so
// the site never goes stale between deploys. Anything BEYOND what's scheduled
// is handled by the "express interest" prompt in the Events section.
//
// This module only serves the prerendered poster pages (/event/[id]), which
// output: 'export' must enumerate at build time.

import partifulGenerated from './partiful-events.generated.json';
import cadence from '../../api/src/cadence.js';

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

// Caroline's Partiful events as scraped at build (scripts/scrape-partiful.mjs).
const partifulEvents = partifulGenerated as MahjongEvent[];
const PARTIFUL_BY_ID: Record<string, MahjongEvent> = Object.fromEntries(
  partifulEvents.map((e) => [e.id, e])
);

// Resolve an event id back to its full event. Real Partiful ids match directly;
// cadence ids (e.g. 'thu-2026-07-09') encode their slot + date.
export function eventFromId(id: string): MahjongEvent | null {
  return PARTIFUL_BY_ID[id] ?? (cadence.eventFromId(id) as MahjongEvent | null);
}

// The set of ids to statically generate poster pages for. Real events: every
// scraped night (past too, so links stay valid). Fallback: a generous
// ~15-month window per cadence slot.
export function eventPosterParams(): { id: string }[] {
  if (partifulEvents.length > 0) return partifulEvents.map((e) => ({ id: e.id }));
  return cadence.posterIds();
}
