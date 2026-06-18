/**
 * CompositeNotificationAdapter — Sprint 4
 *
 * Fan-out: sends payload to N adapters. Partial failure resilient.
 * If one adapter fails, others continue. Errors are collected and logged.
 * Never throws to the caller (WF-09 acceptance criterion).
 *
 * Canonical usage:
 *   const notifier = new CompositeNotificationAdapter([
 *     new EmailNotificationAdapter(),
 *     new InAppNotificationAdapter(db),
 *   ])
 *
 * In tests:
 *   const notifier = new InMemoryNotificationAdapter()
 */

import type { NotificationAdapter, NotificationPayload } from './types'

export class CompositeNotificationAdapter implements NotificationAdapter {
  constructor(private readonly adapters: NotificationAdapter[]) {}

  async send(payload: NotificationPayload): Promise<void> {
    const results = await Promise.allSettled(
      this.adapters.map(a => a.send(payload))
    )

    const failures = results.filter(r => r.status === 'rejected')
    if (failures.length > 0) {
      failures.forEach(f => {
        if (f.status === 'rejected') {
          console.error('[CompositeNotificationAdapter] Adapter failed (partial failure):', f.reason)
        }
      })
    }
    // Do NOT re-throw: partial failure is acceptable (WF-09)
  }

  async sendBatch(payloads: NotificationPayload[]): Promise<void> {
    // Fan-out each payload to all adapters with partial failure tolerance
    const results = await Promise.allSettled(
      payloads.flatMap(p => this.adapters.map(a => a.send(p)))
    )

    const failures = results.filter(r => r.status === 'rejected')
    if (failures.length > 0) {
      failures.forEach(f => {
        if (f.status === 'rejected') {
          console.error('[CompositeNotificationAdapter] Batch adapter failed:', f.reason)
        }
      })
    }
  }
}
