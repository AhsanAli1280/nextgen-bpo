/**
 * L1 + L2 Tests — WorkflowInstanceService + TaskAssignmentEngine
 *
 * L1: State machine guard functions (pure logic)
 * L2: WF-01 through WF-06 integration scenarios using InMemoryWorkflowDbAdapter
 *
 * Run: ts-node --project tsconfig.test.json lib/workflow/tests/workflow-service.test.ts
 */

import assert from 'assert'
import { InMemoryWorkflowDbAdapter, WORKFLOW_SEED } from '../in-memory-workflow-adapter'
import { workflowInstanceService }                   from '../workflow-instance-service'
import { taskAssignmentEngine }                      from '../task-assignment-engine'
import { InMemoryNotificationAdapter }               from '../../notifications/in-memory-notification-adapter'
import type { ObligationRow, WorkflowInstanceRow }   from '../types'
import {
  InvalidWorkflowTransition,
  InvalidPhaseTransition,
  PhaseAdvanceBlocked,
  CannotRevertFromFirstPhase,
} from '../types'

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

// ── Fixtures ──────────────────────────────────────────────────────────────────

const TENANT = WORKFLOW_SEED.TENANT_ID
const USER   = WORKFLOW_SEED.USER_ADMIN
const WF_ID  = WORKFLOW_SEED.WF_DIR_001
const OBL_ID = WORKFLOW_SEED.OBL_DIR_001
const TMPL   = WORKFLOW_SEED.WORKFLOW_TEMPLATES.DIR_001

function makeWorkflowInstance(overrides: Partial<WorkflowInstanceRow> = {}): WorkflowInstanceRow {
  return {
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
    ...overrides,
  }
}

function makeObligation(): ObligationRow {
  return {
    obligation_id:        OBL_ID,
    rule_version_id:      'vvvv0000-0000-0000-0000-000000000001',
    company_id:           WORKFLOW_SEED.ABC_COMPANY_ID,
    tenant_id:            TENANT,
    event_type_id:        'eeee0000-0000-0000-0000-000000000001',
    trigger_date:         new Date('2026-01-15'),
    computed_deadline:    new Date('2026-02-14'),
    status:               'upcoming',
    linked_obligation_id: null,
    assigned_to_user_id:  USER,
    demo_session_id:      null,
    demo_expires_at:      null,
    created_at:           new Date(),
  }
}

function freshAdapter(): InMemoryWorkflowDbAdapter {
  const db = new InMemoryWorkflowDbAdapter()
  db.seedWorkflowInstance(makeWorkflowInstance())
  db.seedObligation(makeObligation())
  return db
}

// ── Test runner entry ─────────────────────────────────────────────────────────

