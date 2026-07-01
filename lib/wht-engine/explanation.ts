import { Decimal } from 'decimal.js';
import { WhtResult, SlabLine, FREQUENCY_MULTIPLIERS, PaymentFrequency } from '../tax-rules';
import { formatNumber } from '../utils/currency';
import { taxYearLabel } from '../utils/tax-year';

/** Thin wrapper so existing callers inside this file need no changes. */
function formatAmount(val: Decimal): string {
  return formatNumber(val);
}

/**
 * Builds a markdown explanation of the withholding tax calculation.
 */
export function buildExplanation(result: {
  applicable: boolean;
  inapplicableReason?: string;
  sectionCode: string;
  sectionLabel: string;
  legalReference: string;
  financeActYear: number;
  transactionSummary: string;
  inputs: Record<string, unknown>;
  enteredAmount: Decimal;
  enteredAmountLabel: string;
  enteredFrequency?: PaymentFrequency;
  annualisedAmount?: Decimal;
  rate: number;
  rateLabel: string;
  whtAmountAnnual?: Decimal;
  whtAmountPerPeriod: Decimal;
  netAmountPerPeriod: Decimal;
  isProgressiveSlab?: boolean;
  slabBreakdown?: readonly SlabLine[];
  theoreticalRate?: number;
  theoreticalRateLabel?: string;
  theoreticalWhtAmount?: Decimal;
  thresholdMinimum?: number;
}): string {
  const parts: string[] = [];

  parts.push(`### Calculation Details for Section ${result.sectionCode}`);
  parts.push(`**Legal Reference:** ${result.legalReference}`);
  parts.push(`**Tax Year:** ${taxYearLabel(result.financeActYear)}`);
  parts.push(`**Summary:** ${result.transactionSummary}\n`);

  if (!result.applicable) {
    // Enhanced threshold-exempt explanation: show full calculation, threshold test, and
    // illustrative "what would have been due" section.
    if (
      result.theoreticalRate !== undefined &&
      result.theoreticalRateLabel !== undefined &&
      result.theoreticalWhtAmount !== undefined &&
      result.thresholdMinimum !== undefined
    ) {
      const comparisonAmount = result.annualisedAmount || result.enteredAmount;
      const comparisonFormatted = formatAmount(comparisonAmount);
      const thresholdFormatted = result.thresholdMinimum.toLocaleString('en-US');
      const enteredFormatted = formatAmount(result.enteredAmount);
      const theoreticalFormatted = formatAmount(result.theoreticalWhtAmount);

      // Section 1 — Transaction details with theoretical rate
      parts.push(`#### 1. Transaction Details`);
      if (result.annualisedAmount) {
        parts.push(`- ${result.enteredAmountLabel}: **PKR ${enteredFormatted}**`);
        const freqMultiplier = result.enteredFrequency === 'MONTHLY' ? 12
          : result.enteredFrequency === 'QUARTERLY' ? 4
          : result.enteredFrequency === 'SEMI_ANNUAL' ? 2 : 1;
        parts.push(`- Annualised Amount: **PKR ${formatAmount(result.annualisedAmount)}** (PKR ${enteredFormatted} × ${freqMultiplier})`);
      } else {
        parts.push(`- Payment Amount: **PKR ${enteredFormatted}**`);
      }
      parts.push(`- Applicable Rate: **${result.theoreticalRate}%** *(${result.theoreticalRateLabel})*`);
      parts.push(`- Theoretical WHT: **PKR ${enteredFormatted} × ${result.theoreticalRate}% = PKR ${theoreticalFormatted}**`);
      parts.push('');

      // Section 2 — Threshold evaluation
      parts.push(`#### 2. Statutory Threshold`);
      parts.push(`- Threshold: **PKR ${thresholdFormatted}**`);
      parts.push(`- Threshold Test: **${comparisonFormatted} < ${thresholdFormatted}** — payment is below the statutory minimum`);
      if (result.inapplicableReason) {
        parts.push(`- Threshold Rule: *${result.inapplicableReason}*`);
      }
      parts.push('');

      // Section 3 — Result
      parts.push(`#### 3. Result`);
      parts.push(
        `The ${result.annualisedAmount ? 'annualised payment' : 'payment'} of **PKR ${comparisonFormatted}** is below the statutory threshold of **PKR ${thresholdFormatted}**. ` +
        `Withholding tax is therefore **not required** to be deducted.`
      );
      parts.push('');
      parts.push(`- **Final WHT Payable: PKR 0**`);
      parts.push('');

      // Section 4 — Illustrative "what would have been due"
      parts.push(`#### 4. Illustrative Calculation (Not Payable)`);
      parts.push(`Had the statutory threshold of **PKR ${thresholdFormatted}** been exceeded, withholding tax would have been calculated as follows:`);
      parts.push('');
      parts.push(`- Payment Amount: **PKR ${enteredFormatted}**`);
      parts.push(`- Applicable Rate: **${result.theoreticalRate}%**`);
      parts.push(`- WHT Calculation: **PKR ${enteredFormatted} × ${result.theoreticalRate}%**`);
      parts.push(`- Theoretical WHT: **PKR ${theoreticalFormatted}**`);
      parts.push('');
      parts.push(`> This amount is shown for explanatory purposes only and is not payable because the statutory threshold has not been exceeded.`);

      return parts.join('\n');
    }

    // Fallback: non-threshold exemption — simple note
    parts.push(`> [!NOTE]\n> **WHT does not apply:** ${result.inapplicableReason || 'This transaction is exempt or below the minimum threshold.'}`);
    return parts.join('\n');
  }

  // §151B — life-insurance / takaful payout: the taxable base is the gross
  // payout reduced by the aggregate premiums paid, then taxed at the timing-band
  // rate (final tax). Show the net-of-premiums derivation explicitly.
  if (result.sectionCode === '151B') {
    const premiumsRaw = result.inputs.premiumsPaid;
    const premiums = typeof premiumsRaw === 'number' && premiumsRaw > 0 ? new Decimal(premiumsRaw) : new Decimal(0);
    const taxableBase = Decimal.max(result.enteredAmount.sub(premiums), new Decimal(0));

    parts.push(`#### 1. Taxable Base (Payout − Premiums)`);
    parts.push(`- Gross Payout / Benefit: **PKR ${formatAmount(result.enteredAmount)}**`);
    parts.push(`- Less Aggregate Premiums / Contributions Paid: **PKR ${formatAmount(premiums)}**`);
    parts.push(`- **Amount Liable to Tax (s.151B(2)): PKR ${formatAmount(taxableBase)}**`);
    parts.push('');
    parts.push(`#### 2. Tax Rate Application`);
    parts.push(`- Resolved Rate: **${result.rateLabel}**`);
    parts.push(`- Computation: PKR ${formatAmount(taxableBase)} (taxable base) × ${result.rate}% = **PKR ${formatAmount(result.whtAmountPerPeriod)}**`);
    parts.push(`- Treatment: **Final Tax** on the income arising from the payout (s.151B(4)).`);
    parts.push('');
    parts.push(`#### 3. Summary of Deductions`);
    parts.push(`- **Gross Payout:** PKR ${formatAmount(result.enteredAmount)}`);
    parts.push(`- **WHT Deduction:** PKR ${formatAmount(result.whtAmountPerPeriod)}`);
    parts.push(`- **Net Payable Amount:** **PKR ${formatAmount(result.netAmountPerPeriod)}**`);
    return parts.join('\n');
  }

  // 1. Inputs and Frequency normalisation
  parts.push(`#### 1. Transaction Input`);
  if (result.sectionCode === '149' && result.enteredFrequency && result.annualisedAmount) {
    // Section 149: show full taxable income breakdown (salary + bonus + allowances)
    const freqMultiplier = result.enteredFrequency === 'MONTHLY' ? 12
      : result.enteredFrequency === 'QUARTERLY' ? 4
      : result.enteredFrequency === 'SEMI_ANNUAL' ? 2 : 1;
    const baseSalaryAnnual = result.enteredAmount.mul(freqMultiplier);

    const bonusRaw = result.inputs.annualBonus;
    const allowancesRaw = result.inputs.otherAllowances;
    const annualBonus = typeof bonusRaw === 'number' && bonusRaw > 0 ? new Decimal(bonusRaw) : null;
    const monthlyAllowances = typeof allowancesRaw === 'number' && allowancesRaw > 0 ? new Decimal(allowancesRaw) : null;
    const annualAllowances = monthlyAllowances ? monthlyAllowances.mul(freqMultiplier) : null;

    parts.push(`- **Base Salary:** PKR ${formatAmount(result.enteredAmount)} × ${freqMultiplier} = PKR ${formatAmount(baseSalaryAnnual)}`);
    if (annualBonus) {
      parts.push(`- **Annual Bonus:** PKR ${formatAmount(annualBonus)}`);
    }
    if (monthlyAllowances && annualAllowances) {
      parts.push(`- **Other Allowances:** PKR ${formatAmount(monthlyAllowances)} × ${freqMultiplier} = PKR ${formatAmount(annualAllowances)}`);
    }
    parts.push(`- **Total Annual Taxable Income: PKR ${formatAmount(result.annualisedAmount)}**`);
  } else if (result.enteredFrequency && result.enteredFrequency !== 'ONE_TIME') {
    parts.push(
      `- Entered Amount: **PKR ${formatAmount(result.enteredAmount)}** (Frequency: *${result.enteredFrequency}*)`
    );
    if (result.annualisedAmount && result.enteredFrequency) {
      const multiplier = FREQUENCY_MULTIPLIERS[result.enteredFrequency];
      if (multiplier > 1) {
        parts.push(
          `- Frequency Conversion: PKR ${formatAmount(result.enteredAmount)} × ${multiplier} = **Annualized Amount: PKR ${formatAmount(result.annualisedAmount)}**`
        );
      }
    }
  } else {
    parts.push(`- Entered Transaction Amount: **PKR ${formatAmount(result.enteredAmount)}**`);
  }
  parts.push('');

  // 2. Calculations
  if (result.isProgressiveSlab && result.slabBreakdown) {
    parts.push(`#### 2. Progressive Slab Breakdown`);
    parts.push(`The tax is calculated progressively across income slabs as follows:`);
    parts.push('');
    parts.push(`| Slab Range | Taxable Amount in Slab (PKR) | Rate | Slab Tax (PKR) |`);
    parts.push(`| :--- | :---: | :---: | :---: |`);

    for (const slab of result.slabBreakdown) {
      parts.push(
        `| ${slab.slabLabel} | PKR ${formatAmount(slab.taxableAmount)} | ${slab.rate}% | PKR ${formatAmount(slab.tax)} |`
      );
    }
    parts.push('');

    if (result.whtAmountAnnual) {
      parts.push(`- **Total Annual WHT Liability:** **PKR ${formatAmount(result.whtAmountAnnual)}**`);
      if (result.enteredFrequency && result.enteredFrequency !== 'ONE_TIME') {
        const divisor = FREQUENCY_MULTIPLIERS[result.enteredFrequency];
        if (divisor > 1) {
          parts.push(
            `- **Per-Period Deduction:** PKR ${formatAmount(result.whtAmountAnnual)} ÷ ${divisor} = **PKR ${formatAmount(result.whtAmountPerPeriod)}**`
          );
        }
      }
    }
  } else {
    parts.push(`#### 2. Tax Rate Application`);
    parts.push(`- Resolved Rate: **${result.rateLabel}**`);

    const baseAmount = result.annualisedAmount || result.enteredAmount;
    const baseLabel = result.annualisedAmount ? 'annualized base' : 'transaction base';

    parts.push(
      `- Computation Formula: PKR ${formatAmount(baseAmount)} (${baseLabel}) × ${result.rate}% = **PKR ${formatAmount(result.whtAmountAnnual || result.whtAmountPerPeriod)}**`
    );

    if (result.annualisedAmount && result.whtAmountAnnual && result.enteredFrequency && result.enteredFrequency !== 'ONE_TIME') {
      const divisor = FREQUENCY_MULTIPLIERS[result.enteredFrequency];
      if (divisor > 1) {
        parts.push(
          `- Per-Period Deduction: PKR ${formatAmount(result.whtAmountAnnual)} ÷ ${divisor} = **PKR ${formatAmount(result.whtAmountPerPeriod)}**`
        );
      }
    }
  }
  parts.push('');

  // 3. Final summary
  parts.push(`#### 3. Summary of Deductions`);
  parts.push(`- **Gross Amount:** PKR ${formatAmount(result.enteredAmount)}`);
  parts.push(`- **WHT Deduction:** PKR ${formatAmount(result.whtAmountPerPeriod)}`);
  parts.push(`- **Net Payable Amount:** **PKR ${formatAmount(result.netAmountPerPeriod)}**`);

  return parts.join('\n');
}
