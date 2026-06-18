/**
 * InMemoryDbAdapter — full implementation of DbAdapter using in-memory data structures.
 * NOT a mock. Implements the same interface as SupabaseDbAdapter with identical semantics:
 * actual filtering logic, actual UUID generation, actual FK wiring.
 *
 * Seeded with V1 rule data (fixed UUIDs matching supabase/seed.sql) so integration tests
 * run without a DB. Switch to SupabaseDbAdapter for production and DB-backed tests.
 */

import { randomUUID } from 'crypto'
import type { DbAdapter } from './engine'
import type {
  CompanyClassification,
  Regime,
  RuleVersion,
  ObligationToCreate,
  CreatedObligation,
  EngineResult,
  EventContext,
} from './types'

// ── Canonical seed UUIDs (match supabase/seed.sql exactly) ───────────────────

export const SEED = {
  TENANT_ID:      'tttttttt-0000-0000-0000-000000000001',
  ABC_COMPANY_ID: 'aaaaaaaa-0000-0000-0000-000000000001',  // ABC Manufacturing (private)
  XYZ_COMPANY_ID: 'bbbbbbbb-0000-0000-0000-000000000002',  // XYZ Textiles (listed)

  REGIMES: {
    COMPANIES_ACT_2017:  'rrrr0000-0000-0000-0000-000000000001',
    COMPANIES_REGS_2024: 'rrrr0000-0000-0000-0000-000000000002',
    PSX_RULE_BOOK:       'rrrr0000-0000-0000-0000-000000000003',
    CCG_REGS_2019:       'rrrr0000-0000-0000-0000-000000000004',
  },

  EVENT_TYPES: {
    DIRECTOR_OFFICER_CHANGES:  'eeee0000-0000-0000-0000-000000000001',
    SHARE_CAPITAL_ALLOTMENT:   'eeee0000-0000-0000-0000-000000000002',
    REGISTERED_OFFICE_NAME:    'eeee0000-0000-0000-0000-000000000003',
    COMPANY_STATUS_GOVERNANCE: 'eeee0000-0000-0000-0000-000000000004',
    CHARGES_MORTGAGES:         'eeee0000-0000-0000-0000-000000000005',
    BENEFICIAL_OWNERSHIP:      'eeee0000-0000-0000-0000-000000000006',
  },

  RULE_VERSIONS: {
    DIR_001:    'vvvv0000-0000-0000-0000-000000000001',
    DIR_002:    'vvvv0000-0000-0000-0000-000000000002',
    SHARE_001:  'vvvv0000-0000-0000-0000-000000000003',
    OFFICE_002: 'vvvv0000-0000-0000-0000-000000000004',
    OFFICE_003: 'vvvv0000-0000-0000-0000-000000000005',
    AGM_007:    'vvvv0000-0000-0000-0000-000000000006',
    CHARGE_001: 'vvvv0000-0000-0000-0000-000000000007',
    BO_002:     'vvvv0000-0000-0000-0000-000000000008',
    AGM_002:    'vvvv0000-0000-0000-0000-000000000009',
    ANNRET_001: 'vvvv0000-0000-0000-0000-000000000010',
    ANNRET_002: 'vvvv0000-0000-0000-0000-000000000011',
  },

  WORKFLOW_TEMPLATES: {
    DIR_001:    'wwww0000-0000-0000-0000-000000000001',
    DIR_002:    'wwww0000-0000-0000-0000-000000000002',
    SHARE_001:  'wwww0000-0000-0000-0000-000000000003',
    OFFICE_002: 'wwww0000-0000-0000-0000-000000000004',
    OFFICE_003: 'wwww0000-0000-0000-0000-000000000005',
    AGM_007:    'wwww0000-0000-0000-0000-000000000006',
    CHARGE_001: 'wwww0000-0000-0000-0000-000000000007',
    BO_002:     'wwww0000-0000-0000-0000-000000000008',
    AGM_002:    'wwww0000-0000-0000-0000-000000000009',
    ANNRET_001: 'wwww0000-0000-0000-0000-000000000010',
    ANNRET_002: 'wwww0000-0000-0000-0000-000000000011',
  },
} as const

