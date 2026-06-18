-- 024_notification_outbox.sql
-- Sprint 4: Notification outbox (dispatch queue for email / WhatsApp)
-- The existing notifications table is the in-app inbox.
-- This outbox queues external-channel sends for the notification-dispatcher Edge Function.
-- Depends on: 009 (users, tenant_accounts), 012 (obligations), 013 (workflow_instances), 022 (tasks)

CREATE TABLE IF NOT EXISTS notification_outbox (
  outbox_id                     uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id                     uuid        NOT NULL REFERENCES tenant_accounts(tenant_id),
  recipient_user_id             uuid        NOT NULL REFERENCES users(id),
  recipient_email               text,
  recipient_phone               text,
  channel                       text        NOT NULL CHECK (channel IN ('email', 'whatsapp', 'sms')),
  notification_type             text        NOT NULL,
  subject                       text,
  body_text                     text        NOT NULL,
  body_html                     text,
  payload                       jsonb       NOT NULL DEFAULT '{}',
  status                        text        NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending', 'sending', 'sent', 'failed', 'cancelled')),
  attempts                      integer     NOT NULL DEFAULT 0,
  last_attempt_at               timestamptz,
  last_error                    text,
  sent_at                       timestamptz,
  scheduled_for                 timestamptz NOT NULL DEFAULT now(),
  created_at                    timestamptz NOT NULL DEFAULT now(),

  -- Source linkage (FKs optional — obligations/instances may not exist at queue time)
  related_obligation_id         uuid        REFERENCES obligations(obligation_id),
  related_workflow_instance_id  uuid        REFERENCES workflow_instances(workflow_instance_id),
  related_task_id               uuid        REFERENCES tasks(task_id)
);

-- Processing index: dispatcher polls on this
CREATE INDEX IF NOT EXISTS idx_notification_outbox_pending
  ON notification_outbox(scheduled_for, status)
  WHERE status IN ('pending', 'failed');

CREATE INDEX IF NOT EXISTS idx_notification_outbox_tenant
  ON notification_outbox(tenant_id, created_at);

CREATE INDEX IF NOT EXISTS idx_notification_outbox_obligation
  ON notification_outbox(related_obligation_id, created_at)
  WHERE related_obligation_id IS NOT NULL;

-- Deduplication indexes per WORKFLOW_STATE_MACHINE.md §8.3
CREATE UNIQUE INDEX IF NOT EXISTS idx_outbox_dedup_obligation
  ON notification_outbox(recipient_user_id, notification_type, related_obligation_id, DATE(created_at))
  WHERE related_obligation_id IS NOT NULL AND status != 'cancelled';

CREATE UNIQUE INDEX IF NOT EXISTS idx_outbox_dedup_task
  ON notification_outbox(recipient_user_id, notification_type, related_task_id, DATE(created_at))
  WHERE related_task_id IS NOT NULL AND status != 'cancelled';

-- RLS
ALTER TABLE notification_outbox ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON notification_outbox
  USING (tenant_id = auth_tenant_id());

GRANT SELECT, INSERT, UPDATE ON notification_outbox TO authenticated;
