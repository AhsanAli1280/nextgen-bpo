# SPRINT_4_ARCHITECTURE_COMPLIANCE_REPORT.md

**Date:** 2026-06-18
**Reviewed against:** PRODUCT_REQUIREMENTS.md, ARCHITECTURE_FREEZE.md, DATABASE_ARCHITECTURE_FINAL.md, V1_SCOPE.md
**Docs location:** `OneDrive/Desktop/Corporate Secretary in a box/` (not in repo — read external)
**Method:** Component-by-component trace. Legend: ✅ implemented · 🟡 partial · ⏸ deferred · ❌ missing · ⚠ drift

---

## 0. Scope Note — Critical Context

Four frozen docs reviewed **do not define a task layer, escalation engine, notification outbox, or task-dependency graph.** These come from Sprint 4 charter docs (SPRINT_4_HANDOFF, WORKFLOW_STATE_MACHINE, SPRINT_4_ARCHITECTURE) which post-date freeze. Therefore much of Sprint 4 is **net-new infrastructure beyond the frozen V1 schema**, sanctioned by Sprint 4 charter but **not yet reconciled back into DATABASE_ARCHITECTURE_FINAL.**

Frozen workflow model = `workflow_instances.current_phase` + `current_substate` + `workflow_phase_history` (append-only). Filing = `filing_attempts` (§17). Notifications = `notifications` table, 4 types, channels email/sms/in_app (§20). That is the whole frozen surface. Everything Sprint 4 added sits on top.

Concept sanction traced where it exists:
- **Escalation:** concept named in WORKFLOW_ENGINE.md §48 ("escalation logic across wildly different obligations"). Schema net-new.
- **Two-layer status (phase vs compliance):** sanctioned ARCHITECTURE_FREEZE "Final Workflow Model" + DATABASE_ARCHITECTURE_FINAL §15.
- **Task layer:** **no trace** in any of the 4 frozen docs nor WORKFLOW_ENGINE.md. Pure net-new.

---

## 1. WorkflowInstanceService

| Requirement | Trace | Status |
|---|---|---|
| Phase vocabulary fixed (Not Started…Completed, Blocked) | ARCH_FREEZE Final Workflow Model; DB §15 | ✅ |
| `current_phase` + `current_substate` + `substate_entered_at` | DB §15 | ✅ |
| Append-only phase history, every transition | ARCH_FREEZE "preserved in append-only history"; DB §18 | ✅ |
| Required reason on rejection/block/cancel | ARCH_FREEZE "required reason captured at point of rejection" | ✅ |
| `blocked_reason` populated only when Blocked | DB §15 | ✅ |
| Phase-plus-substate kept separate from obligation legal status | ARCH_FREEZE Final Workflow Model | ✅ |
| obligation.status → `filed` on completion | DB §16 enum | ✅ |
| Demo + tenant + assignment fields carried | DB §26/§27 | ✅ |
| **`status` enum (draft/active/blocked/completed/cancelled)** | **no frozen field** | ⚠ net-new |
| **`phase_before_block`, `cancelled_at`, `cancelled_reason`** | **no frozen field** | ⚠ net-new |
| **Filing writes `filing_attempts` row** | DB §17 = THE filing model | ❌ missing |

**Detail — filing gap:** `completeWorkflow(filingAttemptId,…)` *consumes* a filing-attempt id and flips `obligation.status='filed'`, but **never creates a `filing_attempts` row** (reference_number, attempt_number, outcome, channel). Frozen §17 says every filing attempt = preserved row; bounced-twice = 3 rows. Sprint 4 captures reference only as `record_reference` task metadata. Filing-attempt persistence is **missing / assumed-external**.

---

## 2. TaskGenerationService

| Requirement | Trace | Status |
|---|---|---|
| Whole task layer (decompose phase → discrete tasks) | **no frozen doc** | ⚠ net-new layer |
| Pure `deriveTaskSpecs`, idempotent generation | Sprint 4 charter | ✅ |
| Internal Approval skipped when approval=none (OQ-1) | Sprint 4 | ✅ |
| Hard vs soft prerequisite per task | Sprint 4 | ✅ |

Task layer is well-built and tested, but is the **single biggest structural addition absent from frozen schema.** No `tasks` table exists in DATABASE_ARCHITECTURE_FINAL.

---

## 3. TaskAssignmentEngine

| Requirement | Trace | Status |
|---|---|---|
| `assigned_to_user_id` nullable, null=unassigned | DB §15/§27; V1_SCOPE §4 | ✅ |
| Assignment UI / multi-user roles | V1_SCOPE §4 "assignment UI post-V1" | ⏸ deferred (correct) |
| Cascade auto-assign obligation→workflow→null | Sprint 4 | ✅ |
| reopen → unassigned (OQ-9), reject reason (OQ-10) | Sprint 4 | ✅ |

