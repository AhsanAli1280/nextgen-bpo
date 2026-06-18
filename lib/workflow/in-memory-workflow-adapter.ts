/**
 * InMemoryWorkflowDbAdapter — Sprint 4
 *
 * Full implementation of WorkflowDbAdapter using in-memory data structures.
 * NOT a mock. Implements identical semantics to SupabaseWorkflowDbAdapter.
 * Used for all Sprint 4 L1 and L2 tests — no real DB required.
 *
 * Seeded with workflow template data matching supabase/seed.sql UUIDs.
 * Do NOT use Sprint 3 InMemoryDbAdapter — that serves the DbAdapter interface.
 * These are independent adapters for independent interfaces.
 */

import { randomUUID } from 'crypto'
import type {
  AuditEventToCreate,
  AuditLogRow,
  EscalationEventRow,
  EscalationEventToCreate,
  EscalationPolicyRow,
  EscalationPolicyStepRow,
  EntityType,
  InAppNotificationToCreate,
  NotificationOutboxRow,
  NotificationOutboxToCreate,
  ObligationRow,
  ObligationStatus,
  ObligationWithTemplate,
  PhaseHistoryRow,
  PhaseHistoryToCreate,
  TaskDependencyRow,
  TaskDependencyToCreate,
  TaskRow,
  TaskToCreate,
  TaskUpdate,
  UserRole,
  UserRow,
  WorkflowDbAdapter,
  WorkflowInstanceRow,
  WorkflowInstanceUpdate,
  WorkflowTemplateRow,
} from './types'
import { TaskNotFound, WorkflowNotFound } from './types'

// ── Canonical seed UUIDs (match supabase/seed.sql + Sprint 3 in-memory adapter) ──

export const WORKFLOW_SEED = {
  TENANT_ID:      'tttttttt-0000-0000-0000-000000000001',
  ABC_COMPANY_ID: 'aaaaaaaa-0000-0000-0000-000000000001',
  XYZ_COMPANY_ID: 'bbbbbbbb-0000-0000-0000-000000000002',

  WORKFLOW_TEMPLATES: {
    DIR_001:    'wwww0000-0000-0000-0000-000000000001',
    DIR_002:    'wwww0000-0000-0000-0000-000000000002',
    SHARE_001:  'wwww0000-0000-0000-0000-000000000003',
    OFFICE_002: 'wwww0000-0000-0000-0000-000000000004',
    OFFICE_003: 'wwww0000-0000-0000-0000-000000000005',
    AGM_007:    'wwww0000-0000-0000-0000-000000000006',
    CHARGE_001: 'wwww0000-0000-0000-0000-000000000007',
    BO_002:     'wwww0000-0000-0000-0000-000000000008',
    AGM_002:    'wwww0000-0000-0000-0000-000000000009',
    ANNRET_001: 'wwww0000-0000-0000-0000-000000000010',
    ANNRET_002: 'wwww0000-0000-0000-0000-000000000011',
  },

  // Test user IDs
  USER_MEMBER: 'uuuu0001-0000-0000-0000-000000000001',
  USER_ADMIN:  'uuuu0002-0000-0000-0000-000000000001',
  USER_OWNER:  'uuuu0003-0000-0000-0000-000000000001',

  // Test obligation IDs
  OBL_DIR_001:   'oooo0001-0000-0000-0000-000000000001',
  OBL_SHARE_001: 'oooo0002-0000-0000-0000-000000000001',

  // Test workflow instance IDs
  WF_DIR_001:   'ffff0001-0000-0000-0000-000000000001',
  WF_SHARE_001: 'ffff0002-0000-0000-0000-000000000001',
} as const

// ── Seed: Workflow Templates ──────────────────────────────────────────────────

