-- 017_knowledge_base.sql
CREATE TABLE IF NOT EXISTS knowledge_base_entries (
  entry_id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_version_id   uuid NOT NULL REFERENCES rule_versions(rule_version_id),
  plain_language    text NOT NULL,
  verification_note text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_knowledge_base_version ON knowledge_base_entries(rule_version_id);
