// Shared data layer — Azure SQL on the shared ForIT client-website server.
//
// This site follows the ForIT "client website" golden master: a dedicated
// database (`mahjong`) on the existing `forit-saas-sql` logical server, reached
// with the `mssql` driver over the SWA's managed identity
// (Authentication=Active Directory Default in SQL_CONNECTION_STRING). No
// standalone Storage account — data lives in the shared server, isolated per
// client by its own database.
//
// Two app-facing tables (dbo.events, dbo.contacts) plus dbo.staff (the admin
// allowlist). Until SQL_CONNECTION_STRING is set every handler degrades
// gracefully: the public site keeps rendering its built-in cadence and the
// admin UI shows a "connect the database" banner instead of crashing.

const sql = require('mssql');

const CONN = process.env.SQL_CONNECTION_STRING || '';

// Defense-in-depth allowlist. SWA already gates /admin + /api/admin/* on the
// `authenticated` role, but we additionally require the signed-in email to be
// either on this list (domain `@…` or an exact address) OR an active row in
// dbo.staff. Caroline signs in with her Google address via a B2B guest account
// in the ForIT tenant, so her exact gmail is allowlisted alongside ForIT.
const ALLOWLIST = (
  process.env.AUTHOR_EMAIL_ALLOWLIST ||
  '@foritllc.com,@forit.io,@foritllc.onmicrosoft.com,caroli.dudeck@gmail.com'
)
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

function configured() {
  return CONN.length > 0;
}

// One pooled connection for the life of the worker (one process per Function
// app), recreated if the first connect attempt fails.
let poolPromise = null;
function pool() {
  if (!CONN) return null;
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(CONN)
      .connect()
      .catch((err) => {
        poolPromise = null;
        throw err;
      });
  }
  return poolPromise;
}

// Decode the SWA-injected caller identity (base64 JSON of clientPrincipal).
function caller(request) {
  const header = request.headers.get('x-ms-client-principal');
  if (!header) return null;
  try {
    return JSON.parse(Buffer.from(header, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

function emailAllowed(email) {
  return ALLOWLIST.some((a) => (a.startsWith('@') ? email.endsWith(a) : email === a));
}

// Authorize an admin caller. Returns { ok:true, email } or { ok:false, reason }.
async function authorize(request) {
  const who = caller(request);
  const email = (who?.userDetails || '').toLowerCase();
  if (!email) return { ok: false, reason: 'no_identity' };
  if (emailAllowed(email)) return { ok: true, email };
  // Fall back to the staff table so admins can be added by INSERT, no redeploy.
  try {
    const p = pool();
    if (p) {
      const r = await (await p)
        .request()
        .input('email', sql.NVarChar(200), email)
        .query('SELECT TOP 1 1 AS ok FROM dbo.staff WHERE LOWER(email) = @email AND active = 1');
      if (r.recordset.length) return { ok: true, email };
    }
  } catch {
    /* if the lookup fails, fall through to deny */
  }
  return { ok: false, reason: 'not_allowed', email };
}

// A short, sortable id without a uuid dependency.
function newId(prefix) {
  const t = Date.now().toString(36);
  const r = Math.floor(Math.random() * 1e9).toString(36);
  return `${prefix}_${t}${r}`;
}

function json(body, status = 200) {
  return { status, jsonBody: body };
}

function notConfigured() {
  return json(
    {
      error: 'db_not_configured',
      message:
        'Set SQL_CONNECTION_STRING in the Static Web App configuration to enable persistence.',
    },
    503
  );
}

function forbidden(reason) {
  return json({ error: 'forbidden', reason: reason || 'not_allowed' }, 403);
}

module.exports = {
  sql,
  configured,
  pool,
  caller,
  authorize,
  emailAllowed,
  newId,
  json,
  notConfigured,
  forbidden,
};