async function main(): Promise<void> {

// ── L1: State machine guard tests ────────────────────────────────────────────

section('L1: Workflow state machine guards')

await test('initializeWorkflow sets status=draft and phase=Not Started', async () => {
  const db       = freshAdapter()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  const wf = await db.loadWorkflowInstance(WF_ID)
  assert.strictEqual(wf.status,        'draft')
  assert.strictEqual(wf.current_phase, 'Not Started')
})

await test('initializeWorkflow is idempotent', async () => {
  const db = freshAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  const wf = await db.loadWorkflowInstance(WF_ID)
  assert.strictEqual(wf.status, 'draft')
  const phaseHistory = db.phaseHistory.filter(h => h.workflow_instance_id === WF_ID)
  assert.ok(phaseHistory.length >= 1, 'at least one phase history entry')
})

await test('initializeWorkflow writes workflow_created audit row', async () => {
  const db = freshAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  const auditLogs = await db.getAuditLog('workflow_instance', WF_ID)
  const created   = auditLogs.find(l => l.event_type === 'workflow_created')
  assert.ok(created, 'workflow_created audit event not found')
  assert.strictEqual(created!.to_state, 'draft')
})

await test('advancePhase from Not Started → first active phase sets status=active', async () => {
  const db       = freshAdapter()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  await workflowInstanceService.advancePhase(WF_ID, 'Drafting & Collection', USER, db, notifier)
  const wf = await db.loadWorkflowInstance(WF_ID)
  assert.strictEqual(wf.status,        'active')
  assert.strictEqual(wf.current_phase, 'Drafting & Collection')
})

await test('advancePhase to wrong next phase throws InvalidPhaseTransition', async () => {
  const db       = freshAdapter()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  await assert.rejects(
    () => workflowInstanceService.advancePhase(WF_ID, 'Filing Submitted', USER, db, notifier),
    InvalidPhaseTransition
  )
})

await test('advancePhase on completed workflow throws InvalidWorkflowTransition', async () => {
  const db = freshAdapter()
  db.seedWorkflowInstance(makeWorkflowInstance({ status: 'completed', current_phase: 'Completed' }))
  const notifier = new InMemoryNotificationAdapter()
  await assert.rejects(
    () => workflowInstanceService.advancePhase(WF_ID, 'Drafting & Collection', USER, db, notifier),
    InvalidWorkflowTransition
  )
})

await test('advancePhase on blocked workflow throws InvalidWorkflowTransition', async () => {
  const db = freshAdapter()
  db.seedWorkflowInstance(makeWorkflowInstance({
    status: 'blocked', current_phase: 'Blocked',
    phase_before_block: 'Drafting & Collection',
  }))
  const notifier = new InMemoryNotificationAdapter()
  await assert.rejects(
    () => workflowInstanceService.advancePhase(WF_ID, 'Drafting & Collection', USER, db, notifier),
    InvalidWorkflowTransition
  )
})

await test('blockWorkflow on draft workflow throws InvalidWorkflowTransition', async () => {
  const db = freshAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  const notifier = new InMemoryNotificationAdapter()
  await assert.rejects(
    () => workflowInstanceService.blockWorkflow(WF_ID, 'test reason', USER, db, notifier),
    InvalidWorkflowTransition
  )
})

await test('blockWorkflow requires reason string', async () => {
  const db = freshAdapter()
  db.seedWorkflowInstance(makeWorkflowInstance({ status: 'active', current_phase: 'Drafting & Collection' }))
  const notifier = new InMemoryNotificationAdapter()
  await assert.rejects(
    () => workflowInstanceService.blockWorkflow(WF_ID, '', USER, db, notifier)
  )
})

await test('cancelWorkflow requires reason string', async () => {
  const db = freshAdapter()
  await assert.rejects(
    () => workflowInstanceService.cancelWorkflow(WF_ID, '', USER, db)
  )
})

await test('cancelWorkflow on completed workflow throws', async () => {
  const db = freshAdapter()
  db.seedWorkflowInstance(makeWorkflowInstance({ status: 'completed', current_phase: 'Completed' }))
  await assert.rejects(
    () => workflowInstanceService.cancelWorkflow(WF_ID, 'reason', USER, db),
    InvalidWorkflowTransition
  )
})

// ── L1: Task state machine guards ─────────────────────────────────────────────

section('L1: Task state machine guards')

await test('startTask from pending transitions to in_progress', async () => {
  const db       = freshAdapter()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  const { generatedTasks } = await workflowInstanceService.advancePhase(
    WF_ID, 'Drafting & Collection', USER, db, notifier
  )
  const task = generatedTasks.find(t => t.task_type === 'prepare_draft')!
  await taskAssignmentEngine.startTask(task.task_id, USER, db)
  const updated = await db.loadTask(task.task_id)
  assert.strictEqual(updated.status, 'in_progress')
})

await test('completeTask from in_progress transitions to completed', async () => {
  const db       = freshAdapter()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  const { generatedTasks } = await workflowInstanceService.advancePhase(
    WF_ID, 'Drafting & Collection', USER, db, notifier
  )
  const task = generatedTasks.find(t => t.task_type === 'prepare_draft')!
  await taskAssignmentEngine.startTask(task.task_id, USER, db)
  await taskAssignmentEngine.completeTask(task.task_id, USER, db)
  const updated = await db.loadTask(task.task_id)
  assert.strictEqual(updated.status, 'completed')
  assert.ok(updated.completed_at, 'completed_at should be set')
})

await test('rejectTask from completed transitions to rejected (reason required)', async () => {
  const db       = freshAdapter()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  const { generatedTasks } = await workflowInstanceService.advancePhase(
    WF_ID, 'Drafting & Collection', USER, db, notifier
  )
  const task = generatedTasks.find(t => t.task_type === 'prepare_draft')!
  await taskAssignmentEngine.startTask(task.task_id, USER, db)
  await taskAssignmentEngine.completeTask(task.task_id, USER, db)
  await taskAssignmentEngine.rejectTask(task.task_id, 'Incomplete content', USER, db, notifier)
  const updated = await db.loadTask(task.task_id)
  assert.strictEqual(updated.status, 'rejected')
})

await test('rejectTask without reason throws ReasonRequired', async () => {
  const db       = freshAdapter()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  const { generatedTasks } = await workflowInstanceService.advancePhase(
    WF_ID, 'Drafting & Collection', USER, db, notifier
  )
  const task = generatedTasks.find(t => t.task_type === 'prepare_draft')!
  await taskAssignmentEngine.startTask(task.task_id, USER, db)
  await taskAssignmentEngine.completeTask(task.task_id, USER, db)
  await assert.rejects(
    () => taskAssignmentEngine.rejectTask(task.task_id, '', USER, db, notifier)
  )
})

await test('reopenTask from rejected → reopened, unassigned (OQ-9)', async () => {
  const db       = freshAdapter()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  const { generatedTasks } = await workflowInstanceService.advancePhase(
    WF_ID, 'Drafting & Collection', USER, db, notifier
  )
  const task = generatedTasks.find(t => t.task_type === 'prepare_draft')!
  await taskAssignmentEngine.startTask(task.task_id, USER, db)
  await taskAssignmentEngine.completeTask(task.task_id, USER, db)
  await taskAssignmentEngine.rejectTask(task.task_id, 'Wrong format', USER, db, notifier)
  await taskAssignmentEngine.reopenTask(task.task_id, 'Needs rework', USER, db)
  const updated = await db.loadTask(task.task_id)
  assert.strictEqual(updated.status, 'reopened')
  assert.strictEqual(updated.assigned_to_user_id, null, 'reopened task must reset to unassigned')
})

// ── WF-01: Director Resignation full phase walk ───────────────────────────────

section('WF-01: Director Resignation — full phase walk')

await test('WF-01: full phase walk completes without errors', async () => {
  const db       = freshAdapter()
  const notifier = new InMemoryNotificationAdapter()

  await workflowInstanceService.initializeWorkflow(WF_ID, db)

  // Drafting & Collection
  const r1 = await workflowInstanceService.advancePhase(WF_ID, 'Drafting & Collection', USER, db, notifier)
  assert.ok(r1.generatedTasks.length > 0, 'should generate tasks for Drafting & Collection')

  // Complete all hard-prerequisite tasks so we can advance
  for (const task of r1.generatedTasks) {
    if (task.task_type === 'record_completion') continue
    await taskAssignmentEngine.startTask(task.task_id, USER, db)
    await taskAssignmentEngine.completeTask(task.task_id, USER, db)
  }

  // Internal Approval (DIR_001 template has board_resolution)
  const r2 = await workflowInstanceService.advancePhase(WF_ID, 'Internal Approval', USER, db, notifier)
  assert.ok(r2.generatedTasks.some(t => t.task_type === 'board_resolution'))

  // Complete board_resolution
  for (const task of r2.generatedTasks.filter(t => t.is_hard_prerequisite)) {
    await taskAssignmentEngine.startTask(task.task_id, USER, db)
    await taskAssignmentEngine.completeTask(task.task_id, USER, db)
  }

  // Filing Submitted
  const r3 = await workflowInstanceService.advancePhase(WF_ID, 'Filing Submitted', USER, db, notifier)
  assert.ok(r3.generatedTasks.some(t => t.task_type === 'submit_filing'))

  // Complete submit_filing
  const submitTask = r3.generatedTasks.find(t => t.task_type === 'submit_filing')!
  await taskAssignmentEngine.startTask(submitTask.task_id, USER, db)
  await taskAssignmentEngine.completeTask(submitTask.task_id, USER, db)

  // Regulator Review
  const r4 = await workflowInstanceService.advancePhase(WF_ID, 'Regulator Review', USER, db, notifier)
  assert.ok(r4.generatedTasks.some(t => t.task_type === 'await_regulator'))

  // Complete await_regulator
  const regulatorTask = r4.generatedTasks.find(t => t.task_type === 'await_regulator')!
  await taskAssignmentEngine.startTask(regulatorTask.task_id, USER, db)
  await taskAssignmentEngine.completeTask(regulatorTask.task_id, USER, db)

  // Complete workflow
  await workflowInstanceService.completeWorkflow(
    WF_ID, { filing_channel: 'eZfile', reference_number: 'fa-test-001', outcome: 'accepted' }, USER, db
  )

  const final = await db.loadWorkflowInstance(WF_ID)
  assert.strictEqual(final.status,        'completed')
  assert.strictEqual(final.current_phase, 'Completed')
  assert.ok(final.completed_at,           'completed_at must be set')
})

await test('WF-01: obligation.status set to filed after complete with filingAttemptId', async () => {
  const db       = freshAdapter()
  const notifier = new InMemoryNotificationAdapter()

  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  const r1 = await workflowInstanceService.advancePhase(WF_ID, 'Drafting & Collection', USER, db, notifier)
  for (const t of r1.generatedTasks.filter(t => t.is_hard_prerequisite)) {
    await taskAssignmentEngine.startTask(t.task_id, USER, db)
    await taskAssignmentEngine.completeTask(t.task_id, USER, db)
  }
  const r2 = await workflowInstanceService.advancePhase(WF_ID, 'Internal Approval', USER, db, notifier)
  for (const t of r2.generatedTasks.filter(t => t.is_hard_prerequisite)) {
    await taskAssignmentEngine.startTask(t.task_id, USER, db)
    await taskAssignmentEngine.completeTask(t.task_id, USER, db)
  }
  const r3 = await workflowInstanceService.advancePhase(WF_ID, 'Filing Submitted', USER, db, notifier)
  for (const t of r3.generatedTasks.filter(t => t.is_hard_prerequisite)) {
    await taskAssignmentEngine.startTask(t.task_id, USER, db)
    await taskAssignmentEngine.completeTask(t.task_id, USER, db)
  }
  const r4 = await workflowInstanceService.advancePhase(WF_ID, 'Regulator Review', USER, db, notifier)
  for (const t of r4.generatedTasks.filter(t => t.is_hard_prerequisite)) {
    await taskAssignmentEngine.startTask(t.task_id, USER, db)
    await taskAssignmentEngine.completeTask(t.task_id, USER, db)
  }

  await workflowInstanceService.completeWorkflow(
    WF_ID, { filing_channel: 'eZfile', reference_number: 'filing-001', outcome: 'accepted' }, USER, db
  )
  const obl = await db.loadObligation(OBL_ID)
  assert.strictEqual(obl.status, 'filed', 'obligation must be filed')

  // Filing history preserved (frozen §17)
  const attempts = await db.loadFilingAttempts(OBL_ID)
  assert.strictEqual(attempts.length, 1, 'exactly one filing attempt recorded')
  assert.strictEqual(attempts[0].attempt_number, 1)
  assert.strictEqual(attempts[0].reference_number, 'filing-001')
  assert.strictEqual(attempts[0].outcome, 'accepted')
  assert.strictEqual(attempts[0].filed_by_user_id, USER)
  assert.ok(attempts[0].outcome_recorded_at, 'outcome_recorded_at set for accepted')
})

// ── WF-02: AGM workflow with approval_requirement_type = none ─────────────────

section('WF-02: AGM-002 — no Internal Approval phase')

await test('WF-02: AGM workflow skips Internal Approval phase', async () => {
  const WF2 = 'ffff0009-0000-0000-0000-000000000001'
  const OBL2 = 'oooo0009-0000-0000-0000-000000000001'
  const db   = new InMemoryWorkflowDbAdapter()
  db.seedWorkflowInstance({
    workflow_instance_id: WF2,
    obligation_id:        OBL2,
    event_instance_id:    null,
    workflow_template_id: WORKFLOW_SEED.WORKFLOW_TEMPLATES.AGM_002,
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
  })
  db.seedObligation({
    obligation_id:        OBL2,
    rule_version_id:      'vvvv0000-0000-0000-0000-000000000009',
    company_id:           WORKFLOW_SEED.ABC_COMPANY_ID,
    tenant_id:            TENANT,
    event_type_id:        null,
    trigger_date:         new Date('2026-07-01'),
    computed_deadline:    new Date('2026-10-29'),
    status:               'upcoming',
    linked_obligation_id: null,
    assigned_to_user_id:  USER,
    demo_session_id:      null,
    demo_expires_at:      null,
    created_at:           new Date(),
  })

  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF2, db)
  const r1 = await workflowInstanceService.advancePhase(WF2, 'Drafting & Collection', USER, db, notifier)

  // AGM_002 template active_phases = ['Drafting & Collection', 'Filing Submitted']
  // so next after Drafting & Collection should be Filing Submitted (not Internal Approval)
  for (const t of r1.generatedTasks.filter(t => t.is_hard_prerequisite)) {
    await taskAssignmentEngine.startTask(t.task_id, USER, db)
    await taskAssignmentEngine.completeTask(t.task_id, USER, db)
  }

  // Next phase must be Filing Submitted (Internal Approval skipped in template)
  const r2 = await workflowInstanceService.advancePhase(WF2, 'Filing Submitted', USER, db, notifier)
  assert.ok(r2.generatedTasks.some(t => t.task_type === 'submit_filing'), 'should have submit_filing')
  assert.strictEqual(r2.workflowInstance.current_phase, 'Filing Submitted')
})

