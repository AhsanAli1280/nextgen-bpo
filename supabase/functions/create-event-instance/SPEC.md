# create-event-instance — Edge Function Specification (WS0)

**Status:** SPEC (not implemented). Wired in Sprint 5B.
**Runtime:** Supabase Edge Function (Deno).
**Purpose:** the atomic spine of the Event Wizard. Turns a confirmed business event into obligation(s) + workflow instance(s) in one transaction. Consumes existing services — recreates nothing.

---

## 1. Contract

```
POST /functions/v1/create-event-instance
Authorization: Bearer <user JWT>        // tenant_id derived from JWT (RLS)
```

Request body:
```ts
{
  companyId:      string
  eventTypeId:    string
  answers:        Record<string, string>   // wizard disambiguation answers
  eventDate:      string                    // ISO date
  demoSessionId?: string | null             // set in demo context
}
```

Response (maps to UI `ObligationChainVM`):
```ts
{
  eventInstanceId: string
  obligations: Array<{
    obligationId: string
    title: string
    formNumber: string | null
    deadlineDays: number
    dueDate: string | null
    legalBasis: string | null
    status: 'upcoming' | 'due_soon' | 'overdue'
    stepLabel?: string            // "Step 1" / "Step 2" for chained
  }>
}
```

## 2. Algorithm (single DB transaction)

1. **AuthZ:** resolve `tenant_id` from JWT; verify `companyId` belongs to tenant (RLS).
2. **Resolve rules:** call `runRuleEngine(companyId, 'event', { event_type_id: eventTypeId, event_date, resolved_rule_id: <from answers>, demo_session_id })` (lib/rule-engine — **frozen, consume as-is**). Returns applicable obligation specs incl. chain links.
3. **Insert `event_instances`** row (durable business fact: who/what/date), tagged `demo_session_id`/`demo_expires_at` if demo.
4. **Insert `obligations`** rows (N): tenant_id, event_type_id, rule_version_id, computed_deadline (from rule engine — never recomputed here), status. For a chain, set `linked_obligation_id` (e.g. DIR-001 → DIR-002). DIR-002 trigger uses worst-case theoretical on create (updated later on DIR-001 filed — handled by DependencyEngine / workflow completion, NOT here).
5. **Initialize workflows:** per obligation call `workflowInstanceService.initializeWorkflow(workflowInstanceId, adapter)` using `SupabaseWorkflowDbAdapter` (WS0). Sets phase `Not Started`, status `draft`, writes `workflow_created` audit.
6. **Populate `event_obligations`** join (if present) linking event → obligations.
7. **Commit.** Any failure → **rollback all** (no partial event).
8. Map created obligations → response VM (Step labels by `linked_obligation_id` order).

## 3. Invariants
- No deadline/applicability/chain math in this function — only `runRuleEngine` produces those.
- No workflow phase/task logic here — only `workflowInstanceService`.
- Atomic: rollback on any insert failure.
- Demo rows always carry `demo_session_id` + `demo_expires_at`.
- Idempotency: a retried submit with same (tenant, eventType, eventDate, answers hash) within a short window should not double-create — guard via a request idempotency key (header) or natural dedup; finalize in 5B.

## 4. Consumes (do not recreate)
- `lib/rule-engine` `runRuleEngine` + its Supabase adapter.
- `lib/workflow/workflow-instance-service.ts` `initializeWorkflow`.
- `lib/workflow/supabase-workflow-adapter.ts` (WS0).
- `AuditTrailService` (internal to workflow service).

## 5. Errors
- 401 no/invalid JWT · 403 company not in tenant · 422 wizard answers don't resolve to a rule · 500 rollback on transaction failure (return reason, no partial state).
