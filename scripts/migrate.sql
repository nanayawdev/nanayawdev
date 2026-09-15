-- ============================================================
-- Arssent — Database Migration
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS project_enquiries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  company     TEXT,
  budget      TEXT,
  message     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'new',   -- new | read | replied
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS faq_questions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  question    TEXT NOT NULL,
  answered    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email          TEXT NOT NULL UNIQUE,
  active         BOOLEAN NOT NULL DEFAULT TRUE,
  subscribed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_sessions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone          TEXT NOT NULL,
  visitor_name   TEXT NOT NULL DEFAULT '',
  status         TEXT NOT NULL DEFAULT 'pending_otp',  -- pending_otp | active | closed
  otp            TEXT,
  otp_expires_at TIMESTAMPTZ,
  token          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id       UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender           TEXT NOT NULL CHECK (sender IN ('user', 'agent')),
  body             TEXT NOT NULL,
  attachment_url   TEXT,
  attachment_name  TEXT,
  attachment_type  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Added after the initial table creation, ALTER so it applies to already-provisioned databases too.
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attachment_url  TEXT;
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attachment_name TEXT;
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS attachment_type TEXT;

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_phone ON chat_sessions(phone);

CREATE TABLE IF NOT EXISTS blog_posts (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug               TEXT NOT NULL UNIQUE,
  title              TEXT NOT NULL,
  excerpt            TEXT NOT NULL,
  body               TEXT NOT NULL,
  category           TEXT NOT NULL DEFAULT 'Software Engineering',
  tags               TEXT[] NOT NULL DEFAULT '{}',
  cover_image        TEXT,
  featured           BOOLEAN NOT NULL DEFAULT FALSE,
  published          BOOLEAN NOT NULL DEFAULT FALSE,
  author             TEXT NOT NULL DEFAULT 'Arssent',
  seo_title          TEXT,
  seo_description    TEXT,
  primary_keyword    TEXT,
  secondary_keywords TEXT[] NOT NULL DEFAULT '{}',
  published_at       TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Added after the initial table creation — ALTER so it applies to already-provisioned databases too.
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_title          TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_description    TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS primary_keyword    TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS secondary_keywords TEXT[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug      ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);

CREATE TABLE IF NOT EXISTS component_resources (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT NOT NULL UNIQUE,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  prompt        TEXT NOT NULL,
  category      TEXT NOT NULL DEFAULT 'General',
  cover_image   TEXT,
  files         JSONB NOT NULL DEFAULT '[]',
  featured      BOOLEAN NOT NULL DEFAULT FALSE,
  published     BOOLEAN NOT NULL DEFAULT FALSE,
  author        TEXT NOT NULL DEFAULT 'nanayawdev',
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_component_resources_slug      ON component_resources(slug);
CREATE INDEX IF NOT EXISTS idx_component_resources_published ON component_resources(published);
CREATE INDEX IF NOT EXISTS idx_component_resources_category  ON component_resources(category);

CREATE TABLE IF NOT EXISTS projects (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  category     TEXT NOT NULL DEFAULT 'Web',
  cover_image  TEXT,
  client_name  TEXT,
  client_url   TEXT,
  tags         TEXT[] NOT NULL DEFAULT '{}',
  platforms    TEXT[] NOT NULL DEFAULT '{}',
  featured     BOOLEAN NOT NULL DEFAULT FALSE,
  published    BOOLEAN NOT NULL DEFAULT FALSE,
  year         TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_slug      ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);

CREATE TABLE IF NOT EXISTS case_studies (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT NOT NULL UNIQUE,
  client           TEXT NOT NULL,
  category         TEXT NOT NULL DEFAULT 'Web Development',
  year             TEXT,
  tagline          TEXT NOT NULL DEFAULT '',
  cover_image      TEXT,
  client_url       TEXT,
  services         TEXT[] NOT NULL DEFAULT '{}',
  stats            JSONB NOT NULL DEFAULT '[]',
  problem          TEXT NOT NULL DEFAULT '',
  approach         TEXT NOT NULL DEFAULT '',
  result           TEXT NOT NULL DEFAULT '',
  result_headline  TEXT NOT NULL DEFAULT '',
  result_body      TEXT NOT NULL DEFAULT '',
  featured         BOOLEAN NOT NULL DEFAULT FALSE,
  published        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_case_studies_slug      ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_published ON case_studies(published);

CREATE TABLE IF NOT EXISTS services (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  tagline      TEXT NOT NULL DEFAULT '',
  description  TEXT NOT NULL DEFAULT '',
  body         TEXT NOT NULL DEFAULT '',
  cover_image  TEXT,
  tags         TEXT[] NOT NULL DEFAULT '{}',
  featured     BOOLEAN NOT NULL DEFAULT FALSE,
  published    BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_slug      ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_published ON services(published);

CREATE TABLE IF NOT EXISTS team_members (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  role         TEXT NOT NULL,
  bio          TEXT NOT NULL DEFAULT '',
  photo        TEXT,
  initials     TEXT NOT NULL DEFAULT '',
  github       TEXT,
  linkedin     TEXT,
  twitter      TEXT,
  website      TEXT,
  published    BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_members_published ON team_members(published);

CREATE TABLE IF NOT EXISTS testimonials (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote        TEXT NOT NULL,
  author_name  TEXT NOT NULL,
  author_role  TEXT NOT NULL DEFAULT '',
  avatar       TEXT,
  published    BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(published);

CREATE TABLE IF NOT EXISTS apps (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  tagline         TEXT NOT NULL DEFAULT '',
  description     TEXT NOT NULL DEFAULT '',
  icon_image      TEXT,
  cover_image     TEXT,
  category        TEXT NOT NULL DEFAULT 'Utility',
  play_store_url  TEXT,
  app_store_url   TEXT,
  website_url     TEXT,
  featured        BOOLEAN NOT NULL DEFAULT FALSE,
  published       BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_apps_slug      ON apps(slug);
CREATE INDEX IF NOT EXISTS idx_apps_published ON apps(published);

CREATE TABLE IF NOT EXISTS admin_users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username       TEXT NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Events + USSD (Hubtel Programmable Services)
-- ============================================================

CREATE TABLE IF NOT EXISTS events (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT NOT NULL UNIQUE,
  title          TEXT NOT NULL,
  description    TEXT NOT NULL DEFAULT '',
  cover_image    TEXT,
  starts_at      TIMESTAMPTZ NOT NULL,
  ends_at        TIMESTAMPTZ,
  venue          TEXT,
  city           TEXT NOT NULL DEFAULT 'Accra',
  is_virtual     BOOLEAN NOT NULL DEFAULT FALSE,
  virtual_link   TEXT,
  price_amount   NUMERIC(10,2) NOT NULL DEFAULT 0,   -- 0 = free
  price_currency TEXT NOT NULL DEFAULT 'GHS',
  capacity       INTEGER,                             -- NULL = unlimited
  featured       BOOLEAN NOT NULL DEFAULT FALSE,
  published      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_slug      ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_published ON events(published);
CREATE INDEX IF NOT EXISTS idx_events_starts_at  ON events(starts_at);

CREATE TABLE IF NOT EXISTS event_registrations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id          UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name              TEXT,
  phone             TEXT NOT NULL,
  email             TEXT,
  quantity          INTEGER NOT NULL DEFAULT 1,
  amount_paid       NUMERIC(10,2) NOT NULL DEFAULT 0,
  source            TEXT NOT NULL DEFAULT 'web',       -- web | ussd
  status            TEXT NOT NULL DEFAULT 'pending',   -- pending | confirmed | cancelled | failed
  payment_status    TEXT NOT NULL DEFAULT 'unpaid',     -- unpaid | paid | failed
  hubtel_order_id   TEXT,
  hubtel_session_id TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event  ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_phone  ON event_registrations(phone);

-- One active registration per phone per event (re-registering after a
-- cancellation is allowed, so the uniqueness excludes cancelled rows).
CREATE UNIQUE INDEX IF NOT EXISTS uq_event_registrations_event_phone_active
  ON event_registrations(event_id, phone) WHERE status <> 'cancelled';

-- Server-side state for an in-progress USSD session. Hubtel's callback is a
-- stateless request per keypress, keyed by its own SessionId — this table
-- is what lets us resume "where the caller left off" between callbacks.
CREATE TABLE IF NOT EXISTS ussd_sessions (
  session_id  TEXT PRIMARY KEY,           -- Hubtel's SessionId
  mobile      TEXT NOT NULL,
  step        TEXT NOT NULL DEFAULT 'main',
  data        JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ussd_sessions_updated_at ON ussd_sessions(updated_at);

-- ============================================================
-- Event USSD flow v2 — full ticketing + on-site ops menu tree
-- (Main Menu: Check Ticket / Register / Event Info / Grounds Mgmt)
-- ============================================================

-- Only one event is "live" on the USSD short code at a time — the main
-- menu greets callers with that event by name.
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_ussd_active       BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS map_link             TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS organizer_phone      TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS organizer_whatsapp   TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS organizer_email      TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS toilet_info          TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS first_aid_info       TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS emergency_exit_info  TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS uq_events_ussd_active ON events(is_ussd_active) WHERE is_ussd_active;

-- Ticket tiers (Regular / VIP / Group...) an admin defines per event.
CREATE TABLE IF NOT EXISTS event_ticket_types (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  price        NUMERIC(10,2) NOT NULL DEFAULT 0,
  min_quantity INTEGER NOT NULL DEFAULT 1,   -- e.g. a "Group" tier requiring 5+
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_ticket_types_event ON event_ticket_types(event_id);

-- Lineup / schedule, grouped by day, shown via "3.2 Schedule/Lineup".
CREATE TABLE IF NOT EXISTS event_schedule_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  day_label   TEXT NOT NULL DEFAULT 'Day 1',
  time_label  TEXT NOT NULL DEFAULT '',
  title       TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_schedule_items_event ON event_schedule_items(event_id);

-- Extend registrations into full tickets: a code shown at the gate, a PIN
-- that authorizes sensitive self-service actions (transfer), a tier, the
-- chosen payment method, and gate check-in state.
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS ticket_code    TEXT;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS pin            TEXT;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS ticket_type    TEXT NOT NULL DEFAULT 'Regular';
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS payment_method TEXT;   -- mobile_money | cash | card
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS checked_in     BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS checked_in_at  TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS uq_event_registrations_ticket_code ON event_registrations(ticket_code);

-- "4. Grounds Management" — Report an Issue + Request Assistance, both
-- logged the same way so on-site staff can triage from one admin inbox.
CREATE TABLE IF NOT EXISTS event_ground_reports (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  kind          TEXT NOT NULL,               -- issue | assistance
  category      TEXT NOT NULL,               -- Security | Sanitation | Sound/Technical | Medical | Crowd Control | Other
  description   TEXT NOT NULL DEFAULT '',
  phone         TEXT NOT NULL,
  ticket_number TEXT NOT NULL UNIQUE,
  status        TEXT NOT NULL DEFAULT 'open',  -- open | in_progress | resolved
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_ground_reports_event ON event_ground_reports(event_id);

CREATE TABLE IF NOT EXISTS event_lost_found (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  kind        TEXT NOT NULL,   -- lost | found
  description TEXT NOT NULL,
  phone       TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'open',   -- open | resolved
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_lost_found_event ON event_lost_found(event_id);

-- Append-only USSD activity log. ussd_sessions (above) holds only the
-- *current* state of an in-progress session and is deleted the moment a
-- session ends — this table is what makes a session's history visible in
-- the admin afterwards. One row per turn (per Interaction URL call).
CREATE TABLE IF NOT EXISTS ussd_activity_log (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        TEXT NOT NULL,
  mobile            TEXT NOT NULL,
  application_id    TEXT,
  application_name  TEXT,
  extension         TEXT,
  step_before       TEXT NOT NULL DEFAULT 'start',  -- which screen this input was answering
  input             TEXT NOT NULL DEFAULT '',
  message           TEXT NOT NULL,                  -- what we replied
  continue_session  BOOLEAN NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ussd_activity_log_session    ON ussd_activity_log(session_id);
CREATE INDEX IF NOT EXISTS idx_ussd_activity_log_mobile     ON ussd_activity_log(mobile);
CREATE INDEX IF NOT EXISTS idx_ussd_activity_log_created_at ON ussd_activity_log(created_at);