// ── WF-03: Block → Unblock ────────────────────────────────────────────────────

section('WF-03: Block and Unblock')

await test('WF-03: blockWorkflow stores phase_before_block', async () => {
  const db       = freshAdapter()
  const notifier = new InMemoryNotificationAdapter()
  db.seedWorkflowInstance(makeWorkflowInstance({ status: 'active', current_phase: 'Drafting & Collection' }))
  await workflowInstanceService.blockWorkflow(WF_ID, 'Missing document from client', USER, db, notifier)
  const wf = await db.loadWorkflowInstance(WF_ID)
  assert.strictEqual(wf.status,             'blocked')
  assert.strictEqual(wf.current_phase,      'Blocked')
  assert.strictEqual(wf.phase_before_block, 'Drafting & Collection')
  assert.strictEqual(wf.blocked_reason,     'Missing document from client')
})

await test('WF-03: unblockWorkflow restores phase_before_block', async () => {
  const db       = freshAdapter()
  const notifier = new InMemoryNotificationAdapter()
  db.seedWorkflowInstance(makeWorkflowInstance({ status: 'active', current_phase: 'Drafting & Collection' }))
  await workflowInstanceService.blockWorkflow(WF_ID, 'Missing document', USER, db, notifier)
  await workflowInstanceService.unblockWorkflow(WF_ID, USER, db)
  const wf = await db.loadWorkflowInstance(WF_ID)
  assert.strictEqual(wf.status,             'active')
  assert.strictEqual(wf.current_phase,      'Drafting & Collection')
  assert.strictEqual(wf.blocked_reason,     null)
  assert.strictEqual(wf.phase_before_block, null)
})