const SEED_TEMPLATES: WorkflowTemplateRow[] = [
  {
    workflow_template_id:      WORKFLOW_SEED.WORKFLOW_TEMPLATES.DIR_001,
    obligation_template_id:    'ot000001-0000-0000-0000-000000000001',
    name:                      'Director Appointment/Change Workflow',
    active_phases:             [
      'Drafting & Collection',
      'Internal Approval',
      'Filing Submitted',
      'Regulator Review',
    ],
    approval_requirement_type: 'board_resolution',
    document_requirements:     [
      { document_type: 'resignation_letter', title: 'Director Resignation Letter', is_hard_prerequisite: true },
      { document_type: 'consent_form',       title: 'Director Consent Form',       is_hard_prerequisite: true },
    ],
    recurrence_type:           'one_off',
    alert_lead_times:          [30, 14, 7, 3, 1],
    created_at:                new Date('2026-01-01'),
  },
  {
    workflow_template_id:      WORKFLOW_SEED.WORKFLOW_TEMPLATES.SHARE_001,
    obligation_template_id:    'ot000002-0000-0000-0000-000000000001',
    name:                      'Share Allotment Workflow',
    active_phases:             [
      'Drafting & Collection',
      'Internal Approval',
      'Filing Submitted',
    ],
    approval_requirement_type: 'board_resolution',
    document_requirements:     [
      { document_type: 'allotment_form', title: 'Form 3 — Return of Allotment', is_hard_prerequisite: true },
    ],
    recurrence_type:           'one_off',
    alert_lead_times:          [30, 14, 7, 3, 1],
    created_at:                new Date('2026-01-01'),
  },
  {
    workflow_template_id:      WORKFLOW_SEED.WORKFLOW_TEMPLATES.AGM_002,
    obligation_template_id:    'ot000003-0000-0000-0000-000000000001',
    name:                      'Annual General Meeting Workflow',
    active_phases:             [
      'Drafting & Collection',
      'Filing Submitted',
    ],
    approval_requirement_type: 'none',
    document_requirements:     [
      { document_type: 'agm_notice', title: 'AGM Notice', is_hard_prerequisite: true },
    ],
    recurrence_type:           'fixed_date_recurring',
    alert_lead_times:          [30, 14, 7, 3, 1],
    created_at:                new Date('2026-01-01'),
  },
  {
    workflow_template_id:      WORKFLOW_SEED.WORKFLOW_TEMPLATES.ANNRET_001,
    obligation_template_id:    'ot000004-0000-0000-0000-000000000001',
    name:                      'Annual Return Filing Workflow',
    active_phases:             [
      'Drafting & Collection',
      'Filing Submitted',
      'Regulator Review',
    ],
    approval_requirement_type: 'none',
    document_requirements:     [
      { document_type: 'annual_return_form', title: 'Annual Return Form', is_hard_prerequisite: true },
    ],
    recurrence_type:           'fixed_date_recurring',
    alert_lead_times:          [30, 14, 7, 3, 1],
    created_at:                new Date('2026-01-01'),
  },
]

// ── Seed: Users ───────────────────────────────────────────────────────────────

const SEED_USERS: UserRow[] = [
  {
    id:         WORKFLOW_SEED.USER_MEMBER,
    tenant_id:  WORKFLOW_SEED.TENANT_ID,
    email:      'member@testcorp.pk',
    full_name:  'Test Member',
    role:       'member',
    created_at: new Date('2026-01-01'),
  },
  {
    id:         WORKFLOW_SEED.USER_ADMIN,
    tenant_id:  WORKFLOW_SEED.TENANT_ID,
    email:      'admin@testcorp.pk',
    full_name:  'Test Admin',
    role:       'admin',
    created_at: new Date('2026-01-01'),
  },
  {
    id:         WORKFLOW_SEED.USER_OWNER,
    tenant_id:  WORKFLOW_SEED.TENANT_ID,
    email:      'owner@testcorp.pk',
    full_name:  'Test Owner',
    role:       'owner',
    created_at: new Date('2026-01-01'),
  },
]

// ── Seed: Default Escalation Policies ────────────────────────────────────────

const POLICY_ID_OBL_OVERDUE = 'pppp0001-0000-0000-0000-000000000001'
const POLICY_ID_TASK_OVERDUE = 'pppp0002-0000-0000-0000-000000000001'
const POLICY_ID_WF_BLOCKED   = 'pppp0003-0000-0000-0000-000000000001'

const SEED_ESCALATION_POLICIES: EscalationPolicyRow[] = [
  {
    policy_id:            POLICY_ID_OBL_OVERDUE,
    company_id:           null,
    tenant_id:            null,
    workflow_template_id: null,
    trigger_condition:    'obligation_overdue',
    threshold_days:       0,
    cooldown_hours:       24,
    is_active:            true,
    created_at:           new Date('2026-01-01'),
  },
  {
    policy_id:            POLICY_ID_TASK_OVERDUE,
    company_id:           null,
    tenant_id:            null,
    workflow_template_id: null,
    trigger_condition:    'task_overdue',
    threshold_days:       0,
    cooldown_hours:       12,
    is_active:            true,
    created_at:           new Date('2026-01-01'),
  },
  {
    policy_id:            POLICY_ID_WF_BLOCKED,
    company_id:           null,
    tenant_id:            null,
    workflow_template_id: null,
    trigger_condition:    'workflow_blocked_n_days',
    threshold_days:       3,
    cooldown_hours:       48,
    is_active:            true,
    created_at:           new Date('2026-01-01'),
  },
]

