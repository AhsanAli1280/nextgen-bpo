-- 008_obligation_workflow_templates.sql
CREATE TABLE IF NOT EXISTS obligation_templates (
  obligation_template_id  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id                 text NOT NULL REFERENCES rules(rule_id),
  stakes_level            text NOT NULL CHECK (stakes_level IN ('high', 'standard', 'low')),
  default_alert_lead_times integer[] NOT NULL DEFAULT '{30, 7}',
  created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workflow_templates (
  workflow_template_id      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  obligation_template_id    uuid NOT NULL REFERENCES obligation_templates(obligation_template_id),
  name                      text NOT NULL,
  active_phases             jsonb NOT NULL,
  approval_requirement_type text NOT NULL CHECK (approval_requirement_type IN ('board_resolution', 'special_resolution', 'none')),
  document_requirements     jsonb NOT NULL DEFAULT '[]',
  recurrence_type           text NOT NULL CHECK (recurrence_type IN ('one_off', 'fixed_date_recurring', 'process_anchored_recurring')),
  created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workflow_anchor_conditions (
  anchor_condition_id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_template_id         uuid NOT NULL REFERENCES workflow_templates(workflow_template_id),
  anchor_workflow_template_id  uuid NOT NULL REFERENCES workflow_templates(workflow_template_id),
  relationship                 text NOT NULL CHECK (relationship IN ('before', 'after')),
  created_at                   timestamptz NOT NULL DEFAULT now()
);
