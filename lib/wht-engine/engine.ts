import { Decimal } from 'decimal.js';
import {
  WhtInput,
  WhtResult,
  WhtSectionConfig,
  WhtSlab,
  SlabLine,
  PaymentFrequency,
  FREQUENCY_MULTIPLIERS,
} from '../tax-rules';
import { getConfigByTransactionDate, getConfigByYear } from './loader';
import { resolveRule } from './resolver';
import { validateSectionConfig } from './validator';
import { buildExplanation } from './explanation';

/**
 * Normalizes keys to support polymorphic subType inputs (subType, dividendType, instrumentType, paymentNature).
 */
function extractSubType(sectionSpecific: Record<string, unknown>): string | null {
  const possibleKeys = ['subType', 'dividendType', 'instrumentType', 'paymentNature'];
  for (const key of possibleKeys) {
    if (typeof sectionSpecific[key] === 'string') {
      return sectionSpecific[key] as string;
    }
  }
  return null;
}

/**
 * Computes the withholding tax for a given transaction input.
 *
 * CRITICAL ARCHITECTURAL CONSTRAINT:
 * All runtime monetary calculations must use Decimal and no arithmetic may be performed using JavaScript number.
 * Standard JavaScript numbers (+, -, *, /) are forbidden for calculation to prevent float-rounding issues.
 */
