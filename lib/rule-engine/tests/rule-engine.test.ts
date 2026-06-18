/**
 * L1 Unit Tests — Rule Engine (Sprint 3)
 *
 * Tests: evaluate(), addDuration(), resolveObligationChains(), computeObligationStatus()
 * Runner: ts-node --project tsconfig.test.json lib/rule-engine/tests/rule-engine.test.ts
 * No DB required. Runs in milliseconds. Run on every commit.
 *
 * Test plan source: RULE_ENGINE_TEST_PLAN.md §7, §8, §10 (pure-function edge cases)
 */

import assert from 'assert'
import { evaluate } from '../evaluate'
import { addDuration, computeTriggerDate } from '../deadline'
import { KNOWN_CHAINS, resolveObligationChains, computeDownstreamUpdate } from '../chains'
import { computeObligationStatus } from '../calendar'
import type {
  CompanyClassification,
  ApplicabilityExpression,
  ObligationToCreate,
  RuleVersion,
  Regime,
} from '../types'

console.log('Running Rule Engine L1 Unit Tests...\n')

// ── Test Fixtures ─────────────────────────────────────────────────────────────

const ABC_MANUFACTURING: CompanyClassification = {
  company_id:                'aaaaaaaa-0000-0000-0000-000000000001',
  tenant_id:                 'tttttttt-0000-0000-0000-000000000001',
  corporate_form:            'private',
  is_public_sector_company:  false,
  is_government_controlled:  false,
  is_foreign_owned_majority: false,
  regulatory_categories:     [],
  financial_year_end_month:  6,
  financial_year_end_day:    30,
  incorporation_date:        new Date('2018-03-15'),
  paid_up_capital:           10_000_000,
}

const XYZ_TEXTILES: CompanyClassification = {
  company_id:                'bbbbbbbb-0000-0000-0000-000000000002',
  tenant_id:                 'tttttttt-0000-0000-0000-000000000001',
  corporate_form:            'listed',
  is_public_sector_company:  false,
  is_government_controlled:  false,
  is_foreign_owned_majority: false,
  regulatory_categories:     [],
  financial_year_end_month:  12,
  financial_year_end_day:    31,
  incorporation_date:        new Date('2004-06-10'),
  paid_up_capital:           500_000_000,
}

// V1 Regime applicability expressions (from RULE_ENGINE_SPEC.md §4)
const V1_REGIME_EXPRESSIONS: Record<string, ApplicabilityExpression> = {
  'Companies Act 2017':            { op: 'always_true' },
  'Companies Regulations 2024':    { op: 'always_true' },
  'PSX Rule Book':                 { op: 'eq', field: 'corporate_form', value: 'listed' },
  'CCG Regulations 2019':          { op: 'eq', field: 'corporate_form', value: 'listed' },
  'Insurance Ordinance 2000':      { op: 'contains', field: 'regulatory_categories', value: 'Insurance' },
  'AML/CFT Regulations':           {
    op: 'or',
    conditions: [
      { op: 'contains', field: 'regulatory_categories', value: 'Insurance' },
      { op: 'contains', field: 'regulatory_categories', value: 'NBFC' },
      { op: 'contains', field: 'regulatory_categories', value: 'Bank' },
    ],
  },
}

// ── 1. evaluate() — always_true / always_false ──────────────────────────────

function testEvaluateAlwaysTrueFalse() {
  console.log('1. Testing evaluate() — always_true / always_false...')

  assert.strictEqual(evaluate({ op: 'always_true' }, ABC_MANUFACTURING), true,  'always_true with private company')
  assert.strictEqual(evaluate({ op: 'always_true' }, XYZ_TEXTILES),      true,  'always_true with listed company')
  assert.strictEqual(evaluate({ op: 'always_false' }, ABC_MANUFACTURING), false, 'always_false with private company')
  assert.strictEqual(evaluate({ op: 'always_false' }, XYZ_TEXTILES),      false, 'always_false with listed company')

  console.log('  ✓ always_true matches any company')
  console.log('  ✓ always_false rejects any company')
  console.log('✓ always_true / always_false tests passed.')
}

// ── 2. evaluate() — eq ──────────────────────────────────────────────────────

function testEvaluateEq() {
  console.log('\n2. Testing evaluate() — eq...')

  const listedExpr: ApplicabilityExpression = { op: 'eq', field: 'corporate_form', value: 'listed' }
  assert.strictEqual(evaluate(listedExpr, ABC_MANUFACTURING), false, 'eq(listed) rejects private')
  assert.strictEqual(evaluate(listedExpr, XYZ_TEXTILES),      true,  'eq(listed) matches listed')

  const privateExpr: ApplicabilityExpression = { op: 'eq', field: 'corporate_form', value: 'private' }
  assert.strictEqual(evaluate(privateExpr, ABC_MANUFACTURING), true,  'eq(private) matches private')
  assert.strictEqual(evaluate(privateExpr, XYZ_TEXTILES),      false, 'eq(private) rejects listed')

  const unlistedExpr: ApplicabilityExpression = { op: 'eq', field: 'corporate_form', value: 'unlisted_public' }
  assert.strictEqual(evaluate(unlistedExpr, ABC_MANUFACTURING), false, 'eq(unlisted_public) rejects private')
  assert.strictEqual(evaluate(unlistedExpr, XYZ_TEXTILES),      false, 'eq(unlisted_public) rejects listed')
  const unlistedCo = { ...ABC_MANUFACTURING, corporate_form: 'unlisted_public' as const }
  assert.strictEqual(evaluate(unlistedExpr, unlistedCo), true, 'eq(unlisted_public) matches unlisted_public')

  console.log('  ✓ eq(listed) matches listed only')
  console.log('  ✓ eq(private) matches private only')
  console.log('  ✓ eq(unlisted_public) matches unlisted_public only')
  console.log('✓ eq tests passed.')
}

// ── 3. evaluate() — flag ────────────────────────────────────────────────────

function testEvaluateFlag() {
  console.log('\n3. Testing evaluate() — flag...')

  const pscExpr: ApplicabilityExpression = { op: 'flag', field: 'is_public_sector_company' }
  assert.strictEqual(evaluate(pscExpr, ABC_MANUFACTURING), false, 'flag rejects when false')
  const psc = { ...ABC_MANUFACTURING, is_public_sector_company: true }
  assert.strictEqual(evaluate(pscExpr, psc), true, 'flag matches when true')

  const govExpr: ApplicabilityExpression = { op: 'flag', field: 'is_government_controlled' }
  assert.strictEqual(evaluate(govExpr, ABC_MANUFACTURING), false, 'flag(gov) rejects when false')
  const govCo = { ...ABC_MANUFACTURING, is_government_controlled: true }
  assert.strictEqual(evaluate(govExpr, govCo), true, 'flag(gov) matches when true')

  const foreignExpr: ApplicabilityExpression = { op: 'flag', field: 'is_foreign_owned_majority' }
  assert.strictEqual(evaluate(foreignExpr, ABC_MANUFACTURING), false, 'flag(foreign) rejects when false')
  const foreignCo = { ...ABC_MANUFACTURING, is_foreign_owned_majority: true }
  assert.strictEqual(evaluate(foreignExpr, foreignCo), true, 'flag(foreign) matches when true')

  console.log('  ✓ flag rejects when field = false')
  console.log('  ✓ flag matches when field = true')
  console.log('  ✓ all three flag fields tested')
  console.log('✓ flag tests passed.')
}

