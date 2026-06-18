-- 001_lookup_tables.sql
CREATE TABLE IF NOT EXISTS regulators (
  regulator_id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL UNIQUE,
  full_name      text NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS regulatory_categories (
  category_id    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name           text NOT NULL UNIQUE,
  created_at     timestamptz NOT NULL DEFAULT now()
);

INSERT INTO regulators (name, full_name) VALUES
  ('SECP',  'Securities and Exchange Commission of Pakistan'),
  ('PSX',   'Pakistan Stock Exchange'),
  ('SBP',   'State Bank of Pakistan'),
  ('FBR',   'Federal Board of Revenue'),
  ('FMU',   'Financial Monitoring Unit')
ON CONFLICT (name) DO NOTHING;

INSERT INTO regulatory_categories (name) VALUES
  ('Insurance'), ('NBFC'), ('Modaraba'), ('REIT'), ('Bank'), ('Microfinance Bank')
ON CONFLICT (name) DO NOTHING;
