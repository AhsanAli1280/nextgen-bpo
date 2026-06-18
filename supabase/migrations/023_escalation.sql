-- 023_escalation.sql
-- Sprint 4: Escalation engine tables
-- Two-table design per WORKFLOW_STATE_MACHINE.md §4 (overrides single-level in Sprint 4 Arch doc)
-- Depends on: 008 (workflow_templates), 012 (obligations), 013 (workflow_instances), 022 (tasks)

-- ── escalation_policies ───────────────────────────────────────────────────────
-- Policy defines trigger condition. Steps define the notification ladder.
-- escalate_to_role and notify_channel moved to escalation_policy_steps (not here).
CREATE TABLE IF NOT EXISTS escalation_policies (
  policy_id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id             uuid        REFERENCES companies(company_id),
  tenant_id              uuid        REFERENCES tenant_accounts(tenant_id),
  workflow_template_id   uuid        REFERENCES workflow_templates(workflow_template_id),
  trigger_condition      text        NOT NULL
                         CHECK (trigger_condition IN (
                           'obligation_overdue',
                           'task_overdue',
                           'workflow_blocked_n_days',
                           'no_phase_progress_n_days'
                         )),
  threshold_days         integer     NOT NULL DEFAULT 0,
  cooldown_hours         integer     NOT NULL DEFAULT 24,
  is_active              boolean     NOT NULL DEFAULT true,
  created_at             timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_escalation_policies_template
  ON escalation_policies(workflow_template_id)
  WHERE workflow_template_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_escalation_policies_active
  ON escalation_policies(is_active, trigger_condition)
  WHERE is_active = true;

-- ── escalation_policy_steps ───────────────────────────────────────────────────
-- Multi-step escalation ladder. Step 1 fires on trigger; step N fires after delay_hours.
CREATE TABLE IF NOT EXISTS escalation_policy_steps (
  step_id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id                  uuid        NOT NULL
                             REFERENCES  escalation_policies(policy_id) ON DELETE CASCADE,
  step_number                integer     NOT NULL DEFAULT 1,
  delay_hours                integer     NOT NULL DEFAULT 0,
  escalate_to_role           text        NOT NULL CHECK (escalate_to_role IN ('member', 'owner', 'admin')),
  notify_channel             text[]      NOT NULL DEFAULT '{email,in_app}',
  requires_acknowledgement   boolean     NOT NULL DEFAULT false,
  created_at                 timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT uq_policy_step UNIQUE (policy_id, step_number)
);

CREATE INDEX IF NOT EXISTS idx_escalation_steps_policy
  ON escalation_policy_steps(policy_id, step_number);

-- ── escalation_events ─────────────────────────────────────────────────────────
-- Log of every escalation step firing. Used for cooldown dedup and audit.
-- Additions vs Sprint 4 Arch doc: step_id, acknowledged_at, acknowledged_by
CREATE TABLE IF NOT EXISTS escalation_events (
  escalation_event_id    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id              uuid        NOT NULL REFERENCES escalation_policies(policy_id),
  step_id                uuid        REFERENCES escalation_policy_steps(step_id),
  obligation_id          uuid        REFERENCES obligations(obligation_id),
  workflow_instance_id   uuid        REFERENCES workflow_instances(workflow_instance_id),
  task_id                uuid        REFERENCES tasks(task_id),
  tenant_id              uuid        NOT NULL,
  notified_user_ids      uuid[]      NOT NULL,
  trigger_snapshot       jsonb       NOT NULL,
  cooldown_until         timestamptz NOT NULL,
  acknowledged_at        timestamptz,
  acknowledged_by        uuid        REFERENCES users(id),
  created_at             timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_escalation_events_obligation
  ON escalation_events(obligation_id, cooldown_until)
  WHERE obligation_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_escalation_events_workflow
  ON escalation_events(workflow_instance_id, cooldown_until)
  WHERE workflow_instance_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_escalation_events_task
  ON escalation_events(task_id, cooldown_until)
  WHERE task_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_escalation_events_step
  ON escalation_events(step_id, created_at)
  WHERE step_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_escalation_events_unacked
  ON escalation_events(policy_id, acknowledged_at)
  WHERE acknowledged_at IS NULL;

-- RLS
ALTER TABLE escalation_policies      ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalation_policy_steps  ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalation_events        ENABLE ROW LEVEL SECURITY;

-- escalation_policies: readable by all authenticated; mutable by service_role only
CREATE POLICY read_all ON escalation_policies
  FOR SELECT
  USING (
    tenant_id IS NULL
    OR tenant_id = auth_tenant_id()
  );

CREATE POLICY read_all ON escalation_policy_steps
  FOR SELECT
  USING (
    policy_id IN (
      SELECT policy_id FROM escalation_policies
      WHERE tenant_id IS NULL OR tenant_id = auth_tenant_id()
    )
  );

CREATE POLICY tenant_isolation ON escalation_events
  USING (tenant_id = auth_tenant_id());

GRANT SELECT ON escalation_policies TO authenticated;
GRANT SELECT ON escalation_policy_steps TO authenticated;
GRANT SELECT, INSERT ON escalation_events TO authenticated;