// ── 4. evaluate() — contains ────────────────────────────────────────────────

function testEvaluateContains() {
  console.log('\n4. Testing evaluate() — contains...')

  const insuranceExpr: ApplicabilityExpression = {
    op: 'contains', field: 'regulatory_categories', value: 'Insurance'
  }

  assert.strictEqual(evaluate(insuranceExpr, ABC_MANUFACTURING), false, 'empty [] does not contain Insurance')
  assert.strictEqual(evaluate(insuranceExpr, XYZ_TEXTILES),      false, 'empty [] does not contain Insurance (listed)')

  const insurer = { ...ABC_MANUFACTURING, regulatory_categories: ['Insurance'] }
  assert.strictEqual(evaluate(insuranceExpr, insurer), true, '[Insurance] contains Insurance')

  const nbfc = { ...ABC_MANUFACTURING, regulatory_categories: ['NBFC'] }
  assert.strictEqual(evaluate(insuranceExpr, nbfc), false, '[NBFC] does not contain Insurance')

  const multi = { ...XYZ_TEXTILES, regulatory_categories: ['Insurance', 'NBFC'] }
  assert.strictEqual(evaluate(insuranceExpr, multi), true, '[Insurance, NBFC] contains Insurance')

  const nbfcExpr: ApplicabilityExpression = {
    op: 'contains', field: 'regulatory_categories', value: 'NBFC'
  }
  assert.strictEqual(evaluate(nbfcExpr, multi), true, '[Insurance, NBFC] contains NBFC')
  assert.strictEqual(evaluate(nbfcExpr, insurer), false, '[Insurance] does not contain NBFC')

  console.log('  ✓ empty regulatory_categories → false')
  console.log('  ✓ single-match category → true')
  console.log('  ✓ non-matching category → false')
  console.log('  ✓ multi-category array: each contains check works independently')
  console.log('✓ contains tests passed.')
}

// ── 5. evaluate() — and ─────────────────────────────────────────────────────

function testEvaluateAnd() {
  console.log('\n5. Testing evaluate() — and...')

  const expr: ApplicabilityExpression = {
    op: 'and',
    conditions: [
      { op: 'eq', field: 'corporate_form', value: 'listed' },
      { op: 'contains', field: 'regulatory_categories', value: 'Insurance' },
    ],
  }

  assert.strictEqual(evaluate(expr, XYZ_TEXTILES),      false, 'listed but no Insurance → false')
  assert.strictEqual(evaluate(expr, ABC_MANUFACTURING),  false, 'private + no Insurance → false')

  const listedInsurer = { ...XYZ_TEXTILES, regulatory_categories: ['Insurance'] }
  assert.strictEqual(evaluate(expr, listedInsurer), true, 'listed + Insurance → true')

  const privateInsurer = { ...ABC_MANUFACTURING, regulatory_categories: ['Insurance'] }
  assert.strictEqual(evaluate(expr, privateInsurer), false, 'private + Insurance → false (eq fails)')

  // Vacuous conjunction
  assert.strictEqual(
    evaluate({ op: 'and', conditions: [] }, ABC_MANUFACTURING),
    true,
    'and([]) is vacuously true'
  )

  console.log('  ✓ and: all conditions must be true')
  console.log('  ✓ and([]): vacuous conjunction = true')
  console.log('✓ and tests passed.')
}

// ── 6. evaluate() — or ──────────────────────────────────────────────────────

function testEvaluateOr() {
  console.log('\n6. Testing evaluate() — or...')

  const amlExpr: ApplicabilityExpression = {
    op: 'or',
    conditions: [
      { op: 'contains', field: 'regulatory_categories', value: 'Insurance' },
      { op: 'contains', field: 'regulatory_categories', value: 'NBFC' },
      { op: 'contains', field: 'regulatory_categories', value: 'Bank' },
    ],
  }

  assert.strictEqual(evaluate(amlExpr, ABC_MANUFACTURING), false, 'no regulated categories → false')
  assert.strictEqual(evaluate(amlExpr, XYZ_TEXTILES),      false, 'listed but no regulated categories → false')

  const nbfc = { ...ABC_MANUFACTURING, regulatory_categories: ['NBFC'] }
  assert.strictEqual(evaluate(amlExpr, nbfc), true, '[NBFC] → true (matches second condition)')

  const bank = { ...ABC_MANUFACTURING, regulatory_categories: ['Bank'] }
  assert.strictEqual(evaluate(amlExpr, bank), true, '[Bank] → true (matches third condition)')

  const insuranceBank = { ...ABC_MANUFACTURING, regulatory_categories: ['Insurance', 'Bank'] }
  assert.strictEqual(evaluate(amlExpr, insuranceBank), true, '[Insurance, Bank] → true (matches multiple)')

  // Vacuous disjunction
  assert.strictEqual(
    evaluate({ op: 'or', conditions: [] }, ABC_MANUFACTURING),
    false,
    'or([]) is vacuously false'
  )

  console.log('  ✓ or: any condition true → true')
  console.log('  ✓ or: all conditions false → false')
  console.log('  ✓ or([]): vacuous disjunction = false')
  console.log('✓ or tests passed.')
}

// ── 7. evaluate() — not ─────────────────────────────────────────────────────

function testEvaluateNot() {
  console.log('\n7. Testing evaluate() — not...')

  assert.strictEqual(
    evaluate({ op: 'not', condition: { op: 'always_true' } }, ABC_MANUFACTURING),
    false,
    'not(always_true) = false'
  )
  assert.strictEqual(
    evaluate({ op: 'not', condition: { op: 'always_false' } }, ABC_MANUFACTURING),
    true,
    'not(always_false) = true'
  )
  assert.strictEqual(
    evaluate({ op: 'not', condition: { op: 'eq', field: 'corporate_form', value: 'listed' } }, ABC_MANUFACTURING),
    true,
    'not(eq(listed)) on private company = true'
  )
  assert.strictEqual(
    evaluate({ op: 'not', condition: { op: 'eq', field: 'corporate_form', value: 'listed' } }, XYZ_TEXTILES),
    false,
    'not(eq(listed)) on listed company = false'
  )

  console.log('  ✓ not inverts result correctly')
  console.log('✓ not tests passed.')
}

// ── 8. evaluate() — capital_gte ──────────────────────────────────────────────

