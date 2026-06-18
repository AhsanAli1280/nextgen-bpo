-- 022_tasks.sql
-- Sprint 4: Task management tables
-- Depends on: 013 (workflow_instances), 012 (obligations), 009 (tenant_accounts, users)

-- ── tasks ─────────────────────────────────────────────────────────────────────
-- Task state uses WORKFLOW_STATE_MACHINE.md §2.6 (NOT Sprint 4 Arch doc)
CREATE TABLE IF NOT EXISTS tasks (
  task_id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_instance_id   uuid        NOT NULL
                         REFERENCES  workflow_instances(workflow_instance_id) ON DELETE CASCADE,
  obligation_id          uuid        REFERENCES obligations(obligation_id),
  tenant_id              uuid        NOT NULL REFERENCES tenant_accounts(tenant_id),
  phase                  text        NOT NULL,
  task_type              text        NOT NULL
                         CHECK (task_type IN (
                           'collect_document',
                           'prepare_draft',
                           'board_resolution',
                           'special_resolution',
                           'submit_filing',
                           'record_reference',
                           'await_verification',
                           'await_regulator',
                           'resolve_blocker',
                           'record_completion'
                         )),
  title                  text        NOT NULL,
  description            text,
  status                 text        NOT NULL DEFAULT 'pending'
                         CHECK (status IN (
                           'pending', 'assigned', 'in_progress',
                           'completed', 'rejected', 'reopened', 'cancelled'
                         )),
  assigned_to_user_id    uuid        REFERENCES users(id),
  due_date               date,
  sort_order             integer     NOT NULL DEFAULT 0,
  is_hard_prerequisite   boolean     NOT NULL DEFAULT false,
  blocked_reason         text,
  completed_at           timestamptz,
  cancelled_at           timestamptz,
  created_at             timestamptz NOT NULL DEFAULT now(),
  demo_session_id        uuid,
  demo_expires_at        timestamptz
);

CREATE INDEX IF NOT EXISTS idx_tasks_workflow_phase
  ON tasks(workflow_instance_id, phase, sort_order);

CREATE INDEX IF NOT EXISTS idx_tasks_assignee
  ON tasks(assigned_to_user_id, status)
  WHERE assigned_to_user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tasks_tenant_status
  ON tasks(tenant_id, status, due_date);

CREATE INDEX IF NOT EXISTS idx_tasks_obligation
  ON tasks(obligation_id)
  WHERE obligation_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tasks_demo
  ON tasks(demo_session_id)
  WHERE demo_session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tasks_active
  ON tasks(tenant_id, status, due_date)
  WHERE status NOT IN ('completed', 'cancelled');

-- ── task_audit_log ────────────────────────────────────────────────────────────
-- Append-only. REVOKE UPDATE, DELETE from authenticated per security invariant.
-- event_type list per WORKFLOW_STATE_MACHINE.md §6.3 (extends Sprint 4 Arch doc)
CREATE TABLE IF NOT EXISTS task_audit_log (
  log_id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type    text        NOT NULL CHECK (entity_type IN ('task', 'workflow_instance')),
  entity_id      uuid        NOT NULL,
  tenant_id      uuid        NOT NULL,
  actor_type     text        NOT NULL CHECK (actor_type IN ('user', 'system', 'escalation', 'scheduler')),
  actor_user_id  uuid        REFERENCES users(id),
  event_type     text        NOT NULL
                 CHECK (event_type IN (
                   -- Task lifecycle
                   'task_created',
                   'task_assigned',
                   'task_unassigned',
                   'task_reassigned',
                   'task_started',
                   'task_completed',
                   'task_rejected',
                   'task_reopened',
                   'task_cancelled',
                   -- Workflow lifecycle
                   'workflow_created',
                   'phase_advanced',
                   'phase_reverted',
                   'workflow_blocked',
                   'workflow_unblocked',
                   'workflow_completed',
                   'workflow_cancelled',
                   -- Dependency events
                   'dependency_blocked',
                   'dependency_satisfied',
                   -- Escalation events
                   'escalation_triggered',
                   'escalation_acknowledged'
                 )),
  from_state     text,
  to_state       text        NOT NULL,
  reason         text,
  metadata       jsonb       NOT NULL DEFAULT '{}',
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_task_audit_entity
  ON task_audit_log(entity_type, entity_id, created_at);

CREATE INDEX IF NOT EXISTS idx_task_audit_tenant
  ON task_audit_log(tenant_id, created_at);

CREATE INDEX IF NOT EXISTS idx_task_audit_actor
  ON task_audit_log(actor_user_id, created_at)
  WHERE actor_user_id IS NOT NULL;

-- RLS for tasks
ALTER TABLE tasks          ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON tasks
  USING (tenant_id = auth_tenant_id());

CREATE POLICY tenant_isolation ON task_audit_log
  USING (tenant_id = auth_tenant_id());

GRANT SELECT, INSERT, UPDATE, DELETE ON tasks TO authenticated;
GRANT SELECT, INSERT ON task_audit_log TO authenticated;

-- Append-only enforcement: revoke mutating operations
REVOKE UPDATE, DELETE ON task_audit_log FROM authenticated;