**Note:** V1 ships single-user-per-account (V1_SCOPE §4). Assignment *engine* exists; assignment *UI* correctly deferred. Schema fields present as nullable — matches "zero V1 behaviour change" intent. ✅ aligned.

---

## 4. DependencyEngine

| Requirement | Trace | Status |
|---|---|---|
| One-off dependency chaining | DB §14/§16 `linked_obligation_id` (obligation-level) | ✅ exists (Sprint 3) |
| **Task-level FTS/FTF dependency graph** | **no frozen doc** | ⚠ net-new |
| Circular + self + cross-workflow rejection | Sprint 4 | ✅ |

**Drift caution:** frozen dependency model is **obligation-level** via `linked_obligation_id` (DB §14, explicitly "distinct from recurring case"). Sprint 4 adds a **second, task-level** dependency mechanism (`task_dependencies`). Two dependency systems now coexist. ARCH_FREEZE §14 warned against "one mechanism wearing two names" — must confirm these are genuinely different layers (obligation-chain vs intra-workflow task-order), not overlap. Assessed: **different layers, acceptable**, but document the boundary.

---

## 5. AuditTrailService

| Requirement | Trace | Status |
|---|---|---|
| Timestamp every obligation/transition; reconstructable | PROD_REQ §3.4 "No audit trail" problem; ARCH_FREEZE append-only | ✅ |
| Append-only, no UPDATE/DELETE | enforced DB GRANT | ✅ |
| Every transition → exactly one row (WF-13) | tested | ✅ |
| **`task_audit_log` table** | **no frozen table** | ⚠ net-new |

Frozen audit intent satisfied (and exceeded). Frozen schema relied on `workflow_phase_history` + `filing_attempts` for trail. Sprint 4 adds dedicated immutable audit log — additive, sound. Reconcile into schema doc.

---

## 6. Notification Layer

| Requirement | Trace | Status |
|---|---|---|
| Email channel | V1_SCOPE §1 "email channel only in V1"; DB §20 | ✅ |
| Deadline-approaching / overdue / rule-changed / recalculated types | DB §20 enum (4 types) | ✅ |
| **In-app channel** | DB §20 allows; **V1_SCOPE defers** ("SMS and in-app can follow") | ⚠ beyond V1 scope |
| **WhatsApp channel** | **not in frozen enum** (email/sms/in_app only) | ⚠ net-new (stubbed) |
| **SMS channel** | frozen enum HAS sms; V1 defers | ⏸ not built (correct) |
| **Extra notification_type values** (task_assigned, workflow_blocked, escalation…) | frozen enum = 4 types only | ⚠ enum extended |
| **`notification_outbox` table** | **no frozen table** | ⚠ net-new infra |
| Composite partial-failure no-throw (WF-09) | Sprint 4 | ✅ |

**Drift:** frozen channel enum = `{email, sms, in_app}`. Sprint 4 = `{email, in_app, whatsapp}` — **drops sms, adds whatsapp.** WhatsApp not sanctioned anywhere in frozen set. In-app built despite V1 deferral. Harmless (stub throws; additive) but is **scope + enum drift.**

---

## 7. Edge Functions (escalation-engine, reminder-scheduler, notification-dispatcher)

| Requirement | Trace | Status |
|---|---|---|
| Deadline-approaching reminders | PROD_REQ §8; DB §20 | ✅ |
| Hard-deadline aggressive/escalating alerting | PROD_REQ §8 "aggressive, escalating alerting"; WF_ENGINE §48 | ✅ concept sanctioned |
| Soft vs hard deadline distinction | PROD_REQ §8 | 🟡 partial — see below |
| Obligation status refresh (upcoming/due_soon/overdue) | DB §16 enum | ✅ |
| **Multi-step escalation ladder + policy/step schema** | **no frozen schema** | ⚠ net-new |
| **Outbox dispatcher, retry, MAX_ATTEMPTS** | **no frozen schema** | ⚠ net-new infra |
| Reminder lead times 30/14/7/3/1 | not numerically specified in frozen docs | ✅ (reasonable default) |

**Soft/hard gap (🟡):** PROD_REQ §8 + ARCH_FREEZE Final Calendar Model demand hard penalty deadlines (CHARGE-001 S.100) be alerted **differently** from soft cadences (BOARD-002, no fixed minimum). Sprint 4 escalation keys on `is_hard_prerequisite` (task-level) and overdue days — **not** on the obligation's hard-penalty-vs-soft-cadence flag. The frozen "alarm-fatigue vs under-alert" requirement is **partially** met: escalation differentiates task hardness, not statutory-penalty severity. Verify reminder/escalation policy reads a hard-deadline marker, else soft cadences (board frequency) may escalate like statutory penalties.

