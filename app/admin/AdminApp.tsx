'use client';

import { useCallback, useEffect, useState } from 'react';

// ---------------------------------------------------------------------------
// Types mirror the /api payloads (api/src/functions/*.js).
// ---------------------------------------------------------------------------
type Principal = { userId: string; userDetails: string; userRoles: string[] } | null;

interface EventRow {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  neighborhood: string;
  blurb: string;
  status: string;
  level: string;
  cadence: string;
  hidden?: boolean;
}

interface ContactRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  notes: string;
  source: string;
  createdAt?: string;
  updatedAt?: string;
}

const EVENT_STATUSES = ['open', 'waitlist', 'sold-out'];
const EVENT_LEVELS = ['All levels', 'Beginners welcome', 'Regulars'];
const CONTACT_STATUSES = ['new', 'going', 'maybe', 'regular', 'past'];

// Backend reachability: 'ok' | 'unconfigured' (storage missing) | 'offline' (no /api)
type Backend = 'checking' | 'ok' | 'unconfigured' | 'offline';

const empty = '';
const blankEvent = (): EventRow => ({
  id: empty, title: empty, date: empty, time: '6:30 PM', venue: empty,
  neighborhood: 'Seattle', blurb: empty, status: 'open', level: 'All levels',
  cadence: 'One-off', hidden: false,
});
const blankContact = (): ContactRow => ({
  id: empty, name: empty, email: empty, phone: empty, status: 'new', notes: empty, source: 'manual',
});

// Access decision. SWA gates /admin on the `authenticated` role (any Microsoft
// sign-in), then the API enforces the real allowlist (ForIT domains + Caroline,
// plus dbo.staff) and returns 403 to anyone else. We probe one admin endpoint to
// learn which case we're in: ok | forbidden | unconfigured (DB not wired) | offline.
type Access = 'checking' | 'ok' | 'forbidden' | 'unconfigured' | 'offline';

