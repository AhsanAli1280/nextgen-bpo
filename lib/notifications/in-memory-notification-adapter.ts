/**
 * InMemoryNotificationAdapter — Sprint 4
 *
 * Test-only adapter. Records all sent notifications in memory for assertion.
 * Never throws. Replaces EmailAdapter + InAppAdapter in L1/L2 tests.
 *
 * Usage in tests:
 *   const notifier = new InMemoryNotificationAdapter()
 *   // ... run operations ...
 *   assert.ok(notifier.sent.some(p => p.eventType === 'task_assigned'))
 */

import type { NotificationAdapter, NotificationPayload } from './types'

export class InMemoryNotificationAdapter implements NotificationAdapter {
  readonly sent: NotificationPayload[] = []

  async send(payload: NotificationPayload): Promise<void> {
    this.sent.push({ ...payload })
  }

  async sendBatch(payloads: NotificationPayload[]): Promise<void> {
    for (const p of payloads) {
      this.sent.push({ ...p })
    }
  }

  /** Clear recorded notifications (useful between test cases). */
  clear(): void {
    this.sent.splice(0, this.sent.length)
  }

  /** Filter sent notifications by event type. */
  byEventType(eventType: NotificationPayload['eventType']): NotificationPayload[] {
    return this.sent.filter(p => p.eventType === eventType)
  }
}
