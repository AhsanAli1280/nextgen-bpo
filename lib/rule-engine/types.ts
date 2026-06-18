export interface CompanyClassification {
  company_id:                string
  tenant_id:                 string
  corporate_form:            'private' | 'unlisted_public' | 'listed'
  is_public_sector_company:  boolean
  is_government_controlled:  boolean
  is_foreign_owned_majority: boolean
  regulatory_categories:     string[]
  financial_year_end_month:  number
  financial_year_end_day:    number
  incorporation_date:        Date
  paid_up_capital:           number | null
}

export interface EventContext {
  event_type_id:    string
  event_date:       Date
  resolved_rule_id: string | null
  demo_session_id:  string | null
}

export type ApplicabilityExpression =
  | { op: 'always_true' }
  | { op: 'always_false' }
  | { op: 'eq';       field: 'corporate_form';         value: 'private' | 'unlisted_public' | 'listed' }
  | { op: 'flag';     field: 'is_public_sector_company' | 'is_government_controlled' | 'is_foreign_owned_majority' }
  | { op: 'contains'; field: 'regulatory_categories';  value: string }
  | { op: 'capital_gte'; value: number }
  | { op: 'and'; conditions: ApplicabilityExpression[] }
  | { op: 'or';  conditions: ApplicabilityExpression[] }
  | { op: 'not'; condition:  ApplicabilityExpression }

export interface Regime {
  regime_id:                  string
  name:                       string
  applicability_expression:   ApplicabilityExpression
}

export interface Rule {
  rule_id:       string
  event_type_id: string | null
  regime_id:     string
}

export interface RuleVersion {
  rule_version_id:            string
  rule_id:                    string
  regime_id:                  string
  applicability_expression:   ApplicabilityExpression
  deadline_value:             number
  deadline_unit:              DeadlineUnit
  effective_from:             string
  effective_to:               string | null
  form_number:                string | null
  filing_authority:           string | null
  verification_status:        string
  rules:                      Rule
}

export interface ObligationToCreate {
  rule_version_id:      string
  company_id:           string
  tenant_id:            string
  event_type_id:        string | null
  trigger_date:         Date
  computed_deadline:    Date
  status:               'upcoming'
  linked_obligation_id: string | null
  assigned_to_user_id:  string | null
  demo_session_id:      string | null
  demo_expires_at:      Date | null
  _linked_to_rule_id?:  string  // temp marker for post-insert chain linking, stripped before DB write
}

export interface CreatedObligation extends ObligationToCreate {
  obligation_id: string
}

export interface EngineResult {
  event_instance_id:      string | null
  obligations:            CreatedObligation[]
  workflow_instance_ids:  string[]
}

export type DeadlineUnit = 'days' | 'weeks' | 'months' | 'years'