export default function AdminApp() {
  const [me, setMe] = useState<Principal>(undefined as unknown as Principal);
  const [access, setAccess] = useState<Access>('checking');
  const [tab, setTab] = useState<'events' | 'contacts'>('events');

  useEffect(() => {
    fetch('/.auth/me')
      .then((r) => r.json())
      .then((d) => setMe(d?.clientPrincipal ?? null))
      .catch(() => setMe(null));
  }, []);

  // Once signed in, probe an admin endpoint to resolve access.
  useEffect(() => {
    if (!me) return;
    fetch('/api/admin/events')
      .then((r) => {
        if (r.ok) setAccess('ok');
        else if (r.status === 403) setAccess('forbidden');
        else if (r.status === 503) setAccess('unconfigured');
        else setAccess('offline');
      })
      .catch(() => setAccess('offline'));
  }, [me]);

  // Loading identity
  if (me === (undefined as unknown as Principal)) {
    return <Shell><p className="text-mist">Checking your sign-in…</p></Shell>;
  }
  // Not signed in (SWA should have redirected, but be defensive)
  if (!me) {
    return (
      <Shell>
        <p className="text-mist">You&rsquo;re not signed in.</p>
        <a href="/login" className="btn-gold mt-4 text-sm">Sign in with Microsoft</a>
      </Shell>
    );
  }
  if (access === 'checking') {
    return <Shell email={me.userDetails}><p className="text-mist">Checking your access…</p></Shell>;
  }
  // Signed in, but not on the allowlist.
  if (access === 'forbidden') {
    return (
      <Shell email={me.userDetails}>
        <p className="text-mist">
          Signed in as <span className="text-ink">{me.userDetails}</span>, but this account
          isn&rsquo;t on the admin list yet. Ask Ben to add you, then sign back in.
        </p>
        <a href="/logout" className="btn-ghost mt-4 text-sm">Sign out</a>
      </Shell>
    );
  }

  return (
    <Shell email={me.userDetails}>
      <div className="mb-6 flex gap-2">
        <TabBtn active={tab === 'events'} onClick={() => setTab('events')}>Events</TabBtn>
        <TabBtn active={tab === 'contacts'} onClick={() => setTab('contacts')}>Contacts</TabBtn>
      </div>
      {tab === 'events' ? <EventsPanel /> : <ContactsPanel />}
    </Shell>
  );
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------
function Shell({ children, email }: { children: React.ReactNode; email?: string }) {
  return (
    <div className="bg-field min-h-screen">
      <header className="border-b border-ink/10 bg-cream/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-3">
            <span className="tile grid h-8 w-7 place-items-center font-display text-lg font-semibold">馬</span>
            <span className="font-display text-lg">Admin</span>
          </a>
          <div className="flex items-center gap-4 text-sm text-mist">
            {email && <span className="hidden sm:inline">{email}</span>}
            <a href="/logout" className="text-sage-deep hover:text-coral-deep">Sign out</a>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
        active ? 'bg-coral-deep text-white shadow-sm' : 'border border-ink/15 text-mist hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
}

function BackendBanner({ state }: { state: Backend }) {
  if (state === 'ok' || state === 'checking') return null;
  const msg =
    state === 'unconfigured'
      ? 'The database isn’t connected yet. Add the SQL_CONNECTION_STRING app setting in the Static Web App configuration to start saving changes.'
      : 'The backend API isn’t live yet. Once it’s deployed, edits here will save.';
  return (
    <div className="mb-6 rounded-xl border border-coral-deep/40 bg-coral/15 px-4 py-3 text-sm text-coral-deep">
      {msg}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------
function EventsPanel() {
  const [rows, setRows] = useState<EventRow[]>([]);
  const [backend, setBackend] = useState<Backend>('checking');
  const [editing, setEditing] = useState<EventRow | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/events');
      if (r.status === 503) { setBackend('unconfigured'); setRows([]); return; }
      if (!r.ok) { setBackend('offline'); setRows([]); return; }
      setBackend('ok');
      setRows(await r.json());
    } catch {
      setBackend('offline');
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async (ev: EventRow) => {
    setBusy(true);
    await fetch('/api/admin/events', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ev),
    });
    setBusy(false);
    setEditing(null);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    await fetch(`/api/admin/events?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <BackendBanner state={backend} />
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-2xl text-ink">Events</h2>
        <button type="button" onClick={() => setEditing(blankEvent())} className="btn-gold text-sm">
          + Add event
        </button>
      </div>

      {rows.length === 0 && backend === 'ok' && (
        <p className="rounded-xl border border-ink/10 bg-white/60 px-4 py-6 text-center text-sm text-mist">
          No custom events yet. The public calendar shows the standing Thursday/Saturday cadence
          until you add one here. Adding events here takes over the public list.
        </p>
      )}

      <ul className="space-y-3">
        {rows.map((ev) => (
          <li key={ev.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-ink/10 bg-white/70 p-4">
            <div className="min-w-[5rem]">
              <p className="font-display text-lg text-ink">{ev.date}</p>
              <p className="text-xs text-mist">{ev.time}</p>
            </div>
            <div className="flex-1">
              <p className="font-medium text-ink">{ev.title} {ev.hidden && <span className="ml-2 rounded bg-ink/10 px-1.5 py-0.5 text-[0.65rem] uppercase text-mist">Hidden</span>}</p>
              <p className="text-xs text-mist">{ev.status} · {ev.level} · {ev.venue}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setEditing(ev)} className="rounded-lg border border-ink/15 px-3 py-1.5 text-sm text-ink hover:bg-ink/5">Edit</button>
              <button type="button" onClick={() => remove(ev.id)} className="rounded-lg border border-red/40 px-3 py-1.5 text-sm text-red hover:bg-red/10">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <EditModal title={editing.id ? 'Edit event' : 'New event'} onClose={() => setEditing(null)}>
          <Field label="Title"><input className={inp} value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date (YYYY-MM-DD)"><input className={inp} value={editing.date} placeholder="2026-07-09" onChange={(e) => setEditing({ ...editing, date: e.target.value })} /></Field>
            <Field label="Time"><input className={inp} value={editing.time} onChange={(e) => setEditing({ ...editing, time: e.target.value })} /></Field>
          </div>
          <Field label="Venue"><input className={inp} value={editing.venue} onChange={(e) => setEditing({ ...editing, venue: e.target.value })} /></Field>
          <Field label="Neighborhood"><input className={inp} value={editing.neighborhood} onChange={(e) => setEditing({ ...editing, neighborhood: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <select className={inp} value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                {EVENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Level">
              <select className={inp} value={editing.level} onChange={(e) => setEditing({ ...editing, level: e.target.value })}>
                {EVENT_LEVELS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Blurb"><textarea className={inp} rows={3} value={editing.blurb} onChange={(e) => setEditing({ ...editing, blurb: e.target.value })} /></Field>
          <label className="flex items-center gap-2 text-sm text-mist">
            <input type="checkbox" checked={!!editing.hidden} onChange={(e) => setEditing({ ...editing, hidden: e.target.checked })} />
            Hide from the public calendar
          </label>
          <div className="mt-5 flex justify-end gap-3">
            <button type="button" onClick={() => setEditing(null)} className="btn-ghost text-sm">Cancel</button>
            <button type="button" disabled={busy || !editing.title || !editing.date} onClick={() => save(editing)} className="btn-gold text-sm disabled:opacity-40">
              {busy ? 'Saving…' : 'Save'}
            </button>
          </div>
        </EditModal>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Contacts (lightweight CRM)
// ---------------------------------------------------------------------------
function ContactsPanel() {
  const [rows, setRows] = useState<ContactRow[]>([]);
  const [backend, setBackend] = useState<Backend>('checking');
  const [editing, setEditing] = useState<ContactRow | null>(null);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/contacts');
      if (r.status === 503) { setBackend('unconfigured'); setRows([]); return; }
      if (!r.ok) { setBackend('offline'); setRows([]); return; }
      setBackend('ok');
      setRows(await r.json());
    } catch {
      setBackend('offline');
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async (c: ContactRow) => {
    setBusy(true);
    await fetch('/api/admin/contacts', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c),
    });
    setBusy(false);
    setEditing(null);
    load();
  };
  const remove = async (id: string) => {
    if (!confirm('Delete this contact?')) return;
    await fetch(`/api/admin/contacts?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    load();
  };

  const filtered = rows.filter((c) =>
    !q || `${c.name} ${c.email} ${c.notes} ${c.status}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <BackendBanner state={backend} />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-ink">Contacts</h2>
        <div className="flex gap-2">
          <input className={`${inp} w-48`} placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
          <button type="button" onClick={() => setEditing(blankContact())} className="btn-gold text-sm whitespace-nowrap">+ Add</button>
        </div>
      </div>

      {filtered.length === 0 && backend === 'ok' && (
        <p className="rounded-xl border border-ink/10 bg-white/60 px-4 py-6 text-center text-sm text-mist">
          No contacts yet. RSVPs from the site land here automatically, or add one by hand.
        </p>
      )}

      <ul className="space-y-3">
        {filtered.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-ink/10 bg-white/70 p-4">
            <div className="flex-1">
              <p className="font-medium text-ink">{c.name || '(no name)'} <StatusChip s={c.status} /></p>
              <p className="text-xs text-mist">{c.email}{c.phone ? ` · ${c.phone}` : ''}{c.source ? ` · via ${c.source}` : ''}</p>
              {c.notes && <p className="mt-1 whitespace-pre-wrap text-xs text-mist">{c.notes}</p>}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setEditing(c)} className="rounded-lg border border-ink/15 px-3 py-1.5 text-sm text-ink hover:bg-ink/5">Edit</button>
              <button type="button" onClick={() => remove(c.id)} className="rounded-lg border border-red/40 px-3 py-1.5 text-sm text-red hover:bg-red/10">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <EditModal title={editing.id ? 'Edit contact' : 'New contact'} onClose={() => setEditing(null)}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Name"><input className={inp} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="Status">
              <select className={inp} value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                {CONTACT_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Email"><input className={inp} value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></Field>
            <Field label="Phone"><input className={inp} value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></Field>
          </div>
          <Field label="Notes"><textarea className={inp} rows={4} value={editing.notes} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /></Field>
          <div className="mt-5 flex justify-end gap-3">
            <button type="button" onClick={() => setEditing(null)} className="btn-ghost text-sm">Cancel</button>
            <button type="button" disabled={busy || (!editing.name && !editing.email)} onClick={() => save(editing)} className="btn-gold text-sm disabled:opacity-40">
              {busy ? 'Saving…' : 'Save'}
            </button>
          </div>
        </EditModal>
      )}
    </div>
  );
}

function StatusChip({ s }: { s: string }) {
  const map: Record<string, string> = {
    new: 'bg-coral/20 text-coral-deep', going: 'bg-sage/20 text-sage-deep',
    maybe: 'bg-cream-deep text-mist', regular: 'bg-sage-deep/15 text-sage-deep',
    past: 'bg-ink/10 text-mist',
  };
  return <span className={`ml-2 rounded px-1.5 py-0.5 text-[0.65rem] uppercase ${map[s] || 'bg-ink/10 text-mist'}`}>{s}</span>;
}

// ---------------------------------------------------------------------------
// Small shared bits
// ---------------------------------------------------------------------------
const inp =
  'w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-coral-deep';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-3 block">
      <span className="mb-1 block text-xs uppercase tracking-wide text-mist">{label}</span>
      {children}
    </label>
  );
}

function EditModal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
      <div className="relative my-8 w-full max-w-lg rounded-3xl border border-ink/10 bg-cream p-6 shadow-2xl">
        <h3 className="mb-2 font-display text-xl text-ink">{title}</h3>
        {children}
      </div>
    </div>
  );
}