// ── Static seed: Regimes ──────────────────────────────────────────────────────

const SEED_REGIMES: Regime[] = [
  {
    regime_id: SEED.REGIMES.COMPANIES_ACT_2017,
    name: 'Companies Act 2017',
    applicability_expression: { op: 'always_true' },
  },
  {
    regime_id: SEED.REGIMES.COMPANIES_REGS_2024,
    name: 'Companies Regulations 2024',
    applicability_expression: { op: 'always_true' },
  },
  {
    regime_id: SEED.REGIMES.PSX_RULE_BOOK,
    name: 'PSX Rule Book (Main Board)',
    applicability_expression: { op: 'eq', field: 'corporate_form', value: 'listed' },
  },
  {
    regime_id: SEED.REGIMES.CCG_REGS_2019,
    name: 'Listed Companies CCG Regulations 2019',
    applicability_expression: { op: 'eq', field: 'corporate_form', value: 'listed' },
  },
]

// ── Static seed: Rule versions (V1 event-triggered rules) ────────────────────

const SEED_RULE_VERSIONS: RuleVersion[] = [
  {
    rule_version_id:          SEED.RULE_VERSIONS.DIR_001,
    rule_id:                  'DIR-001',
    regime_id:                SEED.REGIMES.COMPANIES_ACT_2017,
    applicability_expression: { op: 'always_true' },
    deadline_value:           10,
    deadline_unit:            'days',
    effective_from:           '2017-01-01',
    effective_to:             null,
    form_number:              null,
    filing_authority:         'SECP',
    verification_status:      'VERIFIED',
    rules: {
      rule_id:       'DIR-001',
      event_type_id: SEED.EVENT_TYPES.DIRECTOR_OFFICER_CHANGES,
      regime_id:     SEED.REGIMES.COMPANIES_ACT_2017,
    },
  },
  {
    rule_version_id:          SEED.RULE_VERSIONS.DIR_002,
    rule_id:                  'DIR-002',
    regime_id:                SEED.REGIMES.COMPANIES_REGS_2024,
    applicability_expression: { op: 'always_true' },
    deadline_value:           15,
    deadline_unit:            'days',
    effective_from:           '2024-01-01',
    effective_to:             null,
    form_number:              'Form-9',
    filing_authority:         'SECP',
    verification_status:      'VERIFIED',
    rules: {
      rule_id:       'DIR-002',
      event_type_id: SEED.EVENT_TYPES.DIRECTOR_OFFICER_CHANGES,
      regime_id:     SEED.REGIMES.COMPANIES_REGS_2024,
    },
  },
  {
    rule_version_id:          SEED.RULE_VERSIONS.SHARE_001,
    rule_id:                  'SHARE-001',
    regime_id:                SEED.REGIMES.COMPANIES_REGS_2024,
    applicability_expression: { op: 'always_true' },
    deadline_value:           30,
    deadline_unit:            'days',
    effective_from:           '2024-01-01',
    effective_to:             null,
    form_number:              'Form-3',
    filing_authority:         'SECP',
    verification_status:      'VERIFIED',
    rules: {
      rule_id:       'SHARE-001',
      event_type_id: SEED.EVENT_TYPES.SHARE_CAPITAL_ALLOTMENT,
      regime_id:     SEED.REGIMES.COMPANIES_REGS_2024,
    },
  },
  {
    rule_version_id:          SEED.RULE_VERSIONS.OFFICE_002,
    rule_id:                  'OFFICE-002',
    regime_id:                SEED.REGIMES.COMPANIES_REGS_2024,
    applicability_expression: { op: 'always_true' },
    deadline_value:           15,
    deadline_unit:            'days',
    effective_from:           '2024-01-01',
    effective_to:             null,
    form_number:              'Form-21',
    filing_authority:         'SECP',
    verification_status:      'VERIFIED',
    rules: {
      rule_id:       'OFFICE-002',
      event_type_id: SEED.EVENT_TYPES.REGISTERED_OFFICE_NAME,
      regime_id:     SEED.REGIMES.COMPANIES_REGS_2024,
    },
  },
  {
    rule_version_id:          SEED.RULE_VERSIONS.OFFICE_003,
    rule_id:                  'OFFICE-003',
    regime_id:                SEED.REGIMES.COMPANIES_ACT_2017,
    applicability_expression: { op: 'always_true' },
    deadline_value:           90,
    deadline_unit:            'days',
    effective_from:           '2017-01-01',
    effective_to:             null,
    form_number:              'Form-21',
    filing_authority:         'SECP',
    verification_status:      'VERIFIED',
    rules: {
      rule_id:       'OFFICE-003',
      event_type_id: SEED.EVENT_TYPES.REGISTERED_OFFICE_NAME,
      regime_id:     SEED.REGIMES.COMPANIES_ACT_2017,
    },
  },
  {
    rule_version_id:          SEED.RULE_VERSIONS.AGM_007,
    rule_id:                  'AGM-007',
    regime_id:                SEED.REGIMES.PSX_RULE_BOOK,
    applicability_expression: { op: 'eq', field: 'corporate_form', value: 'listed' },
    deadline_value:           10,
    deadline_unit:            'days',
    effective_from:           '2020-01-01',
    effective_to:             null,
    form_number:              null,
    filing_authority:         'Pakistan Stock Exchange',
    verification_status:      'VERIFIED',
    rules: {
      rule_id:       'AGM-007',
      event_type_id: SEED.EVENT_TYPES.COMPANY_STATUS_GOVERNANCE,
      regime_id:     SEED.REGIMES.PSX_RULE_BOOK,
    },
  },
  // ── B1: Charges & Beneficial Ownership (event-triggered) ─────────────────
  {
    rule_version_id:          SEED.RULE_VERSIONS.CHARGE_001,
    rule_id:                  'CHARGE-001',
    regime_id:                SEED.REGIMES.COMPANIES_ACT_2017,
    applicability_expression: { op: 'always_true' },
    deadline_value:           30,
    deadline_unit:            'days',
    effective_from:           '2017-01-01',
    effective_to:             null,
    form_number:              'Form-10',
    filing_authority:         'SECP',
    verification_status:      'VERIFIED',
    rules: {
      rule_id:       'CHARGE-001',
      event_type_id: SEED.EVENT_TYPES.CHARGES_MORTGAGES,
      regime_id:     SEED.REGIMES.COMPANIES_ACT_2017,
    },
  },
  {
    rule_version_id:          SEED.RULE_VERSIONS.BO_002,
    rule_id:                  'BO-002',
    regime_id:                SEED.REGIMES.COMPANIES_ACT_2017,
    applicability_expression: { op: 'always_true' },
    deadline_value:           30,
    deadline_unit:            'days',
    effective_from:           '2020-01-01',
    effective_to:             null,
    form_number:              null,
    filing_authority:         'SECP',
    verification_status:      'VERIFIED',
    rules: {
      rule_id:       'BO-002',
      event_type_id: SEED.EVENT_TYPES.BENEFICIAL_OWNERSHIP,
      regime_id:     SEED.REGIMES.COMPANIES_ACT_2017,
    },
  },
  // ── B5: Date-driven rules (Mode B — event_type_id = null) ────────────────
  {
    rule_version_id:          SEED.RULE_VERSIONS.AGM_002,
    rule_id:                  'AGM-002',
    regime_id:                SEED.REGIMES.COMPANIES_ACT_2017,
    applicability_expression: { op: 'always_true' },
    deadline_value:           120,
    deadline_unit:            'days',
    effective_from:           '2017-01-01',
    effective_to:             null,
    form_number:              null,
    filing_authority:         'SECP',
    verification_status:      'VERIFIED',
    rules: {
      rule_id:       'AGM-002',
      event_type_id: null,           // date_driven: no event type
      regime_id:     SEED.REGIMES.COMPANIES_ACT_2017,
    },
  },
  {
    rule_version_id:          SEED.RULE_VERSIONS.ANNRET_001,
    rule_id:                  'ANNRET-001',
    regime_id:                SEED.REGIMES.COMPANIES_ACT_2017,
    applicability_expression: { op: 'always_true' },
    deadline_value:           60,
    deadline_unit:            'days',
    effective_from:           '2017-01-01',
    effective_to:             null,
    form_number:              'Form-A',
    filing_authority:         'SECP',
    verification_status:      'VERIFIED',
    rules: {
      rule_id:       'ANNRET-001',
      event_type_id: null,           // date_driven
      regime_id:     SEED.REGIMES.COMPANIES_ACT_2017,
    },
  },
  {
    rule_version_id:          SEED.RULE_VERSIONS.ANNRET_002,
    rule_id:                  'ANNRET-002',
    regime_id:                SEED.REGIMES.PSX_RULE_BOOK,
    applicability_expression: { op: 'eq', field: 'corporate_form', value: 'listed' },
    deadline_value:           30,
    deadline_unit:            'days',
    effective_from:           '2020-01-01',
    effective_to:             null,
    form_number:              null,
    filing_authority:         'Pakistan Stock Exchange',
    verification_status:      'VERIFIED',
    rules: {
      rule_id:       'ANNRET-002',
      event_type_id: null,           // date_driven
      regime_id:     SEED.REGIMES.PSX_RULE_BOOK,
    },
  },
]