const SEED_ESCALATION_STEPS: EscalationPolicyStepRow[] = [
  {
    step_id:                  'ssss0001-0000-0000-0000-000000000001',
    policy_id:                POLICY_ID_OBL_OVERDUE,
    step_number:              1,
    delay_hours:              0,
    escalate_to_role:         'member',
    notify_channel:           ['email', 'in_app'],
    requires_acknowledgement: false,
    created_at:               new Date('2026-01-01'),
  },
  {
    step_id:                  'ssss0001-0000-0000-0000-000000000002',
    policy_id:                POLICY_ID_OBL_OVERDUE,
    step_number:              2,
    delay_hours:              24,
    escalate_to_role:         'owner',
    notify_channel:           ['email', 'in_app'],
    requires_acknowledgement: true,
    created_at:               new Date('2026-01-01'),
  },
  {
    step_id:                  'ssss0002-0000-0000-0000-000000000001',
    policy_id:                POLICY_ID_TASK_OVERDUE,
    step_number:              1,
    delay_hours:              0,
    escalate_to_role:         'member',
    notify_channel:           ['email', 'in_app'],
    requires_acknowledgement: false,
    created_at:               new Date('2026-01-01'),
  },
  {
    step_id:                  'ssss0003-0000-0000-0000-000000000001',
    policy_id:                POLICY_ID_WF_BLOCKED,
    step_number:              1,
    delay_hours:              0,
    escalate_to_role:         'admin',
    notify_channel:           ['email', 'in_app'],
    requires_acknowledgement: true,
    created_at:               new Date('2026-01-01'),
  },
]

// ── Role hierarchy for minRole filtering ─────────────────────────────────────

const ROLE_RANK: Record<UserRole, number> = { member: 0, owner: 1, admin: 2 }

// ── InMemoryWorkflowDbAdapter ─────────────────────────────────────────────────

export class InMemoryWorkflowDbAdapter implements WorkflowDbAdapter {
  // Storage
  readonly workflowInstances: Map<string, WorkflowInstanceRow>   = new Map()
  readonly phaseHistory:       PhaseHistoryRow[]                  = []
  readonly templates:          Map<string, WorkflowTemplateRow>   = new Map()
  readonly tasks:              Map<string, TaskRow>               = new Map()
  readonly auditLogs:          AuditLogRow[]                      = []
  readonly escalationPolicies: EscalationPolicyRow[]              = [...SEED_ESCALATION_POLICIES]
  readonly escalationSteps:    EscalationPolicyStepRow[]          = [...SEED_ESCALATION_STEPS]
  readonly escalationEvents:   EscalationEventRow[]               = []
  readonly outbox:             NotificationOutboxRow[]            = []
  readonly inAppNotifications: InAppNotificationToCreate[]        = []
  readonly taskDependencies:   TaskDependencyRow[]                = []
  readonly obligations:        Map<string, ObligationRow>         = new Map()
  readonly users:              Map<string, UserRow>               = new Map()

  constructor() {
    // Seed templates
    SEED_TEMPLATES.forEach(t => this.templates.set(t.workflow_template_id, t))
    // Seed users
    SEED_USERS.forEach(u => this.users.set(u.id, u))
  }

  // ── Workflow Instances ────────────────────────────────────────────────────

  async loadWorkflowInstance(id: string): Promise<WorkflowInstanceRow> {
    const wf = this.workflowInstances.get(id)
    if (!wf) throw new WorkflowNotFound(id)
    return { ...wf }
  }

  async updateWorkflowInstance(
    id:     string,
    update: Partial<WorkflowInstanceUpdate>
  ): Promise<WorkflowInstanceRow> {
    const wf = this.workflowInstances.get(id)
    if (!wf) throw new WorkflowNotFound(id)
    const updated = { ...wf, ...update }
    this.workflowInstances.set(id, updated)
    return { ...updated }
  }

  async loadWorkflowsForTenant(tenantId: string): Promise<WorkflowInstanceRow[]> {
    return Array.from(this.workflowInstances.values())
      .filter(wf => wf.tenant_id === tenantId)
      .map(wf => ({ ...wf }))
  }

  // ── Phase History ─────────────────────────────────────────────────────────

