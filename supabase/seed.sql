-- supabase/seed.sql
-- V1 rule engine seed data for development and integration testing.
-- UUIDs match constants in lib/rule-engine/in-memory-adapter.ts SEED object.
-- Run after migrations: psql $DATABASE_URL -f supabase/seed.sql

-- ── Demo tenant ───────────────────────────────────────────────────────────────

INSERT INTO tenant_accounts (tenant_id, name, is_demo, plan) VALUES
  ('tttttttt-0000-0000-0000-000000000001', 'Demo Tenant', true, 'demo')
ON CONFLICT (tenant_id) DO NOTHING;

-- ── Demo companies ────────────────────────────────────────────────────────────

INSERT INTO companies (company_id, legal_name, cuin, incorporation_date, status, tenant_owner_id) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'ABC Manufacturing (Pvt) Ltd', 'K-012345', '2015-03-01', 'active', 'tttttttt-0000-0000-0000-000000000001'),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'XYZ Textiles Ltd',            'K-067890', '2005-07-01', 'active', 'tttttttt-0000-0000-0000-000000000001')
ON CONFLICT (company_id) DO NOTHING;

INSERT INTO company_profiles
  (company_profile_id, company_id, corporate_form, is_public_sector_company, is_government_controlled,
   is_foreign_owned_majority, financial_year_end_month, financial_year_end_day, paid_up_capital, effective_from)
