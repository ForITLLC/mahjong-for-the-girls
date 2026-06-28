// TEMPORARY diagnostic — verify the managed-identity SQL path end to end.
// Remove after provisioning is confirmed. Reports whether SQL_CONNECTION_STRING
// is visible to the Function and which connection shape actually authenticates.
const { app } = require('@azure/functions');
const sql = require('mssql');

const CONN = process.env.SQL_CONNECTION_STRING || '';

function parsePair(re) {
  const m = CONN.match(re);
  return m ? m[1].trim() : '';
}

async function tryConnect(label, cfg) {
  let p;
  try {
    p = await new sql.ConnectionPool(cfg).connect();
    const r = await p.request().query('SELECT COUNT(*) AS n FROM dbo.events');
    return { label, ok: true, eventCount: r.recordset[0].n };
  } catch (e) {
    return { label, ok: false, error: e.message, code: e.code };
  } finally {
    if (p) { try { await p.close(); } catch { /* ignore */ } }
  }
}

app.http('health', {
  route: 'health',
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async () => {
    const server = parsePair(/Server=tcp:([^,;]+)/i) || parsePair(/Server=([^,;]+)/i);
    const database = parsePair(/Database=([^;]+)/i);

    const results = [];
    // 1) exactly what db.js does today
    if (CONN) results.push(await tryConnect('connection-string', CONN));
    // 2) explicit config object with azure-active-directory-default
    results.push(
      await tryConnect('config-aad-default', {
        server,
        database,
        options: { encrypt: true, trustServerCertificate: false },
        authentication: { type: 'azure-active-directory-default' },
      })
    );

    return {
      status: 200,
      jsonBody: {
        configured: CONN.length > 0,
        connHasAadDefault: /Authentication=Active Directory Default/i.test(CONN),
        server,
        database,
        results,
      },
    };
  },
});
