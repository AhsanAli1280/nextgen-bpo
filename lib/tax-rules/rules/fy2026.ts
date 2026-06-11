/**
 * ============================================================================
 * Finance Act Year : 2025 (governing Tax Year 2025-26)
 * Effective period : 2025-07-01 to 2026-06-30
 *
 * VALIDATION STATUS — Track B1 remediation complete (9 June 2026):
 *   ✅ Section 149     — Salary slabs                (FBR validated, Finance Act 2025)
 *   ✅ Section 151     — Profit on Debt rates        (FBR validated, Finance Act 2025)
 *   ✅ Section 153a    — Goods (all 9 categories)    (FBR validated, Finance Act 2025)
 *   ✅ Section 153b    — Services (all 4 tiers)      (FBR validated, Finance Act 2025)
 *   ✅ Section 153c    — Contracts                   (FBR validated, Finance Act 2025)
 *   ✅ Section 153(2A) — Digital Transactions        (FBR validated, Finance Act 2025)
 *   ✅ Section 155     — Rent top slab               (FBR validated, Finance Act 2025)
 *   ✅ Section 236C    — Property Sale (FMV-banded)     (FBR validated, Finance Act 2025)
 *   ✅ Section 236K    — Property Purchase (FMV-banded) (FBR validated, Finance Act 2025)
 *
 *   ⚠️  Section 150  — Dividends            [PLACEHOLDER] — Track B pending
 *   ⚠️  Section 155  — Non-ATL indiv. path  [PLACEHOLDER] — Track B pending
 *
 * Source: FBR WHT Rate Card Tax Year 2026 (Finance Act 2025, effective 2025-07-01)
 * ============================================================================
 */

import { WhtRateConfig } from '../types';

