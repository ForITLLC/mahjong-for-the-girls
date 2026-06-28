// Events API (Azure SQL).
//   GET    /api/events             — PUBLIC. The visible list the website reads.
//   GET    /api/admin/events       — authenticated + allowlisted. Every event.
//   POST   /api/admin/events       — authenticated + allowlisted. Upsert one.
//   DELETE /api/admin/events?id=…  — authenticated + allowlisted. Remove one.
//
// A row carries exactly the fields the public <Events> component needs, so the
// site renders straight from the DB with no transform. `date` is stored as an
// ISO 'YYYY-MM-DD' string to avoid any timezone drift between DB and browser.

const { app } = require('@azure/functions');
const { sql, configured, pool, authorize, json, notConfigured, forbidden } = require('../db');

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

// Public read — only the visible events.
app.http('eventsPublic', {
  route: 'events',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async () => {
    if (!configured()) return json([]); // graceful: site falls back to its built-in cadence
    try {
      return json(await listEvents(true));
    } catch {
      return json([]); // never break the public calendar on a DB hiccup
    }
  },
});

// Admin read — every event, including hidden ones.
app.http('eventsAdminList', {
  route: 'admin/events',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request) => {
    if (!configured()) return notConfigured();
    const auth = await authorize(request);
    if (!auth.ok) return forbidden(auth.reason);
    return json(await listEvents(false));
  },
});

// Admin upsert (create when id is blank, update when present).
app.http('eventsAdminUpsert', {
  route: 'admin/events',
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request) => {
    if (!configured()) return notConfigured();
    const auth = await authorize(request);
    if (!auth.ok) return forbidden(auth.reason);

    const body = await request.json().catch(() => null);
    if (!body || !body.title || !body.date) {
      return json({ error: 'bad_request', message: 'title and date are required.' }, 400);
    }
    const id =
      body.id && String(body.id).trim()
        ? String(body.id).trim()
        : `ev_${body.date}_${Math.random().toString(36).slice(2, 7)}`;

    const vals = {
      title: body.title ?? '',
      date: body.date ?? '',
      time: body.time ?? '',
      venue: body.venue || 'Address shared when you RSVP',
      neighborhood: body.neighborhood || 'Seattle',
      blurb: body.blurb ?? '',
      status: body.status || 'open',
      level: body.level || 'All levels',
      cadence: body.cadence || 'One-off',
      hidden: body.hidden ? 1 : 0,
    };

    const p = await pool();
    await p
      .request()
      .input('id', sql.NVarChar(60), id)
      .input('title', sql.NVarChar(400), vals.title)
      .input('date', sql.NVarChar(10), vals.date)
      .input('time', sql.NVarChar(60), vals.time)
      .input('venue', sql.NVarChar(300), vals.venue)
      .input('neighborhood', sql.NVarChar(120), vals.neighborhood)
      .input('blurb', sql.NVarChar(sql.MAX), vals.blurb)
      .input('status', sql.NVarChar(20), vals.status)
      .input('level', sql.NVarChar(60), vals.level)
      .input('cadence', sql.NVarChar(60), vals.cadence)
      .input('hidden', sql.Bit, vals.hidden)
      .input('updatedBy', sql.NVarChar(200), auth.email)
      .query(`
        MERGE dbo.events AS t
        USING (SELECT @id AS id) AS s ON t.id = s.id
        WHEN MATCHED THEN UPDATE SET
          title=@title, date=@date, time=@time, venue=@venue, neighborhood=@neighborhood,
          blurb=@blurb, status=@status, level=@level, cadence=@cadence, hidden=@hidden,
          updated_by=@updatedBy, updated_at=sysutcdatetime()
        WHEN NOT MATCHED THEN INSERT
          (id, title, date, time, venue, neighborhood, blurb, status, level, cadence, hidden, updated_by, created_at, updated_at)
          VALUES (@id, @title, @date, @time, @venue, @neighborhood, @blurb, @status, @level, @cadence, @hidden, @updatedBy, sysutcdatetime(), sysutcdatetime());
      `);

    return json({ ok: true, id, event: rowToEvent({ id, ...vals }) });
  },
});

// Admin delete.
app.http('eventsAdminDelete', {
  route: 'admin/events',
  methods: ['DELETE'],
  authLevel: 'anonymous',
  handler: async (request) => {
    if (!configured()) return notConfigured();
    const auth = await authorize(request);
    if (!auth.ok) return forbidden(auth.reason);
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return json({ error: 'bad_request', message: 'id query param required.' }, 400);
    const p = await pool();
    await p.request().input('id', sql.NVarChar(60), id).query('DELETE FROM dbo.events WHERE id = @id');
    return json({ ok: true, id });
  },
});