  async appendPhaseHistory(row: PhaseHistoryToCreate): Promise<PhaseHistoryRow> {
    const entry: PhaseHistoryRow = {
      history_id:           randomUUID(),
      workflow_instance_id: row.workflow_instance_id,
      phase:                row.phase,
      substate:             row.substate,
      entered_at:           row.entered_at,
      exited_at:            null,
      exit_reason:          null,
    }
    this.phaseHistory.push(entry)
    return { ...entry }
  }

  async closePhaseHistory(
    workflowInstanceId: string,
    phase:              string,
    exitReason?:        string
  ): Promise<void> {
    const now   = new Date()
    const entry = [...this.phaseHistory]
      .reverse()
      .find(h => h.workflow_instance_id === workflowInstanceId && h.phase === phase && !h.exited_at)
    if (entry) {
      entry.exited_at   = now
      entry.exit_reason = exitReason ?? null
    }
  }

  // ── Workflow Templates ────────────────────────────────────────────────────

  async loadWorkflowTemplate(id: string): Promise<WorkflowTemplateRow> {
    const t = this.templates.get(id)
    if (!t) throw new Error(`WorkflowTemplateNotFound: ${id}`)
    return { ...t, active_phases: [...t.active_phases], document_requirements: [...t.document_requirements] }
  }

  // ── Tasks ─────────────────────────────────────────────────────────────────

  async loadTasksForPhase(workflowInstanceId: string, phase: string): Promise<TaskRow[]> {
    return Array.from(this.tasks.values())
      .filter(t => t.workflow_instance_id === workflowInstanceId && t.phase === phase)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(t => ({ ...t }))
  }

  async loadTasksForWorkflow(workflowInstanceId: string): Promise<TaskRow[]> {
    return Array.from(this.tasks.values())
      .filter(t => t.workflow_instance_id === workflowInstanceId)
      .map(t => ({ ...t }))
  }

  async loadTask(taskId: string): Promise<TaskRow> {
    const t = this.tasks.get(taskId)
    if (!t) throw new TaskNotFound(taskId)
    return { ...t }
  }

  async createTask(task: TaskToCreate): Promise<TaskRow> {
    const row: TaskRow = {
      task_id:               randomUUID(),
      workflow_instance_id:  task.workflow_instance_id,
      obligation_id:         task.obligation_id,
      tenant_id:             task.tenant_id,
      phase:                 task.phase,
      task_type:             task.task_type,
      title:                 task.title,
      description:           task.description,
      status:                'pending',
      assigned_to_user_id:   null,
      due_date:              task.due_date,
      sort_order:            task.sort_order,
      is_hard_prerequisite:  task.is_hard_prerequisite,
      blocked_reason:        null,
      completed_at:          null,
      cancelled_at:          null,
      created_at:            new Date(),
      demo_session_id:       task.demo_session_id,
      demo_expires_at:       task.demo_expires_at,
    }
    this.tasks.set(row.task_id, row)
    return { ...row }
  }

  async updateTask(taskId: string, update: Partial<TaskUpdate>): Promise<TaskRow> {
    const t = this.tasks.get(taskId)
    if (!t) throw new TaskNotFound(taskId)
    const updated: TaskRow = { ...t, ...update }
    this.tasks.set(taskId, updated)
    return { ...updated }
  }

  // ── Task Dependencies ─────────────────────────────────────────────────────

  async loadTaskDependencies(
    taskId:    string,
    direction: 'upstream' | 'downstream'
  ): Promise<TaskDependencyRow[]> {
    return this.taskDependencies
      .filter(d =>
        direction === 'downstream'
          ? d.downstream_task_id === taskId
          : d.upstream_task_id === taskId
      )
      .map(d => ({ ...d }))
  }

  async loadAllDependenciesForWorkflow(workflowInstanceId: string): Promise<TaskDependencyRow[]> {
    return this.taskDependencies
      .filter(d => d.workflow_instance_id === workflowInstanceId)
      .map(d => ({ ...d }))
  }

  async createTaskDependency(dep: TaskDependencyToCreate): Promise<TaskDependencyRow> {
    const existing = this.taskDependencies.find(
      d => d.upstream_task_id === dep.upstream_task_id &&
           d.downstream_task_id === dep.downstream_task_id
    )
    if (existing) throw new Error(`DuplicateDependency: ${dep.upstream_task_id}→${dep.downstream_task_id}`)

    const row: TaskDependencyRow = {
      task_dependency_id:   randomUUID(),
      workflow_instance_id: dep.workflow_instance_id,
      tenant_id:            dep.tenant_id,
      upstream_task_id:     dep.upstream_task_id,
      downstream_task_id:   dep.downstream_task_id,
      dependency_type:      dep.dependency_type,
      created_by_user_id:   dep.created_by_user_id,
      created_at:           new Date(),
    }
    this.taskDependencies.push(row)
    return { ...row }
  }