await test('WF-03: block generates resolve_blocker task', async () => {
  const db       = freshAdapter()
  const notifier = new InMemoryNotificationAdapter()
  db.seedWorkflowInstance(makeWorkflowInstance({ status: 'active', current_phase: 'Drafting & Collection' }))
  await workflowInstanceService.blockWorkflow(WF_ID, 'Blocked', USER, db, notifier)
  const tasks = await db.loadTasksForPhase(WF_ID, 'Blocked')
  assert.ok(tasks.some(t => t.task_type === 'resolve_blocker'), 'resolve_blocker task should exist')
})

await test('WF-03: audit log has workflow_blocked event', async () => {
  const db       = freshAdapter()
  const notifier = new InMemoryNotificationAdapter()
  db.seedWorkflowInstance(makeWorkflowInstance({ status: 'active', current_phase: 'Drafting & Collection' }))
  await workflowInstanceService.blockWorkflow(WF_ID, 'Blocker reason', USER, db, notifier)
  const logs = await db.getAuditLog('workflow_instance', WF_ID)
  assert.ok(logs.some(l => l.event_type === 'workflow_blocked'), 'workflow_blocked audit entry required')
})

// ── WF-04: Hard prerequisite blocks phase advance ─────────────────────────────

section('WF-04: Hard prerequisite blocks advancePhase')

