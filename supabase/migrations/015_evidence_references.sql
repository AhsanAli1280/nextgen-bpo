-- 015_evidence_references.sql
-- File storage columns intentionally absent in V1 (no document storage constraint).
CREATE TABLE IF NOT EXISTS evidence_references (
  evidence_reference_id  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  obligation_id          uuid REFERENCES obligations(obligation_id),
  workflow_instance_id   uuid REFERENCES workflow_instances(workflow_instance_id),
  document_type          text NOT NULL,
  label                  text NOT NULL,
  status                 text NOT NULL CHECK (status IN ('pending', 'received', 'not_applicable')),
  received_date          date,
  held_at_note           text,
  recorded_by_user_id    uuid REFERENCES users(id),
  created_at             timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE obligations
  ADD CONSTRAINT fk_obligations_evidence
  FOREIGN KEY (evidence_reference_id) REFERENCES evidence_references(evidence_reference_id);
