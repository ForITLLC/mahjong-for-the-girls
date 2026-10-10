// The public calendar, resolved per request (no build-time snapshot, no timer).
// Three sources, in priority order:
//
// 1. Events an editor published in the admin area (Azure SQL, dbo.events).
// 2. Caroline's real Partiful events (see ./partiful.js). When any of her links
//    scrape, they ARE the calendar and each night's RSVP deep-links to Partiful.
// 3. The built-in standing cadence (./cadence.js) — two tables every other week.
//
// "Today" is Seattle's date, so the list rolls forward at Caroline's midnight
// whatever timezone the Function host runs in. The Partiful scrape is the only
// slow part, so it alone is cached in memory for a few hours.

const { configured, pool } = require('./db');
const cadence = require('./cadence');
const partiful = require('./partiful');

const PARTIFUL_TTL_MS = 3 * 60 * 60 * 1000;
// If links are configured but nothing scraped (Partiful down?), retry sooner.
const PARTIFUL_EMPTY_TTL_MS = 10 * 60 * 1000;

function rowToEvent(r) {
  return {
    id: r.id,
    title: r.title ?? '',
    date: r.date ?? '',
    time: r.time ?? '',
    venue: r.venue ?? '',
    neighborhood: r.neighborhood ?? '',
    blurb: r.blurb ?? '',
    status: r.status ?? 'open',
    level: r.level ?? 'All levels',
    cadence: r.cadence ?? 'One-off',
    hidden: !!r.hidden,
  };
}

async function listEvents(onlyVisible) {
  const p = await pool();
  const where = onlyVisible ? 'WHERE hidden = 0' : '';
  const r = await p
    .request()
    .query(`SELECT id, title, date, time, venue, neighborhood, blurb, status, level, cadence, hidden
            FROM dbo.events ${where} ORDER BY date ASC`);
  return r.recordset.map(rowToEvent);
}

// An admin row in the exact shape the public <Events> component renders.
function publicEvent(e) {
  return {
    id: e.id,
    title: e.title,
    date: e.date,
    time: e.time,
    venue: e.venue || 'Address shared when you RSVP',
    neighborhood: e.neighborhood || 'Seattle',
    blurb: e.blurb || '',
    status: ['open', 'waitlist', 'sold-out'].includes(e.status) ? e.status : 'open',
    level: e.level || 'All levels',
    cadence: e.cadence || 'One-off',
  };
}

async function adminEvents() {
  if (!configured()) return [];
  try {
    return (await listEvents(true)).map(publicEvent);
  } catch {
    return []; // never break the public calendar on a DB hiccup
  }
}

let partifulCache = null; // { expires, events: Promise<event[]> }

function partifulEvents(log) {
  if (!partifulCache || Date.now() > partifulCache.expires) {
    const entry = { expires: Date.now() + PARTIFUL_TTL_MS, events: null };
    entry.events = partiful.scrapeAll(log).then(({ sourceCount, records }) => {
      if (sourceCount > 0 && records.length === 0) {
        entry.expires = Date.now() + PARTIFUL_EMPTY_TTL_MS;
      }
      return records.map(partiful.toEvent);
    });
    partifulCache = entry;
  }
  return partifulCache.events;
}

async function resolveCalendar(log = console) {
  const today = cadence.todayISO();
  const upcoming = (list) =>
    list.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));

  const admin = upcoming(await adminEvents());
  if (admin.length > 0) return { today, source: 'admin', events: admin };

  const real = await partifulEvents(log);
  if (real.length > 0) return { today, source: 'partiful', events: upcoming(real) };

  return { today, source: 'cadence', events: cadence.cadenceEvents(today) };
}

module.exports = { resolveCalendar, listEvents, rowToEvent };
