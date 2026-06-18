/**
 * WorkflowInstanceService — Sprint 4
 *
 * Manages the full lifecycle of workflow instances: phase transitions,
 * block/unblock, complete, cancel.
 *
 * State machine authority: WORKFLOW_STATE_MACHINE.md §1 (workflow) + §2 (task)
 *
 * Key design decisions applied:
 *   OQ-2: Filing rejected → revert to 'Drafting & Collection'
 *   OQ-3: All tasks inherit obligation.computed_deadline as due_date
 *   OQ-4: Date-driven workflows: user manually starts (no auto-task-generation)
 */

import { auditTrailService } from './audit-trail-service'
import { taskGenerationService } from './task-generation-service'
import { taskAssignmentEngine } from './task-assignment-engine'
import type {
  AuditEventToCreate,
  PhaseAdvanceResult,
  TaskRow,
  WorkflowDbAdapter,
  WorkflowInstanceRow,
  WorkflowPhase,
  WorkflowStatus,
} from './types'
import {
  CannotRevertFromFirstPhase,
  InvalidPhaseTransition,
  InvalidWorkflowTransition,
  PhaseAdvanceBlocked,
  ReasonRequired,
} from './types'
import type { NotificationAdapter } from '../notifications/types'

// Working phases (non-terminal, non-meta) in canonical sequence
const CANONICAL_PHASE_ORDER: WorkflowPhase[] = [
  'Drafting & Collection',
  'Internal Approval',
  'Filing Submitted',
  'Third-Party Verification',
  'Regulator Review',
]

function isTerminal(status: WorkflowStatus): boolean {
  return status === 'completed' || status === 'cancelled'
}

/**
 * Get the next phase from workflow_template.active_phases after currentPhase.
 * Returns null if at the last phase.
 */
function getNextPhase(activePhases: string[], currentPhase: string): string | null {
  const idx = activePhases.indexOf(currentPhase)
  if (idx === -1 || idx === activePhases.length - 1) return null
  return activePhases[idx + 1]
}

/**
 * Get the previous phase in workflow_template.active_phases before currentPhase.
 * Returns null if at the first phase.
 */
function getPrevPhase(activePhases: string[], currentPhase: string): string | null {
  const idx = activePhases.indexOf(currentPhase)
  if (idx <= 0) return null
  return activePhases[idx - 1]
}

export class WorkflowInstanceService {
  /**
   * Called immediately after runRuleEngine() creates the workflow_instances row.
   * Sets current_phase = 'Not Started', status = 'draft'.
   * Writes workflow_created audit log.
   */
  async initializeWorkflow(
    workflowInstanceId: string,
    db:                 WorkflowDbAdapter
  ): Promise<void> {
    const workflow = await db.loadWorkflowInstance(workflowInstanceId)

    // Already initialized — idempotent
    if (workflow.current_phase !== 'Not Started' || workflow.status !== 'draft') {
      return
    }

    await db.updateWorkflowInstance(workflowInstanceId, {
      current_phase:       'Not Started',
      status:              'draft',
      substate_entered_at: new Date(),
    })

    await db.appendPhaseHistory({
      workflow_instance_id: workflowInstanceId,
      phase:                'Not Started',
      substate:             null,
      entered_at:           new Date(),
    })

    await auditTrailService.log({
      entity_type:   'workflow_instance',
      entity_id:     workflowInstanceId,
      tenant_id:     workflow.tenant_id,
      actor_type:    'system',
      actor_user_id: null,
      event_type:    'workflow_created',
      from_state:    null,
      to_state:      'draft',
      reason:        null,
      metadata:      { current_phase: 'Not Started' },
    }, db)
  }