// ── Static seed: Companies ────────────────────────────────────────────────────

const SEED_COMPANIES = new Map<string, CompanyClassification>([
  [SEED.ABC_COMPANY_ID, {
    company_id:                SEED.ABC_COMPANY_ID,
    tenant_id:                 SEED.TENANT_ID,
    corporate_form:            'private',
    is_public_sector_company:  false,
    is_government_controlled:  false,
    is_foreign_owned_majority: false,
    regulatory_categories:     [],
    financial_year_end_month:  6,
    financial_year_end_day:    30,
    incorporation_date:        new Date('2015-03-01'),
    paid_up_capital:           10_000_000,
  }],
  [SEED.XYZ_COMPANY_ID, {
    company_id:                SEED.XYZ_COMPANY_ID,
    tenant_id:                 SEED.TENANT_ID,
    corporate_form:            'listed',
    is_public_sector_company:  false,
    is_government_controlled:  false,
    is_foreign_owned_majority: false,
    regulatory_categories:     [],
    financial_year_end_month:  12,
    financial_year_end_day:    31,
    incorporation_date:        new Date('2005-07-01'),
    paid_up_capital:           500_000_000,
  }],
])

// ── Workflow template lookup (rule_id → workflow_template_id) ─────────────────

const WORKFLOW_TEMPLATE_MAP: Record<string, string> = {
  'DIR-001':    SEED.WORKFLOW_TEMPLATES.DIR_001,
  'DIR-002':    SEED.WORKFLOW_TEMPLATES.DIR_002,
  'SHARE-001':  SEED.WORKFLOW_TEMPLATES.SHARE_001,
  'OFFICE-002': SEED.WORKFLOW_TEMPLATES.OFFICE_002,
  'OFFICE-003': SEED.WORKFLOW_TEMPLATES.OFFICE_003,
  'AGM-007':    SEED.WORKFLOW_TEMPLATES.AGM_007,
  'CHARGE-001': SEED.WORKFLOW_TEMPLATES.CHARGE_001,
  'BO-002':     SEED.WORKFLOW_TEMPLATES.BO_002,
  'AGM-002':    SEED.WORKFLOW_TEMPLATES.AGM_002,
  'ANNRET-001': SEED.WORKFLOW_TEMPLATES.ANNRET_001,
  'ANNRET-002': SEED.WORKFLOW_TEMPLATES.ANNRET_002,
}

