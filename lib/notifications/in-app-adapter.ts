/**
 * InAppNotificationAdapter — Sprint 4
 *
 * Writes directly to the notifications table (in-app inbox).
 * No queue — immediate INSERT. Requires WorkflowDbAdapter for DB access.
 *
 * Channel routing: in_app → notifications table (no outbox)
 */

import type { NotificationAdapter, NotificationPayload } from './types'
import type { WorkflowDbAdapter } from '../workflow/types'

export class InAppNotificationAdapter implements NotificationAdapter {
  constructor(private readonly db: WorkflowDbAdapter) {}

  async send(payload: NotificationPayload): Promise<void> {
    if (payload.channel !== 'in_app') return
    if (!payload.companyId) {
      console.warn('[InAppNotificationAdapter] companyId missing — skipping in-app notification')
      return
    }

    for (const recipient of payload.recipients) {
      await this.db.insertInAppNotification({
        company_id:                   payload.companyId,
        recipient_user_id:            recipient.userId,
        notification_type:            payload.eventType,
        related_obligation_id:        payload.relatedObligationId    ?? null,
        related_workflow_instance_id: payload.relatedWorkflowInstanceId ?? null,
        related_task_id:              payload.relatedTaskId           ?? null,
        related_rule_version_id:      payload.relatedRuleVersionId    ?? null,
        message_rendered:             payload.bodyText,
        channel:                      'in_app',
      })
    }
  }

  async sendBatch(payloads: NotificationPayload[]): Promise<void> {
    for (const p of payloads) {
      await this.send(p)
    }
  }
}
