/**
 * L1 Unit Tests — TaskGenerationService.deriveTaskSpecs()
 *
 * Tests all 7 workflow phases × approval_requirement_type variants.
 * Pure function — no DB required.
 *
 * Run: ts-node --project tsconfig.test.json lib/workflow/tests/task-generation.test.ts
 */

import assert from 'assert'
import { TaskGenerationService } from '../task-generation-service'
import type { WorkflowTemplateRow } from '../types'

const svc = new TaskGenerationService()

let passed = 0
let failed = 0

function test(name: string, fn: () => void): void {
  try {
    fn()
    console.log(`  ✓ ${name}`)
    passed++
  } catch (err: unknown) {
    console.error(`  ✗ ${name}`)
    console.error(`    ${(err as Error).message}`)
    failed++
  }
}

function section(name: string): void {
  console.log(`\n${name}`)
}

// ── Template fixtures ─────────────────────────────────────────────────────────

function makeTemplate(overrides: Partial<WorkflowTemplateRow> = {}): WorkflowTemplateRow {
  return {
    workflow_template_id:      'wwww0000-0000-0000-0000-000000000001',
    obligation_template_id:    'ot000001-0000-0000-0000-000000000001',
    name:                      'Test Workflow',
    active_phases:             ['Drafting & Collection', 'Internal Approval', 'Filing Submitted'],
    approval_requirement_type: 'board_resolution',
    document_requirements:     [
      { document_type: 'resignation_letter', title: 'Director Resignation Letter', is_hard_prerequisite: true },
      { document_type: 'consent_form',       title: 'Director Consent Form',       is_hard_prerequisite: false },
    ],
    recurrence_type:  'one_off',
    alert_lead_times: [30, 14, 7, 3, 1],
    created_at:       new Date('2026-01-01'),
    ...overrides,
  }
}

// ── Phase: Drafting & Collection ──────────────────────────────────────────────

section('Phase: Drafting & Collection')

test('generates prepare_draft task (sort_order=0, soft)', () => {
  const template = makeTemplate()
  const specs    = svc.deriveTaskSpecs(template, 'Drafting & Collection')
  const draft    = specs.find(s => s.task_type === 'prepare_draft')
  assert.ok(draft, 'prepare_draft not found')
  assert.strictEqual(draft.sort_order, 0)
  assert.strictEqual(draft.is_hard_prerequisite, false)
})

test('generates one collect_document per document_requirement', () => {
  const template = makeTemplate()
  const specs    = svc.deriveTaskSpecs(template, 'Drafting & Collection')
  const docs     = specs.filter(s => s.task_type === 'collect_document')
  assert.strictEqual(docs.length, 2, `expected 2 collect_document tasks, got ${docs.length}`)
})

test('collect_document inherits is_hard_prerequisite from doc requirement', () => {
  const template = makeTemplate()
  const specs    = svc.deriveTaskSpecs(template, 'Drafting & Collection')
  const docs     = specs.filter(s => s.task_type === 'collect_document')
  assert.strictEqual(docs[0].is_hard_prerequisite, true,  'first doc should be hard')
  assert.strictEqual(docs[1].is_hard_prerequisite, false, 'second doc should be soft')
})

test('collect_document titles derived from document_requirement.title', () => {
  const template = makeTemplate()
  const specs    = svc.deriveTaskSpecs(template, 'Drafting & Collection')
  const docs     = specs.filter(s => s.task_type === 'collect_document')
  assert.ok(docs[0].title.includes('Director Resignation Letter'))
  assert.ok(docs[1].title.includes('Director Consent Form'))
})

test('total task count = 1 + number of document_requirements', () => {
  const template = makeTemplate()
  const specs    = svc.deriveTaskSpecs(template, 'Drafting & Collection')
  assert.strictEqual(specs.length, 3, `expected 3 tasks, got ${specs.length}`)
})

test('handles zero document_requirements — only prepare_draft', () => {
  const template = makeTemplate({ document_requirements: [] })
  const specs    = svc.deriveTaskSpecs(template, 'Drafting & Collection')
  assert.strictEqual(specs.length, 1)
  assert.strictEqual(specs[0].task_type, 'prepare_draft')
})

// ── Phase: Internal Approval — board_resolution ───────────────────────────────

section('Phase: Internal Approval (board_resolution)')

test('generates board_resolution task (hard)', () => {
  const template = makeTemplate({ approval_requirement_type: 'board_resolution' })
  const specs    = svc.deriveTaskSpecs(template, 'Internal Approval')
  assert.strictEqual(specs.length, 1)
  assert.strictEqual(specs[0].task_type, 'board_resolution')
  assert.strictEqual(specs[0].is_hard_prerequisite, true)
})

// ── Phase: Internal Approval — special_resolution ─────────────────────────────

section('Phase: Internal Approval (special_resolution)')

test('generates special_resolution task (hard)', () => {
  const template = makeTemplate({ approval_requirement_type: 'special_resolution' })
  const specs    = svc.deriveTaskSpecs(template, 'Internal Approval')
  assert.strictEqual(specs.length, 1)
  assert.strictEqual(specs[0].task_type, 'special_resolution')
  assert.strictEqual(specs[0].is_hard_prerequisite, true)
})