// ── In-memory record types ────────────────────────────────────────────────────

export interface StoredObligation extends CreatedObligation {}

export interface StoredWorkflowInstance {
  workflow_instance_id: string
  obligation_id:        string
  workflow_template_id: string
  tenant_id:            string
  current_phase:        string
}

export interface StoredEventInstance {
  event_instance_id: string
  company_id:        string
  tenant_id:         string
  event_type_id:     string
  event_date:        Date
}

export interface StoredEventObligation {
  event_instance_id: string
  obligation_id:     string
}

// ── InMemoryDbAdapter ─────────────────────────────────────────────────────────

export class InMemoryDbAdapter implements DbAdapter {
  readonly obligations:       StoredObligation[]       = []
  readonly workflowInstances: StoredWorkflowInstance[] = []
  readonly eventInstances:    StoredEventInstance[]    = []
  readonly eventObligations:  StoredEventObligation[]  = []

  async loadCompanyClassification(companyId: string): Promise<CompanyClassification> {
    const co = SEED_COMPANIES.get(companyId)
    if (!co) throw new Error(`CompanyProfileNotFound: ${companyId}`)
    return { ...co }
  }

  async loadAllRegimes(): Promise<Regime[]> {
    return [...SEED_REGIMES]
  }

  async loadCurrentRuleVersions(regimeIds: string[], today: Date): Promise<RuleVersion[]> {
    // Mirror Supabase query: WHERE regime_id IN (...) AND effective_to IS NULL AND effective_from <= today
    return SEED_RULE_VERSIONS.filter(rv =>
      regimeIds.includes(rv.regime_id) &&
      rv.effective_to === null &&
      new Date(rv.effective_from) <= today
    )
  }

