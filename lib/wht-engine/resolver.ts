import { WhtSectionConfig, WhtRule, AtlStatus, TaxpayerType } from '../tax-rules';

/**
 * Calculates specificity score for a rule.
 * Score is the count of non-null conditions (subType, taxpayerType, atlStatus).
 */
export function getRuleSpecificity(rule: WhtRule): number {
  let score = 0;
  if (rule.subType !== null) score++;
  if (rule.taxpayerType !== null) score++;
  if (rule.atlStatus !== null) score++;
  return score;
}

/**
 * Resolves the active WhtRule for a given section, transaction date, and input conditions.
 * Throws an error on ambiguity or if no rule matches.
 */
export function resolveRule(
  section: WhtSectionConfig,
  transactionDate: Date,
  atlStatus: AtlStatus | null,
  taxpayerType: TaxpayerType | null,
  subType: string | null
): WhtRule {
  const txTime = transactionDate.getTime();

  // 1. Filter by active date
  const activeRules = section.rules.filter((rule) => {
    const start = new Date(rule.effectiveFrom).getTime();
    const end = rule.effectiveTo ? new Date(rule.effectiveTo).getTime() : Infinity;
    return txTime >= start && txTime <= end;
  });

  if (activeRules.length === 0) {
    throw new Error(
      `No active tax rules found for Section ${section.code} on date ${transactionDate.toISOString().split('T')[0]}`
    );
  }

  // 2. Filter by matching conditions
  const matchingRules = activeRules.filter((rule) => {
    if (rule.atlStatus !== null && rule.atlStatus !== atlStatus) return false;
    if (rule.taxpayerType !== null && rule.taxpayerType !== taxpayerType) return false;
    if (rule.subType !== null && rule.subType !== subType) return false;
    return true;
  });

  if (matchingRules.length === 0) {
    throw new Error(
      `No matching tax rule found in Section ${section.code} for conditions (atlStatus: ${atlStatus}, taxpayerType: ${taxpayerType}, subType: ${subType}) on date ${transactionDate.toISOString().split('T')[0]}`
    );
  }

  // 3. Sort by priority descending
  matchingRules.sort((a, b) => b.priority - a.priority);
  const maxPriority = matchingRules[0].priority;
  const topPriorityRules = matchingRules.filter((r) => r.priority === maxPriority);

  if (topPriorityRules.length === 1) {
    return topPriorityRules[0];
  }

  // 4. Resolve tie by specificity descending
  const rulesWithSpecificity = topPriorityRules.map((r) => ({
    rule: r,
    specificity: getRuleSpecificity(r),
  }));

  rulesWithSpecificity.sort((a, b) => b.specificity - a.specificity);
  const maxSpecificity = rulesWithSpecificity[0].specificity;
  const topSpecificityRules = rulesWithSpecificity.filter(
    (r) => r.specificity === maxSpecificity
  );

  if (topSpecificityRules.length === 1) {
    return topSpecificityRules[0].rule;
  }

  // 5. If ambiguity remains, raise validation error
  const ambiguousRuleIds = topSpecificityRules.map((r) => r.rule.id).join(', ');
  throw new Error(
    `Ambiguous Match: Multiple rules (${ambiguousRuleIds}) resolved with the same priority ${maxPriority} and specificity ${maxSpecificity} in Section ${section.code} on date ${transactionDate.toISOString().split('T')[0]} for conditions (atl: ${atlStatus}, taxpayerType: ${taxpayerType}, subType: ${subType})`
  );
}
