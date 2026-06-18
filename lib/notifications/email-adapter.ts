/**
 * EmailNotificationAdapter — Sprint 4
 *
 * Wraps Resend API for email delivery.
 * V1: stubbed — logs to console, does not make real API calls.
 * Replace body with Resend SDK call when RESEND_API_KEY is configured.
 *
 * External sends are queued via notification_outbox; this adapter is called
 * by the notification-dispatcher Edge Function (not directly from services).
 */

import type { NotificationAdapter, NotificationPayload } from './types'

export class EmailNotificationAdapter implements NotificationAdapter {
  private readonly apiKey: string | undefined

  constructor(apiKey?: string) {
    this.apiKey = apiKey ?? process.env['RESEND_API_KEY']
  }

  async send(payload: NotificationPayload): Promise<void> {
    if (payload.channel !== 'email') return

    if (!this.apiKey) {
      console.warn('[EmailNotificationAdapter] RESEND_API_KEY not configured — email not sent:', {
        to:      payload.recipients.map(r => r.email),
        subject: payload.subject,
      })
      return
    }

    // Production: call Resend API
    // const resend = new Resend(this.apiKey)
    // await resend.emails.send({
    //   from:    'noreply@yourapp.com',
    //   to:      payload.recipients.map(r => r.email),
    //   subject: payload.subject,
    //   text:    payload.bodyText,
    //   html:    payload.bodyHtml,
    // })

    console.log('[EmailNotificationAdapter] Would send email:', {
      to:      payload.recipients.map(r => r.email),
      subject: payload.subject,
      type:    payload.eventType,
    })
  }

  async sendBatch(payloads: NotificationPayload[]): Promise<void> {
    for (const p of payloads) {
      await this.send(p)
    }
  }
}
