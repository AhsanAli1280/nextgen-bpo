import assert from 'assert';
import { Decimal } from 'decimal.js';
import {
  computeWht,
  getConfigByTransactionDate,
  getConfigByYear,
  getActiveFinanceActYear,
  getDefaultFinanceActYear,
  validateRateConfig,
} from '../index';
import { formatNumber, formatPkr } from '../../utils/currency';
import { taxYearLabel } from '../../utils/tax-year';
import { RATE_REGISTRY, WhtRule, WhtRateConfig, FREQUENCY_MULTIPLIERS } from '../../tax-rules';

const configFY2026 = RATE_REGISTRY[2025]; // Tax Year 2025-26 (placeholder)
const configFY2027 = RATE_REGISTRY[2026]; // Tax Year 2026-27
const configFY2028 = RATE_REGISTRY[2027]; // Tax Year 2027-28

console.log('Running Withholding Tax Engine Tests...\n');

// 1. Loader & Date Resolution Tests
function testLoader() {
  console.log('1. Testing Loader & Date Resolution...');

  // Test active finance act year logic (July 1 boundary)
  assert.strictEqual(getActiveFinanceActYear(new Date('2026-06-30')), 2025);
  assert.strictEqual(getActiveFinanceActYear(new Date('2026-07-01')), 2026);
  assert.strictEqual(getActiveFinanceActYear(new Date('2027-01-15')), 2026);
  assert.strictEqual(getActiveFinanceActYear(new Date('2027-07-05')), 2027);

  // Test getConfigByTransactionDate
  const config2027 = getConfigByTransactionDate(new Date('2026-10-15'));
  assert.strictEqual(config2027.financeActYear, 2026); // FY2026-27 config

  const config2028 = getConfigByTransactionDate(new Date('2027-08-01'));
  assert.strictEqual(config2028.financeActYear, 2027); // FY2027-28 config

  // Test getConfigByYear
  const configByYear = getConfigByYear(2026);
  assert.strictEqual(configByYear.financeActYear, 2026);

  console.log('✓ Loader tests passed.');
}

// 2. Immutability Tests
function testImmutability() {
  console.log('\n2. Testing Historical Configuration Immutability...');

  assert.throws(() => {
    (configFY2027 as any).financeActYear = 9999;
  }, TypeError);

  assert.throws(() => {
    (configFY2027.sections[0] as any).label = 'mutated';
  }, TypeError);

  assert.throws(() => {
    (configFY2027.sections[0].rules as any)[0] = null;
  }, TypeError);

  console.log('✓ Immutability tests passed.');
}

// 3. Frequencies & Multipliers Tests
function testFrequencies() {
  console.log('\n3. Testing Payment Frequencies & Multipliers...');

  // ONE_TIME Payment WHT (Section 153a Goods, Company, ATL)
  // FY2027 (Finance Act 2026) Rate for OTHER_GOODS (Company, ATL) is 4%
  const oneTimeInput = {
    sectionCode: '153a',
    transactionDate: '2026-09-15',
    sectionSpecific: {
      paymentAmount: 100000,
      subType: 'OTHER_GOODS',
      atlStatus: 'ATL',
      taxpayerType: 'COMPANY',
    },
  };

  const oneTimeResult = computeWht(oneTimeInput);
  assert.strictEqual(oneTimeResult.applicable, true);
  assert.strictEqual(oneTimeResult.rate, 4);
  assert.deepStrictEqual(oneTimeResult.whtAmountPerPeriod, new Decimal(4000));
  assert.deepStrictEqual(oneTimeResult.netAmountPerPeriod, new Decimal(96000));
  assert.strictEqual(oneTimeResult.enteredFrequency, undefined);

  // SEMI_ANNUAL Rent Payment WHT (Section 155 Rent, Company, ATL)
  // Company rent uses flat rate of 15% in FY2027
  const rentInput = {
    sectionCode: '155',
    transactionDate: '2026-12-01',
    sectionSpecific: {
      rentAmount: 500000,
      frequency: 'SEMI_ANNUAL',
      atlStatus: 'ATL',
      taxpayerType: 'COMPANY',
    },
  };

  const rentResult = computeWht(rentInput);
  assert.strictEqual(rentResult.applicable, true);
  assert.strictEqual(rentResult.rate, 15);
  // Entered: 500,000 semi-annual
  // Annualized: 1,000,000
  // Annual tax: 1,000,000 * 15% = 150,000
  // Per-period WHT: 150,000 / 2 = 75,000
  assert.deepStrictEqual(rentResult.whtAmountAnnual, new Decimal(150000));
  assert.deepStrictEqual(rentResult.whtAmountPerPeriod, new Decimal(75000));
  assert.deepStrictEqual(rentResult.netAmountPerPeriod, new Decimal(425000));

  console.log('✓ Frequencies and multipliers tests passed.');
}

// 4. Progressive Slabs Tests & Boundary Assertions
function testProgressiveSlabs() {
  console.log('\n4. Testing Progressive Slabs Computation...');

  // Section 149 - Salary: PKR 200,000 / month salary, no bonus
  // FY2027 Slabs:
  // 0 - 600,000: 0%
  // 600,001 - 1,200,000: 5% on excess of 600k (tax in slab = 30k)
  // 1,200,001 - 2,400,000: 15% on excess of 1,200k (here excess = 1,200,000 * 15% = 180k)
  // Total Annual tax = 30k + 180k = 210k
  // Monthly deduction = 210,000 / 12 = 17,500
  const salaryInput = {
    sectionCode: '149',
    transactionDate: '2026-07-15',
    sectionSpecific: {
      monthlySalary: 200000,
      frequency: 'MONTHLY',
      taxpayerType: 'INDIVIDUAL',
    },
  };

  const salaryResult = computeWht(salaryInput);
  assert.strictEqual(salaryResult.applicable, true);
  assert.strictEqual(salaryResult.isProgressiveSlab, true);
  assert.deepStrictEqual(salaryResult.annualisedAmount, new Decimal(2400000));
  assert.deepStrictEqual(salaryResult.whtAmountAnnual, new Decimal(210000));
  assert.deepStrictEqual(salaryResult.whtAmountPerPeriod, new Decimal(17500));
  assert.deepStrictEqual(salaryResult.netAmountPerPeriod, new Decimal(182500));

  // Validate slab breakdown output
  assert.strictEqual(salaryResult.slabBreakdown?.length, 6);
  assert.deepStrictEqual(salaryResult.slabBreakdown[0].taxableAmount, new Decimal(600000));
  assert.deepStrictEqual(salaryResult.slabBreakdown[0].tax, new Decimal(0));
  assert.deepStrictEqual(salaryResult.slabBreakdown[1].taxableAmount, new Decimal(600000));
  assert.deepStrictEqual(salaryResult.slabBreakdown[1].tax, new Decimal(30000));
  assert.deepStrictEqual(salaryResult.slabBreakdown[2].taxableAmount, new Decimal(1200000));
  assert.deepStrictEqual(salaryResult.slabBreakdown[2].tax, new Decimal(180000));

  console.log('✓ Progressive slabs basic tests passed.');

  // 4b. Salary Slab boundary tests:
  // - 600,000
  // - 600,001
  // - 1,200,000
  // - 1,200,001
  // - 2,400,000
  // - 2,400,001
  console.log('Testing specific progressive salary slab boundaries (FY2027)...');

  const testBoundary = (annualSalary: number, expectedAnnualTax: number) => {
    const res = computeWht({
      sectionCode: '149',
      transactionDate: '2026-08-15',
      sectionSpecific: {
        monthlySalary: annualSalary / 12,
        frequency: 'MONTHLY',
        taxpayerType: 'INDIVIDUAL',
      },
    });
    assert.deepStrictEqual(res.whtAmountAnnual, new Decimal(expectedAnnualTax));
  };

  // 1. Boundary 600,000 (tax should be 0)
  testBoundary(600000, 0);

  // 2. Boundary 600,001 (excess is 1 -> 1 * 5% = 0.05 -> rounds to 0 WHT)
  testBoundary(600001, 0);

  // 3. Boundary 1,200,000 (excess is 600,000 -> 600,000 * 5% = 30,000)
  testBoundary(1200000, 30000);

  // 4. Boundary 1,200,001 (excess is 1 -> 30,000 + 1 * 15% = 30,000.15 -> rounds to 30,000)
  testBoundary(1200001, 30000);

  // 5. Boundary 2,400,000 (excess is 1.2M -> 30,000 + 1,200,000 * 15% = 210,000)
  testBoundary(2400000, 210000);

  // 6. Boundary 2,400,001 (excess is 1 -> 210,000 + 1 * 25% = 210,000.25 -> rounds to 210,000)
  testBoundary(2400001, 210000);

  console.log('✓ Specific slab boundaries passed.');
}

// 5. Threshold Guard Tests
function testThresholdGuard() {
  console.log('\n5. Testing Threshold Guards...');

  // Section 153b threshold test: payments below PKR 30,000/year are exempt.
  // Threshold was corrected from 75,000 → 30,000 in Track B1 remediation (D2).
  // Using transactionDate '2026-08-10' (FY2026-27 → fy2027.ts); subType OTHER_SERVICES
  const belowInput = {
    sectionCode: '153b',
    transactionDate: '2026-08-10',
    sectionSpecific: {
      paymentAmount: 25000,
      subType: 'OTHER_SERVICES',
      atlStatus: 'ATL',
      taxpayerType: 'COMPANY',
    },
  };

  const belowResult = computeWht(belowInput);
  assert.strictEqual(belowResult.applicable, false);
  assert.strictEqual(belowResult.rate, 0);
  assert.deepStrictEqual(belowResult.whtAmountPerPeriod, new Decimal(0));
  assert.ok(belowResult.inapplicableReason?.includes('30,000'));
  // Theoretical rate fields (presentation layer — do not alter statutory determination)
  assert.strictEqual(belowResult.theoreticalRate, 15, 'threshold guard: theoreticalRate = 15% (OTHER_SERVICES ATL)');
  assert.deepStrictEqual(belowResult.theoreticalWhtAmount, new Decimal(3750), 'threshold guard: 25,000 × 15% = 3,750');
  assert.strictEqual(belowResult.thresholdMinimum, 30000, 'threshold guard: thresholdMinimum = 30,000');
  assert.ok(belowResult.explanation.includes('3,750'), 'explanation includes theoretical WHT 3,750');
  assert.ok(belowResult.explanation.includes('PKR 0'), 'explanation includes Final WHT Payable PKR 0');
  assert.ok(belowResult.explanation.includes('Illustrative Calculation'), 'explanation includes illustrative section');

  // fy2027 153b OTHER_SERVICES ATL = 15% [PLACEHOLDER]; 80,000 × 15% = 12,000
  const aboveInput = {
    sectionCode: '153b',
    transactionDate: '2026-08-10',
    sectionSpecific: {
      paymentAmount: 80000,
      subType: 'OTHER_SERVICES',
      atlStatus: 'ATL',
      taxpayerType: 'COMPANY',
    },
  };

  const aboveResult = computeWht(aboveInput);
  assert.strictEqual(aboveResult.applicable, true);
  assert.strictEqual(aboveResult.rate, 15);
  assert.deepStrictEqual(aboveResult.whtAmountPerPeriod, new Decimal(12000));

  console.log('✓ Threshold guard tests passed.');
}

// 6. Conflict & Integrity Validator Tests
function testValidator() {
  console.log('\n6. Testing Validator (Overlaps, Duplicate Priorities, Ambiguity, Missing Fallbacks)...');

  const createMockConfig = (rules: WhtRule[]): WhtRateConfig => ({
    financeActYear: 2026,
    effectiveFrom: '2026-07-01',
    effectiveTo: '2027-06-30',
    sections: [
      {
        code: '999',
        displayOrder: 999,
        label: 'Mock Section',
        legalReference: 'Section 999 ITO',
        transactionFields: [
          { key: 'amount', label: 'Amount', type: 'number', required: true, amountField: true },
          { key: 'atlStatus', label: 'ATL', type: 'radio', required: true },
          { key: 'taxpayerType', label: 'Taxpayer', type: 'radio', required: true },
        ],
        rules,
      },
    ],
  });

  // A. Overlapping Rules & Duplicate Priorities
  const duplicatePriorityRules: WhtRule[] = [
    {
      id: 'rule-a',
      atlStatus: 'ATL',
      taxpayerType: 'COMPANY',
      subType: null,
      rate: 10,
      rateLabel: 'Rule A',
      priority: 1,
      effectiveFrom: '2026-07-01',
      effectiveTo: '2026-12-31',
    },
    {
      id: 'rule-b',
      atlStatus: 'ATL',
      taxpayerType: 'COMPANY',
      subType: null,
      rate: 15,
      rateLabel: 'Rule B',
      priority: 1,
      effectiveFrom: '2026-10-01',
      effectiveTo: '2027-06-30',
    },
  ];

  assert.throws(() => {
    validateRateConfig(createMockConfig(duplicatePriorityRules));
  }, /Conflict/);

  // B. Ambiguous matches
  const ambiguousRules: WhtRule[] = [
    {
      id: 'rule-spec-atl',
      atlStatus: 'ATL',
      taxpayerType: null,
      subType: null,
      rate: 5,
      rateLabel: 'ATL Rule',
      priority: 1,
      effectiveFrom: '2026-07-01',
      effectiveTo: '2027-06-30',
    },
    {
      id: 'rule-spec-comp',
      atlStatus: null,
      taxpayerType: 'COMPANY',
      subType: null,
      rate: 8,
      rateLabel: 'Company Rule',
      priority: 1,
      effectiveFrom: '2026-07-01',
      effectiveTo: '2027-06-30',
    },
  ];

  assert.throws(() => {
    validateRateConfig(createMockConfig(ambiguousRules));
  }, /Ambiguous Match/);

  // C. Missing fallback rules
  const incompleteRules: WhtRule[] = [
    {
      id: 'rule-atl-comp',
      atlStatus: 'ATL',
      taxpayerType: 'COMPANY',
      subType: null,
      rate: 5,
      rateLabel: 'ATL Company',
      priority: 1,
      effectiveFrom: '2026-07-01',
      effectiveTo: '2027-06-30',
    },
  ];

  assert.throws(() => {
    validateRateConfig(createMockConfig(incompleteRules));
  }, /Missing Fallback/);

  console.log('✓ Validator tests passed.');
}

