# DATABASE_MIGRATION_REPORT.md — Sprint 4

## Summary

Five new migrations (022–026) implement the Workflow Runtime & Task Management data layer. All migrations build on top of the Sprint 3 schema (001–021) and are fully backwards-compatible. No existing tables were dropped or destructively altered.

---

## Migration 022 — `tasks` and `task_audit_log`

**File:** `supabase/migrations/022_tasks.sql`

### Tables Created

#### `tasks`
Core task record for workflow step tracking.

| Column | Type | Notes |
|--------|------|-------|
| `task_id` | `uuid PRIMARY KEY DEFAULT gen_random_uuid()` | |
| `workflow_instance_id` | `uuid NOT NULL REFERENCES workflow_instances` | |
| `obligation_id` | `uuid REFERENCES obligations` | nullable — event-driven vs date-driven |
| `tenant_id` | `uuid NOT NULL` | |
| `phase` | `text NOT NULL` | e.g. `'Drafting & Collection'` |
| `task_type` | `text NOT NULL` | e.g. `'prepare_draft'`, `'board_resolution'` |
| `title` | `text NOT NULL` | |
| `description` | `text` | |
| `status` | `text CHECK (status IN ('pending','assigned','in_progress','completed','rejected','reopened','cancelled'))` | Per WORKFLOW_STATE_MACHINE.md §2.6 |
| `is_hard_prerequisite` | `boolean NOT NULL DEFAULT false` | Hard = blocks phase advance |
| `sort_order` | `int NOT NULL DEFAULT 0` | |
| `assigned_to_user_id` | `uuid REFERENCES users` | |
| `due_date` | `timestamptz` | |
| `completed_at` | `timestamptz` | |
| `cancelled_at` | `timestamptz` | |
| `demo_session_id` | `text` | |
| `demo_expires_at` | `timestamptz` | |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | |

**Indexes:** `idx_tasks_workflow_phase`, `idx_tasks_assignee`, `idx_tasks_status`

**RLS:** Enabled. All access via `auth_tenant_id()` function.

#### `task_audit_log`
Append-only audit trail for every task and workflow state transition.

| Column | Type | Notes |
|--------|------|-------|
| `log_id` | `uuid PRIMARY KEY DEFAULT gen_random_uuid()` | |
| `entity_type` | `text CHECK (entity_type IN ('task','workflow_instance'))` | |
| `entity_id` | `uuid NOT NULL` | |
| `tenant_id` | `uuid NOT NULL` | |
| `actor_type` | `text CHECK (actor_type IN ('user','system','scheduler'))` | |
| `actor_user_id` | `uuid REFERENCES users` | null for system/scheduler |
| `event_type` | `text NOT NULL CHECK (event_type IN (...))` | Full set per WORKFLOW_STATE_MACHINE.md §6.3 |
| `from_state` | `text` | |
| `to_state` | `text` | |
| `reason` | `text` | |
| `metadata` | `jsonb NOT NULL DEFAULT '{}'` | |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | |

**Immutability:** `REVOKE UPDATE, DELETE ON task_audit_log FROM authenticated` — enforced at DB level.

---

## Migration 023 — `escalation_policies`, `escalation_policy_steps`, `escalation_events`

**File:** `supabase/migrations/023_escalation.sql`

Per WORKFLOW_STATE_MACHINE.md §5 — two-table escalation ladder design.

### Tables Created / Altered

#### `escalation_policies`
Defines when escalation triggers.

| Column | Type | Notes |
|--------|------|-------|
| `policy_id` | `uuid PRIMARY KEY` | |
| `tenant_id` | `uuid` | |
| `trigger_condition` | `text CHECK (trigger_condition IN ('obligation_overdue','task_overdue','workflow_blocked_n_days','deadline_approaching'))` | |
| `threshold_days` | `int NOT NULL DEFAULT 0` | Days after trigger condition met |
| `cooldown_hours` | `int NOT NULL DEFAULT 24` | Minimum hours between escalations |
| `is_active` | `boolean NOT NULL DEFAULT true` | |

#### `escalation_policy_steps`
Multi-step escalation ladder — each step fires after `delay_hours` from the previous.

| Column | Type | Notes |
|--------|------|-------|
| `step_id` | `uuid PRIMARY KEY` | |
| `policy_id` | `uuid NOT NULL REFERENCES escalation_policies` | |
| `step_number` | `int NOT NULL` | 1-based; UNIQUE per policy |
| `delay_hours` | `int NOT NULL DEFAULT 0` | Hours after previous step (or policy trigger) |
| `escalate_to_role` | `text` | |
| `notify_channel` | `text CHECK (notify_channel IN ('email','in_app','whatsapp'))` | |
| `requires_acknowledgement` | `boolean NOT NULL DEFAULT false` | |

#### `escalation_events` — extended
Added `step_id`, `acknowledged_at`, `acknowledged_by` columns to the existing table from Sprint 3.

---

## Migration 024 — `notification_outbox`

