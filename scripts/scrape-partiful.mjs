#!/usr/bin/env node
// Scrape Caroline's real Partiful events into the site calendar.
//
// WHY THIS EXISTS: Partiful keeps a host's event list private — it is not on
// the public profile page (verified: absent from the server HTML, absent after
// the SPA renders, and unindexed by Google). The only public, machine-readable
// handle to an event is its invite link (partiful.com/e/<id>), which embeds the
// full event in a Next.js __NEXT_DATA__ blob. So we read the list of her event
// links from scripts/partiful-sources.txt, fetch each one, and extract the real
// title / date / time / location / cover image / RSVP url.
//
// Output: app/data/partiful-events.generated.json  (consumed by app/data/events.ts)
// If the sources file is empty, we write [] and the site falls back to its
// built-in standing cadence. Network/parse failures never throw — a bad deploy
// must never be caused by Partiful being down — we log and skip.
//
// No dependencies: uses Node's global fetch (Node 18+).

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SOURCES = join(__dirname, 'partiful-sources.txt');
const OUT = join(ROOT, 'app', 'data', 'partiful-events.generated.json');

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
  const m = html.match(
    /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/
  );
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
  const time = opt({ hour: 'numeric', minute: '2-digit', hour12: true }).format(
    d
  );
  return { isoDate, time: time.replace(':00 ', ' ') };
}

async function scrapeOne({ id }) {
  const url = `https://partiful.com/e/${id}`;
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) {
    console.warn(`  ! ${id}: HTTP ${res.status} — skipped`);
    return null;
  }
  const html = await res.text();
  const data = extractNextData(html);
  const ev = data?.props?.pageProps?.event;
  if (!ev || !ev.id) {
    console.warn(`  ! ${id}: no event data in page — skipped`);
    return null;
  }
  if (ev.status && ev.status !== 'PUBLISHED') {
    console.warn(`  ! ${id}: status=${ev.status} (not published) — skipped`);
    return null;
  }
  if (ev.isPublic === false || ev.visibility === 'PRIVATE') {
    console.warn(`  ! ${id}: not public — skipped`);
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
  console.log(`  ✓ ${ev.id}: ${out.title} — ${out.date} ${out.time}`);
  return out;
}

async function main() {
  const sources = readSources();
  console.log(`partiful: ${sources.length} source link(s)`);
  const events = [];
  for (const s of sources) {
    try {
      const e = await scrapeOne(s);
      if (e) events.push(e);
    } catch (err) {
      console.warn(`  ! ${s.id}: ${err.message} — skipped`);
    }
  }
  events.sort((a, b) => a.startDate.localeCompare(b.startDate));
  writeFileSync(OUT, JSON.stringify(events, null, 2) + '\n');
  console.log(`partiful: wrote ${events.length} event(s) -> ${OUT}`);
}

main();
