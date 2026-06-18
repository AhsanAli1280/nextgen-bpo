-- 006_rules_and_versions.sql
-- NOTE: event_type_id is NULLABLE to support date-driven rules (AGM-002, ANNRET-001, ANNRET-002).
-- Date-driven rules have event_type_id = NULL and are triggered by FYE, not a company event.
-- The original plan had this NOT NULL — changed to nullable to support Mode B (date_driven).
CREATE TABLE IF NOT EXISTS rules (
  rule_id                 text PRIMARY KEY,
  event_type_id           uuid REFERENCES event_types(event_type_id),  -- NULL for date-driven rules
  current_rule_version_id uuid,
  created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rule_versions (
  rule_version_id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id                  text NOT NULL REFERENCES rules(rule_id),
  regime_id                uuid NOT NULL REFERENCES regimes(regime_id),
  applicability_expression jsonb NOT NULL DEFAULT '{"op": "always_true"}',
  trigger_event            text,
  deadline_value           integer NOT NULL,
  deadline_unit            text NOT NULL CHECK (deadline_unit IN ('days', 'weeks', 'months', 'years')),
  deadline_basis_note      text,
  form_number              text REFERENCES forms(form_number),
  filing_authority         text NOT NULL,
  legal_source_id          uuid REFERENCES legal_sources(legal_source_id),
  legal_citation           text,
  page_reference           text,
  verification_status      text NOT NULL CHECK (verification_status IN ('VERIFIED', 'PARTIAL-VERIFICATION GAP', 'VERIFICATION GAP')),
  practical_notes          text,
  change_summary           text,
  effective_from           date NOT NULL,
  effective_to             date,
  created_by               uuid,
  created_at               timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE rules
  ADD CONSTRAINT fk_rules_current_version
  FOREIGN KEY (current_rule_version_id) REFERENCES rule_versions(rule_version_id)
  DEFERRABLE INITIALLY DEFERRED;

CREATE INDEX IF NOT EXISTS idx_rule_versions_rule ON rule_versions(rule_id);
CREATE INDEX IF NOT EXISTS idx_rule_versions_regime ON rule_versions(regime_id);
CREATE INDEX IF NOT EXISTS idx_rule_versions_effective ON rule_versions(effective_from, effective_to);

-- Partial index for date-driven rules (event_type_id IS NULL)
CREATE INDEX IF NOT EXISTS idx_rules_date_driven ON rules(rule_id) WHERE event_type_id IS NULL;
