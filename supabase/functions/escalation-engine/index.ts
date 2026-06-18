/**
 * escalation-engine — Supabase Edge Function
 *
 * Runs every hour via pg_cron. Checks all four trigger conditions:
 *   1. obligation_overdue   — obligation.status = 'overdue'
 *   2. task_overdue         — task.due_date < today, status not terminal
 *   3. workflow_blocked_n_days  — in Blocked status > threshold_days
 *   4. no_phase_progress_n_days — no phase advance in > threshold_days
 *
 * Per WORKFLOW_STATE_MACHINE.md §4 and SPRINT_4_ARCHITECTURE.md §6.
 *
 * Multi-step ladder: step 1 fires immediately; subsequent steps fire
 * after delay_hours from the PREVIOUS step fire time (OQ-6/D5).
 *
 * Cooldown: per-entity per-policy to prevent duplicate escalations.
 *
 * NOTE: This file imports from lib/workflow/types directly — in production
 * this would be bundled. The shared/ directory holds DB adapter for Deno.
 */

// Deno Edge Function entry point
Deno.serve(async (_req: Request) => {
  try {
    await runEscalationEngine()
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[escalation-engine] Fatal error:', err)
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})

interface EscalationPolicy {
  policy_id:         string
  trigger_condition: string
  threshold_days:    number
  cooldown_hours:    number
  tenant_id:         string | null
  is_active:         boolean
}

interface EscalationStep {
  step_id:                  string
  policy_id:                string
  step_number:              number
  delay_hours:              number
  escalate_to_role:         string
  notify_channel:           string[]
  requires_acknowledgement: boolean
}

interface EscalationEvent {
  escalation_event_id: string
  policy_id:           string
  step_id:             string | null
  obligation_id:       string | null
  workflow_instance_id: string | null
  task_id:             string | null
  cooldown_until:      string
  created_at:          string
}

async function runEscalationEngine(): Promise<void> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  const headers = {
    'Content-Type':  'application/json',
    'Authorization': `Bearer ${serviceKey}`,
    'apikey':        serviceKey,
  }

  async function query(sql: string, params: unknown[] = []) {
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
      method:  'POST',
      headers,
      body:    JSON.stringify({ sql, params }),
    })
    return res.json()
  }

  async function rpc(fn: string, body: Record<string, unknown>) {
    const res = await fetch(`${supabaseUrl}/rest/v1/rpc/${fn}`, {
      method:  'POST',
      headers,
      body:    JSON.stringify(body),
    })
    return res.json()
  }

  const now = new Date()

  // ── 1. Load active escalation policies ──────────────────────────────────
  const { data: policies }: { data: EscalationPolicy[] } = await fetch(
    `${supabaseUrl}/rest/v1/escalation_policies?is_active=eq.true&select=*`,
    { headers }
  ).then(r => r.json())

  if (!policies?.length) {
    console.log('[escalation-engine] No active policies')
    return
  }

  // ── 2. Process each policy ───────────────────────────────────────────────
  for (const policy of policies) {
    const steps: EscalationStep[] = await fetch(
      `${supabaseUrl}/rest/v1/escalation_policy_steps?policy_id=eq.${policy.policy_id}&order=step_number.asc`,
      { headers }
    ).then(r => r.json())

    if (!steps?.length) continue

    const entities = await loadEntitiesForPolicy(policy, supabaseUrl, headers)

    for (const entity of entities) {
      await processEscalation(policy, steps, entity, now, supabaseUrl, headers, serviceKey)
    }
  }
}

interface EscalationEntity {
  entity_id:    string
  entity_type:  'obligation' | 'workflow_instance' | 'task'
  tenant_id:    string
  obligation_id?: string
  workflow_instance_id?: string
  task_id?: string
  days_overdue?: number
}