  // ── Audit Log ─────────────────────────────────────────────────────────────

  async appendAuditLog(events: AuditEventToCreate[]): Promise<string[]> {
    const ids: string[] = []
    for (const e of events) {
      const row: AuditLogRow = {
        log_id:        randomUUID(),
        entity_type:   e.entity_type,
        entity_id:     e.entity_id,
        tenant_id:     e.tenant_id,
        actor_type:    e.actor_type,
        actor_user_id: e.actor_user_id,
        event_type:    e.event_type,
        from_state:    e.from_state,
        to_state:      e.to_state,
        reason:        e.reason,
        metadata:      e.metadata,
        created_at:    new Date(),
      }
      this.auditLogs.push(row)
      ids.push(row.log_id)
    }
    return ids
  }

  async getAuditLog(entityType: EntityType, entityId: string): Promise<AuditLogRow[]> {
    return this.auditLogs
      .filter(l => l.entity_type === entityType && l.entity_id === entityId)
      .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
      .map(l => ({ ...l }))
  }

  // ── Obligations ───────────────────────────────────────────────────────────

  async loadObligation(id: string): Promise<ObligationRow> {
    const o = this.obligations.get(id)
    if (!o) throw new Error(`ObligationNotFound: ${id}`)
    return { ...o }
  }

  async updateObligationStatus(id: string, status: ObligationStatus): Promise<void> {
    const o = this.obligations.get(id)
    if (o) {
      this.obligations.set(id, { ...o, status })
    }
  }

  async loadActiveObligations(_tenantId?: string): Promise<ObligationWithTemplate[]> {
    const tenantId  = _tenantId
    const activeStatuses: ObligationStatus[] = ['upcoming', 'due_soon', 'overdue']

    return Array.from(this.obligations.values())
      .filter(o => {
        if (tenantId && o.tenant_id !== tenantId) return false
        return activeStatuses.includes(o.status)
      })
      .map(o => {
        const wf = Array.from(this.workflowInstances.values())
          .find(w => w.obligation_id === o.obligation_id) ?? null
        const template = wf ? this.templates.get(wf.workflow_template_id) ?? null : null
        return {
          obligation:       { ...o },
          workflowTemplate: template ? { ...template } : null,
          workflowInstance: wf ? { ...wf } : null,
        }
      })
  }

  async cancelPendingReminders(obligationId: string): Promise<void> {
    this.outbox.forEach(row => {
      if (row.related_obligation_id === obligationId && row.status === 'pending') {
        row.status = 'cancelled'
      }
    })
  }

  // ── Escalation ────────────────────────────────────────────────────────────

  async loadActiveEscalationPolicies(_tenantId?: string): Promise<EscalationPolicyRow[]> {
    return this.escalationPolicies.filter(p => p.is_active).map(p => ({ ...p }))
  }

  async loadEscalationPolicySteps(policyId: string): Promise<EscalationPolicyStepRow[]> {
    return this.escalationSteps
      .filter(s => s.policy_id === policyId)
      .sort((a, b) => a.step_number - b.step_number)
      .map(s => ({ ...s }))
  }

  async createEscalationEvent(event: EscalationEventToCreate): Promise<EscalationEventRow> {
    const row: EscalationEventRow = {
      escalation_event_id: randomUUID(),
      policy_id:           event.policy_id,
      step_id:             event.step_id,
      obligation_id:       event.obligation_id,
      workflow_instance_id: event.workflow_instance_id,
      task_id:             event.task_id,
      tenant_id:           event.tenant_id,
      notified_user_ids:   event.notified_user_ids,
      trigger_snapshot:    event.trigger_snapshot,
      cooldown_until:      event.cooldown_until,
      acknowledged_at:     null,
      acknowledged_by:     null,
      created_at:          new Date(),
    }
    this.escalationEvents.push(row)
    return { ...row }
  }

  async getLastEscalationEvent(
    entityId: string,
    policyId: string
  ): Promise<EscalationEventRow | null> {
    const matching = this.escalationEvents
      .filter(e =>
        e.policy_id === policyId &&
        (e.obligation_id === entityId ||
          e.workflow_instance_id === entityId ||
          e.task_id === entityId)
      )
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())

