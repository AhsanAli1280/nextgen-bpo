import { WhtRateConfig, WhtSectionConfig, WhtRule, AtlStatus, TaxpayerType } from '../tax-rules';

/**
 * Helper to parse date strings and handle optional/null end dates.
 */
function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}

/**
 * Checks if two date ranges overlap.
 */
export function datesOverlap(
  startA: string,
  endA?: string,
  startB?: string,
  endB?: string
): boolean {
  const sA = parseDate(startA).getTime();
  const eA = endA ? parseDate(endA).getTime() : Infinity;
  const sB = startB ? parseDate(startB).getTime() : parseDate(startA).getTime();
  const eB = endB ? parseDate(endB).getTime() : Infinity;

  return sA <= eB && sB <= eA;
}

/**
 * Validates a single section's rules for overlapping conditions with same priorities,
 * ambiguous matches, and missing fallbacks.
 */
export function validateSectionConfig(
  section: WhtSectionConfig,
  configEffectiveFrom: string,
  configEffectiveTo: string
): void {
  const rules = section.rules;

  // 1. Direct duplicate priority & overlap check
  for (let i = 0; i < rules.length; i++) {
    for (let j = i + 1; j < rules.length; j++) {
      const r1 = rules[i];
      const r2 = rules[j];

      // Check if match conditions are identical
      const sameConditions =
        r1.atlStatus === r2.atlStatus &&
        r1.taxpayerType === r2.taxpayerType &&
        r1.subType === r2.subType;

      if (sameConditions) {
        // Check if date ranges overlap
        const overlap = datesOverlap(
          r1.effectiveFrom,
          r1.effectiveTo,
          r2.effectiveFrom,
          r2.effectiveTo
        );

        if (overlap && r1.priority === r2.priority) {
          throw new Error(
            `Rule Conflict in Section ${section.code}: Rules '${r1.id}' and '${r2.id}' have identical conditions, overlapping dates, and duplicate priority ${r1.priority}.`
          );
        }
      }
    }
  }

  // 2. Exhaustive input validation: Generate all possible valid inputs based on FieldDefinitions
  let atlOptions: AtlStatus[] = ['ATL', 'NON_ATL'];
  let taxpayerOptions: TaxpayerType[] = ['INDIVIDUAL', 'AOP', 'COMPANY'];
  let subTypeOptions: (string | null)[] = [null];

  // Extract valid values from fields if defined
  const taxpayerField = section.transactionFields.find((f) => f.key === 'taxpayerType');
  if (taxpayerField) {
    if (taxpayerField.lockedValue) {
      taxpayerOptions = [taxpayerField.lockedValue as TaxpayerType];
    } else if (taxpayerField.options) {
      taxpayerOptions = taxpayerField.options.map((o) => o.value as TaxpayerType);
    }
  }

  const atlField = section.transactionFields.find((f) => f.key === 'atlStatus');
  if (atlField?.options) {
    atlOptions = atlField.options.map((o) => o.value as AtlStatus);
  }
  const atlValues = atlField ? atlOptions : [null];

  const subTypeField = section.transactionFields.find(
    (f) => f.key === 'subType' || f.key === 'dividendType' || f.key === 'instrumentType' || f.key === 'paymentNature'
  );
  if (section.code === '236C' || section.code === '236K') {
    // Property-value FMV band is derived from the amount (see engine.ts),
    // not selected via a form field.
    subTypeOptions = ['FMV_LE_50M', 'FMV_50M_TO_100M', 'FMV_GT_100M'];
  } else if (section.code === '151' && section.rules.some((r) => r.subType === 'GOVT_SEC_INDIVIDUAL')) {
    // GOVT_SEC/SUKUK sub-categories are derived from taxpayerType + amount
    // (see engine.ts), not selected directly via the Instrument Type field.
    // Only applies to FY2025-26's expanded rule set (fy2027/28 still use the
    // simpler 'GOVT_SEC' subType and are unaffected).
    subTypeOptions = ['BANK', 'NSSF_INDIVIDUAL', 'NSSF_OTHER', 'GOVT_SEC_INDIVIDUAL', 'GOVT_SEC_OTHER', 'SUKUK_COMPANY', 'SUKUK_IND_GT1M', 'SUKUK_IND_LE1M'];
  } else if (section.code === '233' && section.rules.some((r) => r.subType === 'LIFE_INSURANCE_AGENT_LOW')) {
    // §233 LIFE_INSURANCE_AGENT is derived in engine.ts from the user-selected
    // 'LIFE_INSURANCE_AGENT' value + annualCommissionTotal threshold. Validator
    // must enumerate the derived sub-types, not the raw selection.
    if (subTypeField && subTypeField.options) {
      subTypeOptions = subTypeField.options
        .map((o) => o.value)
        .filter((v) => v !== 'LIFE_INSURANCE_AGENT')
        .concat(['LIFE_INSURANCE_AGENT_LOW', 'LIFE_INSURANCE_AGENT_HIGH']);
    }
  } else if (section.code === '152' && section.rules.some((r) => r.subType === 'SUKUK_NR_COMPANY')) {
    // §152(1DB) Sukuk sub-types are derived in engine.ts from the user-selected
    // 'SUKUK_NR' value + taxpayerType + amount. Validator must enumerate the
    // derived sub-types, not the raw selection.
    if (subTypeField && subTypeField.options) {
      subTypeOptions = subTypeField.options
        .map((o) => o.value)
        .filter((v) => v !== 'SUKUK_NR')
        .concat(['SUKUK_NR_COMPANY', 'SUKUK_NR_IND_GT1M', 'SUKUK_NR_IND_LE1M']);
    }
  } else if (subTypeField && subTypeField.options) {
    subTypeOptions = subTypeField.options.map((o) => o.value);
  }

  // Find all critical test dates: config boundaries and rule boundaries
  const testDates = new Set<string>([configEffectiveFrom, configEffectiveTo]);
  for (const r of rules) {
    testDates.add(r.effectiveFrom);
    if (r.effectiveTo) {
      testDates.add(r.effectiveTo);
      // Also test day after expiration
      const dayAfter = new Date(r.effectiveTo);
      dayAfter.setDate(dayAfter.getDate() + 1);
      const dayAfterStr = dayAfter.toISOString().split('T')[0];
      if (dayAfterStr <= configEffectiveTo) {
        testDates.add(dayAfterStr);
      }
    }
  }

  // Run resolution simulation for each valid combination of inputs at each key date
  for (const testDateStr of testDates) {
    const testDate = new Date(testDateStr);

    for (const atl of atlValues) {
      for (const taxpayer of taxpayerOptions) {
        for (const subType of subTypeOptions) {
          // If a combination of inputs requires slab computation (like Section 149, or Section 155 Individual/AOP), it bypasses resolved rules
          const isSlab =
            section.requiresSlabComputation ||
            (section.code === '155' && (taxpayer === 'INDIVIDUAL' || taxpayer === 'AOP'));

          if (isSlab) {
            continue;
          }

          // Simulate resolution logic
          const activeRules = rules.filter((r) => {
            // Check date active
            const start = parseDate(r.effectiveFrom).getTime();
            const end = r.effectiveTo ? parseDate(r.effectiveTo).getTime() : Infinity;
            const txTime = testDate.getTime();
            if (txTime < start || txTime > end) return false;

            // Check match condition
            if (r.atlStatus !== null && r.atlStatus !== atl) return false;
            if (r.taxpayerType !== null && r.taxpayerType !== taxpayer) return false;
            if (r.subType !== null && r.subType !== subType) return false;

            return true;
          });

          if (activeRules.length === 0) {
            throw new Error(
              `Missing Fallback Rule in Section ${section.code}: No rule matches input (atlStatus: ${atl}, taxpayerType: ${taxpayer}, subType: ${subType}) on date ${testDateStr}.`
            );
          }

          // Sort by priority desc
          activeRules.sort((a, b) => b.priority - a.priority);
          const maxPriority = activeRules[0].priority;
          const topPriorityRules = activeRules.filter((r) => r.priority === maxPriority);

          if (topPriorityRules.length > 1) {
            // Check specificity tie-breaker
            const getSpecificity = (r: WhtRule) => {
              let score = 0;
              if (r.atlStatus !== null) score++;
              if (r.taxpayerType !== null) score++;
              if (r.subType !== null) score++;
              return score;
            };

            const ruleSpecificities = topPriorityRules.map((r) => ({
              rule: r,
              spec: getSpecificity(r),
            }));

            ruleSpecificities.sort((a, b) => b.spec - a.spec);
            const maxSpec = ruleSpecificities[0].spec;
            const topSpecRules = ruleSpecificities.filter((rs) => rs.spec === maxSpec);

            if (topSpecRules.length > 1) {
              throw new Error(
                `Ambiguous Match in Section ${section.code}: Multiple rules (${topSpecRules
                  .map((ts) => ts.rule.id)
                  .join(', ')}) matched with identical priority ${maxPriority} and specificity ${maxSpec} for input (atlStatus: ${atl}, taxpayerType: ${taxpayer}, subType: ${subType}) on date ${testDateStr}.`
              );
            }
          }
        }
      }
    }
  }
}

/**
 * Validates a full configuration (e.g. for a Finance Act year).
 */
export function validateRateConfig(config: WhtRateConfig): void {
  if (!config.financeActYear) {
    throw new Error('Invalid Configuration: Missing financeActYear');
  }
  if (!config.effectiveFrom || !config.effectiveTo) {
    throw new Error(`Invalid Configuration for FY${config.financeActYear}: Missing effective dates.`);
  }

  for (const section of config.sections) {
    validateSectionConfig(section, config.effectiveFrom, config.effectiveTo);
  }
}
