-- 007_event_wizard.sql
CREATE TABLE IF NOT EXISTS event_cards (
  event_card_id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type_id   uuid NOT NULL REFERENCES event_types(event_type_id),
  display_label   text NOT NULL,
  icon_key        text NOT NULL,
  display_order   integer NOT NULL,
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS event_wizard_steps (
  step_id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type_id   uuid NOT NULL REFERENCES event_types(event_type_id),
  question_text   text NOT NULL,
  display_order   integer NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS event_wizard_options (
  option_id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id               uuid NOT NULL REFERENCES event_wizard_steps(step_id),
  option_label          text NOT NULL,
  resolves_to_rule_id   text REFERENCES rules(rule_id),
  next_step_id          uuid REFERENCES event_wizard_steps(step_id),
  display_order         integer NOT NULL,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_cards_type ON event_cards(event_type_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_wizard_steps_type ON event_wizard_steps(event_type_id, display_order);
CREATE INDEX IF NOT EXISTS idx_wizard_options_step ON event_wizard_options(step_id, display_order);
