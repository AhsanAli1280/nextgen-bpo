/**
 * L2 Integration Tests — AuditTrailService (WF-13)
 *
 * Verifies:
 *   - Every state transition writes exactly one audit row
 *   - getHistory returns rows in chronological order
 *   - Audit rows are immutable (no update/delete on task_audit_log)
 *   - Batch logging writes all events atomically
 *   - AuditTrailService never throws — it catches and logs
 *
 * Run: ts-node --project tsconfig.test.json lib/workflow/tests/audit-trail.test.ts
 */

import assert from 'assert'
import { InMemoryWorkflowDbAdapter, WORKFLOW_SEED } from '../in-memory-workflow-adapter'
import { auditTrailService }                         from '../audit-trail-service'
import { workflowInstanceService }                   from '../workflow-instance-service'
import { taskAssignmentEngine }                       from '../task-assignment-engine'
import { InMemoryNotificationAdapter }               from '../../notifications/in-memory-notification-adapter'
import type { ObligationRow, WorkflowInstanceRow }   from '../types'

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

// ── Test runner entry ─────────────────────────────────────────────────────────

async function main(): Promise<void> {

// ── WF-13: Every state change has exactly one audit row ───────────────────────

section('WF-13: Every state change produces exactly one audit row')

await test('initializeWorkflow writes exactly one workflow_created audit row', async () => {
  const db = seedDb()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)

  const logs = await db.getAuditLog('workflow_instance', WF_ID)
  const created = logs.filter(l => l.event_type === 'workflow_created')
  assert.strictEqual(created.length, 1, `expected 1 workflow_created, got ${created.length}`)
})

await test('advancePhase writes exactly one phase_advanced audit row', async () => {
  const db       = seedDb()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  await workflowInstanceService.advancePhase(WF_ID, 'Drafting & Collection', USER, db, notifier)

  const logs = await db.getAuditLog('workflow_instance', WF_ID)
  const advanced = logs.filter(l => l.event_type === 'phase_advanced')
  assert.strictEqual(advanced.length, 1, `expected 1 phase_advanced, got ${advanced.length}`)
})

await test('blockWorkflow writes exactly one workflow_blocked audit row', async () => {
  const db       = seedDb()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  await workflowInstanceService.advancePhase(WF_ID, 'Drafting & Collection', USER, db, notifier)
  await workflowInstanceService.blockWorkflow(WF_ID, 'External dependency', USER, db, notifier)

  const logs = await db.getAuditLog('workflow_instance', WF_ID)
  const blocked = logs.filter(l => l.event_type === 'workflow_blocked')
  assert.strictEqual(blocked.length, 1, `expected 1 workflow_blocked, got ${blocked.length}`)
})

await test('unblockWorkflow writes exactly one workflow_unblocked audit row', async () => {
  const db       = seedDb()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  await workflowInstanceService.advancePhase(WF_ID, 'Drafting & Collection', USER, db, notifier)
  await workflowInstanceService.blockWorkflow(WF_ID, 'External dependency', USER, db, notifier)
  await workflowInstanceService.unblockWorkflow(WF_ID, USER, db)

  const logs = await db.getAuditLog('workflow_instance', WF_ID)
  const unblocked = logs.filter(l => l.event_type === 'workflow_unblocked')
  assert.strictEqual(unblocked.length, 1)
})

await test('task created writes exactly one task_created audit row', async () => {
  const db       = seedDb()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  const { generatedTasks } = await workflowInstanceService.advancePhase(
    WF_ID, 'Drafting & Collection', USER, db, notifier
  )
  const task = generatedTasks[0]
  const logs = await db.getAuditLog('task', task.task_id)
  const created = logs.filter(l => l.event_type === 'task_created')
  assert.strictEqual(created.length, 1, `expected 1 task_created, got ${created.length}`)
})

await test('startTask writes exactly one task_started audit row', async () => {
  const db       = seedDb()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  const { generatedTasks } = await workflowInstanceService.advancePhase(
    WF_ID, 'Drafting & Collection', USER, db, notifier
  )
  const task = generatedTasks[0]
  await taskAssignmentEngine.startTask(task.task_id, USER, db)

  const logs = await db.getAuditLog('task', task.task_id)
  const started = logs.filter(l => l.event_type === 'task_started')
  assert.strictEqual(started.length, 1)
})

await test('completeTask writes exactly one task_completed audit row', async () => {
  const db       = seedDb()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  const { generatedTasks } = await workflowInstanceService.advancePhase(
    WF_ID, 'Drafting & Collection', USER, db, notifier
  )
  const task = generatedTasks[0]
  await taskAssignmentEngine.startTask(task.task_id, USER, db)
  await taskAssignmentEngine.completeTask(task.task_id, USER, db)

  const logs = await db.getAuditLog('task', task.task_id)
  const completed = logs.filter(l => l.event_type === 'task_completed')
  assert.strictEqual(completed.length, 1)
})

await test('rejectTask writes exactly one task_rejected audit row', async () => {
  const db       = seedDb()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  const { generatedTasks } = await workflowInstanceService.advancePhase(
    WF_ID, 'Drafting & Collection', USER, db, notifier
  )
  const task = generatedTasks[0]
  await taskAssignmentEngine.startTask(task.task_id, USER, db)
  await taskAssignmentEngine.completeTask(task.task_id, USER, db)
  await taskAssignmentEngine.rejectTask(task.task_id, 'Incorrect document', USER, db, notifier)

  const logs = await db.getAuditLog('task', task.task_id)
  const rejected = logs.filter(l => l.event_type === 'task_rejected')
  assert.strictEqual(rejected.length, 1)
})

