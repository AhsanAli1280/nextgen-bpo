import { evaluate } from './evaluate'
import { addDuration, addHours, computeTriggerDate } from './deadline'
import { resolveObligationChains } from './chains'
import type {
  CompanyClassification,
  EventContext,
  Regime,
  RuleVersion,
  ObligationToCreate,
  EngineResult,
} from './types'

/**
 * Abstract DB adapter interface.
 * Implemented by the Supabase adapter in supabase/functions/_shared/db-adapter.ts
 * once Supabase is installed. All pure engine logic is testable without this interface.
 */
export interface DbAdapter {
  /** Load current company classification. Throws CompanyProfileNotFound if no current profile. */
  loadCompanyClassification(companyId: string): Promise<CompanyClassification>
  /** Load all regimes from DB. */
  loadAllRegimes(): Promise<Regime[]>
  /**
   * Load current rule_versions (effective_to IS NULL, effective_from <= today)
   * for the given regime IDs.
   * Throws DuplicateCurrentVersion if any rule has two effective_to IS NULL rows.
   */
  loadCurrentRuleVersions(regimeIds: string[], today: Date): Promise<RuleVersion[]>
  /**
   * Atomic write: event_instance + obligations + workflow_instances + event_obligations.
   * Runs inside a single PL/pgSQL transaction via db.rpc('create_event_with_obligations').
   * Returns the created IDs.
   */
  createEventWithObligations(
    companyId:   string,
    tenantId:    string,
    eventCtx:    EventContext | undefined,
    obligations: ObligationToCreate[]
  ): Promise<EngineResult>
}

/**
 * Core rule engine entry point.
 *
 * Mode A (event): User declares a business event → engine produces obligations + workflows.
 * Mode B (date_driven): Company setup completes → engine produces fixed-date-recurring obligations.
 *
 * All DB access is via the injected DbAdapter so the engine is independently testable.
 */
export async function runRuleEngine(
  companyId: string,
  mode: 'event' | 'date_driven',
  eventCtx: EventContext | undefined,
  db: DbAdapter,
  today: Date = new Date()
): Promise<EngineResult> {

  // ── STEP 1: Load company classification ─────────────────────────────────────
  const co = await db.loadCompanyClassification(companyId)
  // Throws CompanyProfileNotFound if no current profile (effective_to IS NULL row missing)

  // ── STEP 2: Load all regimes ─────────────────────────────────────────────────
  const allRegimes = await db.loadAllRegimes()

  // ── STEP 3: Regime applicability pass ───────────────────────────────────────
  const applicableRegimeIds: string[] = allRegimes
    .filter(regime => evaluate(regime.applicability_expression, co))
    .map(r => r.regime_id)

  if (applicableRegimeIds.length === 0) {
    console.warn(
      `[RuleEngine] Company ${companyId} has no applicable regimes. ` +
      `Zero obligations created. Verify regime seed data.`
    )
    return { event_instance_id: null, obligations: [], workflow_instance_ids: [] }
  }

  // ── STEP 4: Load current rule versions for applicable regimes ────────────────
  // loadCurrentRuleVersions throws DuplicateCurrentVersion if integrity violation detected
  const ruleVersions = await db.loadCurrentRuleVersions(applicableRegimeIds, today)

  // ── STEP 5: Rule-level applicability pass ────────────────────────────────────
  const applicableRuleVersions = ruleVersions.filter(rv =>
    evaluate(rv.applicability_expression, co)
  )

  // ── STEP 6: Mode-specific filter ─────────────────────────────────────────────
  let targetedRuleVersions: RuleVersion[]

  if (mode === 'event') {
    if (!eventCtx) throw new Error('EventContext is required for event mode')

    // Filter to rules whose event_type matches the declared event
    const eventTypeMatch = applicableRuleVersions.filter(rv =>
      rv.rules.event_type_id === eventCtx.event_type_id
    )

    if (eventCtx.resolved_rule_id !== null) {
      // Wizard resolved a specific rule — pin to that rule only (no sibling rules)
      const exactMatch = eventTypeMatch.filter(rv => rv.rule_id === eventCtx.resolved_rule_id)

      if (exactMatch.length === 0) {
        // Check if the rule exists at all in the full ruleVersions set to give a better error
        const existsInAnyRegime = ruleVersions.find(rv => rv.rule_id === eventCtx.resolved_rule_id)
        if (existsInAnyRegime) {
          // Rule exists but its regime is not applicable for this company
          throw new Error(
            `RuleNotApplicable: rule ${eventCtx.resolved_rule_id} exists but its regime ` +
            `is not applicable for company ${companyId} (corporate_form=${co.corporate_form})`
          )
        }
        throw new Error(
          `RuleNotApplicable: rule ${eventCtx.resolved_rule_id} not found in applicable rule versions`
        )
      }

      targetedRuleVersions = exactMatch
    } else {
      targetedRuleVersions = eventTypeMatch
    }

  } else {
    // Date-driven: rules with no event_type_id (fixed-date-recurring)
    targetedRuleVersions = applicableRuleVersions.filter(rv => rv.rules.event_type_id === null)
  }

  // ── STEP 7: Obligation generation ────────────────────────────────────────────
  const obligationsToCreate: ObligationToCreate[] = []

  for (const rv of targetedRuleVersions) {
    const triggerDate = computeTriggerDate(mode, eventCtx, co, today)
    const computedDeadline = addDuration(triggerDate, rv.deadline_value, rv.deadline_unit)
    const eventTypeId = mode === 'event' ? eventCtx!.event_type_id : null

    obligationsToCreate.push({
      rule_version_id:      rv.rule_version_id,
      company_id:           companyId,
      tenant_id:            co.tenant_id,
      event_type_id:        eventTypeId,
      trigger_date:         triggerDate,
      computed_deadline:    computedDeadline,
      status:               'upcoming',
      linked_obligation_id: null,
      assigned_to_user_id:  null,
      demo_session_id:      eventCtx?.demo_session_id ?? null,
      demo_expires_at:      eventCtx?.demo_session_id ? addHours(today, 4) : null,
    })
  }

  // ── STEP 8: Obligation chain resolution ──────────────────────────────────────
  // Mutates obligationsToCreate in-place: sets trigger_date + computed_deadline for
  // downstream obligations; marks _linked_to_rule_id for post-insert FK wiring.
  // Throws ChainIncomplete if a known chain is partially present.
  resolveObligationChains(obligationsToCreate, targetedRuleVersions)

  // ── STEP 9: Atomic DB write ───────────────────────────────────────────────────
  // All inserts run inside a single PL/pgSQL transaction via db.rpc('create_event_with_obligations').
  // Full rollback if any insert fails.
  const result = await db.createEventWithObligations(
    companyId,
    co.tenant_id,
    eventCtx,
    obligationsToCreate
  )

  return result
}