export const configFY2026: WhtRateConfig = {
  financeActYear: 2025, // Governing Tax Year 2025-26
  effectiveFrom: '2025-07-01',
  effectiveTo: '2026-06-30',
  sections: [
    // ── Section 148 — Imports ─────────────────────────────────────────────
    // FBR VALIDATED — Finance Act 2025 / TY2026. Source: TAGCO WHT Rates Card
    // TY2026 ("IMPORTS | Sec 148 & Part II First Schedule").
    // Note: Tax u/s 148 not applicable where payment for imported goods has
    // been subjected to Digital Presence Proceeds Levy (not modeled — out of
    // scope for WHT calculation).
    // EXCLUDED: "Import of Mobile Phones" (Sec 148 & Part II of First Sch.) —
    // rates are fixed PKR amounts per C&F-value (USD) bracket and CBU/CKD-SKD
    // type, not a percentage of import value. Incompatible with the current
    // percentage-rate engine model (same rationale as the §231B exclusion);
    // not implemented.
    {
      code: '148',
      displayOrder: 1,
      label: 'Section 148 - Imports',
      legalReference: 'Section 148 Income Tax Ordinance 2001',
      displayName: 'Imports',
      shortDescription: 'Import of goods into Pakistan',
      icon: '🚢',
      category: 'Imports',
      transactionFields: [
        {
          key: 'importValue',
          label: 'Import Value (PKR)',
          type: 'number',
          placeholder: 'Enter gross import value',
          required: true,
          amountField: true,
        },
        {
          key: 'subType',
          label: 'Import Category',
          type: 'select',
          required: true,
          options: [
            { value: 'TWELFTH_SCH_PART_I', label: 'Goods per Part I of the Twelfth Schedule (All Importers)' },
            { value: 'TWELFTH_SCH_PART_II_COMMERCIAL', label: 'Goods per Part II of the Twelfth Schedule (Commercial Importers)' },
            { value: 'TWELFTH_SCH_PART_II_OTHER', label: 'Goods per Part II of the Twelfth Schedule (Other Importers)' },
            { value: 'TWELFTH_SCH_PART_III_COMMERCIAL', label: 'Goods per Part III of the Twelfth Schedule (Commercial Importers)' },
            { value: 'TWELFTH_SCH_PART_III_OTHER', label: 'Goods per Part III of the Twelfth Schedule (Other Importers)' },
            { value: 'SRO_1125_MANUFACTURERS', label: 'Goods per SRO 1125(I)/2011 (Manufacturers)' },
            { value: 'MEDICINES_DRAP', label: 'Medicines Not Manufactured Locally (DRAP Certified)' },
            { value: 'EV_LCV_CKD_KITS', label: 'CKD Kits - Electric Vehicles (up to 50 kWh) / LCVs (up to 150 kWh)' },
            // NOTE: "Import of Mobile Phones" (Proviso 2 Pt-II 1st Sch.) is
            // intentionally NOT a selectable option. Tax IS payable but
            // computed as fixed PKR amounts per C&F-value (USD) bracket and
            // CBU/CKD-SKD type, which the percentage-rate engine cannot
            // represent. Users should consult FBR specific-rate slabs. Same
            // exclusion rationale as §231B (Motor Vehicles).
          ],
        },
        {
          key: 'atlStatus',
          label: 'ATL Status',
          type: 'radio',
          required: true,
          options: [
            { value: 'ATL',     label: 'Active (Filer)' },
            { value: 'NON_ATL', label: 'Inactive (Non-Filer)' },
          ],
        },
      ],
      rules: [
        // FBR VALIDATED — Finance Act 2025 / TY2026
        { id: 'p25-148-12sch1-atl',      atlStatus: 'ATL',     taxpayerType: null, subType: 'TWELFTH_SCH_PART_I',             rate: 1,   rateLabel: '1% (ATL - Twelfth Schedule Part I, All Importers)',                priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-148-12sch1-non-atl',  atlStatus: 'NON_ATL', taxpayerType: null, subType: 'TWELFTH_SCH_PART_I',             rate: 2,   rateLabel: '2% (Non-ATL - Twelfth Schedule Part I, All Importers)',            priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-148-12sch2-comm-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'TWELFTH_SCH_PART_II_COMMERCIAL', rate: 3.5, rateLabel: '3.5% (ATL - Twelfth Schedule Part II, Commercial Importers)',      priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-148-12sch2-comm-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'TWELFTH_SCH_PART_II_COMMERCIAL', rate: 7,   rateLabel: '7% (Non-ATL - Twelfth Schedule Part II, Commercial Importers)',    priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-148-12sch2-other-atl',    atlStatus: 'ATL',     taxpayerType: null, subType: 'TWELFTH_SCH_PART_II_OTHER',      rate: 2,   rateLabel: '2% (ATL - Twelfth Schedule Part II, Other Importers)',             priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-148-12sch2-other-non-atl',atlStatus: 'NON_ATL', taxpayerType: null, subType: 'TWELFTH_SCH_PART_II_OTHER',      rate: 4,   rateLabel: '4% (Non-ATL - Twelfth Schedule Part II, Other Importers)',         priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-148-12sch3-comm-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'TWELFTH_SCH_PART_III_COMMERCIAL',rate: 6,   rateLabel: '6% (ATL - Twelfth Schedule Part III, Commercial Importers)',       priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-148-12sch3-comm-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'TWELFTH_SCH_PART_III_COMMERCIAL',rate: 12,  rateLabel: '12% (Non-ATL - Twelfth Schedule Part III, Commercial Importers)',  priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-148-12sch3-other-atl',    atlStatus: 'ATL',     taxpayerType: null, subType: 'TWELFTH_SCH_PART_III_OTHER',     rate: 5.5, rateLabel: '5.5% (ATL - Twelfth Schedule Part III, Other Importers)',          priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-148-12sch3-other-non-atl',atlStatus: 'NON_ATL', taxpayerType: null, subType: 'TWELFTH_SCH_PART_III_OTHER',     rate: 11,  rateLabel: '11% (Non-ATL - Twelfth Schedule Part III, Other Importers)',       priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-148-sro1125-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'SRO_1125_MANUFACTURERS',         rate: 1,   rateLabel: '1% (ATL - SRO 1125(I)/2011, Manufacturers)',                       priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-148-sro1125-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'SRO_1125_MANUFACTURERS',         rate: 2,   rateLabel: '2% (Non-ATL - SRO 1125(I)/2011, Manufacturers)',                   priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-148-medicines-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'MEDICINES_DRAP', rate: 4, rateLabel: '4% (ATL - Medicines Not Manufactured Locally, DRAP Certified)',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-148-medicines-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'MEDICINES_DRAP', rate: 8, rateLabel: '8% (Non-ATL - Medicines Not Manufactured Locally, DRAP Certified)', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-148-ev-ckd-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'EV_LCV_CKD_KITS', rate: 1, rateLabel: '1% (ATL - EV/LCV CKD Kits)',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-148-ev-ckd-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'EV_LCV_CKD_KITS', rate: 2, rateLabel: '2% (Non-ATL - EV/LCV CKD Kits)', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
      ],
    },

    {
      code: '149',
      displayOrder: 2,
      label: 'Section 149 - Salary',
      legalReference: 'Section 149 Income Tax Ordinance 2001',
      displayName: 'Salary',
      shortDescription: 'Salary and employment income',
      icon: '💼',
      category: 'Employment',
      requiresSlabComputation: true,
      transactionFields: [
        {
          key: 'monthlySalary',
          label: 'Monthly Salary (PKR)',
          type: 'number',
          placeholder: 'Enter monthly salary',
          required: true,
          amountField: true,
          frequencyTarget: 'frequency',
        },
        {
          key: 'frequency',
          label: 'Payment Frequency',
          type: 'frequency_select',
          required: true,
          lockedValue: 'MONTHLY',
          blocksSubmitIfEmpty: true,
        },
        {
          key: 'annualBonus',
          label: 'Annual Bonus (PKR)',
          type: 'number',
          placeholder: 'Enter annual bonus if any',
          required: false,
        },
        {
          key: 'otherAllowances',
          label: 'Other Monthly Allowances (PKR)',
          type: 'number',
          placeholder: 'Enter other monthly allowances',
          required: false,
        },
        {
          key: 'taxpayerType',
          label: 'Taxpayer Type',
          type: 'radio',
          required: true,
          lockedValue: 'INDIVIDUAL',
        },
        {
          key: 'subType',
          label: 'Income Type',
          type: 'select',
          required: false,
          options: [
            { value: 'NORMAL_SALARY', label: 'Normal Salary (default — progressive slabs)' },
            { value: 'PENSION',       label: 'Pension under Sec 149(1A) (≤Rs 10M nil; >Rs 10M & age <70: 5% on excess + 10% surcharge)' },
            { value: 'CONTINUATION',  label: 'Pension Continuation (former employer/associate — treated as salary)' },
          ],
        },
        {
          key: 'pensionerAge',
          label: 'Pensioner Age',
          type: 'number',
          placeholder: 'Enter age in years',
          required: false,
          visibleWhen: { field: 'subType', equals: 'PENSION' },
          helperText: 'Pension > Rs 10M attracts 5% + 10% surcharge only when pensioner age < 70.',
        },
      ],
      // FBR VALIDATED — Finance Act 2025. Verified per Track A remediation plan.
      // Arithmetic: 1%×600k=6k | 6k+11%×1M=116k | 116k+23%×1M=346k | 346k+30%×900k=616k
      slabs: [
        { from: 0,       to: 600000,  fixedTax: 0,      rate: 0,  label: 'Up to Rs. 600,000' },
        { from: 600001,  to: 1200000, fixedTax: 0,      rate: 1,  label: 'Rs. 600,001 to 1,200,000' },
        { from: 1200001, to: 2200000, fixedTax: 6000,   rate: 11, label: 'Rs. 1,200,001 to 2,200,000' },
        { from: 2200001, to: 3200000, fixedTax: 116000,  rate: 23, label: 'Rs. 2,200,001 to 3,200,000' },
        { from: 3200001, to: 4100000, fixedTax: 346000,  rate: 30, label: 'Rs. 3,200,001 to 4,100,000' },
        { from: 4100001, to: null,    fixedTax: 616000,  rate: 35, label: 'Above Rs. 4,100,000' },
      ],
      rules: [], // Handled via slabs
    },

    // ── Section 150 — Dividends ──────────────────────────────────────────────
    // FBR VALIDATED — Finance Act 2025 / TY2026. Source: FBR Withholding Income
    // Tax Rate Card (updated to 30 June 2025), Division I, Part III, First
    // Schedule, read with Rule 1 of the Tenth Schedule. "Bonus Shares" removed
    // (taxed under Sections 236M/236N, not 150 — was an incorrect category).
    // The rate card draws no distinction by recipient taxpayer type for these
    // categories, so no such field is presented. The proportional mutual-fund
    // rate (25%/15% split by debt vs equity investment ratio) is out of scope
    // — represented here by the "≥50% debt income" mutual-fund rate only.
    {
      code: '150',
      displayOrder: 3,
      label: 'Section 150 - Dividends',
      legalReference: 'Section 150 Income Tax Ordinance 2001',
      displayName: 'Dividends',
      shortDescription: 'Dividend payments',
      icon: '📈',
      category: 'Investment Income',
      transactionFields: [
        {
          key: 'dividendAmount',
          label: 'Dividend Amount (PKR)',
          type: 'number',
          placeholder: 'Enter dividend amount',
          required: true,
          amountField: true,
        },
        {
          key: 'subType',
          label: 'Dividend Type',
          type: 'select',
          required: true,
          options: [
            { value: 'GENERAL',        label: 'General Dividend (Listed Company / REIT / Other)' },
            { value: 'IPP',            label: 'Independent Power Purchaser (IPP) Dividend' },
            { value: 'MUTUAL_FUND',    label: 'Mutual Fund (≥50% Debt Income) Dividend' },
            { value: 'SPV_REIT',       label: 'Dividend to REIT Scheme from SPV' },
            { value: 'SPV_OTHER',      label: 'Dividend to Other Recipients from SPV (REIT)' },
            { value: 'EXEMPT_COMPANY', label: 'Dividend from Company with No Tax Payable (Exemption/Loss Carry-Forward/Tax Credit)' },
          ],
        },
        {
          key: 'atlStatus',
          label: 'ATL Status',
          type: 'radio',
          required: true,
          options: [
            { value: 'ATL',     label: 'Active (Filer)' },
            { value: 'NON_ATL', label: 'Inactive (Non-Filer)' },
          ],
        },
      ],
      rules: [
        { id: 'p25-150-general-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'GENERAL',        rate: 15, rateLabel: '15% (ATL Filer - General Dividend)',                priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-150-general-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'GENERAL',        rate: 30, rateLabel: '30% (Non-ATL - General Dividend)',                   priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-150-ipp-atl',         atlStatus: 'ATL',     taxpayerType: null, subType: 'IPP',            rate: 7.5, rateLabel: '7.5% (ATL Filer - IPP Dividend)',                   priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-150-ipp-non-atl',     atlStatus: 'NON_ATL', taxpayerType: null, subType: 'IPP',            rate: 15, rateLabel: '15% (Non-ATL - IPP Dividend)',                       priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-150-fund-atl',        atlStatus: 'ATL',     taxpayerType: null, subType: 'MUTUAL_FUND',    rate: 25, rateLabel: '25% (ATL Filer - Mutual Fund ≥50% Debt Income)', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-150-fund-non-atl',    atlStatus: 'NON_ATL', taxpayerType: null, subType: 'MUTUAL_FUND',    rate: 50, rateLabel: '50% (Non-ATL - Mutual Fund ≥50% Debt Income)',   priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-150-spv-reit-atl',    atlStatus: 'ATL',     taxpayerType: null, subType: 'SPV_REIT',       rate: 0,  rateLabel: '0% (ATL Filer - REIT Scheme Dividend from SPV)',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-150-spv-reit-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'SPV_REIT',      rate: 0,  rateLabel: '0% (Non-ATL - REIT Scheme Dividend from SPV)',       priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-150-spv-other-atl',   atlStatus: 'ATL',     taxpayerType: null, subType: 'SPV_OTHER',      rate: 35, rateLabel: '35% (ATL Filer - Dividend from SPV to Others)',      priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-150-spv-other-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'SPV_OTHER',    rate: 70, rateLabel: '70% (Non-ATL - Dividend from SPV to Others)',        priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-150-exempt-co-atl',   atlStatus: 'ATL',     taxpayerType: null, subType: 'EXEMPT_COMPANY', rate: 25, rateLabel: '25% (ATL Filer - Dividend from Exempt Company)',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-150-exempt-co-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'EXEMPT_COMPANY', rate: 50, rateLabel: '50% (Non-ATL - Dividend from Exempt Company)',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
      ],
    },

    // ── Section 151 — Profit on Debt ─────────────────────────────────────────
    // FBR VALIDATED — Finance Act 2025 / TY2026. Source: FBR Withholding Income
    // Tax Rate Card (updated to 30 June 2025), Division IA & IB, Part III,
    // First Schedule, read with Rule 1 of the Tenth Schedule.
    // GOVT_SEC rate depends on recipient taxpayer type (Division-IA(b) for
    // non-individuals 20%/40% vs. Division-IA(c) "other cases" 15%/30% for
    // individuals). SUKUK (Division-IB, s.151(1A)) added as a previously
    // missing category — rate depends on holder type (company vs.
    // individual/AOP) and, for individual/AOP holders, whether the return on
    // investment exceeds Rs. 1,000,000. These derived sub-categories
    // (GOVT_SEC_INDIVIDUAL/GOVT_SEC_OTHER/SUKUK_*) are computed in engine.ts
    // from the user-selected Instrument Type + Taxpayer Type + amount.
    {
      code: '151',
      displayOrder: 4,
      label: 'Section 151 - Profit on Debt',
      legalReference: 'Section 151 Income Tax Ordinance 2001',
      displayName: 'Profit on Debt',
      shortDescription: 'Bank profit, debt securities and profit income',
      icon: '🏦',
      category: 'Investment Income',
      transactionFields: [
        {
          key: 'profitAmount',
          label: 'Profit Amount (PKR)',
          type: 'number',
          placeholder: 'Enter profit on debt amount',
          required: true,
          amountField: true,
          helperText: 'For Sukuk held by an Individual/AOP, the rate depends on whether this amount exceeds Rs 1,000,000.',
        },
        {
          key: 'subType',
          label: 'Instrument Type',
          type: 'select',
          required: true,
          options: [
            { value: 'BANK',     label: 'Bank Account/Deposit' },
            { value: 'NSSF',     label: 'National Savings Scheme (NSSF)' },
            { value: 'GOVT_SEC', label: 'Government Security' },
            { value: 'SUKUK',    label: 'Sukuk (Section 151(1A))' },
          ],
        },
        {
          key: 'atlStatus',
          label: 'ATL Status',
          type: 'radio',
          required: true,
          options: [
            { value: 'ATL',     label: 'Active (Filer)' },
            { value: 'NON_ATL', label: 'Inactive (Non-Filer)' },
          ],
        },
        {
          key: 'taxpayerType',
          label: 'Taxpayer Type',
          type: 'radio',
          required: true,
          options: [
            { value: 'INDIVIDUAL', label: 'Individual' },
            { value: 'AOP',        label: 'Association of Persons (AOP)' },
            { value: 'COMPANY',    label: 'Company' },
          ],
        },
      ],
      rules: [
        { id: 'p25-151-bank-atl',           atlStatus: 'ATL',     taxpayerType: null, subType: 'BANK',              rate: 20,   rateLabel: '20% (ATL Filer - Bank Deposit)',                          priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-151-bank-non-atl',       atlStatus: 'NON_ATL', taxpayerType: null, subType: 'BANK',              rate: 40,   rateLabel: '40% (Non-ATL - Bank Deposit)',                            priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-151-nssf-ind-atl',       atlStatus: 'ATL',     taxpayerType: null, subType: 'NSSF_INDIVIDUAL',   rate: 15,   rateLabel: '15% (ATL Filer - NSSF, Individual)',                      priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-151-nssf-ind-non-atl',   atlStatus: 'NON_ATL', taxpayerType: null, subType: 'NSSF_INDIVIDUAL',   rate: 30,   rateLabel: '30% (Non-ATL - NSSF, Individual)',                        priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-151-nssf-other-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'NSSF_OTHER',        rate: 20,   rateLabel: '20% (ATL Filer - NSSF, Non-Individual)',                  priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-151-nssf-other-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'NSSF_OTHER',        rate: 40,   rateLabel: '40% (Non-ATL - NSSF, Non-Individual)',                    priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-151-govt-ind-atl',       atlStatus: 'ATL',     taxpayerType: null, subType: 'GOVT_SEC_INDIVIDUAL', rate: 15, rateLabel: '15% (ATL Filer - Gov Security, Individual)',             priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-151-govt-ind-non-atl',   atlStatus: 'NON_ATL', taxpayerType: null, subType: 'GOVT_SEC_INDIVIDUAL', rate: 30, rateLabel: '30% (Non-ATL - Gov Security, Individual)',               priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-151-govt-other-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'GOVT_SEC_OTHER',    rate: 20,   rateLabel: '20% (ATL Filer - Gov Security, Non-Individual)',          priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-151-govt-other-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'GOVT_SEC_OTHER',    rate: 40,   rateLabel: '40% (Non-ATL - Gov Security, Non-Individual)',            priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-151-sukuk-co-atl',       atlStatus: 'ATL',     taxpayerType: null, subType: 'SUKUK_COMPANY',     rate: 25,   rateLabel: '25% (ATL Filer - Sukuk, Company Holder)',                 priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-151-sukuk-co-non-atl',   atlStatus: 'NON_ATL', taxpayerType: null, subType: 'SUKUK_COMPANY',     rate: 50,   rateLabel: '50% (Non-ATL - Sukuk, Company Holder)',                   priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-151-sukuk-gt1m-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'SUKUK_IND_GT1M',    rate: 12.5, rateLabel: '12.5% (ATL Filer - Sukuk, Individual/AOP > Rs 1M)',      priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-151-sukuk-gt1m-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'SUKUK_IND_GT1M',    rate: 25,   rateLabel: '25% (Non-ATL - Sukuk, Individual/AOP > Rs 1M)',           priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-151-sukuk-le1m-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'SUKUK_IND_LE1M',    rate: 10,   rateLabel: '10% (ATL Filer - Sukuk, Individual/AOP ≤ Rs 1M)',    priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-151-sukuk-le1m-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'SUKUK_IND_LE1M',    rate: 20,   rateLabel: '20% (Non-ATL - Sukuk, Individual/AOP ≤ Rs 1M)',      priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
      ],
    },

    // ── Section 152 — Payments to Non-Residents (Phase 1: domestic rates) ──
    // FBR VALIDATED — Finance Act 2025 / TY2026. Source: FBR Withholding
    // Income Tax Rate Card (updated to 30 June 2025), cross-checked against
    // Income Tax Ordinance 2001 s.152.
    // SCOPE: domestic-law flat rates only. Double Tax Treaty (DTT) overrides,
    // country-specific rates, beneficial-ownership tests, and Permanent
    // Establishment (PE) analysis are NOT modeled — out of scope for Phase 1.
    // s.152(1BA) (PE sale of goods/services/contracts, flat 20%) and
    // s.152(1D)/(1DA) (capital gain on debt/other securities by non-resident
    // SCRA holders, flat 10%, single rate regardless of holding period) added
    // 10 Jun 2026 — single flat rates, fit the existing no-ATL-split pattern.
    // Still excluded: s.152(2)/(2A) (general PE payment categories — require
    // a dedicated PE-status field and overlap with §153 categories) and
    // s.152(1DB) (non-resident sukuk — taxpayer-type + Rs.1M threshold,
    // mirrors §151 Sukuk; deferred, requires engine subType-derivation
    // addition analogous to §151).
    // No ATL/Non-ATL split — rate card lists single rates for these
    // categories (final/minimum tax on non-resident payments).
    {
      code: '152',
      displayOrder: 5,
      label: 'Section 152 - Payments to Non-Residents',
      legalReference: 'Section 152 Income Tax Ordinance 2001',
      displayName: 'Payments to Non-Residents',
      shortDescription: 'Royalty, technical services, offshore digital services, non-resident contracts and related payments',
      icon: '🌍',
      category: 'Non-Resident Payments',
      transactionFields: [
        {
          key: 'paymentAmount',
          label: 'Payment Amount (PKR)',
          type: 'number',
          placeholder: 'Enter gross payment amount to non-resident',
          required: true,
          amountField: true,
          helperText: 'For 152(1DB) Sukuk by non-resident: rate depends on Taxpayer Type and whether ROI exceeds Rs 1,000,000.',
        },
        {
          key: 'subType',
          label: 'Payment Category',
          type: 'select',
          required: true,
          options: [
            { value: 'ROYALTY_FTS', label: 'Royalty / Fee for Technical Services - Sec 152(1)' },
            { value: 'CONSTRUCTION_CONTRACTS', label: 'Construction, Assembly, Installation or Supervisory Activity Contracts - Sec 152(1A)' },
            { value: 'INSURANCE_PREMIUM', label: 'Insurance / Re-Insurance Premium - Sec 152(1AA)' },
            { value: 'ADVERTISEMENT_NR_MEDIA', label: 'Advertisement Services by Non-Resident Media - Sec 152(1AAA)' },
            { value: 'OFFSHORE_DIGITAL_SERVICES', label: 'Offshore Digital Services (Banking Channel Remittance) - Sec 152(1C)' },
            { value: 'PE_GOODS_SERVICES_CONTRACTS', label: 'Sale of Goods/Services/Contracts via PE of Non-Resident - Sec 152(1BA)' },
            { value: 'DEBT_SECURITIES_GAIN', label: 'Capital Gain on Debt Securities (Non-Resident, SCRA) - Sec 152(1D)' },
            { value: 'OTHER_SECURITIES_GAIN', label: 'Capital Gain on Other Securities (Non-Resident, SCRA) - Sec 152(1DA)' },
            { value: 'SUKUK_NR', label: 'Sukuk Issued to Non-Resident - Sec 152(1DB)' },
            { value: 'PE_PAYMENT_COMPANY', label: 'PE Sale of Goods (Company) - Sec 152(2A)(a)' },
            { value: 'PE_PAYMENT_OTHER',   label: 'PE Sale of Goods (Other than Company) - Sec 152(2A)(a)' },
            { value: 'PE_IT_ITES',         label: 'PE Services - IT / IT-enabled - Sec 152(2A)(b)' },
            { value: 'PE_OTHER_SERVICES',  label: 'PE Services - Other than IT/ITeS - Sec 152(2A)(b)' },
            { value: 'PE_SPORTSPERSON',    label: 'PE Contract Execution - Sportspersons - Sec 152(2A)(c)' },
            { value: 'PE_OTHER_CONTRACTS', label: 'PE Contract Execution - Other than Sportspersons - Sec 152(2A)(c)' },
          ],
        },
        {
          key: 'atlStatus',
          label: 'ATL Status (used by 152(2A) categories)',
          type: 'radio',
          required: true,
          options: [
            { value: 'ATL',     label: 'Active (Filer)' },
            { value: 'NON_ATL', label: 'Inactive (Non-Filer)' },
          ],
        },
        {
          key: 'taxpayerType',
          label: 'Taxpayer Type (used by 152(1DB) Sukuk)',
          type: 'radio',
          required: true,
          options: [
            { value: 'INDIVIDUAL', label: 'Individual' },
            { value: 'AOP',        label: 'Association of Persons (AOP)' },
            { value: 'COMPANY',    label: 'Company' },
          ],
        },
      ],
      rules: [
        // Single-rate categories (atlStatus null, taxpayerType null — match any)
        { id: 'p25-152-royalty-fts',  atlStatus: null, taxpayerType: null, subType: 'ROYALTY_FTS',              rate: 15, rateLabel: '15% (Royalty / Fee for Technical Services - Sec 152(1))',                    priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-152-construction', atlStatus: null, taxpayerType: null, subType: 'CONSTRUCTION_CONTRACTS',   rate: 7,  rateLabel: '7% (Minimum Tax - Construction/Assembly/Installation/Supervisory Contracts - Sec 152(1A))', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-152-insurance',    atlStatus: null, taxpayerType: null, subType: 'INSURANCE_PREMIUM',        rate: 5,  rateLabel: '5% (Minimum Tax - Insurance/Re-Insurance Premium - Sec 152(1AA))',              priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-152-advertisement',atlStatus: null, taxpayerType: null, subType: 'ADVERTISEMENT_NR_MEDIA',   rate: 10, rateLabel: '10% (Minimum Tax - Advertisement Services by Non-Resident Media - Sec 152(1AAA))', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-152-offshore-digital', atlStatus: null, taxpayerType: null, subType: 'OFFSHORE_DIGITAL_SERVICES', rate: 10, rateLabel: '10% (Offshore Digital Services, Banking Channel Remittance - Sec 152(1C))', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-152-pe-goods-services', atlStatus: null, taxpayerType: null, subType: 'PE_GOODS_SERVICES_CONTRACTS', rate: 20, rateLabel: '20% (Sale of Goods/Services/Contracts via PE of Non-Resident - Sec 152(1BA))', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-152-debt-sec-gain', atlStatus: null, taxpayerType: null, subType: 'DEBT_SECURITIES_GAIN',     rate: 10, rateLabel: '10% (Capital Gain on Debt Securities, Non-Resident SCRA - Sec 152(1D))',       priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-152-other-sec-gain', atlStatus: null, taxpayerType: null, subType: 'OTHER_SECURITIES_GAIN',   rate: 10, rateLabel: '10% (Capital Gain on Other Securities, Non-Resident SCRA - Sec 152(1DA))',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        // 152(2A)(a) PE sale of goods — Company 5/10, Other 5.5/11
        { id: 'p25-152-pe-comp-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'PE_PAYMENT_COMPANY', rate: 5,    rateLabel: '5% (ATL - PE Sale of Goods, Company - Sec 152(2A)(a))',         priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-152-pe-comp-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'PE_PAYMENT_COMPANY', rate: 10,   rateLabel: '10% (Non-ATL - PE Sale of Goods, Company - Sec 152(2A)(a))',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-152-pe-other-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'PE_PAYMENT_OTHER',  rate: 5.5,  rateLabel: '5.5% (ATL - PE Sale of Goods, Other than Company - Sec 152(2A)(a))',   priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-152-pe-other-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'PE_PAYMENT_OTHER',  rate: 11,   rateLabel: '11% (Non-ATL - PE Sale of Goods, Other than Company - Sec 152(2A)(a))', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        // 152(2A)(b) Services — IT/ITeS 4/8, Other 8/16
        { id: 'p25-152-pe-it-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'PE_IT_ITES',        rate: 4,  rateLabel: '4% (ATL - PE IT/ITeS Services - Sec 152(2A)(b))',         priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-152-pe-it-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'PE_IT_ITES',        rate: 8,  rateLabel: '8% (Non-ATL - PE IT/ITeS Services - Sec 152(2A)(b))',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-152-pe-svc-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'PE_OTHER_SERVICES', rate: 8,  rateLabel: '8% (ATL - PE Other Services - Sec 152(2A)(b))',           priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-152-pe-svc-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'PE_OTHER_SERVICES', rate: 16, rateLabel: '16% (Non-ATL - PE Other Services - Sec 152(2A)(b))',       priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        // 152(2A)(c) Contracts — Sportsperson 15/30, Other 8/16
        { id: 'p25-152-pe-sport-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'PE_SPORTSPERSON',    rate: 15, rateLabel: '15% (ATL - PE Contracts, Sportsperson - Sec 152(2A)(c))',         priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-152-pe-sport-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'PE_SPORTSPERSON',    rate: 30, rateLabel: '30% (Non-ATL - PE Contracts, Sportsperson - Sec 152(2A)(c))',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-152-pe-cont-atl',      atlStatus: 'ATL',     taxpayerType: null, subType: 'PE_OTHER_CONTRACTS', rate: 8,  rateLabel: '8% (ATL - PE Contracts, Other - Sec 152(2A)(c))',                priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-152-pe-cont-non-atl',  atlStatus: 'NON_ATL', taxpayerType: null, subType: 'PE_OTHER_CONTRACTS', rate: 16, rateLabel: '16% (Non-ATL - PE Contracts, Other - Sec 152(2A)(c))',           priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        // 152(1DB) Sukuk by non-resident — derived sub-categories (engine routes SUKUK_NR → these)
        { id: 'p25-152-sukuk-nr-comp',   atlStatus: null, taxpayerType: null, subType: 'SUKUK_NR_COMPANY',   rate: 25,   rateLabel: '25% (Sukuk, Non-Resident Company Holder - Sec 152(1DB)(a))',       priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-152-sukuk-nr-gt1m',   atlStatus: null, taxpayerType: null, subType: 'SUKUK_NR_IND_GT1M', rate: 12.5, rateLabel: '12.5% (Sukuk, Non-Resident Individual/AOP > Rs 1M - Sec 152(1DB)(b))', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-152-sukuk-nr-le1m',   atlStatus: null, taxpayerType: null, subType: 'SUKUK_NR_IND_LE1M', rate: 10,   rateLabel: '10% (Sukuk, Non-Resident Individual/AOP ≤ Rs 1M - Sec 152(1DB)(c))',    priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
      ],
    },

    // ── Section 153(1)(a) — Supply of Goods ──────────────────────────────────
    // FBR VALIDATED — Finance Act 2025 (Track B, B1)
    {
      code: '153a',
      displayOrder: 6,
      label: 'Section 153(1)(a) - Supply of Goods',
      legalReference: 'Section 153(1)(a) Income Tax Ordinance 2001',
      displayName: 'Supply of Goods',
      shortDescription: 'Purchase and supply of goods',
      icon: '🛒',
      category: 'Goods & Services',
      thresholds: [
        { minimumAmount: 75000, note: 'WHT not applicable if aggregate annual payments to this person are below PKR 75,000 in the year' },
      ],
      transactionFields: [
        {
          key: 'paymentAmount',
          label: 'Payment Amount (PKR)',
          type: 'number',
          placeholder: 'Enter gross payment amount',
          required: true,
          amountField: true,
          helperText: 'WHT exemption applies if total annual payments to this person under this section are below PKR 75,000.',
        },
        {
          key: 'subType',
          label: 'Goods Category',
          type: 'select',
          required: true,
          options: [
            { value: 'OTHER_GOODS',         label: 'Other Goods (General Supply)' },
            { value: 'TOLL_MANUFACTURING',  label: 'Toll Manufacturing' },
            { value: 'DISTRIBUTOR_SPECIAL', label: 'Distributor / Dealer / Wholesaler (FMCG/Fertilizer/Electronics/Sugar/Cement/Steel — Sales Tax ATL required)' },
            { value: 'YARN_TRADER',         label: 'Yarn Trader (Supplies to Textile/Leather/Sports Sectors)' },
            { value: 'CIGARETTE',           label: 'Cigarettes (by Distributors)' },
            { value: 'PHARMA',              label: 'Pharmaceutical Products (by Distributors)' },
            { value: 'AGRI_COMMODITY',      label: 'Agricultural Commodity (Rice / Cotton Seed / Edible Oils)' },
            { value: 'TEXTILE_SECTOR',      label: 'Textile / Leather / Sports Sector Taxpayer' },
            { value: 'GOLD_SILVER',         label: 'Gold, Silver & Articles Thereof' },
          ],
        },
        {
          key: 'atlStatus',
          label: 'ATL Status',
          type: 'radio',
          required: true,
          options: [
            { value: 'ATL',     label: 'Active (Filer)' },
            { value: 'NON_ATL', label: 'Inactive (Non-Filer)' },
          ],
        },
        {
          key: 'taxpayerType',
          label: 'Taxpayer Type',
          type: 'radio',
          required: true,
          options: [
            { value: 'INDIVIDUAL', label: 'Individual / AOP' },
            { value: 'COMPANY',    label: 'Company' },
          ],
        },
      ],
      rules: [
        // Other Goods — FBR VALIDATED Finance Act 2025
        { id: 'p25-153a-other-comp-atl',     atlStatus: 'ATL',     taxpayerType: 'COMPANY',    subType: 'OTHER_GOODS',         rate: 5,    rateLabel: '5% (ATL Company - Other Goods)',                    priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153a-other-comp-non-atl', atlStatus: 'NON_ATL', taxpayerType: 'COMPANY',    subType: 'OTHER_GOODS',         rate: 10,   rateLabel: '10% (Non-ATL Company - Other Goods)',               priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153a-other-ind-atl',      atlStatus: 'ATL',     taxpayerType: 'INDIVIDUAL', subType: 'OTHER_GOODS',         rate: 5.5,  rateLabel: '5.5% (ATL Individual/AOP - Other Goods)',           priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153a-other-ind-non-atl',  atlStatus: 'NON_ATL', taxpayerType: 'INDIVIDUAL', subType: 'OTHER_GOODS',         rate: 11,   rateLabel: '11% (Non-ATL Individual/AOP - Other Goods)',        priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153a-other-aop-atl',      atlStatus: 'ATL',     taxpayerType: 'AOP',        subType: 'OTHER_GOODS',         rate: 5.5,  rateLabel: '5.5% (ATL Individual/AOP - Other Goods)',           priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153a-other-aop-non-atl',  atlStatus: 'NON_ATL', taxpayerType: 'AOP',        subType: 'OTHER_GOODS',         rate: 11,   rateLabel: '11% (Non-ATL Individual/AOP - Other Goods)',        priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        // Toll Manufacturing — FBR VALIDATED Finance Act 2025
        { id: 'p25-153a-toll-comp-atl',      atlStatus: 'ATL',     taxpayerType: 'COMPANY',    subType: 'TOLL_MANUFACTURING',  rate: 9,    rateLabel: '9% (ATL Company - Toll Manufacturing)',             priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153a-toll-comp-non-atl',  atlStatus: 'NON_ATL', taxpayerType: 'COMPANY',    subType: 'TOLL_MANUFACTURING',  rate: 18,   rateLabel: '18% (Non-ATL Company - Toll Manufacturing)',        priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153a-toll-ind-atl',       atlStatus: 'ATL',     taxpayerType: 'INDIVIDUAL', subType: 'TOLL_MANUFACTURING',  rate: 11,   rateLabel: '11% (ATL Individual/AOP - Toll Manufacturing)',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153a-toll-ind-non-atl',   atlStatus: 'NON_ATL', taxpayerType: 'INDIVIDUAL', subType: 'TOLL_MANUFACTURING',  rate: 22,   rateLabel: '22% (Non-ATL Individual/AOP - Toll Manufacturing)', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153a-toll-aop-atl',       atlStatus: 'ATL',     taxpayerType: 'AOP',        subType: 'TOLL_MANUFACTURING',  rate: 11,   rateLabel: '11% (ATL Individual/AOP - Toll Manufacturing)',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153a-toll-aop-non-atl',   atlStatus: 'NON_ATL', taxpayerType: 'AOP',        subType: 'TOLL_MANUFACTURING',  rate: 22,   rateLabel: '22% (Non-ATL Individual/AOP - Toll Manufacturing)', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        // Special commodity categories — null taxpayerType applies uniformly
        { id: 'p25-153a-dist-atl',           atlStatus: 'ATL',     taxpayerType: null,         subType: 'DISTRIBUTOR_SPECIAL', rate: 0.25, rateLabel: '0.25% (ATL - Distributor/Dealer/Wholesaler)',       priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153a-dist-non-atl',       atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'DISTRIBUTOR_SPECIAL', rate: 0.5,  rateLabel: '0.5% (Non-ATL - Distributor/Dealer/Wholesaler)',    priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153a-yarn-atl',           atlStatus: 'ATL',     taxpayerType: null,         subType: 'YARN_TRADER',         rate: 0.5,  rateLabel: '0.5% (ATL - Yarn Trader)',                          priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153a-yarn-non-atl',       atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'YARN_TRADER',         rate: 1,    rateLabel: '1% (Non-ATL - Yarn Trader)',                        priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153a-cig-atl',            atlStatus: 'ATL',     taxpayerType: null,         subType: 'CIGARETTE',           rate: 2.5,  rateLabel: '2.5% (ATL - Cigarettes)',                           priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153a-cig-non-atl',        atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'CIGARETTE',           rate: 5,    rateLabel: '5% (Non-ATL - Cigarettes)',                         priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153a-pharma-atl',         atlStatus: 'ATL',     taxpayerType: null,         subType: 'PHARMA',              rate: 1,    rateLabel: '1% (ATL - Pharmaceutical Products)',                priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153a-pharma-non-atl',     atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'PHARMA',              rate: 2,    rateLabel: '2% (Non-ATL - Pharmaceutical Products)',            priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153a-agri-atl',           atlStatus: 'ATL',     taxpayerType: null,         subType: 'AGRI_COMMODITY',      rate: 1.5,  rateLabel: '1.5% (ATL - Agricultural Commodity)',               priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153a-agri-non-atl',       atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'AGRI_COMMODITY',      rate: 3,    rateLabel: '3% (Non-ATL - Agricultural Commodity)',             priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        // Textile/Leather/Sports sector — FBR VALIDATED Finance Act 2025 (TAGCO TY2026)
        { id: 'p25-153a-textile-atl',        atlStatus: 'ATL',     taxpayerType: null,         subType: 'TEXTILE_SECTOR',      rate: 1,    rateLabel: '1% (ATL - Textile/Leather/Sports Sector)',          priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153a-textile-non-atl',    atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'TEXTILE_SECTOR',      rate: 2,    rateLabel: '2% (Non-ATL - Textile/Leather/Sports Sector)',      priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        // Gold, silver and articles thereof — FBR VALIDATED Finance Act 2025 (TAGCO TY2026)
        { id: 'p25-153a-gold-atl',           atlStatus: 'ATL',     taxpayerType: null,         subType: 'GOLD_SILVER',         rate: 1,    rateLabel: '1% (ATL - Gold, Silver & Articles)',                priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153a-gold-non-atl',       atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'GOLD_SILVER',         rate: 2,    rateLabel: '2% (Non-ATL - Gold, Silver & Articles)',            priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
      ],
    },

    // ── Section 153(1)(b) — Provision of Services ─────────────────────────────
    // FBR VALIDATED — Finance Act 2025 (Track B, B1)
    {
      code: '153b',
      displayOrder: 7,
      label: 'Section 153(1)(b) - Provision of Services',
      legalReference: 'Section 153(1)(b) Income Tax Ordinance 2001',
      displayName: 'Provision of Services',
      shortDescription: 'Services provided in Pakistan',
      icon: '🧾',
      category: 'Goods & Services',
      thresholds: [
        { minimumAmount: 30000, note: 'WHT not applicable if gross services payments are under PKR 30,000 in the year' },
      ],
      transactionFields: [
        {
          key: 'paymentAmount',
          label: 'Payment Amount (PKR)',
          type: 'number',
          placeholder: 'Enter gross payment amount',
          required: true,
          amountField: true,
          helperText: 'WHT exemption applies if total payments under this section are below PKR 30,000 in the year.',
        },
        {
          key: 'subType',
          label: 'Service Category',
          type: 'select',
          required: true,
          options: [
            { value: 'SPECIFIED',                 label: 'Specified Services' },
            { value: 'IT_ITES',                   label: 'IT / ITES Services' },
            { value: 'PRINT_MEDIA',               label: 'Print / Electronic Media' },
            { value: 'EXPORTER_SERVICES',         label: 'Services Rendered to Exporters (Stitching/Dyeing/Printing/Embroidery/Washing/Sizing/Weaving) — Cl. 11A Pt-IV 2nd Sch.' },
            { value: 'SPECIFIED_SECTOR_SERVICES', label: 'Services by Specified Sector Taxpayer (Textile/Carpets/Leather/Artificial Leather/Footwear/Surgical/Sports Goods) — Cl. 9A Pt-II 2nd Sch.' },
            { value: 'OTHER_SERVICES',            label: 'Other Services' },
          ],
        },
        {
          key: 'atlStatus',
          label: 'ATL Status',
          type: 'radio',
          required: true,
          options: [
            { value: 'ATL',     label: 'Active (Filer)' },
            { value: 'NON_ATL', label: 'Inactive (Non-Filer)' },
          ],
        },
        {
          key: 'taxpayerType',
          label: 'Taxpayer Type',
          type: 'radio',
          required: true,
          options: [
            { value: 'INDIVIDUAL', label: 'Individual / AOP' },
            { value: 'COMPANY',    label: 'Company' },
          ],
        },
      ],
      rules: [
        // All service tiers use null taxpayerType (uniform across company/individual/AOP)
        // FBR VALIDATED — Finance Act 2025 (Track B, B1)
        { id: 'p25-153b-spec-atl',      atlStatus: 'ATL',     taxpayerType: null, subType: 'SPECIFIED',      rate: 6,   rateLabel: '6% (ATL - Specified Services)',          priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153b-spec-non-atl',  atlStatus: 'NON_ATL', taxpayerType: null, subType: 'SPECIFIED',      rate: 12,  rateLabel: '12% (Non-ATL - Specified Services)',      priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153b-it-atl',        atlStatus: 'ATL',     taxpayerType: null, subType: 'IT_ITES',        rate: 4,   rateLabel: '4% (ATL - IT/ITES Services)',             priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153b-it-non-atl',    atlStatus: 'NON_ATL', taxpayerType: null, subType: 'IT_ITES',        rate: 8,   rateLabel: '8% (Non-ATL - IT/ITES Services)',         priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153b-media-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'PRINT_MEDIA',    rate: 1.5, rateLabel: '1.5% (ATL - Print/Electronic Media)',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153b-media-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'PRINT_MEDIA',    rate: 3,   rateLabel: '3% (Non-ATL - Print/Electronic Media)',   priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153b-other-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'OTHER_SERVICES', rate: 15,  rateLabel: '15% (ATL - Other Services)',              priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153b-other-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'OTHER_SERVICES', rate: 30,  rateLabel: '30% (Non-ATL - Other Services)',          priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        // Services rendered to exporters — Cl. 11A Pt-IV 2nd Sch. (1%/2%)
        { id: 'p25-153b-exporter-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'EXPORTER_SERVICES',         rate: 1, rateLabel: '1% (ATL - Services Rendered to Exporters, Cl. 11A Pt-IV 2nd Sch.)',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153b-exporter-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'EXPORTER_SERVICES',         rate: 2, rateLabel: '2% (Non-ATL - Services Rendered to Exporters, Cl. 11A Pt-IV 2nd Sch.)', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        // Services by specified sectors — Cl. 9A Pt-II 2nd Sch. (1%/2%)
        { id: 'p25-153b-spec-sector-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'SPECIFIED_SECTOR_SERVICES', rate: 1, rateLabel: '1% (ATL - Specified Sector Services, Cl. 9A Pt-II 2nd Sch.)',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153b-spec-sector-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'SPECIFIED_SECTOR_SERVICES', rate: 2, rateLabel: '2% (Non-ATL - Specified Sector Services, Cl. 9A Pt-II 2nd Sch.)', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
      ],
    },

    // ── Section 153(1)(c) — Execution of Contracts ────────────────────────────
    // FBR VALIDATED — Finance Act 2025 (Track A + Track B, B1)
    {
      code: '153c',
      displayOrder: 8,
      label: 'Section 153(1)(c) - Execution of Contracts',
      legalReference: 'Section 153(1)(c) Income Tax Ordinance 2001',
      displayName: 'Execution of Contracts',
      shortDescription: 'Works contracts and contract payments',
      icon: '🏗️',
      category: 'Goods & Services',
      transactionFields: [
        {
          key: 'paymentAmount',
          label: 'Payment Amount (PKR)',
          type: 'number',
          placeholder: 'Enter gross payment amount',
          required: true,
          amountField: true,
        },
        {
          key: 'subType',
          label: 'Contract Type',
          type: 'select',
          required: true,
          options: [
            { value: 'STANDARD',     label: 'Standard Contract' },
            { value: 'SPORTSPERSON', label: 'Sportsperson / Athlete' },
          ],
        },
        {
          key: 'atlStatus',
          label: 'ATL Status',
          type: 'radio',
          required: true,
          options: [
            { value: 'ATL',     label: 'Active (Filer)' },
            { value: 'NON_ATL', label: 'Inactive (Non-Filer)' },
          ],
        },
        {
          key: 'taxpayerType',
          label: 'Taxpayer Type',
          type: 'radio',
          required: true,
          options: [
            { value: 'INDIVIDUAL', label: 'Individual / AOP' },
            { value: 'COMPANY',    label: 'Company' },
          ],
        },
      ],
      rules: [
        // Sportsperson — null taxpayerType (uniform)
        { id: 'p25-153c-sport-atl',      atlStatus: 'ATL',     taxpayerType: null,         subType: 'SPORTSPERSON', rate: 15,  rateLabel: '15% (ATL - Sportsperson)',                         priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153c-sport-non-atl',  atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'SPORTSPERSON', rate: 30,  rateLabel: '30% (Non-ATL - Sportsperson)',                      priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        // Standard Contracts — FBR VALIDATED Finance Act 2025 (Track A)
        { id: 'p25-153c-std-comp-atl',    atlStatus: 'ATL',     taxpayerType: 'COMPANY',    subType: 'STANDARD',     rate: 7.5, rateLabel: '7.5% (ATL Company - Standard Contract)',           priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153c-std-comp-non-atl',atlStatus: 'NON_ATL', taxpayerType: 'COMPANY',    subType: 'STANDARD',     rate: 15,  rateLabel: '15% (Non-ATL Company - Standard Contract)',         priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153c-std-ind-atl',     atlStatus: 'ATL',     taxpayerType: 'INDIVIDUAL', subType: 'STANDARD',     rate: 8,   rateLabel: '8% (ATL Individual/AOP - Standard Contract)',      priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153c-std-ind-non-atl', atlStatus: 'NON_ATL', taxpayerType: 'INDIVIDUAL', subType: 'STANDARD',     rate: 16,  rateLabel: '16% (Non-ATL Individual/AOP - Standard Contract)', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153c-std-aop-atl',     atlStatus: 'ATL',     taxpayerType: 'AOP',        subType: 'STANDARD',     rate: 8,   rateLabel: '8% (ATL Individual/AOP - Standard Contract)',      priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-153c-std-aop-non-atl', atlStatus: 'NON_ATL', taxpayerType: 'AOP',        subType: 'STANDARD',     rate: 16,  rateLabel: '16% (Non-ATL Individual/AOP - Standard Contract)', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
      ],
    },

    // ── Section 153(2A) — Digital Transactions (E-Commerce) ──────────────────
    // FBR VALIDATED — Finance Act 2025 (Track B1 remediation). Rates confirmed per
    // FBR official WHT Rate Card; section reference is §153(2A) ITO 2001 / Div-III Pt-III First Sch.
    {
      code: '6a',
      displayOrder: 9,
      label: 'Section 153(2A) - Digital Transactions',
      legalReference: 'Section 153(2A) Income Tax Ordinance 2001',
      displayName: 'Digital Transactions',
      shortDescription: 'Digital and e-commerce transactions',
      icon: '🌐',
      category: 'Goods & Services',
      transactionFields: [
        {
          key: 'paymentAmount',
          label: 'Payment Amount (PKR)',
          type: 'number',
          placeholder: 'Enter gross payment amount',
          required: true,
          amountField: true,
        },
        {
          key: 'subType',
          label: 'Transaction Type',
          type: 'select',
          required: true,
          options: [
            { value: 'DIGITAL_PAYMENT', label: 'Digital Payment (non-cash)' },
            { value: 'COD',             label: 'Cash on Delivery (COD)' },
          ],
        },
        {
          key: 'atlStatus',
          label: 'ATL Status',
          type: 'radio',
          required: true,
          options: [
            { value: 'ATL',     label: 'Active (Filer)' },
            { value: 'NON_ATL', label: 'Inactive (Non-Filer)' },
          ],
        },
      ],
      rules: [
        // No taxpayerType differentiation for digital transactions
        { id: 'p25-6a-digital-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'DIGITAL_PAYMENT', rate: 1, rateLabel: '1% (ATL - Digital Payment)',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-6a-digital-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'DIGITAL_PAYMENT', rate: 2, rateLabel: '2% (Non-ATL - Digital Payment)', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-6a-cod-atl',         atlStatus: 'ATL',     taxpayerType: null, subType: 'COD',             rate: 2, rateLabel: '2% (ATL - Cash on Delivery)',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-6a-cod-non-atl',     atlStatus: 'NON_ATL', taxpayerType: null, subType: 'COD',             rate: 4, rateLabel: '4% (Non-ATL - Cash on Delivery)', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
      ],
    },

    {
      code: '155',
      displayOrder: 12,
      label: 'Section 155 - Rent of Immovable Property',
      legalReference: 'Section 155 Income Tax Ordinance 2001',
      displayName: 'Rent',
      shortDescription: 'Rent of immovable property',
      icon: '🏠',
      category: 'Property',
      transactionFields: [
        {
          key: 'rentAmount',
          label: 'Rent Amount (PKR)',
          type: 'number',
          placeholder: 'Enter rent amount',
          required: true,
          amountField: true,
          frequencyTarget: 'frequency',
        },
        {
          key: 'frequency',
          label: 'Payment Frequency',
          type: 'frequency_select',
          required: true,
          blocksSubmitIfEmpty: true,
        },
        {
          key: 'atlStatus',
          label: 'ATL Status',
          type: 'radio',
          required: true,
          options: [
            { value: 'ATL',     label: 'Active (Filer)' },
            { value: 'NON_ATL', label: 'Inactive (Non-Filer)' },
          ],
        },
        {
          key: 'taxpayerType',
          label: 'Taxpayer Type',
          type: 'radio',
          required: true,
          options: [
            { value: 'INDIVIDUAL', label: 'Individual / AOP' },
            { value: 'COMPANY',    label: 'Company' },
          ],
        },
      ],
      // FBR VALIDATED — Finance Act 2025. Top slab corrected (15%→25%) per Track A.
      // Arithmetic: 5%×300k=15k | 15k+10%×1.4M=155k | 155k+25%×excess
      // NOTE: Non-ATL individual/AOP path (Track B item B4) not yet implemented —
      // both ATL and Non-ATL individuals currently use these same slabs.
      slabs: [
        { from: 0,       to: 300000, fixedTax: 0,      rate: 0,  label: 'Up to Rs. 300,000' },
        { from: 300001,  to: 600000, fixedTax: 0,      rate: 5,  label: 'Rs. 300,001 to 600,000' },
        { from: 600001,  to: 2000000,fixedTax: 15000,  rate: 10, label: 'Rs. 600,001 to 2,000,000' },
        { from: 2000001, to: null,   fixedTax: 155000, rate: 25, label: 'Above Rs. 2,000,000' },
      ],
      rules: [
        // Company Rent flat-rate rules — Individual/AOP handled via slabs above
        { id: 'p25-155-comp-atl',     atlStatus: 'ATL',     taxpayerType: 'COMPANY', subType: null, rate: 15, rateLabel: '[PLACEHOLDER] 15% (ATL Company Rent)',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-155-comp-non-atl', atlStatus: 'NON_ATL', taxpayerType: 'COMPANY', subType: null, rate: 30, rateLabel: '[PLACEHOLDER] 30% (Non-ATL Company Rent)', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
      ],
    },

    // ── Section 236C — Sale/Transfer of Immovable Property ──────────────────
    // FBR VALIDATED — Finance Act 2025 / TY2026. Source: FBR Withholding Income
    // Tax Rate Card (updated to 30 June 2025), Division X, Part IV, First
    // Schedule, read with Rules 1 & 1A of the Tenth Schedule. Cross-checked
    // against TAGCO WHT Rates Card TY2026. Rate depends on the seller's
    // filer status (ATL / Late Filer / Non-ATL) AND the FMV band of the
    // property (≤ Rs.50M / Rs.50M-100M / > Rs.100M); the band is derived
    // from the entered property value, not user-selected.
    {
      code: '236C',
      displayOrder: 15,
      label: 'Section 236C - Sale of Immovable Property',
      legalReference: 'Section 236C Income Tax Ordinance 2001',
      displayName: 'Property Sale',
      shortDescription: 'Sale of immovable property',
      icon: '🏡',
      category: 'Property',
      transactionFields: [
        {
          key: 'propertyValue',
          label: 'Property Value (PKR)',
          type: 'number',
          placeholder: 'Enter gross consideration or FBR value',
          required: true,
          amountField: true,
          helperText: 'The applicable rate depends on which FMV band this value falls into (≤ Rs 50M, Rs 50M-100M, or > Rs 100M).',
        },
        {
          key: 'atlStatus',
          label: 'Filer Status (Seller)',
          type: 'radio',
          required: true,
          options: [
            { value: 'ATL',        label: 'Active Taxpayer (ATL)' },
            { value: 'LATE_FILER', label: 'Late Filer' },
            { value: 'NON_ATL',    label: 'Non-Filer (Not on ATL)' },
          ],
        },
      ],
      rules: [
        { id: 'p25-236C-atl-le50m',        atlStatus: 'ATL',        taxpayerType: null, subType: 'FMV_LE_50M',      rate: 4.5,  rateLabel: '4.5% (ATL Seller, FMV up to Rs 50M)',          priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-236C-latefiler-le50m',  atlStatus: 'LATE_FILER', taxpayerType: null, subType: 'FMV_LE_50M',      rate: 7.5,  rateLabel: '7.5% (Late Filer Seller, FMV up to Rs 50M)',   priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-236C-nonatl-le50m',     atlStatus: 'NON_ATL',    taxpayerType: null, subType: 'FMV_LE_50M',      rate: 11.5, rateLabel: '11.5% (Non-ATL Seller, FMV up to Rs 50M)',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-236C-atl-50to100m',     atlStatus: 'ATL',        taxpayerType: null, subType: 'FMV_50M_TO_100M', rate: 5,    rateLabel: '5% (ATL Seller, FMV Rs 50M-100M)',             priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-236C-latefiler-50to100m', atlStatus: 'LATE_FILER', taxpayerType: null, subType: 'FMV_50M_TO_100M', rate: 8.5, rateLabel: '8.5% (Late Filer Seller, FMV Rs 50M-100M)',  priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-236C-nonatl-50to100m',  atlStatus: 'NON_ATL',    taxpayerType: null, subType: 'FMV_50M_TO_100M', rate: 11.5, rateLabel: '11.5% (Non-ATL Seller, FMV Rs 50M-100M)',      priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-236C-atl-gt100m',       atlStatus: 'ATL',        taxpayerType: null, subType: 'FMV_GT_100M',     rate: 5.5,  rateLabel: '5.5% (ATL Seller, FMV over Rs 100M)',          priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-236C-latefiler-gt100m', atlStatus: 'LATE_FILER', taxpayerType: null, subType: 'FMV_GT_100M',     rate: 9.5,  rateLabel: '9.5% (Late Filer Seller, FMV over Rs 100M)',   priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-236C-nonatl-gt100m',    atlStatus: 'NON_ATL',    taxpayerType: null, subType: 'FMV_GT_100M',     rate: 11.5, rateLabel: '11.5% (Non-ATL Seller, FMV over Rs 100M)',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
      ],
    },

    // ── Section 236K — Purchase of Immovable Property ────────────────────────
    // FBR VALIDATED — Finance Act 2025 / TY2026. Source: FBR Withholding Income
    // Tax Rate Card (updated to 30 June 2025), Division XVIII, Part IV, First
    // Schedule, read with Rules 1 & 1A of the Tenth Schedule. Cross-checked
    // against TAGCO WHT Rates Card TY2026. Rate depends on the buyer's filer
    // status (ATL / Late Filer / Non-ATL) AND the FMV band of the property
    // (≤ Rs.50M / Rs.50M-100M / > Rs.100M); the band is derived from the
    // entered property value, not user-selected. The rate card draws no
    // distinction by buyer type (Individual/AOP/Company), so no such field
    // is presented.
    {
      code: '236K',
      displayOrder: 16,
      label: 'Section 236K - Purchase of Immovable Property',
      legalReference: 'Section 236K Income Tax Ordinance 2001',
      displayName: 'Property Purchase',
      shortDescription: 'Purchase of immovable property',
      icon: '🏡',
      category: 'Property',
      transactionFields: [
        {
          key: 'propertyValue',
          label: 'Property Value (PKR)',
          type: 'number',
          placeholder: 'Enter purchase price or FBR value',
          required: true,
          amountField: true,
          helperText: 'The applicable rate depends on which FMV band this value falls into (≤ Rs 50M, Rs 50M-100M, or > Rs 100M).',
        },
        {
          key: 'atlStatus',
          label: 'Filer Status (Buyer)',
          type: 'radio',
          required: true,
          options: [
            { value: 'ATL',        label: 'Active Taxpayer (ATL)' },
            { value: 'LATE_FILER', label: 'Late Filer' },
            { value: 'NON_ATL',    label: 'Non-Filer (Not on ATL)' },
          ],
        },
      ],
      rules: [
        { id: 'p25-236K-atl-le50m',        atlStatus: 'ATL',        taxpayerType: null, subType: 'FMV_LE_50M',      rate: 1.5,  rateLabel: '1.5% (ATL Buyer, FMV up to Rs 50M)',          priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-236K-latefiler-le50m',  atlStatus: 'LATE_FILER', taxpayerType: null, subType: 'FMV_LE_50M',      rate: 4.5,  rateLabel: '4.5% (Late Filer Buyer, FMV up to Rs 50M)',   priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-236K-nonatl-le50m',     atlStatus: 'NON_ATL',    taxpayerType: null, subType: 'FMV_LE_50M',      rate: 10.5, rateLabel: '10.5% (Non-ATL Buyer, FMV up to Rs 50M)',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-236K-atl-50to100m',     atlStatus: 'ATL',        taxpayerType: null, subType: 'FMV_50M_TO_100M', rate: 2,    rateLabel: '2% (ATL Buyer, FMV Rs 50M-100M)',             priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-236K-latefiler-50to100m', atlStatus: 'LATE_FILER', taxpayerType: null, subType: 'FMV_50M_TO_100M', rate: 5.5, rateLabel: '5.5% (Late Filer Buyer, FMV Rs 50M-100M)', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-236K-nonatl-50to100m',  atlStatus: 'NON_ATL',    taxpayerType: null, subType: 'FMV_50M_TO_100M', rate: 14.5, rateLabel: '14.5% (Non-ATL Buyer, FMV Rs 50M-100M)',      priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-236K-atl-gt100m',       atlStatus: 'ATL',        taxpayerType: null, subType: 'FMV_GT_100M',     rate: 2.5,  rateLabel: '2.5% (ATL Buyer, FMV over Rs 100M)',          priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-236K-latefiler-gt100m', atlStatus: 'LATE_FILER', taxpayerType: null, subType: 'FMV_GT_100M',     rate: 6.5,  rateLabel: '6.5% (Late Filer Buyer, FMV over Rs 100M)',   priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-236K-nonatl-gt100m',    atlStatus: 'NON_ATL',    taxpayerType: null, subType: 'FMV_GT_100M',     rate: 18.5, rateLabel: '18.5% (Non-ATL Buyer, FMV over Rs 100M)',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
      ],
    },

    // ── Section 233 — Brokerage and Commission ───────────────────────────────
    // FBR VALIDATED — Finance Act 2025 / TY2026. Source: FBR Withholding Income
    // Tax Rate Card (download1.fbr.gov.pk/Docs/20258181281745641WHT-RateCard.pdf)
    // and TAGCO WHT Rates Card TY2026 (Division II, Part IV, First Schedule).
    {
      code: '233',
      displayOrder: 14,
      label: 'Section 233 - Brokerage and Commission',
      legalReference: 'Section 233 Income Tax Ordinance 2001',
      displayName: 'Brokerage & Commission',
      shortDescription: 'Commission and brokerage payments',
      icon: '🤝',
      category: 'Other',
      transactionFields: [
        {
          key: 'commissionAmount',
          label: 'Brokerage / Commission Amount (PKR)',
          type: 'number',
          placeholder: 'Enter gross brokerage/commission amount',
          required: true,
          amountField: true,
        },
        {
          key: 'subType',
          label: 'Agent Category',
          type: 'select',
          required: true,
          options: [
            { value: 'ADVERTISING_AGENT',     label: 'Advertising Agent' },
            { value: 'LIFE_INSURANCE_AGENT',  label: 'Life Insurance Agent' },
            { value: 'OTHER',                 label: 'Other Brokerage / Commission' },
          ],
        },
        {
          key: 'annualCommissionTotal',
          label: 'Annual Commission Total (PKR)',
          type: 'number',
          placeholder: 'Total commission expected to be received in the year (defaults to this transaction amount)',
          required: false,
          helperText: 'Life Insurance Agent reduced rate (8% ATL / 16% Non-ATL) applies only when annual commission is below PKR 500,000. At or above PKR 500,000 the residual rate (12% ATL / 24% Non-ATL) applies — the transaction remains a Life Insurance Agent commission, only the rate changes.',
          visibleWhen: { field: 'subType', equals: 'LIFE_INSURANCE_AGENT' },
        },
        {
          key: 'atlStatus',
          label: 'ATL Status',
          type: 'radio',
          required: true,
          options: [
            { value: 'ATL',     label: 'Active (Filer)' },
            { value: 'NON_ATL', label: 'Inactive (Non-Filer)' },
          ],
        },
      ],
      rules: [
        // FBR VALIDATED — Finance Act 2025 / TY2026
        { id: 'p25-233-adv-atl',      atlStatus: 'ATL',     taxpayerType: null, subType: 'ADVERTISING_AGENT',    rate: 10, rateLabel: '10% (ATL - Advertising Agent)',                          priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-233-adv-non-atl',  atlStatus: 'NON_ATL', taxpayerType: null, subType: 'ADVERTISING_AGENT',    rate: 20, rateLabel: '20% (Non-ATL - Advertising Agent)',                       priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-233-life-low-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'LIFE_INSURANCE_AGENT_LOW',  rate: 8,  rateLabel: '8% (ATL - Life Insurance Agent, annual commission < PKR 500,000)',          priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-233-life-low-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'LIFE_INSURANCE_AGENT_LOW',  rate: 16, rateLabel: '16% (Non-ATL - Life Insurance Agent, annual commission < PKR 500,000)',      priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-233-life-high-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'LIFE_INSURANCE_AGENT_HIGH', rate: 12, rateLabel: '12% (ATL - Life Insurance Agent, annual commission ≥ PKR 500,000 — residual rate)',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-233-life-high-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'LIFE_INSURANCE_AGENT_HIGH', rate: 24, rateLabel: '24% (Non-ATL - Life Insurance Agent, annual commission ≥ PKR 500,000 — residual rate)', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-233-other-atl',    atlStatus: 'ATL',     taxpayerType: null, subType: 'OTHER',                rate: 12, rateLabel: '12% (ATL - Other Brokerage/Commission)',                  priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-233-other-non-atl',atlStatus: 'NON_ATL', taxpayerType: null, subType: 'OTHER',                rate: 24, rateLabel: '24% (Non-ATL - Other Brokerage/Commission)',             priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
      ],
    },

    // ── Section 156 — Prizes and Winnings ────────────────────────────────────
    // FBR VALIDATED — Finance Act 2025 / TY2026. Source: FBR Withholding Income
    // Tax Rate Card + waystax.com / fasttaxcalculator.pk WHT TY2026 summaries
    // (Division IV, Part III, First Schedule). Final tax, one-time payment.
    {
      code: '156',
      displayOrder: 13,
      label: 'Section 156 - Prizes and Winnings',
      legalReference: 'Section 156 Income Tax Ordinance 2001',
      displayName: 'Prizes & Winnings',
      shortDescription: 'Prize bonds, lotteries and winnings',
      icon: '🎁',
      category: 'Other',
      transactionFields: [
        {
          key: 'prizeAmount',
          label: 'Prize / Winnings Amount (PKR)',
          type: 'number',
          placeholder: 'Enter gross prize/winnings amount',
          required: true,
          amountField: true,
        },
        {
          key: 'subType',
          label: 'Prize Type',
          type: 'select',
          required: true,
          options: [
            { value: 'PRIZE_BOND',     label: 'Prize Bond or Crossword Puzzle Winnings' },
            { value: 'OTHER_WINNINGS', label: 'Raffle / Lottery / Quiz / Sales Promotion Prize' },
          ],
        },
        {
          key: 'atlStatus',
          label: 'ATL Status',
          type: 'radio',
          required: true,
          options: [
            { value: 'ATL',     label: 'Active (Filer)' },
            { value: 'NON_ATL', label: 'Inactive (Non-Filer)' },
          ],
        },
      ],
      rules: [
        // FBR VALIDATED — Finance Act 2025 / TY2026
        { id: 'p25-156-bond-atl',      atlStatus: 'ATL',     taxpayerType: null, subType: 'PRIZE_BOND',     rate: 15, rateLabel: '15% (ATL - Prize Bond Winnings)',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-156-bond-non-atl',  atlStatus: 'NON_ATL', taxpayerType: null, subType: 'PRIZE_BOND',     rate: 30, rateLabel: '30% (Non-ATL - Prize Bond Winnings)', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-156-other-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'OTHER_WINNINGS', rate: 20, rateLabel: '20% (ATL - Other Winnings)',          priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-156-other-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'OTHER_WINNINGS', rate: 40, rateLabel: '40% (Non-ATL - Other Winnings)',     priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
      ],
    },

    // ── Section 154 — Exports ─────────────────────────────────────────────
    // FBR VALIDATED — Finance Act 2025 / TY2026. Sources: FBR WHT Rate Card
    // TY2026 (Sec 154, Div. IV Pt. III 1st Sch.) + Cl. 47C Pt. IV 2nd Sch.
    // (Section 147 advance tax for exporters, retained from Finance Act 2024).
    //
    // Realization of export proceeds / back-to-back inland LC / EPZ exports /
    // DTRE & Export Facilitation Scheme 2021 payments to indirect exporters:
    // total 2% deduction at realization = 1% Minimum Tax under §154 + 1%
    // Advance Tax under §147 (Cl. 47C Pt-IV 2nd Sch.). The two components
    // are collected together as a single 2% withholding event.
    //
    // No Filer/Non-Filer differentiation — the §154 minimum-tax 1% and §147
    // advance-tax 1% both apply at the same rate regardless of ATL status.
    //
    // Cooking oil / vegetable ghee exported to Afghanistan: 0% (conditional
    // on §148 tax having been paid).
    {
      code: '154',
      displayOrder: 10,
      label: 'Section 154 - Exports',
      legalReference: 'Section 154 Income Tax Ordinance 2001 (read with Section 147 / Cl. 47C Pt-IV 2nd Sch.)',
      displayName: 'Export of Goods',
      shortDescription: 'Export proceeds and export-related transactions',
      icon: '📦',
      category: 'Exports',
      transactionFields: [
        {
          key: 'exportProceeds',
          label: 'Export Proceeds Amount (PKR)',
          type: 'number',
          placeholder: 'Enter gross export proceeds realized',
          required: true,
          amountField: true,
          helperText: 'Standard export realization is taxed at 2% total = 1% Minimum Tax (§154) + 1% Advance Tax (§147 / Cl. 47C Pt-IV 2nd Sch.). No Filer/Non-Filer split applies.',
        },
        {
          key: 'subType',
          label: 'Export Category',
          type: 'select',
          required: true,
          options: [
            { value: 'STANDARD_EXPORT', label: 'Realization of Export Proceeds / Back-to-Back LC / EPZ Exports / DTRE & EFS Payments to Indirect Exporters' },
            { value: 'AFGHAN_COOKING_OIL', label: 'Cooking Oil / Vegetable Ghee Exported to Afghanistan (Sec 148 tax paid)' },
          ],
        },
      ],
      rules: [
        // FBR VALIDATED — Finance Act 2025 / TY2026. Single 2% rule covers
        // both §154 minimum tax (1%) and §147 advance tax (1%) components.
        { id: 'p25-154-standard', atlStatus: null, taxpayerType: null, subType: 'STANDARD_EXPORT',    rate: 2, rateLabel: '2% (1% Minimum Tax §154 + 1% Advance Tax §147/Cl. 47C Pt-IV 2nd Sch.)',           priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-154-afghan',   atlStatus: null, taxpayerType: null, subType: 'AFGHAN_COOKING_OIL', rate: 0, rateLabel: '0% (Cooking Oil/Ghee exported to Afghanistan, Sec 148 tax paid)',                   priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
      ],
    },

    // ── Section 154A — Export of Services ────────────────────────────────
    // FBR VALIDATED — Finance Act 2025 / TY2026. Source: FBR WHT Rate Card TY2026
    // (Div. IVA Pt. III 1st Sch. r/w R.1 Tenth Sch.).
    // PSEB-registered Software/IT/ITeS exporters: 0.25% ATL / 0.5% Non-ATL
    // (final tax, subject to specified conditions).
    // Other listed categories (technical services rendered abroad/exported,
    // royalty/commission/franchise fees, foreign construction contracts,
    // foreign indenting commission): 1% ATL / 2% Non-ATL.
    // Non-ATL rates doubled per Rule 1 Tenth Schedule.
    {
      code: '154A',
      displayOrder: 11,
      label: 'Section 154A - Export of Services',
      legalReference: 'Section 154A Income Tax Ordinance 2001',
      displayName: 'Export of Services',
      shortDescription: 'IT, ITeS and other exported services',
      icon: '💻',
      category: 'Exports',
      transactionFields: [
        {
          key: 'serviceProceeds',
          label: 'Export of Services Proceeds (PKR)',
          type: 'number',
          placeholder: 'Enter gross proceeds from export of services',
          required: true,
          amountField: true,
        },
        {
          key: 'subType',
          label: 'Service Export Category',
          type: 'select',
          required: true,
          options: [
            { value: 'PSEB_IT_ITES', label: 'Software / IT / IT-enabled Services (PSEB Registered)' },
            { value: 'OTHER_SERVICES', label: 'Technical Services Rendered Abroad / Exported, Royalty-Commission-Franchise Fees, Foreign Construction Contracts, Foreign Indenting Commission' },
          ],
        },
        {
          key: 'atlStatus',
          label: 'ATL Status',
          type: 'radio',
          required: true,
          options: [
            { value: 'ATL',     label: 'Active (Filer)' },
            { value: 'NON_ATL', label: 'Inactive (Non-Filer)' },
          ],
        },
      ],
      rules: [
        // FBR VALIDATED — Finance Act 2025 / TY2026
        { id: 'p25-154a-pseb-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'PSEB_IT_ITES',   rate: 0.25, rateLabel: '0.25% (ATL - PSEB Registered Software/IT/ITeS Export, Final Tax)', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-154a-pseb-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'PSEB_IT_ITES',   rate: 0.5,  rateLabel: '0.5% (Non-ATL - PSEB Registered Software/IT/ITeS Export)',          priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-154a-other-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'OTHER_SERVICES', rate: 1,    rateLabel: '1% (ATL - Technical Services / Royalty / Franchise / Foreign Contracts / Indenting)', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
        { id: 'p25-154a-other-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'OTHER_SERVICES', rate: 2,    rateLabel: '2% (Non-ATL - Technical Services / Royalty / Franchise / Foreign Contracts / Indenting)', priority: 1, effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30' },
      ],
    },
  ],
};
