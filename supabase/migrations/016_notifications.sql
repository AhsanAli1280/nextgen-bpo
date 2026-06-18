-- 016_notifications.sql
CREATE TABLE IF NOT EXISTS notifications (
  notification_id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id               uuid NOT NULL REFERENCES companies(company_id),
  recipient_user_id        uuid NOT NULL REFERENCES users(id),
  notification_type        text NOT NULL
                           CHECK (notification_type IN ('deadline_approaching', 'deadline_overdue',
                             'rule_changed', 'obligation_recalculated')),
  related_obligation_id    uuid REFERENCES obligations(obligation_id),
  related_rule_version_id  uuid REFERENCES rule_versions(rule_version_id),
  message_rendered         text NOT NULL,
  channel                  text NOT NULL DEFAULT 'email' CHECK (channel IN ('email', 'sms', 'in_app')),
  sent_at                  timestamptz NOT NULL DEFAULT now(),
  read_at                  timestamptz
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(recipient_user_id, read_at);