// 7. Section 149 Bonus and Allowances Tests
function testSection149WithBonusAllowances() {
  console.log('\n7. Testing Section 149 — Bonus and Allowances included in taxable income...');

  // Scenario A: Monthly Salary = 100,000, Bonus = 600,000
  // Annual salary: 100,000 × 12 = 1,200,000
  // Annual bonus:                    600,000
  // Total taxable:                 1,800,000
  // Slabs:
  //   Band 1 (0–600,000):     600,000 × 0%   =        0
  //   Band 2 (600,001–1.2M):  600,000 × 5%   =   30,000
  //   Band 3 (1.2M–2.4M):     600,000 × 15%  =   90,000
  // Annual WHT = 120,000 | Monthly WHT = 10,000
  const scenarioA = computeWht({
    sectionCode: '149',
    transactionDate: '2026-09-01',
    sectionSpecific: {
      monthlySalary: 100000,
      frequency: 'MONTHLY',
      taxpayerType: 'INDIVIDUAL',
      annualBonus: 600000,
    },
  });
  assert.strictEqual(scenarioA.applicable, true);
  assert.strictEqual(scenarioA.isProgressiveSlab, true);
  assert.deepStrictEqual(scenarioA.annualisedAmount, new Decimal(1800000));
  assert.deepStrictEqual(scenarioA.whtAmountAnnual, new Decimal(120000));
  assert.deepStrictEqual(scenarioA.whtAmountPerPeriod, new Decimal(10000));
  assert.deepStrictEqual(scenarioA.netAmountPerPeriod, new Decimal(90000));
  console.log('  ✓ Scenario A (salary + bonus) passed.');

  // Scenario B: Monthly Salary = 150,000, Other Monthly Allowances = 300,000
  // Annual salary:    150,000 × 12 = 1,800,000
  // Annual allowances: 300,000 × 12 = 3,600,000
  // Total taxable:                   5,400,000
  // Slabs:
  //   Band 1 (0–600,000):       600,000 × 0%   =         0
  //   Band 2 (600,001–1.2M):    600,000 × 5%   =    30,000
  //   Band 3 (1.2M–2.4M):     1,200,000 × 15%  =   180,000
  //   Band 4 (2.4M–3.6M):     1,200,000 × 25%  =   300,000
  //   Band 5 (3.6M–6M):       1,800,000 × 30%  =   540,000
  // Annual WHT = 1,050,000 | Monthly WHT = 87,500
  const scenarioB = computeWht({
    sectionCode: '149',
    transactionDate: '2026-09-01',
    sectionSpecific: {
      monthlySalary: 150000,
      frequency: 'MONTHLY',
      taxpayerType: 'INDIVIDUAL',
      otherAllowances: 300000,
    },
  });
  assert.strictEqual(scenarioB.applicable, true);
  assert.deepStrictEqual(scenarioB.annualisedAmount, new Decimal(5400000));
  assert.deepStrictEqual(scenarioB.whtAmountAnnual, new Decimal(1050000));
  assert.deepStrictEqual(scenarioB.whtAmountPerPeriod, new Decimal(87500));
  assert.deepStrictEqual(scenarioB.netAmountPerPeriod, new Decimal(62500));
  console.log('  ✓ Scenario B (salary + allowances) passed.');

  // Scenario C: Monthly Salary = 100,000, Bonus = 600,000, Allowances = 300,000/month
  // Annual salary:     100,000 × 12 = 1,200,000
  // Annual bonus:                       600,000
  // Annual allowances: 300,000 × 12 = 3,600,000
  // Total taxable:                    5,400,000
  // Slabs: same as Scenario B → Annual WHT = 1,050,000 | Monthly WHT = 87,500
  const scenarioC = computeWht({
    sectionCode: '149',
    transactionDate: '2026-09-01',
    sectionSpecific: {
      monthlySalary: 100000,
      frequency: 'MONTHLY',
      taxpayerType: 'INDIVIDUAL',
      annualBonus: 600000,
      otherAllowances: 300000,
    },
  });
  assert.strictEqual(scenarioC.applicable, true);
  assert.deepStrictEqual(scenarioC.annualisedAmount, new Decimal(5400000));
  assert.deepStrictEqual(scenarioC.whtAmountAnnual, new Decimal(1050000));
  assert.deepStrictEqual(scenarioC.whtAmountPerPeriod, new Decimal(87500));
  assert.deepStrictEqual(scenarioC.netAmountPerPeriod, new Decimal(12500));
  console.log('  ✓ Scenario C (salary + bonus + allowances) passed.');

  // Regression: salary-only path must be unaffected
  // Monthly = 200,000 (no bonus, no allowances) → existing T149-03 values must hold
  const salaryOnlyRegression = computeWht({
    sectionCode: '149',
    transactionDate: '2026-09-01',
    sectionSpecific: {
      monthlySalary: 200000,
      frequency: 'MONTHLY',
      taxpayerType: 'INDIVIDUAL',
    },
  });
  assert.deepStrictEqual(salaryOnlyRegression.annualisedAmount, new Decimal(2400000));
  assert.deepStrictEqual(salaryOnlyRegression.whtAmountAnnual, new Decimal(210000));
  assert.deepStrictEqual(salaryOnlyRegression.whtAmountPerPeriod, new Decimal(17500));
  console.log('  ✓ Regression (salary only, no bonus/allowances) passed.');

  console.log('✓ All Section 149 bonus/allowances tests passed.');
}

// 8. getDefaultFinanceActYear — fallback logic (updated for new nearest-past strategy)
function testDefaultFinanceActYear() {
  console.log('8. Testing getDefaultFinanceActYear fallback logic...');

  // Case 1: active year IS in the registry → return it directly.
  // July 1 2026 → active year = 2026; registry contains 2026.
  const resultPresent = getDefaultFinanceActYear(
    { 2026: {}, 2027: {} } as any,
    new Date('2026-07-01')
  );
  assert.strictEqual(resultPresent, 2026);
  console.log('  ✓ Active year present in registry → returned as-is.');

  // Case 2: active year predates all configs → fall back to the earliest available year.
  // June 8 2026 → active year = 2025 (pre-July); registry only has 2026 and 2027.
  // No year ≤ 2025 exists, so we take the earliest = min(2026, 2027) = 2026.
  const resultFallbackEarliest = getDefaultFinanceActYear(
    { 2026: {}, 2027: {} } as any,
    new Date('2026-06-08')
  );
  assert.strictEqual(resultFallbackEarliest, 2026);
  console.log('  ✓ Active year predates all configs → earliest available year returned.');

  // Case 3: active year exceeds all configs → fall back to the nearest past year.
  // Dec 2028 → active year = 2028; registry has 2026 and 2027.
  // Largest year ≤ 2028 = 2027.
  const resultFallbackNearest = getDefaultFinanceActYear(
    { 2026: {}, 2027: {} } as any,
    new Date('2028-12-01')
  );
  assert.strictEqual(resultFallbackNearest, 2027);
  console.log('  ✓ Active year exceeds all configs → nearest past year returned.');

  // Case 4: single-entry registry where the entry is a future year.
  // June 8 2026 → active = 2025; only 2027 in registry → earliest (and only) = 2027.
  const resultSingleEntry = getDefaultFinanceActYear(
    { 2027: {} } as any,
    new Date('2026-06-08')
  );
  assert.strictEqual(resultSingleEntry, 2027);
  console.log('  ✓ Single-entry registry (future year only) → that entry returned.');

  // Case 5: active year has a registered past year available.
  // July 2026 → active = 2026; registry has 2025, 2026, 2027 → exact match = 2026.
  const resultWithPast = getDefaultFinanceActYear(
    { 2025: {}, 2026: {}, 2027: {} } as any,
    new Date('2026-07-15')
  );
  assert.strictEqual(resultWithPast, 2026);
  console.log('  ✓ Active year in registry with past and future years → exact match returned.');

  // Case 6: empty registry → null.
  const resultEmpty = getDefaultFinanceActYear({} as any, new Date('2026-06-08'));
  assert.strictEqual(resultEmpty, null);
  console.log('  ✓ Empty registry → null returned.');

  // Case 7: real registry with today's date (June 9 2026).
  // Active year = 2025; RATE_REGISTRY now has 2025, 2026, 2027.
  // 2025 is present → returns 2025.
  const resultRealRegistry = getDefaultFinanceActYear(RATE_REGISTRY, new Date('2026-06-09'));
  assert.strictEqual(resultRealRegistry, 2025);
  console.log('  ✓ Real registry on 2026-06-09 → returns 2025 (Tax Year 2025-26).');

  console.log('✓ All getDefaultFinanceActYear tests passed.');
}

// 9. Currency formatting utility
function testCurrencyFormatting() {
  console.log('9. Testing currency formatting utility...');

  // formatNumber
  assert.strictEqual(formatNumber(500000),    '500,000');
  assert.strictEqual(formatNumber(1200000),   '1,200,000');
  assert.strictEqual(formatNumber(12500000),  '12,500,000');
  assert.strictEqual(formatNumber(0),         '0');
  assert.strictEqual(formatNumber(1200.75),   '1,201');   // rounds half-up
  assert.strictEqual(formatNumber(1200.25),   '1,200');   // rounds down
  assert.strictEqual(formatNumber('5000000'), '5,000,000'); // string input
  console.log('  ✓ formatNumber: 500,000 / 1,200,000 / 12,500,000 / 0 / decimals / string input');

  // formatPkr
  assert.strictEqual(formatPkr(500000),   'PKR 500,000');
  assert.strictEqual(formatPkr(1200000),  'PKR 1,200,000');
  assert.strictEqual(formatPkr(12500000), 'PKR 12,500,000');
  assert.strictEqual(formatPkr(0),        'PKR 0');
  console.log('  ✓ formatPkr: PKR prefix applied correctly');

  // Decimal inputs
  const { Decimal: D } = require('decimal.js');
  assert.strictEqual(formatNumber(new D('500000')),   '500,000');
  assert.strictEqual(formatNumber(new D('1200000')),  '1,200,000');
  assert.strictEqual(formatPkr(new D('12500000')),    'PKR 12,500,000');
  assert.strictEqual(formatNumber(new D('1200.75')),  '1,201');
  console.log('  ✓ Decimal instance inputs handled correctly');

  console.log('✓ All currency formatting tests passed.');
}

// 10. taxYearLabel — formatting utility
function testTaxYearLabel() {
  console.log('\n10. Testing taxYearLabel formatting utility...');

  assert.strictEqual(taxYearLabel(2025), '2025-26');
  assert.strictEqual(taxYearLabel(2026), '2026-27');
  assert.strictEqual(taxYearLabel(2027), '2027-28');
  assert.strictEqual(taxYearLabel(2028), '2028-29');
  assert.strictEqual(taxYearLabel(2029), '2029-30');
  // Century boundary: 2099 → 2099-00
  assert.strictEqual(taxYearLabel(2099), '2099-00');
  // Verify the format is "YYYY-YY" not "YYYY – YYYY+1"
  assert.ok(!taxYearLabel(2026).includes(' '), 'Label must not contain spaces');
  assert.ok(taxYearLabel(2026).includes('-'), 'Label must use hyphen separator');

  console.log('  ✓ taxYearLabel(2025) → "2025-26"');
  console.log('  ✓ taxYearLabel(2026) → "2026-27"');
  console.log('  ✓ taxYearLabel(2027) → "2027-28"');
  console.log('  ✓ taxYearLabel(2099) → "2099-00" (century boundary handled)');
  console.log('  ✓ Format is hyphen-separated without spaces');
  console.log('✓ All taxYearLabel tests passed.');
}

// 11. financeActYear override — engine year-based resolution
function testFinanceActYearOverride() {
  console.log('\n11. Testing financeActYear override in computeWht...');

  // Baseline: date-based resolution for a date inside Tax Year 2025-26.
  // transactionDate = 2025-12-15 → getConfigByTransactionDate → financeActYear 2025.
  const dateBasedResult = computeWht({
    sectionCode: '153a',
    transactionDate: '2025-12-15',
    sectionSpecific: {
      paymentAmount: 100000,
      subType: 'OTHER_GOODS',
      atlStatus: 'ATL',
      taxpayerType: 'COMPANY',
    },
  });
  assert.strictEqual(dateBasedResult.financeActYear, 2025,
    'Date 2025-12-15 should resolve to Finance Act Year 2025');
  console.log('  ✓ transactionDate 2025-12-15 → financeActYear 2025 (date-based path).');

  // Override: same transaction date, but financeActYear: 2026 supplied.
  // financeActYear takes priority — engine must use the 2026 config.
  const yearOverrideResult = computeWht({
    sectionCode: '153a',
    financeActYear: 2026,
    transactionDate: '2025-12-15', // would give financeActYear 2025 without the override
    sectionSpecific: {
      paymentAmount: 100000,
      subType: 'OTHER_GOODS',
      atlStatus: 'ATL',
      taxpayerType: 'COMPANY',
    },
  });
  assert.strictEqual(yearOverrideResult.financeActYear, 2026,
    'financeActYear: 2026 must override the date-based lookup');
  console.log('  ✓ financeActYear: 2026 overrides transactionDate 2025-12-15 → financeActYear 2026.');

  // No transactionDate, only financeActYear: 2027 — engine must not use system date.
  const noDateResult = computeWht({
    sectionCode: '153b',
    financeActYear: 2027,
    sectionSpecific: {
      paymentAmount: 200000,
      subType: 'OTHER_SERVICES',
      atlStatus: 'NON_ATL',
      taxpayerType: 'COMPANY',
    },
  });
  assert.strictEqual(noDateResult.financeActYear, 2027,
    'financeActYear: 2027 with no transactionDate must use 2027 config');
  assert.strictEqual(noDateResult.applicable, true);
  console.log('  ✓ financeActYear: 2027, no transactionDate → financeActYear 2027 (system date ignored).');

  // Verify TY2025-26 config (financeActYear: 2025) is accessible via override.
  // Section 153a OTHER_GOODS is Track-B-validated: rate must be 5% (no [PLACEHOLDER]).
  const fy2025GoodsResult = computeWht({
    sectionCode: '153a',
    financeActYear: 2025,
    sectionSpecific: {
      paymentAmount: 100000,
      subType: 'OTHER_GOODS',
      atlStatus: 'ATL',
      taxpayerType: 'COMPANY',
    },
  });
  assert.strictEqual(fy2025GoodsResult.financeActYear, 2025,
    'TY2025-26 config must be accessible via financeActYear: 2025 override');
  assert.strictEqual(fy2025GoodsResult.rate, 5,
    'Section 153 Goods Company ATL rate for TY2025-26 must be 5% after Track A');
  assert.deepStrictEqual(fy2025GoodsResult.whtAmountPerPeriod, new Decimal(5000),
    '100,000 × 5% = 5,000');
  assert.ok(!fy2025GoodsResult.rateLabel.includes('[PLACEHOLDER]'),
    'Section 153 Goods rateLabel must NOT carry [PLACEHOLDER] after Track A validation');
  console.log('  ✓ financeActYear: 2025 → TY2025-26 config accessible; Goods Company ATL = 5% (Track A verified).');

  // Section 153b (Provision of Services) is now Track-B-validated — real rates, no [PLACEHOLDER].
  const fy2025ServicesResult = computeWht({
    sectionCode: '153b',
    financeActYear: 2025,
    sectionSpecific: {
      paymentAmount: 100000,
      subType: 'SPECIFIED',
      atlStatus: 'ATL',
      taxpayerType: 'COMPANY',
    },
  });
  assert.strictEqual(fy2025ServicesResult.financeActYear, 2025);
  assert.strictEqual(fy2025ServicesResult.rate, 6,
    'Section 153b Specified Services ATL rate for TY2025-26 = 6%');
  assert.ok(!fy2025ServicesResult.rateLabel.includes('[PLACEHOLDER]'),
    'Section 153b Services rateLabel must NOT carry [PLACEHOLDER] after Track B validation');
  console.log('  ✓ Section 153b Specified Services ATL 100,000 → 6% (Track B validated, no [PLACEHOLDER]).');

  console.log('✓ All financeActYear override tests passed.');
}

// 12. Tax Year 2025-26 coverage — the app must not crash on today's date (2026-06-09)
function testTaxYear2025Coverage() {
  console.log('\n12. Testing Tax Year 2025-26 coverage (date 2026-06-09 no longer crashes)...');

  // Before this fix, getConfigByTransactionDate(new Date('2026-06-09')) threw:
  // "No tax configuration covers transaction date 2026-06-09 and no fallback year config exists."
  // Now it should resolve to the 2025 config (Tax Year 2025-26: 2025-07-01 → 2026-06-30).

  const config = getConfigByTransactionDate(new Date('2026-06-09'));
  assert.strictEqual(config.financeActYear, 2025,
    '2026-06-09 must resolve to the 2025 config (Tax Year 2025-26)');
  assert.strictEqual(config.effectiveFrom, '2025-07-01');
  assert.strictEqual(config.effectiveTo,   '2026-06-30');
  console.log('  ✓ getConfigByTransactionDate(2026-06-09) → financeActYear 2025.');

  // Verify a calculation on today's date succeeds end-to-end.
  const todayResult = computeWht({
    sectionCode: '153a',
    transactionDate: '2026-06-09',
    sectionSpecific: {
      paymentAmount: 500000,
      subType: 'OTHER_GOODS',
      atlStatus: 'ATL',
      taxpayerType: 'COMPANY',
    },
  });
  assert.strictEqual(todayResult.applicable, true);
  assert.strictEqual(todayResult.financeActYear, 2025);
  console.log('  ✓ computeWht with transactionDate 2026-06-09 succeeds and returns financeActYear 2025.');

  // Confirm Tax Year 2025-26 config is in the registry.
  assert.ok(RATE_REGISTRY[2025] !== undefined, 'RATE_REGISTRY must have key 2025');
  assert.strictEqual(Object.keys(RATE_REGISTRY).length, 3,
    'Registry must have exactly 3 entries: 2025, 2026, 2027');
  console.log('  ✓ RATE_REGISTRY has 3 entries: 2025 (2025-26), 2026 (2026-27), 2027 (2027-28).');

  // Confirm the config is deeply frozen (same contract as the other configs).
  assert.throws(() => {
    (RATE_REGISTRY[2025] as any).financeActYear = 9999;
  }, TypeError);
  console.log('  ✓ Tax Year 2025-26 config is deeply frozen.');

  console.log('✓ All Tax Year 2025-26 coverage tests passed.');
}

