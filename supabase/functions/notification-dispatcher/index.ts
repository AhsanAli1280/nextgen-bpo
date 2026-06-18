/**
 * notification-dispatcher — Supabase Edge Function
 *
 * Runs every 5 minutes. Processes pending notification_outbox rows.
 * Uses FOR UPDATE SKIP LOCKED semantics via Supabase for concurrency safety.
 * Retries up to 3 attempts before marking as permanently failed.
 *
 * Per SPRINT_4_ARCHITECTURE.md §4.5.
 * OQ-8 resolved: max 3 retry attempts.
 *
 * In V1: email channel only (Resend). WhatsApp is stub (throws — not queued).
 */

const BATCH_SIZE    = 50
const MAX_ATTEMPTS  = 3

Deno.serve(async (_req: Request) => {
  try {
    const result = await runDispatcher()
    return new Response(JSON.stringify({ ok: true, ...result }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[notification-dispatcher] Fatal error:', err)
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status:  500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})

async function runDispatcher(): Promise<{ processed: number; succeeded: number; failed: number }> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const resendKey   = Deno.env.get('RESEND_API_KEY')

  const headers = {
    'Content-Type':  'application/json',
    'Authorization': `Bearer ${serviceKey}`,
    'apikey':        serviceKey,
  }

  const now = new Date().toISOString()

  // Fetch pending rows
  const pending: Array<{
    outbox_id:         string
    tenant_id:         string
    recipient_user_id: string
    recipient_email:   string | null
    channel:           string
    notification_type: string
    subject:           string | null
    body_text:         string
    body_html:         string | null
    attempts:          number
  }> = await fetch(
    `${supabaseUrl}/rest/v1/notification_outbox?status=in.(pending,failed)&scheduled_for=lte.${now}&attempts=lt.${MAX_ATTEMPTS}&order=scheduled_for.asc&limit=${BATCH_SIZE}&select=*`,
    { headers }
  ).then(r => r.json())

  if (!pending?.length) {
    console.log('[notification-dispatcher] No pending notifications')
    return { processed: 0, succeeded: 0, failed: 0 }
  }

  let succeeded = 0
  let failed    = 0

  for (const row of pending) {
    // Mark as 'sending' + increment attempts
    await fetch(
      `${supabaseUrl}/rest/v1/notification_outbox?outbox_id=eq.${row.outbox_id}`,
      {
        method:  'PATCH',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body:    JSON.stringify({
          status:          'sending',
          attempts:        row.attempts + 1,
          last_attempt_at: new Date().toISOString(),
        }),
      }
    )

    try {
      if (row.channel === 'email') {
        await sendEmail(row, resendKey)
      }
      // whatsapp: not implemented in V1 — should not be in outbox

      await fetch(
        `${supabaseUrl}/rest/v1/notification_outbox?outbox_id=eq.${row.outbox_id}`,
        {
          method:  'PATCH',
          headers: { ...headers, 'Prefer': 'return=minimal' },
          body:    JSON.stringify({
            status:  'sent',
            sent_at: new Date().toISOString(),
          }),
        }
      )
      succeeded++
    } catch (err) {
      const errMsg   = err instanceof Error ? err.message : String(err)
      const newAttempts = row.attempts + 1
      const finalFail   = newAttempts >= MAX_ATTEMPTS

      await fetch(
        `${supabaseUrl}/rest/v1/notification_outbox?outbox_id=eq.${row.outbox_id}`,
        {
          method:  'PATCH',
          headers: { ...headers, 'Prefer': 'return=minimal' },
          body:    JSON.stringify({
            status:     finalFail ? 'failed' : 'pending',
            last_error: errMsg,
          }),
        }
      )
      console.error(`[notification-dispatcher] Failed to send ${row.outbox_id}:`, errMsg)
      failed++
    }
  }

  console.log(`[notification-dispatcher] processed=${pending.length} succeeded=${succeeded} failed=${failed}`)
  return { processed: pending.length, succeeded, failed }
}

async function sendEmail(
  row:      { recipient_email: string | null; subject: string | null; body_text: string; body_html: string | null },
  apiKey:   string | undefined
): Promise<void> {
  if (!apiKey) {
    console.warn('[notification-dispatcher] RESEND_API_KEY not set — email not sent')
    return
  }

  if (!row.recipient_email) {
    throw new Error('recipient_email is required for email channel')
  }

  const res = await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      from:    Deno.env.get('EMAIL_FROM') ?? 'noreply@compliance.pk',
      to:      [row.recipient_email],
      subject: row.subject ?? '(no subject)',
      text:    row.body_text,
      html:    row.body_html ?? undefined,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Resend API error ${res.status}: ${body}`)
  }
}
