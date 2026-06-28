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

function describeErr(e) {
  const out = { error: e && e.message, code: e && e.code, name: e && e.name };
  // mssql wraps the driver error; @azure/identity aggregates inner errors.
  if (e && e.originalError) out.original = e.originalError.message;
  if (e && Array.isArray(e.errors)) out.inner = e.errors.map((x) => x && (x.message || String(x)));
  if (e && e.stack) out.stack0 = String(e.stack).split('\n').slice(0, 3);
  return out;
}

async function tryConnect(label, cfg) {
  let p;
  try {
    p = await new sql.ConnectionPool(cfg).connect();
    const r = await p.request().query('SELECT COUNT(*) AS n FROM dbo.events');
    return { label, ok: true, eventCount: r.recordset[0].n };
  } catch (e) {
    return { label, ok: false, ...describeErr(e) };
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

    const base = { server, database, options: { encrypt: true, trustServerCertificate: false } };
    const results = [];
    // 2) DefaultAzureCredential chain
    results.push(
      await tryConnect('config-aad-default', { ...base, authentication: { type: 'azure-active-directory-default' } })
    );
    // 3) explicit App Service / Functions MSI (reads IDENTITY_ENDPOINT/IDENTITY_HEADER)
    results.push(
      await tryConnect('config-aad-msi-appservice', {
        ...base,
        authentication: { type: 'azure-active-directory-msi-app-service' },
      })
    );

    // which @azure/identity managed-identity env signals are present?
    const env = {};
    for (const k of ['IDENTITY_ENDPOINT', 'IDENTITY_HEADER', 'MSI_ENDPOINT', 'MSI_SECRET', 'AZURE_CLIENT_ID', 'WEBSITE_SITE_NAME']) {
      env[k] = process.env[k] ? 'set' : 'absent';
    }
    let identityPkg = 'absent';
    try { identityPkg = require('@azure/identity/package.json').version; } catch { /* not bundled */ }

    return {
      status: 200,
      jsonBody: {
        configured: CONN.length > 0,
        connHasAadDefault: /Authentication=Active Directory Default/i.test(CONN),
        server,
        database,
        identityPkg,
        env,
        results,
      },
    };
  },
});
