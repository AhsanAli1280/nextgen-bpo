-- 005_forms.sql
CREATE TABLE IF NOT EXISTS forms (
  form_id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_number          text NOT NULL UNIQUE,
  form_name            text NOT NULL,
  prior_names          text[],
  legal_source_id      uuid REFERENCES legal_sources(legal_source_id),
  filing_channel       text NOT NULL CHECK (filing_channel IN ('eZfile', 'physical', 'either', 'PSX portal')),
  current_template_url text,
  created_at           timestamptz NOT NULL DEFAULT now()
);
