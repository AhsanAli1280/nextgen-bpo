/**
 * TaskGenerationService — Sprint 4
 *
 * Generates tasks for a workflow phase based on workflow_template configuration.
 * deriveTaskSpecs() is a pure function — no DB access, fully testable in isolation.
 * generateTasksForPhase() is idempotent: if tasks already exist for the phase, returns them.
 *
 * Phase → task mapping per SPRINT_4_ARCHITECTURE.md §5.2:
 *   Drafting & Collection     → prepare_draft (soft) + collect_document per doc_req
 *   Internal Approval         → board_resolution OR special_resolution (hard) — skipped if 'none'
 *   Filing Submitted          → submit_filing (hard) + record_reference (soft)
 *   Third-Party Verification  → await_verification (hard, system-managed)
 *   Regulator Review          → await_regulator (hard, system-managed)
 *   Completed                 → record_completion (auto-completed on entry)
 *   Blocked                   → resolve_blocker (soft)
 *   Not Started               → no tasks
 *
 * OQ-1 resolved (SPRINT_4_HANDOFF.md §9):
 *   Internal Approval phase only applies when approval_requirement_type
 *   is 'board_resolution' or 'special_resolution'. Skip phase if 'none'.
 */

import { randomUUID } from 'crypto'
import { auditTrailService } from './audit-trail-service'
import type {
  TaskRow,
  TaskSpec,
  TaskToCreate,
  WorkflowDbAdapter,
  WorkflowTemplateRow,
} from './types'

export class TaskGenerationService {
  /**
   * Pure function — derives TaskSpec[] from template + phase.
   * No DB access. Deterministic. Covered by L1 unit tests.
   */
  deriveTaskSpecs(template: WorkflowTemplateRow, phase: string): TaskSpec[] {
    switch (phase) {
      case 'Drafting & Collection': {
        const specs: TaskSpec[] = [
          {
            task_type:            'prepare_draft',
            title:                'Prepare draft documentation',
            description:          'Prepare all draft documents required for this obligation.',
            is_hard_prerequisite: false,
            sort_order:           0,
          },
        ]
        template.document_requirements.forEach((doc, idx) => {
          specs.push({
            task_type:            'collect_document',
            title:                `Collect: ${doc.title}`,
            description:          doc.description ?? null,
            is_hard_prerequisite: doc.is_hard_prerequisite,
            sort_order:           idx + 1,
          })
        })
        return specs
      }

      case 'Internal Approval': {
        // OQ-1: skip if approval_requirement_type = 'none'
        if (template.approval_requirement_type === 'none') return []

        const taskType =
          template.approval_requirement_type === 'board_resolution'
            ? 'board_resolution'
            : 'special_resolution'

        const label =
          template.approval_requirement_type === 'board_resolution'
            ? 'Board Resolution'
            : 'Special Resolution'

        return [
          {
            task_type:            taskType,
            title:                `Obtain ${label}`,
            description:          `Obtain the required ${label.toLowerCase()} approving this action.`,
            is_hard_prerequisite: true,
            sort_order:           0,
          },
        ]
      }

      case 'Filing Submitted':
        return [
          {
            task_type:            'submit_filing',
            title:                'Submit filing to regulator',
            description:          'Submit the completed filing to the relevant regulatory authority.',
            is_hard_prerequisite: true,
            sort_order:           0,
          },
          {
            task_type:            'record_reference',
            title:                'Record filing reference number',
            description:          'Record the reference number received from the regulatory authority.',
            is_hard_prerequisite: false,
            sort_order:           1,
          },
        ]

      case 'Third-Party Verification':
        return [
          {
            task_type:            'await_verification',
            title:                'Await third-party verification',
            description:          'Wait for third-party verification to be confirmed.',
            is_hard_prerequisite: true,
            sort_order:           0,
          },
        ]

      case 'Regulator Review':
        return [
          {
            task_type:            'await_regulator',
            title:                'Await regulator decision',
            description:          'Wait for the regulator to process and confirm the filing.',
            is_hard_prerequisite: true,
            sort_order:           0,
          },
        ]

      case 'Completed':
        return [
          {
            task_type:            'record_completion',
            title:                'Record obligation completion',
            description:          'Record that this obligation has been fully discharged.',
            is_hard_prerequisite: false,
            sort_order:           0,
          },
        ]

      case 'Blocked':
        return [
          {
            task_type:            'resolve_blocker',
            title:                'Resolve workflow blocker',
            description:          'Identify and resolve the issue blocking this workflow.',
            is_hard_prerequisite: false,
            sort_order:           0,
          },
        ]

      case 'Not Started':
        return []

      default:
        return []
    }
  }

  /**
   * Generate and persist tasks for a given phase.
   * Idempotent: returns existing tasks if they already exist for this phase.
   * Writes audit log for each created task.
   */
  async generateTasksForPhase(
    workflowInstanceId: string,
    phase:              string,
    db:                 WorkflowDbAdapter,
    actorUserId?:       string
  ): Promise<TaskRow[]> {
    // Idempotency check
    const existing = await db.loadTasksForPhase(workflowInstanceId, phase)
    if (existing.length > 0) return existing

    const workflow  = await db.loadWorkflowInstance(workflowInstanceId)
    const template  = await db.loadWorkflowTemplate(workflow.workflow_template_id)
    const specs     = this.deriveTaskSpecs(template, phase)

    if (specs.length === 0) return []

    // Resolve due_date from obligation if available
    let dueDate: Date | null = null
    if (workflow.obligation_id) {
      try {
        const obligation = await db.loadObligation(workflow.obligation_id)
        dueDate = obligation.computed_deadline
      } catch {
        // obligation may not be in scope — proceed without due_date
      }
    }

    const createdTasks: TaskRow[] = []
    const auditEvents: import('./types').AuditEventToCreate[] = []

    for (const spec of specs) {
      const toCreate: TaskToCreate = {
        workflow_instance_id: workflowInstanceId,
        obligation_id:        workflow.obligation_id,
        tenant_id:            workflow.tenant_id,
        phase,
        task_type:            spec.task_type,
        title:                spec.title,
        description:          spec.description,
        is_hard_prerequisite: spec.is_hard_prerequisite,
        sort_order:           spec.sort_order,
        due_date:             dueDate,
        demo_session_id:      workflow.demo_session_id,
        demo_expires_at:      workflow.demo_expires_at,
      }
      const task = await db.createTask(toCreate)
      createdTasks.push(task)

      // Auto-complete record_completion tasks immediately
      if (spec.task_type === 'record_completion') {
        await db.updateTask(task.task_id, {
          status:       'completed',
          completed_at: new Date(),
        })
        task.status       = 'completed'
        task.completed_at = new Date()
      }

      auditEvents.push({
        entity_type:   'task',
        entity_id:     task.task_id,
        tenant_id:     workflow.tenant_id,
        actor_type:    'system',
        actor_user_id: actorUserId ?? null,
        event_type:    'task_created',
        from_state:    null,
        to_state:      task.status,
        reason:        null,
        metadata:      {
          workflow_instance_id: workflowInstanceId,
          phase,
          task_type: spec.task_type,
        },
      })
    }

    await auditTrailService.logBatch(auditEvents, db)

    return createdTasks
  }
}

export const taskGenerationService = new TaskGenerationService()