function testEvaluateCapitalGte() {
  console.log('\n8. Testing evaluate() — capital_gte...')

  const expr10M: ApplicabilityExpression = { op: 'capital_gte', value: 10_000_000 }

  assert.strictEqual(evaluate(expr10M, ABC_MANUFACTURING), true, '10M >= 10M → true')

  const expr10M1: ApplicabilityExpression = { op: 'capital_gte', value: 10_000_001 }
  assert.strictEqual(evaluate(expr10M1, ABC_MANUFACTURING), false, '10M < 10M+1 → false')

  const expr3M: ApplicabilityExpression = { op: 'capital_gte', value: 3_000_000 }
  const noCapital = { ...ABC_MANUFACTURING, paid_up_capital: null }
  assert.strictEqual(evaluate(expr3M, noCapital), false, 'null capital → false regardless of threshold')

  const largeCo = { ...ABC_MANUFACTURING, paid_up_capital: 500_000_000 }
  assert.strictEqual(evaluate(expr10M, largeCo), true, '500M >= 10M → true')

  assert.strictEqual(evaluate({ op: 'capital_gte', value: 500_000_001 }, XYZ_TEXTILES), false, '500M < 500M+1 → false')
  assert.strictEqual(evaluate({ op: 'capital_gte', value: 500_000_000 }, XYZ_TEXTILES), true,  '500M >= 500M → true')

  console.log('  ✓ exact threshold matches (>=)')
  console.log('  ✓ below threshold does not match')
  console.log('  ✓ null capital always returns false')
  console.log('✓ capital_gte tests passed.')
}

// ── 9. evaluate() — nested expressions ──────────────────────────────────────

function testEvaluateNested() {
  console.log('\n9. Testing evaluate() — nested and/or/not...')

  // Complex: listed AND (NOT public_sector OR is_government_controlled)
  const complex: ApplicabilityExpression = {
    op: 'and',
    conditions: [
      { op: 'eq', field: 'corporate_form', value: 'listed' },
      {
        op: 'or',
        conditions: [
          { op: 'not', condition: { op: 'flag', field: 'is_public_sector_company' } },
          { op: 'flag', field: 'is_government_controlled' },
        ],
      },
    ],
  }

  // listed, not public sector, not gov → or branch 1 (not psc) = true → and = true
  assert.strictEqual(evaluate(complex, XYZ_TEXTILES), true, 'listed + not-psc → true')
  // private → eq fails → false
  assert.strictEqual(evaluate(complex, ABC_MANUFACTURING), false, 'private → false')
  // listed + psc + not gov → or branch 1 (not psc) = false, branch 2 (gov) = false → or = false → and = false
  const pscListed = { ...XYZ_TEXTILES, is_public_sector_company: true, is_government_controlled: false }
  assert.strictEqual(evaluate(complex, pscListed), false, 'listed + psc + not gov → false')
  // listed + psc + gov → or branch 2 = true → and = true
  const pscGovListed = { ...XYZ_TEXTILES, is_public_sector_company: true, is_government_controlled: true }
  assert.strictEqual(evaluate(complex, pscGovListed), true, 'listed + psc + gov → true')

  // Double not
  const doubleNot: ApplicabilityExpression = {
    op: 'not', condition: { op: 'not', condition: { op: 'always_true' } }
  }
  assert.strictEqual(evaluate(doubleNot, ABC_MANUFACTURING), true, 'not(not(always_true)) = true')

  // Deep nesting: and(or(not(always_true), always_true)) = and(or(false, true)) = and(true) = true
  const deep: ApplicabilityExpression = {
    op: 'and',
    conditions: [{
      op: 'or',
      conditions: [
        { op: 'not', condition: { op: 'always_true' } },
        { op: 'always_true' },
      ],
    }],
  }
  assert.strictEqual(evaluate(deep, ABC_MANUFACTURING), true, 'and(or(not(true), true)) = true')

  console.log('  ✓ complex and/or/not nesting evaluated correctly')
  console.log('  ✓ double not inverts back to original')
  console.log('  ✓ deep nesting with 3 levels works')
  console.log('✓ nested expression tests passed.')
}

// ── 10. evaluate() — unknown op ──────────────────────────────────────────────

function testEvaluateUnknownOp() {
  console.log('\n10. Testing evaluate() — unknown op throws...')

  assert.throws(
    () => evaluate({ op: 'unknown_op' } as any, ABC_MANUFACTURING),
    /Unknown op: unknown_op/,
    'unknown op throws with descriptive message'
  )
  assert.throws(
    () => evaluate({ op: 'magic' } as any, ABC_MANUFACTURING),
    /Unknown op: magic/,
    'unknown op "magic" throws'
  )

  console.log('  ✓ unknown op throws Error with op name in message')
  console.log('✓ unknown op tests passed.')
}

// ── 11. evaluate() — V1 regime expressions ───────────────────────────────────

function testV1RegimeExpressions() {
  console.log('\n11. Testing V1 regime applicability expressions (private company = 2 regimes)...')

  const allRegimes = Object.entries(V1_REGIME_EXPRESSIONS)
  const applicableForPrivate = allRegimes.filter(([, expr]) => evaluate(expr, ABC_MANUFACTURING))
  const applicableForListed  = allRegimes.filter(([, expr]) => evaluate(expr, XYZ_TEXTILES))

  assert.strictEqual(applicableForPrivate.length, 2, 'private company gets exactly 2 applicable regimes')
  assert.strictEqual(applicableForListed.length,  4, 'listed company gets exactly 4 applicable regimes')

  const privateRegimeNames = applicableForPrivate.map(([name]) => name)
  assert.ok(privateRegimeNames.includes('Companies Act 2017'),         'private: Companies Act 2017 applicable')
  assert.ok(privateRegimeNames.includes('Companies Regulations 2024'), 'private: Companies Regulations 2024 applicable')
  assert.ok(!privateRegimeNames.includes('PSX Rule Book'),             'private: PSX Rule Book NOT applicable')
  assert.ok(!privateRegimeNames.includes('CCG Regulations 2019'),      'private: CCG Regulations NOT applicable')
  assert.ok(!privateRegimeNames.includes('Insurance Ordinance 2000'),  'private: Insurance Ordinance NOT applicable')
  assert.ok(!privateRegimeNames.includes('AML/CFT Regulations'),       'private: AML/CFT NOT applicable')

  const listedRegimeNames = applicableForListed.map(([name]) => name)
  assert.ok(listedRegimeNames.includes('PSX Rule Book'),               'listed: PSX Rule Book applicable')
  assert.ok(listedRegimeNames.includes('CCG Regulations 2019'),        'listed: CCG Regulations applicable')

  // Listed Insurance Company (hypothetical) should get 6+ regimes
  const listedInsurer = { ...XYZ_TEXTILES, regulatory_categories: ['Insurance'] }
  const applicableForListedInsurer = allRegimes.filter(([, expr]) => evaluate(expr, listedInsurer))
  assert.ok(applicableForListedInsurer.length >= 5, 'listed Insurance company gets 5+ applicable regimes')
  const listedInsurerNames = applicableForListedInsurer.map(([name]) => name)
  assert.ok(listedInsurerNames.includes('Insurance Ordinance 2000'), 'listed insurer: Insurance Ordinance applicable')
  assert.ok(listedInsurerNames.includes('AML/CFT Regulations'),      'listed insurer: AML/CFT applicable')

  console.log('  ✓ private company: 2 applicable regimes (Act + Regulations)')
  console.log('  ✓ listed company: 4 applicable regimes (+ PSX + CCG)')
  console.log(`  ✓ listed insurer: ${applicableForListedInsurer.length} applicable regimes`)
  console.log('✓ V1 regime expressions tests passed.')
}

