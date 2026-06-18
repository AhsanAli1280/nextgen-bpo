-- 018_demo_tables.sql
CREATE TABLE IF NOT EXISTS demo_sessions (
  demo_session_id      uuid PRIMARY KEY,
  created_at           timestamptz NOT NULL DEFAULT now(),
  last_activity_at     timestamptz NOT NULL DEFAULT now(),
  expires_at           timestamptz NOT NULL,
  selected_company_id  uuid REFERENCES companies(company_id),
  wizard_completions   integer NOT NULL DEFAULT 0,
  conversion_cta_shown boolean NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_demo_sessions_expires ON demo_sessions(expires_at);