async function loadEntitiesForPolicy(
  policy:      EscalationPolicy,
  baseUrl:     string,
  headers:     Record<string, string>
): Promise<EscalationEntity[]> {
  const { trigger_condition, threshold_days } = policy

  if (trigger_condition === 'obligation_overdue') {
    const rows: Array<{ obligation_id: string; tenant_id: string; computed_deadline: string }> =
      await fetch(
        `${baseUrl}/rest/v1/obligations?status=eq.overdue&select=obligation_id,tenant_id,computed_deadline`,
        { headers }
      ).then(r => r.json())

    return (rows ?? []).map(r => ({
      entity_id:    r.obligation_id,
      entity_type:  'obligation' as const,
      tenant_id:    r.tenant_id,
      obligation_id: r.obligation_id,
      days_overdue:  Math.floor((Date.now() - new Date(r.computed_deadline).getTime()) / 86400000),
    }))
  }

  if (trigger_condition === 'task_overdue') {
    const today = new Date().toISOString().slice(0, 10)
    const rows: Array<{ task_id: string; tenant_id: string; due_date: string }> =
      await fetch(
        `${baseUrl}/rest/v1/tasks?status=not.in.(completed,cancelled)&due_date=lt.${today}&select=task_id,tenant_id,due_date`,
        { headers }
      ).then(r => r.json())

    return (rows ?? []).map(r => ({
      entity_id:   r.task_id,
      entity_type: 'task' as const,
      tenant_id:   r.tenant_id,
      task_id:     r.task_id,
    }))
  }

  if (trigger_condition === 'workflow_blocked_n_days') {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - threshold_days)
    const rows: Array<{ workflow_instance_id: string; tenant_id: string }> =
      await fetch(
        `${baseUrl}/rest/v1/workflow_instances?status=eq.blocked&substate_entered_at=lt.${cutoff.toISOString()}&select=workflow_instance_id,tenant_id`,
        { headers }
      ).then(r => r.json())

    return (rows ?? []).map(r => ({
      entity_id:            r.workflow_instance_id,
      entity_type:          'workflow_instance' as const,
      tenant_id:            r.tenant_id,
      workflow_instance_id: r.workflow_instance_id,
    }))
  }

  if (trigger_condition === 'no_phase_progress_n_days') {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - threshold_days)
    const rows: Array<{ workflow_instance_id: string; tenant_id: string }> =
      await fetch(
        `${baseUrl}/rest/v1/workflow_instances?status=eq.active&substate_entered_at=lt.${cutoff.toISOString()}&select=workflow_instance_id,tenant_id`,
        { headers }
      ).then(r => r.json())

    return (rows ?? []).map(r => ({
      entity_id:            r.workflow_instance_id,
      entity_type:          'workflow_instance' as const,
      tenant_id:            r.tenant_id,
      workflow_instance_id: r.workflow_instance_id,
    }))
  }

  return []
}

