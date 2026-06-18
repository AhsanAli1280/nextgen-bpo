/**
 * Sprint 4 — Workflow Runtime Types
 *
 * All TypeScript types for workflow instances, tasks, escalation, audit log,
 * and the WorkflowDbAdapter interface. Parallel to Sprint 3 lib/rule-engine/types.ts.
 * Do NOT extend DbAdapter — these are independent interfaces.
 *
 * State machine authority: WORKFLOW_STATE_MACHINE.md (overrides SPRINT_4_ARCHITECTURE.md)
 */

// ── Primitive enums ───────────────────────────────────────────────────────────

export type WorkflowStatus = 'draft' | 'active' | 'blocked' | 'completed' | 'cancelled'

export type WorkflowPhase =
  | 'Not Started'
  | 'Drafting & Collection'
  | 'Internal Approval'
  | 'Filing Submitted'
  | 'Third-Party Verification'
  | 'Regulator Review'
  | 'Completed'
  | 'Blocked'

export type TaskStatus =
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'rejected'
  | 'reopened'
  | 'cancelled'

export type TaskType =
  | 'collect_document'
  | 'prepare_draft'
  | 'board_resolution'
  | 'special_resolution'
  | 'submit_filing'
  | 'record_reference'
  | 'await_verification'
  | 'await_regulator'
  | 'resolve_blocker'
  | 'record_completion'

export type ActorType = 'user' | 'system' | 'escalation' | 'scheduler'

export type EntityType = 'task' | 'workflow_instance'

export type AuditEventType =
  // Task lifecycle
  | 'task_created'
  | 'task_assigned'
  | 'task_unassigned'
  | 'task_reassigned'
  | 'task_started'
  | 'task_completed'
  | 'task_rejected'
  | 'task_reopened'
  | 'task_cancelled'
  // Workflow lifecycle
  | 'workflow_created'
  | 'phase_advanced'
  | 'phase_reverted'
  | 'workflow_blocked'
  | 'workflow_unblocked'
  | 'workflow_completed'
  | 'workflow_cancelled'
  // Dependency events
  | 'dependency_blocked'
  | 'dependency_satisfied'
  // Escalation events
  | 'escalation_triggered'
  | 'escalation_acknowledged'

export type EscalationTriggerCondition =
  | 'obligation_overdue'
  | 'task_overdue'
  | 'workflow_blocked_n_days'
  | 'no_phase_progress_n_days'

export type DependencyType = 'finish_to_start' | 'finish_to_finish'

export type UserRole = 'owner' | 'admin' | 'member'

export type ObligationStatus =
  | 'upcoming'
  | 'due_soon'
  | 'overdue'
  | 'filed'
  | 'not_applicable'
  | 'superseded'

export type ApprovalRequirementType = 'board_resolution' | 'special_resolution' | 'none'

// ── DB Row types ──────────────────────────────────────────────────────────────

export interface WorkflowInstanceRow {
  workflow_instance_id: string
  obligation_id:        string | null
  event_instance_id:    string | null
  workflow_template_id: string
  tenant_id:            string
  current_phase:        WorkflowPhase
  status:               WorkflowStatus
  current_substate:     string | null
  substate_entered_at:  Date
  blocked_reason:       string | null
  phase_before_block:   string | null
  assigned_to_user_id:  string | null
  cancelled_at:         Date | null
  cancelled_reason:     string | null
  created_at:           Date
  completed_at:         Date | null
  demo_session_id:      string | null
  demo_expires_at:      Date | null
}

export interface DocumentRequirement {
  document_type:       string
  title:               string
  is_hard_prerequisite: boolean
  description?:        string
}

export interface WorkflowTemplateRow {
  workflow_template_id:      string
  obligation_template_id:    string
  name:                      string
  active_phases:             string[]
  approval_requirement_type: ApprovalRequirementType
  document_requirements:     DocumentRequirement[]
  recurrence_type:           'one_off' | 'fixed_date_recurring' | 'process_anchored_recurring'
  alert_lead_times:          number[]
  created_at:                Date
}

