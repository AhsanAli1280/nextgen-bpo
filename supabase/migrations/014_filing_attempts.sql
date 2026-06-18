-- 014_filing_attempts.sql
CREATE TABLE IF NOT EXISTS filing_attempts (
  filing_attempt_id     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  obligation_id         uuid NOT NULL REFERENCES obligations(obligation_id),
  workflow_instance_id  uuid NOT NULL REFERENCES workflow_instances(workflow_instance_id),
  attempt_number        integer NOT NULL,
  filing_channel        text NOT NULL CHECK (filing_channel IN ('eZfile', 'physical', 'PSX portal')),
  reference_number      text,
  submitted_at          timestamptz NOT NULL DEFAULT now(),
  outcome               text NOT NULL DEFAULT 'pending'
                        CHECK (outcome IN ('pending', 'accepted', 'rejected', 'queries_raised')),
  outcome_reason        text,
  outcome_recorded_at   timestamptz,
  filed_by_user_id      uuid REFERENCES users(id)
);

ALTER TABLE obligations
  ADD CONSTRAINT fk_obligations_current_filing_attempt
  FOREIGN KEY (current_filing_attempt_id) REFERENCES filing_attempts(filing_attempt_id)
  DEFERRABLE INITIALLY DEFERRED;

CREATE INDEX IF NOT EXISTS idx_filing_attempts_obligation ON filing_attempts(obligation_id);
