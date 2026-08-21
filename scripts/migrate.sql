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
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender      TEXT NOT NULL CHECK (sender IN ('user', 'agent')),
  body        TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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