// 13. Track A — FY2025-26 verified rates (Finance Act 2025)
// Exercises every section corrected in Track A using financeActYear: 2025 to force
// the TY2025-26 config, so these tests are independent of the calendar date.
function testTrackARates2025() {
  console.log('\n13. Testing Track A — FY2025-26 verified rates (Finance Act 2025)...');

  // ── Section 149 ────────────────────────────────────────────────────────────
  // New slabs: 0% / 1% / 11% / 23% / 30% / 35%
  // Boundaries: 600k / 1.2M / 2.2M / 3.2M / 4.1M / ∞

  // A149-1: Annual 600,000 (monthly 50,000) — zero-rate ceiling.
  const s149a = computeWht({
    sectionCode: '149',
    financeActYear: 2025,
    sectionSpecific: { monthlySalary: 50000, frequency: 'MONTHLY', taxpayerType: 'INDIVIDUAL' },
  });
  assert.deepStrictEqual(s149a.whtAmountAnnual, new Decimal(0),    'A149-1: 600k annual → 0 WHT');
  assert.deepStrictEqual(s149a.whtAmountPerPeriod, new Decimal(0), 'A149-1: monthly deduction = 0');
  console.log('  ✓ A149-1: annual 600,000 → WHT 0 (zero-rate slab ceiling).');

  // A149-2: Annual 1,200,000 (monthly 100,000) — hits slab-2 ceiling (1% × 600k = 6,000).
  const s149b = computeWht({
    sectionCode: '149',
    financeActYear: 2025,
    sectionSpecific: { monthlySalary: 100000, frequency: 'MONTHLY', taxpayerType: 'INDIVIDUAL' },
  });
  assert.deepStrictEqual(s149b.annualisedAmount,    new Decimal(1200000), 'A149-2: annualised = 1,200,000');
  assert.deepStrictEqual(s149b.whtAmountAnnual,     new Decimal(6000),    'A149-2: 1% × 600k = 6,000');
  assert.deepStrictEqual(s149b.whtAmountPerPeriod,  new Decimal(500),     'A149-2: 6,000 / 12 = 500');
  console.log('  ✓ A149-2: annual 1,200,000 → WHT 6,000 annual / 500 monthly.');

  // A149-3: Annual 2,400,000 (monthly 200,000) — spans slabs 1-4.
  // 0-600k: 0 | 600k-1.2M: 1%×600k=6k | 1.2M-2.2M: 11%×1M=110k | 2.2M-2.4M: 23%×200k=46k
  // Annual = 162,000 | Monthly = 13,500
  const s149c = computeWht({
    sectionCode: '149',
    financeActYear: 2025,
    sectionSpecific: { monthlySalary: 200000, frequency: 'MONTHLY', taxpayerType: 'INDIVIDUAL' },
  });
  assert.deepStrictEqual(s149c.annualisedAmount,    new Decimal(2400000), 'A149-3: annualised = 2,400,000');
  assert.deepStrictEqual(s149c.whtAmountAnnual,     new Decimal(162000),  'A149-3: annual WHT = 162,000');
  assert.deepStrictEqual(s149c.whtAmountPerPeriod,  new Decimal(13500),   'A149-3: monthly = 13,500');
  console.log('  ✓ A149-3: annual 2,400,000 → WHT 162,000 annual / 13,500 monthly.');

  // A149-4: Annual 4,800,000 (monthly 400,000) — spans all 6 slabs.
  // 0-600k:0 | 600k-1.2M:6k | 1.2M-2.2M:110k | 2.2M-3.2M:230k | 3.2M-4.1M:270k | 4.1M-4.8M:245k
  // Annual = 861,000 | Monthly = 71,750
  const s149d = computeWht({
    sectionCode: '149',
    financeActYear: 2025,
    sectionSpecific: { monthlySalary: 400000, frequency: 'MONTHLY', taxpayerType: 'INDIVIDUAL' },
  });
  assert.deepStrictEqual(s149d.annualisedAmount,    new Decimal(4800000), 'A149-4: annualised = 4,800,000');
  assert.deepStrictEqual(s149d.whtAmountAnnual,     new Decimal(861000),  'A149-4: annual WHT = 861,000');
  assert.deepStrictEqual(s149d.whtAmountPerPeriod,  new Decimal(71750),   'A149-4: monthly = 71,750');
  console.log('  ✓ A149-4: annual 4,800,000 → WHT 861,000 annual / 71,750 monthly.');

  // Verify slab 3 new boundary: income that just crosses 2,200,000 uses 23% not 25%.
  // Annual 2,200,001 → enters slab 4 by 1 unit at 23%, rounds down.
  const s149e = computeWht({
    sectionCode: '149',
    financeActYear: 2025,
    sectionSpecific: { monthlySalary: 2200001 / 12, frequency: 'MONTHLY', taxpayerType: 'INDIVIDUAL' },
  });
  assert.deepStrictEqual(s149e.whtAmountAnnual, new Decimal(116000),
    'A149-5: 2,200,001 → 116,000 (slab-4 entry at 23%, not 25%)');
  console.log('  ✓ A149-5: slab-4 boundary (2,200,001) uses 23% rate, not old 25%.');

  console.log('  Section 149 ✓ (5 cases)');

  // ── Section 151 ────────────────────────────────────────────────────────────
  // Bank/Govt Sec: ATL 20%, Non-ATL 40% | NSSF: ATL 15%, Non-ATL 30%

  // A151-1: Bank ATL
  const s151a = computeWht({
    sectionCode: '151',
    financeActYear: 2025,
    sectionSpecific: { profitAmount: 1000000, subType: 'BANK', atlStatus: 'ATL', taxpayerType: 'INDIVIDUAL' },
  });
  assert.strictEqual(s151a.rate, 20,                                     'A151-1: Bank ATL rate = 20%');
  assert.deepStrictEqual(s151a.whtAmountPerPeriod, new Decimal(200000),  'A151-1: 1,000,000 × 20% = 200,000');
  console.log('  ✓ A151-1: Bank ATL 1,000,000 → WHT 200,000 (20%).');

  // A151-2: Bank Non-ATL
  const s151b = computeWht({
    sectionCode: '151',
    financeActYear: 2025,
    sectionSpecific: { profitAmount: 1000000, subType: 'BANK', atlStatus: 'NON_ATL', taxpayerType: 'INDIVIDUAL' },
  });
  assert.strictEqual(s151b.rate, 40,                                     'A151-2: Bank Non-ATL rate = 40%');
  assert.deepStrictEqual(s151b.whtAmountPerPeriod, new Decimal(400000),  'A151-2: 1,000,000 × 40% = 400,000');
  console.log('  ✓ A151-2: Bank Non-ATL 1,000,000 → WHT 400,000 (40%).');

  // A151-3: NSSF ATL
  const s151c = computeWht({
    sectionCode: '151',
    financeActYear: 2025,
    sectionSpecific: { profitAmount: 500000, subType: 'NSSF', atlStatus: 'ATL', taxpayerType: 'INDIVIDUAL' },
  });
  assert.strictEqual(s151c.rate, 15,                                     'A151-3: NSSF ATL rate = 15%');
  assert.deepStrictEqual(s151c.whtAmountPerPeriod, new Decimal(75000),   'A151-3: 500,000 × 15% = 75,000');
  console.log('  ✓ A151-3: NSSF ATL 500,000 → WHT 75,000 (15%).');

  // A151-4: NSSF Non-ATL
  const s151d = computeWht({
    sectionCode: '151',
    financeActYear: 2025,
    sectionSpecific: { profitAmount: 500000, subType: 'NSSF', atlStatus: 'NON_ATL', taxpayerType: 'INDIVIDUAL' },
  });
  assert.strictEqual(s151d.rate, 30,                                     'A151-4: NSSF Non-ATL rate = 30%');
  assert.deepStrictEqual(s151d.whtAmountPerPeriod, new Decimal(150000),  'A151-4: 500,000 × 30% = 150,000');
  console.log('  ✓ A151-4: NSSF Non-ATL 500,000 → WHT 150,000 (30%).');

  // A151-5: Govt Securities ATL — non-individual (Company), Division-IA(b) = 20%/40%
  const s151e = computeWht({
    sectionCode: '151',
    financeActYear: 2025,
    sectionSpecific: { profitAmount: 200000, subType: 'GOVT_SEC', atlStatus: 'ATL', taxpayerType: 'COMPANY' },
  });
  assert.strictEqual(s151e.rate, 20,                                     'A151-5: Govt Sec (Company) ATL rate = 20%');
  assert.deepStrictEqual(s151e.whtAmountPerPeriod, new Decimal(40000),   'A151-5: 200,000 × 20% = 40,000');
  console.log('  ✓ A151-5: Govt Securities (Company) ATL 200,000 → WHT 40,000 (20%).');

  // A151-6: Govt Securities Non-ATL — non-individual (Company)
  const s151f = computeWht({
    sectionCode: '151',
    financeActYear: 2025,
    sectionSpecific: { profitAmount: 200000, subType: 'GOVT_SEC', atlStatus: 'NON_ATL', taxpayerType: 'COMPANY' },
  });
  assert.strictEqual(s151f.rate, 40,                                     'A151-6: Govt Sec (Company) Non-ATL rate = 40%');
  assert.deepStrictEqual(s151f.whtAmountPerPeriod, new Decimal(80000),   'A151-6: 200,000 × 40% = 80,000');
  console.log('  ✓ A151-6: Govt Securities (Company) Non-ATL 200,000 → WHT 80,000 (40%).');

  // A151-7: Govt Securities ATL — individual, Division-IA(c) "other cases" = 15%/30%
  const s151g = computeWht({
    sectionCode: '151',
    financeActYear: 2025,
    sectionSpecific: { profitAmount: 200000, subType: 'GOVT_SEC', atlStatus: 'ATL', taxpayerType: 'INDIVIDUAL' },
  });
  assert.strictEqual(s151g.rate, 15,                                     'A151-7: Govt Sec (Individual) ATL rate = 15%');
  assert.deepStrictEqual(s151g.whtAmountPerPeriod, new Decimal(30000),   'A151-7: 200,000 × 15% = 30,000');
  console.log('  ✓ A151-7: Govt Securities (Individual) ATL 200,000 → WHT 30,000 (15%).');

  console.log('  Section 151 ✓ (7 cases)');

  // ── Section 153a — Goods (OTHER_GOODS category) ───────────────────────────
  // Company: ATL 5%, Non-ATL 10% | Individual/AOP: ATL 5.5%, Non-ATL 11%

  // A153G-1: Company ATL
  const s153ga = computeWht({
    sectionCode: '153a',
    financeActYear: 2025,
    sectionSpecific: { paymentAmount: 1000000, subType: 'OTHER_GOODS', atlStatus: 'ATL', taxpayerType: 'COMPANY' },
  });
  assert.strictEqual(s153ga.rate, 5,                                      'A153G-1: Company ATL = 5%');
  assert.deepStrictEqual(s153ga.whtAmountPerPeriod, new Decimal(50000),   'A153G-1: 1,000,000 × 5% = 50,000');
  console.log('  ✓ A153G-1: Goods Company ATL 1,000,000 → WHT 50,000 (5%).');

  // A153G-2: Company Non-ATL
  const s153gb = computeWht({
    sectionCode: '153a',
    financeActYear: 2025,
    sectionSpecific: { paymentAmount: 1000000, subType: 'OTHER_GOODS', atlStatus: 'NON_ATL', taxpayerType: 'COMPANY' },
  });
  assert.strictEqual(s153gb.rate, 10,                                     'A153G-2: Company Non-ATL = 10%');
  assert.deepStrictEqual(s153gb.whtAmountPerPeriod, new Decimal(100000),  'A153G-2: 1,000,000 × 10% = 100,000');
  console.log('  ✓ A153G-2: Goods Company Non-ATL 1,000,000 → WHT 100,000 (10%).');

  // A153G-3: Individual ATL
  const s153gc = computeWht({
    sectionCode: '153a',
    financeActYear: 2025,
    sectionSpecific: { paymentAmount: 1000000, subType: 'OTHER_GOODS', atlStatus: 'ATL', taxpayerType: 'INDIVIDUAL' },
  });
  assert.strictEqual(s153gc.rate, 5.5,                                    'A153G-3: Individual ATL = 5.5%');
  assert.deepStrictEqual(s153gc.whtAmountPerPeriod, new Decimal(55000),   'A153G-3: 1,000,000 × 5.5% = 55,000');
  console.log('  ✓ A153G-3: Goods Individual ATL 1,000,000 → WHT 55,000 (5.5%).');

  // A153G-4: Individual Non-ATL
  const s153gd = computeWht({
    sectionCode: '153a',
    financeActYear: 2025,
    sectionSpecific: { paymentAmount: 1000000, subType: 'OTHER_GOODS', atlStatus: 'NON_ATL', taxpayerType: 'INDIVIDUAL' },
  });
  assert.strictEqual(s153gd.rate, 11,                                     'A153G-4: Individual Non-ATL = 11%');
  assert.deepStrictEqual(s153gd.whtAmountPerPeriod, new Decimal(110000),  'A153G-4: 1,000,000 × 11% = 110,000');
  console.log('  ✓ A153G-4: Goods Individual Non-ATL 1,000,000 → WHT 110,000 (11%).');

  console.log('  Section 153a Goods ✓ (4 cases)');

  // ── Section 153c — Contracts (STANDARD category) ─────────────────────────
  // Company: ATL 7.5%, Non-ATL 15% | Individual/AOP: ATL 8%, Non-ATL 16%

  // A153C-1: Company ATL
  const s153ca = computeWht({
    sectionCode: '153c',
    financeActYear: 2025,
    sectionSpecific: { paymentAmount: 500000, subType: 'STANDARD', atlStatus: 'ATL', taxpayerType: 'COMPANY' },
  });
  assert.strictEqual(s153ca.rate, 7.5,                                    'A153C-1: Company ATL = 7.5%');
  assert.deepStrictEqual(s153ca.whtAmountPerPeriod, new Decimal(37500),   'A153C-1: 500,000 × 7.5% = 37,500');
  console.log('  ✓ A153C-1: Contracts Company ATL 500,000 → WHT 37,500 (7.5%).');

  // A153C-2: Company Non-ATL
  const s153cb = computeWht({
    sectionCode: '153c',
    financeActYear: 2025,
    sectionSpecific: { paymentAmount: 500000, subType: 'STANDARD', atlStatus: 'NON_ATL', taxpayerType: 'COMPANY' },
  });
  assert.strictEqual(s153cb.rate, 15,                                     'A153C-2: Company Non-ATL = 15%');
  assert.deepStrictEqual(s153cb.whtAmountPerPeriod, new Decimal(75000),   'A153C-2: 500,000 × 15% = 75,000');
  console.log('  ✓ A153C-2: Contracts Company Non-ATL 500,000 → WHT 75,000 (15%).');

  // A153C-3: Individual ATL
  const s153cc = computeWht({
    sectionCode: '153c',
    financeActYear: 2025,
    sectionSpecific: { paymentAmount: 500000, subType: 'STANDARD', atlStatus: 'ATL', taxpayerType: 'INDIVIDUAL' },
  });
  assert.strictEqual(s153cc.rate, 8,                                      'A153C-3: Individual ATL = 8%');
  assert.deepStrictEqual(s153cc.whtAmountPerPeriod, new Decimal(40000),   'A153C-3: 500,000 × 8% = 40,000');
  console.log('  ✓ A153C-3: Contracts Individual ATL 500,000 → WHT 40,000 (8%).');

  // A153C-4: Individual Non-ATL
  const s153cd = computeWht({
    sectionCode: '153c',
    financeActYear: 2025,
    sectionSpecific: { paymentAmount: 500000, subType: 'STANDARD', atlStatus: 'NON_ATL', taxpayerType: 'INDIVIDUAL' },
  });
  assert.strictEqual(s153cd.rate, 16,                                     'A153C-4: Individual Non-ATL = 16%');
  assert.deepStrictEqual(s153cd.whtAmountPerPeriod, new Decimal(80000),   'A153C-4: 500,000 × 16% = 80,000');
  console.log('  ✓ A153C-4: Contracts Individual Non-ATL 500,000 → WHT 80,000 (16%).');

  console.log('  Section 153c Contracts ✓ (4 cases)');

  // ── Section 155 — Rent top slab (rate 15% → 25%) ──────────────────────────
  // Monthly 250,000 → annualised 3,000,000
  // 0-300k:0 | 300k-600k:15k | 600k-2M:15k+10%×1.4M=155k | 2M-3M:155k+25%×1M=405k
  // Per-period (÷12) = 33,750

  // A155-1: Individual ATL, annual rent 3,000,000
  const s155a = computeWht({
    sectionCode: '155',
    financeActYear: 2025,
    sectionSpecific: {
      rentAmount: 250000,
      frequency: 'MONTHLY',
      atlStatus: 'ATL',
      taxpayerType: 'INDIVIDUAL',
    },
  });
  assert.deepStrictEqual(s155a.annualisedAmount,   new Decimal(3000000), 'A155-1: annualised rent = 3,000,000');
  assert.deepStrictEqual(s155a.whtAmountAnnual,    new Decimal(405000),  'A155-1: annual WHT = 405,000');
  assert.deepStrictEqual(s155a.whtAmountPerPeriod, new Decimal(33750),   'A155-1: monthly = 33,750');
  console.log('  ✓ A155-1: Rent Individual ATL monthly 250k (annual 3M) → WHT 405,000 annual / 33,750 monthly.');

  // A155-2: Confirm top slab rate is 25% and not the old 15%.
  // At exactly Rs. 2,000,001 annual rent, the top slab should trigger at 25%.
  // Annualised ≈ 2,000,001 → slab 4 excess = 1 unit → tax ≈ 155,000 (rounds to 155,000).
  const s155b = computeWht({
    sectionCode: '155',
    financeActYear: 2025,
    sectionSpecific: {
      rentAmount: 2000001,      // ONE_TIME so no multiplier
      frequency: 'ONE_TIME',
      atlStatus: 'ATL',
      taxpayerType: 'INDIVIDUAL',
    },
  });
  assert.deepStrictEqual(s155b.whtAmountAnnual, new Decimal(155000),
    'A155-2: 2,000,001 annual rent → top slab engages at 25%, rounds to 155,000 fixedTax');
  console.log('  ✓ A155-2: top slab triggers at 25% (not old 15%) at 2,000,001 entry point.');

  // A155-3: Company flat rates are unchanged — verify no regression.
  const s155c = computeWht({
    sectionCode: '155',
    financeActYear: 2025,
    sectionSpecific: {
      rentAmount: 500000,
      frequency: 'SEMI_ANNUAL',
      atlStatus: 'ATL',
      taxpayerType: 'COMPANY',
    },
  });
  assert.strictEqual(s155c.rate, 15,                                     'A155-3: Company ATL still 15%');
  assert.deepStrictEqual(s155c.whtAmountPerPeriod, new Decimal(75000),  'A155-3: 500k semi-annual company → per-period 75,000');
  console.log('  ✓ A155-3: Company ATL 15% is unchanged (no regression).');

  console.log('  Section 155 ✓ (3 cases)');

  // ── Cross-year regression: TY2026-27 (fy2027.ts) rates must be unaffected ─
  // Section 149 in fy2027.ts still uses 5%/15%/25% boundaries at 2.4M/3.6M/6M.
  // A date in Tax Year 2026-27 must still return the old FY2027 slab results.

  const fy2027SalaryResult = computeWht({
    sectionCode: '149',
    transactionDate: '2026-09-01',   // Tax Year 2026-27 → fy2027.ts
    sectionSpecific: { monthlySalary: 200000, frequency: 'MONTHLY', taxpayerType: 'INDIVIDUAL' },
  });
  assert.strictEqual(fy2027SalaryResult.financeActYear, 2026,
    'Cross-year regression: 2026-09-01 must resolve to financeActYear 2026 (FY2026-27)');
  assert.deepStrictEqual(fy2027SalaryResult.whtAmountAnnual, new Decimal(210000),
    'Cross-year regression: fy2027 200k/month → 210,000 annual (5%/15% slabs still intact)');
  console.log('  ✓ Cross-year regression: fy2027.ts slabs unaffected (200k/month → 210,000 in TY2026-27).');

  console.log('✓ All Track A FY2025-26 verification tests passed. (22 assertions across 5 sections)');
}