// ── 12. addDuration() — days ─────────────────────────────────────────────────

function testAddDurationDays() {
  console.log('\n12. Testing addDuration() — days...')

  // No boundary crossing
  const r1 = addDuration(new Date('2026-01-15'), 10, 'days')
  assert.deepStrictEqual(r1, new Date('2026-01-25'), 'Jan 15 + 10 days = Jan 25')

  // Month boundary
  const r2 = addDuration(new Date('2026-01-15'), 30, 'days')
  assert.deepStrictEqual(r2, new Date('2026-02-14'), 'Jan 15 + 30 days = Feb 14')

  // February non-leap year (2026)
  const r3 = addDuration(new Date('2026-02-01'), 30, 'days')
  assert.deepStrictEqual(r3, new Date('2026-03-03'), 'Feb 1 + 30 days = Mar 3 (non-leap 2026)')

  // February leap year (2028)
  const r4 = addDuration(new Date('2028-02-01'), 30, 'days')
  assert.deepStrictEqual(r4, new Date('2028-03-02'), 'Feb 1 + 30 days = Mar 2 (leap 2028)')

  // Scenario 1 DIR-001: Jan 15 + 10 days = Jan 25
  const r5 = addDuration(new Date('2026-01-15'), 10, 'days')
  assert.deepStrictEqual(r5, new Date('2026-01-25'), 'DIR-001: Jan 15 + 10 days = Jan 25')

  // Scenario 1 DIR-002: Jan 25 + 15 days = Feb 9
  const r6 = addDuration(new Date('2026-01-25'), 15, 'days')
  assert.deepStrictEqual(r6, new Date('2026-02-09'), 'DIR-002: Jan 25 + 15 days = Feb 9')

  // Scenario 3 SHARE-001: Feb 1 + 30 days = Mar 3
  const r7 = addDuration(new Date('2026-02-01'), 30, 'days')
  assert.deepStrictEqual(r7, new Date('2026-03-03'), 'SHARE-001: Feb 1 + 30 days = Mar 3')

  // Scenario 4A OFFICE-002: Mar 1 + 15 days = Mar 16
  const r8 = addDuration(new Date('2026-03-01'), 15, 'days')
  assert.deepStrictEqual(r8, new Date('2026-03-16'), 'OFFICE-002: Mar 1 + 15 days = Mar 16')

  // Scenario 5 AGM-007: Apr 30 + 10 days = May 10
  const r9 = addDuration(new Date('2026-04-30'), 10, 'days')
  assert.deepStrictEqual(r9, new Date('2026-05-10'), 'AGM-007: Apr 30 + 10 days = May 10')

  // AGM-002: 120 days from Jun 30 FYE
  const r10 = addDuration(new Date('2025-06-30'), 120, 'days')
  assert.deepStrictEqual(r10, new Date('2025-10-28'), 'AGM-002: Jun 30 + 120 days = Oct 28')

  // Year boundary
  const r11 = addDuration(new Date('2025-12-25'), 10, 'days')
  assert.deepStrictEqual(r11, new Date('2026-01-04'), 'Dec 25 + 10 days = Jan 4 (year rollover)')

  console.log('  ✓ no boundary crossing')
  console.log('  ✓ month boundary crossing')
  console.log('  ✓ February non-leap year')
  console.log('  ✓ February leap year')
  console.log('  ✓ DIR-001 deadline (Jan 25)')
  console.log('  ✓ DIR-002 deadline (Feb 9)')
  console.log('  ✓ SHARE-001 deadline (Mar 3)')
  console.log('  ✓ OFFICE-002 deadline (Mar 16)')
  console.log('  ✓ AGM-007 deadline (May 10)')
  console.log('  ✓ AGM-002 deadline (Oct 28)')
  console.log('  ✓ year rollover')
  console.log('✓ addDuration days tests passed.')
}

// ── 13. addDuration() — months (with end-of-month clamping) ─────────────────

function testAddDurationMonths() {
  console.log('\n13. Testing addDuration() — months (end-of-month clamping)...')

  // Dec 31 + 2 months = Feb 28 (non-leap 2026, clamped from Feb 31)
  const r1 = addDuration(new Date('2025-12-31'), 2, 'months')
  assert.deepStrictEqual(r1, new Date('2026-02-28'), 'Dec 31 + 2 months = Feb 28 (clamped)')

  // Jan 31 + 1 month = Feb 28 (non-leap 2026)
  const r2 = addDuration(new Date('2026-01-31'), 1, 'months')
  assert.deepStrictEqual(r2, new Date('2026-02-28'), 'Jan 31 + 1 month = Feb 28 (non-leap 2026)')

  // Jan 31 + 1 month = Feb 29 (leap year 2028)
  const r3 = addDuration(new Date('2028-01-31'), 1, 'months')
  assert.deepStrictEqual(r3, new Date('2028-02-29'), 'Jan 31 + 1 month = Feb 29 (leap 2028)')

  // Normal month: Jan 15 + 1 month = Feb 15 (no clamping needed)
  const r4 = addDuration(new Date('2026-01-15'), 1, 'months')
  assert.deepStrictEqual(r4, new Date('2026-02-15'), 'Jan 15 + 1 month = Feb 15 (no clamping)')

  // Year rollover: Jun 30 + 7 months = Jan 30
  const r5 = addDuration(new Date('2025-06-30'), 7, 'months')
  assert.deepStrictEqual(r5, new Date('2026-01-30'), 'Jun 30 + 7 months = Jan 30 (year rollover)')

  // March 31 + 1 month = April 30 (April has only 30 days, clamped)
  const r6 = addDuration(new Date('2026-03-31'), 1, 'months')
  assert.deepStrictEqual(r6, new Date('2026-04-30'), 'Mar 31 + 1 month = Apr 30 (clamped from Apr 31)')

  console.log('  ✓ Dec 31 + 2 months = Feb 28 (clamped)')
  console.log('  ✓ Jan 31 + 1 month = Feb 28 (non-leap)')
  console.log('  ✓ Jan 31 + 1 month = Feb 29 (leap year)')
  console.log('  ✓ normal month: no clamping needed')
  console.log('  ✓ year rollover with months')
  console.log('  ✓ 31-day to 30-day month clamping')
  console.log('✓ addDuration months tests passed.')
}

// ── 14. addDuration() — years ────────────────────────────────────────────────

function testAddDurationYears() {
  console.log('\n14. Testing addDuration() — years...')

  const r1 = addDuration(new Date('2025-03-15'), 1, 'years')
  assert.deepStrictEqual(r1, new Date('2026-03-15'), 'Mar 15 + 1 year = Mar 15 next year')

  const r2 = addDuration(new Date('2025-06-30'), 1, 'years')
  assert.deepStrictEqual(r2, new Date('2026-06-30'), 'Jun 30 + 1 year = Jun 30 next year')

  // Feb 29 in leap year + 1 year = Feb 28 (non-leap) — clamped
  const r3 = addDuration(new Date('2028-02-29'), 1, 'years')
  assert.deepStrictEqual(r3, new Date('2029-02-28'), 'Feb 29 (leap) + 1 year = Feb 28 (non-leap, clamped)')

  console.log('  ✓ normal year addition')
  console.log('  ✓ leap→non-leap Feb 29 clamped to Feb 28')
  console.log('✓ addDuration years tests passed.')
}