  /**
   * Advance to the next phase in workflow_template.active_phases.
   *
   * Guards:
   *  1. Workflow must not be in terminal or blocked status.
   *  2. All hard-prerequisite tasks in the current phase must be 'completed'.
   *  3. targetPhase must be the next logical phase in active_phases.
   *
   * On advance: generates tasks, auto-assigns, sends notification.
   */
  async advancePhase(
    workflowInstanceId: string,
    targetPhase:        WorkflowPhase,
    actorUserId:        string,
    db:                 WorkflowDbAdapter,
    notifier:           NotificationAdapter
  ): Promise<PhaseAdvanceResult> {
    const workflow = await db.loadWorkflowInstance(workflowInstanceId)
    const template = await db.loadWorkflowTemplate(workflow.workflow_template_id)

    // Status guards
    if (isTerminal(workflow.status)) {
      throw new InvalidWorkflowTransition(
        workflow.status, 'active',
        `workflow is in terminal state '${workflow.status}'`
      )
    }
    if (workflow.status === 'blocked') {
      throw new InvalidWorkflowTransition(
        workflow.status, 'active',
        'cannot advance a blocked workflow — unblock first'
      )
    }

    // Phase sequence guard
    const activePhases = template.active_phases
    const currentPhase = workflow.current_phase

    if (currentPhase === 'Not Started') {
      // First advance: targetPhase must be the first in active_phases
      if (targetPhase !== activePhases[0]) {
        throw new InvalidPhaseTransition(
          currentPhase, targetPhase,
          `first advance must target '${activePhases[0]}'`
        )
      }
    } else {
      const expectedNext = getNextPhase(activePhases, currentPhase)
      if (targetPhase !== expectedNext) {
        throw new InvalidPhaseTransition(
          currentPhase, targetPhase,
          `expected next phase is '${expectedNext ?? 'none'}'`
        )
      }
    }

    // Hard-prerequisite guard (skip for 'Not Started' — no tasks yet)
    if (currentPhase !== 'Not Started') {
      const currentPhaseTasks = await db.loadTasksForPhase(workflowInstanceId, currentPhase)
      const blocked = currentPhaseTasks.find(
        t => t.is_hard_prerequisite && t.status !== 'completed' && t.status !== 'cancelled'
      )
      if (blocked) {
        throw new PhaseAdvanceBlocked(blocked.title, blocked.task_id)
      }
    }

    const now        = new Date()
    const newStatus: WorkflowStatus = 'active'

    // Close current phase history
    if (currentPhase !== 'Not Started') {
      await db.closePhaseHistory(workflowInstanceId, currentPhase)
    } else {
      await db.closePhaseHistory(workflowInstanceId, 'Not Started')
    }

    // Update workflow instance
    await db.updateWorkflowInstance(workflowInstanceId, {
      current_phase:       targetPhase,
      status:              newStatus,
      substate_entered_at: now,
    })

    // Open new phase history
    await db.appendPhaseHistory({
      workflow_instance_id: workflowInstanceId,
      phase:                targetPhase,
      substate:             null,
      entered_at:           now,
    })

    // Generate tasks for new phase
    const generatedTasks = await taskGenerationService.generateTasksForPhase(
      workflowInstanceId, targetPhase, db, actorUserId
    )

    // Auto-assign new tasks
    const taskIds = generatedTasks.map(t => t.task_id)
    await taskAssignmentEngine.autoAssign(workflowInstanceId, taskIds, db)

    // Audit: phase advanced
    await auditTrailService.log({
      entity_type:   'workflow_instance',
      entity_id:     workflowInstanceId,
      tenant_id:     workflow.tenant_id,
      actor_type:    'user',
      actor_user_id: actorUserId,
      event_type:    'phase_advanced',
      from_state:    workflow.status,
      to_state:      newStatus,
      reason:        null,
      metadata:      {
        from_phase: currentPhase,
        to_phase:   targetPhase,
      },
    }, db)

    // Notify assigned users (best-effort — errors do not block phase advance)
    for (const task of generatedTasks.filter(t => t.assigned_to_user_id)) {
      const user = await db.loadUser(task.assigned_to_user_id!).catch(() => null)
      if (!user) continue
      notifier.send({
        tenantId:      workflow.tenant_id,
        recipients:    [{ userId: user.id, email: user.email }],
        eventType:     'workflow_phase_changed',
        channel:       'email',
        subject:       `Workflow advanced to ${targetPhase}`,
        bodyText:      `The workflow has advanced to phase: ${targetPhase}. You have a new task: ${task.title}`,
        metadata:      { workflow_instance_id: workflowInstanceId, phase: targetPhase },
        relatedWorkflowInstanceId: workflowInstanceId,
        relatedTaskId: task.task_id,
      }).catch(err => console.error('[WorkflowInstanceService] Notification failed:', err))
    }

    const updatedWorkflow = await db.loadWorkflowInstance(workflowInstanceId)

    return {
      workflowInstance: updatedWorkflow,
      generatedTasks,
      auditLogIds:      [],
    }
  }