// 14. Section 153 Sub-section Split — all four new section codes (financeActYear: 2025)
function testSection153Split() {
  console.log('\n14. Testing Section 153 Sub-section Split (153a / 153b / 153c / 6a)...');

  // ── 153a: Supply of Goods ─────────────────────────────────────────────────

  // Other Goods — Company ATL 5%
  const r153a1 = computeWht({ sectionCode: '153a', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 1000000, subType: 'OTHER_GOODS', atlStatus: 'ATL', taxpayerType: 'COMPANY' } });
  assert.strictEqual(r153a1.rate, 5);
  assert.deepStrictEqual(r153a1.whtAmountPerPeriod, new Decimal(50000));
  console.log('  ✓ 153a OTHER_GOODS Company ATL 1,000,000 → 50,000 (5%).');

  // Other Goods — Individual Non-ATL 11%
  const r153a2 = computeWht({ sectionCode: '153a', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 500000, subType: 'OTHER_GOODS', atlStatus: 'NON_ATL', taxpayerType: 'INDIVIDUAL' } });
  assert.strictEqual(r153a2.rate, 11);
  assert.deepStrictEqual(r153a2.whtAmountPerPeriod, new Decimal(55000));
  console.log('  ✓ 153a OTHER_GOODS Individual Non-ATL 500,000 → 55,000 (11%).');

  // Toll Manufacturing — Company ATL 9%
  const r153a3 = computeWht({ sectionCode: '153a', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 200000, subType: 'TOLL_MANUFACTURING', atlStatus: 'ATL', taxpayerType: 'COMPANY' } });
  assert.strictEqual(r153a3.rate, 9);
  assert.deepStrictEqual(r153a3.whtAmountPerPeriod, new Decimal(18000));
  console.log('  ✓ 153a TOLL_MANUFACTURING Company ATL 200,000 → 18,000 (9%).');

  // Toll Manufacturing — Individual Non-ATL 22%
  const r153a4 = computeWht({ sectionCode: '153a', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 100000, subType: 'TOLL_MANUFACTURING', atlStatus: 'NON_ATL', taxpayerType: 'INDIVIDUAL' } });
  assert.strictEqual(r153a4.rate, 22);
  assert.deepStrictEqual(r153a4.whtAmountPerPeriod, new Decimal(22000));
  console.log('  ✓ 153a TOLL_MANUFACTURING Individual Non-ATL 100,000 → 22,000 (22%).');

  // Distributor Special — null taxpayerType ATL 0.25%
  const r153a5 = computeWht({ sectionCode: '153a', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 4000000, subType: 'DISTRIBUTOR_SPECIAL', atlStatus: 'ATL', taxpayerType: 'COMPANY' } });
  assert.strictEqual(r153a5.rate, 0.25);
  assert.deepStrictEqual(r153a5.whtAmountPerPeriod, new Decimal(10000));
  console.log('  ✓ 153a DISTRIBUTOR_SPECIAL Company ATL 4,000,000 → 10,000 (0.25%).');

  // Yarn Trader — ATL 0.5%, Non-ATL 1%
  const r153a6 = computeWht({ sectionCode: '153a', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 1000000, subType: 'YARN_TRADER', atlStatus: 'ATL', taxpayerType: 'INDIVIDUAL' } });
  assert.strictEqual(r153a6.rate, 0.5);
  assert.deepStrictEqual(r153a6.whtAmountPerPeriod, new Decimal(5000));
  console.log('  ✓ 153a YARN_TRADER Individual ATL 1,000,000 → 5,000 (0.5%).');

  // Cigarette — Non-ATL 5%
  const r153a7 = computeWht({ sectionCode: '153a', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 500000, subType: 'CIGARETTE', atlStatus: 'NON_ATL', taxpayerType: 'COMPANY' } });
  assert.strictEqual(r153a7.rate, 5);
  assert.deepStrictEqual(r153a7.whtAmountPerPeriod, new Decimal(25000));
  console.log('  ✓ 153a CIGARETTE Company Non-ATL 500,000 → 25,000 (5%).');

  // Pharma — ATL 1%
  const r153a8 = computeWht({ sectionCode: '153a', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 800000, subType: 'PHARMA', atlStatus: 'ATL', taxpayerType: 'COMPANY' } });
  assert.strictEqual(r153a8.rate, 1);
  assert.deepStrictEqual(r153a8.whtAmountPerPeriod, new Decimal(8000));
  console.log('  ✓ 153a PHARMA Company ATL 800,000 → 8,000 (1%).');

  // Agricultural Commodity — Non-ATL 3%
  const r153a9 = computeWht({ sectionCode: '153a', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 300000, subType: 'AGRI_COMMODITY', atlStatus: 'NON_ATL', taxpayerType: 'INDIVIDUAL' } });
  assert.strictEqual(r153a9.rate, 3);
  assert.deepStrictEqual(r153a9.whtAmountPerPeriod, new Decimal(9000));
  console.log('  ✓ 153a AGRI_COMMODITY Individual Non-ATL 300,000 → 9,000 (3%).');

  console.log('  Section 153a ✓ (9 cases)');

  // ── 153b: Provision of Services ───────────────────────────────────────────

  // Threshold guard: 20,000 < 30,000 → exempt (threshold corrected in D2 remediation)
  const r153b1 = computeWht({ sectionCode: '153b', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 20000, subType: 'SPECIFIED', atlStatus: 'ATL', taxpayerType: 'COMPANY' } });
  assert.strictEqual(r153b1.applicable, false);
  assert.ok(r153b1.inapplicableReason?.includes('30,000'));
  console.log('  ✓ 153b SPECIFIED 20,000 → exempt (below corrected PKR 30,000 threshold).');

  // Specified — ATL 6%
  const r153b2 = computeWht({ sectionCode: '153b', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 200000, subType: 'SPECIFIED', atlStatus: 'ATL', taxpayerType: 'COMPANY' } });
  assert.strictEqual(r153b2.rate, 6);
  assert.deepStrictEqual(r153b2.whtAmountPerPeriod, new Decimal(12000));
  console.log('  ✓ 153b SPECIFIED Company ATL 200,000 → 12,000 (6%).');

  // Specified — Non-ATL 12%
  const r153b3 = computeWht({ sectionCode: '153b', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 200000, subType: 'SPECIFIED', atlStatus: 'NON_ATL', taxpayerType: 'INDIVIDUAL' } });
  assert.strictEqual(r153b3.rate, 12);
  assert.deepStrictEqual(r153b3.whtAmountPerPeriod, new Decimal(24000));
  console.log('  ✓ 153b SPECIFIED Individual Non-ATL 200,000 → 24,000 (12%).');

  // IT_ITES — ATL 4%
  const r153b4 = computeWht({ sectionCode: '153b', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 500000, subType: 'IT_ITES', atlStatus: 'ATL', taxpayerType: 'COMPANY' } });
  assert.strictEqual(r153b4.rate, 4);
  assert.deepStrictEqual(r153b4.whtAmountPerPeriod, new Decimal(20000));
  console.log('  ✓ 153b IT_ITES Company ATL 500,000 → 20,000 (4%).');

  // Print Media — ATL 1.5%
  const r153b5 = computeWht({ sectionCode: '153b', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 400000, subType: 'PRINT_MEDIA', atlStatus: 'ATL', taxpayerType: 'COMPANY' } });
  assert.strictEqual(r153b5.rate, 1.5);
  assert.deepStrictEqual(r153b5.whtAmountPerPeriod, new Decimal(6000));
  console.log('  ✓ 153b PRINT_MEDIA Company ATL 400,000 → 6,000 (1.5%).');

  // Other Services — ATL 15%
  const r153b6 = computeWht({ sectionCode: '153b', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 100000, subType: 'OTHER_SERVICES', atlStatus: 'ATL', taxpayerType: 'COMPANY' } });
  assert.strictEqual(r153b6.rate, 15);
  assert.deepStrictEqual(r153b6.whtAmountPerPeriod, new Decimal(15000));
  console.log('  ✓ 153b OTHER_SERVICES Company ATL 100,000 → 15,000 (15%).');

  // Other Services — Non-ATL 30%
  const r153b7 = computeWht({ sectionCode: '153b', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 100000, subType: 'OTHER_SERVICES', atlStatus: 'NON_ATL', taxpayerType: 'INDIVIDUAL' } });
  assert.strictEqual(r153b7.rate, 30);
  assert.deepStrictEqual(r153b7.whtAmountPerPeriod, new Decimal(30000));
  console.log('  ✓ 153b OTHER_SERVICES Individual Non-ATL 100,000 → 30,000 (30%).');

  console.log('  Section 153b ✓ (7 cases including threshold guard)');

  // ── 153c: Execution of Contracts ──────────────────────────────────────────

  // Sportsperson — ATL 15%
  const r153c1 = computeWht({ sectionCode: '153c', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 300000, subType: 'SPORTSPERSON', atlStatus: 'ATL', taxpayerType: 'INDIVIDUAL' } });
  assert.strictEqual(r153c1.rate, 15);
  assert.deepStrictEqual(r153c1.whtAmountPerPeriod, new Decimal(45000));
  console.log('  ✓ 153c SPORTSPERSON Individual ATL 300,000 → 45,000 (15%).');

  // Sportsperson — Non-ATL 30%
  const r153c2 = computeWht({ sectionCode: '153c', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 300000, subType: 'SPORTSPERSON', atlStatus: 'NON_ATL', taxpayerType: 'COMPANY' } });
  assert.strictEqual(r153c2.rate, 30);
  assert.deepStrictEqual(r153c2.whtAmountPerPeriod, new Decimal(90000));
  console.log('  ✓ 153c SPORTSPERSON Company Non-ATL 300,000 → 90,000 (30%).');

  // Standard — Company ATL 7.5%
  const r153c3 = computeWht({ sectionCode: '153c', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 800000, subType: 'STANDARD', atlStatus: 'ATL', taxpayerType: 'COMPANY' } });
  assert.strictEqual(r153c3.rate, 7.5);
  assert.deepStrictEqual(r153c3.whtAmountPerPeriod, new Decimal(60000));
  console.log('  ✓ 153c STANDARD Company ATL 800,000 → 60,000 (7.5%).');

  // Standard — Individual ATL 8%
  const r153c4 = computeWht({ sectionCode: '153c', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 500000, subType: 'STANDARD', atlStatus: 'ATL', taxpayerType: 'INDIVIDUAL' } });
  assert.strictEqual(r153c4.rate, 8);
  assert.deepStrictEqual(r153c4.whtAmountPerPeriod, new Decimal(40000));
  console.log('  ✓ 153c STANDARD Individual ATL 500,000 → 40,000 (8%).');

  console.log('  Section 153c ✓ (4 cases)');

  // ── 6a: Digital Transactions ──────────────────────────────────────────────

  // Digital Payment — ATL 1%
  const r6a1 = computeWht({ sectionCode: '6a', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 500000, subType: 'DIGITAL_PAYMENT', atlStatus: 'ATL' } });
  assert.strictEqual(r6a1.rate, 1);
  assert.deepStrictEqual(r6a1.whtAmountPerPeriod, new Decimal(5000));
  console.log('  ✓ 6a DIGITAL_PAYMENT ATL 500,000 → 5,000 (1%).');

  // Digital Payment — Non-ATL 2%
  const r6a2 = computeWht({ sectionCode: '6a', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 500000, subType: 'DIGITAL_PAYMENT', atlStatus: 'NON_ATL' } });
  assert.strictEqual(r6a2.rate, 2);
  assert.deepStrictEqual(r6a2.whtAmountPerPeriod, new Decimal(10000));
  console.log('  ✓ 6a DIGITAL_PAYMENT Non-ATL 500,000 → 10,000 (2%).');

  // COD — ATL 2%
  const r6a3 = computeWht({ sectionCode: '6a', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 200000, subType: 'COD', atlStatus: 'ATL' } });
  assert.strictEqual(r6a3.rate, 2);
  assert.deepStrictEqual(r6a3.whtAmountPerPeriod, new Decimal(4000));
  console.log('  ✓ 6a COD ATL 200,000 → 4,000 (2%).');

  // COD — Non-ATL 4%
  const r6a4 = computeWht({ sectionCode: '6a', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 200000, subType: 'COD', atlStatus: 'NON_ATL' } });
  assert.strictEqual(r6a4.rate, 4);
  assert.deepStrictEqual(r6a4.whtAmountPerPeriod, new Decimal(8000));
  console.log('  ✓ 6a COD Non-ATL 200,000 → 8,000 (4%).');

  console.log('  Section 6a ✓ (4 cases)');
  console.log('✓ All Section 153 sub-section split tests passed. (24 cases across 4 sections)');
}