export interface TaskRow {
  task_id:               string
  workflow_instance_id:  string
  obligation_id:         string | null
  tenant_id:             string
  phase:                 string
  task_type:             TaskType
  title:                 string
  description:           string | null
  status:                TaskStatus
  assigned_to_user_id:   string | null
  due_date:              Date | null
  sort_order:            number
  is_hard_prerequisite:  boolean
  blocked_reason:        string | null
  completed_at:          Date | null
  cancelled_at:          Date | null
  created_at:            Date
  demo_session_id:       string | null
  demo_expires_at:       Date | null
}

export interface PhaseHistoryRow {
  history_id:           string
  workflow_instance_id: string
  phase:                string
  substate:             string | null
  entered_at:           Date
  exited_at:            Date | null
  exit_reason:          string | null
}

export interface AuditLogRow {
  log_id:        string
  entity_type:   EntityType
  entity_id:     string
  tenant_id:     string
  actor_type:    ActorType
  actor_user_id: string | null
  event_type:    AuditEventType
  from_state:    string | null
  to_state:      string
  reason:        string | null
  metadata:      Record<string, unknown>
  created_at:    Date
}

export interface EscalationPolicyRow {
  policy_id:            string
  company_id:           string | null
  tenant_id:            string | null
  workflow_template_id: string | null
  trigger_condition:    EscalationTriggerCondition
  threshold_days:       number
  cooldown_hours:       number
  is_active:            boolean
  created_at:           Date
}

export interface EscalationPolicyStepRow {
  step_id:                    string
  policy_id:                  string
  step_number:                number
  delay_hours:                number
  escalate_to_role:           UserRole
  notify_channel:             string[]
  requires_acknowledgement:   boolean
  created_at:                 Date
}

export interface EscalationEventRow {
  escalation_event_id:  string
  policy_id:            string
  step_id:              string | null
  obligation_id:        string | null
  workflow_instance_id: string | null
  task_id:              string | null
  tenant_id:            string
  notified_user_ids:    string[]
  trigger_snapshot:     Record<string, unknown>
  cooldown_until:       Date
  acknowledged_at:      Date | null
  acknowledged_by:      string | null
  created_at:           Date
}

export interface NotificationOutboxRow {
  outbox_id:                    string
  tenant_id:                    string
  recipient_user_id:            string
  recipient_email:              string | null
  recipient_phone:              string | null
  channel:                      'email' | 'whatsapp' | 'sms'
  notification_type:            string
  subject:                      string | null
  body_text:                    string
  body_html:                    string | null
  payload:                      Record<string, unknown>
  status:                       'pending' | 'sending' | 'sent' | 'failed' | 'cancelled'
  attempts:                     number
  last_attempt_at:              Date | null
  last_error:                   string | null
  sent_at:                      Date | null
  scheduled_for:                Date
  created_at:                   Date
  related_obligation_id:        string | null
  related_workflow_instance_id: string | null
  related_task_id:              string | null
}

export interface TaskDependencyRow {
  task_dependency_id:   string
  workflow_instance_id: string
  tenant_id:            string
  upstream_task_id:     string
  downstream_task_id:   string
  dependency_type:      DependencyType
  created_by_user_id:   string | null
  created_at:           Date
}

export interface UserRow {
  id:         string
  tenant_id:  string
  email:      string
  full_name:  string | null
  role:       UserRole
  created_at: Date
}

export interface ObligationRow {
  obligation_id:        string
  rule_version_id:      string
  company_id:           string
  tenant_id:            string
  event_type_id:        string | null
  trigger_date:         Date
  computed_deadline:    Date
  status:               ObligationStatus
  linked_obligation_id: string | null
  assigned_to_user_id:  string | null
  demo_session_id:      string | null
  demo_expires_at:      Date | null
  created_at:           Date
}

export interface ObligationWithTemplate {
  obligation:       ObligationRow
  workflowTemplate: WorkflowTemplateRow | null
  workflowInstance: WorkflowInstanceRow | null
}

// ── "To create" input types ───────────────────────────────────────────────────

export interface TaskToCreate {
  workflow_instance_id: string
  obligation_id:        string | null
  tenant_id:            string
  phase:                string
  task_type:            TaskType
  title:                string
  description:          string | null
  is_hard_prerequisite: boolean
  sort_order:           number
  due_date:             Date | null
  demo_session_id:      string | null
  demo_expires_at:      Date | null
}

export interface PhaseHistoryToCreate {
  workflow_instance_id: string
  phase:                string
  substate:             string | null
  entered_at:           Date
}

