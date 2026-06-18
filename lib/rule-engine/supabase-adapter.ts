/**
 * SupabaseDbAdapter — production implementation of DbAdapter using @supabase/supabase-js.
 *
 * Prerequisites before this can run:
 *  1. npm install @supabase/supabase-js   ← already done
 *  2. Create Supabase project at supabase.com
 *  3. Copy SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY into .env.local
 *  4. npx supabase db push   (runs supabase/migrations/*.sql)
 *  5. psql $DATABASE_URL -f supabase/seed.sql
 *  6. Register add_tenant_claims Auth Hook in Supabase dashboard
 *
 * See SUPABASE_ADAPTER.md for full setup instructions.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { DbAdapter } from './engine'
import type {
  CompanyClassification,
  Regime,
  RuleVersion,
  ObligationToCreate,
  EngineResult,
  EventContext,
} from './types'

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export class SupabaseDbAdapter implements DbAdapter {
  private readonly client: SupabaseClient

  constructor(supabaseUrl: string, supabaseServiceRoleKey: string) {
    this.client = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false },
    })
  }

  async loadCompanyClassification(companyId: string): Promise<CompanyClassification> {
    const { data, error } = await this.client
      .from('companies')
      .select(`
        company_id,
        tenant_owner_id,
        incorporation_date,
        company_profiles!inner(
          corporate_form,
          is_public_sector_company,
          is_government_controlled,
          is_foreign_owned_majority,
          financial_year_end_month,
          financial_year_end_day,
          paid_up_capital,
          company_regulatory_categories(
            regulatory_categories( name )
          )
        )
      `)
      .eq('company_id', companyId)
      .is('company_profiles.effective_to', null)
      .single()

    if (error || !data) {
      throw new Error(`CompanyProfileNotFound: ${companyId} — ${error?.message ?? 'no data'}`)
    }

    const profiles = (data as any).company_profiles as any[]
    if (profiles.length === 0) throw new Error(`CompanyProfileNotFound: no current profile for ${companyId}`)

    const profile = profiles[0]
    const catJoins: any[] = profile.company_regulatory_categories ?? []
    const regulatory_categories: string[] = catJoins
      .map((j: any) => j.regulatory_categories?.name)
      .filter(Boolean)

    return {
      company_id:                (data as any).company_id,
      tenant_id:                 (data as any).tenant_owner_id,
      corporate_form:            profile.corporate_form,
      is_public_sector_company:  profile.is_public_sector_company,
      is_government_controlled:  profile.is_government_controlled,
      is_foreign_owned_majority: profile.is_foreign_owned_majority,
      financial_year_end_month:  profile.financial_year_end_month,
      financial_year_end_day:    profile.financial_year_end_day,
      incorporation_date:        new Date((data as any).incorporation_date),
      paid_up_capital:           profile.paid_up_capital ?? null,
      regulatory_categories,
    }
  }

  async loadAllRegimes(): Promise<Regime[]> {
    const { data, error } = await this.client
      .from('regimes')
      .select('regime_id, name, applicability_expression')

    if (error) throw new Error(`loadAllRegimes failed: ${error.message}`)

    return (data as any[]).map(r => ({
      regime_id:                r.regime_id,
      name:                     r.name,
      applicability_expression: r.applicability_expression,
    }))
  }

  async loadCurrentRuleVersions(regimeIds: string[], today: Date): Promise<RuleVersion[]> {
    const { data, error } = await this.client
      .from('rule_versions')
      .select(`
        rule_version_id,
        rule_id,
        regime_id,
        applicability_expression,
        deadline_value,
        deadline_unit,
        effective_from,
        effective_to,
        form_number,
        filing_authority,
        verification_status,
        rules!inner( rule_id, event_type_id )
      `)
      .in('regime_id', regimeIds)
      .is('effective_to', null)
      .lte('effective_from', isoDate(today))

    if (error) throw new Error(`loadCurrentRuleVersions failed: ${error.message}`)

    const rows = data as any[]

    // Integrity check: throw if any rule has two effective_to IS NULL rows
    const seen = new Map<string, number>()
    for (const rv of rows) {
      seen.set(rv.rule_id, (seen.get(rv.rule_id) ?? 0) + 1)
    }
    for (const [ruleId, count] of seen) {
      if (count > 1) throw new Error(`DuplicateCurrentVersion: rule ${ruleId} has ${count} current versions`)
    }

    return rows.map(rv => ({
      rule_version_id:          rv.rule_version_id,
      rule_id:                  rv.rule_id,
      regime_id:                rv.regime_id,
      applicability_expression: rv.applicability_expression,
      deadline_value:           rv.deadline_value,
      deadline_unit:            rv.deadline_unit,
      effective_from:           rv.effective_from,
      effective_to:             rv.effective_to ?? null,
      form_number:              rv.form_number ?? null,
      filing_authority:         rv.filing_authority ?? null,
      verification_status:      rv.verification_status,
      rules: {
        rule_id:       rv.rules.rule_id,
        event_type_id: rv.rules.event_type_id ?? null,
        regime_id:     rv.regime_id,
      },
    }))
  }

  async createEventWithObligations(
    companyId:   string,
    tenantId:    string,
    eventCtx:    EventContext | undefined,
    obligations: ObligationToCreate[]
  ): Promise<EngineResult> {
    // Build payload for the PL/pgSQL atomic function (supabase/functions/_shared/create_event_with_obligations.sql)
    const payload = obligations.map(ob => ({
      rule_version_id:      ob.rule_version_id,
      event_type_id:        ob.event_type_id,
      trigger_date:         isoDate(ob.trigger_date),
      computed_deadline:    isoDate(ob.computed_deadline),
      status:               ob.status,
      linked_obligation_id: ob.linked_obligation_id,
      assigned_to_user_id:  ob.assigned_to_user_id,
      demo_session_id:      ob.demo_session_id,
      demo_expires_at:      ob.demo_expires_at?.toISOString() ?? null,
      _linked_to_rule_id:   ob._linked_to_rule_id ?? null,
    }))

    const { data, error } = await this.client.rpc('create_event_with_obligations', {
      p_company_id:            companyId,
      p_tenant_id:             tenantId,
      p_event_type_id:         eventCtx?.event_type_id ?? null,
      p_event_date:            eventCtx ? isoDate(eventCtx.event_date) : null,
      p_demo_session_id:       eventCtx?.demo_session_id ?? null,
      p_demo_expires_at:       obligations[0]?.demo_expires_at?.toISOString() ?? null,
      p_obligations:           payload,
    })

    if (error) throw new Error(`createEventWithObligations RPC failed: ${error.message}`)

    const result = data as {
      event_instance_id:     string | null
      obligation_ids:        string[]
      workflow_instance_ids: string[]
    }

    // Rebuild CreatedObligation array from returned IDs
    const createdObligations = obligations.map((ob, i) => ({
      ...ob,
      obligation_id: result.obligation_ids[i],
    }))

    return {
      event_instance_id:     result.event_instance_id,
      obligations:           createdObligations,
      workflow_instance_ids: result.workflow_instance_ids,
    }
  }
}

/**
 * Factory: create adapter from environment variables.
 * SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local.
 * Never expose SUPABASE_SERVICE_ROLE_KEY in browser — server-side only.
 */
export function createSupabaseAdapter(): SupabaseDbAdapter {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url) throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_URL')
  if (!key) throw new Error('Missing env: SUPABASE_SERVICE_ROLE_KEY')
  return new SupabaseDbAdapter(url, key)
}