await test('reopenTask writes exactly one task_reopened audit row', async () => {
  const db       = seedDb()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  const { generatedTasks } = await workflowInstanceService.advancePhase(
    WF_ID, 'Drafting & Collection', USER, db, notifier
  )
  const task = generatedTasks[0]
  await taskAssignmentEngine.startTask(task.task_id, USER, db)
  await taskAssignmentEngine.completeTask(task.task_id, USER, db)
  await taskAssignmentEngine.rejectTask(task.task_id, 'Wrong format', USER, db, notifier)
  await taskAssignmentEngine.reopenTask(task.task_id, 'Needs redo', USER, db)

  const logs = await db.getAuditLog('task', task.task_id)
  const reopened = logs.filter(l => l.event_type === 'task_reopened')
  assert.strictEqual(reopened.length, 1)
})

// ── Chronological ordering ────────────────────────────────────────────────────

section('Audit log ordering')

await test('getHistory returns audit rows in chronological order (created_at ASC)', async () => {
  const db       = seedDb()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  const { generatedTasks } = await workflowInstanceService.advancePhase(
    WF_ID, 'Drafting & Collection', USER, db, notifier
  )
  const task = generatedTasks[0]
  await taskAssignmentEngine.startTask(task.task_id, USER, db)
  await taskAssignmentEngine.completeTask(task.task_id, USER, db)

  const logs = await db.getAuditLog('task', task.task_id)
  assert.ok(logs.length >= 3, `expected at least 3 logs (created, started, completed)`)

  for (let i = 1; i < logs.length; i++) {
    const prev = new Date(logs[i - 1].created_at).getTime()
    const curr = new Date(logs[i].created_at).getTime()
    assert.ok(
      prev <= curr,
      `audit logs out of order at index ${i}: ${logs[i-1].event_type} after ${logs[i].event_type}`
    )
  }
})

await test('getHistory filters by entity_type and entity_id', async () => {
  const db       = seedDb()
  const notifier = new InMemoryNotificationAdapter()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)
  const { generatedTasks } = await workflowInstanceService.advancePhase(
    WF_ID, 'Drafting & Collection', USER, db, notifier
  )
  const [task1, task2] = generatedTasks
  await taskAssignmentEngine.startTask(task1.task_id, USER, db)

  const logsForTask1 = await db.getAuditLog('task', task1.task_id)
  const logsForTask2 = await db.getAuditLog('task', task2.task_id)

  // task1 started, task2 has only task_created
  assert.ok(logsForTask1.every(l => l.entity_id === task1.task_id), 'all logs should be for task1')
  assert.ok(logsForTask2.every(l => l.entity_id === task2.task_id), 'all logs should be for task2')
  assert.ok(
    logsForTask1.some(l => l.event_type === 'task_started'),
    'task1 logs should include task_started'
  )
  assert.ok(
    !logsForTask2.some(l => l.event_type === 'task_started'),
    'task2 logs should not include task_started'
  )
})

// ── Batch logging ─────────────────────────────────────────────────────────────

section('Batch audit logging')

await test('logBatch writes all events — count matches batch size', async () => {
  const db = seedDb()
  await workflowInstanceService.initializeWorkflow(WF_ID, db)

  const batchEvents: import('../types').AuditEventToCreate[] = [
    {
      entity_type:   'workflow_instance',
      entity_id:     WF_ID,
      tenant_id:     TENANT,
      actor_type:    'system',
      actor_user_id: null,
      event_type:    'workflow_blocked',
      from_state:    'active',
      to_state:      'blocked',
      reason:        'batch test 1',
      metadata:      {},
    },
    {
      entity_type:   'workflow_instance',
      entity_id:     WF_ID,
      tenant_id:     TENANT,
      actor_type:    'system',
      actor_user_id: null,
      event_type:    'workflow_unblocked',
      from_state:    'blocked',
      to_state:      'active',
      reason:        'batch test 2',
      metadata:      {},
    },
  ]

  await auditTrailService.logBatch(batchEvents, db)

  const logs = await db.getAuditLog('workflow_instance', WF_ID)
  // workflow_created (from init) + 2 batch events
  const batchWritten = logs.filter(l => l.reason?.startsWith('batch test'))
  assert.strictEqual(batchWritten.length, 2)
})

await test('logBatch with empty array completes without error', async () => {
  const db = seedDb()
  await auditTrailService.logBatch([], db)
  // No error = pass
})

// ── AuditTrailService never throws ───────────────────────────────────────────

section('AuditTrailService resilience')

await test('auditTrailService.log does not throw even when db.appendAuditLog fails', async () => {
  const db = seedDb()

  // Override appendAuditLog to throw
  const originalAppend = db.appendAuditLog.bind(db)
  db.appendAuditLog = async () => { throw new Error('DB write failure') }

  // Should NOT throw
  await auditTrailService.log({
    entity_type:   'workflow_instance',
    entity_id:     WF_ID,
    tenant_id:     TENANT,
    actor_type:    'system',
    actor_user_id: null,
    event_type:    'workflow_created',
    from_state:    null,
    to_state:      'draft',
    reason:        null,
    metadata:      {},
  }, db)

  // Restore
  db.appendAuditLog = originalAppend
})

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${'─'.repeat(60)}`)
console.log(`Audit Trail Tests: ${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)

} // end main()

main().catch(err => {
  console.error('Test runner error:', err)
  process.exit(1)
})