export interface AuditEventToCreate {
  entity_type:    EntityType
  entity_id:      string
  tenant_id:      string
  actor_type:     ActorType
  actor_user_id:  string | null
  event_type:     AuditEventType
  from_state:     string | null
  to_state:       string
  reason:         string | null
  metadata:       Record<string, unknown>
}

export interface EscalationEventToCreate {
  policy_id:            string
  step_id:              string | null
  obligation_id:        string | null
  workflow_instance_id: string | null
  task_id:              string | null
  tenant_id:            string
  notified_user_ids:    string[]
  trigger_snapshot:     Record<string, unknown>
  cooldown_until:       Date
}

export interface NotificationOutboxToCreate {
  tenant_id:                    string
  recipient_user_id:            string
  recipient_email:              string | null
  recipient_phone:              string | null
  channel:                      'email' | 'whatsapp' | 'sms'
  notification_type:            string
  subject:                      string | null
  body_text:                    string
  body_html:                    string | null
  payload:                      Record<string, unknown>
  scheduled_for:                Date
  related_obligation_id:        string | null
  related_workflow_instance_id: string | null
  related_task_id:              string | null
}

export interface InAppNotificationToCreate {
  company_id:                   string
  recipient_user_id:            string
  notification_type:            string
  related_obligation_id:        string | null
  related_workflow_instance_id: string | null
  related_task_id:              string | null
  related_rule_version_id:      string | null
  message_rendered:             string
  channel:                      'in_app'
}

export interface TaskDependencyToCreate {
  workflow_instance_id: string
  tenant_id:            string
  upstream_task_id:     string
  downstream_task_id:   string
  dependency_type:      DependencyType
  created_by_user_id:   string | null
}

export interface WorkflowInstanceUpdate {
  current_phase:      WorkflowPhase
  status:             WorkflowStatus
  blocked_reason:     string | null
  phase_before_block: string | null
  cancelled_at:       Date | null
  cancelled_reason:   string | null
  completed_at:       Date | null
  substate_entered_at: Date
}

export interface TaskUpdate {
  status:             TaskStatus
  assigned_to_user_id: string | null
  completed_at:       Date | null
  cancelled_at:       Date | null
  blocked_reason:     string | null
}

// ── Service result types ──────────────────────────────────────────────────────

export interface TaskSpec {
  task_type:            TaskType
  title:                string
  description:          string | null
  is_hard_prerequisite: boolean
  sort_order:           number
}

export interface PhaseAdvanceResult {
  workflowInstance: WorkflowInstanceRow
  generatedTasks:   TaskRow[]
  auditLogIds:      string[]
}

export interface AssignmentResult {
  taskId:           string
  assignedUserId:   string | null
  assignmentSource: 'obligation' | 'workflow' | 'unassigned'
}

// ── WorkflowDbAdapter interface ───────────────────────────────────────────────
// Parallel to Sprint 3 DbAdapter. Independent — do NOT extend DbAdapter.

export interface WorkflowDbAdapter {
  // ── Workflow instances
  loadWorkflowInstance(id: string): Promise<WorkflowInstanceRow>
  updateWorkflowInstance(id: string, update: Partial<WorkflowInstanceUpdate>): Promise<WorkflowInstanceRow>
  loadWorkflowsForTenant(tenantId: string): Promise<WorkflowInstanceRow[]>

  // ── Phase history
  appendPhaseHistory(row: PhaseHistoryToCreate): Promise<PhaseHistoryRow>
  closePhaseHistory(workflowInstanceId: string, phase: string, exitReason?: string): Promise<void>

  // ── Workflow templates
  loadWorkflowTemplate(id: string): Promise<WorkflowTemplateRow>

  // ── Tasks
  loadTasksForPhase(workflowInstanceId: string, phase: string): Promise<TaskRow[]>
  loadTasksForWorkflow(workflowInstanceId: string): Promise<TaskRow[]>
  loadTask(taskId: string): Promise<TaskRow>
  createTask(task: TaskToCreate): Promise<TaskRow>
  updateTask(taskId: string, update: Partial<TaskUpdate>): Promise<TaskRow>