// ── 15. addDuration() — weeks ────────────────────────────────────────────────

function testAddDurationWeeks() {
  console.log('\n15. Testing addDuration() — weeks...')

  const r1 = addDuration(new Date('2026-01-15'), 1, 'weeks')
  assert.deepStrictEqual(r1, new Date('2026-01-22'), 'Jan 15 + 1 week = Jan 22')

  const r2 = addDuration(new Date('2026-01-15'), 4, 'weeks')
  assert.deepStrictEqual(r2, new Date('2026-02-12'), 'Jan 15 + 4 weeks = Feb 12')

  console.log('  ✓ 1 week = 7 days')
  console.log('  ✓ 4 weeks crosses month boundary')
  console.log('✓ addDuration weeks tests passed.')
}

// ── 16. addDuration() — invalid unit ─────────────────────────────────────────

function testAddDurationInvalidUnit() {
  console.log('\n16. Testing addDuration() — invalid unit throws...')

  assert.throws(
    () => addDuration(new Date('2026-01-15'), 10, 'hours' as any),
    /InvalidDeadlineUnit/,
    'invalid unit throws InvalidDeadlineUnit'
  )

  console.log('  ✓ invalid unit throws InvalidDeadlineUnit')
  console.log('✓ addDuration invalid unit tests passed.')
}

// ── 17. resolveObligationChains() — DIR-001 → DIR-002 ───────────────────────

function testResolveObligationChains() {
  console.log('\n17. Testing resolveObligationChains() — DIR-001 → DIR-002...')

  // Simulate two obligations from a director resignation event
  const dir001VersionId = 'rv-dir-001'
  const dir002VersionId = 'rv-dir-002'

  const ruleVersions: RuleVersion[] = [
    {
      rule_version_id:           dir001VersionId,
      rule_id:                   'DIR-001',
      regime_id:                 'regime-companies-act',
      applicability_expression:  { op: 'always_true' },
      deadline_value:            10,
      deadline_unit:             'days',
      effective_from:            '2024-01-01',
      effective_to:              null,
      form_number:               null,
      filing_authority:          null,
      verification_status:       'verified',
      rules:                     { rule_id: 'DIR-001', event_type_id: 'et-director-changes', regime_id: 'regime-companies-act' },
    },
    {
      rule_version_id:           dir002VersionId,
      rule_id:                   'DIR-002',
      regime_id:                 'regime-companies-regulations',
      applicability_expression:  { op: 'always_true' },
      deadline_value:            15,
      deadline_unit:             'days',
      effective_from:            '2024-01-01',
      effective_to:              null,
      form_number:               'Form-9',
      filing_authority:          'Company Registration Office, SECP',
      verification_status:       'verified',
      rules:                     { rule_id: 'DIR-002', event_type_id: 'et-director-changes', regime_id: 'regime-companies-regulations' },
    },
  ]

  const eventDate = new Date('2026-01-15')
  const dir001Deadline = addDuration(eventDate, 10, 'days') // Jan 25

  const obligations: ObligationToCreate[] = [
    {
      rule_version_id:      dir001VersionId,
      company_id:           'co-001',
      tenant_id:            'tn-001',
      event_type_id:        'et-director-changes',
      trigger_date:         eventDate,
      computed_deadline:    dir001Deadline,
      status:               'upcoming',
      linked_obligation_id: null,
      assigned_to_user_id:  null,
      demo_session_id:      null,
      demo_expires_at:      null,
    },
    {
      rule_version_id:      dir002VersionId,
      company_id:           'co-001',
      tenant_id:            'tn-001',
      event_type_id:        'et-director-changes',
      trigger_date:         eventDate, // initially same as event_date, overridden by resolveChains
      computed_deadline:    addDuration(eventDate, 15, 'days'), // initially Jan 30, overridden
      status:               'upcoming',
      linked_obligation_id: null,
      assigned_to_user_id:  null,
      demo_session_id:      null,
      demo_expires_at:      null,
    },
  ]

  // Before chain resolution
  assert.deepStrictEqual(obligations[1].trigger_date, eventDate, 'DIR-002 trigger = event_date before resolution')

  resolveObligationChains(obligations, ruleVersions)

  // After chain resolution
  const dir001 = obligations[0]
  const dir002 = obligations[1]

  // DIR-001: unchanged
  assert.deepStrictEqual(dir001.trigger_date,    new Date('2026-01-15'), 'DIR-001 trigger_date unchanged = Jan 15')
  assert.deepStrictEqual(dir001.computed_deadline, new Date('2026-01-25'), 'DIR-001 deadline unchanged = Jan 25')
  assert.strictEqual(dir001._linked_to_rule_id,  undefined, 'DIR-001 has no _linked_to_rule_id')

  // DIR-002: trigger overridden to DIR-001's deadline; deadline recalculated
  assert.deepStrictEqual(dir002.trigger_date,    new Date('2026-01-25'), 'DIR-002 trigger = DIR-001 deadline = Jan 25')
  assert.deepStrictEqual(dir002.computed_deadline, new Date('2026-02-09'), 'DIR-002 deadline = Jan 25 + 15 days = Feb 9')
  assert.strictEqual(dir002._linked_to_rule_id,  'DIR-001', 'DIR-002 marked with upstream rule ID')

  console.log('  ✓ DIR-002 trigger_date overridden to DIR-001 computed_deadline (Jan 25)')
  console.log('  ✓ DIR-002 computed_deadline recalculated (Jan 25 + 15 = Feb 9)')
  console.log('  ✓ DIR-001 unchanged (no upstream dependency)')
  console.log('  ✓ _linked_to_rule_id marker set on downstream obligation')
  console.log('✓ resolveObligationChains tests passed.')
}

// ── 18. resolveObligationChains() — no chain for unrelated event ─────────────

function testNoChainingForUnrelatedEvent() {
  console.log('\n18. Testing resolveObligationChains() — no chain for share allotment...')

  const share001VersionId = 'rv-share-001'
  const ruleVersions: RuleVersion[] = [{
    rule_version_id:           share001VersionId,
    rule_id:                   'SHARE-001',
    regime_id:                 'regime-companies-regulations',
    applicability_expression:  { op: 'always_true' },
    deadline_value:            30,
    deadline_unit:             'days',
    effective_from:            '2024-01-01',
    effective_to:              null,
    form_number:               'Form-3',
    filing_authority:          'Company Registration Office, SECP',
    verification_status:       'verified',
    rules:                     { rule_id: 'SHARE-001', event_type_id: 'et-share-allotment', regime_id: 'regime-companies-regulations' },
  }]

  const obligations: ObligationToCreate[] = [{
    rule_version_id:      share001VersionId,
    company_id:           'co-001',
    tenant_id:            'tn-001',
    event_type_id:        'et-share-allotment',
    trigger_date:         new Date('2026-02-01'),
    computed_deadline:    new Date('2026-03-03'),
    status:               'upcoming',
    linked_obligation_id: null,
    assigned_to_user_id:  null,
    demo_session_id:      null,
    demo_expires_at:      null,
  }]

  // Should not throw; share allotment has no known chains
  resolveObligationChains(obligations, ruleVersions)

  // Obligation unchanged
  assert.deepStrictEqual(obligations[0].trigger_date,     new Date('2026-02-01'), 'trigger_date unchanged')
  assert.deepStrictEqual(obligations[0].computed_deadline, new Date('2026-03-03'), 'deadline unchanged')
  assert.strictEqual(obligations[0]._linked_to_rule_id,  undefined, 'no chain marker')

  console.log('  ✓ SHARE-001 obligation: no chains, nothing mutated')
  console.log('✓ no-chain tests passed.')
}