  /**
   * Revert one phase (e.g., after filing rejection).
   * OQ-2: reverts to 'Drafting & Collection' from any working phase.
   * Cannot revert from the first phase.
   */
  async revertPhase(
    workflowInstanceId: string,
    reason:             string,
    actorUserId:        string,
    db:                 WorkflowDbAdapter
  ): Promise<PhaseAdvanceResult> {
    const workflow = await db.loadWorkflowInstance(workflowInstanceId)
    const template = await db.loadWorkflowTemplate(workflow.workflow_template_id)

    if (isTerminal(workflow.status)) {
      throw new InvalidWorkflowTransition(workflow.status, 'active', 'workflow is in terminal state')
    }

    const activePhases  = template.active_phases
    const currentPhase  = workflow.current_phase
    const prevPhase     = getPrevPhase(activePhases, currentPhase)

    if (!prevPhase) throw new CannotRevertFromFirstPhase()

    const now = new Date()

    await db.closePhaseHistory(workflowInstanceId, currentPhase)
    await db.updateWorkflowInstance(workflowInstanceId, {
      current_phase:       prevPhase as WorkflowPhase,
      status:              'active',
      substate_entered_at: now,
    })
    await db.appendPhaseHistory({
      workflow_instance_id: workflowInstanceId,
      phase:                prevPhase,
      substate:             null,
      entered_at:           now,
    })

    // Generate tasks for reverted phase (idempotent — may return existing tasks)
    const generatedTasks = await taskGenerationService.generateTasksForPhase(
      workflowInstanceId, prevPhase, db, actorUserId
    )

    await auditTrailService.log({
      entity_type:   'workflow_instance',
      entity_id:     workflowInstanceId,
      tenant_id:     workflow.tenant_id,
      actor_type:    'user',
      actor_user_id: actorUserId,
      event_type:    'phase_reverted',
      from_state:    workflow.status,
      to_state:      'active',
      reason,
      metadata:      { from_phase: currentPhase, to_phase: prevPhase },
    }, db)

    const updatedWorkflow = await db.loadWorkflowInstance(workflowInstanceId)

    return {
      workflowInstance: updatedWorkflow,
      generatedTasks,
      auditLogIds:      [],
    }
  }

