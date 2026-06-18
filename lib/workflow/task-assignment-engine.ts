/**
 * TaskAssignmentEngine — Sprint 4
 *
 * Handles auto-assignment (cascade: obligation → workflow → null) and
 * manual assignment/reassignment of tasks.
 *
 * OQ-9 resolved: task reopened → reset to pending (unassigned).
 * OQ-10 resolved: any tenant member can reject a task.
 *
 * Per SPRINT_4_ARCHITECTURE.md §5.3 and SPRINT_4_HANDOFF.md §9.
 */

import { auditTrailService } from './audit-trail-service'
import { dependencyEngine } from './dependency-engine'
import type {
  AssignmentResult,
  TaskRow,
  WorkflowDbAdapter,
} from './types'
import { TaskNotFound, UserNotInTenant, ReasonRequired } from './types'
import type { NotificationAdapter } from '../notifications/types'

export class TaskAssignmentEngine {
  /**
   * Auto-assign tasks using cascade:
   *   obligation.assigned_to_user_id → workflow_instance.assigned_to_user_id → null
   *
   * Per SPRINT_4_ARCHITECTURE.md §5.3.
   */
  async autoAssign(
    workflowInstanceId: string,
    taskIds:            string[],
    db:                 WorkflowDbAdapter
  ): Promise<AssignmentResult[]> {
    if (taskIds.length === 0) return []

    const workflow = await db.loadWorkflowInstance(workflowInstanceId)

    // Determine cascade assignment source
    let assignedUserId:   string | null = null
    let assignmentSource: AssignmentResult['assignmentSource'] = 'unassigned'

    if (workflow.obligation_id) {
      try {
        const obligation = await db.loadObligation(workflow.obligation_id)
        if (obligation.assigned_to_user_id) {
          assignedUserId   = obligation.assigned_to_user_id
          assignmentSource = 'obligation'
        }
      } catch {
        // obligation not found — continue cascade
      }
    }

    if (!assignedUserId && workflow.assigned_to_user_id) {
      assignedUserId   = workflow.assigned_to_user_id
      assignmentSource = 'workflow'
    }

    const results: AssignmentResult[] = []
    const auditEvents: import('./types').AuditEventToCreate[] = []

    for (const taskId of taskIds) {
      let task: TaskRow
      try {
        task = await db.loadTask(taskId)
      } catch {
        results.push({ taskId, assignedUserId: null, assignmentSource: 'unassigned' })
        continue
      }

      if (assignedUserId) {
        await db.updateTask(taskId, {
          status:              'assigned',
          assigned_to_user_id: assignedUserId,
        })
        auditEvents.push({
          entity_type:   'task',
          entity_id:     taskId,
          tenant_id:     workflow.tenant_id,
          actor_type:    'system',
          actor_user_id: null,
          event_type:    'task_assigned',
          from_state:    'pending',
          to_state:      'assigned',
          reason:        null,
          metadata:      { assigned_to_user_id: assignedUserId, source: assignmentSource },
        })
      }

      results.push({ taskId, assignedUserId, assignmentSource })
    }

    await auditTrailService.logBatch(auditEvents, db)
    return results
  }

