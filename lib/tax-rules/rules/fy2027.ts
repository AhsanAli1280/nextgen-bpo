import { WhtRateConfig } from '../types';

export const configFY2027: WhtRateConfig = {
  financeActYear: 2026, // Governing FY2026-27
  effectiveFrom: '2026-07-01',
  effectiveTo: '2027-06-30',
  sections: [
    // ── Section 148 — Imports ─────────────────────────────────────────────
    // [PLACEHOLDER] — carried forward from FY2025-26. Pending Finance Act 2026.
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
        { id: 'p26-148-12sch1-atl',      atlStatus: 'ATL',     taxpayerType: null, subType: 'TWELFTH_SCH_PART_I',             rate: 1,   rateLabel: '[PLACEHOLDER] 1% (ATL - Twelfth Schedule Part I, All Importers)',                priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-12sch1-non-atl',  atlStatus: 'NON_ATL', taxpayerType: null, subType: 'TWELFTH_SCH_PART_I',             rate: 2,   rateLabel: '[PLACEHOLDER] 2% (Non-ATL - Twelfth Schedule Part I, All Importers)',            priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-12sch2-comm-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'TWELFTH_SCH_PART_II_COMMERCIAL', rate: 3.5, rateLabel: '[PLACEHOLDER] 3.5% (ATL - Twelfth Schedule Part II, Commercial Importers)',      priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-12sch2-comm-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'TWELFTH_SCH_PART_II_COMMERCIAL', rate: 7,   rateLabel: '[PLACEHOLDER] 7% (Non-ATL - Twelfth Schedule Part II, Commercial Importers)',    priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-12sch2-other-atl',    atlStatus: 'ATL',     taxpayerType: null, subType: 'TWELFTH_SCH_PART_II_OTHER',      rate: 2,   rateLabel: '[PLACEHOLDER] 2% (ATL - Twelfth Schedule Part II, Other Importers)',             priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-12sch2-other-non-atl',atlStatus: 'NON_ATL', taxpayerType: null, subType: 'TWELFTH_SCH_PART_II_OTHER',      rate: 4,   rateLabel: '[PLACEHOLDER] 4% (Non-ATL - Twelfth Schedule Part II, Other Importers)',         priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-12sch3-comm-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'TWELFTH_SCH_PART_III_COMMERCIAL',rate: 6,   rateLabel: '[PLACEHOLDER] 6% (ATL - Twelfth Schedule Part III, Commercial Importers)',       priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-12sch3-comm-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'TWELFTH_SCH_PART_III_COMMERCIAL',rate: 12,  rateLabel: '[PLACEHOLDER] 12% (Non-ATL - Twelfth Schedule Part III, Commercial Importers)',  priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-12sch3-other-atl',    atlStatus: 'ATL',     taxpayerType: null, subType: 'TWELFTH_SCH_PART_III_OTHER',     rate: 5.5, rateLabel: '[PLACEHOLDER] 5.5% (ATL - Twelfth Schedule Part III, Other Importers)',          priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-12sch3-other-non-atl',atlStatus: 'NON_ATL', taxpayerType: null, subType: 'TWELFTH_SCH_PART_III_OTHER',     rate: 11,  rateLabel: '[PLACEHOLDER] 11% (Non-ATL - Twelfth Schedule Part III, Other Importers)',       priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-sro1125-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'SRO_1125_MANUFACTURERS',         rate: 1,   rateLabel: '[PLACEHOLDER] 1% (ATL - SRO 1125(I)/2011, Manufacturers)',                       priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-sro1125-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'SRO_1125_MANUFACTURERS',         rate: 2,   rateLabel: '[PLACEHOLDER] 2% (Non-ATL - SRO 1125(I)/2011, Manufacturers)',                   priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-medicines-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'MEDICINES_DRAP', rate: 4, rateLabel: '[PLACEHOLDER] 4% (ATL - Medicines Not Manufactured Locally, DRAP Certified)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-medicines-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'MEDICINES_DRAP', rate: 8, rateLabel: '[PLACEHOLDER] 8% (Non-ATL - Medicines Not Manufactured Locally, DRAP Certified)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-ev-ckd-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'EV_LCV_CKD_KITS', rate: 1, rateLabel: '[PLACEHOLDER] 1% (ATL - EV/LCV CKD Kits)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-148-ev-ckd-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'EV_LCV_CKD_KITS', rate: 2, rateLabel: '[PLACEHOLDER] 2% (Non-ATL - EV/LCV CKD Kits)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
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
      ],
      slabs: [
        { from: 0, to: 600000, fixedTax: 0, rate: 0, label: 'Up to Rs. 600,000' },
        { from: 600001, to: 1200000, fixedTax: 0, rate: 5, label: 'Rs. 600,001 to 1,200,000' },
        { from: 1200001, to: 2400000, fixedTax: 30000, rate: 15, label: 'Rs. 1,200,001 to 2,400,000' },
        { from: 2400001, to: 3600000, fixedTax: 210000, rate: 25, label: 'Rs. 2,400,001 to 3,600,000' },
        { from: 3600001, to: 6000000, fixedTax: 510000, rate: 30, label: 'Rs. 3,600,001 to 6,000,000' },
        { from: 6000001, to: null, fixedTax: 1230000, rate: 35, label: 'Above Rs. 6,000,000' },
      ],
      rules: [], // Handled via slabs
    },
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
            { value: 'LISTED', label: 'Listed Company Dividend' },
            { value: 'BONUS_SHARES', label: 'Bonus Shares' },
            { value: 'POWER_COMPANY', label: 'Power Generation Company' },
            { value: 'MUTUAL_FUND', label: 'Mutual Fund Dividend' },
          ],
        },
        {
          key: 'atlStatus',
          label: 'ATL Status',
          type: 'radio',
          required: true,
          options: [
            { value: 'ATL', label: 'Active (Filer)' },
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
            { value: 'AOP', label: 'Association of Persons (AOP)' },
            { value: 'COMPANY', label: 'Company' },
          ],
        },
      ],
      rules: [
        // Listed company WHT rules
        { id: '150-listed-atl', atlStatus: 'ATL', taxpayerType: null, subType: 'LISTED', rate: 15, rateLabel: '15% (ATL Filer - Listed Dividend)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: '150-listed-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'LISTED', rate: 30, rateLabel: '30% (Non-ATL - Listed Dividend)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        // Bonus shares WHT rules
        { id: '150-bonus-atl', atlStatus: 'ATL', taxpayerType: null, subType: 'BONUS_SHARES', rate: 10, rateLabel: '10% (ATL Filer - Bonus Shares)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: '150-bonus-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'BONUS_SHARES', rate: 20, rateLabel: '20% (Non-ATL - Bonus Shares)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        // Power company WHT rules
        { id: '150-power-atl', atlStatus: 'ATL', taxpayerType: null, subType: 'POWER_COMPANY', rate: 7.5, rateLabel: '7.5% (ATL Filer - Power Company)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: '150-power-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'POWER_COMPANY', rate: 15, rateLabel: '15% (Non-ATL - Power Company)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        // Mutual fund WHT rules
        { id: '150-fund-atl', atlStatus: 'ATL', taxpayerType: null, subType: 'MUTUAL_FUND', rate: 25, rateLabel: '25% (ATL Filer - Mutual Fund)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: '150-fund-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'MUTUAL_FUND', rate: 50, rateLabel: '50% (Non-ATL - Mutual Fund)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },
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
        },
        {
          key: 'subType',
          label: 'Instrument Type',
          type: 'select',
          required: true,
          options: [
            { value: 'BANK', label: 'Bank Account/Deposit' },
            { value: 'NSSF', label: 'National Savings Scheme (NSSF)' },
            { value: 'GOVT_SEC', label: 'Government Security' },
          ],
        },
        {
          key: 'atlStatus',
          label: 'ATL Status',
          type: 'radio',
          required: true,
          options: [
            { value: 'ATL', label: 'Active (Filer)' },
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
            { value: 'AOP', label: 'Association of Persons (AOP)' },
            { value: 'COMPANY', label: 'Company' },
          ],
        },
      ],
      rules: [
        // Bank deposits
        { id: '151-bank-atl', atlStatus: 'ATL', taxpayerType: null, subType: 'BANK', rate: 15, rateLabel: '15% (ATL Filer - Bank Deposit)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: '151-bank-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'BANK', rate: 30, rateLabel: '30% (Non-ATL - Bank Deposit)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        // NSSF
        { id: '151-nssf-atl', atlStatus: 'ATL', taxpayerType: null, subType: 'NSSF', rate: 10, rateLabel: '10% (ATL Filer - NSSF)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: '151-nssf-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'NSSF', rate: 20, rateLabel: '20% (Non-ATL - NSSF)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        // Government security
        { id: '151-govt-atl', atlStatus: 'ATL', taxpayerType: null, subType: 'GOVT_SEC', rate: 15, rateLabel: '15% (ATL Filer - Gov Security)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: '151-govt-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'GOVT_SEC', rate: 30, rateLabel: '30% (Non-ATL - Gov Security)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 152 — Payments to Non-Residents (Phase 1: domestic rates) ──
    // [PLACEHOLDER] — carried forward from FY2025-26. Pending Finance Act 2026.
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
          ],
        },
      ],
      rules: [
        { id: 'p26-152-royalty-fts',  atlStatus: null, taxpayerType: null, subType: 'ROYALTY_FTS',              rate: 15, rateLabel: '[PLACEHOLDER] 15% (Royalty / Fee for Technical Services - Sec 152(1))',                    priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-construction', atlStatus: null, taxpayerType: null, subType: 'CONSTRUCTION_CONTRACTS',   rate: 7,  rateLabel: '[PLACEHOLDER] 7% (Minimum Tax - Construction/Assembly/Installation/Supervisory Contracts - Sec 152(1A))', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-insurance',    atlStatus: null, taxpayerType: null, subType: 'INSURANCE_PREMIUM',        rate: 5,  rateLabel: '[PLACEHOLDER] 5% (Minimum Tax - Insurance/Re-Insurance Premium - Sec 152(1AA))',              priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-advertisement',atlStatus: null, taxpayerType: null, subType: 'ADVERTISEMENT_NR_MEDIA',   rate: 10, rateLabel: '[PLACEHOLDER] 10% (Minimum Tax - Advertisement Services by Non-Resident Media - Sec 152(1AAA))', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-152-offshore-digital', atlStatus: null, taxpayerType: null, subType: 'OFFSHORE_DIGITAL_SERVICES', rate: 10, rateLabel: '[PLACEHOLDER] 10% (Offshore Digital Services, Banking Channel Remittance - Sec 152(1C))', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 153(1)(a) — Supply of Goods ──────────────────────────────────
    // NOTE: OTHER_GOODS rates from fy2027 original. All extended categories and
    // new sub-types (TEXTILE_SECTOR, GOLD_SILVER) are [PLACEHOLDER] copied from
    // FY2025-26 pending FBR FY2026-27 WHT Card validation.
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
        // Other Goods — preserved from fy2027 original rates
        { id: 'p26-153a-other-comp-atl',     atlStatus: 'ATL',     taxpayerType: 'COMPANY',    subType: 'OTHER_GOODS',         rate: 4,    rateLabel: '4% (ATL Company - Other Goods)',                    priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-other-comp-non-atl', atlStatus: 'NON_ATL', taxpayerType: 'COMPANY',    subType: 'OTHER_GOODS',         rate: 8,    rateLabel: '8% (Non-ATL Company - Other Goods)',                priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-other-ind-atl',      atlStatus: 'ATL',     taxpayerType: 'INDIVIDUAL', subType: 'OTHER_GOODS',         rate: 4.5,  rateLabel: '4.5% (ATL Individual/AOP - Other Goods)',           priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-other-ind-non-atl',  atlStatus: 'NON_ATL', taxpayerType: 'INDIVIDUAL', subType: 'OTHER_GOODS',         rate: 9,    rateLabel: '9% (Non-ATL Individual/AOP - Other Goods)',         priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-other-aop-atl',      atlStatus: 'ATL',     taxpayerType: 'AOP',        subType: 'OTHER_GOODS',         rate: 4.5,  rateLabel: '4.5% (ATL Individual/AOP - Other Goods)',           priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-other-aop-non-atl',  atlStatus: 'NON_ATL', taxpayerType: 'AOP',        subType: 'OTHER_GOODS',         rate: 9,    rateLabel: '9% (Non-ATL Individual/AOP - Other Goods)',         priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        // Toll Manufacturing — [PLACEHOLDER] awaiting FBR FY2026-27 WHT Card validation
        { id: 'p26-153a-toll-comp-atl',      atlStatus: 'ATL',     taxpayerType: 'COMPANY',    subType: 'TOLL_MANUFACTURING',  rate: 9,    rateLabel: '[PLACEHOLDER] 9% (ATL Company - Toll Manufacturing)',             priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-toll-comp-non-atl',  atlStatus: 'NON_ATL', taxpayerType: 'COMPANY',    subType: 'TOLL_MANUFACTURING',  rate: 18,   rateLabel: '[PLACEHOLDER] 18% (Non-ATL Company - Toll Manufacturing)',        priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-toll-ind-atl',       atlStatus: 'ATL',     taxpayerType: 'INDIVIDUAL', subType: 'TOLL_MANUFACTURING',  rate: 11,   rateLabel: '[PLACEHOLDER] 11% (ATL Individual/AOP - Toll Manufacturing)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-toll-ind-non-atl',   atlStatus: 'NON_ATL', taxpayerType: 'INDIVIDUAL', subType: 'TOLL_MANUFACTURING',  rate: 22,   rateLabel: '[PLACEHOLDER] 22% (Non-ATL Individual/AOP - Toll Manufacturing)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-toll-aop-atl',       atlStatus: 'ATL',     taxpayerType: 'AOP',        subType: 'TOLL_MANUFACTURING',  rate: 11,   rateLabel: '[PLACEHOLDER] 11% (ATL Individual/AOP - Toll Manufacturing)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-toll-aop-non-atl',   atlStatus: 'NON_ATL', taxpayerType: 'AOP',        subType: 'TOLL_MANUFACTURING',  rate: 22,   rateLabel: '[PLACEHOLDER] 22% (Non-ATL Individual/AOP - Toll Manufacturing)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        // Special categories — [PLACEHOLDER] copied from FY2025-26 pending FBR validation
        { id: 'p26-153a-dist-atl',           atlStatus: 'ATL',     taxpayerType: null,         subType: 'DISTRIBUTOR_SPECIAL', rate: 0.25, rateLabel: '[PLACEHOLDER] 0.25% (ATL - Distributor/Dealer/Wholesaler)',      priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-dist-non-atl',       atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'DISTRIBUTOR_SPECIAL', rate: 0.5,  rateLabel: '[PLACEHOLDER] 0.5% (Non-ATL - Distributor/Dealer/Wholesaler)',   priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-yarn-atl',           atlStatus: 'ATL',     taxpayerType: null,         subType: 'YARN_TRADER',         rate: 0.5,  rateLabel: '[PLACEHOLDER] 0.5% (ATL - Yarn Trader)',                         priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-yarn-non-atl',       atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'YARN_TRADER',         rate: 1,    rateLabel: '[PLACEHOLDER] 1% (Non-ATL - Yarn Trader)',                       priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-cig-atl',            atlStatus: 'ATL',     taxpayerType: null,         subType: 'CIGARETTE',           rate: 2.5,  rateLabel: '[PLACEHOLDER] 2.5% (ATL - Cigarettes)',                          priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-cig-non-atl',        atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'CIGARETTE',           rate: 5,    rateLabel: '[PLACEHOLDER] 5% (Non-ATL - Cigarettes)',                        priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-pharma-atl',         atlStatus: 'ATL',     taxpayerType: null,         subType: 'PHARMA',              rate: 1,    rateLabel: '[PLACEHOLDER] 1% (ATL - Pharmaceutical Products)',               priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-pharma-non-atl',     atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'PHARMA',              rate: 2,    rateLabel: '[PLACEHOLDER] 2% (Non-ATL - Pharmaceutical Products)',           priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-agri-atl',           atlStatus: 'ATL',     taxpayerType: null,         subType: 'AGRI_COMMODITY',      rate: 1.5,  rateLabel: '[PLACEHOLDER] 1.5% (ATL - Agricultural Commodity)',              priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-agri-non-atl',       atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'AGRI_COMMODITY',      rate: 3,    rateLabel: '[PLACEHOLDER] 3% (Non-ATL - Agricultural Commodity)',            priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        // Textile/Leather/Sports sector and Gold/Silver — [PLACEHOLDER] copied from FY2025-26
        { id: 'p26-153a-textile-atl',        atlStatus: 'ATL',     taxpayerType: null,         subType: 'TEXTILE_SECTOR',      rate: 1,    rateLabel: '[PLACEHOLDER] 1% (ATL - Textile/Leather/Sports Sector)',         priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-textile-non-atl',    atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'TEXTILE_SECTOR',      rate: 2,    rateLabel: '[PLACEHOLDER] 2% (Non-ATL - Textile/Leather/Sports Sector)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-gold-atl',           atlStatus: 'ATL',     taxpayerType: null,         subType: 'GOLD_SILVER',         rate: 1,    rateLabel: '[PLACEHOLDER] 1% (ATL - Gold, Silver & Articles)',               priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153a-gold-non-atl',       atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'GOLD_SILVER',         rate: 2,    rateLabel: '[PLACEHOLDER] 2% (Non-ATL - Gold, Silver & Articles)',           priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 153(1)(b) — Provision of Services ─────────────────────────────
    // All service tier rates are [PLACEHOLDER] copied from FY2025-26 pending FBR FY2026-27 validation
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
            { value: 'SPECIFIED',      label: 'Specified Services' },
            { value: 'IT_ITES',        label: 'IT / ITES Services' },
            { value: 'PRINT_MEDIA',    label: 'Print / Electronic Media' },
            { value: 'OTHER_SERVICES', label: 'Other Services' },
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
        // [PLACEHOLDER] — copied from FY2025-26; awaiting FBR FY2026-27 WHT Card validation
        { id: 'p26-153b-spec-atl',      atlStatus: 'ATL',     taxpayerType: null, subType: 'SPECIFIED',      rate: 6,   rateLabel: '[PLACEHOLDER] 6% (ATL - Specified Services)',        priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153b-spec-non-atl',  atlStatus: 'NON_ATL', taxpayerType: null, subType: 'SPECIFIED',      rate: 12,  rateLabel: '[PLACEHOLDER] 12% (Non-ATL - Specified Services)',    priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153b-it-atl',        atlStatus: 'ATL',     taxpayerType: null, subType: 'IT_ITES',        rate: 4,   rateLabel: '[PLACEHOLDER] 4% (ATL - IT/ITES Services)',           priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153b-it-non-atl',    atlStatus: 'NON_ATL', taxpayerType: null, subType: 'IT_ITES',        rate: 8,   rateLabel: '[PLACEHOLDER] 8% (Non-ATL - IT/ITES Services)',       priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153b-media-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'PRINT_MEDIA',    rate: 1.5, rateLabel: '[PLACEHOLDER] 1.5% (ATL - Print/Electronic Media)',   priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153b-media-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'PRINT_MEDIA',    rate: 3,   rateLabel: '[PLACEHOLDER] 3% (Non-ATL - Print/Electronic Media)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153b-other-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'OTHER_SERVICES', rate: 15,  rateLabel: '[PLACEHOLDER] 15% (ATL - Other Services)',            priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153b-other-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'OTHER_SERVICES', rate: 30,  rateLabel: '[PLACEHOLDER] 30% (Non-ATL - Other Services)',        priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 153(1)(c) — Execution of Contracts ────────────────────────────
    // STANDARD rates preserved from fy2027 original; SPORTSPERSON is [PLACEHOLDER]
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
        // Sportsperson — [PLACEHOLDER] copied from FY2025-26
        { id: 'p26-153c-sport-atl',      atlStatus: 'ATL',     taxpayerType: null,         subType: 'SPORTSPERSON', rate: 15,  rateLabel: '[PLACEHOLDER] 15% (ATL - Sportsperson)',                       priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153c-sport-non-atl',  atlStatus: 'NON_ATL', taxpayerType: null,         subType: 'SPORTSPERSON', rate: 30,  rateLabel: '[PLACEHOLDER] 30% (Non-ATL - Sportsperson)',                    priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        // Standard Contracts — preserved from fy2027 original rates
        { id: 'p26-153c-std-comp-atl',    atlStatus: 'ATL',     taxpayerType: 'COMPANY',    subType: 'STANDARD',     rate: 7,   rateLabel: '7% (ATL Company - Standard Contract)',            priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153c-std-comp-non-atl',atlStatus: 'NON_ATL', taxpayerType: 'COMPANY',    subType: 'STANDARD',     rate: 14,  rateLabel: '14% (Non-ATL Company - Standard Contract)',        priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153c-std-ind-atl',     atlStatus: 'ATL',     taxpayerType: 'INDIVIDUAL', subType: 'STANDARD',     rate: 7.5, rateLabel: '7.5% (ATL Individual/AOP - Standard Contract)',    priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153c-std-ind-non-atl', atlStatus: 'NON_ATL', taxpayerType: 'INDIVIDUAL', subType: 'STANDARD',     rate: 15,  rateLabel: '15% (Non-ATL Individual/AOP - Standard Contract)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153c-std-aop-atl',     atlStatus: 'ATL',     taxpayerType: 'AOP',        subType: 'STANDARD',     rate: 7.5, rateLabel: '7.5% (ATL Individual/AOP - Standard Contract)',    priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-153c-std-aop-non-atl', atlStatus: 'NON_ATL', taxpayerType: 'AOP',        subType: 'STANDARD',     rate: 15,  rateLabel: '15% (Non-ATL Individual/AOP - Standard Contract)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 153(2A) — Digital Transactions (E-Commerce) ──────────────────
    // [PLACEHOLDER] copied from FY2025-26; rates pending FBR FY2026-27 WHT Card validation.
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
        { id: 'p26-6a-digital-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'DIGITAL_PAYMENT', rate: 1, rateLabel: '[PLACEHOLDER] 1% (ATL - Digital Payment)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-6a-digital-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'DIGITAL_PAYMENT', rate: 2, rateLabel: '[PLACEHOLDER] 2% (Non-ATL - Digital Payment)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-6a-cod-atl',         atlStatus: 'ATL',     taxpayerType: null, subType: 'COD',             rate: 2, rateLabel: '[PLACEHOLDER] 2% (ATL - Cash on Delivery)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-6a-cod-non-atl',     atlStatus: 'NON_ATL', taxpayerType: null, subType: 'COD',             rate: 4, rateLabel: '[PLACEHOLDER] 4% (Non-ATL - Cash on Delivery)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },
    {
      // Section 155 Rent WHT: hybrid configuration
      // Slabs for Individual/AOP, flat rate for Company
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
            { value: 'ATL', label: 'Active (Filer)' },
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
            { value: 'COMPANY', label: 'Company' },
          ],
        },
      ],
      // We will flag requiresSlabComputation dynamically or check if the rules have slabs.
      // Slabs will be used for INDIVIDUAL and AOP, Company uses a flat rate rule resolved by priority/specificity.
      slabs: [
        { from: 0, to: 300000, fixedTax: 0, rate: 0, label: 'Up to Rs. 300,000' },
        { from: 300001, to: 600000, fixedTax: 0, rate: 5, label: 'Rs. 300,001 to 600,000' },
        { from: 600001, to: 2000000, fixedTax: 15000, rate: 10, label: 'Rs. 600,001 to 2,000,000' },
        { from: 2000001, to: null, fixedTax: 155000, rate: 15, label: 'Above Rs. 2,000,000' },
      ],
      rules: [
        // Company Rent rules (flat rate)
        { id: '155-comp-atl', atlStatus: 'ATL', taxpayerType: 'COMPANY', subType: null, rate: 15, rateLabel: '15% (ATL Company Rent)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: '155-comp-non-atl', atlStatus: 'NON_ATL', taxpayerType: 'COMPANY', subType: null, rate: 30, rateLabel: '30% (Non-ATL Company Rent)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },
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
        },
        {
          key: 'atlStatus',
          label: 'ATL Status (Seller)',
          type: 'radio',
          required: true,
          options: [
            { value: 'ATL', label: 'Active (Filer)' },
            { value: 'NON_ATL', label: 'Inactive (Non-Filer)' },
          ],
        },
      ],
      rules: [
        { id: '236C-atl', atlStatus: 'ATL', taxpayerType: null, subType: null, rate: 1, rateLabel: '1% (ATL Seller)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: '236C-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: null, rate: 2, rateLabel: '2% (Non-ATL Seller)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },
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
        },
        {
          key: 'atlStatus',
          label: 'ATL Status (Buyer)',
          type: 'radio',
          required: true,
          options: [
            { value: 'ATL', label: 'Active (Filer)' },
            { value: 'NON_ATL', label: 'Inactive (Non-Filer)' },
          ],
        },
        {
          key: 'taxpayerType',
          label: 'Buyer Type',
          type: 'radio',
          required: true,
          options: [
            { value: 'INDIVIDUAL', label: 'Individual' },
            { value: 'AOP', label: 'Association of Persons (AOP)' },
            { value: 'COMPANY', label: 'Company' },
          ],
        },
      ],
      rules: [
        { id: '236K-atl', atlStatus: 'ATL', taxpayerType: null, subType: null, rate: 3, rateLabel: '3% (ATL Buyer)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: '236K-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: null, rate: 6, rateLabel: '6% (Non-ATL Buyer)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 233 — Brokerage and Commission ───────────────────────────────
    // [PLACEHOLDER] — rates carried forward from FY2025-26 (TY2026). Pending
    // FBR FY2026-27 (TY2027) WHT Rate Card validation once Finance Act 2026 issued.
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
            { value: 'LIFE_INSURANCE_AGENT',  label: 'Life Insurance Agent (commission under PKR 0.5 million/year)' },
            { value: 'OTHER',                 label: 'Other Brokerage / Commission' },
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
        // [PLACEHOLDER] carried forward from FY2025-26 — awaiting FBR FY2026-27 WHT Card validation
        { id: 'p26-233-adv-atl',      atlStatus: 'ATL',     taxpayerType: null, subType: 'ADVERTISING_AGENT',    rate: 10, rateLabel: '[PLACEHOLDER] 10% (ATL - Advertising Agent)',                          priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-233-adv-non-atl',  atlStatus: 'NON_ATL', taxpayerType: null, subType: 'ADVERTISING_AGENT',    rate: 20, rateLabel: '[PLACEHOLDER] 20% (Non-ATL - Advertising Agent)',                       priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-233-life-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'LIFE_INSURANCE_AGENT', rate: 8,  rateLabel: '[PLACEHOLDER] 8% (ATL - Life Insurance Agent, commission < PKR 0.5M)',  priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-233-life-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'LIFE_INSURANCE_AGENT', rate: 16, rateLabel: '[PLACEHOLDER] 16% (Non-ATL - Life Insurance Agent, commission < PKR 0.5M)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-233-other-atl',    atlStatus: 'ATL',     taxpayerType: null, subType: 'OTHER',                rate: 12, rateLabel: '[PLACEHOLDER] 12% (ATL - Other Brokerage/Commission)',                  priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-233-other-non-atl',atlStatus: 'NON_ATL', taxpayerType: null, subType: 'OTHER',                rate: 24, rateLabel: '[PLACEHOLDER] 24% (Non-ATL - Other Brokerage/Commission)',             priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 156 — Prizes and Winnings ────────────────────────────────────
    // [PLACEHOLDER] — rates carried forward from FY2025-26 (TY2026). Pending
    // FBR FY2026-27 (TY2027) WHT Rate Card validation once Finance Act 2026 issued.
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
        // [PLACEHOLDER] carried forward from FY2025-26 — awaiting FBR FY2026-27 WHT Card validation
        { id: 'p26-156-bond-atl',      atlStatus: 'ATL',     taxpayerType: null, subType: 'PRIZE_BOND',     rate: 15, rateLabel: '[PLACEHOLDER] 15% (ATL - Prize Bond Winnings)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-156-bond-non-atl',  atlStatus: 'NON_ATL', taxpayerType: null, subType: 'PRIZE_BOND',     rate: 30, rateLabel: '[PLACEHOLDER] 30% (Non-ATL - Prize Bond Winnings)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-156-other-atl',     atlStatus: 'ATL',     taxpayerType: null, subType: 'OTHER_WINNINGS', rate: 20, rateLabel: '[PLACEHOLDER] 20% (ATL - Other Winnings)',          priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-156-other-non-atl', atlStatus: 'NON_ATL', taxpayerType: null, subType: 'OTHER_WINNINGS', rate: 40, rateLabel: '[PLACEHOLDER] 40% (Non-ATL - Other Winnings)',     priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 154 — Exports ─────────────────────────────────────────────
    // [PLACEHOLDER] — carried forward from FY2025-26. Pending Finance Act 2026.
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
        { id: 'p26-154-standard', atlStatus: null, taxpayerType: null, subType: 'STANDARD_EXPORT',    rate: 2, rateLabel: '[PLACEHOLDER] 2% (1% Minimum Tax + 1% Advance Tax - Realization of Export Proceeds)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-154-afghan',   atlStatus: null, taxpayerType: null, subType: 'AFGHAN_COOKING_OIL', rate: 0, rateLabel: '[PLACEHOLDER] 0% (Cooking Oil/Ghee exported to Afghanistan, Sec 148 tax paid)',           priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },

    // ── Section 154A — Export of Services ────────────────────────────────
    // [PLACEHOLDER] — carried forward from FY2025-26. Pending Finance Act 2026.
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
      ],
      rules: [
        { id: 'p26-154a-pseb-it-ites', atlStatus: null, taxpayerType: null, subType: 'PSEB_IT_ITES',   rate: 0.25, rateLabel: '[PLACEHOLDER] 0.25% (Final Tax - PSEB Registered Software/IT/ITeS Export, subject to specified conditions)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
        { id: 'p26-154a-other',       atlStatus: null, taxpayerType: null, subType: 'OTHER_SERVICES', rate: 1,    rateLabel: '[PLACEHOLDER] 1% (Technical Services / Royalty-Commission-Franchise / Foreign Construction Contracts / Foreign Indenting Commission)', priority: 1, effectiveFrom: '2026-07-01', effectiveTo: '2027-06-30' },
      ],
    },
  ],
};
Object.freeze(configFY2027);