await test('WF-04: advancePhase throws PhaseAdvanceBlocked when hard task not completed', async () => {
  const db       = freshAdapter()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  await workflowInstanceService.advancePhase(WF_ID, 'Drafting & Collection', USER, db, notifier)
  // Do NOT complete any tasks — hard prerequisite tasks remain pending
  await assert.rejects(
    () => workflowInstanceService.advancePhase(WF_ID, 'Internal Approval', USER, db, notifier),
    PhaseAdvanceBlocked
  )
})

// ── WF-05: Soft task can be skipped (cancel) and phase still advances ─────────

section('WF-05: Soft task bypass')

await test('WF-05: cancelling soft task allows phase advance if hard tasks complete', async () => {
  const db       = freshAdapter()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  const r1 = await workflowInstanceService.advancePhase(WF_ID, 'Drafting & Collection', USER, db, notifier)

  const prepDraft = r1.generatedTasks.find(t => t.task_type === 'prepare_draft')! // soft
  const hardTasks = r1.generatedTasks.filter(t => t.is_hard_prerequisite)

  // Cancel the soft task
  await taskAssignmentEngine.cancelTask(prepDraft.task_id, 'Not needed', db)

  // Complete hard tasks
  for (const t of hardTasks) {
    await taskAssignmentEngine.startTask(t.task_id, USER, db)
    await taskAssignmentEngine.completeTask(t.task_id, USER, db)
  }

  // Phase advance should succeed
  const r2 = await workflowInstanceService.advancePhase(WF_ID, 'Internal Approval', USER, db, notifier)
  assert.strictEqual(r2.workflowInstance.current_phase, 'Internal Approval')
})

