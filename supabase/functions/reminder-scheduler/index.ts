/**
 * reminder-scheduler — Supabase Edge Function
 *
 * Runs daily at 03:00 UTC (08:00 PKT) via pg_cron.
 *
 * Phase 1: Refresh obligation statuses
 *   Uses computeObligationStatus() from Sprint 3 lib/rule-engine/calendar.ts.
 *   Batch-updates obligations where computed ≠ stored status.
 *
 * Phase 2: Due-soon reminders (R-30/14/7/3/1)
 *   Reads alert_lead_times from obligation_templates.
 *   Deduplicates per (obligation_id, notification_type, DATE(today)).
 *
 * Phase 3: Overdue reminders (R-OD)
 *   Daily until filed. Capped at 30 days overdue (OQ-7/D7 resolved).
 *
 * Per WORKFLOW_STATE_MACHINE.md §5 and SPRINT_4_ARCHITECTURE.md §7.
 *
 * NOTE: computeObligationStatus is inlined here (Deno Edge Function cannot import
 * from Node.js lib/rule-engine/ directly in production). The logic is identical
 * to lib/rule-engine/calendar.ts — do NOT alter it.
 */

// ── Inlined computeObligationStatus (identical to lib/rule-engine/calendar.ts) ──
const DUE_SOON_DAYS = 30

function computeObligationStatus(
  computedDeadline: Date,
  today:            Date
): 'upcoming' | 'due_soon' | 'overdue' {
  const diffMs   = computedDeadline.getTime() - today.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  if (diffDays < 0) return 'overdue'
  if (diffDays <= DUE_SOON_DAYS) return 'due_soon'
  return 'upcoming'
}

// ── OQ-7 resolved: overdue reminders capped at 30 days ───────────────────────
const MAX_OVERDUE_DAYS = 30