  // ── Task dependencies
  loadTaskDependencies(taskId: string, direction: 'upstream' | 'downstream'): Promise<TaskDependencyRow[]>
  loadAllDependenciesForWorkflow(workflowInstanceId: string): Promise<TaskDependencyRow[]>
  createTaskDependency(dep: TaskDependencyToCreate): Promise<TaskDependencyRow>

  // ── Audit log
  appendAuditLog(events: AuditEventToCreate[]): Promise<string[]>
  getAuditLog(entityType: EntityType, entityId: string): Promise<AuditLogRow[]>

  // ── Obligations
  loadObligation(id: string): Promise<ObligationRow>
  updateObligationStatus(id: string, status: ObligationStatus): Promise<void>
  loadActiveObligations(tenantId?: string): Promise<ObligationWithTemplate[]>
  cancelPendingReminders(obligationId: string): Promise<void>

  // ── Escalation
  loadActiveEscalationPolicies(tenantId?: string): Promise<EscalationPolicyRow[]>
  loadEscalationPolicySteps(policyId: string): Promise<EscalationPolicyStepRow[]>
  createEscalationEvent(event: EscalationEventToCreate): Promise<EscalationEventRow>
  getLastEscalationEvent(entityId: string, policyId: string): Promise<EscalationEventRow | null>
  loadOverdueTasks(tenantId?: string): Promise<TaskRow[]>
  loadBlockedWorkflows(thresholdDays: number, tenantId?: string): Promise<WorkflowInstanceRow[]>
  loadStagnantWorkflows(thresholdDays: number, tenantId?: string): Promise<WorkflowInstanceRow[]>

  // ── Notification outbox
  enqueueNotification(row: NotificationOutboxToCreate): Promise<NotificationOutboxRow>
  checkReminderDedup(obligationId: string, notificationType: string, date: Date): Promise<boolean>
  insertInAppNotification(row: InAppNotificationToCreate): Promise<void>

  // ── Users
  loadUsersForTenant(tenantId: string, minRole?: UserRole): Promise<UserRow[]>
  loadUser(userId: string): Promise<UserRow | null>
}

// ── Custom error types ────────────────────────────────────────────────────────

export class WorkflowNotFound extends Error {
  constructor(id: string) { super(`WorkflowNotFound: ${id}`) }
}

export class TaskNotFound extends Error {
  constructor(id: string) { super(`TaskNotFound: ${id}`) }
}

export class PhaseAdvanceBlocked extends Error {
  constructor(taskTitle: string, taskId: string) {
    super(`PhaseAdvanceBlocked: hard prerequisite task "${taskTitle}" (${taskId}) is not completed`)
  }
}

export class InvalidPhaseTransition extends Error {
  constructor(from: string, to: string, reason?: string) {
    super(`InvalidPhaseTransition: ${from} → ${to}${reason ? ` — ${reason}` : ''}`)
  }
}

export class InvalidWorkflowTransition extends Error {
  constructor(from: string, to: string, reason?: string) {
    super(`InvalidWorkflowTransition: status ${from} → ${to}${reason ? ` — ${reason}` : ''}`)
  }
}

export class CannotRevertFromFirstPhase extends Error {
  constructor() { super('CannotRevertFromFirstPhase: already at the first active phase') }
}

export class TaskDependencyNotSatisfied extends Error {
  constructor(upstreamTaskId: string, depType: DependencyType) {
    super(`TaskDependencyNotSatisfied: upstream ${upstreamTaskId} not completed (${depType})`)
  }
}

export class CircularDependencyDetected extends Error {
  constructor(upstream: string, downstream: string) {
    super(`CircularDependencyDetected: adding ${upstream}→${downstream} would create a cycle`)
  }
}

export class DependencyChainTooDeep extends Error {
  constructor() { super('DependencyChainTooDeep: dependency chain exceeds maximum depth of 10') }
}

export class CrossWorkflowDependencyNotSupported extends Error {
  constructor() { super('CrossWorkflowDependencyNotSupported: both tasks must share the same workflow_instance_id') }
}

export class UserNotInTenant extends Error {
  constructor(userId: string, tenantId: string) {
    super(`UserNotInTenant: user ${userId} is not a member of tenant ${tenantId}`)
  }
}

export class ReasonRequired extends Error {
  constructor(operation: string) { super(`ReasonRequired: a reason is required for "${operation}"`) }
}
