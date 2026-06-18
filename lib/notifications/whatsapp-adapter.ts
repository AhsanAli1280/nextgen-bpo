/**
 * WhatsAppNotificationAdapter — Sprint 4
 *
 * V1 stub — interface compliance only. All calls throw NotImplemented.
 * V2: wraps WhatsApp Business Cloud API via Meta.
 *
 * Per SPRINT_4_ARCHITECTURE.md §5.5 and WORKFLOW_STATE_MACHINE.md §7:
 *   "WhatsApp channel not implemented in V1"
 */

import type { NotificationAdapter, NotificationPayload } from './types'
import { NotImplementedNotificationChannel } from './types'

export class WhatsAppNotificationAdapter implements NotificationAdapter {
  async send(_payload: NotificationPayload): Promise<void> {
    throw new NotImplementedNotificationChannel('whatsapp')
  }

  async sendBatch(_payloads: NotificationPayload[]): Promise<void> {
    throw new NotImplementedNotificationChannel('whatsapp')
  }
}
