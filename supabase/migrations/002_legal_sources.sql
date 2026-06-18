-- 002_legal_sources.sql
CREATE TABLE IF NOT EXISTS legal_sources (
  legal_source_id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title                         text NOT NULL,
  issuing_authority             text NOT NULL CHECK (issuing_authority IN ('SECP', 'PSX', 'Federal Government', 'SBP', 'FBR', 'FMU')),
  instrument_type               text NOT NULL,
  notification_number           text,
  notification_date             date,
  effective_date                date NOT NULL,
  source_url                    text,
  superseded_by_legal_source_id uuid REFERENCES legal_sources(legal_source_id),
  retrieved_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_legal_sources_effective ON legal_sources(effective_date);