Deno.serve(async (_req: Request) => {
  try {
    await runReminderScheduler()
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[reminder-scheduler] Fatal error:', err)
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status:  500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})

async function runReminderScheduler(): Promise<void> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  const headers = {
    'Content-Type':  'application/json',
    'Authorization': `Bearer ${serviceKey}`,
    'apikey':        serviceKey,
  }

  const today    = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().slice(0, 10)

  console.log(`[reminder-scheduler] Running for ${todayStr}`)

  // ── Phase 1: Obligation status refresh ─────────────────────────────────

  const activeObligations: Array<{
    obligation_id:     string
    tenant_id:         string
    company_id:        string
    computed_deadline: string
    status:            string
  }> = await fetch(
    `${supabaseUrl}/rest/v1/obligations?status=not.in.(filed,not_applicable,superseded)&select=obligation_id,tenant_id,company_id,computed_deadline,status`,
    { headers }
  ).then(r => r.json())

  let statusUpdates = 0

  for (const obl of (activeObligations ?? [])) {
    const deadline    = new Date(obl.computed_deadline)
    const newStatus   = computeObligationStatus(deadline, today)
    if (newStatus !== obl.status) {
      await fetch(
        `${supabaseUrl}/rest/v1/obligations?obligation_id=eq.${obl.obligation_id}`,
        {
          method:  'PATCH',
          headers: { ...headers, 'Prefer': 'return=minimal' },
          body:    JSON.stringify({ status: newStatus }),
        }
      )
      statusUpdates++
    }
  }

  console.log(`[reminder-scheduler] Phase 1: updated ${statusUpdates} obligation statuses`)

  // ── Phase 2: Due-soon reminders ─────────────────────────────────────────

  const dueSoonObligations: Array<{
    obligation_id:     string
    tenant_id:         string
    company_id:        string
    computed_deadline: string
    assigned_to_user_id: string | null
    obligation_template_id: string
    alert_lead_times: number[]
  }> = await fetch(
    `${supabaseUrl}/rest/v1/obligations?status=in.(upcoming,due_soon)&select=obligation_id,tenant_id,company_id,computed_deadline,assigned_to_user_id,workflow_instances(workflow_template_id,workflow_templates(obligation_template_id,alert_lead_times))`,
    { headers }
  ).then(r => r.json())

  let remindersSent = 0

  for (const obl of (dueSoonObligations ?? [])) {
    const deadline      = new Date(obl.computed_deadline)
    const daysUntil     = Math.floor((deadline.getTime() - today.getTime()) / 86400000)
    const alertTimes    = obl.alert_lead_times ?? [30, 14, 7, 3, 1]

    if (!alertTimes.includes(daysUntil)) continue
    if (!obl.assigned_to_user_id) continue

    const notificationType = 'deadline_approaching'
    const alreadySent = await checkDedup(
      obl.obligation_id,
      notificationType,
      todayStr,
      obl.assigned_to_user_id,
      supabaseUrl,
      headers
    )
    if (alreadySent) continue

    // Queue outbox entry
    await fetch(`${supabaseUrl}/rest/v1/notification_outbox`, {
      method:  'POST',
      headers: { ...headers, 'Prefer': 'return=minimal' },
      body:    JSON.stringify({
        tenant_id:             obl.tenant_id,
        recipient_user_id:     obl.assigned_to_user_id,
        channel:               'email',
        notification_type:     notificationType,
        subject:               `Obligation due in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`,
        body_text:             `Reminder: your compliance obligation is due in ${daysUntil} day${daysUntil === 1 ? '' : 's'} (${deadline.toISOString().slice(0, 10)}).`,
        payload:               { days_until: daysUntil },
        status:                'pending',
        scheduled_for:         today.toISOString(),
        related_obligation_id: obl.obligation_id,
      }),
    })

    remindersSent++
  }

  console.log(`[reminder-scheduler] Phase 2: queued ${remindersSent} due-soon reminders`)

  // ── Phase 3: Overdue reminders ──────────────────────────────────────────

  const overdueObligations: Array<{
    obligation_id:        string
    tenant_id:            string
    computed_deadline:    string
    assigned_to_user_id:  string | null
  }> = await fetch(
    `${supabaseUrl}/rest/v1/obligations?status=eq.overdue&select=obligation_id,tenant_id,computed_deadline,assigned_to_user_id`,
    { headers }
  ).then(r => r.json())

  let overdueRemindersSent = 0

  for (const obl of (overdueObligations ?? [])) {
    const deadline   = new Date(obl.computed_deadline)
    const daysOverdue = Math.floor((today.getTime() - deadline.getTime()) / 86400000)

    // OQ-7: cap at MAX_OVERDUE_DAYS
    if (daysOverdue > MAX_OVERDUE_DAYS) continue
    if (!obl.assigned_to_user_id) continue

    const notificationType = 'deadline_overdue'
    const alreadySent = await checkDedup(
      obl.obligation_id,
      notificationType,
      todayStr,
      obl.assigned_to_user_id,
      supabaseUrl,
      headers
    )
    if (alreadySent) continue

    await fetch(`${supabaseUrl}/rest/v1/notification_outbox`, {
      method:  'POST',
      headers: { ...headers, 'Prefer': 'return=minimal' },
      body:    JSON.stringify({
        tenant_id:             obl.tenant_id,
        recipient_user_id:     obl.assigned_to_user_id,
        channel:               'email',
        notification_type:     notificationType,
        subject:               `OVERDUE: Compliance obligation ${daysOverdue} day${daysOverdue === 1 ? '' : 's'} past deadline`,
        body_text:             `Your compliance obligation is ${daysOverdue} day${daysOverdue === 1 ? '' : 's'} overdue (deadline was ${deadline.toISOString().slice(0, 10)}).`,
        payload:               { days_overdue: daysOverdue },
        status:                'pending',
        scheduled_for:         today.toISOString(),
        related_obligation_id: obl.obligation_id,
      }),
    })

    overdueRemindersSent++
  }

  console.log(`[reminder-scheduler] Phase 3: queued ${overdueRemindersSent} overdue reminders`)
  console.log(`[reminder-scheduler] Complete. Status updates: ${statusUpdates}, due-soon: ${remindersSent}, overdue: ${overdueRemindersSent}`)
}

async function checkDedup(
  obligationId:     string,
  notificationType: string,
  dateStr:          string,
  recipientUserId:  string,
  baseUrl:          string,
  headers:          Record<string, string>
): Promise<boolean> {
  const existing: unknown[] = await fetch(
    `${baseUrl}/rest/v1/notification_outbox?related_obligation_id=eq.${obligationId}&notification_type=eq.${notificationType}&recipient_user_id=eq.${recipientUserId}&status=neq.cancelled&select=outbox_id&limit=1`,
    { headers }
  ).then(r => r.json())

  // Filter to today's date
  const rows: Array<{ outbox_id: string; created_at: string }> = existing as Array<{ outbox_id: string; created_at: string }>
  const todayRows = (rows ?? []).filter(r => r.created_at?.slice(0, 10) === dateStr)
  return todayRows.length > 0
}
