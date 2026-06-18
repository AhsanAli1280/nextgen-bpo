-- 003_regimes.sql
CREATE TABLE IF NOT EXISTS regimes (
  regime_id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                       text NOT NULL,
  administering_regulator_id uuid NOT NULL REFERENCES regulators(regulator_id),
  applicability_expression   jsonb NOT NULL,
  primary_legal_source_id    uuid REFERENCES legal_sources(legal_source_id),
  description                text,
  created_at                 timestamptz NOT NULL DEFAULT now()
);
