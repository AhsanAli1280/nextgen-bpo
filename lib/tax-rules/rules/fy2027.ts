/**
 * ============================================================================
 * Finance Act Year : 2026 (governing Tax Year 2026-27)
 * Effective period : 2026-07-01 to 2027-06-30
 *
 * REBUILD PROVENANCE (Option B):
 *   This file was rebuilt from the FBR-validated fy2026.ts baseline plus the
 *   enacted Finance Act, 2026 (Act No. XLIII of 2026, President's assent
 *   26 June 2026) deltas. Values from the previous (discarded) fy2027.ts
 *   placeholder were NOT reused. Authoritative source for every rate below is
 *   the enacted Finance Act 2026; see docs/FY2027_FINANCE_ACT_IMPLEMENTATION_REPORT.md.
 *
 * BATCH 1 SCOPE (this commit):
 *   Carry-forward (reviewed vs Finance Act 2026 — no amending provision found):
 *     §148, §150, §151, §156, §233, §153(2A)/"6a"
 *   Amended per enacted Finance Act 2026:
 *     §149  — new salary slab table (Div I Pt I 1st Sch; s.4AB surcharge repealed)
 *     §153b — services restructure (Div III Pt III 1st Sch)
 *     §153c — sportspersons 15%→20% (Div IIIAA Pt III 1st Sch)
 *     §236C — flat 2.75% (Div X Pt IV 1st Sch, fully substituted)
 *     §236K — flat 1.25% (Div XVIII Pt IV 1st Sch, fully substituted)
 *
 * BATCH 2 (this commit) — pending items resolved + new sections added:
 *     §151B — NEW: life-insurance/takaful payouts (Div IC; base = payout −
 *             premiums; 15% within 1yr / 10% 1–4yr / exempt after 4yr/death/disab)
 *     §154B — NEW: social-media platform revenue (Div IIIAB; flat 5%,
 *             minimum for resident / final for non-resident-no-PE)
 *     §152  — §152(1DA) FCVA/FCBVA/NRVA/NRBVA capital-gain channel; Div II rate
 *             unchanged (10%) → relabelled, rate carried forward
 *     §154  — Div IV(1)&(3) 1%→1.25%: STANDARD_EXPORT 2% → 2.25% (1.25% §154 + 1% §147)
 *     §154A — Div IVA sunset extended 2026→2029; NO rate change (COMPLETE)
 *     §153a — re-verified UNCHANGED (no §153 goods amendment) — COMPLETE
 *     §155  — re-verified UNCHANGED (no §155 amendment) — COMPLETE
 *     Division XXVII (5%→0.5%) — maps to a §236-series advance tax NOT modelled
 *             in this calculator → out of scope, no change.
 *
 * HOTFIX-002 (2026-07-01 go-live reconciliation) — cross-checked against the
 *   Moore Shekha Mufti TY2027 WHT Chart (secondary advisory source) ahead of
 *   go-live:
 *     §236C/§236K — corrected Non-ATL rates. Batch 1/2 had assumed Non-ATL =
 *       2× the new flat filer rate (5.5% / 2.5%); the Act's substituted
 *       Division X/XVIII text is silent on Non-Filer treatment and Tenth
 *       Schedule Rule 1 (the general non-filer provision) was not amended, so
 *       the Non-ATL rate is now carried forward UNCHANGED from FY2025-26:
 *       §236C Non-ATL flat 11.5%; §236K Non-ATL FMV-banded 10.5%/14.5%/18.5%.
 *       See inline comments on each section for full reasoning.
 *
 * NOT FBR-CARD RECONCILED YET — the final FBR TY2027 WHT Rate Card was not
 * available at implementation time; all values above derive from the enacted
 * Finance Act 2026 (primary) with the Moore Shekha Mufti TY2027 Chart and
 * TAGCO as secondary cross-checks. The pension-surcharge repeal (§149(1A))
 * remains an unconfirmed interpretation pending the FBR card (P1 — see
 * docs/FY2027_GO_LIVE_CHECKLIST.md). fy2026.ts remains the production/
 * rollback baseline and is unchanged.
 * ============================================================================
 */

import { WhtRateConfig } from '../types';