// ── Phase: Internal Approval — none ──────────────────────────────────────────

section('Phase: Internal Approval (none — OQ-1)')

test('returns empty array when approval_requirement_type = none', () => {
  const template = makeTemplate({ approval_requirement_type: 'none' })
  const specs    = svc.deriveTaskSpecs(template, 'Internal Approval')
  assert.strictEqual(specs.length, 0, 'should generate no tasks for approval_requirement_type=none')
})

// ── Phase: Filing Submitted ───────────────────────────────────────────────────

section('Phase: Filing Submitted')

test('generates submit_filing (hard) + record_reference (soft)', () => {
  const template = makeTemplate()
  const specs    = svc.deriveTaskSpecs(template, 'Filing Submitted')
  assert.strictEqual(specs.length, 2)
  const submit = specs.find(s => s.task_type === 'submit_filing')
  const ref    = specs.find(s => s.task_type === 'record_reference')
  assert.ok(submit, 'submit_filing not found')
  assert.ok(ref,    'record_reference not found')
  assert.strictEqual(submit!.is_hard_prerequisite, true)
  assert.strictEqual(ref!.is_hard_prerequisite,    false)
})

test('submit_filing has sort_order=0, record_reference sort_order=1', () => {
  const template = makeTemplate()
  const specs    = svc.deriveTaskSpecs(template, 'Filing Submitted')
  const submit   = specs.find(s => s.task_type === 'submit_filing')!
  const ref      = specs.find(s => s.task_type === 'record_reference')!
  assert.strictEqual(submit.sort_order, 0)
  assert.strictEqual(ref.sort_order,    1)
})

// ── Phase: Third-Party Verification ──────────────────────────────────────────

section('Phase: Third-Party Verification')

test('generates await_verification task (hard)', () => {
  const template = makeTemplate()
  const specs    = svc.deriveTaskSpecs(template, 'Third-Party Verification')
  assert.strictEqual(specs.length, 1)
  assert.strictEqual(specs[0].task_type, 'await_verification')
  assert.strictEqual(specs[0].is_hard_prerequisite, true)
})

// ── Phase: Regulator Review ───────────────────────────────────────────────────

section('Phase: Regulator Review')

test('generates await_regulator task (hard)', () => {
  const template = makeTemplate()
  const specs    = svc.deriveTaskSpecs(template, 'Regulator Review')
  assert.strictEqual(specs.length, 1)
  assert.strictEqual(specs[0].task_type, 'await_regulator')
  assert.strictEqual(specs[0].is_hard_prerequisite, true)
})

// ── Phase: Completed ──────────────────────────────────────────────────────────

section('Phase: Completed')

test('generates record_completion task (soft)', () => {
  const template = makeTemplate()
  const specs    = svc.deriveTaskSpecs(template, 'Completed')
  assert.strictEqual(specs.length, 1)
  assert.strictEqual(specs[0].task_type, 'record_completion')
  assert.strictEqual(specs[0].is_hard_prerequisite, false)
})

// ── Phase: Blocked ────────────────────────────────────────────────────────────

section('Phase: Blocked')

test('generates resolve_blocker task (soft)', () => {
  const template = makeTemplate()
  const specs    = svc.deriveTaskSpecs(template, 'Blocked')
  assert.strictEqual(specs.length, 1)
  assert.strictEqual(specs[0].task_type, 'resolve_blocker')
  assert.strictEqual(specs[0].is_hard_prerequisite, false)
})

// ── Phase: Not Started ────────────────────────────────────────────────────────

section('Phase: Not Started')

test('generates no tasks for Not Started phase', () => {
  const template = makeTemplate()
  const specs    = svc.deriveTaskSpecs(template, 'Not Started')
  assert.strictEqual(specs.length, 0)
})

// ── Edge cases ────────────────────────────────────────────────────────────────

section('Edge cases')

test('unknown phase returns empty array (no throw)', () => {
  const template = makeTemplate()
  const specs    = svc.deriveTaskSpecs(template, 'Unknown Phase XYZ')
  assert.strictEqual(specs.length, 0)
})

test('many document requirements — all get collect_document tasks', () => {
  const template = makeTemplate({
    document_requirements: [
      { document_type: 'doc1', title: 'Doc 1', is_hard_prerequisite: true },
      { document_type: 'doc2', title: 'Doc 2', is_hard_prerequisite: false },
      { document_type: 'doc3', title: 'Doc 3', is_hard_prerequisite: true },
      { document_type: 'doc4', title: 'Doc 4', is_hard_prerequisite: false },
    ],
  })
  const specs = svc.deriveTaskSpecs(template, 'Drafting & Collection')
  const docs  = specs.filter(s => s.task_type === 'collect_document')
  assert.strictEqual(docs.length, 4)
  assert.strictEqual(specs.length, 5) // 1 prepare_draft + 4 collect_document
})

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(60)}`)
console.log(`Task Generation L1: ${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
