-- 012_obligations.sql
CREATE TABLE IF NOT EXISTS obligations (
  obligation_id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id                 uuid NOT NULL REFERENCES companies(company_id),
  tenant_id                  uuid NOT NULL REFERENCES tenant_accounts(tenant_id),
  rule_version_id            uuid NOT NULL REFERENCES rule_versions(rule_version_id),
  event_type_id              uuid REFERENCES event_types(event_type_id),
  trigger_date               date NOT NULL,
  computed_deadline          date NOT NULL,
  linked_obligation_id       uuid REFERENCES obligations(obligation_id),
  status                     text NOT NULL DEFAULT 'upcoming'
                             CHECK (status IN ('upcoming', 'due_soon', 'overdue', 'filed', 'not_applicable', 'superseded')),
  current_filing_attempt_id  uuid,
  evidence_reference_id      uuid,
  assigned_to_user_id        uuid REFERENCES users(id),
  created_at                 timestamptz NOT NULL DEFAULT now(),
  recalculated_at            timestamptz,
  demo_session_id            uuid,
  demo_expires_at            timestamptz
);

CREATE INDEX IF NOT EXISTS idx_obligations_company_status_deadline
  ON obligations(company_id, status, computed_deadline);

CREATE INDEX IF NOT EXISTS idx_obligations_tenant_status_deadline
  ON obligations(tenant_id, status, computed_deadline);

CREATE INDEX IF NOT EXISTS idx_obligations_tenant_event_type
  ON obligations(tenant_id, event_type_id)
  WHERE event_type_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_obligations_filing_attempt
  ON obligations(current_filing_attempt_id)
  WHERE current_filing_attempt_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_obligations_demo
  ON obligations(demo_session_id)
  WHERE demo_session_id IS NOT NULL;

ALTER TABLE event_obligations
  ADD CONSTRAINT fk_event_obligations_obligation
  FOREIGN KEY (obligation_id) REFERENCES obligations(obligation_id);