**File:** `supabase/migrations/024_notification_outbox.sql`

Outbox pattern for reliable email/WhatsApp delivery. In-app notifications continue to write directly to `notifications`.

### Table Created

#### `notification_outbox`
| Column | Type | Notes |
|--------|------|-------|
| `outbox_id` | `uuid PRIMARY KEY` | |
| `tenant_id` | `uuid NOT NULL` | |
| `recipient_user_id` | `uuid NOT NULL REFERENCES users` | |
| `notification_type` | `text NOT NULL` | |
| `channel` | `text CHECK (channel IN ('email','whatsapp'))` | |
| `subject` | `text` | |
| `body_text` | `text NOT NULL` | |
| `metadata` | `jsonb NOT NULL DEFAULT '{}'` | |
| `status` | `text CHECK (status IN ('pending','sent','failed','cancelled')) DEFAULT 'pending'` | |
| `attempts` | `int NOT NULL DEFAULT 0` | |
| `last_attempted_at` | `timestamptz` | |
| `sent_at` | `timestamptz` | |
| `related_obligation_id` | `uuid REFERENCES obligations` | |
| `related_workflow_instance_id` | `uuid REFERENCES workflow_instances` | |
| `related_task_id` | `uuid REFERENCES tasks` | |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | |

**Deduplication indexes** (per WORKFLOW_STATE_MACHINE.md §8.3):
- `idx_outbox_dedup_obligation` — unique per (recipient, type, obligation, day) when status ≠ 'cancelled'
- `idx_outbox_dedup_workflow` — unique per (recipient, type, workflow, day)

---

## Migration 025 — Workflow Instance Alterations

**File:** `supabase/migrations/025_workflow_alterations.sql`

Adds Sprint 4 columns to existing Sprint 3 tables — fully additive, no destructive changes.

### Columns Added

#### `workflow_instances`
| Column | Type | Notes |
|--------|------|-------|
| `status` | `text CHECK (status IN ('draft','active','blocked','completed','cancelled')) DEFAULT 'draft'` | Two-layer model |
| `cancelled_at` | `timestamptz` | |
| `cancelled_reason` | `text` | |
| `phase_before_block` | `text` | Stored on block; restored on unblock |

#### `obligation_templates`
| Column | Default |
|--------|---------|
| `alert_lead_times` | `jsonb NOT NULL DEFAULT '[30,14,7,3,1]'` |

#### `notifications`
Extended `notification_type` CHECK to include Sprint 4 event types. Added `channel` CHECK. Added FK columns `related_workflow_instance_id` and `related_task_id`.

---

## Migration 026 — `task_dependencies`

**File:** `supabase/migrations/026_task_dependencies.sql`

Dependency graph for finish-to-start and finish-to-finish task ordering.

### Table Created

#### `task_dependencies`
| Column | Type | Notes |
|--------|------|-------|
| `dependency_id` | `uuid PRIMARY KEY` | |
| `workflow_instance_id` | `uuid NOT NULL REFERENCES workflow_instances` | |
| `tenant_id` | `uuid NOT NULL` | |
| `upstream_task_id` | `uuid NOT NULL REFERENCES tasks` | |
| `downstream_task_id` | `uuid NOT NULL REFERENCES tasks` | |
| `dependency_type` | `text CHECK (dependency_type IN ('finish_to_start','finish_to_finish'))` | |
| `created_by_user_id` | `uuid REFERENCES users` | |
| `created_at` | `timestamptz NOT NULL DEFAULT now()` | |

**Constraints:**
- `UNIQUE(upstream_task_id, downstream_task_id)` — no duplicate edges
- `CHECK (upstream_task_id <> downstream_task_id)` — no self-dependency

**Permissions:** `GRANT SELECT, INSERT, DELETE` (no UPDATE — dependencies are immutable once created).

**Note:** Circular dependency prevention is enforced in the application layer (`DependencyEngine.addDependency()`) via ancestor traversal, not at the database level, to support informative error messages.

---

## RLS Summary

All five new tables have Row Level Security enabled using the `auth_tenant_id()` function. The security model is identical to Sprint 3 tables.

| Table | RLS Policy |
|-------|-----------|
| `tasks` | tenant isolation via `tenant_id = auth_tenant_id()` |
| `task_audit_log` | tenant isolation; INSERT only for authenticated; no UPDATE/DELETE |
| `escalation_policies` | tenant isolation |
| `escalation_policy_steps` | via policy JOIN |
| `escalation_events` | tenant isolation |
| `notification_outbox` | tenant isolation |
| `task_dependencies` | tenant isolation |

---

## Migration Execution Order

```
001-021  Sprint 3 (frozen — not modified)
022      tasks + task_audit_log
023      escalation (policies + steps + events extension)
024      notification_outbox
025      workflow_instances.status + notifications extensions
026      task_dependencies
```

All migrations are idempotent (`IF NOT EXISTS`, `IF NOT ADD COLUMN IF NOT EXISTS`).