  async createEventWithObligations(
    companyId:   string,
    tenantId:    string,
    eventCtx:    EventContext | undefined,
    obligations: ObligationToCreate[]
  ): Promise<EngineResult> {

    // 1. Create event_instance (Mode A only)
    let eventInstanceId: string | null = null
    if (eventCtx) {
      eventInstanceId = randomUUID()
      this.eventInstances.push({
        event_instance_id: eventInstanceId,
        company_id:        companyId,
        tenant_id:         tenantId,
        event_type_id:     eventCtx.event_type_id,
        event_date:        eventCtx.event_date,
      })
    }

    // 2. Assign obligation UUIDs
    const ruleVersionToObligationId = new Map<string, string>()
    const createdObligations: CreatedObligation[] = obligations.map(ob => {
      const id = randomUUID()
      ruleVersionToObligationId.set(ob.rule_version_id, id)
      return { ...ob, obligation_id: id }
    })

    // 3. Wire linked_obligation_id for chained obligations
    for (const ob of createdObligations) {
      if (ob._linked_to_rule_id) {
        const upstreamRv = SEED_RULE_VERSIONS.find(rv => rv.rule_id === ob._linked_to_rule_id)
        if (upstreamRv) {
          const upstreamId = ruleVersionToObligationId.get(upstreamRv.rule_version_id)
          if (upstreamId) ob.linked_obligation_id = upstreamId
        }
      }
    }

    // 4. Store obligations and event_obligations join
    for (const ob of createdObligations) {
      this.obligations.push({ ...ob })
      if (eventInstanceId) {
        this.eventObligations.push({ event_instance_id: eventInstanceId, obligation_id: ob.obligation_id })
      }
    }

    // 5. Create workflow_instances
    const workflowInstanceIds: string[] = []
    for (const ob of createdObligations) {
      const rv       = SEED_RULE_VERSIONS.find(r => r.rule_version_id === ob.rule_version_id)
      const ruleId   = rv?.rule_id
      const wfTplId  = ruleId ? WORKFLOW_TEMPLATE_MAP[ruleId] : undefined
      if (wfTplId) {
        const wfId = randomUUID()
        this.workflowInstances.push({
          workflow_instance_id: wfId,
          obligation_id:        ob.obligation_id,
          workflow_template_id: wfTplId,
          tenant_id:            tenantId,
          current_phase:        'Not Started',
        })
        workflowInstanceIds.push(wfId)
      }
    }

    return {
      event_instance_id:     eventInstanceId,
      obligations:           createdObligations,
      workflow_instance_ids: workflowInstanceIds,
    }
  }
}