// 15. Remediation verification — FY2025-26 (Finance Act 2025)
// Verifies all four D-series findings from docs/FY2026_SECTION_153_FINAL_VALIDATION.md
function testRemediationFY2026() {
  console.log('\n15. Testing FY2025-26 Remediation (D1–D4 from validation report)...');

  // ── D1 + D2: Threshold corrections ───────────────────────────────────────

  // D1: 153a now enforces Rs.75,000 threshold — below threshold is exempt
  const r153aBelow = computeWht({ sectionCode: '153a', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 50000, subType: 'OTHER_GOODS', atlStatus: 'ATL', taxpayerType: 'COMPANY' } });
  assert.strictEqual(r153aBelow.applicable, false, 'D1: 153a 50,000 must be exempt (below Rs.75,000)');
  assert.ok(r153aBelow.inapplicableReason?.includes('75,000'), 'D1: reason must cite 75,000');
  assert.strictEqual(r153aBelow.theoreticalRate, 5, 'D1: theoreticalRate = 5% (OTHER_GOODS COMPANY ATL)');
  assert.deepStrictEqual(r153aBelow.theoreticalWhtAmount, new Decimal(2500), 'D1: 50,000 × 5% = 2,500');
  assert.strictEqual(r153aBelow.thresholdMinimum, 75000, 'D1: thresholdMinimum = 75,000');
  console.log('  ✓ D1: 153a 50,000 → exempt (below Rs.75,000 goods threshold).');

  // D1: 153a 80,000 is above threshold — must apply
  const r153aAbove = computeWht({ sectionCode: '153a', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 80000, subType: 'OTHER_GOODS', atlStatus: 'ATL', taxpayerType: 'COMPANY' } });
  assert.strictEqual(r153aAbove.applicable, true, 'D1: 153a 80,000 must apply (above Rs.75,000)');
  assert.strictEqual(r153aAbove.rate, 5);
  assert.deepStrictEqual(r153aAbove.whtAmountPerPeriod, new Decimal(4000), 'D1: 80,000 × 5% = 4,000');
  console.log('  ✓ D1: 153a 80,000 → 4,000 (5%, above goods threshold).');

  // D2: 153b corrected threshold — 25,000 is below Rs.30,000 → exempt
  const r153bBelow = computeWht({ sectionCode: '153b', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 25000, subType: 'SPECIFIED', atlStatus: 'ATL', taxpayerType: 'COMPANY' } });
  assert.strictEqual(r153bBelow.applicable, false, 'D2: 153b 25,000 must be exempt (below Rs.30,000)');
  assert.ok(r153bBelow.inapplicableReason?.includes('30,000'), 'D2: reason must cite 30,000');
  assert.strictEqual(r153bBelow.theoreticalRate, 6, 'D2: theoreticalRate = 6% (SPECIFIED ATL)');
  assert.deepStrictEqual(r153bBelow.theoreticalWhtAmount, new Decimal(1500), 'D2: 25,000 × 6% = 1,500');
  assert.strictEqual(r153bBelow.thresholdMinimum, 30000, 'D2: thresholdMinimum = 30,000');
  console.log('  ✓ D2: 153b 25,000 → exempt (below corrected Rs.30,000 services threshold).');

  // D2: 153b 50,000 was INCORRECTLY exempt under old 75k threshold; must now apply
  const r153bPrevExempt = computeWht({ sectionCode: '153b', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 50000, subType: 'SPECIFIED', atlStatus: 'ATL', taxpayerType: 'COMPANY' } });
  assert.strictEqual(r153bPrevExempt.applicable, true, 'D2: 153b 50,000 now applicable (> Rs.30,000)');
  assert.strictEqual(r153bPrevExempt.rate, 6);
  assert.deepStrictEqual(r153bPrevExempt.whtAmountPerPeriod, new Decimal(3000), 'D2: 50,000 × 6% = 3,000');
  console.log('  ✓ D2: 153b 50,000 → 3,000 (6%, was incorrectly exempt under old Rs.75,000 threshold).');

  console.log('  D1 + D2 (threshold fixes) ✓');

  // ── D3: Section 153(2A) legal reference ───────────────────────────────────

  const configFY2026Local = RATE_REGISTRY[2025];
  const section6a = configFY2026Local.sections.find((s) => s.code === '6a');
  assert.ok(section6a !== undefined, 'D3: section code "6a" must exist in registry[2025]');
  assert.ok(
    !section6a!.legalReference.includes('[PENDING FBR CONFIRMATION]'),
    'D3: legalReference must not contain [PENDING FBR CONFIRMATION]'
  );
  assert.ok(
    section6a!.legalReference.includes('153(2A)'),
    'D3: legalReference must reference Section 153(2A)'
  );
  console.log('  ✓ D3: 6a legalReference = "Section 153(2A) Income Tax Ordinance 2001".');

  const digital6aResult = computeWht({ sectionCode: '6a', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 100000, subType: 'DIGITAL_PAYMENT', atlStatus: 'ATL' } });
  assert.ok(
    !digital6aResult.rateLabel.includes('[PENDING FBR CONFIRMATION]'),
    'D3: 6a rateLabel must not contain [PENDING FBR CONFIRMATION]'
  );
  assert.strictEqual(digital6aResult.rate, 1, 'D3: digital payment ATL still 1%');
  console.log('  ✓ D3: 6a rateLabel has no [PENDING FBR CONFIRMATION]; rate confirmed 1%.');

  console.log('  D3 (legal reference) ✓');

  // ── D4: New §153a sub-categories TEXTILE_SECTOR and GOLD_SILVER ──────────

  // TEXTILE_SECTOR ATL 1%
  const rTextileAtl = computeWht({ sectionCode: '153a', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 100000, subType: 'TEXTILE_SECTOR', atlStatus: 'ATL', taxpayerType: 'COMPANY' } });
  assert.strictEqual(rTextileAtl.applicable, true);
  assert.strictEqual(rTextileAtl.rate, 1, 'D4: TEXTILE_SECTOR ATL = 1%');
  assert.deepStrictEqual(rTextileAtl.whtAmountPerPeriod, new Decimal(1000), 'D4: 100,000 × 1% = 1,000');
  console.log('  ✓ D4: TEXTILE_SECTOR ATL 100,000 → 1,000 (1%).');

  // TEXTILE_SECTOR Non-ATL 2%
  const rTextileNonAtl = computeWht({ sectionCode: '153a', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 100000, subType: 'TEXTILE_SECTOR', atlStatus: 'NON_ATL', taxpayerType: 'INDIVIDUAL' } });
  assert.strictEqual(rTextileNonAtl.rate, 2, 'D4: TEXTILE_SECTOR Non-ATL = 2%');
  assert.deepStrictEqual(rTextileNonAtl.whtAmountPerPeriod, new Decimal(2000), 'D4: 100,000 × 2% = 2,000');
  console.log('  ✓ D4: TEXTILE_SECTOR Non-ATL 100,000 → 2,000 (2%).');

  // GOLD_SILVER ATL 1%
  const rGoldAtl = computeWht({ sectionCode: '153a', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 500000, subType: 'GOLD_SILVER', atlStatus: 'ATL', taxpayerType: 'COMPANY' } });
  assert.strictEqual(rGoldAtl.applicable, true);
  assert.strictEqual(rGoldAtl.rate, 1, 'D4: GOLD_SILVER ATL = 1%');
  assert.deepStrictEqual(rGoldAtl.whtAmountPerPeriod, new Decimal(5000), 'D4: 500,000 × 1% = 5,000');
  console.log('  ✓ D4: GOLD_SILVER ATL 500,000 → 5,000 (1%).');

  // GOLD_SILVER Non-ATL 2%
  const rGoldNonAtl = computeWht({ sectionCode: '153a', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 500000, subType: 'GOLD_SILVER', atlStatus: 'NON_ATL', taxpayerType: 'AOP' } });
  assert.strictEqual(rGoldNonAtl.rate, 2, 'D4: GOLD_SILVER Non-ATL = 2%');
  assert.deepStrictEqual(rGoldNonAtl.whtAmountPerPeriod, new Decimal(10000), 'D4: 500,000 × 2% = 10,000');
  console.log('  ✓ D4: GOLD_SILVER Non-ATL 500,000 → 10,000 (2%).');

  // Regression: existing 153a sub-categories unaffected by new additions
  const rAgriRegress = computeWht({ sectionCode: '153a', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 300000, subType: 'AGRI_COMMODITY', atlStatus: 'ATL', taxpayerType: 'COMPANY' } });
  assert.strictEqual(rAgriRegress.rate, 1.5, 'D4 regression: AGRI_COMMODITY ATL still 1.5%');
  console.log('  ✓ D4 regression: AGRI_COMMODITY ATL 300,000 still 1.5% (unaffected).');

  console.log('  D4 (new sub-categories) ✓');

  console.log('✓ All FY2025-26 remediation tests passed. (15 assertions across D1–D4)');
}

function testSection233() {
  console.log('\n16. Testing Section 233 - Brokerage and Commission...');

  // Advertising Agent — ATL 10%
  const advAtl = computeWht({ sectionCode: '233', financeActYear: 2025,
    sectionSpecific: { commissionAmount: 100000, subType: 'ADVERTISING_AGENT', atlStatus: 'ATL' } });
  assert.strictEqual(advAtl.applicable, true);
  assert.strictEqual(advAtl.rate, 10, '233 Advertising Agent ATL = 10%');
  assert.deepStrictEqual(advAtl.whtAmountPerPeriod, new Decimal(10000), '100,000 × 10% = 10,000');
  console.log('  ✓ 233 ADVERTISING_AGENT ATL 100,000 → 10,000 (10%).');

  // Advertising Agent — Non-ATL 20%
  const advNonAtl = computeWht({ sectionCode: '233', financeActYear: 2025,
    sectionSpecific: { commissionAmount: 100000, subType: 'ADVERTISING_AGENT', atlStatus: 'NON_ATL' } });
  assert.strictEqual(advNonAtl.rate, 20, '233 Advertising Agent Non-ATL = 20%');
  assert.deepStrictEqual(advNonAtl.whtAmountPerPeriod, new Decimal(20000), '100,000 × 20% = 20,000');
  console.log('  ✓ 233 ADVERTISING_AGENT Non-ATL 100,000 → 20,000 (20%).');

  // Life Insurance Agent — ATL 8%
  const lifeAtl = computeWht({ sectionCode: '233', financeActYear: 2025,
    sectionSpecific: { commissionAmount: 200000, subType: 'LIFE_INSURANCE_AGENT', atlStatus: 'ATL' } });
  assert.strictEqual(lifeAtl.rate, 8, '233 Life Insurance Agent ATL = 8%');
  assert.deepStrictEqual(lifeAtl.whtAmountPerPeriod, new Decimal(16000), '200,000 × 8% = 16,000');
  console.log('  ✓ 233 LIFE_INSURANCE_AGENT ATL 200,000 → 16,000 (8%).');

  // Life Insurance Agent — Non-ATL 16%
  const lifeNonAtl = computeWht({ sectionCode: '233', financeActYear: 2025,
    sectionSpecific: { commissionAmount: 200000, subType: 'LIFE_INSURANCE_AGENT', atlStatus: 'NON_ATL' } });
  assert.strictEqual(lifeNonAtl.rate, 16, '233 Life Insurance Agent Non-ATL = 16%');
  assert.deepStrictEqual(lifeNonAtl.whtAmountPerPeriod, new Decimal(32000), '200,000 × 16% = 32,000');
  console.log('  ✓ 233 LIFE_INSURANCE_AGENT Non-ATL 200,000 → 32,000 (16%).');

  // Other — ATL 12%
  const otherAtl = computeWht({ sectionCode: '233', financeActYear: 2025,
    sectionSpecific: { commissionAmount: 50000, subType: 'OTHER', atlStatus: 'ATL' } });
  assert.strictEqual(otherAtl.rate, 12, '233 Other ATL = 12%');
  assert.deepStrictEqual(otherAtl.whtAmountPerPeriod, new Decimal(6000), '50,000 × 12% = 6,000');
  console.log('  ✓ 233 OTHER ATL 50,000 → 6,000 (12%).');

  // Other — Non-ATL 24%
  const otherNonAtl = computeWht({ sectionCode: '233', financeActYear: 2025,
    sectionSpecific: { commissionAmount: 50000, subType: 'OTHER', atlStatus: 'NON_ATL' } });
  assert.strictEqual(otherNonAtl.rate, 24, '233 Other Non-ATL = 24%');
  assert.deepStrictEqual(otherNonAtl.whtAmountPerPeriod, new Decimal(12000), '50,000 × 24% = 12,000');
  console.log('  ✓ 233 OTHER Non-ATL 50,000 → 12,000 (24%).');

  // Section config presence + placeholder marking for FY2026-27 / FY2027-28
  const section233_2026 = RATE_REGISTRY[2026].sections.find((s) => s.code === '233');
  const section233_2027 = RATE_REGISTRY[2027].sections.find((s) => s.code === '233');
  assert.ok(section233_2026 !== undefined, '233 must exist in FY2026-27 registry');
  assert.ok(section233_2027 !== undefined, '233 must exist in FY2027-28 registry');
  assert.ok(
    section233_2026!.rules.every((r) => r.rateLabel.includes('[PLACEHOLDER]')),
    'FY2026-27 §233 rules must be marked [PLACEHOLDER] pending FBR validation'
  );
  assert.ok(
    section233_2027!.rules.every((r) => r.rateLabel.includes('[PLACEHOLDER]')),
    'FY2027-28 §233 rules must be marked [PLACEHOLDER] pending FBR validation'
  );
  console.log('  ✓ FY2026-27 / FY2027-28 §233 present and marked [PLACEHOLDER].');

  console.log('✓ All Section 233 tests passed. (8 assertions)');
}

function testSection156() {
  console.log('\n17. Testing Section 156 - Prizes and Winnings...');

  // Prize Bond — ATL 15%
  const bondAtl = computeWht({ sectionCode: '156', financeActYear: 2025,
    sectionSpecific: { prizeAmount: 100000, subType: 'PRIZE_BOND', atlStatus: 'ATL' } });
  assert.strictEqual(bondAtl.applicable, true);
  assert.strictEqual(bondAtl.rate, 15, '156 Prize Bond ATL = 15%');
  assert.deepStrictEqual(bondAtl.whtAmountPerPeriod, new Decimal(15000), '100,000 × 15% = 15,000');
  console.log('  ✓ 156 PRIZE_BOND ATL 100,000 → 15,000 (15%).');

  // Prize Bond — Non-ATL 30%
  const bondNonAtl = computeWht({ sectionCode: '156', financeActYear: 2025,
    sectionSpecific: { prizeAmount: 100000, subType: 'PRIZE_BOND', atlStatus: 'NON_ATL' } });
  assert.strictEqual(bondNonAtl.rate, 30, '156 Prize Bond Non-ATL = 30%');
  assert.deepStrictEqual(bondNonAtl.whtAmountPerPeriod, new Decimal(30000), '100,000 × 30% = 30,000');
  console.log('  ✓ 156 PRIZE_BOND Non-ATL 100,000 → 30,000 (30%).');

  // Other Winnings — ATL 20%
  const otherAtl = computeWht({ sectionCode: '156', financeActYear: 2025,
    sectionSpecific: { prizeAmount: 50000, subType: 'OTHER_WINNINGS', atlStatus: 'ATL' } });
  assert.strictEqual(otherAtl.rate, 20, '156 Other Winnings ATL = 20%');
  assert.deepStrictEqual(otherAtl.whtAmountPerPeriod, new Decimal(10000), '50,000 × 20% = 10,000');
  console.log('  ✓ 156 OTHER_WINNINGS ATL 50,000 → 10,000 (20%).');

  // Other Winnings — Non-ATL 40%
  const otherNonAtl = computeWht({ sectionCode: '156', financeActYear: 2025,
    sectionSpecific: { prizeAmount: 50000, subType: 'OTHER_WINNINGS', atlStatus: 'NON_ATL' } });
  assert.strictEqual(otherNonAtl.rate, 40, '156 Other Winnings Non-ATL = 40%');
  assert.deepStrictEqual(otherNonAtl.whtAmountPerPeriod, new Decimal(20000), '50,000 × 40% = 20,000');
  console.log('  ✓ 156 OTHER_WINNINGS Non-ATL 50,000 → 20,000 (40%).');

  // Section config presence + placeholder marking for FY2026-27 / FY2027-28
  const section156_2026 = RATE_REGISTRY[2026].sections.find((s) => s.code === '156');
  const section156_2027 = RATE_REGISTRY[2027].sections.find((s) => s.code === '156');
  assert.ok(section156_2026 !== undefined, '156 must exist in FY2026-27 registry');
  assert.ok(section156_2027 !== undefined, '156 must exist in FY2027-28 registry');
  assert.ok(
    section156_2026!.rules.every((r) => r.rateLabel.includes('[PLACEHOLDER]')),
    'FY2026-27 §156 rules must be marked [PLACEHOLDER] pending FBR validation'
  );
  assert.ok(
    section156_2027!.rules.every((r) => r.rateLabel.includes('[PLACEHOLDER]')),
    'FY2027-28 §156 rules must be marked [PLACEHOLDER] pending FBR validation'
  );
  console.log('  ✓ FY2026-27 / FY2027-28 §156 present and marked [PLACEHOLDER].');

  console.log('✓ All Section 156 tests passed. (6 assertions)');
}

