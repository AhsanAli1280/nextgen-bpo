-- 013_workflow_instances.sql
CREATE TABLE IF NOT EXISTS workflow_instances (
  workflow_instance_id  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  obligation_id         uuid REFERENCES obligations(obligation_id),
  event_instance_id     uuid REFERENCES event_instances(event_instance_id),
  workflow_template_id  uuid NOT NULL REFERENCES workflow_templates(workflow_template_id),
  tenant_id             uuid NOT NULL REFERENCES tenant_accounts(tenant_id),
  current_phase         text NOT NULL DEFAULT 'Not Started'
                        CHECK (current_phase IN ('Not Started', 'Drafting & Collection',
                          'Internal Approval', 'Filing Submitted', 'Third-Party Verification',
                          'Regulator Review', 'Completed', 'Blocked')),
  current_substate      text,
  substate_entered_at   timestamptz NOT NULL DEFAULT now(),
  blocked_reason        text,
  assigned_to_user_id   uuid REFERENCES users(id),
  created_at            timestamptz NOT NULL DEFAULT now(),
  completed_at          timestamptz,
  demo_session_id       uuid,
  demo_expires_at       timestamptz
);

CREATE TABLE IF NOT EXISTS workflow_phase_history (
  history_id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_instance_id   uuid NOT NULL REFERENCES workflow_instances(workflow_instance_id),
  phase                  text NOT NULL,
  substate               text,
  entered_at             timestamptz NOT NULL,
  exited_at              timestamptz,
  exit_reason            text
);

CREATE INDEX IF NOT EXISTS idx_workflow_tenant_phase
  ON workflow_instances(tenant_id, current_phase);
CREATE INDEX IF NOT EXISTS idx_workflow_obligation
  ON workflow_instances(obligation_id) WHERE obligation_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_workflow_phase_history
  ON workflow_phase_history(workflow_instance_id, entered_at);
CREATE INDEX IF NOT EXISTS idx_workflow_demo
  ON workflow_instances(demo_session_id) WHERE demo_session_id IS NOT NULL;