  /**
   * Block the workflow from any non-terminal phase.
   * Stores phase_before_block for restoration on unblock.
   */
  async blockWorkflow(
    workflowInstanceId: string,
    blockedReason:      string,
    actorUserId:        string,
    db:                 WorkflowDbAdapter,
    notifier:           NotificationAdapter
  ): Promise<void> {
    if (!blockedReason?.trim()) throw new ReasonRequired('blockWorkflow')

    const workflow = await db.loadWorkflowInstance(workflowInstanceId)

    if (isTerminal(workflow.status)) {
      throw new InvalidWorkflowTransition(workflow.status, 'blocked', 'workflow is in terminal state')
    }
    if (workflow.status === 'blocked') {
      throw new InvalidWorkflowTransition(workflow.status, 'blocked', 'workflow is already blocked')
    }
    if (workflow.status === 'draft') {
      throw new InvalidWorkflowTransition(workflow.status, 'blocked', 'cannot block a draft workflow')
    }

    const now = new Date()

    await db.closePhaseHistory(workflowInstanceId, workflow.current_phase)
    await db.updateWorkflowInstance(workflowInstanceId, {
      current_phase:       'Blocked',
      status:              'blocked',
      blocked_reason:      blockedReason,
      phase_before_block:  workflow.current_phase,
      substate_entered_at: now,
    })
    await db.appendPhaseHistory({
      workflow_instance_id: workflowInstanceId,
      phase:                'Blocked',
      substate:             null,
      entered_at:           now,
    })

    // Generate resolve_blocker task
    await taskGenerationService.generateTasksForPhase(
      workflowInstanceId, 'Blocked', db, actorUserId
    )

    await auditTrailService.log({
      entity_type:   'workflow_instance',
      entity_id:     workflowInstanceId,
      tenant_id:     workflow.tenant_id,
      actor_type:    'user',
      actor_user_id: actorUserId,
      event_type:    'workflow_blocked',
      from_state:    workflow.status,
      to_state:      'blocked',
      reason:        blockedReason,
      metadata:      { from_phase: workflow.current_phase, phase_before_block: workflow.current_phase },
    }, db)

    // Notify workflow owner
    if (workflow.assigned_to_user_id) {
      const owner = await db.loadUser(workflow.assigned_to_user_id)
      if (owner) {
        await notifier.send({
          tenantId:      workflow.tenant_id,
          recipients:    [{ userId: owner.id, email: owner.email }],
          eventType:     'workflow_blocked',
          channel:       'email',
          subject:       'Workflow blocked',
          bodyText:      `Workflow has been blocked. Reason: ${blockedReason}`,
          metadata:      { workflow_instance_id: workflowInstanceId, reason: blockedReason },
          relatedWorkflowInstanceId: workflowInstanceId,
        }).catch(err => console.error('[WorkflowInstanceService] Notification failed:', err))
      }
    }
  }

  /**
   * Unblock workflow — restores to phase_before_block.
   */
  async unblockWorkflow(
    workflowInstanceId: string,
    actorUserId:        string,
    db:                 WorkflowDbAdapter
  ): Promise<void> {
    const workflow = await db.loadWorkflowInstance(workflowInstanceId)

    if (workflow.status !== 'blocked') {
      throw new InvalidWorkflowTransition(workflow.status, 'active', 'workflow is not blocked')
    }

    const restoredPhase = (workflow.phase_before_block ?? 'Drafting & Collection') as WorkflowPhase
    const now = new Date()

    await db.closePhaseHistory(workflowInstanceId, 'Blocked')
    await db.updateWorkflowInstance(workflowInstanceId, {
      current_phase:       restoredPhase,
      status:              'active',
      blocked_reason:      null,
      phase_before_block:  null,
      substate_entered_at: now,
    })
    await db.appendPhaseHistory({
      workflow_instance_id: workflowInstanceId,
      phase:                restoredPhase,
      substate:             null,
      entered_at:           now,
    })

    await auditTrailService.log({
      entity_type:   'workflow_instance',
      entity_id:     workflowInstanceId,
      tenant_id:     workflow.tenant_id,
      actor_type:    'user',
      actor_user_id: actorUserId,
      event_type:    'workflow_unblocked',
      from_state:    'blocked',
      to_state:      'active',
      reason:        null,
      metadata:      { restored_phase: restoredPhase },
    }, db)
  }