  /**
   * Manually assign a task to a user (or reassign from current assignee).
   */
  async assignTask(
    taskId:      string,
    toUserId:    string,
    actorUserId: string,
    db:          WorkflowDbAdapter,
    notifier:    NotificationAdapter
  ): Promise<void> {
    const task = await db.loadTask(taskId)
    if (!task) throw new TaskNotFound(taskId)

    const toUser = await db.loadUser(toUserId)
    if (!toUser || toUser.tenant_id !== task.tenant_id) {
      throw new UserNotInTenant(toUserId, task.tenant_id)
    }

    const isReassign  = task.assigned_to_user_id !== null
    const prevUserId  = task.assigned_to_user_id
    const eventType   = isReassign ? 'task_reassigned' : 'task_assigned'
    const fromStatus  = task.status
    const newStatus   = (task.status === 'pending' || task.status === 'reopened') ? 'assigned' : task.status

    await db.updateTask(taskId, {
      status:              newStatus,
      assigned_to_user_id: toUserId,
    })

    await auditTrailService.log({
      entity_type:   'task',
      entity_id:     taskId,
      tenant_id:     task.tenant_id,
      actor_type:    'user',
      actor_user_id: actorUserId,
      event_type:    eventType,
      from_state:    fromStatus,
      to_state:      newStatus,
      reason:        null,
      metadata:      {
        assigned_to_user_id:   toUserId,
        ...(isReassign ? { removed_from_user_id: prevUserId } : {}),
      },
    }, db)

    // Notify the new assignee
    await notifier.send({
      tenantId:    task.tenant_id,
      recipients:  [{ userId: toUserId, email: toUser.email }],
      eventType:   isReassign ? 'task_assigned' : 'task_assigned',
      channel:     'email',
      subject:     isReassign ? 'Task reassigned to you' : 'Task assigned to you',
      bodyText:    `You have been assigned task: ${task.title}`,
      metadata:    { task_id: taskId, task_title: task.title },
      relatedTaskId: taskId,
    }).catch(err => console.error('[TaskAssignmentEngine] Notification failed:', err))
  }

  /**
   * Remove assignment from a task (returns it to pending).
   */
  async unassignTask(
    taskId:      string,
    actorUserId: string,
    db:          WorkflowDbAdapter
  ): Promise<void> {
    const task = await db.loadTask(taskId)

    const prevUserId = task.assigned_to_user_id
    await db.updateTask(taskId, {
      status:              'pending',
      assigned_to_user_id: null,
    })

    await auditTrailService.log({
      entity_type:   'task',
      entity_id:     taskId,
      tenant_id:     task.tenant_id,
      actor_type:    'user',
      actor_user_id: actorUserId,
      event_type:    'task_unassigned',
      from_state:    task.status,
      to_state:      'pending',
      reason:        null,
      metadata:      { removed_from_user_id: prevUserId },
    }, db)
  }

  /**
   * Transition task to in_progress. Checks finish_to_start dependencies.
   */
  async startTask(
    taskId:      string,
    actorUserId: string,
    db:          WorkflowDbAdapter
  ): Promise<void> {
    const task = await db.loadTask(taskId)

    if (!['pending', 'assigned', 'reopened'].includes(task.status)) {
      throw new Error(`InvalidTaskTransition: cannot start task in status '${task.status}'`)
    }

    await dependencyEngine.checkCanStart(taskId, db)

    await db.updateTask(taskId, { status: 'in_progress' })

    await auditTrailService.log({
      entity_type:   'task',
      entity_id:     taskId,
      tenant_id:     task.tenant_id,
      actor_type:    'user',
      actor_user_id: actorUserId,
      event_type:    'task_started',
      from_state:    task.status,
      to_state:      'in_progress',
      reason:        null,
      metadata:      {},
    }, db)
  }

  /**
   * Mark task as completed. Checks finish_to_finish dependencies, then fires dependency_satisfied.
   */
  async completeTask(
    taskId:      string,
    actorUserId: string,
    db:          WorkflowDbAdapter
  ): Promise<void> {
    const task = await db.loadTask(taskId)

    if (task.status !== 'in_progress') {
      throw new Error(`InvalidTaskTransition: cannot complete task in status '${task.status}'`)
    }

    await dependencyEngine.checkCanComplete(taskId, db)

    const completedAt = new Date()
    await db.updateTask(taskId, { status: 'completed', completed_at: completedAt })

    await auditTrailService.log({
      entity_type:   'task',
      entity_id:     taskId,
      tenant_id:     task.tenant_id,
      actor_type:    'user',
      actor_user_id: actorUserId,
      event_type:    'task_completed',
      from_state:    'in_progress',
      to_state:      'completed',
      reason:        null,
      metadata:      { completed_at: completedAt.toISOString() },
    }, db)

    const updatedTask = await db.loadTask(taskId)
    await dependencyEngine.onTaskCompleted(updatedTask, db)
  }

