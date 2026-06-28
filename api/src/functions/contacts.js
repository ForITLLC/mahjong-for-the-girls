// Lightweight CRM — contacts.
//   POST   /api/capture          — PUBLIC. The site drops RSVP/contact leads here.
//   GET    /api/admin/contacts   — editor only. The whole contact list.
//   POST   /api/admin/contacts   — editor only. Create or update (id present = update).
//   DELETE /api/admin/contacts?id=…  — editor only.
//
// A contact is deliberately simple: name, email, phone, status, notes, source.
// `status` moves a lead through a tiny pipeline (new → going → regular → past).

const { app } = require('@azure/functions');
const { configured, table, caller, newId, json, notConfigured } = require('../store');

const PK = 'contact';
const FIELDS = ['name', 'email', 'phone', 'status', 'notes', 'source'];
const STATUSES = ['new', 'going', 'maybe', 'regular', 'past'];

function rowToContact(c) {
  const out = { id: c.rowKey, createdAt: c.createdAt || '', updatedAt: c.updatedAt || '' };
  for (const f of FIELDS) out[f] = c[f] ?? '';
  return out;
}

async function findByEmail(t, email) {
  const e = email.toLowerCase().replace(/'/g, "''");
  for await (const c of t.listEntities({ queryOptions: { filter: `PartitionKey eq '${PK}' and emailLower eq '${e}'` } })) {
    return c;
  }
  return null;
}

// PUBLIC capture — used by the RSVP modal and contact form. De-dupes on email so
// repeat RSVPs update the same lead rather than piling up. Never returns data.
app.http('contactCapture', {
  route: 'capture',
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request) => {
    if (!configured()) return json({ ok: true, stored: false }); // silently no-op until storage is set
    const body = await request.json().catch(() => null);
    if (!body || !body.email) return json({ ok: true, stored: false });
    const email = String(body.email).trim();
    const t = await table('contacts');
    const existing = await findByEmail(t, email);
    const now = new Date().toISOString();
    if (existing) {
      existing.name = body.name || existing.name;
      if (body.notes) existing.notes = `${existing.notes ? existing.notes + '\n' : ''}${body.notes}`;
      existing.updatedAt = now;
      await t.updateEntity(existing, 'Merge');
      return json({ ok: true, stored: true, id: existing.rowKey });
    }
    const id = newId('c');
    const entity = {
      partitionKey: PK, rowKey: id, emailLower: email.toLowerCase(),
      name: body.name || '', email, phone: body.phone || '',
      status: 'new', notes: body.notes || '', source: body.source || 'website',
      createdAt: now, updatedAt: now,
    };
    await t.createEntity(entity);
    return json({ ok: true, stored: true, id });
  },
});

app.http('contactsAdminList', {
  route: 'admin/contacts',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async () => {
    if (!configured()) return notConfigured();
    const t = await table('contacts');
    const items = [];
    for await (const c of t.listEntities({ queryOptions: { filter: `PartitionKey eq '${PK}'` } })) {
      items.push(rowToContact(c));
    }
    items.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
    return json(items);
  },
});

app.http('contactsAdminUpsert', {
  route: 'admin/contacts',
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request) => {
    if (!configured()) return notConfigured();
    const body = await request.json().catch(() => null);
    if (!body || (!body.name && !body.email)) {
      return json({ error: 'bad_request', message: 'name or email is required.' }, 400);
    }
    const who = caller(request);
    const now = new Date().toISOString();
    const t = await table('contacts');
    const id = body.id && String(body.id).trim() ? String(body.id).trim() : newId('c');
    const status = STATUSES.includes(body.status) ? body.status : 'new';
    const entity = {
      partitionKey: PK, rowKey: id,
      emailLower: (body.email || '').toLowerCase(),
      name: body.name || '', email: body.email || '', phone: body.phone || '',
      status, notes: body.notes || '', source: body.source || 'manual',
      updatedAt: now, updatedBy: who?.userDetails || 'unknown',
    };
    if (!body.id) entity.createdAt = now;
    await t.upsertEntity(entity, 'Merge');
    return json({ ok: true, id });
  },
});

app.http('contactsAdminDelete', {
  route: 'admin/contacts',
  methods: ['DELETE'],
  authLevel: 'anonymous',
  handler: async (request) => {
    if (!configured()) return notConfigured();
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return json({ error: 'bad_request', message: 'id query param required.' }, 400);
    const t = await table('contacts');
    await t.deleteEntity(PK, id).catch(() => {});
    return json({ ok: true, id });
  },
});