// ── WF-06: Task manual reassignment audit ─────────────────────────────────────

section('WF-06: Task reassignment audit')

await test('WF-06: assignTask writes task_assigned audit entry', async () => {
  const db       = freshAdapter()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  const { generatedTasks } = await workflowInstanceService.advancePhase(
    WF_ID, 'Drafting & Collection', USER, db, notifier
  )
  const task = generatedTasks[0]
  await taskAssignmentEngine.assignTask(task.task_id, WORKFLOW_SEED.USER_MEMBER, USER, db, notifier)
  const logs = await db.getAuditLog('task', task.task_id)
  assert.ok(
    logs.some(l => l.event_type === 'task_assigned' || l.event_type === 'task_reassigned'),
    'task_assigned or task_reassigned audit entry required'
  )
})

await test('WF-06: reassignTask records old and new assignee in metadata', async () => {
  const db       = freshAdapter()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  const { generatedTasks } = await workflowInstanceService.advancePhase(
    WF_ID, 'Drafting & Collection', USER, db, notifier
  )
  const task = generatedTasks[0]

  // First assign
  await taskAssignmentEngine.assignTask(task.task_id, WORKFLOW_SEED.USER_MEMBER, USER, db, notifier)
  // Reassign to owner
  await taskAssignmentEngine.assignTask(task.task_id, WORKFLOW_SEED.USER_OWNER, USER, db, notifier)

  const logs = await db.getAuditLog('task', task.task_id)
  const reassign = logs.find(l => l.event_type === 'task_reassigned')
  assert.ok(reassign, 'task_reassigned audit entry required')
  assert.ok(reassign!.metadata['removed_from_user_id'], 'should record old assignee')
  assert.ok(reassign!.metadata['assigned_to_user_id'],  'should record new assignee')
})

// ── WF-12: date-driven workflow (no event_instance_id) ────────────────────────

section('WF-12: Date-driven workflow traceability')

