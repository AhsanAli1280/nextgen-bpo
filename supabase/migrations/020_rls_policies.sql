-- 020_rls_policies.sql
CREATE OR REPLACE FUNCTION auth_tenant_id() RETURNS uuid
  LANGUAGE sql STABLE
  AS $$ SELECT (auth.jwt() ->> 'tenant_id')::uuid $$;

ALTER TABLE companies                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_attributes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_regulatory_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_instances               ENABLE ROW LEVEL SECURITY;
ALTER TABLE obligations                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_instances            ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_phase_history        ENABLE ROW LEVEL SECURITY;
ALTER TABLE filing_attempts               ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_references           ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE users                         ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_accounts               ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON companies
  USING (tenant_owner_id = auth_tenant_id());

CREATE POLICY tenant_isolation ON event_instances
  USING (tenant_id = auth_tenant_id());

CREATE POLICY tenant_isolation ON obligations
  USING (tenant_id = auth_tenant_id());

CREATE POLICY tenant_isolation ON workflow_instances
  USING (tenant_id = auth_tenant_id());

CREATE POLICY tenant_isolation ON company_profiles
  USING (company_id IN (
    SELECT company_id FROM companies WHERE tenant_owner_id = auth_tenant_id()
  ));

CREATE POLICY tenant_isolation ON company_attributes
  USING (company_profile_id IN (
    SELECT cp.company_profile_id FROM company_profiles cp
    JOIN companies c ON c.company_id = cp.company_id
    WHERE c.tenant_owner_id = auth_tenant_id()
  ));

CREATE POLICY tenant_isolation ON company_regulatory_categories
  USING (company_profile_id IN (
    SELECT cp.company_profile_id FROM company_profiles cp
    JOIN companies c ON c.company_id = cp.company_id
    WHERE c.tenant_owner_id = auth_tenant_id()
  ));

CREATE POLICY tenant_isolation ON workflow_phase_history
  USING (workflow_instance_id IN (
    SELECT workflow_instance_id FROM workflow_instances WHERE tenant_id = auth_tenant_id()
  ));

CREATE POLICY tenant_isolation ON filing_attempts
  USING (obligation_id IN (
    SELECT obligation_id FROM obligations WHERE tenant_id = auth_tenant_id()
  ));

CREATE POLICY tenant_isolation ON notifications
  USING (company_id IN (
    SELECT company_id FROM companies WHERE tenant_owner_id = auth_tenant_id()
  ));

CREATE POLICY tenant_isolation ON evidence_references
  USING (obligation_id IN (
    SELECT obligation_id FROM obligations WHERE tenant_id = auth_tenant_id()
  ));

CREATE POLICY self_only ON users
  USING (id = auth.uid());

CREATE POLICY tenant_only ON tenant_accounts
  USING (tenant_id = auth_tenant_id());

GRANT SELECT ON legal_sources, regimes, rules, rule_versions, event_types,
  event_cards, event_wizard_steps, event_wizard_options, obligation_templates,
  workflow_templates, forms, knowledge_base_entries, regulatory_categories, regulators
  TO authenticated;

REVOKE INSERT, UPDATE, DELETE ON legal_sources, regimes, rules, rule_versions,
  event_types, event_cards, event_wizard_steps, event_wizard_options,
  obligation_templates, workflow_templates, forms, knowledge_base_entries,
  regulatory_categories, regulators
  FROM authenticated;
