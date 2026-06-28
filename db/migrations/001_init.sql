-- Mahjong for the Girls — initial schema.
-- Idempotent (safe to re-run). Applied against the dedicated `mahjong` database
-- on the shared forit-saas-sql logical server (ForIT client-website pattern).
--
-- Three tables:
--   dbo.events   — the public calendar + admin editor
--   dbo.contacts — the lightweight CRM (RSVP/lead capture)
--   dbo.staff    — admin allowlist (who may use /admin), added by INSERT

IF OBJECT_ID('dbo.events', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.events (
    id            nvarchar(60)   NOT NULL PRIMARY KEY,
    title         nvarchar(400)  NOT NULL,
    date          nvarchar(10)   NOT NULL,           -- ISO 'YYYY-MM-DD' (no TZ drift)
    time          nvarchar(60)   NULL,
    venue         nvarchar(300)  NULL,
    neighborhood  nvarchar(120)  NULL,
    blurb         nvarchar(max)  NULL,
    status        nvarchar(20)   NOT NULL DEFAULT 'open',
    level         nvarchar(60)   NOT NULL DEFAULT 'All levels',
    cadence       nvarchar(60)   NOT NULL DEFAULT 'One-off',
    hidden        bit            NOT NULL DEFAULT 0,
    updated_by    nvarchar(200)  NULL,
    created_at    datetime2      NOT NULL DEFAULT sysutcdatetime(),
    updated_at    datetime2      NOT NULL DEFAULT sysutcdatetime()
  );
  CREATE INDEX ix_events_visible ON dbo.events(hidden, date);
END;

IF OBJECT_ID('dbo.contacts', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.contacts (
    id           nvarchar(60)   NOT NULL PRIMARY KEY,
    name         nvarchar(200)  NULL,
    email        nvarchar(320)  NULL,
    email_lower  nvarchar(320)  NULL,
    phone        nvarchar(60)   NULL,
    status       nvarchar(20)   NOT NULL DEFAULT 'new',
    notes        nvarchar(max)  NULL,
    source       nvarchar(60)   NULL,
    updated_by   nvarchar(200)  NULL,
    created_at   datetime2      NOT NULL DEFAULT sysutcdatetime(),
    updated_at   datetime2      NOT NULL DEFAULT sysutcdatetime()
  );
  CREATE UNIQUE INDEX ux_contacts_email_lower ON dbo.contacts(email_lower) WHERE email_lower IS NOT NULL;
  CREATE INDEX ix_contacts_updated ON dbo.contacts(updated_at DESC);
END;

IF OBJECT_ID('dbo.staff', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.staff (
    id            int IDENTITY(1,1) NOT NULL PRIMARY KEY,
    email         nvarchar(200)     NOT NULL UNIQUE,
    display_name  nvarchar(200)     NULL,
    role          nvarchar(40)      NOT NULL DEFAULT 'editor',
    active        bit               NOT NULL DEFAULT 1,
    created_at    datetime2         NOT NULL DEFAULT sysutcdatetime()
  );
END;

-- Seed the admin allowlist. These are the people who may use /admin. Caroline
-- signs in via a B2B guest account in the ForIT tenant using her Google email.
-- Add more later with the same INSERT pattern — no redeploy needed.
MERGE dbo.staff AS t
USING (VALUES
  ('caroli.dudeck@gmail.com', 'Caroline Dudeck', 'owner'),
  ('b.thomas@forit.io',       'Ben Thomas',      'editor')
) AS s(email, display_name, role) ON LOWER(t.email) = LOWER(s.email)
WHEN NOT MATCHED THEN
  INSERT (email, display_name, role, active) VALUES (s.email, s.display_name, s.role, 1);