export function computeWht(input: WhtInput): WhtResult {
  // 1. Resolve configuration — priority: financeActYear > transactionDate > system date.
  //
  // When financeActYear is supplied the engine uses that year's config directly.
  // txDate is derived from the config's effectiveFrom so that resolveRule() filters
  // rules correctly (every rule's effectiveFrom aligns with the fiscal year start).
  //
  // When financeActYear is absent the existing date-based lookup is used unchanged,
  // preserving full backward compatibility with all existing call sites and tests.
  let config: ReturnType<typeof getConfigByYear>;
  let txDate: Date;

  if (input.financeActYear !== undefined) {
    config = getConfigByYear(input.financeActYear);
    txDate = new Date(config.effectiveFrom); // start of fiscal year — activates all rules
  } else {
    txDate = input.transactionDate
      ? typeof input.transactionDate === 'string'
        ? new Date(input.transactionDate)
        : input.transactionDate
      : new Date();
    config = getConfigByTransactionDate(txDate);
  }

  // 2. Resolve section
  const section = config.sections.find((s) => s.code === input.sectionCode);
  if (!section) {
    throw new Error(`Section ${input.sectionCode} is not defined for Finance Act Year ${config.financeActYear}`);
  }

  // 3. Validate section configuration rules to ensure conflict-free execution
  validateSectionConfig(section, config.effectiveFrom, config.effectiveTo);

  // 4. Validate input fields
  const sectionSpecific = input.sectionSpecific || {};
  for (const field of section.transactionFields) {
    if (field.required) {
      const val = sectionSpecific[field.key];
      if (val === undefined || val === null || val === '') {
        throw new Error(`Input Validation Error: Field '${field.key}' is required for Section ${section.code}.`);
      }
    }
  }

  // 5. Retrieve primary amount field
  const amountFieldDef = section.transactionFields.find((f) => f.amountField === true);
  if (!amountFieldDef) {
    throw new Error(`Section ${section.code} does not declare a primary amountField.`);
  }

  const rawAmountVal = sectionSpecific[amountFieldDef.key];
  if (typeof rawAmountVal !== 'number' || isNaN(rawAmountVal) || rawAmountVal <= 0) {
    throw new Error(`Input Validation Error: Amount field '${amountFieldDef.key}' must be a positive number.`);
  }

  // WRAP raw amount in Decimal immediately. All further arithmetic uses Decimal methods.
  const enteredAmount = new Decimal(rawAmountVal);

  // 6. Extract common WHT query variables from inputs
  const atlStatus = (sectionSpecific.atlStatus || null) as any;
  const taxpayerType = (sectionSpecific.taxpayerType || null) as any;
  let subType = extractSubType(sectionSpecific);

  // §152(1DB) Sukuk by non-resident — rate depends on holder taxpayer type
  // (Company vs Individual/AOP) and, for Individual/AOP, whether the ROI
  // exceeds Rs 1,000,000. Mirrors §151 Sukuk pattern.
  if (section.code === '152' && subType === 'SUKUK_NR') {
    subType = taxpayerType === 'COMPANY'
      ? 'SUKUK_NR_COMPANY'
      : rawAmountVal > 1_000_000
      ? 'SUKUK_NR_IND_GT1M'
      : 'SUKUK_NR_IND_LE1M';
  }

  // §233 LIFE_INSURANCE_AGENT — Div-II Pt-IV 1st Sch. provides a reduced
  // 8%/16% rate only when annual commission < Rs 500,000. At or above
  // that threshold the transaction is still a life-insurance-agent
  // commission, but it falls outside the concessional row and attracts
  // the residual 12%/24% rate. Engine derives the sub-type accordingly;
  // category remains LIFE_INSURANCE_AGENT in user-facing labels.
  if (section.code === '233' && subType === 'LIFE_INSURANCE_AGENT') {
    const annualTotalRaw = sectionSpecific.annualCommissionTotal;
    const annualTotal =
      typeof annualTotalRaw === 'number' && annualTotalRaw > 0
        ? annualTotalRaw
        : rawAmountVal;
    subType = annualTotal >= 500_000 ? 'LIFE_INSURANCE_AGENT_HIGH' : 'LIFE_INSURANCE_AGENT_LOW';
  }

  // Sections 236C/236K: for FMV-banded configs (FY2025-26 and earlier) the
  // applicable rate depends on which FMV band the property value falls into
  // (Tenth Schedule, Rules 1 & 1A). This band is derived from the amount
  // itself rather than selected by the user. The guard keys off whether the
  // active config actually defines FMV-band rules: Finance Act 2026 replaced
  // Division X (§236C) and Division XVIII (§236K) with single flat rates
  // (2.75% / 1.25%), so the FY2026-27 config carries no FMV_* rules and must
  // skip band derivation (subType stays null → flat ATL/Non-ATL rule resolves).
  if (
    (section.code === '236C' || section.code === '236K') &&
    section.rules.some((r) => r.subType === 'FMV_LE_50M')
  ) {
    subType = rawAmountVal <= 50_000_000
      ? 'FMV_LE_50M'
      : rawAmountVal <= 100_000_000
      ? 'FMV_50M_TO_100M'
      : 'FMV_GT_100M';
  }

  // Section 151: Government Security and Sukuk rates depend on the holder's
  // taxpayer type (Division-IA(b)/(c), Division-IB, Tenth Schedule Rule 1),
  // and Sukuk held by an Individual/AOP further depends on whether the
  // return on investment exceeds Rs. 1,000,000.
  if (section.code === '151' && section.rules.some((r) => r.subType === 'GOVT_SEC_INDIVIDUAL')) {
    if (subType === 'GOVT_SEC') {
      subType = taxpayerType === 'INDIVIDUAL' ? 'GOVT_SEC_INDIVIDUAL' : 'GOVT_SEC_OTHER';
    } else if (subType === 'SUKUK') {
      subType = taxpayerType === 'COMPANY'
        ? 'SUKUK_COMPANY'
        : rawAmountVal > 1_000_000
        ? 'SUKUK_IND_GT1M'
        : 'SUKUK_IND_LE1M';
    } else if (subType === 'NSSF') {
      // NSSF rate depends on holder taxpayer type — Individual 15%/30%,
      // Non-individual (AOP/Company) 20%/40% per Div-IA(b)/(c) Pt-III 1st Sch.
      subType = taxpayerType === 'INDIVIDUAL' ? 'NSSF_INDIVIDUAL' : 'NSSF_OTHER';
    }
  }

  // 7. Frequency Normalisation
  let enteredFrequency: PaymentFrequency | undefined;
  let multiplier = 1;
  let annualisedAmount: Decimal | undefined;

  if (amountFieldDef.frequencyTarget) {
    const freqVal = sectionSpecific[amountFieldDef.frequencyTarget] as PaymentFrequency;
    if (!freqVal || !FREQUENCY_MULTIPLIERS[freqVal]) {
      throw new Error(
        `Input Validation Error: Frequency field '${amountFieldDef.frequencyTarget}' must be explicitly selected.`
      );
    }
    enteredFrequency = freqVal;
    multiplier = FREQUENCY_MULTIPLIERS[freqVal];

    if (enteredFrequency !== 'ONE_TIME') {
      // Annualise using Decimal multiplication
      annualisedAmount = enteredAmount.mul(multiplier);
    }
  }

  // Section 149: annualBonus (annual figure) and otherAllowances (monthly figure) are added
  // to annualisedAmount so that the slab computation runs on total taxable income.
  // This block must execute after frequency normalisation so that multiplier is known.
  if (section.code === '149' && annualisedAmount !== undefined) {
    const bonusRaw = sectionSpecific.annualBonus;
    const allowancesRaw = sectionSpecific.otherAllowances;
    if (typeof bonusRaw === 'number' && bonusRaw > 0) {
      annualisedAmount = annualisedAmount.add(new Decimal(bonusRaw));
    }
    if (typeof allowancesRaw === 'number' && allowancesRaw > 0) {
      // otherAllowances is entered as a monthly figure — annualise using the same multiplier
      annualisedAmount = annualisedAmount.add(new Decimal(allowancesRaw).mul(multiplier));
    }
  }

  const effectiveAmount = annualisedAmount || enteredAmount;

  // 8. Threshold Guard checks
  if (section.thresholds) {
    const matchedThreshold = section.thresholds.find((t) => {
      if (t.subType && t.subType !== subType) return false;
      if (t.taxpayerType && t.taxpayerType !== taxpayerType) return false;
      return true;
    });

    if (matchedThreshold && effectiveAmount.lt(matchedThreshold.minimumAmount)) {
      // Resolve the theoretical rate for the enhanced explanation (presentation layer only).
      // This does not affect applicable, rate, whtAmountPerPeriod, or any statutory determination.
      let theoreticalRate: number | undefined;
      let theoreticalRateLabel: string | undefined;
      let theoreticalWhtAmount: Decimal | undefined;

      const usesSlabs =
        section.requiresSlabComputation ||
        (section.code === '155' && (taxpayerType === 'INDIVIDUAL' || taxpayerType === 'AOP'));

      if (!usesSlabs) {
        try {
          const theoreticalRule = resolveRule(section, txDate, atlStatus, taxpayerType, subType);
          theoreticalRate = theoreticalRule.rate;
          theoreticalRateLabel = theoreticalRule.rateLabel;
          // Per-period WHT mirrors the applicable path: enteredAmount × rate.
          // For ONE_TIME payments effectiveAmount === enteredAmount, so this is exact.
          // For periodic payments enteredAmount is the per-period figure.
          theoreticalWhtAmount = enteredAmount.mul(new Decimal(theoreticalRate).div(100)).round();
        } catch {
          // Graceful degradation — leave fields undefined if rule cannot be resolved.
        }
      }

      // Inapplicable due to threshold (calculated using Decimal comparison)
      const result: WhtResult = {
        applicable: false,
        inapplicableReason: matchedThreshold.note || `Transaction amount is below the minimum threshold of PKR ${matchedThreshold.minimumAmount}.`,
        sectionCode: section.code,
        sectionLabel: section.label,
        legalReference: section.legalReference,
        financeActYear: config.financeActYear,
        transactionSummary: `Exempt transaction under Section ${section.code}`,
        inputs: sectionSpecific,
        enteredAmount,
        enteredAmountLabel: amountFieldDef.label,
        enteredFrequency,
        annualisedAmount,
        rate: 0,
        rateLabel: '0% (Exempt)',
        whtAmountPerPeriod: new Decimal(0),
        netAmountPerPeriod: enteredAmount,
        theoreticalRate,
        theoreticalRateLabel,
        theoreticalWhtAmount,
        thresholdMinimum: matchedThreshold.minimumAmount,
        explanation: '',
      };
      // Compile explanation
      const explanation = buildExplanation(result);
      return { ...result, explanation };
    }
  }

  // §149(3) Board-of-Directors meeting / directorship fee — flat 20% on the
  // gross fee (Moore TY2027 Chart, §149(3)). Handled in a dedicated branch
  // because §149 is otherwise a progressive-slab section; the directorship fee
  // is a flat charge on the entered gross amount (no slab, no annualisation).
  if (section.code === '149' && subType === 'DIRECTOR_FEE') {
    const feeTax = enteredAmount.mul(new Decimal('0.20')).round();
    const directorPartial = {
      applicable: true,
      sectionCode: section.code,
      sectionLabel: section.label,
      legalReference: section.legalReference,
      financeActYear: config.financeActYear,
      transactionSummary: `Section ${section.code} - DIRECTOR FEE (149(3)) - PKR ${enteredAmount.toNumber().toLocaleString()}`,
      inputs: sectionSpecific,
      enteredAmount,
      enteredAmountLabel: amountFieldDef.label,
      rate: 20,
      rateLabel: '20% (Board / Directorship Fee - Sec 149(3))',
      whtAmountPerPeriod: feeTax,
      netAmountPerPeriod: enteredAmount.sub(feeTax),
      isProgressiveSlab: false,
      slabBreakdown: [],
    };
    return { ...directorPartial, explanation: buildExplanation(directorPartial) };
  }

  // §149(1A) Pension — special branch. Pension ≤ Rs 10M is nil. Pension
  // > Rs 10M with pensioner age < 70 is taxed at 5% on the excess plus a
  // 10% surcharge on the tax (Div-I Pt-I 1st Sch. clauses (1)/(2);
  // s.4AB). CONTINUATION and NORMAL_SALARY fall through to slab path.
  if (section.code === '149' && subType === 'PENSION') {
    const pensionAge = sectionSpecific.pensionerAge;
    const ageNum = typeof pensionAge === 'number' ? pensionAge : undefined;
    const PENSION_THRESHOLD = new Decimal(10_000_000);
    let pensionTaxAnnual = new Decimal(0);
    let pensionRateLabel: string;

    if (effectiveAmount.lte(PENSION_THRESHOLD)) {
      pensionRateLabel = '0% (Pension ≤ Rs 10,000,000 - Sec 149(1A))';
    } else if (ageNum !== undefined && ageNum >= 70) {
      pensionRateLabel = '0% (Pension > Rs 10M but pensioner age ≥ 70 — exempt)';
    } else {
      // Age < 70 (default if unspecified — conservative i.e., apply tax).
      // The 10% surcharge component derives from s.4AB, which Finance Act 2026
      // amended to "no surcharge shall be payable". For FY2026-27 onwards the
      // 5% charge on the excess remains but the surcharge is dropped.
      const excess = effectiveAmount.sub(PENSION_THRESHOLD);
      const pensionSurchargeApplies = config.financeActYear < 2026;
      pensionTaxAnnual = pensionSurchargeApplies
        ? excess.mul(new Decimal('0.05')).mul(new Decimal('1.10')).round()
        : excess.mul(new Decimal('0.05')).round();
      pensionRateLabel = pensionSurchargeApplies
        ? '5% × Excess >Rs.10M + 10% Surcharge (Pension, age <70 - Sec 149(1A))'
        : '5% × Excess >Rs.10M (Pension, age <70 - Sec 149(1A); s.4AB surcharge repealed by Finance Act 2026)';
    }

    const pensionPerPeriod = pensionTaxAnnual.div(multiplier).round();
    const pensionPartial = {
      applicable: true,
      sectionCode: section.code,
      sectionLabel: section.label,
      legalReference: section.legalReference,
      financeActYear: config.financeActYear,
      transactionSummary: `Section ${section.code} - PENSION - PKR ${enteredAmount.toNumber().toLocaleString()}${enteredFrequency && enteredFrequency !== 'ONE_TIME' ? ` (${enteredFrequency.toLowerCase()})` : ''}`,
      inputs: sectionSpecific,
      enteredAmount,
      enteredAmountLabel: amountFieldDef.label,
      enteredFrequency,
      annualisedAmount,
      rate: effectiveAmount.lte(PENSION_THRESHOLD) || (ageNum !== undefined && ageNum >= 70) ? 0 : 5,
      rateLabel: pensionRateLabel,
      whtAmountAnnual: pensionTaxAnnual,
      whtAmountPerPeriod: pensionPerPeriod,
      netAmountPerPeriod: enteredAmount.sub(pensionPerPeriod),
      isProgressiveSlab: false,
      slabBreakdown: [],
    };
    return { ...pensionPartial, explanation: buildExplanation(pensionPartial) };
  }

  // §151B — Payments by life insurance companies and takaful operators
  // (Finance Act 2026, new section + Division IC Pt III 1st Sch). The amount
  // liable to tax is the GROSS payout reduced by the aggregate premiums /
  // contributions paid (s.151B(2)); the rate depends on the timing band
  // (within 1 year → 15%, 1–4 years → 10%) and the deduction is FINAL TAX.
  // Payouts after 4 years, or on death / disability, are exempt (rate 0%).
  // The net-of-premiums base is a computation pattern unique to this section,
  // so it is handled in a dedicated branch (mirroring §149 pension).
  if (section.code === '151B') {
    const premiumsRaw = sectionSpecific.premiumsPaid;
    const premiums =
      typeof premiumsRaw === 'number' && premiumsRaw > 0 ? new Decimal(premiumsRaw) : new Decimal(0);
    const taxableBase = Decimal.max(enteredAmount.sub(premiums), new Decimal(0));
    const rule151b = resolveRule(section, txDate, atlStatus, taxpayerType, subType);
    const tax151b = taxableBase.mul(new Decimal(rule151b.rate).div(100)).round();

    const partial151b = {
      applicable: true,
      sectionCode: section.code,
      sectionLabel: section.label,
      legalReference: section.legalReference,
      financeActYear: config.financeActYear,
      transactionSummary: `Section ${section.code} - ${subType ?? ''} - PKR ${enteredAmount.toNumber().toLocaleString()}`,
      inputs: sectionSpecific,
      enteredAmount,
      enteredAmountLabel: amountFieldDef.label,
      rate: rule151b.rate,
      rateLabel: rule151b.rateLabel,
      whtAmountPerPeriod: tax151b,
      netAmountPerPeriod: enteredAmount.sub(tax151b),
      isProgressiveSlab: false,
      slabBreakdown: [],
    };
    return { ...partial151b, explanation: buildExplanation(partial151b) };
  }

  // 9. Core Calculation: Slabs vs. Flat rule
  let rate = 0;
  let rateLabel = '';
  let whtAmountAnnual: Decimal | undefined;
  let whtAmountPerPeriod = new Decimal(0);
  let isProgressiveSlab = false;
  let slabBreakdown: SlabLine[] = [];

  // Determine if progressive slabs are active for this query
  const runSlabs =
    section.requiresSlabComputation ||
    (section.code === '155' && (taxpayerType === 'INDIVIDUAL' || taxpayerType === 'AOP'));

  if (runSlabs && section.slabs) {
    isProgressiveSlab = true;
    const income = effectiveAmount;
    let computedTax = new Decimal(0);

    // Progressive slab portion calculator using Decimal operations
    for (const slab of section.slabs) {
      const slabFrom = new Decimal(slab.from);
      const slabTo = slab.to !== null ? new Decimal(slab.to) : null;

      let taxableAmountInSlab = new Decimal(0);
      if (income.gte(slabFrom)) {
        const slabStart = slabFrom.gt(0) ? slabFrom.sub(1) : new Decimal(0);
        if (slabTo === null || income.lte(slabTo)) {
          taxableAmountInSlab = income.sub(slabStart);
        } else {
          taxableAmountInSlab = slabTo.sub(slabStart);
        }
      }

      const rateDec = new Decimal(slab.rate).div(100);
      const slabTax = taxableAmountInSlab.mul(rateDec);
      computedTax = computedTax.add(slabTax);

      slabBreakdown.push({
        slabLabel: slab.label,
        taxableAmount: taxableAmountInSlab,
        rate: slab.rate,
        tax: slabTax,
      });
    }

    // §149: 9% surcharge on tax payable when annualised taxable income
    // exceeds Rs 10,000,000 — proviso to s.4AB, Div-I Pt-I 1st Sch.
    // REPEALED by Finance Act 2026 (Act §5(2): the s.4AB proviso is
    // substituted with "no surcharge shall be payable"). Gated on
    // financeActYear < 2026 so FY2025-26 keeps the surcharge and FY2026-27
    // onwards does not.
    let surchargeApplied = false;
    if (section.code === '149' && config.financeActYear < 2026 && effectiveAmount.gt(10_000_000)) {
      computedTax = computedTax.mul(new Decimal('1.09'));
      surchargeApplied = true;
    }

    // §155: Non-ATL Individual/AOP — Rule 1 Tenth Schedule doubles the
    // deductible WHT. Slab arithmetic is the same; final tax × 2.
    let nonAtlDoublingApplied = false;
    if (
      section.code === '155' &&
      atlStatus === 'NON_ATL' &&
      (taxpayerType === 'INDIVIDUAL' || taxpayerType === 'AOP')
    ) {
      computedTax = computedTax.mul(new Decimal(2));
      nonAtlDoublingApplied = true;
    }

    whtAmountAnnual = computedTax.round();
    whtAmountPerPeriod = whtAmountAnnual.div(multiplier).round();

    // Compute effective WHT rate for slab
    if (effectiveAmount.gt(0)) {
      rate = whtAmountAnnual.div(effectiveAmount).mul(100).toNumber();
      rate = Math.round(rate * 100) / 100;
    }
    const suffix =
      (surchargeApplied ? ' + 9% Surcharge >Rs.10M' : '') +
      (nonAtlDoublingApplied ? ' × 2 Non-ATL (R.1 Tenth Sch.)' : '');
    rateLabel = `Progressive Slab (Effective: ${rate}%)${suffix}`;
  } else {
    // Flat rate rule resolver
    const resolvedRule = resolveRule(section, txDate, atlStatus, taxpayerType, subType);
    rate = resolvedRule.rate;
    rateLabel = resolvedRule.rateLabel;

    // Use Decimal arithmetic
    const rateDec = new Decimal(rate).div(100);
    let calculatedTax = effectiveAmount.mul(rateDec);

    if (resolvedRule.fixedAmount) {
      calculatedTax = calculatedTax.add(resolvedRule.fixedAmount);
    }
    if (resolvedRule.surchargeRate) {
      const surchargeMultiplier = new Decimal(1).add(new Decimal(resolvedRule.surchargeRate).div(100));
      calculatedTax = calculatedTax.mul(surchargeMultiplier);
    }

    if (annualisedAmount) {
      whtAmountAnnual = calculatedTax.round();
      whtAmountPerPeriod = whtAmountAnnual.div(multiplier).round();
    } else {
      whtAmountPerPeriod = calculatedTax.round();
    }
  }

  const netAmountPerPeriod = enteredAmount.sub(whtAmountPerPeriod);

  // 10. Generate transaction summary text
  let summaryParts = [`Section ${section.code}`];
  if (subType) {
    summaryParts.push(subType);
  }
  if (taxpayerType) {
    summaryParts.push(taxpayerType);
  }
  if (atlStatus) {
    summaryParts.push(atlStatus);
  }
  summaryParts.push(`PKR ${enteredAmount.toNumber().toLocaleString()}`);
  if (enteredFrequency && enteredFrequency !== 'ONE_TIME') {
    summaryParts.push(`(${enteredFrequency.toLowerCase()})`);
  }
  const transactionSummary = summaryParts.join(' - ');

  // 11. Build Result object
  const partialResult = {
    applicable: true,
    sectionCode: section.code,
    sectionLabel: section.label,
    legalReference: section.legalReference,
    financeActYear: config.financeActYear,
    transactionSummary,
    inputs: sectionSpecific,
    enteredAmount,
    enteredAmountLabel: amountFieldDef.label,
    enteredFrequency,
    annualisedAmount,
    rate,
    rateLabel,
    whtAmountAnnual,
    whtAmountPerPeriod,
    netAmountPerPeriod,
    isProgressiveSlab,
    slabBreakdown,
  };

  const explanation = buildExplanation(partialResult);

  return {
    ...partialResult,
    explanation,
  };
}