// ── 19. resolveObligationChains() — ChainIncomplete error ────────────────────

function testChainIncompleteError() {
  console.log('\n19. Testing resolveObligationChains() — ChainIncomplete when half a chain present...')

  // Only DIR-001 present (DIR-002 absent) — should throw
  const dir001VersionId = 'rv-dir-001'
  const ruleVersions: RuleVersion[] = [{
    rule_version_id:           dir001VersionId,
    rule_id:                   'DIR-001',
    regime_id:                 'regime-companies-act',
    applicability_expression:  { op: 'always_true' },
    deadline_value:            10,
    deadline_unit:             'days',
    effective_from:            '2024-01-01',
    effective_to:              null,
    form_number:               null,
    filing_authority:          null,
    verification_status:       'verified',
    rules:                     { rule_id: 'DIR-001', event_type_id: 'et-director-changes', regime_id: 'regime-companies-act' },
  }]

  const obligations: ObligationToCreate[] = [{
    rule_version_id:      dir001VersionId,
    company_id:           'co-001',
    tenant_id:            'tn-001',
    event_type_id:        'et-director-changes',
    trigger_date:         new Date('2026-01-15'),
    computed_deadline:    new Date('2026-01-25'),
    status:               'upcoming',
    linked_obligation_id: null,
    assigned_to_user_id:  null,
    demo_session_id:      null,
    demo_expires_at:      null,
  }]

  assert.throws(
    () => resolveObligationChains(obligations, ruleVersions),
    /ChainIncomplete/,
    'ChainIncomplete thrown when only upstream present'
  )

  console.log('  ✓ ChainIncomplete thrown when only upstream half of chain present')
  console.log('✓ ChainIncomplete error tests passed.')
}

// ── 20. computeDownstreamUpdate() — propagation after filing ─────────────────

function testComputeDownstreamUpdate() {
  console.log('\n20. Testing computeDownstreamUpdate() — post-filing propagation...')

  // DIR-001 filed on day 3 (Jan 18, not Jan 25)
  const actualCompletion = new Date('2026-01-18')
  const { newTriggerDate, newComputedDeadline } = computeDownstreamUpdate(actualCompletion, 15, 'days')

  assert.deepStrictEqual(newTriggerDate,      new Date('2026-01-18'), 'trigger = actual completion date')
  assert.deepStrictEqual(newComputedDeadline, new Date('2026-02-02'), 'deadline = Jan 18 + 15 days = Feb 2')

  // Original worst-case was Feb 9; early filing moves deadline to Feb 2 (7 days earlier)
  const originalWorstCase = new Date('2026-02-09')
  const improvement = (originalWorstCase.getTime() - newComputedDeadline.getTime()) / (1000 * 60 * 60 * 24)
  assert.strictEqual(improvement, 7, 'early filing on day 3 gains 7 days')

  console.log('  ✓ trigger_date = actual filing date (Jan 18)')
  console.log('  ✓ new deadline = Jan 18 + 15 days = Feb 2')
  console.log('  ✓ 7 days gained from early filing vs worst-case Feb 9')
  console.log('✓ computeDownstreamUpdate tests passed.')
}

// ── 21. computeObligationStatus() ────────────────────────────────────────────

function testComputeObligationStatus() {
  console.log('\n21. Testing computeObligationStatus()...')

  const today = new Date('2026-01-15')

  // Deadline > 30 days away → upcoming
  const farDeadline = new Date('2026-03-01')
  assert.strictEqual(computeObligationStatus(farDeadline, today), 'upcoming', 'far deadline → upcoming')

  // Deadline exactly 30 days away → due_soon (boundary)
  const thirtyDays = addDuration(today, 30, 'days')
  assert.strictEqual(computeObligationStatus(thirtyDays, today), 'due_soon', 'exactly 30 days → due_soon')

  // Deadline 29 days away → due_soon
  const twentyNineDays = addDuration(today, 29, 'days')
  assert.strictEqual(computeObligationStatus(twentyNineDays, today), 'due_soon', '29 days → due_soon')

  // Deadline 1 day away → due_soon
  const tomorrow = addDuration(today, 1, 'days')
  assert.strictEqual(computeObligationStatus(tomorrow, today), 'due_soon', '1 day away → due_soon')

  // Deadline = today → due_soon (0 days, not negative)
  assert.strictEqual(computeObligationStatus(today, today), 'due_soon', 'deadline = today → due_soon')

  // Deadline yesterday → overdue
  const yesterday = addDuration(today, -1, 'days')
  assert.strictEqual(computeObligationStatus(yesterday, today), 'overdue', 'yesterday → overdue')

  // Deadline 10 days past → overdue
  const tenDaysPast = addDuration(today, -10, 'days')
  assert.strictEqual(computeObligationStatus(tenDaysPast, today), 'overdue', '10 days past → overdue')

  console.log('  ✓ far deadline → upcoming (>30 days)')
  console.log('  ✓ exactly 30 days → due_soon (boundary)')
  console.log('  ✓ within 30 days → due_soon')
  console.log('  ✓ today → due_soon (0 diff, not overdue)')
  console.log('  ✓ past deadline → overdue')
  console.log('✓ computeObligationStatus tests passed.')
}

// ── 22. KNOWN_CHAINS constant ────────────────────────────────────────────────

function testKnownChains() {
  console.log('\n22. Testing KNOWN_CHAINS constant...')

  assert.ok(Array.isArray(KNOWN_CHAINS), 'KNOWN_CHAINS is an array')
  assert.strictEqual(KNOWN_CHAINS.length, 1, 'V1 has exactly 1 chain')
  assert.deepStrictEqual(KNOWN_CHAINS[0], ['DIR-001', 'DIR-002'], 'Chain is DIR-001 → DIR-002')

  console.log('  ✓ KNOWN_CHAINS has exactly 1 entry in V1')
  console.log('  ✓ Chain: DIR-001 → DIR-002')
  console.log('✓ KNOWN_CHAINS tests passed.')
}

// ── 23. computeTriggerDate() ─────────────────────────────────────────────────

