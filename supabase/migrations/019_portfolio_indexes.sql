-- 019_portfolio_indexes.sql
CREATE INDEX IF NOT EXISTS idx_obligations_demo_expires
  ON obligations(demo_expires_at)
  WHERE demo_session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_workflow_instances_demo_expires
  ON workflow_instances(demo_expires_at)
  WHERE demo_session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_event_instances_demo_expires
  ON event_instances(demo_expires_at)
  WHERE demo_session_id IS NOT NULL;