VALUES
  (gen_random_uuid(), 'aaaaaaaa-0000-0000-0000-000000000001', 'private',  false, false, false, 6,  30, 10000000.00,  CURRENT_DATE),
  (gen_random_uuid(), 'bbbbbbbb-0000-0000-0000-000000000002', 'listed',   false, false, false, 12, 31, 500000000.00, CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- ── Regulators (idempotent — already in migration 001) ────────────────────────

INSERT INTO regulators (name, full_name) VALUES
  ('SECP', 'Securities and Exchange Commission of Pakistan'),
  ('PSX',  'Pakistan Stock Exchange')
ON CONFLICT (name) DO NOTHING;

-- ── Legal sources ─────────────────────────────────────────────────────────────

INSERT INTO legal_sources (legal_source_id, title, issuing_authority, instrument_type, effective_date) VALUES
  ('ls000000-0000-0000-0000-000000000001', 'Companies Act 2017',            'Federal Government', 'Act',       '2017-06-01'),
  ('ls000000-0000-0000-0000-000000000002', 'Companies Regulations 2024',    'SECP',               'Regulation','2024-01-01'),
  ('ls000000-0000-0000-0000-000000000003', 'PSX Rule Book (Main Board)',     'PSX',                'Rule Book', '2020-01-01'),
  ('ls000000-0000-0000-0000-000000000004', 'Listed Companies CCG Regs 2019','SECP',               'Regulation','2019-01-01')
ON CONFLICT (legal_source_id) DO NOTHING;

-- ── Regimes ───────────────────────────────────────────────────────────────────

INSERT INTO regimes (regime_id, name, administering_regulator_id, applicability_expression, primary_legal_source_id) VALUES
  ('rrrr0000-0000-0000-0000-000000000001',
   'Companies Act 2017',
   (SELECT regulator_id FROM regulators WHERE name = 'SECP'),
   '{"op": "always_true"}',
   'ls000000-0000-0000-0000-000000000001'),

  ('rrrr0000-0000-0000-0000-000000000002',
   'Companies Regulations 2024',
   (SELECT regulator_id FROM regulators WHERE name = 'SECP'),
   '{"op": "always_true"}',
   'ls000000-0000-0000-0000-000000000002'),

  ('rrrr0000-0000-0000-0000-000000000003',
   'PSX Rule Book (Main Board)',
   (SELECT regulator_id FROM regulators WHERE name = 'PSX'),
   '{"op": "eq", "field": "corporate_form", "value": "listed"}',
   'ls000000-0000-0000-0000-000000000003'),

  ('rrrr0000-0000-0000-0000-000000000004',
   'Listed Companies CCG Regulations 2019',
   (SELECT regulator_id FROM regulators WHERE name = 'SECP'),
   '{"op": "eq", "field": "corporate_form", "value": "listed"}',
   'ls000000-0000-0000-0000-000000000004')
ON CONFLICT (regime_id) DO NOTHING;

-- ── Event types ───────────────────────────────────────────────────────────────

INSERT INTO event_types (event_type_id, event_category, event_subtype, display_name) VALUES
  ('eeee0000-0000-0000-0000-000000000001', 'Director & Officer Changes',  'Director Resignation', 'Director Resignation'),
  ('eeee0000-0000-0000-0000-000000000002', 'Share Capital & Allotment',   'Share Allotment',      'Share Allotment'),
  ('eeee0000-0000-0000-0000-000000000003', 'Registered Office & Name',    null,                   'Registered Office Change'),
  ('eeee0000-0000-0000-0000-000000000004', 'Company Status & Governance', 'AGM',                  'AGM Completion'),
  ('eeee0000-0000-0000-0000-000000000005', 'Charges & Mortgages',         'Charge Creation',      'Charge Creation / Modification'),
  ('eeee0000-0000-0000-0000-000000000006', 'Beneficial Ownership',        'BO Change',            'Beneficial Ownership Change')
ON CONFLICT (event_type_id) DO NOTHING;

-- ── Forms ─────────────────────────────────────────────────────────────────────

INSERT INTO forms (form_number, form_name, legal_source_id, filing_channel) VALUES
  ('Form-9',  'Particulars of Directors',         'ls000000-0000-0000-0000-000000000002', 'eZfile'),
  ('Form-3',  'Return of Allotment of Shares',    'ls000000-0000-0000-0000-000000000002', 'eZfile'),
  ('Form-21', 'Notice of Change of Address',      'ls000000-0000-0000-0000-000000000002', 'eZfile'),
  ('Form-10', 'Particulars of Charge',            'ls000000-0000-0000-0000-000000000001', 'eZfile'),
  ('Form-A',  'Annual Return',                    'ls000000-0000-0000-0000-000000000001', 'eZfile')
ON CONFLICT (form_number) DO NOTHING;

-- ── Rules ─────────────────────────────────────────────────────────────────────

INSERT INTO rules (rule_id, event_type_id) VALUES
  ('DIR-001',    'eeee0000-0000-0000-0000-000000000001'),
  ('DIR-002',    'eeee0000-0000-0000-0000-000000000001'),
  ('SHARE-001',  'eeee0000-0000-0000-0000-000000000002'),
  ('OFFICE-002', 'eeee0000-0000-0000-0000-000000000003'),
  ('OFFICE-003', 'eeee0000-0000-0000-0000-000000000003'),
  ('AGM-007',    'eeee0000-0000-0000-0000-000000000004'),
  ('CHARGE-001', 'eeee0000-0000-0000-0000-000000000005'),
  ('BO-002',     'eeee0000-0000-0000-0000-000000000006'),
  ('AGM-002',    null),  -- date-driven: no event type
  ('ANNRET-001', null),  -- date-driven: no event type
  ('ANNRET-002', null)   -- date-driven: no event type (listed only via applicability_expression)
ON CONFLICT (rule_id) DO NOTHING;

-- ── Rule versions (V1, effective_to = NULL = current) ─────────────────────────

INSERT INTO rule_versions
  (rule_version_id, rule_id, regime_id, applicability_expression,
   trigger_event, deadline_value, deadline_unit, form_number,
   filing_authority, legal_source_id, legal_citation,
   verification_status, effective_from)
VALUES
  ('vvvv0000-0000-0000-0000-000000000001',
   'DIR-001', 'rrrr0000-0000-0000-0000-000000000001',
   '{"op": "always_true"}',
   'director_resignation', 10, 'days', null,
   'SECP', 'ls000000-0000-0000-0000-000000000001',
   'Companies Act 2017, Section 154(1)', 'VERIFIED', '2017-01-01'),

  ('vvvv0000-0000-0000-0000-000000000002',
   'DIR-002', 'rrrr0000-0000-0000-0000-000000000002',
   '{"op": "always_true"}',
   'director_resignation', 15, 'days', 'Form-9',
   'SECP', 'ls000000-0000-0000-0000-000000000002',
   'Companies Regulations 2024, Regulation 28(2)', 'VERIFIED', '2024-01-01'),

  ('vvvv0000-0000-0000-0000-000000000003',
   'SHARE-001', 'rrrr0000-0000-0000-0000-000000000002',
   '{"op": "always_true"}',
   'share_allotment', 30, 'days', 'Form-3',
   'SECP', 'ls000000-0000-0000-0000-000000000002',
   'Companies Regulations 2024, Regulation 19(1)', 'VERIFIED', '2024-01-01'),

  ('vvvv0000-0000-0000-0000-000000000004',
   'OFFICE-002', 'rrrr0000-0000-0000-0000-000000000002',
   '{"op": "always_true"}',
   'registered_office_change', 15, 'days', 'Form-21',
   'SECP', 'ls000000-0000-0000-0000-000000000002',
   'Companies Regulations 2024, Regulation 16', 'VERIFIED', '2024-01-01'),

  ('vvvv0000-0000-0000-0000-000000000005',
   'OFFICE-003', 'rrrr0000-0000-0000-0000-000000000001',
   '{"op": "always_true"}',
   'registered_office_change_cross_province', 90, 'days', 'Form-21',
   'SECP', 'ls000000-0000-0000-0000-000000000001',
   'Companies Act 2017, Section 21', 'VERIFIED', '2017-01-01'),

  ('vvvv0000-0000-0000-0000-000000000006',
   'AGM-007', 'rrrr0000-0000-0000-0000-000000000003',
   '{"op": "eq", "field": "corporate_form", "value": "listed"}',
   'agm_completion', 10, 'days', null,
   'Pakistan Stock Exchange',
   'ls000000-0000-0000-0000-000000000003',
   'PSX Rule Book, Chapter 5 Para 5.6.1', 'VERIFIED', '2020-01-01'),

  -- B1: Charges & Beneficial Ownership (event-triggered)
  ('vvvv0000-0000-0000-0000-000000000007',
   'CHARGE-001', 'rrrr0000-0000-0000-0000-000000000001',
   '{"op": "always_true"}',
   'charge_creation', 30, 'days', 'Form-10',
   'SECP', 'ls000000-0000-0000-0000-000000000001',
   'Companies Act 2017, Section 100', 'VERIFIED', '2017-01-01'),

  ('vvvv0000-0000-0000-0000-000000000008',
   'BO-002', 'rrrr0000-0000-0000-0000-000000000001',
   '{"op": "always_true"}',
   'beneficial_ownership_change', 30, 'days', null,
   'SECP', 'ls000000-0000-0000-0000-000000000001',
   'Companies Act 2017, Section 452A', 'VERIFIED', '2020-01-01'),

  -- B5: Date-driven rules (Mode B — event_type_id IS NULL on rules table)
  ('vvvv0000-0000-0000-0000-000000000009',
   'AGM-002', 'rrrr0000-0000-0000-0000-000000000001',
   '{"op": "always_true"}',
   null, 120, 'days', null,
   'SECP', 'ls000000-0000-0000-0000-000000000001',
   'Companies Act 2017, Section 132(1)', 'VERIFIED', '2017-01-01'),

  ('vvvv0000-0000-0000-0000-000000000010',
   'ANNRET-001', 'rrrr0000-0000-0000-0000-000000000001',
   '{"op": "always_true"}',
   null, 60, 'days', 'Form-A',
   'SECP', 'ls000000-0000-0000-0000-000000000001',
   'Companies Act 2017, Section 130(1)', 'VERIFIED', '2017-01-01'),

  ('vvvv0000-0000-0000-0000-000000000011',
   'ANNRET-002', 'rrrr0000-0000-0000-0000-000000000003',
   '{"op": "eq", "field": "corporate_form", "value": "listed"}',
   null, 30, 'days', null,
   'Pakistan Stock Exchange',
   'ls000000-0000-0000-0000-000000000003',
   'PSX Rule Book, Chapter 5 — Annual Return Disclosure', 'VERIFIED', '2020-01-01')
ON CONFLICT (rule_version_id) DO NOTHING;

-- Update current_rule_version_id pointers on rules table
UPDATE rules SET current_rule_version_id = 'vvvv0000-0000-0000-0000-000000000001' WHERE rule_id = 'DIR-001';
UPDATE rules SET current_rule_version_id = 'vvvv0000-0000-0000-0000-000000000002' WHERE rule_id = 'DIR-002';
UPDATE rules SET current_rule_version_id = 'vvvv0000-0000-0000-0000-000000000003' WHERE rule_id = 'SHARE-001';
UPDATE rules SET current_rule_version_id = 'vvvv0000-0000-0000-0000-000000000004' WHERE rule_id = 'OFFICE-002';
UPDATE rules SET current_rule_version_id = 'vvvv0000-0000-0000-0000-000000000005' WHERE rule_id = 'OFFICE-003';
UPDATE rules SET current_rule_version_id = 'vvvv0000-0000-0000-0000-000000000006' WHERE rule_id = 'AGM-007';
UPDATE rules SET current_rule_version_id = 'vvvv0000-0000-0000-0000-000000000007' WHERE rule_id = 'CHARGE-001';
UPDATE rules SET current_rule_version_id = 'vvvv0000-0000-0000-0000-000000000008' WHERE rule_id = 'BO-002';
UPDATE rules SET current_rule_version_id = 'vvvv0000-0000-0000-0000-000000000009' WHERE rule_id = 'AGM-002';
UPDATE rules SET current_rule_version_id = 'vvvv0000-0000-0000-0000-000000000010' WHERE rule_id = 'ANNRET-001';
UPDATE rules SET current_rule_version_id = 'vvvv0000-0000-0000-0000-000000000011' WHERE rule_id = 'ANNRET-002';

-- ── Obligation templates + workflow templates ──────────────────────────────────

INSERT INTO obligation_templates (obligation_template_id, rule_id, stakes_level, default_alert_lead_times) VALUES
  ('ot000000-0000-0000-0000-000000000001', 'DIR-001',    'high',     '{30, 7}'),
  ('ot000000-0000-0000-0000-000000000002', 'DIR-002',    'high',     '{30, 7}'),
  ('ot000000-0000-0000-0000-000000000003', 'SHARE-001',  'standard', '{30, 7}'),
  ('ot000000-0000-0000-0000-000000000004', 'OFFICE-002', 'standard', '{14, 3}'),
  ('ot000000-0000-0000-0000-000000000005', 'OFFICE-003', 'standard', '{30, 7}'),
  ('ot000000-0000-0000-0000-000000000006', 'AGM-007',    'high',     '{7, 1}'),
  ('ot000000-0000-0000-0000-000000000007', 'CHARGE-001', 'standard', '{30, 7}'),
  ('ot000000-0000-0000-0000-000000000008', 'BO-002',     'high',     '{30, 7}'),
  ('ot000000-0000-0000-0000-000000000009', 'AGM-002',    'high',     '{60, 30, 7}'),
  ('ot000000-0000-0000-0000-000000000010', 'ANNRET-001', 'high',     '{30, 7}'),
  ('ot000000-0000-0000-0000-000000000011', 'ANNRET-002', 'high',     '{14, 7}')
ON CONFLICT (obligation_template_id) DO NOTHING;

INSERT INTO workflow_templates
  (workflow_template_id, obligation_template_id, name,
   active_phases, approval_requirement_type, document_requirements, recurrence_type)
VALUES
  ('wwww0000-0000-0000-0000-000000000001',
   'ot000000-0000-0000-0000-000000000001',
   'Director Resignation — Officer Notification',
   '[{"phase": "Drafting & Collection", "order": 1}, {"phase": "Completed", "order": 2}]',
   'none', '[]', 'one_off'),

  ('wwww0000-0000-0000-0000-000000000002',
   'ot000000-0000-0000-0000-000000000002',
   'Director Resignation — Form-9 Filing',
   '[{"phase": "Drafting & Collection", "order": 1}, {"phase": "Filing Submitted", "order": 2}, {"phase": "Completed", "order": 3}]',
   'none', '[{"name": "Form-9", "is_hard_prerequisite": true}]', 'one_off'),

  ('wwww0000-0000-0000-0000-000000000003',
   'ot000000-0000-0000-0000-000000000003',
   'Share Allotment — Form-3 Filing',
   '[{"phase": "Drafting & Collection", "order": 1}, {"phase": "Filing Submitted", "order": 2}, {"phase": "Completed", "order": 3}]',
   'board_resolution', '[{"name": "Form-3", "is_hard_prerequisite": true}, {"name": "Board Resolution", "is_hard_prerequisite": true}]', 'one_off'),

  ('wwww0000-0000-0000-0000-000000000004',
   'ot000000-0000-0000-0000-000000000004',
   'Registered Office Change — Same City',
   '[{"phase": "Drafting & Collection", "order": 1}, {"phase": "Filing Submitted", "order": 2}, {"phase": "Completed", "order": 3}]',
   'none', '[{"name": "Form-21", "is_hard_prerequisite": true}]', 'one_off'),

  ('wwww0000-0000-0000-0000-000000000005',
   'ot000000-0000-0000-0000-000000000005',
   'Registered Office Change — Cross Province',
   '[{"phase": "Internal Approval", "order": 1}, {"phase": "Drafting & Collection", "order": 2}, {"phase": "Third-Party Verification", "order": 3}, {"phase": "Filing Submitted", "order": 4}, {"phase": "Completed", "order": 5}]',
   'special_resolution', '[{"name": "Special Resolution", "is_hard_prerequisite": true}, {"name": "Form-21", "is_hard_prerequisite": true}]', 'one_off'),

  ('wwww0000-0000-0000-0000-000000000006',
   'ot000000-0000-0000-0000-000000000006',
   'AGM Completion — PSX Disclosure',
   '[{"phase": "Drafting & Collection", "order": 1}, {"phase": "Filing Submitted", "order": 2}, {"phase": "Completed", "order": 3}]',
   'none', '[{"name": "AGM Minutes", "is_hard_prerequisite": true}]', 'one_off'),

  ('wwww0000-0000-0000-0000-000000000007',
   'ot000000-0000-0000-0000-000000000007',
   'Charge Creation — Form-10 Filing',
   '[{"phase": "Drafting & Collection", "order": 1}, {"phase": "Filing Submitted", "order": 2}, {"phase": "Completed", "order": 3}]',
   'none', '[{"name": "Form-10", "is_hard_prerequisite": true}]', 'one_off'),

  ('wwww0000-0000-0000-0000-000000000008',
   'ot000000-0000-0000-0000-000000000008',
   'Beneficial Ownership Change — SECP Filing',
   '[{"phase": "Drafting & Collection", "order": 1}, {"phase": "Filing Submitted", "order": 2}, {"phase": "Completed", "order": 3}]',
   'none', '[]', 'one_off'),

  ('wwww0000-0000-0000-0000-000000000009',
   'ot000000-0000-0000-0000-000000000009',
   'Annual General Meeting — Scheduling',
   '[{"phase": "Not Started", "order": 1}, {"phase": "Drafting & Collection", "order": 2}, {"phase": "Completed", "order": 3}]',
   'board_resolution', '[{"name": "AGM Notice", "is_hard_prerequisite": true}]', 'fixed_date_recurring'),

  ('wwww0000-0000-0000-0000-000000000010',
   'ot000000-0000-0000-0000-000000000010',
   'Annual Return — SECP Filing',
   '[{"phase": "Drafting & Collection", "order": 1}, {"phase": "Internal Approval", "order": 2}, {"phase": "Filing Submitted", "order": 3}, {"phase": "Completed", "order": 4}]',
   'board_resolution', '[{"name": "Form-A", "is_hard_prerequisite": true}]', 'fixed_date_recurring'),

  ('wwww0000-0000-0000-0000-000000000011',
   'ot000000-0000-0000-0000-000000000011',
   'Annual Return — PSX Disclosure',
   '[{"phase": "Drafting & Collection", "order": 1}, {"phase": "Filing Submitted", "order": 2}, {"phase": "Completed", "order": 3}]',
   'none', '[]', 'fixed_date_recurring')
ON CONFLICT (workflow_template_id) DO NOTHING;