  /**
   * Reject a task (completed → rejected). Reason required.
   * OQ-10: any tenant member can reject.
   */
  async rejectTask(
    taskId:      string,
    reason:      string,
    actorUserId: string,
    db:          WorkflowDbAdapter,
    notifier:    NotificationAdapter
  ): Promise<void> {
    if (!reason?.trim()) throw new ReasonRequired('rejectTask')

    const task = await db.loadTask(taskId)

    if (task.status !== 'completed') {
      throw new Error(`InvalidTaskTransition: cannot reject task in status '${task.status}'`)
    }

    await db.updateTask(taskId, { status: 'rejected' })

    await auditTrailService.log({
      entity_type:   'task',
      entity_id:     taskId,
      tenant_id:     task.tenant_id,
      actor_type:    'user',
      actor_user_id: actorUserId,
      event_type:    'task_rejected',
      from_state:    'completed',
      to_state:      'rejected',
      reason,
      metadata:      { rejected_by_user_id: actorUserId, reason },
    }, db)

    // Notify assignee if there is one
    if (task.assigned_to_user_id) {
      const assignee = await db.loadUser(task.assigned_to_user_id)
      if (assignee) {
        await notifier.send({
          tenantId:      task.tenant_id,
          recipients:    [{ userId: assignee.id, email: assignee.email }],
          eventType:     'task_rejected',
          channel:       'email',
          subject:       `Task rejected: ${task.title}`,
          bodyText:      `Your task "${task.title}" has been rejected. Reason: ${reason}`,
          metadata:      { task_id: taskId, reason },
          relatedTaskId: taskId,
        }).catch(err => console.error('[TaskAssignmentEngine] Notification failed:', err))
      }
    }
  }

  /**
   * Reopen a task (completed/rejected → reopened).
   * OQ-9: reset to pending (unassigned).
   * Reason required.
   */
  async reopenTask(
    taskId:      string,
    reason:      string,
    actorUserId: string,
    db:          WorkflowDbAdapter
  ): Promise<void> {
    if (!reason?.trim()) throw new ReasonRequired('reopenTask')

    const task = await db.loadTask(taskId)

    if (!['completed', 'rejected'].includes(task.status)) {
      throw new Error(`InvalidTaskTransition: cannot reopen task in status '${task.status}'`)
    }

    // OQ-9: reset to pending (unassigned) — not auto-assign to original assignee
    await db.updateTask(taskId, {
      status:              'reopened',
      assigned_to_user_id: null,
    })

    await auditTrailService.log({
      entity_type:   'task',
      entity_id:     taskId,
      tenant_id:     task.tenant_id,
      actor_type:    'user',
      actor_user_id: actorUserId,
      event_type:    'task_reopened',
      from_state:    task.status,
      to_state:      'reopened',
      reason,
      metadata:      { reopened_reason: reason },
    }, db)
  }

  /**
   * Cancel a task. System-only operation — triggered by workflow cancellation cascade.
   * Reason required.
   */
  async cancelTask(
    taskId:      string,
    reason:      string,
    db:          WorkflowDbAdapter
  ): Promise<void> {
    if (!reason?.trim()) throw new ReasonRequired('cancelTask')

    const task = await db.loadTask(taskId)

    const terminalStatuses = ['completed', 'cancelled']
    if (terminalStatuses.includes(task.status)) return // already terminal, skip

    const cancelledAt = new Date()
    await db.updateTask(taskId, {
      status:      'cancelled',
      cancelled_at: cancelledAt,
    })

    await auditTrailService.log({
      entity_type:   'task',
      entity_id:     taskId,
      tenant_id:     task.tenant_id,
      actor_type:    'system',
      actor_user_id: null,
      event_type:    'task_cancelled',
      from_state:    task.status,
      to_state:      'cancelled',
      reason,
      metadata:      { cancelled_reason: reason },
    }, db)
  }
}

export const taskAssignmentEngine = new TaskAssignmentEngine()
