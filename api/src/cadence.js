// The built-in standing cadence: two tables every other week, anchored to
// Caroline's first two sessions. It is the calendar whenever no admin-published
// or Partiful events are live.
//
// Pure functions with no Node or browser dependencies, so one copy serves the
// request-time calendar (/api/calendar), the prerendered poster permalinks
// (/event/[id]) and the browser's offline fallback.

const TIMEZONE = 'America/Los_Angeles'; // Caroline's Seattle calendar
const INTERVAL_DAYS = 14;
const UPCOMING_PER_SLOT = 4;
const POSTER_STEPS = 40; // ~15 months of prerendered poster pages per slot

const SLOTS = [
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

// Date math on 'YYYY-MM-DD' strings in UTC, so the host's timezone never shifts a day.
function toUTC(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

function addDays(iso, days) {
  return new Date(toUTC(iso) + days * 86400000).toISOString().slice(0, 10);
}

// Today's date in Seattle, whatever timezone the server or browser runs in.
function todayISO(now = new Date()) {
  const p = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .formatToParts(now)
    .reduce((a, part) => ((a[part.type] = part.value), a), {});
  return `${p.year}-${p.month}-${p.day}`;
}

// The next `count` dates on the slot's 14-day cadence, from today forward.
function upcomingDates(anchor, today, count) {
  const behind = Math.max(0, (toUTC(today) - toUTC(anchor)) / 86400000);
  const first = addDays(anchor, Math.ceil(behind / INTERVAL_DAYS) * INTERVAL_DAYS);
  return Array.from({ length: count }, (_, i) => addDays(first, i * INTERVAL_DAYS));
}

function eventFromSlot(slot, date) {
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

// The upcoming standing nights, soonest first.
function cadenceEvents(today) {
  return SLOTS.flatMap((slot) =>
    upcomingDates(slot.anchor, today, UPCOMING_PER_SLOT).map((date) => eventFromSlot(slot, date))
  ).sort((a, b) => a.date.localeCompare(b.date));
}

// Ids encode their slot + date (e.g. 'thu-2026-07-09'), so a poster permalink
// resolves its own content without the "upcoming" window.
function eventFromId(id) {
  const m = String(id).match(/^([a-z]+)-(\d{4}-\d{2}-\d{2})$/);
  const slot = m && SLOTS.find((s) => s.key === m[1]);
  return slot ? eventFromSlot(slot, m[2]) : null;
}

// Every id to prerender a poster page for (output: 'export' enumerates them at build).
function posterIds() {
  return SLOTS.flatMap((slot) =>
    Array.from({ length: POSTER_STEPS }, (_, i) => ({
      id: `${slot.key}-${addDays(slot.anchor, i * INTERVAL_DAYS)}`,
    }))
  );
}

module.exports = { TIMEZONE, todayISO, cadenceEvents, eventFromId, posterIds };