function testSection154() {
  console.log('\n18. Testing Section 154 - Exports...');

  // Standard export — 2% total (1% Minimum Tax §154 + 1% Advance Tax §147),
  // no ATL/Non-ATL split.
  const standard = computeWht({ sectionCode: '154', financeActYear: 2025,
    sectionSpecific: { exportProceeds: 1000000, subType: 'STANDARD_EXPORT' } });
  assert.strictEqual(standard.applicable, true);
  assert.strictEqual(standard.rate, 2, '154 STANDARD_EXPORT = 2% (1% min + 1% advance)');
  assert.deepStrictEqual(standard.whtAmountPerPeriod, new Decimal(20000), '1,000,000 × 2% = 20,000');
  assert.ok(
    standard.rateLabel.includes('1% Minimum Tax') && standard.rateLabel.includes('1% Advance Tax'),
    '154 rateLabel must show both components'
  );
  console.log('  ✓ 154 STANDARD_EXPORT 1,000,000 → 20,000 (2% = 1% Min + 1% Advance).');

  // Cooking oil/ghee exported to Afghanistan — 0%
  const afghan = computeWht({ sectionCode: '154', financeActYear: 2025,
    sectionSpecific: { exportProceeds: 1000000, subType: 'AFGHAN_COOKING_OIL' } });
  assert.strictEqual(afghan.rate, 0, '154 Afghan Cooking Oil = 0%');
  assert.deepStrictEqual(afghan.whtAmountPerPeriod, new Decimal(0), '1,000,000 × 0% = 0');
  console.log('  ✓ 154 AFGHAN_COOKING_OIL 1,000,000 → 0 (0%).');

  // Section config presence + placeholder marking for FY2026-27 / FY2027-28
  const section154_2026 = RATE_REGISTRY[2026].sections.find((s) => s.code === '154');
  const section154_2027 = RATE_REGISTRY[2027].sections.find((s) => s.code === '154');
  assert.ok(section154_2026 !== undefined, '154 must exist in FY2026-27 registry');
  assert.ok(section154_2027 !== undefined, '154 must exist in FY2027-28 registry');
  assert.ok(
    section154_2026!.rules.every((r) => r.rateLabel.includes('[PLACEHOLDER]')),
    'FY2026-27 §154 rules must be marked [PLACEHOLDER] pending Finance Act 2026'
  );
  assert.ok(
    section154_2027!.rules.every((r) => r.rateLabel.includes('[PLACEHOLDER]')),
    'FY2027-28 §154 rules must be marked [PLACEHOLDER] pending Finance Act 2027'
  );
  console.log('  ✓ FY2026-27 / FY2027-28 §154 present and marked [PLACEHOLDER].');

  console.log('✓ All Section 154 tests passed. (6 assertions)');
}

function testSection154A() {
  console.log('\n19. Testing Section 154A - Export of Services...');

  // PSEB ATL — 0.25%
  const psebAtl = computeWht({ sectionCode: '154A', financeActYear: 2025,
    sectionSpecific: { serviceProceeds: 1000000, subType: 'PSEB_IT_ITES', atlStatus: 'ATL' } });
  assert.strictEqual(psebAtl.applicable, true);
  assert.strictEqual(psebAtl.rate, 0.25, '154A PSEB ATL = 0.25%');
  assert.deepStrictEqual(psebAtl.whtAmountPerPeriod, new Decimal(2500), '1,000,000 × 0.25% = 2,500');
  console.log('  ✓ 154A PSEB_IT_ITES ATL 1,000,000 → 2,500 (0.25%).');

  // PSEB Non-ATL — 0.5%
  const psebNonAtl = computeWht({ sectionCode: '154A', financeActYear: 2025,
    sectionSpecific: { serviceProceeds: 1000000, subType: 'PSEB_IT_ITES', atlStatus: 'NON_ATL' } });
  assert.strictEqual(psebNonAtl.rate, 0.5, '154A PSEB Non-ATL = 0.5%');
  assert.deepStrictEqual(psebNonAtl.whtAmountPerPeriod, new Decimal(5000), '1,000,000 × 0.5% = 5,000');
  console.log('  ✓ 154A PSEB_IT_ITES Non-ATL 1,000,000 → 5,000 (0.5%).');

  // Other ATL — 1%
  const otherAtl = computeWht({ sectionCode: '154A', financeActYear: 2025,
    sectionSpecific: { serviceProceeds: 1000000, subType: 'OTHER_SERVICES', atlStatus: 'ATL' } });
  assert.strictEqual(otherAtl.rate, 1, '154A Other ATL = 1%');
  assert.deepStrictEqual(otherAtl.whtAmountPerPeriod, new Decimal(10000), '1,000,000 × 1% = 10,000');
  console.log('  ✓ 154A OTHER_SERVICES ATL 1,000,000 → 10,000 (1%).');

  // Other Non-ATL — 2%
  const otherNonAtl = computeWht({ sectionCode: '154A', financeActYear: 2025,
    sectionSpecific: { serviceProceeds: 1000000, subType: 'OTHER_SERVICES', atlStatus: 'NON_ATL' } });
  assert.strictEqual(otherNonAtl.rate, 2, '154A Other Non-ATL = 2%');
  assert.deepStrictEqual(otherNonAtl.whtAmountPerPeriod, new Decimal(20000), '1,000,000 × 2% = 20,000');
  console.log('  ✓ 154A OTHER_SERVICES Non-ATL 1,000,000 → 20,000 (2%).');

  // Section config presence + placeholder marking for FY2026-27 / FY2027-28
  const section154A_2026 = RATE_REGISTRY[2026].sections.find((s) => s.code === '154A');
  const section154A_2027 = RATE_REGISTRY[2027].sections.find((s) => s.code === '154A');
  assert.ok(section154A_2026 !== undefined, '154A must exist in FY2026-27 registry');
  assert.ok(section154A_2027 !== undefined, '154A must exist in FY2027-28 registry');
  assert.ok(
    section154A_2026!.rules.every((r) => r.rateLabel.includes('[PLACEHOLDER]')),
    'FY2026-27 §154A rules must be marked [PLACEHOLDER] pending Finance Act 2026'
  );
  assert.ok(
    section154A_2027!.rules.every((r) => r.rateLabel.includes('[PLACEHOLDER]')),
    'FY2027-28 §154A rules must be marked [PLACEHOLDER] pending Finance Act 2027'
  );
  console.log('  ✓ FY2026-27 / FY2027-28 §154A present and marked [PLACEHOLDER].');

  console.log('✓ All Section 154A tests passed. (6 assertions)');
}

function testSection148() {
  console.log('\n20. Testing Section 148 - Imports...');

  const cases: Array<{ subType: string; atl: 'ATL' | 'NON_ATL'; rate: number }> = [
    { subType: 'TWELFTH_SCH_PART_I', atl: 'ATL', rate: 1 },
    { subType: 'TWELFTH_SCH_PART_I', atl: 'NON_ATL', rate: 2 },
    { subType: 'TWELFTH_SCH_PART_II_COMMERCIAL', atl: 'ATL', rate: 3.5 },
    { subType: 'TWELFTH_SCH_PART_II_COMMERCIAL', atl: 'NON_ATL', rate: 7 },
    { subType: 'TWELFTH_SCH_PART_II_OTHER', atl: 'ATL', rate: 2 },
    { subType: 'TWELFTH_SCH_PART_II_OTHER', atl: 'NON_ATL', rate: 4 },
    { subType: 'TWELFTH_SCH_PART_III_COMMERCIAL', atl: 'ATL', rate: 6 },
    { subType: 'TWELFTH_SCH_PART_III_COMMERCIAL', atl: 'NON_ATL', rate: 12 },
    { subType: 'TWELFTH_SCH_PART_III_OTHER', atl: 'ATL', rate: 5.5 },
    { subType: 'TWELFTH_SCH_PART_III_OTHER', atl: 'NON_ATL', rate: 11 },
    { subType: 'SRO_1125_MANUFACTURERS', atl: 'ATL', rate: 1 },
    { subType: 'SRO_1125_MANUFACTURERS', atl: 'NON_ATL', rate: 2 },
    { subType: 'MEDICINES_DRAP', atl: 'ATL', rate: 4 },
    { subType: 'MEDICINES_DRAP', atl: 'NON_ATL', rate: 8 },
    { subType: 'EV_LCV_CKD_KITS', atl: 'ATL', rate: 1 },
    { subType: 'EV_LCV_CKD_KITS', atl: 'NON_ATL', rate: 2 },
  ];

  for (const c of cases) {
    const result = computeWht({ sectionCode: '148', financeActYear: 2025,
      sectionSpecific: { importValue: 1000000, subType: c.subType, atlStatus: c.atl } });
    assert.strictEqual(result.applicable, true);
    assert.strictEqual(result.rate, c.rate, `148 ${c.subType} (${c.atl}) = ${c.rate}%`);
    assert.deepStrictEqual(
      result.whtAmountPerPeriod,
      new Decimal(1000000).times(c.rate).dividedBy(100),
      `148 ${c.subType} (${c.atl}): 1,000,000 × ${c.rate}% mismatch`
    );
    console.log(`  ✓ 148 ${c.subType} (${c.atl}) → ${c.rate}%.`);
  }

  // Section config presence + placeholder marking for FY2026-27 / FY2027-28
  const section148_2026 = RATE_REGISTRY[2026].sections.find((s) => s.code === '148');
  const section148_2027 = RATE_REGISTRY[2027].sections.find((s) => s.code === '148');
  assert.ok(section148_2026 !== undefined, '148 must exist in FY2026-27 registry');
  assert.ok(section148_2027 !== undefined, '148 must exist in FY2027-28 registry');
  assert.ok(
    section148_2026!.rules.every((r) => r.rateLabel.includes('[PLACEHOLDER]')),
    'FY2026-27 §148 rules must be marked [PLACEHOLDER] pending Finance Act 2026'
  );
  assert.ok(
    section148_2027!.rules.every((r) => r.rateLabel.includes('[PLACEHOLDER]')),
    'FY2027-28 §148 rules must be marked [PLACEHOLDER] pending Finance Act 2027'
  );
  console.log('  ✓ FY2026-27 / FY2027-28 §148 present and marked [PLACEHOLDER].');

  console.log(`✓ All Section 148 tests passed. (${cases.length * 2 + 2} assertions)`);
}

function testSection152() {
  console.log('\n21. Testing Section 152 - Payments to Non-Residents (Phase 1)...');

  const cases: Array<{ subType: string; rate: number }> = [
    { subType: 'ROYALTY_FTS', rate: 15 },
    { subType: 'CONSTRUCTION_CONTRACTS', rate: 7 },
    { subType: 'INSURANCE_PREMIUM', rate: 5 },
    { subType: 'ADVERTISEMENT_NR_MEDIA', rate: 10 },
    { subType: 'OFFSHORE_DIGITAL_SERVICES', rate: 10 },
    { subType: 'PE_GOODS_SERVICES_CONTRACTS', rate: 20 },
    { subType: 'DEBT_SECURITIES_GAIN', rate: 10 },
    { subType: 'OTHER_SECURITIES_GAIN', rate: 10 },
  ];

  for (const c of cases) {
    const result = computeWht({ sectionCode: '152', financeActYear: 2025,
      sectionSpecific: { paymentAmount: 1000000, subType: c.subType, atlStatus: 'ATL', taxpayerType: 'COMPANY' } });
    assert.strictEqual(result.applicable, true);
    assert.strictEqual(result.rate, c.rate, `152 ${c.subType} = ${c.rate}%`);
    assert.deepStrictEqual(
      result.whtAmountPerPeriod,
      new Decimal(1000000).times(c.rate).dividedBy(100),
      `152 ${c.subType}: 1,000,000 × ${c.rate}% mismatch`
    );
    console.log(`  ✓ 152 ${c.subType} → ${c.rate}%.`);
  }

  // Section config presence + placeholder marking for FY2026-27 / FY2027-28
  const section152_2026 = RATE_REGISTRY[2026].sections.find((s) => s.code === '152');
  const section152_2027 = RATE_REGISTRY[2027].sections.find((s) => s.code === '152');
  assert.ok(section152_2026 !== undefined, '152 must exist in FY2026-27 registry');
  assert.ok(section152_2027 !== undefined, '152 must exist in FY2027-28 registry');
  assert.ok(
    section152_2026!.rules.every((r) => r.rateLabel.includes('[PLACEHOLDER]')),
    'FY2026-27 §152 rules must be marked [PLACEHOLDER] pending Finance Act 2026'
  );
  assert.ok(
    section152_2027!.rules.every((r) => r.rateLabel.includes('[PLACEHOLDER]')),
    'FY2027-28 §152 rules must be marked [PLACEHOLDER] pending Finance Act 2027'
  );
  console.log('  ✓ FY2026-27 / FY2027-28 §152 present and marked [PLACEHOLDER].');

  console.log(`✓ All Section 152 tests passed. (${cases.length * 2 + 2} assertions)`);
}

function testTransactionCardMetadata() {
  console.log('\n22. Testing transaction-card metadata (card-based selection UI)...');

  let assertions = 0;
  for (const [year, config] of Object.entries(RATE_REGISTRY)) {
    const seenOrders = new Set<number>();
    for (const s of config.sections) {
      const ctx = `FY ${year} §${s.code}`;

      assert.ok(typeof s.displayName === 'string' && s.displayName.trim().length > 0,
        `${ctx} must have a non-empty displayName`);
      assert.ok(typeof s.shortDescription === 'string' && s.shortDescription.trim().length > 0,
        `${ctx} must have a non-empty shortDescription`);
      assert.ok(typeof s.icon === 'string' && s.icon.trim().length > 0,
        `${ctx} must have a non-empty icon`);
      assert.ok(typeof s.category === 'string' && s.category.trim().length > 0,
        `${ctx} must have a non-empty category`);
      assertions += 4;

      // TransactionCardGrid derives the on-card section reference (e.g. "Section 148")
      // from the "<ref> - <name>" convention in `label`.
      assert.ok(s.label.includes(' - '),
        `${ctx} label "${s.label}" must follow "<ref> - <name>" for card display`);
      assertions++;

      assert.ok(!seenOrders.has(s.displayOrder),
        `${ctx} has duplicate displayOrder ${s.displayOrder} within FY ${year}`);
      seenOrders.add(s.displayOrder);
      assertions++;
    }
  }
  console.log('  ✓ Every section in every Finance Act year has displayName, shortDescription, icon, category.');
  console.log('  ✓ Every label follows "<ref> - <name>" and displayOrder is unique per year.');

  console.log(`✓ All transaction-card metadata tests passed. (${assertions} assertions)`);
}

function testSection236C() {
  console.log('\n23. Testing Section 236C - Sale of Immovable Property (FMV-banded)...');

  const cases: Array<{ propertyValue: number; atlStatus: string; rate: number; band: string }> = [
    // FMV ≤ Rs 50M
    { propertyValue: 50_000_000,  atlStatus: 'ATL',        rate: 4.5,  band: 'FMV_LE_50M' },
    { propertyValue: 50_000_000,  atlStatus: 'LATE_FILER', rate: 7.5,  band: 'FMV_LE_50M' },
    { propertyValue: 50_000_000,  atlStatus: 'NON_ATL',    rate: 11.5, band: 'FMV_LE_50M' },
    // Rs 50M < FMV ≤ Rs 100M
    { propertyValue: 100_000_000, atlStatus: 'ATL',        rate: 5,    band: 'FMV_50M_TO_100M' },
    { propertyValue: 100_000_000, atlStatus: 'LATE_FILER', rate: 8.5,  band: 'FMV_50M_TO_100M' },
    { propertyValue: 100_000_000, atlStatus: 'NON_ATL',    rate: 11.5, band: 'FMV_50M_TO_100M' },
    // FMV > Rs 100M
    { propertyValue: 150_000_000, atlStatus: 'ATL',        rate: 5.5,  band: 'FMV_GT_100M' },
    { propertyValue: 150_000_000, atlStatus: 'LATE_FILER', rate: 9.5,  band: 'FMV_GT_100M' },
    { propertyValue: 150_000_000, atlStatus: 'NON_ATL',    rate: 11.5, band: 'FMV_GT_100M' },
    // Band-boundary checks
    { propertyValue: 50_000_001,  atlStatus: 'ATL', rate: 5,   band: 'FMV_50M_TO_100M' },
    { propertyValue: 100_000_001, atlStatus: 'ATL', rate: 5.5, band: 'FMV_GT_100M' },
  ];

  for (const c of cases) {
    const result = computeWht({ sectionCode: '236C', financeActYear: 2025,
      sectionSpecific: { propertyValue: c.propertyValue, atlStatus: c.atlStatus } });
    assert.strictEqual(result.applicable, true);
    assert.strictEqual(result.rate, c.rate, `236C ${c.atlStatus} @ ${c.propertyValue} should be ${c.rate}%`);
    assert.ok(result.transactionSummary.includes(c.band), `236C ${c.atlStatus} @ ${c.propertyValue} should resolve FMV band ${c.band}`);
    assert.deepStrictEqual(
      result.whtAmountPerPeriod,
      new Decimal(c.propertyValue).times(c.rate).dividedBy(100).round(),
      `236C ${c.atlStatus} @ ${c.propertyValue}: WHT amount mismatch`
    );
  }
  console.log(`  ✓ All 236C ATL/Late-Filer/Non-ATL × FMV-band combinations resolved correctly (${cases.length} cases).`);

  const section2025 = RATE_REGISTRY[2025].sections.find((s) => s.code === '236C')!;
  assert.strictEqual(section2025.rules.length, 9, '236C FY2025-26 must have 9 rules (3 filer statuses × 3 FMV bands)');
  assert.ok(section2025.rules.every((r) => !r.rateLabel.includes('[PLACEHOLDER]')), '236C FY2025-26 rules must not contain [PLACEHOLDER]');
  console.log('  ✓ 236C FY2025-26: 9 rules present, no [PLACEHOLDER] markers.');

  console.log(`✓ All Section 236C tests passed. (${cases.length * 3 + 2} assertions)`);
}