async function processEscalation(
  policy:     EscalationPolicy,
  steps:      EscalationStep[],
  entity:     EscalationEntity,
  now:        Date,
  baseUrl:    string,
  headers:    Record<string, string>,
  serviceKey: string
): Promise<void> {
  // Cooldown check: skip if within cooldown window
  const recentEvents: EscalationEvent[] = await fetch(
    `${baseUrl}/rest/v1/escalation_events?policy_id=eq.${policy.policy_id}&cooldown_until=gt.${now.toISOString()}&select=*`,
    { headers }
  ).then(r => r.json())

  const inCooldown = (recentEvents ?? []).some(e =>
    e.obligation_id          === (entity.obligation_id ?? null) ||
    e.workflow_instance_id   === (entity.workflow_instance_id ?? null) ||
    e.task_id                === (entity.task_id ?? null)
  )

  if (inCooldown) return

  // Determine which step to fire
  // Check existing events to find last fired step for this entity+policy
  const allEvents: EscalationEvent[] = await fetch(
    `${baseUrl}/rest/v1/escalation_events?policy_id=eq.${policy.policy_id}&order=created_at.desc&select=*`,
    { headers }
  ).then(r => r.json())

  const entityEvents = (allEvents ?? []).filter(e =>
    e.obligation_id          === (entity.obligation_id ?? null) ||
    e.workflow_instance_id   === (entity.workflow_instance_id ?? null) ||
    e.task_id                === (entity.task_id ?? null)
  )

  let stepToFire: EscalationStep | undefined

  if (entityEvents.length === 0) {
    // No prior events — fire step 1
    stepToFire = steps.find(s => s.step_number === 1)
  } else {
    // Find last fired step; if delay_hours elapsed, fire next step
    const lastEvent  = entityEvents[0]
    const lastStepId = lastEvent.step_id
    const lastStep   = steps.find(s => s.step_id === lastStepId)

    if (lastStep) {
      const nextStep = steps.find(s => s.step_number === lastStep.step_number + 1)
      if (nextStep) {
        const lastFiredAt  = new Date(lastEvent.created_at)
        const delayMs      = nextStep.delay_hours * 3600 * 1000
        if (now.getTime() - lastFiredAt.getTime() >= delayMs) {
          stepToFire = nextStep
        }
      }
    }
  }

  if (!stepToFire) return

  // Load users for this step's role
  const users: Array<{ id: string; email: string; role: string }> = await fetch(
    `${baseUrl}/rest/v1/users?tenant_id=eq.${entity.tenant_id}&select=id,email,role`,
    { headers }
  ).then(r => r.json())

  const roleRank: Record<string, number> = { member: 0, owner: 1, admin: 2 }
  const minRank  = roleRank[stepToFire.escalate_to_role] ?? 0
  const targets  = (users ?? []).filter(u => (roleRank[u.role] ?? 0) >= minRank)

  if (targets.length === 0) return

  // Record escalation event
  const cooldownUntil = new Date(now.getTime() + policy.cooldown_hours * 3600 * 1000)

  const eventPayload = {
    policy_id:            policy.policy_id,
    step_id:              stepToFire.step_id,
    obligation_id:        entity.obligation_id ?? null,
    workflow_instance_id: entity.workflow_instance_id ?? null,
    task_id:              entity.task_id ?? null,
    tenant_id:            entity.tenant_id,
    notified_user_ids:    targets.map(u => u.id),
    trigger_snapshot:     {
      trigger_condition: policy.trigger_condition,
      step_number:       stepToFire.step_number,
      days_overdue:      entity.days_overdue ?? 0,
      entity_id:         entity.entity_id,
    },
    cooldown_until: cooldownUntil.toISOString(),
  }

  await fetch(`${baseUrl}/rest/v1/escalation_events`, {
    method:  'POST',
    headers: { ...headers, 'Prefer': 'return=minimal' },
    body:    JSON.stringify(eventPayload),
  })

  // Queue outbox notifications + in-app notifications
  for (const user of targets) {
    const subject  = `Escalation: ${policy.trigger_condition.replace(/_/g, ' ')}`
    const bodyText = `An escalation has been triggered for your compliance obligation. Policy: ${policy.trigger_condition}. Step: ${stepToFire.step_number}.`

    if (stepToFire.notify_channel.includes('email')) {
      await fetch(`${baseUrl}/rest/v1/notification_outbox`, {
        method:  'POST',
        headers: { ...headers, 'Prefer': 'return=minimal' },
        body:    JSON.stringify({
          tenant_id:                    entity.tenant_id,
          recipient_user_id:            user.id,
          recipient_email:              user.email,
          channel:                      'email',
          notification_type:            'escalation_triggered',
          subject,
          body_text:                    bodyText,
          payload:                      { policy_id: policy.policy_id, step_number: stepToFire.step_number },
          status:                       'pending',
          scheduled_for:                now.toISOString(),
          related_obligation_id:        entity.obligation_id ?? null,
          related_workflow_instance_id: entity.workflow_instance_id ?? null,
          related_task_id:              entity.task_id ?? null,
        }),
      })
    }
  }

  // Audit log
  const auditEvents = targets.map(u => ({
    entity_type:   entity.entity_type,
    entity_id:     entity.entity_id,
    tenant_id:     entity.tenant_id,
    actor_type:    'escalation',
    actor_user_id: null,
    event_type:    'escalation_triggered',
    from_state:    null,
    to_state:      'escalation_triggered',
    reason:        null,
    metadata:      {
      policy_id:         policy.policy_id,
      step_id:           stepToFire.step_id,
      step_number:       stepToFire.step_number,
      notified_user_ids: targets.map(u2 => u2.id),
      trigger_condition: policy.trigger_condition,
      days_overdue:      entity.days_overdue ?? 0,
    },
  }))

  await fetch(`${baseUrl}/rest/v1/task_audit_log`, {
    method:  'POST',
    headers: { ...headers, 'Prefer': 'return=minimal' },
    body:    JSON.stringify(auditEvents[0]),
  })

  console.log(`[escalation-engine] Fired step ${stepToFire.step_number} for policy ${policy.policy_id}, entity ${entity.entity_id}`)
}