**Scope caution:** V1_SCOPE §1 = "**Basic** Notifications (email only)." A policy-driven multi-step escalation ladder + outbox + dispatcher is **substantially more than "basic."** Not wrong — but is **build-ahead beyond V1 scope.**

---

## 8. Architecture Drift — Summary

| # | Drift | Severity |
|---|---|---|
| D1 | Entire `tasks` layer net-new, absent from frozen schema | High (structural) |
| D2 | `filing_attempts` not written on completion — frozen §17 filing model bypassed | High (functional gap) |
| D3 | Notification channel enum drift: dropped `sms`, added `whatsapp` | Medium |
| D4 | `notification_type` enum extended past frozen 4 | Medium |
| D5 | In-app + escalation ladder + outbox built beyond V1 "basic email-only" scope | Medium (scope) |
| D6 | Second (task-level) dependency system alongside obligation-level `linked_obligation_id` | Medium (watch overlap) |
| D7 | `workflow_instances.status` + cancel/block fields net-new vs frozen §15 | Low (additive) |
| D8 | Soft-vs-hard statutory alerting only partially keyed | Medium |

All of D1, D3, D4, D7 are **schema additions never written back into DATABASE_ARCHITECTURE_FINAL** → frozen schema doc now stale vs implementation.

---

## 9. Shortcuts Taken

1. **Filing-attempt persistence skipped** — `completeWorkflow` trusts a `filingAttemptId` it never creates. Reference number lives in task metadata, not `filing_attempts`. (D2)
2. **Circular-dependency check in app layer only** — no DB constraint; informative errors gained, DB-level guarantee lost.
3. **`computeObligationStatus` inlined into reminder-scheduler** (Deno) — duplicated from Sprint 3 `calendar.ts`. Two copies can drift.
4. **WhatsApp stub** throws — channel modeled before sanctioned.
5. **Edge functions excluded from `tsc`** (`tsconfig.json`) — Deno funcs not type-checked by main pipeline.

---

## 10. Technical Debt Introduced

| Debt | Risk |
|---|---|
| DATABASE_ARCHITECTURE_FINAL out of sync with migrations 022–026 | Frozen schema doc no longer authoritative |
| Duplicated `computeObligationStatus` (calendar.ts ↔ reminder-scheduler) | Silent deadline-logic divergence |
| Filing-attempt model unwired | Audit-trail/filing-history requirement (PROD_REQ §3.4, DB §17) not provably met |
| Two dependency systems | Future confusion / overlap if not documented |
| WhatsApp + extra channels/types pre-built | Dead surface until sanctioned; enum-validation drift vs DB |
| Edge funcs untyped in CI | Runtime-only errors possible |

---

## 11. What Is Solidly Compliant

- Two-layer phase/compliance separation — exact frozen intent. ✅
- Append-only history + immutable audit — exceeds frozen audit requirement. ✅
- Tenant/demo/assignment nullable fields — match §26/§27 additive design. ✅
- Single-user V1 preserved; assignment UI correctly deferred. ✅
- obligation.status enum values respected. ✅
- Sprint 3 rule engine untouched, 96/96 regression pass. ✅
- 87/87 Sprint 4 tests, 0 tsc errors. ✅

---

## 12. Conclusion

### REMEDIATION REQUIRED BEFORE SPRINT 5

Not because code is broken — it is tested and clean — but because **two items break traceability to the frozen architecture**, and Sprint 5 will build on this surface:

**Blocking (must fix before Sprint 5):**
1. **D2 — wire `filing_attempts`.** Frozen §17 is THE filing model; PROD_REQ §3.4 audit-trail promise depends on it. `completeWorkflow` must create a `filing_attempts` row (attempt_number, reference_number, outcome, channel), not just flip `obligation.status`. Current state = filing history unrecorded.
2. **Reconcile schema doc.** Update DATABASE_ARCHITECTURE_FINAL (or a sanctioned addendum) to absorb migrations 022–026: `tasks`, `task_audit_log`, escalation tables, `notification_outbox`, `task_dependencies`, `workflow_instances.status`. Until done, frozen schema is stale and Sprint 5 plans against wrong doc.

**Non-blocking (fix during Sprint 5):**
3. D3/D4 — reconcile channel + type enums (decide whatsapp/in-app/sms officially; align DB CHECK).
4. D8 — key escalation/reminders to statutory hard-penalty flag, not just task hardness (PROD_REQ §8).
5. Dedup `computeObligationStatus`; add edge funcs to typecheck.
6. Document task-level vs obligation-level dependency boundary (D6).

Fix #1 + #2 → **READY FOR SPRINT 5.**
