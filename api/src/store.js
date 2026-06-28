// Tiny Azure Table Storage helper shared by every function.
//
// Persistence is intentionally lightweight: two tables, one partition each.
//   events   — PartitionKey 'event',   RowKey = event id
//   contacts — PartitionKey 'contact', RowKey = generated id
//
// The connection string lives in the app setting AZURE_STORAGE_CONNECTION
// (set in the SWA portal — Configuration → Application settings). Until it is
// set every handler returns 503 with a clear message so the admin UI can show
// a "connect storage" banner instead of crashing.

const { TableClient } = require('@azure/data-tables');

const CONN = process.env.AZURE_STORAGE_CONNECTION || '';

function configured() {
  return CONN.length > 0;
}

// Cache one client per table for the life of the worker.
const clients = {};
async function table(name) {
  if (!clients[name]) {
    const client = TableClient.fromConnectionString(CONN, name);
    // Create-if-missing; ignore the "already exists" race.
    try {
      await client.createTable();
    } catch (e) {
      if (!e || e.statusCode !== 409) throw e;
    }
    clients[name] = client;
  }
  return clients[name];
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

// A short, sortable, collision-resistant id without pulling in a uuid dep.
function newId(prefix) {
  const t = Date.now().toString(36);
  const r = Math.floor(Math.random() * 1e9).toString(36);
  return `${prefix}_${t}${r}`;
}

function json(body, status = 200) {
  return {
    status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

function notConfigured() {
  return json(
    { error: 'storage_not_configured', message: 'Set AZURE_STORAGE_CONNECTION in the Static Web App configuration to enable persistence.' },
    503
  );
}

module.exports = { configured, table, caller, newId, json, notConfigured };
