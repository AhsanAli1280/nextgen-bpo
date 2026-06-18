/**
 * Sprint 4 — Notification Abstraction Layer Types
 *
 * NotificationAdapter interface + payload types. Callers never reference
 * email/WhatsApp directly — always through NotificationAdapter.
 * Swapping channels requires no caller changes.
 *
 * Channel routing:
 *   email    → notification_outbox → notification-dispatcher Edge Function
 *   in_app   → direct INSERT to notifications table (no queue)
 *   whatsapp → stub (throws NotImplemented in V1)
 */

export type NotificationChannel = 'email' | 'in_app' | 'whatsapp' | 'sms'

// Exhaustive union — every switch on NotificationEventType must handle all cases.
// TypeScript exhaustive check enforced in composite-adapter.ts.
export type NotificationEventType =
  // Obligation lifecycle
  | 'deadline_approaching'
  | 'deadline_overdue'
  | 'obligation_recalculated'
  // Rule changes (Sprint 3)
  | 'rule_changed'
  // Task lifecycle
  | 'task_assigned'
  | 'task_due_soon'
  | 'task_overdue'
  | 'task_rejected'
  // Workflow lifecycle
  | 'workflow_phase_changed'
  | 'workflow_blocked'
  | 'workflow_completed'
  // Escalation
  | 'escalation_triggered'
  // Filing
  | 'filing_outcome'
  // Dependency
  | 'dependency_satisfied'

export interface NotificationRecipient {
  userId: string
  email:  string
  phone?: string
}

export interface NotificationPayload {
  tenantId:      string
  companyId?:    string
  recipients:    NotificationRecipient[]
  eventType:     NotificationEventType
  channel:       NotificationChannel
  subject:       string
  bodyText:      string
  bodyHtml?:     string
  scheduledFor?: Date
  metadata:      Record<string, unknown>

  // Source linkage — optional FKs for notification_outbox / notifications table
  relatedObligationId?:        string
  relatedWorkflowInstanceId?:  string
  relatedTaskId?:              string
  relatedRuleVersionId?:       string
}

export interface NotificationAdapter {
  send(payload: NotificationPayload): Promise<void>
  sendBatch(payloads: NotificationPayload[]): Promise<void>
}

// ── Custom errors ─────────────────────────────────────────────────────────────

export class NotImplementedNotificationChannel extends Error {
  constructor(channel: string) {
    super(`NotImplementedNotificationChannel: "${channel}" is not implemented in V1`)
  }
}

export class NotificationSendError extends Error {
  readonly cause: unknown
  constructor(channel: string, cause: unknown) {
    super(`NotificationSendError: failed to send via ${channel}`)
    this.cause = cause
  }
}
