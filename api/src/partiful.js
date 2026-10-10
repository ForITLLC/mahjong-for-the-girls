// Caroline's real Partiful events.
//
// WHY A SCRAPER: Partiful keeps a host's event list private — it is not on the
// public profile page (verified: absent from the server HTML, absent after the
// SPA renders, and unindexed by Google). The only public, machine-readable
// handle to an event is its invite link (partiful.com/e/<id>), which embeds the
// full event in a Next.js __NEXT_DATA__ blob. So we read her event links from
// api/partiful-sources.txt, fetch each one, and extract the real title / date /
// time / location / cover image / RSVP url.
//
// /api/calendar calls scrapeAll() per request (behind a cache); the build calls
// it once to prerender poster permalinks. Network/parse failures never throw —
// Partiful being down must never break the calendar — we log and skip.
//
// No dependencies: uses Node's global fetch (Node 18+).

const { readFileSync } = require('node:fs');
const { join } = require('node:path');

const SOURCES = join(__dirname, '..', 'partiful-sources.txt');
const FETCH_TIMEOUT_MS = 8000;

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120 Safari/537.36';

function readSources() {
  let text = '';
  try {
    text = readFileSync(SOURCES, 'utf8');
  } catch {
    return [];
  }
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      // Accept a bare id, an /e/<id> path, or a full URL (with optional ?c=...).
      const m = l.match(/([A-Za-z0-9_-]{12,})(?:\?|#|$)/);
      const id = l.includes('/e/') ? (l.match(/\/e\/([A-Za-z0-9_-]+)/) || [])[1] : m && m[1];
      return { raw: l, id };
    })
    .filter((s) => s.id);
}

function extractNextData(html) {
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return null;
  }
}

// Pull the best cover-image URL out of Partiful's `image` object.
function imageUrl(image) {
  if (!image || typeof image !== 'object') return null;
  return (
    image?.url ||
    image?.upload?.url ||
    (image?.upload?.path
      ? `https://firebasestorage.googleapis.com/v0/b/getpartiful.appspot.com/o/${encodeURIComponent(
          image.upload.path
        )}?alt=media`
      : null)
  );
}

// Format the real start time in the event's own timezone.
function localParts(startDateISO, timezone) {
  const d = new Date(startDateISO);
  const tz = timezone || 'America/Los_Angeles';
  const opt = (o) => new Intl.DateTimeFormat('en-US', { timeZone: tz, ...o });
  // yyyy-mm-dd in the event tz
  const ymd = opt({ year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(d)
    .reduce((a, p) => ((a[p.type] = p.value), a), {});
  const isoDate = `${ymd.year}-${ymd.month}-${ymd.day}`;
  const time = opt({ hour: 'numeric', minute: '2-digit', hour12: true }).format(d);
  return { isoDate, time: time.replace(':00 ', ' ') };
}

async function scrapeOne({ id }, log) {
  const url = `https://partiful.com/e/${id}`;
  const res = await fetch(url, {
    headers: { 'user-agent': UA },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) {
    log.warn(`  ! ${id}: HTTP ${res.status} — skipped`);
    return null;
  }
  const html = await res.text();
  const data = extractNextData(html);
  const ev = data?.props?.pageProps?.event;
  if (!ev || !ev.id) {
    log.warn(`  ! ${id}: no event data in page — skipped`);
    return null;
  }
  if (ev.status && ev.status !== 'PUBLISHED') {
    log.warn(`  ! ${id}: status=${ev.status} (not published) — skipped`);
    return null;
  }
  if (ev.isPublic === false || ev.visibility === 'PRIVATE') {
    log.warn(`  ! ${id}: not public — skipped`);
    return null;
  }
  const { isoDate, time } = localParts(ev.startDate, ev.timezone);
  const out = {
    id: ev.id,
    title: ev.title || 'Mahjong night',
    date: isoDate,
    time,
    timezone: ev.timezone || 'America/Los_Angeles',
    venue: ev.location || 'Address shared when you RSVP',
    description: (ev.description || '').trim(),
    image: imageUrl(ev.image),
    rsvpUrl: ev.publicShortUrl || url,
    startDate: ev.startDate,
  };
  log.log(`  ✓ ${ev.id}: ${out.title} — ${out.date} ${out.time}`);
  return out;
}

// Scrape every configured link in parallel. Returns the source count too, so a
// caller can tell "no links configured" from "Partiful returned nothing".
async function scrapeAll(log = console) {
  const sources = readSources();
  log.log(`partiful: ${sources.length} source link(s)`);
  const results = await Promise.all(
    sources.map((s) =>
      scrapeOne(s, log).catch((err) => {
        log.warn(`  ! ${s.id}: ${err.message} — skipped`);
        return null;
      })
    )
  );
  const records = results
    .filter(Boolean)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  return { sourceCount: sources.length, records };
}

// Keep a card blurb tidy: first paragraph of the Partiful description, capped.
function cardBlurb(description) {
  const first = (description || '').split(/\n\s*\n/)[0].trim();
  if (first.length <= 240) return first;
  return first.slice(0, 237).trimEnd() + '…';
}

// A scraped record as a site calendar event; RSVP deep-links to Partiful.
function toEvent(r) {
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

module.exports = { scrapeAll, toEvent };
