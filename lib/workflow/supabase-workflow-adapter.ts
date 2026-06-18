/**
 * SupabaseWorkflowDbAdapter — Sprint 5B / WS0
 *
 * Real implementation of the Sprint 4 `WorkflowDbAdapter` interface against Supabase
 * Postgres. Mirrors the semantics of `InMemoryWorkflowDbAdapter` exactly so the
 * frozen workflow services (WorkflowInstanceService, TaskGenerationService,
 * TaskAssignmentEngine, DependencyEngine, AuditTrailService) run unchanged in prod.
 *
 * This adapter contains NO business logic — it is pure persistence. All rule/deadline/
 * chain/phase/task logic stays in the existing services that consume this adapter.
 *
 * RLS enforces tenant isolation; pass a request-scoped (user-JWT) client for app calls
 * or a service-role client for Edge Functions / schedulers.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  WorkflowDbAdapter,
  WorkflowInstanceRow, WorkflowInstanceUpdate,
  PhaseHistoryRow, PhaseHistoryToCreate,
  WorkflowTemplateRow,
  TaskRow, TaskToCreate, TaskUpdate,
  TaskDependencyRow, TaskDependencyToCreate,
  AuditEventToCreate, AuditLogRow, EntityType,
  ObligationRow, ObligationStatus, ObligationWithTemplate,
  EscalationPolicyRow, EscalationPolicyStepRow,
  EscalationEventRow, EscalationEventToCreate,
  NotificationOutboxRow, NotificationOutboxToCreate, InAppNotificationToCreate,
  UserRow, UserRole,
  FilingAttemptRow, FilingAttemptToCreate,
} from './types';
import { WorkflowNotFound, TaskNotFound } from './types';

function coerce<T>(row: Record<string, unknown>, dateKeys: string[]): T {
  const o: Record<string, unknown> = { ...row };
  for (const k of dateKeys) if (o[k] != null) o[k] = new Date(o[k] as string);
  return o as T;
}
function coerceMany<T>(rows: Record<string, unknown>[] | null, dateKeys: string[]): T[] {
  return (rows ?? []).map((r) => coerce<T>(r, dateKeys));
}

const WI_DATES = ['substate_entered_at', 'cancelled_at', 'created_at', 'completed_at', 'demo_expires_at'];
const TASK_DATES = ['due_date', 'completed_at', 'cancelled_at', 'created_at', 'demo_expires_at'];
const PH_DATES = ['entered_at', 'exited_at'];
const OBL_DATES = ['trigger_date', 'computed_deadline', 'demo_expires_at', 'created_at'];
const AUDIT_DATES = ['created_at'];
const ESC_EVT_DATES = ['cooldown_until', 'acknowledged_at', 'created_at'];
const FILING_DATES = ['submitted_at', 'outcome_recorded_at'];
const ROLE_RANK: Record<UserRole, number> = { member: 0, admin: 1, owner: 2 };

export class SupabaseWorkflowDbAdapter implements WorkflowDbAdapter {
  constructor(private db: SupabaseClient) {}

  private async one<T>(table: string, idCol: string, id: string, dates: string[], notFound: () => Error): Promise<T> {
    const { data, error } = await this.db.from(table).select('*').eq(idCol, id).single();
    if (error || !data) throw notFound();
    return coerce<T>(data, dates);
  }

  // ── Workflow instances ──────────────────────────────────────────────────────
  async loadWorkflowInstance(id: string): Promise<WorkflowInstanceRow> {
    return this.one<WorkflowInstanceRow>('workflow_instances', 'workflow_instance_id', id, WI_DATES, () => new WorkflowNotFound(id));
  }
  async updateWorkflowInstance(id: string, update: Partial<WorkflowInstanceUpdate>): Promise<WorkflowInstanceRow> {
    const { data, error } = await this.db.from('workflow_instances').update(serializeDates(update)).eq('workflow_instance_id', id).select('*').single();
    if (error || !data) throw new WorkflowNotFound(id);
    return coerce<WorkflowInstanceRow>(data, WI_DATES);
  }
  async loadWorkflowsForTenant(tenantId: string): Promise<WorkflowInstanceRow[]> {
    const { data, error } = await this.db.from('workflow_instances').select('*').eq('tenant_id', tenantId);
    if (error) throw error;
    return coerceMany<WorkflowInstanceRow>(data, WI_DATES);
  }

  // ── Phase history ─────────────────────────────────────────────────────────
  async appendPhaseHistory(row: PhaseHistoryToCreate): Promise<PhaseHistoryRow> {
    const { data, error } = await this.db.from('workflow_phase_history').insert(serializeDates(row)).select('*').single();
    if (error || !data) throw error ?? new Error('appendPhaseHistory failed');
    return coerce<PhaseHistoryRow>(data, PH_DATES);
  }
  async closePhaseHistory(workflowInstanceId: string, phase: string, exitReason?: string): Promise<void> {
    const { error } = await this.db.from('workflow_phase_history')
      .update({ exited_at: new Date().toISOString(), exit_reason: exitReason ?? null })
      .eq('workflow_instance_id', workflowInstanceId).eq('phase', phase).is('exited_at', null);
    if (error) throw error;
  }

  // ── Templates ─────────────────────────────────────────────────────────────
  async loadWorkflowTemplate(id: string): Promise<WorkflowTemplateRow> {
    return this.one<WorkflowTemplateRow>('workflow_templates', 'workflow_template_id', id, ['created_at'], () => new Error(`WorkflowTemplateNotFound: ${id}`));
  }

  // ── Tasks ───────────────────────────────────────────────────────────────────
  async loadTasksForPhase(workflowInstanceId: string, phase: string): Promise<TaskRow[]> {
    const { data, error } = await this.db.from('tasks').select('*')
      .eq('workflow_instance_id', workflowInstanceId).eq('phase', phase).order('sort_order');
    if (error) throw error;
    return coerceMany<TaskRow>(data, TASK_DATES);
  }
  async loadTasksForWorkflow(workflowInstanceId: string): Promise<TaskRow[]> {
    const { data, error } = await this.db.from('tasks').select('*').eq('workflow_instance_id', workflowInstanceId).order('sort_order');
    if (error) throw error;
    return coerceMany<TaskRow>(data, TASK_DATES);
  }
  async loadTask(taskId: string): Promise<TaskRow> {
    return this.one<TaskRow>('tasks', 'task_id', taskId, TASK_DATES, () => new TaskNotFound(taskId));
  }
  async createTask(task: TaskToCreate): Promise<TaskRow> {
    const { data, error } = await this.db.from('tasks').insert(serializeDates(task)).select('*').single();
    if (error || !data) throw error ?? new Error('createTask failed');
    return coerce<TaskRow>(data, TASK_DATES);
  }
  async updateTask(taskId: string, update: Partial<TaskUpdate>): Promise<TaskRow> {
    const { data, error } = await this.db.from('tasks').update(serializeDates(update)).eq('task_id', taskId).select('*').single();
    if (error || !data) throw new TaskNotFound(taskId);
    return coerce<TaskRow>(data, TASK_DATES);
  }

  // ── Task dependencies ────────────────────────────────────────────────────
  async loadTaskDependencies(taskId: string, direction: 'upstream' | 'downstream'): Promise<TaskDependencyRow[]> {
    const col = direction === 'upstream' ? 'downstream_task_id' : 'upstream_task_id';
    const { data, error } = await this.db.from('task_dependencies').select('*').eq(col, taskId);
    if (error) throw error;
    return coerceMany<TaskDependencyRow>(data, ['created_at']);
  }
  async loadAllDependenciesForWorkflow(workflowInstanceId: string): Promise<TaskDependencyRow[]> {
    const { data, error } = await this.db.from('task_dependencies').select('*').eq('workflow_instance_id', workflowInstanceId);
    if (error) throw error;
    return coerceMany<TaskDependencyRow>(data, ['created_at']);
  }
  async createTaskDependency(dep: TaskDependencyToCreate): Promise<TaskDependencyRow> {
    const { data, error } = await this.db.from('task_dependencies').insert(dep).select('*').single();
    if (error || !data) throw error ?? new Error('createTaskDependency failed');
    return coerce<TaskDependencyRow>(data, ['created_at']);
  }

  // ── Audit log ───────────────────────────────────────────────────────────────
  async appendAuditLog(events: AuditEventToCreate[]): Promise<string[]> {
    if (events.length === 0) return [];
    const { data, error } = await this.db.from('task_audit_log').insert(events).select('log_id');
    if (error) throw error;
    return (data ?? []).map((r) => (r as { log_id: string }).log_id);
  }
  async getAuditLog(entityType: EntityType, entityId: string): Promise<AuditLogRow[]> {
    const { data, error } = await this.db.from('task_audit_log').select('*')
      .eq('entity_type', entityType).eq('entity_id', entityId).order('created_at');
    if (error) throw error;
    return coerceMany<AuditLogRow>(data, AUDIT_DATES);
  }

  // ── Obligations ──────────────────────────────────────────────────────────────
  async loadObligation(id: string): Promise<ObligationRow> {
    return this.one<ObligationRow>('obligations', 'obligation_id', id, OBL_DATES, () => new Error(`ObligationNotFound: ${id}`));
  }
  async updateObligationStatus(id: string, status: ObligationStatus): Promise<void> {
    const { error } = await this.db.from('obligations').update({ status }).eq('obligation_id', id);
    if (error) throw error;
  }
  async loadActiveObligations(tenantId?: string): Promise<ObligationWithTemplate[]> {
    let q = this.db.from('obligations').select('*').in('status', ['upcoming', 'due_soon', 'overdue']);
    if (tenantId) q = q.eq('tenant_id', tenantId);
    const { data, error } = await q;
    if (error) throw error;
    const obligations = coerceMany<ObligationRow>(data, OBL_DATES);
    const out: ObligationWithTemplate[] = [];
    for (const obligation of obligations) {
      const { data: wi } = await this.db.from('workflow_instances').select('*').eq('obligation_id', obligation.obligation_id).maybeSingle();
      const workflowInstance = wi ? coerce<WorkflowInstanceRow>(wi, WI_DATES) : null;
      let workflowTemplate: WorkflowTemplateRow | null = null;
      if (workflowInstance) {
        try { workflowTemplate = await this.loadWorkflowTemplate(workflowInstance.workflow_template_id); } catch { /* none */ }
      }
      out.push({ obligation, workflowTemplate, workflowInstance });
    }
    return out;
  }
  async cancelPendingReminders(obligationId: string): Promise<void> {
    const { error } = await this.db.from('notification_outbox').update({ status: 'cancelled' })
      .eq('related_obligation_id', obligationId).eq('status', 'pending');
    if (error) throw error;
  }

  // ── Filing attempts (frozen §17) ──────────────────────────────────────────
  async createFilingAttempt(input: FilingAttemptToCreate): Promise<FilingAttemptRow> {
    const { count } = await this.db.from('filing_attempts').select('*', { count: 'exact', head: true })
      .eq('obligation_id', input.obligation_id);
    const now = new Date().toISOString();
    const insert = {
      ...input,
      attempt_number: (count ?? 0) + 1,
      submitted_at: now,
      outcome_recorded_at: input.outcome === 'pending' ? null : now,
    };
    const { data, error } = await this.db.from('filing_attempts').insert(insert).select('*').single();
    if (error || !data) throw error ?? new Error('createFilingAttempt failed');
    return coerce<FilingAttemptRow>(data, FILING_DATES);
  }
  async loadFilingAttempts(obligationId: string): Promise<FilingAttemptRow[]> {
    const { data, error } = await this.db.from('filing_attempts').select('*')
      .eq('obligation_id', obligationId).order('attempt_number');
    if (error) throw error;
    return coerceMany<FilingAttemptRow>(data, FILING_DATES);
  }
  async setObligationCurrentFilingAttempt(obligationId: string, filingAttemptId: string): Promise<void> {
    const { error } = await this.db.from('obligations').update({ current_filing_attempt_id: filingAttemptId }).eq('obligation_id', obligationId);
    if (error) throw error;
  }

  // ── Escalation ────────────────────────────────────────────────────────────
  async loadActiveEscalationPolicies(tenantId?: string): Promise<EscalationPolicyRow[]> {
    let q = this.db.from('escalation_policies').select('*').eq('is_active', true);
    if (tenantId) q = q.or(`tenant_id.is.null,tenant_id.eq.${tenantId}`);
    const { data, error } = await q;
    if (error) throw error;
    return coerceMany<EscalationPolicyRow>(data, ['created_at']);
  }
  async loadEscalationPolicySteps(policyId: string): Promise<EscalationPolicyStepRow[]> {
    const { data, error } = await this.db.from('escalation_policy_steps').select('*').eq('policy_id', policyId).order('step_number');
    if (error) throw error;
    return coerceMany<EscalationPolicyStepRow>(data, ['created_at']);
  }
  async createEscalationEvent(event: EscalationEventToCreate): Promise<EscalationEventRow> {
    const { data, error } = await this.db.from('escalation_events').insert(serializeDates(event)).select('*').single();
    if (error || !data) throw error ?? new Error('createEscalationEvent failed');
    return coerce<EscalationEventRow>(data, ESC_EVT_DATES);
  }
  async getLastEscalationEvent(entityId: string, policyId: string): Promise<EscalationEventRow | null> {
    const { data, error } = await this.db.from('escalation_events').select('*')
      .eq('policy_id', policyId)
      .or(`obligation_id.eq.${entityId},workflow_instance_id.eq.${entityId},task_id.eq.${entityId}`)
      .order('created_at', { ascending: false }).limit(1).maybeSingle();
    if (error) throw error;
    return data ? coerce<EscalationEventRow>(data, ESC_EVT_DATES) : null;
  }
  async loadOverdueTasks(tenantId?: string): Promise<TaskRow[]> {
    let q = this.db.from('tasks').select('*')
      .lt('due_date', new Date().toISOString())
      .not('status', 'in', '("completed","cancelled")');
    if (tenantId) q = q.eq('tenant_id', tenantId);
    const { data, error } = await q;
    if (error) throw error;
    return coerceMany<TaskRow>(data, TASK_DATES);
  }
  async loadBlockedWorkflows(thresholdDays: number, tenantId?: string): Promise<WorkflowInstanceRow[]> {
    const cutoff = new Date(Date.now() - thresholdDays * 86400000).toISOString();
    let q = this.db.from('workflow_instances').select('*').eq('status', 'blocked').lte('substate_entered_at', cutoff);
    if (tenantId) q = q.eq('tenant_id', tenantId);
    const { data, error } = await q;
    if (error) throw error;
    return coerceMany<WorkflowInstanceRow>(data, WI_DATES);
  }
  async loadStagnantWorkflows(thresholdDays: number, tenantId?: string): Promise<WorkflowInstanceRow[]> {
    const cutoff = new Date(Date.now() - thresholdDays * 86400000).toISOString();
    let q = this.db.from('workflow_instances').select('*').eq('status', 'active').lte('substate_entered_at', cutoff);
    if (tenantId) q = q.eq('tenant_id', tenantId);
    const { data, error } = await q;
    if (error) throw error;
    return coerceMany<WorkflowInstanceRow>(data, WI_DATES);
  }

  // ── Notification outbox ──────────────────────────────────────────────────
  async enqueueNotification(row: NotificationOutboxToCreate): Promise<NotificationOutboxRow> {
    const { data, error } = await this.db.from('notification_outbox').insert(serializeDates(row)).select('*').single();
    if (error || !data) throw error ?? new Error('enqueueNotification failed');
    return coerce<NotificationOutboxRow>(data, ['last_attempt_at', 'sent_at', 'scheduled_for', 'created_at']);
  }
  async checkReminderDedup(obligationId: string, notificationType: string, date: Date): Promise<boolean> {
    const day = date.toISOString().slice(0, 10);
    const { data, error } = await this.db.from('notification_outbox').select('outbox_id')
      .eq('related_obligation_id', obligationId).eq('notification_type', notificationType)
      .neq('status', 'cancelled').gte('created_at', `${day}T00:00:00Z`).lte('created_at', `${day}T23:59:59Z`).limit(1);
    if (error) throw error;
    return (data ?? []).length > 0; // true = already sent (dedup hit)
  }
  async insertInAppNotification(row: InAppNotificationToCreate): Promise<void> {
    const { error } = await this.db.from('notifications').insert(row);
    if (error) throw error;
  }

  // ── Users ─────────────────────────────────────────────────────────────────
  async loadUsersForTenant(tenantId: string, minRole?: UserRole): Promise<UserRow[]> {
    const { data, error } = await this.db.from('users').select('*').eq('tenant_id', tenantId);
    if (error) throw error;
    let users = coerceMany<UserRow>(data, ['created_at']);
    if (minRole) users = users.filter((u) => ROLE_RANK[u.role] >= ROLE_RANK[minRole]);
    return users;
  }
  async loadUser(userId: string): Promise<UserRow | null> {
    const { data, error } = await this.db.from('users').select('*').eq('id', userId).maybeSingle();
    if (error) throw error;
    return data ? coerce<UserRow>(data, ['created_at']) : null;
  }
}

// Convert Date values to ISO strings for write payloads (Supabase expects strings).
function serializeDates<T extends object>(obj: T): Record<string, unknown> {
  const o: Record<string, unknown> = { ...(obj as Record<string, unknown>) };
  for (const k of Object.keys(o)) if (o[k] instanceof Date) o[k] = (o[k] as Date).toISOString();
  return o;
}

export function createSupabaseWorkflowAdapter(client: SupabaseClient): SupabaseWorkflowDbAdapter {
  return new SupabaseWorkflowDbAdapter(client);
}
