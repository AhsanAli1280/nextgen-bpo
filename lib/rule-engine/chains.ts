import type { ObligationToCreate, RuleVersion } from './types'
import { addDuration } from './deadline'

// V1 known chains. Hard-coded. Post-V1: move to DB table if chains grow.
export const KNOWN_CHAINS: [upstreamRuleId: string, downstreamRuleId: string][] = [
  ['DIR-001', 'DIR-002'],
  // OFFICE-003 multi-stage handled separately (process-anchored, not simple linked_obligation_id)
]

function getRuleId(obl: ObligationToCreate, ruleVersions: RuleVersion[]): string | undefined {
  return ruleVersions.find(r => r.rule_version_id === obl.rule_version_id)?.rule_id
}

function getRuleVersion(ruleId: string, ruleVersions: RuleVersion[]): RuleVersion | undefined {
  return ruleVersions.find(r => r.rule_id === ruleId)
}

/**
 * Mutates the obligations array in-place to wire chain relationships.
 * Called after initial obligation generation, before the DB write.
 *
 * At creation: downstream.trigger_date = upstream.computed_deadline (worst case).
 * downstream.computed_deadline is recalculated from new trigger_date.
 * linked_obligation_id is set post-DB-insert (needs upstream's UUID); _linked_to_rule_id
 * is a temporary marker that the atomic DB function uses to wire the FK.
 */
export function resolveObligationChains(
  obligations: ObligationToCreate[],
  ruleVersions: RuleVersion[]
): void {
  for (const [upstreamRuleId, downstreamRuleId] of KNOWN_CHAINS) {
    const upstream   = obligations.find(o => getRuleId(o, ruleVersions) === upstreamRuleId)
    const downstream = obligations.find(o => getRuleId(o, ruleVersions) === downstreamRuleId)

    // Neither side present: chain irrelevant for this run (different event type)
    if (!upstream && !downstream) continue

    // One side present, other absent: data integrity error in rule/seed data
    if (!upstream || !downstream) {
      throw new Error(
        `ChainIncomplete: chain ${upstreamRuleId}→${downstreamRuleId} is partially present. ` +
        `Both rules in a known chain must either both apply or neither apply.`
      )
    }

    // Wire chain: downstream trigger = upstream worst-case deadline
    downstream.trigger_date = upstream.computed_deadline

    const downstreamRv = getRuleVersion(downstreamRuleId, ruleVersions)
    if (!downstreamRv) {
      throw new Error(`ChainIncomplete: cannot find rule version for ${downstreamRuleId}`)
    }

    downstream.computed_deadline = addDuration(
      downstream.trigger_date,
      downstreamRv.deadline_value,
      downstreamRv.deadline_unit
    )

    // Temp marker for the atomic DB function to set linked_obligation_id FK
    downstream._linked_to_rule_id = upstreamRuleId
  }
}

/**
 * Propagates a filed upstream obligation's actual completion date to downstream obligations.
 * Called when upstream obligation is marked filed. Runs in the same DB transaction as the
 * filing status update (enforced at the DB layer via the filing Server Action).
 *
 * This function represents the contract; actual execution against Supabase is in the
 * filing Server Action which calls the DB RPC.
 */
export function computeDownstreamUpdate(
  actualCompletionDate: Date,
  downstreamDeadlineValue: number,
  downstreamDeadlineUnit: 'days' | 'weeks' | 'months' | 'years'
): { newTriggerDate: Date; newComputedDeadline: Date } {
  const newTriggerDate     = actualCompletionDate
  const newComputedDeadline = addDuration(newTriggerDate, downstreamDeadlineValue, downstreamDeadlineUnit)
  return { newTriggerDate, newComputedDeadline }
}