function testSection236K() {
  console.log('\n24. Testing Section 236K - Purchase of Immovable Property (FMV-banded)...');

  const cases: Array<{ propertyValue: number; atlStatus: string; rate: number; band: string }> = [
    // FMV ≤ Rs 50M
    { propertyValue: 50_000_000,  atlStatus: 'ATL',        rate: 1.5,  band: 'FMV_LE_50M' },
    { propertyValue: 50_000_000,  atlStatus: 'LATE_FILER', rate: 4.5,  band: 'FMV_LE_50M' },
    { propertyValue: 50_000_000,  atlStatus: 'NON_ATL',    rate: 10.5, band: 'FMV_LE_50M' },
    // Rs 50M < FMV ≤ Rs 100M
    { propertyValue: 100_000_000, atlStatus: 'ATL',        rate: 2,    band: 'FMV_50M_TO_100M' },
    { propertyValue: 100_000_000, atlStatus: 'LATE_FILER', rate: 5.5,  band: 'FMV_50M_TO_100M' },
    { propertyValue: 100_000_000, atlStatus: 'NON_ATL',    rate: 14.5, band: 'FMV_50M_TO_100M' },
    // FMV > Rs 100M
    { propertyValue: 150_000_000, atlStatus: 'ATL',        rate: 2.5,  band: 'FMV_GT_100M' },
    { propertyValue: 150_000_000, atlStatus: 'LATE_FILER', rate: 6.5,  band: 'FMV_GT_100M' },
    { propertyValue: 150_000_000, atlStatus: 'NON_ATL',    rate: 18.5, band: 'FMV_GT_100M' },
    // Band-boundary checks
    { propertyValue: 50_000_001,  atlStatus: 'ATL', rate: 2,   band: 'FMV_50M_TO_100M' },
    { propertyValue: 100_000_001, atlStatus: 'ATL', rate: 2.5, band: 'FMV_GT_100M' },
  ];

  for (const c of cases) {
    const result = computeWht({ sectionCode: '236K', financeActYear: 2025,
      sectionSpecific: { propertyValue: c.propertyValue, atlStatus: c.atlStatus } });
    assert.strictEqual(result.applicable, true);
    assert.strictEqual(result.rate, c.rate, `236K ${c.atlStatus} @ ${c.propertyValue} should be ${c.rate}%`);
    assert.ok(result.transactionSummary.includes(c.band), `236K ${c.atlStatus} @ ${c.propertyValue} should resolve FMV band ${c.band}`);
    assert.deepStrictEqual(
      result.whtAmountPerPeriod,
      new Decimal(c.propertyValue).times(c.rate).dividedBy(100).round(),
      `236K ${c.atlStatus} @ ${c.propertyValue}: WHT amount mismatch`
    );
  }
  console.log(`  ✓ All 236K ATL/Late-Filer/Non-ATL × FMV-band combinations resolved correctly (${cases.length} cases).`);

  const section2025 = RATE_REGISTRY[2025].sections.find((s) => s.code === '236K')!;
  assert.strictEqual(section2025.rules.length, 9, '236K FY2025-26 must have 9 rules (3 filer statuses × 3 FMV bands)');
  assert.ok(section2025.rules.every((r) => !r.rateLabel.includes('[PLACEHOLDER]')), '236K FY2025-26 rules must not contain [PLACEHOLDER]');
  assert.ok(!section2025.transactionFields.some((f) => f.key === 'taxpayerType'), '236K must not present an unused Buyer Type field');
  console.log('  ✓ 236K FY2025-26: 9 rules present, no [PLACEHOLDER] markers, no unused Buyer Type field.');

  console.log(`✓ All Section 236K tests passed. (${cases.length * 3 + 3} assertions)`);
}

function testSection150() {
  console.log('\n25. Testing Section 150 - Dividends (FBR validated)...');

  const cases: Array<{ subType: string; atlStatus: string; rate: number }> = [
    { subType: 'GENERAL',        atlStatus: 'ATL',     rate: 15 },
    { subType: 'GENERAL',        atlStatus: 'NON_ATL', rate: 30 },
    { subType: 'IPP',            atlStatus: 'ATL',     rate: 7.5 },
    { subType: 'IPP',            atlStatus: 'NON_ATL', rate: 15 },
    { subType: 'MUTUAL_FUND',    atlStatus: 'ATL',     rate: 25 },
    { subType: 'MUTUAL_FUND',    atlStatus: 'NON_ATL', rate: 50 },
    { subType: 'SPV_REIT',       atlStatus: 'ATL',     rate: 0 },
    { subType: 'SPV_REIT',       atlStatus: 'NON_ATL', rate: 0 },
    { subType: 'SPV_OTHER',      atlStatus: 'ATL',     rate: 35 },
    { subType: 'SPV_OTHER',      atlStatus: 'NON_ATL', rate: 70 },
    { subType: 'EXEMPT_COMPANY', atlStatus: 'ATL',     rate: 25 },
    { subType: 'EXEMPT_COMPANY', atlStatus: 'NON_ATL', rate: 50 },
  ];

  const dividendAmount = 1_000_000;
  for (const c of cases) {
    const result = computeWht({ sectionCode: '150', financeActYear: 2025,
      sectionSpecific: { dividendAmount, subType: c.subType, atlStatus: c.atlStatus } });
    assert.strictEqual(result.applicable, true);
    assert.strictEqual(result.rate, c.rate, `150 ${c.subType}/${c.atlStatus} should be ${c.rate}%`);
    assert.deepStrictEqual(
      result.whtAmountPerPeriod,
      new Decimal(dividendAmount).times(c.rate).dividedBy(100).round(),
      `150 ${c.subType}/${c.atlStatus}: WHT amount mismatch`
    );
  }
  console.log(`  ✓ All 150 dividend category × ATL/Non-ATL combinations resolved correctly (${cases.length} cases).`);

  const section2025 = RATE_REGISTRY[2025].sections.find((s) => s.code === '150')!;
  assert.strictEqual(section2025.rules.length, 12, '150 FY2025-26 must have 12 rules (6 categories × ATL/Non-ATL)');
  assert.ok(section2025.rules.every((r) => !r.rateLabel.includes('[PLACEHOLDER]')), '150 FY2025-26 rules must not contain [PLACEHOLDER]');
  assert.ok(!section2025.rules.some((r) => r.subType === 'BONUS_SHARES'), '150 must not present Bonus Shares (taxed under 236M/236N, not 150)');
  assert.ok(!section2025.transactionFields.some((f) => f.key === 'taxpayerType'), '150 must not present an unused Taxpayer Type field');
  console.log('  ✓ 150 FY2025-26: 12 rules present, no [PLACEHOLDER] markers, no Bonus Shares / unused Taxpayer Type field.');

  console.log(`✓ All Section 150 tests passed. (${cases.length * 2 + 4} assertions)`);
}

function testSection151Sukuk() {
  console.log('\n26. Testing Section 151 - Sukuk & Government Security sub-categories...');

  // Sukuk: Company holder = 25%/50% flat
  const sukukCo = computeWht({ sectionCode: '151', financeActYear: 2025,
    sectionSpecific: { profitAmount: 2_000_000, subType: 'SUKUK', atlStatus: 'ATL', taxpayerType: 'COMPANY' } });
  assert.strictEqual(sukukCo.rate, 25, 'Sukuk Company ATL rate = 25%');

  const sukukCoNon = computeWht({ sectionCode: '151', financeActYear: 2025,
    sectionSpecific: { profitAmount: 2_000_000, subType: 'SUKUK', atlStatus: 'NON_ATL', taxpayerType: 'COMPANY' } });
  assert.strictEqual(sukukCoNon.rate, 50, 'Sukuk Company Non-ATL rate = 50%');

  // Sukuk: Individual/AOP, return > Rs 1M = 12.5%/25%
  const sukukIndGt = computeWht({ sectionCode: '151', financeActYear: 2025,
    sectionSpecific: { profitAmount: 1_500_000, subType: 'SUKUK', atlStatus: 'ATL', taxpayerType: 'INDIVIDUAL' } });
  assert.strictEqual(sukukIndGt.rate, 12.5, 'Sukuk Individual >Rs 1M ATL rate = 12.5%');

  const sukukIndGtNon = computeWht({ sectionCode: '151', financeActYear: 2025,
    sectionSpecific: { profitAmount: 1_500_000, subType: 'SUKUK', atlStatus: 'NON_ATL', taxpayerType: 'AOP' } });
  assert.strictEqual(sukukIndGtNon.rate, 25, 'Sukuk AOP >Rs 1M Non-ATL rate = 25%');

  // Sukuk: Individual/AOP, return <= Rs 1M = 10%/20%
  const sukukIndLe = computeWht({ sectionCode: '151', financeActYear: 2025,
    sectionSpecific: { profitAmount: 1_000_000, subType: 'SUKUK', atlStatus: 'ATL', taxpayerType: 'INDIVIDUAL' } });
  assert.strictEqual(sukukIndLe.rate, 10, 'Sukuk Individual ≤Rs 1M ATL rate = 10%');

  const sukukIndLeNon = computeWht({ sectionCode: '151', financeActYear: 2025,
    sectionSpecific: { profitAmount: 1_000_000, subType: 'SUKUK', atlStatus: 'NON_ATL', taxpayerType: 'INDIVIDUAL' } });
  assert.strictEqual(sukukIndLeNon.rate, 20, 'Sukuk Individual ≤Rs 1M Non-ATL rate = 20%');

  // Govt Security: Individual = 15%/30% (Division-IA(c) "other cases")
  const govtInd = computeWht({ sectionCode: '151', financeActYear: 2025,
    sectionSpecific: { profitAmount: 500_000, subType: 'GOVT_SEC', atlStatus: 'ATL', taxpayerType: 'INDIVIDUAL' } });
  assert.strictEqual(govtInd.rate, 15, 'Govt Sec Individual ATL rate = 15%');

  // Govt Security: AOP/Company = 20%/40% (Division-IA(b))
  const govtAop = computeWht({ sectionCode: '151', financeActYear: 2025,
    sectionSpecific: { profitAmount: 500_000, subType: 'GOVT_SEC', atlStatus: 'NON_ATL', taxpayerType: 'AOP' } });
  assert.strictEqual(govtAop.rate, 40, 'Govt Sec AOP Non-ATL rate = 40%');

  console.log('  ✓ Sukuk (Company/Individual/AOP × >Rs1M/≤Rs1M) and Govt Security (Individual vs AOP/Company) sub-categories resolve correctly.');

  const section2025 = RATE_REGISTRY[2025].sections.find((s) => s.code === '151')!;
  assert.strictEqual(section2025.rules.length, 16, '151 FY2025-26 must have 16 rules (8 sub-categories × ATL/Non-ATL incl. NSSF Individual + Non-Individual split)');
  assert.ok(section2025.rules.every((r) => !r.rateLabel.includes('[PLACEHOLDER]')), '151 FY2025-26 rules must not contain [PLACEHOLDER]');
  console.log('  ✓ 151 FY2025-26: 16 rules present, no [PLACEHOLDER] markers.');

  console.log('✓ All Section 151 Sukuk/Govt-Sec tests passed. (10 assertions)');
}

// ============================================================================
// Audit remediation tests (FY2025-26 CRITICAL fixes — see
// docs/FINAL_FORENSIC_TAX_LAW_AUDIT.md and docs/SECTION_153_SPECIAL_SECTOR_REVIEW.md)
// ============================================================================
function testAuditRemediationFY2026() {
  console.log('\n26. Testing Audit Remediation (CRITICAL fixes FY2025-26)...');

  // C3: §149 9% surcharge for taxable income > Rs 10,000,000
  // Annual salary 15,000,000 (monthly 1,250,000).
  // Slab tax = 616k + 35% × (15M − 4.1M) = 616k + 35% × 10.9M
  //         = 616,000 + 3,815,000 = 4,431,000
  // After 9% surcharge: 4,431,000 × 1.09 = 4,829,790
  const s149surcharge = computeWht({
    sectionCode: '149', financeActYear: 2025,
    sectionSpecific: { monthlySalary: 1250000, frequency: 'MONTHLY', taxpayerType: 'INDIVIDUAL' },
  });
  assert.strictEqual(s149surcharge.applicable, true);
  assert.deepStrictEqual(
    s149surcharge.whtAmountAnnual,
    new Decimal(4829790),
    'C3 §149 surcharge: 4,431,000 × 1.09 = 4,829,790'
  );
  assert.ok(
    s149surcharge.rateLabel.includes('9% Surcharge'),
    'C3 §149 rateLabel must mention 9% surcharge'
  );
  console.log('  ✓ C3 §149 surcharge >Rs.10M: annual 15,000,000 → 4,829,790 (incl. 9% surcharge).');

  // C3 negative: at Rs 9,600,000 (below 10M) surcharge does NOT apply
  const s149noSurcharge = computeWht({
    sectionCode: '149', financeActYear: 2025,
    sectionSpecific: { monthlySalary: 800000, frequency: 'MONTHLY', taxpayerType: 'INDIVIDUAL' },
  });
  assert.ok(
    !s149noSurcharge.rateLabel.includes('9% Surcharge'),
    'C3 §149 surcharge must NOT apply at Rs 9,600,000 (below threshold)'
  );
  console.log('  ✓ C3 §149 surcharge does NOT apply at Rs 9,600,000.');

  // C4: §155 Non-ATL Individual/AOP — Tenth-Schedule Rule 1 doubling
  // ATL slab tax on annual rent 1,000,000 = 15,000 + 10% × (1,000,000 − 600,000) = 55,000
  // Non-ATL: 55,000 × 2 = 110,000
  const s155atl = computeWht({
    sectionCode: '155', financeActYear: 2025,
    sectionSpecific: { rentAmount: 1000000, frequency: 'ANNUALLY', atlStatus: 'ATL', taxpayerType: 'INDIVIDUAL' },
  });
  assert.deepStrictEqual(s155atl.whtAmountAnnual, new Decimal(55000), 'C4 §155 ATL Individual baseline = 55,000');
  const s155nonAtl = computeWht({
    sectionCode: '155', financeActYear: 2025,
    sectionSpecific: { rentAmount: 1000000, frequency: 'ANNUALLY', atlStatus: 'NON_ATL', taxpayerType: 'INDIVIDUAL' },
  });
  assert.deepStrictEqual(
    s155nonAtl.whtAmountAnnual,
    new Decimal(110000),
    'C4 §155 Non-ATL Individual = ATL × 2 = 110,000'
  );
  assert.ok(s155nonAtl.rateLabel.includes('× 2 Non-ATL'), 'C4 §155 Non-ATL label must reflect doubling');
  console.log('  ✓ C4 §155 Non-ATL Individual 1,000,000 → 110,000 (= ATL 55,000 × 2).');

  // Same for AOP
  const s155aopNonAtl = computeWht({
    sectionCode: '155', financeActYear: 2025,
    sectionSpecific: { rentAmount: 1000000, frequency: 'ANNUALLY', atlStatus: 'NON_ATL', taxpayerType: 'AOP' },
  });
  assert.deepStrictEqual(s155aopNonAtl.whtAmountAnnual, new Decimal(110000), 'C4 §155 Non-ATL AOP = 110,000');
  console.log('  ✓ C4 §155 Non-ATL AOP 1,000,000 → 110,000.');

  // C5: §151 NSSF holder-type — Individual 15/30 (unchanged), AOP/Company 20/40
  const s151nssfCompany = computeWht({
    sectionCode: '151', financeActYear: 2025,
    sectionSpecific: { profitAmount: 500000, subType: 'NSSF', atlStatus: 'ATL', taxpayerType: 'COMPANY' },
  });
  assert.strictEqual(s151nssfCompany.rate, 20, 'C5 §151 NSSF Company ATL = 20%');
  assert.deepStrictEqual(s151nssfCompany.whtAmountPerPeriod, new Decimal(100000), '500,000 × 20% = 100,000');
  console.log('  ✓ C5 §151 NSSF Company ATL 500,000 → 100,000 (20%).');

  const s151nssfAopNonAtl = computeWht({
    sectionCode: '151', financeActYear: 2025,
    sectionSpecific: { profitAmount: 500000, subType: 'NSSF', atlStatus: 'NON_ATL', taxpayerType: 'AOP' },
  });
  assert.strictEqual(s151nssfAopNonAtl.rate, 40, 'C5 §151 NSSF AOP Non-ATL = 40%');
  console.log('  ✓ C5 §151 NSSF AOP Non-ATL 500,000 → 200,000 (40%).');

  // Individual stays at 15/30 (regression)
  const s151nssfInd = computeWht({
    sectionCode: '151', financeActYear: 2025,
    sectionSpecific: { profitAmount: 500000, subType: 'NSSF', atlStatus: 'ATL', taxpayerType: 'INDIVIDUAL' },
  });
  assert.strictEqual(s151nssfInd.rate, 15, 'C5 §151 NSSF Individual ATL still 15%');
  console.log('  ✓ C5 §151 NSSF Individual ATL stays 15% (regression).');

  // Special sector services (§153 special sector audit)
  const s153bExpAtl = computeWht({
    sectionCode: '153b', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 1000000, subType: 'EXPORTER_SERVICES', atlStatus: 'ATL', taxpayerType: 'COMPANY' },
  });
  assert.strictEqual(s153bExpAtl.rate, 1, '§153b EXPORTER_SERVICES ATL = 1%');
  assert.deepStrictEqual(s153bExpAtl.whtAmountPerPeriod, new Decimal(10000), '1,000,000 × 1% = 10,000');
  console.log('  ✓ §153b EXPORTER_SERVICES ATL 1,000,000 → 10,000 (1%).');

  const s153bExpNonAtl = computeWht({
    sectionCode: '153b', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 1000000, subType: 'EXPORTER_SERVICES', atlStatus: 'NON_ATL', taxpayerType: 'INDIVIDUAL' },
  });
  assert.strictEqual(s153bExpNonAtl.rate, 2, '§153b EXPORTER_SERVICES Non-ATL = 2%');
  console.log('  ✓ §153b EXPORTER_SERVICES Non-ATL 1,000,000 → 20,000 (2%).');

  const s153bSecAtl = computeWht({
    sectionCode: '153b', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 1000000, subType: 'SPECIFIED_SECTOR_SERVICES', atlStatus: 'ATL', taxpayerType: 'COMPANY' },
  });
  assert.strictEqual(s153bSecAtl.rate, 1, '§153b SPECIFIED_SECTOR_SERVICES ATL = 1%');
  console.log('  ✓ §153b SPECIFIED_SECTOR_SERVICES ATL 1,000,000 → 10,000 (1%).');

  const s153bSecNonAtl = computeWht({
    sectionCode: '153b', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 1000000, subType: 'SPECIFIED_SECTOR_SERVICES', atlStatus: 'NON_ATL', taxpayerType: 'INDIVIDUAL' },
  });
  assert.strictEqual(s153bSecNonAtl.rate, 2, '§153b SPECIFIED_SECTOR_SERVICES Non-ATL = 2%');
  console.log('  ✓ §153b SPECIFIED_SECTOR_SERVICES Non-ATL 1,000,000 → 20,000 (2%).');

  console.log('✓ All audit-remediation tests passed. (15 assertions)');
}