  /**
   * Mark workflow as completed.
   * Guards: all hard-prerequisite tasks in current phase must be 'completed'.
   * Sets obligation.status = 'filed' when filingAttemptId provided.
   */
  async completeWorkflow(
    workflowInstanceId: string,
    filingAttemptId:    string | null,
    actorUserId:        string,
    db:                 WorkflowDbAdapter
  ): Promise<void> {
    const workflow = await db.loadWorkflowInstance(workflowInstanceId)

    if (isTerminal(workflow.status)) {
      throw new InvalidWorkflowTransition(workflow.status, 'completed', 'workflow is in terminal state')
    }
    if (workflow.status === 'blocked') {
      throw new InvalidWorkflowTransition(workflow.status, 'completed', 'must unblock before completing')
    }

    // Hard-prerequisite guard
    const currentPhaseTasks = await db.loadTasksForPhase(workflowInstanceId, workflow.current_phase)
    const blocked = currentPhaseTasks.find(
      t => t.is_hard_prerequisite && t.status !== 'completed' && t.status !== 'cancelled'
    )
    if (blocked) throw new PhaseAdvanceBlocked(blocked.title, blocked.task_id)

    const now = new Date()

    await db.closePhaseHistory(workflowInstanceId, workflow.current_phase)
    await db.updateWorkflowInstance(workflowInstanceId, {
      current_phase:       'Completed',
      status:              'completed',
      substate_entered_at: now,
      completed_at:        now,
    })
    await db.appendPhaseHistory({
      workflow_instance_id: workflowInstanceId,
      phase:                'Completed',
      substate:             null,
      entered_at:           now,
    })

    // Update obligation status to 'filed' if filing was accepted
    if (filingAttemptId && workflow.obligation_id) {
      await db.updateObligationStatus(workflow.obligation_id, 'filed')
      await db.cancelPendingReminders(workflow.obligation_id)
    }

    // Generate record_completion task (auto-completed by task generation service)
    await taskGenerationService.generateTasksForPhase(
      workflowInstanceId, 'Completed', db, actorUserId
    )

    await auditTrailService.log({
      entity_type:   'workflow_instance',
      entity_id:     workflowInstanceId,
      tenant_id:     workflow.tenant_id,
      actor_type:    'user',
      actor_user_id: actorUserId,
      event_type:    'workflow_completed',
      from_state:    workflow.status,
      to_state:      'completed',
      reason:        null,
      metadata:      {
        from_phase:       workflow.current_phase,
        filing_attempt_id: filingAttemptId,
      },
    }, db)
  }

  /**
   * Cancel a workflow. Admin-only. Cascades cancellation to all non-terminal tasks.
   * Reason required. Can cancel from any non-terminal state including draft.
   */
  async cancelWorkflow(
    workflowInstanceId: string,
    reason:             string,
    actorUserId:        string,
    db:                 WorkflowDbAdapter
  ): Promise<void> {
    if (!reason?.trim()) throw new ReasonRequired('cancelWorkflow')

    const workflow = await db.loadWorkflowInstance(workflowInstanceId)

    if (isTerminal(workflow.status)) {
      throw new InvalidWorkflowTransition(workflow.status, 'cancelled', 'workflow is already in terminal state')
    }

    const now = new Date()

    await db.updateWorkflowInstance(workflowInstanceId, {
      status:          'cancelled',
      cancelled_at:    now,
      cancelled_reason: reason,
    })

    await auditTrailService.log({
      entity_type:   'workflow_instance',
      entity_id:     workflowInstanceId,
      tenant_id:     workflow.tenant_id,
      actor_type:    'user',
      actor_user_id: actorUserId,
      event_type:    'workflow_cancelled',
      from_state:    workflow.status,
      to_state:      'cancelled',
      reason,
      metadata:      { current_phase: workflow.current_phase },
    }, db)

    // Cascade cancel all non-terminal tasks
    const allTasks = await db.loadTasksForWorkflow(workflowInstanceId)
    const toCancel = allTasks.filter(
      t => !['completed', 'cancelled'].includes(t.status)
    )

    for (const task of toCancel) {
      await taskAssignmentEngine.cancelTask(task.task_id, `Parent workflow cancelled: ${reason}`, db)
    }

    // Suppress pending reminders
    if (workflow.obligation_id) {
      await db.cancelPendingReminders(workflow.obligation_id).catch(() => {})
    }
  }
}

export const workflowInstanceService = new WorkflowInstanceService()