function testComputeTriggerDate() {
  console.log('\n23. Testing computeTriggerDate()...')

  // Event mode: trigger = event_date
  const eventCtx = {
    event_type_id:    'et-director-changes',
    event_date:       new Date('2026-01-15'),
    resolved_rule_id: 'DIR-001',
    demo_session_id:  null,
  }
  const today = new Date('2026-01-15')
  const trigger = computeTriggerDate('event', eventCtx, ABC_MANUFACTURING, today)
  assert.deepStrictEqual(trigger, new Date('2026-01-15'), 'event mode: trigger = event_date')

  // Date-driven mode: trigger = FYE (most recent)
  // ABC_MANUFACTURING FYE = June 30. Today = Jan 15 2026. Most recent FYE = Jun 30 2025.
  const fyeTrigger = computeTriggerDate('date_driven', undefined, ABC_MANUFACTURING, today)
  assert.deepStrictEqual(fyeTrigger, new Date('2025-06-30T00:00:00.000Z'), 'date_driven: trigger = most recent FYE')

  // Date-driven: today IS the FYE → use this year's FYE
  const fyeDay = new Date('2025-06-30')
  const fyeTrigger2 = computeTriggerDate('date_driven', undefined, ABC_MANUFACTURING, fyeDay)
  assert.deepStrictEqual(fyeTrigger2, new Date('2025-06-30T00:00:00.000Z'), 'date_driven: today = FYE → use current FYE')

  console.log('  ✓ event mode: trigger_date = event_date')
  console.log('  ✓ date_driven: trigger_date = most recent FYE (previous year when FYE not yet reached)')
  console.log('✓ computeTriggerDate tests passed.')
}

// ── 24. Scenario 1 cross-check (pure logic, no DB) ───────────────────────────

function testScenario1PureLogic() {
  console.log('\n24. Scenario 1 cross-check — private company director resignation (pure logic)...')

  // Prove: event_date=Jan 15, DIR-001: trigger=Jan 15, deadline=Jan 25; DIR-002: trigger=Jan 25, deadline=Feb 9
  const eventDate = new Date('2026-01-15')

  const dir001Trigger  = eventDate
  const dir001Deadline = addDuration(dir001Trigger, 10, 'days')
  assert.deepStrictEqual(dir001Deadline, new Date('2026-01-25'), 'DIR-001 deadline = Jan 25')

  const dir002Trigger  = dir001Deadline  // chain: trigger = upstream deadline
  const dir002Deadline = addDuration(dir002Trigger, 15, 'days')
  assert.deepStrictEqual(dir002Deadline, new Date('2026-02-09'), 'DIR-002 deadline = Feb 9')

  // Private company: PSX/CCG not applicable
  assert.strictEqual(
    evaluate({ op: 'eq', field: 'corporate_form', value: 'listed' }, ABC_MANUFACTURING),
    false,
    'private company: PSX regime not applicable'
  )

  // Verify regime count
  const allRegimes = Object.values(V1_REGIME_EXPRESSIONS)
  const applicableCount = allRegimes.filter(expr => evaluate(expr, ABC_MANUFACTURING)).length
  assert.strictEqual(applicableCount, 2, 'private company gets exactly 2 regimes')

  console.log('  ✓ DIR-001: trigger=Jan 15, deadline=Jan 25')
  console.log('  ✓ DIR-002: trigger=Jan 25 (upstream deadline), deadline=Feb 9')
  console.log('  ✓ private company: PSX regime not applicable')
  console.log('  ✓ private company: exactly 2 applicable regimes')
  console.log('✓ Scenario 1 pure logic cross-check passed.')
}

// ── 25. Scenario 2 cross-check — listed same deadlines ───────────────────────

function testScenario2PureLogic() {
  console.log('\n25. Scenario 2 cross-check — listed company director resignation (same deadlines as Scenario 1)...')

  // Listed company gets 4 regimes, but DIR-001/DIR-002 deadlines are identical
  const allRegimes = Object.values(V1_REGIME_EXPRESSIONS)
  const applicableForListed = allRegimes.filter(expr => evaluate(expr, XYZ_TEXTILES))
  assert.strictEqual(applicableForListed.length, 4, 'listed company: 4 applicable regimes')

  // Same deadline arithmetic regardless of corporate_form
  const eventDate  = new Date('2026-01-15')
  const dir001Dead = addDuration(eventDate, 10, 'days')
  const dir002Dead = addDuration(dir001Dead, 15, 'days')
  assert.deepStrictEqual(dir001Dead, new Date('2026-01-25'), 'listed DIR-001 deadline = Jan 25 (same as private)')
  assert.deepStrictEqual(dir002Dead, new Date('2026-02-09'), 'listed DIR-002 deadline = Feb 9 (same as private)')

  console.log('  ✓ listed company: 4 applicable regimes (2 more than private)')
  console.log('  ✓ obligations: identical deadlines to Scenario 1')
  console.log('✓ Scenario 2 pure logic cross-check passed.')
}

// ── 26. Scenario 5 — AGM-007 listed vs private differentiation ───────────────

function testScenario5Differentiation() {
  console.log('\n26. Scenario 5 — AGM-007 listed vs private differentiation...')

  // AGM-007 applicability expression: eq(corporate_form, listed)
  const agm007Expr: ApplicabilityExpression = { op: 'eq', field: 'corporate_form', value: 'listed' }

  assert.strictEqual(evaluate(agm007Expr, XYZ_TEXTILES),      true,  'AGM-007 applicable for listed company')
  assert.strictEqual(evaluate(agm007Expr, ABC_MANUFACTURING),  false, 'AGM-007 NOT applicable for private company')

  // Deadline: AGM date + 10 days
  const agmDate    = new Date('2026-04-30')
  const agmDeadline = addDuration(agmDate, 10, 'days')
  assert.deepStrictEqual(agmDeadline, new Date('2026-05-10'), 'AGM-007 deadline = Apr 30 + 10 days = May 10')

  console.log('  ✓ AGM-007 applicable for listed company')
  console.log('  ✓ AGM-007 NOT applicable for private company')
  console.log('  ✓ AGM-007 deadline = May 10')
  console.log('✓ Scenario 5 differentiation tests passed.')
}

// ── 27. CHARGE-001 deadline arithmetic ───────────────────────────────────────

function testCharge001Deadline() {
  console.log('\n27. CHARGE-001 deadline arithmetic...')

  // CHARGE-001: always_true, 30 days, event_type = Charges & Mortgages
  const chargeExpr: ApplicabilityExpression = { op: 'always_true' }
  assert.strictEqual(evaluate(chargeExpr, ABC_MANUFACTURING), true,  'CHARGE-001 applicable to private company')
  assert.strictEqual(evaluate(chargeExpr, XYZ_TEXTILES),      true,  'CHARGE-001 applicable to listed company')

  // Jan 15 + 30 days = Feb 14
  const chargeDeadline1 = addDuration(new Date('2026-01-15'), 30, 'days')
  assert.deepStrictEqual(chargeDeadline1, new Date('2026-02-14'), 'CHARGE-001: Jan 15 + 30 days = Feb 14')

  // Feb 1 + 30 days = Mar 3 (non-leap 2026)
  const chargeDeadline2 = addDuration(new Date('2026-02-01'), 30, 'days')
  assert.deepStrictEqual(chargeDeadline2, new Date('2026-03-03'), 'CHARGE-001: Feb 1 + 30 days = Mar 3 (non-leap)')

  // Jan 29 + 30 days = Feb 28 (non-leap year clamping)
  const chargeDeadline3 = addDuration(new Date('2026-01-29'), 30, 'days')
  assert.deepStrictEqual(chargeDeadline3, new Date('2026-02-28'), 'CHARGE-001: Jan 29 + 30 days = Feb 28 (clamp)')

  console.log('  ✓ CHARGE-001 applicable to private and listed companies')
  console.log('  ✓ CHARGE-001: Jan 15 + 30 days = Feb 14')
  console.log('  ✓ CHARGE-001: Feb 1 + 30 days = Mar 3 (non-leap 2026)')
  console.log('  ✓ CHARGE-001: Jan 29 + 30 days = Feb 28 (clamp)')
  console.log('✓ CHARGE-001 deadline arithmetic passed.')
}

