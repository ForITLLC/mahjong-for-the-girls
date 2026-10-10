#!/usr/bin/env node
// Build-time: scrape Caroline's Partiful events so /event/[id] can prerender a
// poster page for each (output: 'export' must enumerate ids at build time).
//
// The live calendar does NOT come from here: /api/calendar scrapes the same
// links at request time (api/src/partiful.js), so the list stays current
// without a rebuild. Adding a link is a commit, and that push rebuilds.
//
// Output: app/data/partiful-events.generated.json  (consumed by app/data/events.ts)
// If no links are configured we write [] and poster pages fall back to the
// standing cadence. Network/parse failures never throw — a bad deploy must
// never be caused by Partiful being down — we log and skip.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import partiful from '../api/src/partiful.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'app', 'data', 'partiful-events.generated.json');

const { records } = await partiful.scrapeAll(console);
const events = records.map(partiful.toEvent);
writeFileSync(OUT, JSON.stringify(events, null, 2) + '\n');
console.log(`partiful: wrote ${events.length} event(s) -> ${OUT}`);