export const configFY2027: WhtRateConfig = {
  financeActYear: 2026, // Governing Tax Year 2026-27
  effectiveFrom: '2026-07-01',
  effectiveTo: '2027-06-30',
  sections: [
    // ── Section 148 — Imports ─────────────────────────────────────────────
    // CARRY-FORWARD. Reviewed against Finance Act 2026 — no amendment to the
    // §148 import WHT rates (Part II First Schedule). Rates identical to
    // fy2026.ts (FBR-validated Finance Act 2025). Mobile-phone fixed-rate
    // imports remain out of scope (percentage-engine limitation).
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
        { id: 'p26-148-12sch1-atl',      atlStatus: 'ATL',     taxpayerType: null, subType: 'TWELFTH_SCH_PART_I',             rate: 1,   rateLabel: '1% (ATL - Twelfth Schedule Part I, All Importers)',                priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-12sch1-non-atl',  atlStatus: 'NON_ATL', taxpayerType: null, subType: 'TWELFTH_SCH_PART_I',             rate: 2,   rateLabel: '2% (Non-ATL - Twelfth Schedule Part I, All Importers)',            priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-12sch2-comm-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'TWELFTH_SCH_PART_II_COMMERCIAL', rate: 3.5, rateLabel: '3.5% (ATL - Twelfth Schedule Part II, Commercial Importers)',      priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-12sch2-comm-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'TWELFTH_SCH_PART_II_COMMERCIAL', rate: 7,   rateLabel: '7% (Non-ATL - Twelfth Schedule Part II, Commercial Importers)',    priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-12sch2-other-atl',    atlStatus: 'ATL',     taxpayerType: null, subType: 'TWELFTH_SCH_PART_II_OTHER',      rate: 2,   rateLabel: '2% (ATL - Twelfth Schedule Part II, Other Importers)',             priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-12sch2-other-non-atl',atlStatus: 'NON_ATL', taxpayerType: null, subType: 'TWELFTH_SCH_PART_II_OTHER',      rate: 4,   rateLabel: '4% (Non-ATL - Twelfth Schedule Part II, Other Importers)',         priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-12sch3-comm-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'TWELFTH_SCH_PART_III_COMMERCIAL',rate: 6,   rateLabel: '6% (ATL - Twelfth Schedule Part III, Commercial Importers)',       priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-12sch3-comm-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'TWELFTH_SCH_PART_III_COMMERCIAL',rate: 12,  rateLabel: '12% (Non-ATL - Twelfth Schedule Part III, Commercial Importers)',  priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-12sch3-other-atl',    atlStatus: 'ATL',     taxpayerType: null, subType: 'TWELFTH_SCH_PART_III_OTHER',     rate: 5.5, rateLabel: '5.5% (ATL - Twelfth Schedule Part III, Other Importers)',          priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-12sch3-other-non-atl',atlStatus: 'NON_ATL', taxpayerType: null, subType: 'TWELFTH_SCH_PART_III_OTHER',     rate: 11,  rateLabel: '11% (Non-ATL - Twelfth Schedule Part III, Other Importers)',       priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-sro1125-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'SRO_1125_MANUFACTURERS',         rate: 1,   rateLabel: '1% (ATL - SRO 1125(I)/2011, Manufacturers)',                       priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-sro1125-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'SRO_1125_MANUFACTURERS',         rate: 2,   rateLabel: '2% (Non-ATL - SRO 1125(I)/2011, Manufacturers)',                   priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-medicines-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'MEDICINES_DRAP', rate: 4, rateLabel: '4% (ATL - Medicines Not Manufactured Locally, DRAP Certified)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-medicines-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'MEDICINES_DRAP', rate: 8, rateLabel: '8% (Non-ATL - Medicines Not Manufactured Locally, DRAP Certified)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-ev-ckd-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'EV_LCV_CKD_KITS', rate: 1, rateLabel: '1% (ATL - EV/LCV CKD Kits)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-ev-ckd-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'EV_LCV_CKD_KITS', rate: 2, rateLabel: '2% (Non-ATL - EV/LCV CKD Kits)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 149 — Salary ──────────────────────────────────────────────
    // AMENDED — Finance Act 2026, First Schedule Part I Division I clause (2),
    // Table substituted. New 8-band salary slab structure (0/1/11/20/25/29/
    // 32/35%). Additionally, Act §5(2) substituted the s.4AB proviso with
    // "no surcharge shall be payable" — the 9% high-earner surcharge is
    // REPEALED for TY2026-27. The surcharge repeal is enforced in engine.ts
    // (gated on financeActYear < 2026), not via this config.
    // §149(3) Board-of-Directors meeting / directorship fee is a flat 20% on the
    // gross fee (Moore TY2027 Chart, §149(3)); handled via a dedicated engine
    // branch (subType DIRECTOR_FEE) so it bypasses the salary slab computation.
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
            { value: 'PENSION',       label: 'Pension under Sec 149(1A) (≤Rs 10M nil; >Rs 10M & age <70: 5% on excess — s.4AB surcharge repealed FA2026)' },
            { value: 'CONTINUATION',  label: 'Pension Continuation (former employer/associate — treated as salary)' },
            { value: 'DIRECTOR_FEE',  label: 'Board of Directors Meeting / Directorship Fee under Sec 149(3) (flat 20% on the gross fee)' },
          ],
        },
        {
          key: 'pensionerAge',
          label: 'Pensioner Age',
          type: 'number',
          placeholder: 'Enter age in years',
          required: false,
          visibleWhen: { field: 'subType', equals: 'PENSION' },
          helperText: 'Pension > Rs 10M attracts 5% on the excess only when pensioner age < 70 (s.4AB surcharge repealed by Finance Act 2026).',
        },
      ],
      // AMENDED — Finance Act 2026, Div I Pt I 1st Sch clause (2) Table.
      // Marginal-rate breakpoints: 600k/1.2M/2.2M/3.2M/4.1M/5.6M/7M.
      // Arithmetic (cumulative fixedTax shown for documentation; engine
      // computes purely from marginal rates):
      //   1%×600k=6,000 | 6k+11%×1M=116k | 116k+20%×1M=316k |
      //   316k+25%×900k=541k | 541k+29%×1.5M=976k | 976k+32%×1.4M=1,424k
      slabs: [
        { from: 0,       to: 600000,  fixedTax: 0,       rate: 0,  label: 'Up to Rs. 600,000' },
        { from: 600001,  to: 1200000, fixedTax: 0,       rate: 1,  label: 'Rs. 600,001 to 1,200,000' },
        { from: 1200001, to: 2200000, fixedTax: 6000,    rate: 11, label: 'Rs. 1,200,001 to 2,200,000' },
        { from: 2200001, to: 3200000, fixedTax: 116000,  rate: 20, label: 'Rs. 2,200,001 to 3,200,000' },
        { from: 3200001, to: 4100000, fixedTax: 316000,  rate: 25, label: 'Rs. 3,200,001 to 4,100,000' },
        { from: 4100001, to: 5600000, fixedTax: 541000,  rate: 29, label: 'Rs. 4,100,001 to 5,600,000' },
        { from: 5600001, to: 7000000, fixedTax: 976000,  rate: 32, label: 'Rs. 5,600,001 to 7,000,000' },
        { from: 7000001, to: null,    fixedTax: 1424000, rate: 35, label: 'Above Rs. 7,000,000' },
      ],
      rules: [], // Handled via slabs
    },

    // ── Section 150 — Dividends ───────────────────────────────────────────
    // CARRY-FORWARD. Reviewed against Finance Act 2026 — no amendment to
    // Division I, Part III, First Schedule (dividends). Rates identical to
    // fy2026.ts. NOTE: the previous fy2027.ts placeholder had reintroduced a
    // BONUS_SHARES category under §150; the enacted Finance Act 2026 contains
    // no such §150 provision (and no §236Z bonus-share section), so it is NOT
    // carried in. MUTUAL_FUND is split per the Moore TY2027 Chart into Stock
    // Fund (15/30), Money Market/Debt Fund for Individual/AOP (25/50), and Debt
    // Fund for Company recipients (29/58) — the company-debt-fund tier is the
    // recipient differentiation shown in the Moore chart.
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
            { value: 'MUTUAL_FUND_STOCK',        label: 'Mutual Fund — Stock Fund Dividend' },
            { value: 'MUTUAL_FUND_MONEY_DEBT',   label: 'Mutual Fund — Money Market / Debt Fund Dividend (Individual/AOP recipient)' },
            { value: 'MUTUAL_FUND_COMPANY_DEBT', label: 'Mutual Fund — Debt Fund Dividend (Company recipient)' },
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
        { id: 'p26-150-general-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'GENERAL',        rate: 15, rateLabel: '15% (ATL Filer - General Dividend)',                priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-150-general-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'GENERAL',        rate: 30, rateLabel: '30% (Non-ATL - General Dividend)',                   priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-150-ipp-atl',         atlStatus: 'ATL',     taxpayerType: null, subType: 'IPP',            rate: 7.5, rateLabel: '7.5% (ATL Filer - IPP Dividend)',                   priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-150-ipp-non-atl',     atlStatus: 'NON_ATL', taxpayerType: null, subType: 'IPP',            rate: 15, rateLabel: '15% (Non-ATL - IPP Dividend)',                       priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        // Mutual funds split per Moore TY2027 Chart: Stock Fund 15/30;
        // Money Market/Debt Fund (Individual/AOP) 25/50; Debt Fund (Company) 29/58.
        { id: 'p26-150-fund-stock-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'MUTUAL_FUND_STOCK',        rate: 15, rateLabel: '15% (ATL Filer - Mutual Fund, Stock Fund)',                     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-150-fund-stock-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'MUTUAL_FUND_STOCK',        rate: 30, rateLabel: '30% (Non-ATL - Mutual Fund, Stock Fund)',                        priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-150-fund-money-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'MUTUAL_FUND_MONEY_DEBT',   rate: 25, rateLabel: '25% (ATL Filer - Mutual Fund, Money Market/Debt Fund)',           priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-150-fund-money-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'MUTUAL_FUND_MONEY_DEBT',   rate: 50, rateLabel: '50% (Non-ATL - Mutual Fund, Money Market/Debt Fund)',              priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-150-fund-codebt-atl',    atlStatus: 'ATL',     taxpayerType: null, subType: 'MUTUAL_FUND_COMPANY_DEBT', rate: 29, rateLabel: '29% (ATL Filer - Mutual Fund, Debt Fund - Company recipient)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-150-fund-codebt-non-atl',atlStatus: 'NON_ATL', taxpayerType: null, subType: 'MUTUAL_FUND_COMPANY_DEBT', rate: 58, rateLabel: '58% (Non-ATL - Mutual Fund, Debt Fund - Company recipient)',        priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-150-spv-reit-atl',    atlStatus: 'ATL',     taxpayerType: null, subType: 'SPV_REIT',       rate: 0,  rateLabel: '0% (ATL Filer - REIT Scheme Dividend from SPV)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-150-spv-reit-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'SPV_REIT',      rate: 0,  rateLabel: '0% (Non-ATL - REIT Scheme Dividend from SPV)',       priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-150-spv-other-atl',   atlStatus: 'ATL',     taxpayerType: null, subType: 'SPV_OTHER',      rate: 35, rateLabel: '35% (ATL Filer - Dividend from SPV to Others)',      priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-150-spv-other-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'SPV_OTHER',    rate: 70, rateLabel: '70% (Non-ATL - Dividend from SPV to Others)',        priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-150-exempt-co-atl',   atlStatus: 'ATL',     taxpayerType: null, subType: 'EXEMPT_COMPANY', rate: 25, rateLabel: '25% (ATL Filer - Dividend from Exempt Company)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-150-exempt-co-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'EXEMPT_COMPANY', rate: 50, rateLabel: '50% (Non-ATL - Dividend from Exempt Company)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 151 — Profit on Debt ──────────────────────────────────────
    // CARRY-FORWARD (with one Moore-aligned change). Bank 20/40, the Govt-Sec
    // taxpayer-type tiers, and all three Sukuk tiers are carried from fy2026.ts.
    // NSS is set to a FLAT 20/40 for all taxpayer types per the Moore TY2027
    // Chart (which shows NSS 20%/40% for Company/Individual/AOP alike) — the
    // NSSF_INDIVIDUAL and NSSF_OTHER derived sub-types therefore both resolve to
    // 20/40. (The previous fy2027.ts placeholder had cut Bank to 15/30 and
    // deleted Sukuk — both reverted.) Derived sub-categories (GOVT_SEC_*/
    // NSSF_*/SUKUK_*) are computed in engine.ts.
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
        { id: 'p26-151-bank-atl',           atlStatus: 'ATL',     taxpayerType: null, subType: 'BANK',              rate: 20,   rateLabel: '20% (ATL Filer - Bank Deposit)',                          priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-151-bank-non-atl',       atlStatus: 'NON_ATL', taxpayerType: null, subType: 'BANK',              rate: 40,   rateLabel: '40% (Non-ATL - Bank Deposit)',                            priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-151-nssf-ind-atl',       atlStatus: 'ATL',     taxpayerType: null, subType: 'NSSF_INDIVIDUAL',   rate: 20,   rateLabel: '20% (ATL Filer - NSS)',                                   priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-151-nssf-ind-non-atl',   atlStatus: 'NON_ATL', taxpayerType: null, subType: 'NSSF_INDIVIDUAL',   rate: 40,   rateLabel: '40% (Non-ATL - NSS)',                                     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-151-nssf-other-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'NSSF_OTHER',        rate: 20,   rateLabel: '20% (ATL Filer - NSS)',                                   priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-151-nssf-other-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'NSSF_OTHER',        rate: 40,   rateLabel: '40% (Non-ATL - NSS)',                                     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-151-govt-ind-atl',       atlStatus: 'ATL',     taxpayerType: null, subType: 'GOVT_SEC_INDIVIDUAL', rate: 15, rateLabel: '15% (ATL Filer - Gov Security, Individual)',             priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-151-govt-ind-non-atl',   atlStatus: 'NON_ATL', taxpayerType: null, subType: 'GOVT_SEC_INDIVIDUAL', rate: 30, rateLabel: '30% (Non-ATL - Gov Security, Individual)',               priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-151-govt-other-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'GOVT_SEC_OTHER',    rate: 20,   rateLabel: '20% (ATL Filer - Gov Security, Non-Individual)',          priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-151-govt-other-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'GOVT_SEC_OTHER',    rate: 40,   rateLabel: '40% (Non-ATL - Gov Security, Non-Individual)',            priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-151-sukuk-co-atl',       atlStatus: 'ATL',     taxpayerType: null, subType: 'SUKUK_COMPANY',     rate: 25,   rateLabel: '25% (ATL Filer - Sukuk, Company Holder)',                 priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-151-sukuk-co-non-atl',   atlStatus: 'NON_ATL', taxpayerType: null, subType: 'SUKUK_COMPANY',     rate: 50,   rateLabel: '50% (Non-ATL - Sukuk, Company Holder)',                   priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-151-sukuk-gt1m-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'SUKUK_IND_GT1M',    rate: 12.5, rateLabel: '12.5% (ATL Filer - Sukuk, Individual/AOP > Rs 1M)',      priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-151-sukuk-gt1m-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'SUKUK_IND_GT1M',    rate: 25,   rateLabel: '25% (Non-ATL - Sukuk, Individual/AOP > Rs 1M)',           priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-151-sukuk-le1m-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'SUKUK_IND_LE1M',    rate: 10,   rateLabel: '10% (ATL Filer - Sukuk, Individual/AOP ≤ Rs 1M)',    priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-151-sukuk-le1m-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'SUKUK_IND_LE1M',    rate: 20,   rateLabel: '20% (Non-ATL - Sukuk, Individual/AOP ≤ Rs 1M)',      priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 152 — Payments to Non-Residents ───────────────────────────
    // BATCH 2 RESOLVED. Finance Act 2026 substituted §152(1DA): a banking
    // company maintaining an FCVA / FCBVA / NRVA / NRBVA deducts tax on capital
    // gain on disposal of debt instruments and Government securities (incl.
    // Shariah-compliant variant) invested through those accounts, "at the rate
    // specified in Division II of Part III". The First Schedule amendment list
    // does NOT touch Division II, so the rate is unchanged at 10% — the existing
    // OTHER_SECURITIES_GAIN rule carries that rate forward, relabelled to the
    // amended account-based wording. Tenth Schedule rule 10 was also amended
    // (adds §151B non-resident to the no-100%-increase list — see §151B below).
    // The full 15-subcategory fy2026 structure is preserved.
    // FBR-CARD RECONCILIATION (Phase 3): confirm the Division II value (10%) and
    // whether §152(1DA) FCVA gains warrant a distinct line from the SCRA 1D gain.
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
            { value: 'OTHER_SECURITIES_GAIN', label: 'Capital Gain on Debt / Govt Securities via FCVA/FCBVA/NRVA/NRBVA - Sec 152(1DA)' },
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
        { id: 'p26-152-royalty-fts',  atlStatus: null, taxpayerType: null, subType: 'ROYALTY_FTS',              rate: 15, rateLabel: '15% (Royalty / Fee for Technical Services - Sec 152(1))',                    priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-construction', atlStatus: null, taxpayerType: null, subType: 'CONSTRUCTION_CONTRACTS',   rate: 7,  rateLabel: '7% (Minimum Tax - Construction/Assembly/Installation/Supervisory Contracts - Sec 152(1A))', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-insurance',    atlStatus: null, taxpayerType: null, subType: 'INSURANCE_PREMIUM',        rate: 5,  rateLabel: '5% (Minimum Tax - Insurance/Re-Insurance Premium - Sec 152(1AA))',              priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-advertisement',atlStatus: null, taxpayerType: null, subType: 'ADVERTISEMENT_NR_MEDIA',   rate: 10, rateLabel: '10% (Minimum Tax - Advertisement Services by Non-Resident Media - Sec 152(1AAA))', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-offshore-digital', atlStatus: null, taxpayerType: null, subType: 'OFFSHORE_DIGITAL_SERVICES', rate: 15, rateLabel: '15% (Offshore Digital Services, Banking Channel Remittance - Sec 152(1C))', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-pe-goods-services', atlStatus: null, taxpayerType: null, subType: 'PE_GOODS_SERVICES_CONTRACTS', rate: 20, rateLabel: '20% (Sale of Goods/Services/Contracts via PE of Non-Resident - Sec 152(1BA))', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-debt-sec-gain', atlStatus: null, taxpayerType: null, subType: 'DEBT_SECURITIES_GAIN',     rate: 10, rateLabel: '10% (Capital Gain on Debt Securities, Non-Resident SCRA - Sec 152(1D))',       priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-other-sec-gain', atlStatus: null, taxpayerType: null, subType: 'OTHER_SECURITIES_GAIN',   rate: 10, rateLabel: '10% (Capital Gain on Debt/Govt Securities via FCVA/FCBVA/NRVA/NRBVA, Div II Pt III - Sec 152(1DA))', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-pe-comp-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'PE_PAYMENT_COMPANY', rate: 5,    rateLabel: '5% (ATL - PE Sale of Goods, Company - Sec 152(2A)(a))',         priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-pe-comp-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'PE_PAYMENT_COMPANY', rate: 10,   rateLabel: '10% (Non-ATL - PE Sale of Goods, Company - Sec 152(2A)(a))',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-pe-other-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'PE_PAYMENT_OTHER',  rate: 5.5,  rateLabel: '5.5% (ATL - PE Sale of Goods, Other than Company - Sec 152(2A)(a))',   priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-pe-other-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'PE_PAYMENT_OTHER',  rate: 11,   rateLabel: '11% (Non-ATL - PE Sale of Goods, Other than Company - Sec 152(2A)(a))', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-pe-it-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'PE_IT_ITES',        rate: 4,  rateLabel: '4% (ATL - PE IT/ITeS Services - Sec 152(2A)(b))',         priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-pe-it-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'PE_IT_ITES',        rate: 8,  rateLabel: '8% (Non-ATL - PE IT/ITeS Services - Sec 152(2A)(b))',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-pe-svc-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'PE_OTHER_SERVICES', rate: 8,  rateLabel: '8% (ATL - PE Other Services - Sec 152(2A)(b))',           priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-pe-svc-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'PE_OTHER_SERVICES', rate: 16, rateLabel: '16% (Non-ATL - PE Other Services - Sec 152(2A)(b))',       priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-pe-sport-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'PE_SPORTSPERSON',    rate: 15, rateLabel: '15% (ATL - PE Contracts, Sportsperson - Sec 152(2A)(c))',         priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-pe-sport-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'PE_SPORTSPERSON',    rate: 30, rateLabel: '30% (Non-ATL - PE Contracts, Sportsperson - Sec 152(2A)(c))',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-pe-cont-atl',      atlStatus: 'ATL',     taxpayerType: null, subType: 'PE_OTHER_CONTRACTS', rate: 8,  rateLabel: '8% (ATL - PE Contracts, Other - Sec 152(2A)(c))',                priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-pe-cont-non-atl',  atlStatus: 'NON_ATL', taxpayerType: null, subType: 'PE_OTHER_CONTRACTS', rate: 16, rateLabel: '16% (Non-ATL - PE Contracts, Other - Sec 152(2A)(c))',           priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-sukuk-nr-comp',   atlStatus: null, taxpayerType: null, subType: 'SUKUK_NR_COMPANY',   rate: 25,   rateLabel: '25% (Sukuk, Non-Resident Company Holder - Sec 152(1DB)(a))',       priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-sukuk-nr-gt1m',   atlStatus: null, taxpayerType: null, subType: 'SUKUK_NR_IND_GT1M', rate: 12.5, rateLabel: '12.5% (Sukuk, Non-Resident Individual/AOP > Rs 1M - Sec 152(1DB)(b))', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-sukuk-nr-le1m',   atlStatus: null, taxpayerType: null, subType: 'SUKUK_NR_IND_LE1M', rate: 10,   rateLabel: '10% (Sukuk, Non-Resident Individual/AOP ≤ Rs 1M - Sec 152(1DB)(c))',    priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 153(1)(a) — Supply of Goods ───────────────────────────────
    // BATCH 2 COMPLETE (re-verified, UNCHANGED). Finance Act 2026 made no
    // operative amendment to §153 goods rates — only §153 services (Division
    // III) and sportspersons (Division IIIAA) changed. Carried forward verbatim
    // from fy2026; the previous fy2027.ts placeholder's OTHER_GOODS cut (4/8)
    // had no legal basis and is not reproduced. Removed from the engineering queue.
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
        { id: 'p26-153a-other-comp-atl',     atlStatus: 'ATL',     taxpayerType: 'COMPANY',    subType: 'OTHER_GOODS',         rate: 5,    rateLabel: '5% (ATL Company - Other Goods)',                    priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-other-comp-non-atl', atlStatus: 'NON_ATL', taxpayerType: 'COMPANY',    subType: 'OTHER_GOODS',         rate: 10,   rateLabel: '10% (Non-ATL Company - Other Goods)',               priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-other-ind-atl',      atlStatus: 'ATL',     taxpayerType: 'INDIVIDUAL', subType: 'OTHER_GOODS',         rate: 5.5,  rateLabel: '5.5% (ATL Individual/AOP - Other Goods)',           priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-other-ind-non-atl',  atlStatus: 'NON_ATL', taxpayerType: 'INDIVIDUAL', subType: 'OTHER_GOODS',         rate: 11,   rateLabel: '11% (Non-ATL Individual/AOP - Other Goods)',        priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-other-aop-atl',      atlStatus: 'ATL',     taxpayerType: 'AOP',        subType: 'OTHER_GOODS',         rate: 5.5,  rateLabel: '5.5% (ATL Individual/AOP - Other Goods)',           priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-other-aop-non-atl',  atlStatus: 'NON_ATL', taxpayerType: 'AOP',        subType: 'OTHER_GOODS',         rate: 11,   rateLabel: '11% (Non-ATL Individual/AOP - Other Goods)',        priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-toll-comp-atl',      atlStatus: 'ATL',     taxpayerType: 'COMPANY',    subType: 'TOLL_MANUFACTURING',  rate: 9,    rateLabel: '9% (ATL Company - Toll Manufacturing)',             priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-toll-comp-non-atl',  atlStatus: 'NON_ATL', taxpayerType: 'COMPANY',    subType: 'TOLL_MANUFACTURING',  rate: 18,   rateLabel: '18% (Non-ATL Company - Toll Manufacturing)',        priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-toll-ind-atl',       atlStatus: 'ATL',     taxpayerType: 'INDIVIDUAL', subType: 'TOLL_MANUFACTURING',  rate: 11,   rateLabel: '11% (ATL Individual/AOP - Toll Manufacturing)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-toll-ind-non-atl',   atlStatus: 'NON_ATL', taxpayerType: 'INDIVIDUAL', subType: 'TOLL_MANUFACTURING',  rate: 22,   rateLabel: '22% (Non-ATL Individual/AOP - Toll Manufacturing)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-toll-aop-atl',       atlStatus: 'ATL',     taxpayerType: 'AOP',        subType: 'TOLL_MANUFACTURING',  rate: 11,   rateLabel: '11% (ATL Individual/AOP - Toll Manufacturing)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-toll-aop-non-atl',   atlStatus: 'NON_ATL', taxpayerType: 'AOP',        subType: 'TOLL_MANUFACTURING',  rate: 22,   rateLabel: '22% (Non-ATL Individual/AOP - Toll Manufacturing)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-dist-atl',           atlStatus: 'ATL',     taxpayerType: null,         subType: 'DISTRIBUTOR_SPECIAL', rate: 0.25, rateLabel: '0.25% (ATL - Distributor/Dealer/Wholesaler)',       priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-dist-non-atl',       atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'DISTRIBUTOR_SPECIAL', rate: 0.5,  rateLabel: '0.5% (Non-ATL - Distributor/Dealer/Wholesaler)',    priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-yarn-atl',           atlStatus: 'ATL',     taxpayerType: null,         subType: 'YARN_TRADER',         rate: 0.5,  rateLabel: '0.5% (ATL - Yarn Trader)',                          priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-yarn-non-atl',       atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'YARN_TRADER',         rate: 1,    rateLabel: '1% (Non-ATL - Yarn Trader)',                        priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-cig-atl',            atlStatus: 'ATL',     taxpayerType: null,         subType: 'CIGARETTE',           rate: 2.5,  rateLabel: '2.5% (ATL - Cigarettes)',                           priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-cig-non-atl',        atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'CIGARETTE',           rate: 5,    rateLabel: '5% (Non-ATL - Cigarettes)',                         priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-pharma-atl',         atlStatus: 'ATL',     taxpayerType: null,         subType: 'PHARMA',              rate: 1,    rateLabel: '1% (ATL - Pharmaceutical Products)',                priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-pharma-non-atl',     atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'PHARMA',              rate: 2,    rateLabel: '2% (Non-ATL - Pharmaceutical Products)',            priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-agri-atl',           atlStatus: 'ATL',     taxpayerType: null,         subType: 'AGRI_COMMODITY',      rate: 1.5,  rateLabel: '1.5% (ATL - Agricultural Commodity)',               priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-agri-non-atl',       atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'AGRI_COMMODITY',      rate: 3,    rateLabel: '3% (Non-ATL - Agricultural Commodity)',             priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-textile-atl',        atlStatus: 'ATL',     taxpayerType: null,         subType: 'TEXTILE_SECTOR',      rate: 1,    rateLabel: '1% (ATL - Textile/Leather/Sports Sector)',          priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-textile-non-atl',    atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'TEXTILE_SECTOR',      rate: 2,    rateLabel: '2% (Non-ATL - Textile/Leather/Sports Sector)',      priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-gold-atl',           atlStatus: 'ATL',     taxpayerType: null,         subType: 'GOLD_SILVER',         rate: 1,    rateLabel: '1% (ATL - Gold, Silver & Articles)',                priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-gold-non-atl',       atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'GOLD_SILVER',         rate: 2,    rateLabel: '2% (Non-ATL - Gold, Silver & Articles)',            priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 153(1)(b) — Provision of Services ─────────────────────────
    // AMENDED — Finance Act 2026, First Schedule Part III Division III para 2.
    //   (i)   specified-services bucket 6% → 7%   → SPECIFIED 7/14
    //   (ii)  independent professionals (doctors/lawyers/architects/
    //         accountants/software engineers/developers) 15% → PROFESSIONALS 15/30 (NEW)
    //   (iii) electronic & print media advertising 1.5%  → PRINT_MEDIA 1.5/3 (re-confirmed)
    //   (iv)  terminal & port operating services 12%      → TERMINAL_PORT 12/24 (NEW)
    //   (v)   residual "other services" 14%               → OTHER_SERVICES 14/28 (was 15/30)
    // IT/ITeS (4/8) not amended by Division III → carried forward. EXPORTER /
    // SPECIFIED_SECTOR services (2nd Sch concessional 1/2) not amended → carried.
    // Non-ATL = ATL × 2 per Rule 1, Tenth Schedule (unchanged; encoded explicitly).
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
            { value: 'SPECIFIED',                 label: 'Specified Services (transport/freight/courier/hotel/security/etc.)' },
            { value: 'IT_ITES',                   label: 'IT / ITES Services' },
            { value: 'PRINT_MEDIA',               label: 'Electronic / Print Media (Advertising)' },
            { value: 'PROFESSIONALS',             label: 'Independent Professionals (Doctors/Lawyers/Architects/Accountants/Software Engineers)' },
            { value: 'TERMINAL_PORT',             label: 'Terminal & Port Operating Services (to Companies)' },
            { value: 'EXPORTER_SERVICES',         label: 'Services Rendered to Exporters (Stitching/Dyeing/Printing/Embroidery/Washing/Sizing/Weaving) — Cl. 11A Pt-IV 2nd Sch.' },
            { value: 'SPECIFIED_SECTOR_SERVICES', label: 'Services by Specified Sector Taxpayer (Textile/Carpets/Leather/Artificial Leather/Footwear/Surgical/Sports Goods) — Cl. 9A Pt-II 2nd Sch.' },
            { value: 'OTHER_SERVICES',            label: 'Other Services (Residual)' },
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
        // AMENDED — Finance Act 2026 Div III Pt III 1st Sch para 2(i): 6% → 7%
        { id: 'p26-153b-spec-atl',      atlStatus: 'ATL',     taxpayerType: null, subType: 'SPECIFIED',      rate: 7,   rateLabel: '7% (ATL - Specified Services)',   priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153b-spec-non-atl',  atlStatus: 'NON_ATL', taxpayerType: null, subType: 'SPECIFIED',      rate: 14,  rateLabel: '14% (Non-ATL - Specified Services)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        // CARRY-FORWARD — IT/ITeS not amended by Division III
        { id: 'p26-153b-it-atl',        atlStatus: 'ATL',     taxpayerType: null, subType: 'IT_ITES',        rate: 4,   rateLabel: '4% (ATL - IT/ITES Services)',             priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153b-it-non-atl',    atlStatus: 'NON_ATL', taxpayerType: null, subType: 'IT_ITES',        rate: 8,   rateLabel: '8% (Non-ATL - IT/ITES Services)',         priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        // RE-CONFIRMED — Finance Act 2026 Div III Pt III 1st Sch para 2(iii): 1.5% electronic & print media
        { id: 'p26-153b-media-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'PRINT_MEDIA',    rate: 1.5, rateLabel: '1.5% (ATL - Electronic/Print Media)',  priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153b-media-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'PRINT_MEDIA',    rate: 3,   rateLabel: '3% (Non-ATL - Electronic/Print Media)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        // NEW — Finance Act 2026 Div III Pt III 1st Sch para 2(ii): 15% independent professionals
        { id: 'p26-153b-prof-atl',      atlStatus: 'ATL',     taxpayerType: null, subType: 'PROFESSIONALS',  rate: 15,  rateLabel: '15% (ATL - Independent Professionals)',  priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153b-prof-non-atl',  atlStatus: 'NON_ATL', taxpayerType: null, subType: 'PROFESSIONALS',  rate: 30,  rateLabel: '30% (Non-ATL - Independent Professionals)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        // NEW — Finance Act 2026 Div III Pt III 1st Sch para 2(iv): 12% terminal & port operating services
        { id: 'p26-153b-terminal-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'TERMINAL_PORT', rate: 12, rateLabel: '12% (ATL - Terminal & Port Operating Services)',  priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153b-terminal-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'TERMINAL_PORT', rate: 24, rateLabel: '24% (Non-ATL - Terminal & Port Operating Services)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        // AMENDED — Finance Act 2026 Div III Pt III 1st Sch para 2(v): residual other services 14% (was 15%)
        { id: 'p26-153b-other-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'OTHER_SERVICES', rate: 14,  rateLabel: '14% (ATL - Other Services, Residual)',  priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153b-other-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'OTHER_SERVICES', rate: 28,  rateLabel: '28% (Non-ATL - Other Services, Residual)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        // CARRY-FORWARD — 2nd Schedule concessional categories (not amended)
        { id: 'p26-153b-exporter-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'EXPORTER_SERVICES',         rate: 1, rateLabel: '1% (ATL - Services Rendered to Exporters, Cl. 11A Pt-IV 2nd Sch.)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153b-exporter-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'EXPORTER_SERVICES',         rate: 2, rateLabel: '2% (Non-ATL - Services Rendered to Exporters, Cl. 11A Pt-IV 2nd Sch.)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153b-spec-sector-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'SPECIFIED_SECTOR_SERVICES', rate: 1, rateLabel: '1% (ATL - Specified Sector Services, Cl. 9A Pt-II 2nd Sch.)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153b-spec-sector-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'SPECIFIED_SECTOR_SERVICES', rate: 2, rateLabel: '2% (Non-ATL - Specified Sector Services, Cl. 9A Pt-II 2nd Sch.)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 153(1)(c) — Execution of Contracts ────────────────────────
    // Sportsperson: 15/30 (Non-ATL ×2 per Rule 1 Tenth Schedule).
    // TY2027 rates implemented as per Moore Shekha Mufti WHT Chart for 1 July
    // release. Subject to reconciliation against any subsequent FBR clarification.
    // NOTE: the enacted Finance Act 2026 (First Schedule Part III Division IIIAA,
    // docs/Finance_Act_2026.md line 3180-3181) substitutes 15% → 20%; this is an
    // intentional controlled-release implementation decision to follow the Moore
    // chart (15/30) pending FBR reconciliation. STANDARD contract rates NOT
    // amended → carried forward from fy2026 (7.5/15 Company, 8/16 Individual/AOP).
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
        // Sportsperson 15/30 per Moore TY2027 Chart (controlled 1 July release decision)
        { id: 'p26-153c-sport-atl',      atlStatus: 'ATL',     taxpayerType: null,         subType: 'SPORTSPERSON', rate: 15,  rateLabel: '15% (ATL - Sportsperson)',      priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153c-sport-non-atl',  atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'SPORTSPERSON', rate: 30,  rateLabel: '30% (Non-ATL - Sportsperson)',  priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        // CARRY-FORWARD — Standard contract rates not amended by Finance Act 2026
        { id: 'p26-153c-std-comp-atl',    atlStatus: 'ATL',     taxpayerType: 'COMPANY',    subType: 'STANDARD',     rate: 7.5, rateLabel: '7.5% (ATL Company - Standard Contract)',           priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153c-std-comp-non-atl',atlStatus: 'NON_ATL', taxpayerType: 'COMPANY',    subType: 'STANDARD',     rate: 15,  rateLabel: '15% (Non-ATL Company - Standard Contract)',         priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153c-std-ind-atl',     atlStatus: 'ATL',     taxpayerType: 'INDIVIDUAL', subType: 'STANDARD',     rate: 8,   rateLabel: '8% (ATL Individual/AOP - Standard Contract)',      priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153c-std-ind-non-atl', atlStatus: 'NON_ATL', taxpayerType: 'INDIVIDUAL', subType: 'STANDARD',     rate: 16,  rateLabel: '16% (Non-ATL Individual/AOP - Standard Contract)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153c-std-aop-atl',     atlStatus: 'ATL',     taxpayerType: 'AOP',        subType: 'STANDARD',     rate: 8,   rateLabel: '8% (ATL Individual/AOP - Standard Contract)',      priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153c-std-aop-non-atl', atlStatus: 'NON_ATL', taxpayerType: 'AOP',        subType: 'STANDARD',     rate: 16,  rateLabel: '16% (Non-ATL Individual/AOP - Standard Contract)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 153(2A) — Digital Transactions (E-Commerce) ───────────────
    // CARRY-FORWARD. Reviewed against Finance Act 2026 — no amendment to the
    // §153(2A) digital-transaction rates (Div III Pt III 1st Sch). Rates
    // identical to fy2026.ts.
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
        { id: 'p26-6a-digital-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'DIGITAL_PAYMENT', rate: 1, rateLabel: '1% (ATL - Digital Payment)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-6a-digital-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'DIGITAL_PAYMENT', rate: 2, rateLabel: '2% (Non-ATL - Digital Payment)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-6a-cod-atl',         atlStatus: 'ATL',     taxpayerType: null, subType: 'COD',             rate: 2, rateLabel: '2% (ATL - Cash on Delivery)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-6a-cod-non-atl',     atlStatus: 'NON_ATL', taxpayerType: null, subType: 'COD',             rate: 4, rateLabel: '4% (Non-ATL - Cash on Delivery)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 154 — Exports ─────────────────────────────────────────────
    // Finance Act 2026, First Schedule Part III Division IV, paragraphs (1) and
    // (3): the §154 export minimum-tax rate is 1.25% (raised from 1%). Per the
    // approved Moore-alignment decision, ONLY the §154 withholding tax is
    // modelled — the separate §147 advance-tax component is NOT included, and
    // the earlier combined 2.25% presentation has been removed. The Moore
    // TY2027 Chart shows §154 exports at 1.25% (minimum). Afghan cooking-oil 0%
    // (conditional) is unchanged. No Filer/Non-Filer split applies.
    {
      code: '154',
      displayOrder: 10,
      label: 'Section 154 - Exports',
      legalReference: 'Section 154 Income Tax Ordinance 2001',
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
          helperText: 'Finance Act 2026: standard export realization is taxed at 1.25% Minimum Tax (§154, Div IV(1)&(3)). No Filer/Non-Filer split applies.',
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
        { id: 'p26-154-standard', atlStatus: null, taxpayerType: null, subType: 'STANDARD_EXPORT',    rate: 1.25, rateLabel: '1.25% (Minimum Tax - Sec 154)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-154-afghan',   atlStatus: null, taxpayerType: null, subType: 'AFGHAN_COOKING_OIL', rate: 0, rateLabel: '0% (Cooking Oil/Ghee exported to Afghanistan, Sec 148 tax paid)',                   priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 154A — Export of Services ─────────────────────────────────
    // Finance Act 2026 amended Division IVA only to extend the concessional
    // regime's sunset from tax year "2026" to "2029" (Pt III amendment (vi)); it
    // made NO rate change. Per the approved Moore-alignment decision, the earlier
    // Non-ATL doubling assumption (0.5% / 2%) is REMOVED: the Moore TY2027 Chart
    // shows single rates with no Filer/Non-Filer split — PSEB Software/IT/ITeS
    // 0.25% and all other §154A(b)-(e) services 1%. Rules are therefore single,
    // filer-status-blind (atlStatus: null); the ATL selector is removed from the
    // form because it no longer affects the outcome.
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
          helperText: 'A single rate applies with no Filer/Non-Filer split — 0.25% for PSEB software/IT/ITeS exports, 1% for other exported services.',
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
      ],
      rules: [
        { id: 'p26-154a-pseb',  atlStatus: null, taxpayerType: null, subType: 'PSEB_IT_ITES',   rate: 0.25, rateLabel: '0.25% (PSEB Registered Software/IT/ITeS Export, Final Tax — concessionary regime available through Tax Year 2028-29)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-154a-other', atlStatus: null, taxpayerType: null, subType: 'OTHER_SERVICES', rate: 1,    rateLabel: '1% (Technical Services / Royalty / Franchise / Foreign Contracts / Indenting)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 155 — Rent of Immovable Property ──────────────────────────
    // BATCH 2 COMPLETE (re-verified, UNCHANGED). No §155 amendment in Finance
    // Act 2026 (slab top rate stays 25%). Carried forward verbatim from fy2026;
    // the previous fy2027.ts placeholder's top-rate cut to 15% had no legal
    // basis and is not reproduced. Removed from the engineering queue.
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
      slabs: [
        { from: 0,       to: 300000, fixedTax: 0,      rate: 0,  label: 'Up to Rs. 300,000' },
        { from: 300001,  to: 600000, fixedTax: 0,      rate: 5,  label: 'Rs. 300,001 to 600,000' },
        { from: 600001,  to: 2000000,fixedTax: 15000,  rate: 10, label: 'Rs. 600,001 to 2,000,000' },
        { from: 2000001, to: null,   fixedTax: 155000, rate: 25, label: 'Above Rs. 2,000,000' },
      ],
      rules: [
        { id: 'p26-155-comp-atl',     atlStatus: 'ATL',     taxpayerType: 'COMPANY', subType: null, rate: 15, rateLabel: '15% (ATL Company Rent)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-155-comp-non-atl', atlStatus: 'NON_ATL', taxpayerType: 'COMPANY', subType: null, rate: 30, rateLabel: '30% (Non-ATL Company Rent)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 156 — Prizes and Winnings ─────────────────────────────────
    // CARRY-FORWARD. Reviewed against Finance Act 2026 — no amendment to the
    // §156 rates (Div IV Pt III 1st Sch). Rates identical to fy2026.ts.
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
        { id: 'p26-156-bond-atl',      atlStatus: 'ATL',     taxpayerType: null, subType: 'PRIZE_BOND',     rate: 15, rateLabel: '15% (ATL - Prize Bond Winnings)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-156-bond-non-atl',  atlStatus: 'NON_ATL', taxpayerType: null, subType: 'PRIZE_BOND',     rate: 30, rateLabel: '30% (Non-ATL - Prize Bond Winnings)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-156-other-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'OTHER_WINNINGS', rate: 20, rateLabel: '20% (ATL - Other Winnings)',          priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-156-other-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'OTHER_WINNINGS', rate: 40, rateLabel: '40% (Non-ATL - Other Winnings)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 233 — Brokerage and Commission ────────────────────────────
    // CARRY-FORWARD. Reviewed against Finance Act 2026 — no amendment to the
    // §233 rates (Div II Pt IV 1st Sch). Rates and the LIFE_INSURANCE_AGENT
    // LOW/HIGH threshold-switching mechanism (annualCommissionTotal field,
    // derived in engine.ts) are identical to fy2026.ts. (The previous fy2027.ts
    // placeholder had deleted the threshold mechanism; restored here.)
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
        { id: 'p26-233-adv-atl',      atlStatus: 'ATL',     taxpayerType: null, subType: 'ADVERTISING_AGENT',    rate: 10, rateLabel: '10% (ATL - Advertising Agent)',                          priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-233-adv-non-atl',  atlStatus: 'NON_ATL', taxpayerType: null, subType: 'ADVERTISING_AGENT',    rate: 20, rateLabel: '20% (Non-ATL - Advertising Agent)',                       priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-233-life-low-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'LIFE_INSURANCE_AGENT_LOW',  rate: 8,  rateLabel: '8% (ATL - Life Insurance Agent, annual commission < PKR 500,000)',          priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-233-life-low-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'LIFE_INSURANCE_AGENT_LOW',  rate: 16, rateLabel: '16% (Non-ATL - Life Insurance Agent, annual commission < PKR 500,000)',      priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-233-life-high-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'LIFE_INSURANCE_AGENT_HIGH', rate: 12, rateLabel: '12% (ATL - Life Insurance Agent, annual commission ≥ PKR 500,000 — residual rate)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-233-life-high-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'LIFE_INSURANCE_AGENT_HIGH', rate: 24, rateLabel: '24% (Non-ATL - Life Insurance Agent, annual commission ≥ PKR 500,000 — residual rate)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-233-other-atl',    atlStatus: 'ATL',     taxpayerType: null, subType: 'OTHER',                rate: 12, rateLabel: '12% (ATL - Other Brokerage/Commission)',                  priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-233-other-non-atl',atlStatus: 'NON_ATL', taxpayerType: null, subType: 'OTHER',                rate: 24, rateLabel: '24% (Non-ATL - Other Brokerage/Commission)',             priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 236C — Sale/Transfer of Immovable Property ────────────────
    // AMENDED — Finance Act 2026, First Schedule Part IV Division X fully
    // SUBSTITUTED: "The rate of tax to be collected under §236C shall be 2.75%
    // of the gross amount of the consideration received." The FMV-band table
    // is removed for the FILER rate, which is now a single flat 2.75%.
    // Tenth Schedule Rule 1A (Late Filer) is omitted by the Act, but Rule 1
    // itself is NOT touched — the Act's substituted Division X is silent on
    // Non-Filer treatment, it only restates the filer figure. HOTFIX-P0:
    // the Non-ATL rate is therefore carried forward UNCHANGED from FY2025-26
    // (11.5% flat across all FMV bands — this was already a flat, non-doubled
    // figure in fy2026.ts, not a function of the ATL rate). An earlier draft
    // of this file incorrectly assumed Non-ATL = 2.75% × 2 = 5.5%; that
    // assumption is not supported by the Act text and is contradicted by the
    // Moore Shekha Mufti TY2027 WHT Chart, which shows 11.5% Non-Filer
    // unchanged from TY2025-26. Confirm against the final FBR TY2027 WHT card
    // when published.
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
          placeholder: 'Enter gross consideration received',
          required: true,
          amountField: true,
          helperText: 'Finance Act 2026: Filer rate is a single flat 2.75% of the gross consideration; Non-Filer rate is 11.5%. FMV banding no longer applies to the Filer rate.',
        },
        {
          key: 'atlStatus',
          label: 'Filer Status (Seller)',
          type: 'radio',
          required: true,
          options: [
            { value: 'ATL',     label: 'Active Taxpayer (ATL)' },
            { value: 'NON_ATL', label: 'Non-Filer (Not on ATL)' },
          ],
        },
      ],
      rules: [
        { id: 'p26-236C-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: null, rate: 2.75, rateLabel: '2.75% (ATL Seller)',    priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-236C-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: null, rate: 11.5, rateLabel: '11.5% (Non-ATL Seller)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 236K — Purchase of Immovable Property ─────────────────────
    // AMENDED — Finance Act 2026, First Schedule Part IV Division XVIII fully
    // SUBSTITUTED: "The rate of tax to be collected under §236K shall be 1.25%
    // of the fair market value of the immovable property." As with §236C, the
    // Act's substituted Division only restates the FILER figure; it is silent
    // on Non-Filer treatment, and Tenth Schedule Rule 1 (general non-filer
    // provision) is not amended. HOTFIX-P0: the Non-ATL rate is carried
    // forward UNCHANGED from FY2025-26 — it was already FMV-banded there
    // (10.5% / 14.5% / 18.5%) independent of the filer rate, not a doubled
    // figure. An earlier draft of this file incorrectly assumed a single flat
    // Non-ATL rate of 2.5% (1.25% × 2); that is not supported by the Act text
    // and is contradicted by the Moore Shekha Mufti TY2027 WHT Chart, which
    // shows the same FMV-banded 10.5%/14.5%/18.5% Non-Filer schedule as
    // TY2025-26. The engine's generic FMV-band derivation (engine.ts, keyed
    // off the presence of an 'FMV_LE_50M' rule) is reused here for the
    // Non-ATL rules only; the ATL rule remains a flat, band-independent rate
    // (subType: null matches any derived band). Confirm against the final
    // FBR TY2027 WHT card when published.
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
          helperText: 'Finance Act 2026: Filer rate is a single flat 1.25% of the fair market value. Non-Filer rate is FMV-banded: 10.5% up to Rs 50M, 14.5% Rs 50M-100M, 18.5% over Rs 100M.',
        },
        {
          key: 'atlStatus',
          label: 'Filer Status (Buyer)',
          type: 'radio',
          required: true,
          options: [
            { value: 'ATL',     label: 'Active Taxpayer (ATL)' },
            { value: 'NON_ATL', label: 'Non-Filer (Not on ATL)' },
          ],
        },
      ],
      rules: [
        { id: 'p26-236K-atl',            atlStatus: 'ATL',     taxpayerType: null, subType: null,              rate: 1.25, rateLabel: '1.25% (ATL Buyer)',                          priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-236K-nonatl-le50m',    atlStatus: 'NON_ATL', taxpayerType: null, subType: 'FMV_LE_50M',      rate: 10.5, rateLabel: '10.5% (Non-ATL Buyer, FMV up to Rs 50M)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-236K-nonatl-50to100m', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'FMV_50M_TO_100M', rate: 14.5, rateLabel: '14.5% (Non-ATL Buyer, FMV Rs 50M-100M)',   priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-236K-nonatl-gt100m',   atlStatus: 'NON_ATL', taxpayerType: null, subType: 'FMV_GT_100M',     rate: 18.5, rateLabel: '18.5% (Non-ATL Buyer, FMV over Rs 100M)',    priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 151B — Payments by Life Insurance Companies & Takaful Operators ─
    // NEW SECTION — Finance Act 2026 (inserts §151B after §151A) + new Division
    // IC, Part III, First Schedule. A life insurer / family- or window-takaful
    // operator deducts tax on any payout/benefit/surrender/maturity to an
    // INDIVIDUAL. The amount liable to tax is the GROSS payout reduced by the
    // aggregate premiums/contributions paid (s.151B(2)); the rate depends on the
    // timing band (Division IC) and the deduction is FINAL TAX (s.151B(4)).
    //   • within 1 year of issuance            → 15%
    //   • after 1 year but before 4 years      → 10%
    //   • after 4 years, or on death/disability → exempt (no deduction), s.151B(3)
    // No ATL/Non-ATL split (Division IC states single band rates). The
    // net-of-premiums base is computed in engine.ts (dedicated §151B branch).
    // Tenth Schedule rule 10(aa) places §151B-non-resident deductions on the
    // no-100%-increase list (consistent with no filer doubling here).
    {
      code: '151B',
      displayOrder: 17,
      label: 'Section 151B - Life Insurance / Takaful Payouts',
      legalReference: 'Section 151B Income Tax Ordinance 2001 (read with Division IC, Part III, First Schedule)',
      displayName: 'Life Insurance Payouts',
      shortDescription: 'Payout / surrender / maturity from a life insurance policy or takaful',
      icon: '🛡️',
      category: 'Investment Income',
      transactionFields: [
        {
          key: 'payoutAmount',
          label: 'Gross Payout / Benefit (PKR)',
          type: 'number',
          placeholder: 'Enter gross payout, surrender value or maturity proceeds',
          required: true,
          amountField: true,
          helperText: 'The taxable amount is this gross payout reduced by the total premiums/contributions you paid (s.151B(2)).',
        },
        {
          key: 'premiumsPaid',
          label: 'Aggregate Premiums / Contributions Paid (PKR)',
          type: 'number',
          placeholder: 'Enter total premiums/contributions paid over the policy life',
          required: true,
        },
        {
          key: 'subType',
          label: 'Timing of Payout',
          type: 'select',
          required: true,
          options: [
            { value: 'WITHIN_1Y',            label: 'Within 1 year of policy/certificate issuance (15%)' },
            { value: 'AFTER_1Y_BEFORE_4Y',   label: 'After 1 year but before 4 years (10%)' },
            { value: 'EXEMPT_4Y_DEATH_DISAB', label: 'After 4 years, or on death/disability (exempt — s.151B(3))' },
          ],
        },
      ],
      rules: [
        // Division IC, Part III, First Schedule. atlStatus/taxpayerType null —
        // single rate per timing band; applied to the net-of-premiums base.
        { id: 'p26-151B-within1y',  atlStatus: null, taxpayerType: null, subType: 'WITHIN_1Y',             rate: 15, rateLabel: '15% Final Tax (payout within 1 year — Div IC(1)) on payout less premiums',          priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-151B-1to4y',     atlStatus: null, taxpayerType: null, subType: 'AFTER_1Y_BEFORE_4Y',    rate: 10, rateLabel: '10% Final Tax (payout after 1 year, before 4 years — Div IC(2)) on payout less premiums', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-151B-exempt',    atlStatus: null, taxpayerType: null, subType: 'EXEMPT_4Y_DEATH_DISAB', rate: 0,  rateLabel: '0% (exempt — after 4 years, or on death/disability — s.151B(3))',                  priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 154B — Withholding Tax on Social-Media Platform Revenue ────
    // NEW SECTION — Finance Act 2026 (inserts §154B after §154A) + new Division
    // IIIAB, Part III, First Schedule. A banking / non-banking financial
    // institution deducts tax, at credit or receipt into a person's account, on
    // amounts representing revenue received from social media platforms
    // (YouTube/Facebook/Instagram/TikTok/etc.). Rate is a flat 5%
    // (Division IIIAB). Treatment per s.154B(3): MINIMUM tax for a resident;
    // FINAL tax for a non-resident with no permanent establishment (the latter
    // is added to the §169 final-tax list). The 5% rate is identical for both;
    // the resident/non-resident choice drives only the minimum-vs-final label.
    {
      code: '154B',
      displayOrder: 18,
      label: 'Section 154B - Social Media Platform Revenue',
      legalReference: 'Section 154B Income Tax Ordinance 2001 (read with Division IIIAB, Part III, First Schedule)',
      displayName: 'Social Media Revenue',
      shortDescription: 'Revenue received from social media platforms (content creators / influencers)',
      icon: '📱',
      category: 'Goods & Services',
      transactionFields: [
        {
          key: 'revenueAmount',
          label: 'Social Media Revenue Received (PKR)',
          type: 'number',
          placeholder: 'Enter the amount credited/received from social media platforms',
          required: true,
          amountField: true,
        },
        {
          key: 'subType',
          label: 'Recipient Residency',
          type: 'select',
          required: true,
          options: [
            { value: 'RESIDENT',           label: 'Resident person (5% — Minimum Tax)' },
            { value: 'NON_RESIDENT_NO_PE', label: 'Non-resident without a Permanent Establishment (5% — Final Tax)' },
          ],
        },
      ],
      rules: [
        // Division IIIAB, Part III, First Schedule — flat 5% both cases.
        { id: 'p26-154B-resident',     atlStatus: null, taxpayerType: null, subType: 'RESIDENT',           rate: 5, rateLabel: '5% Minimum Tax (resident — Div IIIAB §154B)',                       priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-154B-nonresident',  atlStatus: null, taxpayerType: null, subType: 'NON_RESIDENT_NO_PE', rate: 5, rateLabel: '5% Final Tax (non-resident without PE — Div IIIAB §154B, s.169)',    priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },
  ],
};
