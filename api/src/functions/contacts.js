// Lightweight CRM — contacts (Azure SQL).
//   POST   /api/capture            — PUBLIC. The site drops RSVP/contact leads here.
//   GET    /api/admin/contacts     — authenticated + allowlisted. The whole list.
//   POST   /api/admin/contacts     — authenticated + allowlisted. Create/update.
//   DELETE /api/admin/contacts?id= — authenticated + allowlisted.
//
// A contact is deliberately simple: name, email, phone, status, notes, source.
// `status` moves a lead through a tiny pipeline (new → going → regular → past).
// Capture de-dupes on lowercased email so repeat RSVPs update the same lead.

const { app } = require('@azure/functions');
const { sql, configured, pool, newId, authorize, json, notConfigured, forbidden } = require('../db');

const STATUSES = ['new', 'going', 'maybe', 'regular', 'past'];

function rowToContact(r) {
  return {
    id: r.id,
    name: r.name ?? '',
    email: r.email ?? '',
    phone: r.phone ?? '',
    status: r.status ?? 'new',
    notes: r.notes ?? '',
    source: r.source ?? '',
    createdAt: r.created_at ? new Date(r.created_at).toISOString() : '',
    updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : '',
  };
}

// PUBLIC capture — used by the RSVP modal and contact form. Never returns data.
app.http('contactCapture', {
  route: 'capture',
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request) => {
    if (!configured()) return json({ ok: true, stored: false }); // no-op until DB is set
    const body = await request.json().catch(() => null);
    if (!body || !body.email) return json({ ok: true, stored: false });
    const email = String(body.email).trim();
    const emailLower = email.toLowerCase();

    try {
      const p = await pool();
      const existing = await p
        .request()
        .input('emailLower', sql.NVarChar(320), emailLower)
        .query('SELECT TOP 1 id, notes FROM dbo.contacts WHERE email_lower = @emailLower');

      if (existing.recordset.length) {
        const row = existing.recordset[0];
        const merged = body.notes
          ? `${row.notes ? row.notes + '\n' : ''}${body.notes}`
          : row.notes;
        await p
          .request()
          .input('id', sql.NVarChar(60), row.id)
          .input('name', sql.NVarChar(200), body.name || null)
          .input('notes', sql.NVarChar(sql.MAX), merged)
          .query(`UPDATE dbo.contacts
                  SET name = COALESCE(NULLIF(@name, ''), name), notes = @notes, updated_at = sysutcdatetime()
                  WHERE id = @id`);
        return json({ ok: true, stored: true, id: row.id });
      }

      const id = newId('c');
      await p
        .request()
        .input('id', sql.NVarChar(60), id)
        .input('name', sql.NVarChar(200), body.name || '')
        .input('email', sql.NVarChar(320), email)
        .input('emailLower', sql.NVarChar(320), emailLower)
        .input('phone', sql.NVarChar(60), body.phone || '')
        .input('notes', sql.NVarChar(sql.MAX), body.notes || '')
        .input('source', sql.NVarChar(60), body.source || 'website')
        .query(`INSERT INTO dbo.contacts (id, name, email, email_lower, phone, status, notes, source, created_at, updated_at)
                VALUES (@id, @name, @email, @emailLower, @phone, 'new', @notes, @source, sysutcdatetime(), sysutcdatetime())`);
      return json({ ok: true, stored: true, id });
    } catch {
      // Never surface a capture failure to a public visitor.
      return json({ ok: true, stored: false });
    }
  },
});

app.http('contactsAdminList', {
  route: 'admin/contacts',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request) => {
    if (!configured()) return notConfigured();
    const auth = await authorize(request);
    if (!auth.ok) return forbidden(auth.reason);
    const p = await pool();
    const r = await p
      .request()
      .query(`SELECT id, name, email, phone, status, notes, source, created_at, updated_at
              FROM dbo.contacts ORDER BY updated_at DESC`);
    return json(r.recordset.map(rowToContact));
  },
});

app.http('contactsAdminUpsert', {
  route: 'admin/contacts',
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request) => {
    if (!configured()) return notConfigured();
    const auth = await authorize(request);
    if (!auth.ok) return forbidden(auth.reason);

    const body = await request.json().catch(() => null);
    if (!body || (!body.name && !body.email)) {
      return json({ error: 'bad_request', message: 'name or email is required.' }, 400);
    }
    const id = body.id && String(body.id).trim() ? String(body.id).trim() : newId('c');
    const status = STATUSES.includes(body.status) ? body.status : 'new';
    const email = body.email || '';

    const p = await pool();
    await p
      .request()
      .input('id', sql.NVarChar(60), id)
      .input('name', sql.NVarChar(200), body.name || '')
      .input('email', sql.NVarChar(320), email)
      .input('emailLower', sql.NVarChar(320), email.toLowerCase())
      .input('phone', sql.NVarChar(60), body.phone || '')
      .input('status', sql.NVarChar(20), status)
      .input('notes', sql.NVarChar(sql.MAX), body.notes || '')
      .input('source', sql.NVarChar(60), body.source || 'manual')
      .input('updatedBy', sql.NVarChar(200), auth.email)
      .query(`
        MERGE dbo.contacts AS t
        USING (SELECT @id AS id) AS s ON t.id = s.id
        WHEN MATCHED THEN UPDATE SET
          name=@name, email=@email, email_lower=@emailLower, phone=@phone, status=@status,
          notes=@notes, source=@source, updated_by=@updatedBy, updated_at=sysutcdatetime()
        WHEN NOT MATCHED THEN INSERT
          (id, name, email, email_lower, phone, status, notes, source, updated_by, created_at, updated_at)
          VALUES (@id, @name, @email, @emailLower, @phone, @status, @notes, @source, @updatedBy, sysutcdatetime(), sysutcdatetime());
      `);
    return json({ ok: true, id });
  },
});

app.http('contactsAdminDelete', {
  route: 'admin/contacts',
  methods: ['DELETE'],
  authLevel: 'anonymous',
  handler: async (request) => {
    if (!configured()) return notConfigured();
    const auth = await authorize(request);
    if (!auth.ok) return forbidden(auth.reason);
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return json({ error: 'bad_request', message: 'id query param required.' }, 400);
    const p = await pool();
    await p.request().input('id', sql.NVarChar(60), id).query('DELETE FROM dbo.contacts WHERE id = @id');
    return json({ ok: true, id });
  },
});
