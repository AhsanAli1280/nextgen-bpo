# Auth / Tenant Context — Specification (WS0)

**Status:** SPEC (not implemented). Wired in Sprint 5B.
**Purpose:** establish the session → tenant → RLS chain the compliance app and `create-event-instance` depend on. Defines the typed clients the UI's `ComplianceDataPort` implementation will use.

---

## 1. Files (to build in 5B)

```
lib/supabase/client.ts   browser client (anon key, public)
lib/supabase/server.ts   server client (per-request, reads cookies/JWT)
lib/supabase/admin.ts    service-role client (Edge Fns / schedulers ONLY — never imported client-side)
lib/supabase/tenant.ts   getTenantContext(): resolves tenant_id + role + companyId from session
```

## 2. Client matrix

| Client | Key | Used by | RLS |
|---|---|---|---|
| browser | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client components | enforced (user JWT) |
| server | anon + request cookies | Server Components / Actions | enforced (user JWT) |
| admin | `SUPABASE_SERVICE_ROLE_KEY` (server-only env) | Edge Functions, schedulers | **bypasses** — use only where tenant is explicitly scoped in code |

Security: service-role key never `NEXT_PUBLIC_*`, never bundled to client. `admin.ts` importable only from server/edge contexts.

## 3. JWT → tenant (RLS)
- Custom JWT hook (migration 021) injects `tenant_id` (+ `role`) claim into the access token.
- Postgres RLS policies use `auth_tenant_id()` (migrations 020/023/…) to scope every compliance table.
- `getTenantContext()` reads the claim server-side; never trusts a client-supplied tenant_id.

```ts
interface TenantContext {
  tenantId:  string
  userId:    string
  role:      'owner' | 'admin' | 'member'
  companyId: string | null   // active company (single-company = the one; consultant = selected)
}
```

## 4. Auth guard
- `app/(app)/layout.tsx`: redirect to `/login` when no session; otherwise load `TenantContext`, pass `companyName` to `AppShell`.
- `app/(demo)/layout.tsx`: no auth; mint/read a `demo_session_id` (cookie), enforce 60-min inactivity / 4-hr absolute expiry (DEMO_WORKSPACE_ARCHITECTURE).

## 5. Port wiring (connects 5A UI ↔ 5B backend)
5B registers the real port at app boot:
```ts
import { setCompliancePort } from '@/lib/compliance/contracts'
setCompliancePort(makeSupabaseCompliancePort(serverClient, tenantContext))
```
`makeSupabaseCompliancePort` implements `ComplianceDataPort`:
- `loadDashboard/loadCalendar/loadWorkflow` → tenant-scoped reads via `server.ts`, map rows → view models.
- `getWizardConfig` → Events taxonomy read.
- `createEventInstance` → invoke `create-event-instance` Edge Fn.
- `advancePhase/startTask/completeTask/recordFiling` → call `WorkflowInstanceService` / `TaskAssignmentEngine` through `SupabaseWorkflowDbAdapter`.

Until then `unconfiguredPort` throws `IntegrationNotImplemented` — 5A UI renders typed boundaries, no mock data.

## 6. Demo context
- Demo uses anon browser client + `demo_session_id` cookie; all created rows tagged `demo_session_id` + `demo_expires_at`.
- Same `ComplianceDataPort` methods; the port impl injects demo tags on create.

## 7. Env
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server/edge only
```