// ── 28. BO-002 deadline arithmetic ───────────────────────────────────────────

function testBo002Deadline() {
  console.log('\n28. BO-002 deadline arithmetic...')

  // BO-002: always_true, 30 days, event_type = Beneficial Ownership
  const boExpr: ApplicabilityExpression = { op: 'always_true' }
  assert.strictEqual(evaluate(boExpr, ABC_MANUFACTURING), true,  'BO-002 applicable to private company')
  assert.strictEqual(evaluate(boExpr, XYZ_TEXTILES),      true,  'BO-002 applicable to listed company')

  // Mar 1 + 30 days = Mar 31
  const boDeadline1 = addDuration(new Date('2026-03-01'), 30, 'days')
  assert.deepStrictEqual(boDeadline1, new Date('2026-03-31'), 'BO-002: Mar 1 + 30 days = Mar 31')

  // Apr 1 + 30 days = May 1
  const boDeadline2 = addDuration(new Date('2026-04-01'), 30, 'days')
  assert.deepStrictEqual(boDeadline2, new Date('2026-05-01'), 'BO-002: Apr 1 + 30 days = May 1')

  // Jan 29 + 30 days = Feb 28 (non-leap, same clamping as CHARGE-001)
  const boDeadline3 = addDuration(new Date('2026-01-29'), 30, 'days')
  assert.deepStrictEqual(boDeadline3, new Date('2026-02-28'), 'BO-002: Jan 29 + 30 days = Feb 28 (clamp)')

  console.log('  ✓ BO-002 applicable to private and listed companies')
  console.log('  ✓ BO-002: Mar 1 + 30 days = Mar 31')
  console.log('  ✓ BO-002: Apr 1 + 30 days = May 1')
  console.log('  ✓ BO-002: Jan 29 + 30 days = Feb 28 (clamp)')
  console.log('✓ BO-002 deadline arithmetic passed.')
}

// ── 29. Date-driven rule deadline arithmetic (AGM-002 / ANNRET-001 / ANNRET-002) ──

function testDateDrivenDeadlines() {
  console.log('\n29. Date-driven rule deadline arithmetic...')

  // AGM-002: 120 days from FYE. Private company FYE = Jun 30.
  // Today (2026-06-17) < FYE 2026-06-30 → use FYE 2025-06-30.
  // Jun 30 2025 + 120 days: Jul=30days→Jul30 Aug=31days→Aug30? No — addDuration is exact calendar.
  // Jun 30 + 120 days = Oct 28 2025 (30+31+31+28 = 120).
  const agm002Trigger   = new Date('2025-06-30')
  const agm002Deadline  = addDuration(agm002Trigger, 120, 'days')
  assert.deepStrictEqual(agm002Deadline, new Date('2025-10-28'), 'AGM-002: Jun 30 + 120 days = Oct 28')

  // ANNRET-001: 60 days from FYE.
  // Jun 30 2025 + 60 days = Aug 29 2025 (31+29=60).
  const annret001Deadline = addDuration(agm002Trigger, 60, 'days')
  assert.deepStrictEqual(annret001Deadline, new Date('2025-08-29'), 'ANNRET-001: Jun 30 + 60 days = Aug 29')

  // ANNRET-002 (listed only): 30 days from FYE.
  // XYZ FYE = Dec 31. Today 2026-06-17 > Dec 31 2025 → use Dec 31 2025.
  // Dec 31 2025 + 30 days = Jan 30 2026.
  const xyzFyeTrigger     = new Date('2025-12-31')
  const annret002Deadline = addDuration(xyzFyeTrigger, 30, 'days')
  assert.deepStrictEqual(annret002Deadline, new Date('2026-01-30'), 'ANNRET-002: Dec 31 + 30 days = Jan 30')

  // ANNRET-002 applicability: listed only
  const annret002Expr: ApplicabilityExpression = { op: 'eq', field: 'corporate_form', value: 'listed' }
  assert.strictEqual(evaluate(annret002Expr, XYZ_TEXTILES),      true,  'ANNRET-002 applicable to listed')
  assert.strictEqual(evaluate(annret002Expr, ABC_MANUFACTURING),  false, 'ANNRET-002 NOT applicable to private')

  console.log('  ✓ AGM-002: FYE Jun 30 2025 + 120 days = Oct 28 2025')
  console.log('  ✓ ANNRET-001: FYE Jun 30 2025 + 60 days = Aug 29 2025')
  console.log('  ✓ ANNRET-002: FYE Dec 31 2025 + 30 days = Jan 30 2026')
  console.log('  ✓ ANNRET-002 applicable to listed only')
  console.log('✓ Date-driven deadline arithmetic passed.')
}

// ── Run all tests ─────────────────────────────────────────────────────────────

testEvaluateAlwaysTrueFalse()
testEvaluateEq()
testEvaluateFlag()
testEvaluateContains()
testEvaluateAnd()
testEvaluateOr()
testEvaluateNot()
testEvaluateCapitalGte()
testEvaluateNested()
testEvaluateUnknownOp()
testV1RegimeExpressions()
testAddDurationDays()
testAddDurationMonths()
testAddDurationYears()
testAddDurationWeeks()
testAddDurationInvalidUnit()
testResolveObligationChains()
testNoChainingForUnrelatedEvent()
testChainIncompleteError()
testComputeDownstreamUpdate()
testComputeObligationStatus()
testKnownChains()
testComputeTriggerDate()
testScenario1PureLogic()
testScenario2PureLogic()
testScenario5Differentiation()
testCharge001Deadline()
testBo002Deadline()
testDateDrivenDeadlines()

console.log('\n════════════════════════════════════════════════════════════')
console.log('ALL L1 RULE ENGINE UNIT TESTS PASSED (29 test groups)')
console.log('evaluate():              11 test groups')
console.log('addDuration():            5 test groups')
console.log('resolveObligationChains(): 3 test groups')
console.log('computeDownstreamUpdate(): 1 test group')
console.log('computeObligationStatus(): 1 test group')
console.log('Scenario cross-checks:    3 test groups')
console.log('KNOWN_CHAINS + misc:      2 test groups')
console.log('CHARGE-001 deadline:      1 test group')
console.log('BO-002 deadline:          1 test group')
console.log('Date-driven deadlines:    1 test group')
console.log('════════════════════════════════════════════════════════════')
