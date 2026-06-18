-- 025_workflow_alterations.sql
-- Sprint 4: ALTER existing tables for Sprint 4 additions
-- Per WORKFLOW_STATE_MACHINE.md §8.4 (authoritative, overrides Sprint 4 Arch doc)
-- Depends on: 016 (notifications), 013 (workflow_instances), 022 (tasks), 023 (escalation)

-- ── 1. workflow_instances: status column (high-level lifecycle) ───────────────
ALTER TABLE workflow_instances
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'draft'
  CHECK (status IN ('draft', 'active', 'blocked', 'completed', 'cancelled'));

CREATE INDEX IF NOT EXISTS idx_workflow_instances_status
  ON workflow_instances(tenant_id, status)
  WHERE status NOT IN ('completed', 'cancelled');

-- ── 2. workflow_instances: cancellation tracking ──────────────────────────────
ALTER TABLE workflow_instances
  ADD COLUMN IF NOT EXISTS cancelled_at     timestamptz;

ALTER TABLE workflow_instances
  ADD COLUMN IF NOT EXISTS cancelled_reason text;

-- ── 3. workflow_instances: phase_before_block (for unblock restoration) ───────
ALTER TABLE workflow_instances
  ADD COLUMN IF NOT EXISTS phase_before_block text;

-- ── 4. obligation_templates: alert_lead_times (configurable reminder schedule) ─
ALTER TABLE obligation_templates
  ADD COLUMN IF NOT EXISTS alert_lead_times jsonb NOT NULL DEFAULT '[30,14,7,3,1]';

-- ── 5. notifications: extend notification_type CHECK for Sprint 4 events ──────
ALTER TABLE notifications
  DROP CONSTRAINT IF EXISTS notifications_notification_type_check;

ALTER TABLE notifications
  ADD CONSTRAINT notifications_notification_type_check
  CHECK (notification_type IN (
    -- Sprint 3 types (preserved)
    'deadline_approaching', 'deadline_overdue', 'rule_changed', 'obligation_recalculated',
    -- Sprint 4 additions
    'task_assigned', 'task_due_soon', 'task_overdue',
    'workflow_phase_changed', 'workflow_blocked', 'workflow_completed',
    'escalation_triggered', 'filing_outcome',
    -- Additional types for dependency and reminder events
    'task_rejected', 'dependency_satisfied'
  ));

-- ── 6. notifications: extend channel CHECK for WhatsApp (future V2) ──────────
ALTER TABLE notifications
  DROP CONSTRAINT IF EXISTS notifications_channel_check;

ALTER TABLE notifications
  ADD CONSTRAINT notifications_channel_check
  CHECK (channel IN ('email', 'sms', 'in_app', 'whatsapp'));

-- ── 7. notifications: add workflow and task linkage columns ───────────────────
ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS related_workflow_instance_id uuid
    REFERENCES workflow_instances(workflow_instance_id);

ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS related_task_id uuid
    REFERENCES tasks(task_id);