// ============================================================================
// MATERIAL findings remediation tests (M1 §152(2A), M2 §152(1DB), M4 §149
// Pension, M5 §233 Life Insurance threshold, M6 §148 Mobile Phone sentinel).
// ============================================================================
function testMaterialRemediationFY2026() {
  console.log('\n27. Testing MATERIAL Findings Remediation (FY2025-26)...');

  // M1 §152(2A) — PE sale of goods, IT, services, contracts
  const m1cases: Array<{ sub: string; atl: 'ATL' | 'NON_ATL'; rate: number }> = [
    { sub: 'PE_PAYMENT_COMPANY', atl: 'ATL',     rate: 5 },
    { sub: 'PE_PAYMENT_COMPANY', atl: 'NON_ATL', rate: 10 },
    { sub: 'PE_PAYMENT_OTHER',   atl: 'ATL',     rate: 5.5 },
    { sub: 'PE_PAYMENT_OTHER',   atl: 'NON_ATL', rate: 11 },
    { sub: 'PE_IT_ITES',         atl: 'ATL',     rate: 4 },
    { sub: 'PE_IT_ITES',         atl: 'NON_ATL', rate: 8 },
    { sub: 'PE_OTHER_SERVICES',  atl: 'ATL',     rate: 8 },
    { sub: 'PE_OTHER_SERVICES',  atl: 'NON_ATL', rate: 16 },
    { sub: 'PE_SPORTSPERSON',    atl: 'ATL',     rate: 15 },
    { sub: 'PE_SPORTSPERSON',    atl: 'NON_ATL', rate: 30 },
    { sub: 'PE_OTHER_CONTRACTS', atl: 'ATL',     rate: 8 },
    { sub: 'PE_OTHER_CONTRACTS', atl: 'NON_ATL', rate: 16 },
  ];
  for (const c of m1cases) {
    const r = computeWht({ sectionCode: '152', financeActYear: 2025,
      sectionSpecific: { paymentAmount: 1000000, subType: c.sub, atlStatus: c.atl, taxpayerType: 'COMPANY' } });
    assert.strictEqual(r.rate, c.rate, `M1 §152 ${c.sub} ${c.atl} = ${c.rate}%`);
  }
  console.log(`  ✓ M1 §152(2A) all 12 PE sub-categories × ATL/Non-ATL resolve.`);

  // M2 §152(1DB) Sukuk by non-resident — derived by taxpayerType + amount
  const sukukNrCo = computeWht({ sectionCode: '152', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 5000000, subType: 'SUKUK_NR', atlStatus: 'ATL', taxpayerType: 'COMPANY' } });
  assert.strictEqual(sukukNrCo.rate, 25, 'M2 §152(1DB) NR Sukuk Company = 25%');
  console.log('  ✓ M2 §152(1DB) SUKUK_NR Company 5,000,000 → 25%.');

  const sukukNrGt1m = computeWht({ sectionCode: '152', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 2000000, subType: 'SUKUK_NR', atlStatus: 'ATL', taxpayerType: 'INDIVIDUAL' } });
  assert.strictEqual(sukukNrGt1m.rate, 12.5, 'M2 §152(1DB) NR Sukuk Ind >Rs1M = 12.5%');
  console.log('  ✓ M2 §152(1DB) SUKUK_NR Individual 2,000,000 (>1M) → 12.5%.');

  const sukukNrLe1m = computeWht({ sectionCode: '152', financeActYear: 2025,
    sectionSpecific: { paymentAmount: 500000, subType: 'SUKUK_NR', atlStatus: 'ATL', taxpayerType: 'AOP' } });
  assert.strictEqual(sukukNrLe1m.rate, 10, 'M2 §152(1DB) NR Sukuk Ind/AOP ≤Rs1M = 10%');
  console.log('  ✓ M2 §152(1DB) SUKUK_NR AOP 500,000 (≤1M) → 10%.');

  // M4 §149 Pension
  // ≤ Rs 10M → 0
  const pensLow = computeWht({ sectionCode: '149', financeActYear: 2025,
    sectionSpecific: { monthlySalary: 700000, frequency: 'MONTHLY', taxpayerType: 'INDIVIDUAL', subType: 'PENSION', pensionerAge: 65 } });
  assert.strictEqual(pensLow.rate, 0, 'M4 §149 pension annual 8.4M → 0');
  assert.deepStrictEqual(pensLow.whtAmountAnnual, new Decimal(0), 'M4 §149 pension ≤ 10M tax = 0');
  console.log('  ✓ M4 §149 pension 8,400,000 (≤10M) → 0.');

  // > Rs 10M, age < 70 → 5% × excess × 1.10
  // Annual pension 15M → excess 5M × 5% = 250k × 1.10 = 275,000
  const pensHighYoung = computeWht({ sectionCode: '149', financeActYear: 2025,
    sectionSpecific: { monthlySalary: 1250000, frequency: 'MONTHLY', taxpayerType: 'INDIVIDUAL', subType: 'PENSION', pensionerAge: 60 } });
  assert.deepStrictEqual(pensHighYoung.whtAmountAnnual, new Decimal(275000), 'M4 §149 pension 15M age 60 = 275,000');
  console.log('  ✓ M4 §149 pension 15,000,000 age 60 → 275,000 (5% × 5M × 1.10).');

  // > Rs 10M, age ≥ 70 → 0
  const pensHighOld = computeWht({ sectionCode: '149', financeActYear: 2025,
    sectionSpecific: { monthlySalary: 1250000, frequency: 'MONTHLY', taxpayerType: 'INDIVIDUAL', subType: 'PENSION', pensionerAge: 75 } });
  assert.deepStrictEqual(pensHighOld.whtAmountAnnual, new Decimal(0), 'M4 §149 pension 15M age 75 = 0');
  console.log('  ✓ M4 §149 pension 15,000,000 age 75 → 0.');

  // Normal salary regression — slabs still work (no subType)
  const normSal = computeWht({ sectionCode: '149', financeActYear: 2025,
    sectionSpecific: { monthlySalary: 100000, frequency: 'MONTHLY', taxpayerType: 'INDIVIDUAL' } });
  assert.strictEqual(normSal.isProgressiveSlab, true, 'M4 §149 normal salary still uses slabs');
  console.log('  ✓ M4 §149 normal-salary regression: slabs still active.');

  // M5 §233 Life Insurance Agent — threshold determines rate but transaction
  // stays within LIA category. <500k → 8/16; ≥500k → 12/24 (residual rate,
  // still LIA — not OTHER).
  const liaUnder = computeWht({ sectionCode: '233', financeActYear: 2025,
    sectionSpecific: { commissionAmount: 200000, subType: 'LIFE_INSURANCE_AGENT', atlStatus: 'ATL', annualCommissionTotal: 400000 } });
  assert.strictEqual(liaUnder.rate, 8, 'M5 §233 LIA annual <500k → 8%');
  assert.ok(liaUnder.rateLabel.includes('Life Insurance Agent'), 'M5 §233 LIA <500k rateLabel must stay within LIA category');
  console.log('  ✓ M5 §233 LIA annual 400,000 → 8% (LIA reduced rate).');

  const liaOver = computeWht({ sectionCode: '233', financeActYear: 2025,
    sectionSpecific: { commissionAmount: 200000, subType: 'LIFE_INSURANCE_AGENT', atlStatus: 'ATL', annualCommissionTotal: 600000 } });
  assert.strictEqual(liaOver.rate, 12, 'M5 §233 LIA annual ≥500k → 12% (LIA residual rate)');
  assert.ok(liaOver.rateLabel.includes('Life Insurance Agent') && liaOver.rateLabel.includes('residual'), 'M5 §233 LIA ≥500k rateLabel must reflect residual rate within LIA category');
  console.log('  ✓ M5 §233 LIA annual 600,000 → 12% (LIA residual, still LIA category).');

  // Non-ATL residual
  const liaOverNonAtl = computeWht({ sectionCode: '233', financeActYear: 2025,
    sectionSpecific: { commissionAmount: 200000, subType: 'LIFE_INSURANCE_AGENT', atlStatus: 'NON_ATL', annualCommissionTotal: 600000 } });
  assert.strictEqual(liaOverNonAtl.rate, 24, 'M5 §233 LIA Non-ATL annual ≥500k → 24% (LIA residual Non-ATL)');
  console.log('  ✓ M5 §233 LIA Non-ATL annual 600,000 → 24% (LIA residual Non-ATL).');

  // Fallback when annualCommissionTotal absent — uses commissionAmount
  const liaDefault = computeWht({ sectionCode: '233', financeActYear: 2025,
    sectionSpecific: { commissionAmount: 800000, subType: 'LIFE_INSURANCE_AGENT', atlStatus: 'NON_ATL' } });
  assert.strictEqual(liaDefault.rate, 24, 'M5 §233 LIA fallback to commissionAmount ≥500k → 24% Non-ATL residual');
  console.log('  ✓ M5 §233 LIA fallback 800,000 → 24% (Non-ATL residual).');

  // M6 §148 Mobile Phones — option removed from selectable UI (rates not
  // representable in percentage-rate engine). Assert MOBILE_PHONES is absent
  // from §148 subType field options.
  const section148 = RATE_REGISTRY[2025].sections.find((s) => s.code === '148')!;
  const subTypeField = section148.transactionFields.find((f) => f.key === 'subType')!;
  const optionValues = subTypeField.options!.map((o) => o.value);
  assert.ok(!optionValues.includes('MOBILE_PHONES'), 'M6 §148 MOBILE_PHONES must not appear as selectable subType');
  assert.ok(!section148.rules.some((r) => r.subType === 'MOBILE_PHONES'), 'M6 §148 must not contain MOBILE_PHONES rules');
  console.log('  ✓ M6 §148 MOBILE_PHONES absent from UI options and rule set.');

  console.log('✓ All MATERIAL-remediation tests passed. (21 assertions)');
}

// ─── Explanation frequency-divisor consistency ───────────────────────────────
// Regression for the "PKR 17,000 ÷ 2 = PKR 17,000" defect: the explanation
// divisor was a hand-rolled ternary (MONTHLY?12 : QUARTERLY?4 : 2) that mapped
// ANNUALLY to "÷ 2" while the engine correctly divided by 1. The explanation
// must use FREQUENCY_MULTIPLIERS and suppress the per-period line when the
// divisor is 1 (annual == per-period).
function testExplanationFrequencyDivisor() {
  console.log('28. Testing explanation frequency-divisor consistency...');

  const cases: Array<{ freq: string; expectLine: string | null }> = [
    { freq: 'MONTHLY',     expectLine: '÷ 12' },
    { freq: 'QUARTERLY',   expectLine: '÷ 4' },
    { freq: 'SEMI_ANNUAL', expectLine: '÷ 2' },
    { freq: 'ANNUALLY',    expectLine: null }, // divisor 1 → line suppressed
  ];

  for (const c of cases) {
    const r = computeWht({
      sectionCode: '155',
      financeActYear: 2025,
      sectionSpecific: {
        rentAmount: 150000,
        frequency: c.freq,
        atlStatus: 'ATL',
        taxpayerType: 'INDIVIDUAL',
      },
    });
    const perPeriodLine = r.explanation.split('\n').find((l) => l.includes('Per-Period'));
    if (c.expectLine === null) {
      assert.strictEqual(perPeriodLine, undefined,
        `${c.freq}: per-period line must be suppressed when divisor is 1`);
      console.log(`  ✓ ${c.freq}: no per-period division line (divisor 1).`);
    } else {
      assert.ok(perPeriodLine && perPeriodLine.includes(c.expectLine),
        `${c.freq}: per-period line must show "${c.expectLine}", got: ${perPeriodLine}`);
      // Displayed formula must be internally consistent: annual ÷ divisor == per-period
      assert.strictEqual(
        r.whtAmountAnnual!.div(FREQUENCY_MULTIPLIERS[c.freq as keyof typeof FREQUENCY_MULTIPLIERS]).round().toString(),
        r.whtAmountPerPeriod.toString(),
        `${c.freq}: annual ÷ divisor must equal per-period amount`);
      console.log(`  ✓ ${c.freq}: per-period line shows "${c.expectLine}" and matches engine math.`);
    }
  }

  // §149 pensionerAge visibility — must only render when subType = PENSION
  const section149 = RATE_REGISTRY[2025].sections.find((s) => s.code === '149')!;
  const ageField = section149.transactionFields.find((f) => f.key === 'pensionerAge')!;
  assert.ok(ageField.visibleWhen, '§149 pensionerAge must declare visibleWhen');
  assert.strictEqual(ageField.visibleWhen!.field, 'subType', '§149 pensionerAge visibleWhen.field must be subType');
  assert.strictEqual(ageField.visibleWhen!.equals, 'PENSION', '§149 pensionerAge visibleWhen.equals must be PENSION');
  console.log('  ✓ §149 pensionerAge hidden unless Income Type = Pension.');

  console.log('✓ All explanation frequency-divisor tests passed.');
}

// Run All
try {
  testLoader();
  testImmutability();
  testFrequencies();
  testProgressiveSlabs();
  testThresholdGuard();
  testValidator();
  testSection149WithBonusAllowances();
  testDefaultFinanceActYear();
  testCurrencyFormatting();
  testTaxYearLabel();
  testFinanceActYearOverride();
  testTaxYear2025Coverage();
  testTrackARates2025();
  testSection153Split();
  testRemediationFY2026();
  testSection233();
  testSection156();
  testSection154();
  testSection154A();
  testSection148();
  testSection152();
  testTransactionCardMetadata();
  testSection236C();
  testSection236K();
  testSection150();
  testSection151Sukuk();
  testAuditRemediationFY2026();
  testMaterialRemediationFY2026();
  testExplanationFrequencyDivisor();
  console.log('\n=========================================');
  console.log('ALL WHT ENGINE TESTS PASSED SUCCESSFULLY!');
  console.log('=========================================');
} catch (err) {
  console.error('\n❌ TEST RUN FAILED:');
  console.error(err);
  process.exit(1);
}