await test('WF-12: date_driven workflow has obligation_id but null event_instance_id', async () => {
  const WF12 = 'ffff0012-0000-0000-0000-000000000001'
  const OBL12 = 'oooo0012-0000-0000-0000-000000000001'
  const db    = new InMemoryWorkflowDbAdapter()
  db.seedWorkflowInstance({
    workflow_instance_id: WF12,
    obligation_id:        OBL12,   // obligation exists
    event_instance_id:    null,    // no event — date_driven
    workflow_template_id: WORKFLOW_SEED.WORKFLOW_TEMPLATES.ANNRET_001,
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
  })
  db.seedObligation({
    obligation_id:        OBL12,
    rule_version_id:      'vvvv0000-0000-0000-0000-000000000010',
    company_id:           WORKFLOW_SEED.ABC_COMPANY_ID,
    tenant_id:            TENANT,
    event_type_id:        null,           // date_driven — no event type
    trigger_date:         new Date('2026-07-01'),
    computed_deadline:    new Date('2026-08-29'),
    status:               'upcoming',
    linked_obligation_id: null,
    assigned_to_user_id:  USER,
    demo_session_id:      null,
    demo_expires_at:      null,
    created_at:           new Date(),
  })

  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF12, db)
  const r1 = await workflowInstanceService.advancePhase(WF12, 'Drafting & Collection', USER, db, notifier)

  const wf = await db.loadWorkflowInstance(WF12)
  assert.strictEqual(wf.event_instance_id, null, 'event_instance_id must be null for date_driven')
  assert.strictEqual(wf.obligation_id, OBL12, 'obligation_id must be set')
  assert.ok(r1.generatedTasks.length > 0)
})

// ── Cancel workflow cascade ───────────────────────────────────────────────────

section('Workflow cancel cascade')

await test('cancelWorkflow cancels all non-terminal tasks', async () => {
  const db       = freshAdapter()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  const r1 = await workflowInstanceService.advancePhase(WF_ID, 'Drafting & Collection', USER, db, notifier)
  assert.ok(r1.generatedTasks.length > 0)

  await workflowInstanceService.cancelWorkflow(WF_ID, 'Event voided', USER, db)

  const allTasks = await db.loadTasksForWorkflow(WF_ID)
  const nonCancelled = allTasks.filter(t => t.status !== 'cancelled' && t.status !== 'completed')
  assert.strictEqual(nonCancelled.length, 0, 'all non-terminal tasks must be cancelled')
  const wf = await db.loadWorkflowInstance(WF_ID)
  assert.strictEqual(wf.status, 'cancelled')
})

// ── revertPhase ───────────────────────────────────────────────────────────────

section('Phase revert (OQ-2)')

await test('revertPhase from Internal Approval → Drafting & Collection', async () => {
  const db       = freshAdapter()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  const r1 = await workflowInstanceService.advancePhase(WF_ID, 'Drafting & Collection', USER, db, notifier)
  for (const t of r1.generatedTasks.filter(t => t.is_hard_prerequisite)) {
    await taskAssignmentEngine.startTask(t.task_id, USER, db)
    await taskAssignmentEngine.completeTask(t.task_id, USER, db)
  }
  await workflowInstanceService.advancePhase(WF_ID, 'Internal Approval', USER, db, notifier)

  const r = await workflowInstanceService.revertPhase(WF_ID, 'Filing rejected', USER, db)
  assert.strictEqual(r.workflowInstance.current_phase, 'Drafting & Collection')
  assert.strictEqual(r.workflowInstance.status, 'active')
})

await test('revertPhase from first phase throws CannotRevertFromFirstPhase', async () => {
  const db       = freshAdapter()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  await workflowInstanceService.advancePhase(WF_ID, 'Drafting & Collection', USER, db, notifier)
  await assert.rejects(
    () => workflowInstanceService.revertPhase(WF_ID, 'reason', USER, db),
    CannotRevertFromFirstPhase
  )
})

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(60)}`)
console.log(`Workflow Service Tests: ${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)

} // end main()

main().catch(err => {
  console.error('Test runner error:', err)
  process.exit(1)
})
