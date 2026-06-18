-- 004_event_types.sql
CREATE TABLE IF NOT EXISTS event_types (
  event_type_id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_category  text NOT NULL,
  event_subtype   text,
  display_name    text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_types_category ON event_types(event_category);
