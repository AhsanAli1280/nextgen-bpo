/**
 * L2 Integration Tests — Filing Model (frozen DATABASE_ARCHITECTURE_FINAL §17)
 *
 * Proves the frozen completion sequence:
 *   Workflow Completion → Filing Attempt Recorded → Audit Trail Written → Workflow Status Updated
 *
 * And the frozen filing-history requirement:
 *   "An obligation bounced twice before succeeding has three rows, all preserved,
 *    never overwritten."  (§17)
 *
 * Run: ts-node --project tsconfig.test.json lib/workflow/tests/filing-attempts.test.ts
 */

import assert from 'assert'
import { InMemoryWorkflowDbAdapter, WORKFLOW_SEED } from '../in-memory-workflow-adapter'
import { workflowInstanceService }                   from '../workflow-instance-service'
import { taskAssignmentEngine }                       from '../task-assignment-engine'
import { InMemoryNotificationAdapter }               from '../../notifications/in-memory-notification-adapter'
import type { ObligationRow, WorkflowInstanceRow, WorkflowPhase } from '../types'

let passed = 0
let failed = 0

async function test(name: string, fn: () => Promise<void>): Promise<void> {
  try {
    await fn()
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

const TENANT = WORKFLOW_SEED.TENANT_ID
const USER   = WORKFLOW_SEED.USER_ADMIN
const WF_ID  = WORKFLOW_SEED.WF_DIR_001
const OBL_ID = WORKFLOW_SEED.OBL_DIR_001
const TMPL   = WORKFLOW_SEED.WORKFLOW_TEMPLATES.DIR_001

function seedDb(): InMemoryWorkflowDbAdapter {
  const db = new InMemoryWorkflowDbAdapter()
  const wf: WorkflowInstanceRow = {
    workflow_instance_id: WF_ID,
    obligation_id:        OBL_ID,
    event_instance_id:    null,
    workflow_template_id: TMPL,
    tenant_id:            TENANT,
    current_phase:        'Not Started',
    status:               'draft',
    current_substate:     null,
    substate_entered_at:  new Date(),
    blocked_reason:       null,
    phase_before_block:   null,
    assigned_to_user_id:  USER,
    cancelled_at:         null,
    cancelled_reason:     null,
    created_at:           new Date(),
    completed_at:         null,
    demo_session_id:      null,
    demo_expires_at:      null,
  }
  db.seedWorkflowInstance(wf)
  const obl: ObligationRow = {
    obligation_id:        OBL_ID,
    rule_version_id:      'vvvv0000-0000-0000-0000-000000000001',
    company_id:           WORKFLOW_SEED.ABC_COMPANY_ID,
    tenant_id:            TENANT,
    event_type_id:        'eeee0000-0000-0000-0000-000000000001',
    trigger_date:         new Date(),
    computed_deadline:    new Date(Date.now() + 14 * 86400000),
    status:               'upcoming',
    linked_obligation_id: null,
    assigned_to_user_id:  USER,
    demo_session_id:      null,
    demo_expires_at:      null,
    created_at:           new Date(),
  }
  db.seedObligation(obl)
  return db
}

/** Drive workflow to a completable state (all hard prereqs done). */
async function driveToCompletable(db: InMemoryWorkflowDbAdapter, notifier: InMemoryNotificationAdapter): Promise<void> {
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  const phases: WorkflowPhase[] = ['Drafting & Collection', 'Internal Approval', 'Filing Submitted', 'Regulator Review']
  for (const phase of phases) {
    const r = await workflowInstanceService.advancePhase(WF_ID, phase, USER, db, notifier)
    for (const t of r.generatedTasks.filter(t => t.is_hard_prerequisite)) {
      await taskAssignmentEngine.startTask(t.task_id, USER, db)
      await taskAssignmentEngine.completeTask(t.task_id, USER, db)
    }
  }
}

async function main(): Promise<void> {

// ── Sequence ──────────────────────────────────────────────────────────────────

section('Frozen completion sequence: filing → audit → status')

await test('completion records a filing_attempts row', async () => {
  const db = seedDb(); const n = new InMemoryNotificationAdapter()
  await driveToCompletable(db, n)
  await workflowInstanceService.completeWorkflow(
    WF_ID, { filing_channel: 'eZfile', reference_number: 'SECP-2026-001', outcome: 'accepted' }, USER, db
  )
  const attempts = await db.loadFilingAttempts(OBL_ID)
  assert.strictEqual(attempts.length, 1)
  assert.strictEqual(attempts[0].reference_number, 'SECP-2026-001')
  assert.strictEqual(attempts[0].filing_channel, 'eZfile')
  assert.strictEqual(attempts[0].workflow_instance_id, WF_ID)
})

await test('audit trail references the recorded filing attempt id', async () => {
  const db = seedDb(); const n = new InMemoryNotificationAdapter()
  await driveToCompletable(db, n)
  await workflowInstanceService.completeWorkflow(
    WF_ID, { filing_channel: 'eZfile', reference_number: 'REF-9', outcome: 'accepted' }, USER, db
  )
  const attempts = await db.loadFilingAttempts(OBL_ID)
  const logs     = await db.getAuditLog('workflow_instance', WF_ID)
  const completed = logs.find(l => l.event_type === 'workflow_completed')
  assert.ok(completed, 'workflow_completed audit row exists')
  assert.strictEqual(completed!.metadata['filing_attempt_id'], attempts[0].filing_attempt_id)
  assert.strictEqual(completed!.metadata['reference_number'], 'REF-9')
})

await test('workflow status updated to completed, obligation filed', async () => {
  const db = seedDb(); const n = new InMemoryNotificationAdapter()
  await driveToCompletable(db, n)
  await workflowInstanceService.completeWorkflow(
    WF_ID, { filing_channel: 'eZfile', outcome: 'accepted' }, USER, db
  )
  const wf  = await db.loadWorkflowInstance(WF_ID)
  const obl = await db.loadObligation(OBL_ID)
  assert.strictEqual(wf.status, 'completed')
  assert.strictEqual(wf.current_phase, 'Completed')
  assert.strictEqual(obl.status, 'filed')
})

// ── Filing history preserved (§17 bounced-twice = 3 rows) ──────────────────────

section('Filing history preserved — append-only')

await test('prior bounced attempts preserved; final accepted = 3 rows total', async () => {
  const db = seedDb(); const n = new InMemoryNotificationAdapter()
  await driveToCompletable(db, n)

  // Two prior bounced attempts recorded during Filing/Regulator phases
  await db.createFilingAttempt({
    obligation_id: OBL_ID, workflow_instance_id: WF_ID, filing_channel: 'eZfile',
    reference_number: null, outcome: 'rejected', outcome_reason: 'wrong form version', filed_by_user_id: USER,
  })
  await db.createFilingAttempt({
    obligation_id: OBL_ID, workflow_instance_id: WF_ID, filing_channel: 'eZfile',
    reference_number: null, outcome: 'queries_raised', outcome_reason: 'missing annexure', filed_by_user_id: USER,
  })

  // Final accepted attempt via completion
  await workflowInstanceService.completeWorkflow(
    WF_ID, { filing_channel: 'physical', reference_number: 'FINAL-OK', outcome: 'accepted' }, USER, db
  )

  const attempts = await db.loadFilingAttempts(OBL_ID)
  assert.strictEqual(attempts.length, 3, 'all three attempts preserved')
  assert.deepStrictEqual(
    attempts.map(a => a.attempt_number), [1, 2, 3], 'attempt_number monotonic'
  )
  assert.deepStrictEqual(
    attempts.map(a => a.outcome), ['rejected', 'queries_raised', 'accepted']
  )
  assert.strictEqual(attempts[2].reference_number, 'FINAL-OK')
})

await test('rejected filing does NOT mark obligation filed', async () => {
  const db = seedDb(); const n = new InMemoryNotificationAdapter()
  await driveToCompletable(db, n)
  await workflowInstanceService.completeWorkflow(
    WF_ID, { filing_channel: 'eZfile', outcome: 'rejected', outcome_reason: 'bounced' }, USER, db
  )
  const obl = await db.loadObligation(OBL_ID)
  const wf  = await db.loadWorkflowInstance(WF_ID)
  assert.notStrictEqual(obl.status, 'filed', 'obligation must NOT be filed on rejected outcome')
  assert.strictEqual(wf.status, 'completed', 'workflow still completes')
  const attempts = await db.loadFilingAttempts(OBL_ID)
  assert.strictEqual(attempts.length, 1)
  assert.strictEqual(attempts[0].outcome, 'rejected')
})

await test('completion without filing input records no attempt (placeholder workflows)', async () => {
  const db = seedDb(); const n = new InMemoryNotificationAdapter()
  await driveToCompletable(db, n)
  await workflowInstanceService.completeWorkflow(WF_ID, null, USER, db)
  const attempts = await db.loadFilingAttempts(OBL_ID)
  assert.strictEqual(attempts.length, 0)
  const wf = await db.loadWorkflowInstance(WF_ID)
  assert.strictEqual(wf.status, 'completed')
})

await test('current filing attempt pointer set to latest recorded attempt', async () => {
  const db = seedDb(); const n = new InMemoryNotificationAdapter()
  await driveToCompletable(db, n)
  await workflowInstanceService.completeWorkflow(
    WF_ID, { filing_channel: 'eZfile', reference_number: 'PTR-1', outcome: 'accepted' }, USER, db
  )
  const attempts = await db.loadFilingAttempts(OBL_ID)
  assert.strictEqual(db.obligationCurrentFiling.get(OBL_ID), attempts[0].filing_attempt_id)
})

console.log(`\n${'─'.repeat(60)}`)
console.log(`Filing Attempt Tests: ${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)

} // end main()

main().catch(err => {
  console.error('Test runner error:', err)
  process.exit(1)
})