    return matching[0] ? { ...matching[0] } : null
  }

  async loadOverdueTasks(_tenantId?: string): Promise<TaskRow[]> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return Array.from(this.tasks.values())
      .filter(t => {
        if (_tenantId && t.tenant_id !== _tenantId) return false
        if (['completed', 'cancelled'].includes(t.status)) return false
        if (!t.due_date) return false
        return new Date(t.due_date) < today
      })
      .map(t => ({ ...t }))
  }

  async loadBlockedWorkflows(thresholdDays: number, _tenantId?: string): Promise<WorkflowInstanceRow[]> {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - thresholdDays)
    return Array.from(this.workflowInstances.values())
      .filter(wf => {
        if (_tenantId && wf.tenant_id !== _tenantId) return false
        if (wf.status !== 'blocked') return false
        return wf.substate_entered_at <= cutoff
      })
      .map(wf => ({ ...wf }))
  }

  async loadStagnantWorkflows(thresholdDays: number, _tenantId?: string): Promise<WorkflowInstanceRow[]> {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - thresholdDays)
    return Array.from(this.workflowInstances.values())
      .filter(wf => {
        if (_tenantId && wf.tenant_id !== _tenantId) return false
        if (wf.status !== 'active') return false
        return wf.substate_entered_at <= cutoff
      })
      .map(wf => ({ ...wf }))
  }

  // ── Notification Outbox ───────────────────────────────────────────────────

  async enqueueNotification(row: NotificationOutboxToCreate): Promise<NotificationOutboxRow> {
    const entry: NotificationOutboxRow = {
      outbox_id:                    randomUUID(),
      tenant_id:                    row.tenant_id,
      recipient_user_id:            row.recipient_user_id,
      recipient_email:              row.recipient_email,
      recipient_phone:              row.recipient_phone,
      channel:                      row.channel,
      notification_type:            row.notification_type,
      subject:                      row.subject,
      body_text:                    row.body_text,
      body_html:                    row.body_html,
      payload:                      row.payload,
      status:                       'pending',
      attempts:                     0,
      last_attempt_at:              null,
      last_error:                   null,
      sent_at:                      null,
      scheduled_for:                row.scheduled_for,
      created_at:                   new Date(),
      related_obligation_id:        row.related_obligation_id,
      related_workflow_instance_id: row.related_workflow_instance_id,
      related_task_id:              row.related_task_id,
    }
    this.outbox.push(entry)
    return { ...entry }
  }

  async checkReminderDedup(
    obligationId:     string,
    notificationType: string,
    date:             Date
  ): Promise<boolean> {
    const dateStr = date.toISOString().slice(0, 10)
    return this.outbox.some(row => {
      if (row.related_obligation_id !== obligationId) return false
      if (row.notification_type !== notificationType) return false
      if (row.status === 'cancelled') return false
      return row.created_at.toISOString().slice(0, 10) === dateStr
    })
  }

  async insertInAppNotification(row: InAppNotificationToCreate): Promise<void> {
    this.inAppNotifications.push({ ...row })
  }

  // ── Users ─────────────────────────────────────────────────────────────────

  async loadUsersForTenant(tenantId: string, minRole?: UserRole): Promise<UserRow[]> {
    return Array.from(this.users.values())
      .filter(u => {
        if (u.tenant_id !== tenantId) return false
        if (minRole && ROLE_RANK[u.role] < ROLE_RANK[minRole]) return false
        return true
      })
      .map(u => ({ ...u }))
  }

  async loadUser(userId: string): Promise<UserRow | null> {
    return this.users.get(userId) ? { ...this.users.get(userId)! } : null
  }

  // ── Test helpers ──────────────────────────────────────────────────────────

  /** Seed a workflow instance. Use in test setup. */
  seedWorkflowInstance(wf: WorkflowInstanceRow): void {
    this.workflowInstances.set(wf.workflow_instance_id, { ...wf })
  }

  /** Seed an obligation. Use in test setup. */
  seedObligation(o: ObligationRow): void {
    this.obligations.set(o.obligation_id, { ...o })
  }

  /** Seed additional workflow templates. */
  seedTemplate(t: WorkflowTemplateRow): void {
    this.templates.set(t.workflow_template_id, { ...t })
  }

  /** Seed a user. */
  seedUser(u: UserRow): void {
    this.users.set(u.id, { ...u })
  }
}
