// Events API.
//   GET  /api/events        — PUBLIC. The published list the website reads.
//   GET  /api/admin/events  — editor only (SWA route rule). Same list, for editing.
//   POST /api/admin/events  — editor only. Upsert one event (create or update).
//   DELETE /api/admin/events?id=…  — editor only. Remove one event.
//
// An "event" row carries exactly the fields the public <Events> component needs,
// so the site can render straight from the store with no transform.

const { app } = require('@azure/functions');
const { configured, table, caller, json, notConfigured } = require('../store');

const PK = 'event';
const FIELDS = ['title', 'date', 'time', 'venue', 'neighborhood', 'blurb', 'status', 'level', 'cadence'];

function rowToEvent(e) {
  const out = { id: e.rowKey };
  for (const f of FIELDS) out[f] = e[f] ?? '';
  out.hidden = !!e.hidden;
  return out;
}

async function listEvents() {
  const t = await table('events');
  const items = [];
  for await (const e of t.listEntities({ queryOptions: { filter: `PartitionKey eq '${PK}'` } })) {
    items.push(rowToEvent(e));
  }
  items.sort((a, b) => String(a.date).localeCompare(String(b.date)));
  return items;
}

// Public read — only the visible events.
app.http('eventsPublic', {
  route: 'events',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async () => {
    if (!configured()) return json([]); // graceful: site falls back to its built-in cadence
    const all = await listEvents();
    return json(all.filter((e) => !e.hidden));
  },
});

// Admin read — every event, including hidden ones.
app.http('eventsAdminList', {
  route: 'admin/events',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async () => {
    if (!configured()) return notConfigured();
    return json(await listEvents());
  },
});

// Admin upsert.
app.http('eventsAdminUpsert', {
  route: 'admin/events',
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request) => {
    if (!configured()) return notConfigured();
    const body = await request.json().catch(() => null);
    if (!body || !body.title || !body.date) {
      return json({ error: 'bad_request', message: 'title and date are required.' }, 400);
    }
    const who = caller(request);
    const id = body.id && String(body.id).trim() ? String(body.id).trim() : `ev_${body.date}_${Math.random().toString(36).slice(2, 7)}`;
    const entity = { partitionKey: PK, rowKey: id, hidden: !!body.hidden, updatedBy: who?.userDetails || 'unknown', updatedAt: new Date().toISOString() };
    for (const f of FIELDS) entity[f] = body[f] ?? '';
    if (!entity.cadence) entity.cadence = 'One-off';
    if (!entity.status) entity.status = 'open';
    if (!entity.level) entity.level = 'All levels';
    if (!entity.neighborhood) entity.neighborhood = 'Seattle';
    if (!entity.venue) entity.venue = 'Address shared when you RSVP';
    const t = await table('events');
    await t.upsertEntity(entity, 'Replace');
    return json({ ok: true, id, event: rowToEvent(entity) });
  },
});

// Admin delete.
app.http('eventsAdminDelete', {
  route: 'admin/events',
  methods: ['DELETE'],
  authLevel: 'anonymous',
  handler: async (request) => {
    if (!configured()) return notConfigured();
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return json({ error: 'bad_request', message: 'id query param required.' }, 400);
    const t = await table('events');
    await t.deleteEntity(PK, id).catch(() => {});
    return json({ ok: true, id });
  },
});
