/**
 * Compliance Platform — UI view-model types (Sprint 5A).
 *
 * These are PRESENTATION types consumed by UI components. They are intentionally
 * decoupled from the server-side domain types in lib/workflow and lib/rule-engine.
 * The binding layer (Sprint 5B / WS0) maps domain rows → these view models.
 *
 * No business logic lives here. Types only.
 */

export type ObligationStatus = 'overdue' | 'due_soon' | 'upcoming' | 'filed' | 'not_applicable' | 'superseded'

export type WorkflowPhase =
  | 'Not Started'
  | 'Drafting & Collection'
  | 'Internal Approval'
  | 'Filing Submitted'
  | 'Third-Party Verification'
  | 'Regulator Review'
  | 'Completed'
  | 'Blocked'

export type WorkflowStatus = 'draft' | 'active' | 'blocked' | 'completed' | 'cancelled'

export type TaskStatus =
  | 'pending' | 'assigned' | 'in_progress' | 'completed' | 'rejected' | 'reopened' | 'cancelled'

export type FilingChannel = 'eZfile' | 'physical' | 'PSX portal'
export type FilingOutcome = 'pending' | 'accepted' | 'rejected' | 'queries_raised'

// ── Dashboard ─────────────────────────────────────────────────────────────────

export interface EventCardVM {
  eventTypeId: string
  title:       string   // plain-language prompt, e.g. "Director & Officer Changes"
  icon:        string    // lucide icon key
}

export interface UpcomingObligationVM {
  obligationId: string
  title:        string
  formNumber:   string | null
  dueDate:      string   // ISO date
  status:       ObligationStatus
  triggerNote:  string | null
}

export interface DashboardData {
  companyName:   string
  isMultiCompany: boolean
  eventCards:    EventCardVM[]      // applicability-filtered upstream (rule engine)
  upcoming:      UpcomingObligationVM[]
  overdueCount:  number
  healthScore:   { value: number; basis: string } | null
  regulatoryChanges: { id: string; summary: string; citation: string }[]
}

// ── Event Wizard ────────────────────────────────────────────────────────────

export interface WizardOption {
  value:  string
  label:  string
  hint?:  string
}

export interface WizardQuestion {
  id:       string
  prompt:   string
  options:  WizardOption[]   // single-select cards
}

export interface WizardConfig {
  eventTypeId: string
  title:       string
  questions:   WizardQuestion[]   // ≤3, supplied by server (Events taxonomy)
  requiresEventDate: boolean
}

export type WizardAnswers = Record<string, string>

// ── Obligation result / chain ─────────────────────────────────────────────────

export interface ObligationVM {
  obligationId: string
  title:        string
  formNumber:   string | null
  deadlineDays: number
  dueDate:      string | null
  legalBasis:   string | null
  status:       ObligationStatus
  stepLabel?:   string   // "Step 1", "Step 2" for chained
}

export interface ObligationChainVM {
  eventInstanceId: string
  obligations:     ObligationVM[]   // ordered; linked = sequential
}

// ── Calendar ──────────────────────────────────────────────────────────────────

export interface CalendarObligationVM extends ObligationVM {
  workflowInstanceId: string | null
  isHardDeadline:     boolean
  linkedObligationId: string | null
}

// ── Workflow detail ─────────────────────────────────────────────────────────

export interface TaskVM {
  taskId:             string
  title:              string
  taskType:           string
  status:             TaskStatus
  isHardPrerequisite: boolean
}

export interface PhaseVM {
  phase:     WorkflowPhase
  enteredAt: string | null
  exitedAt:  string | null
  current:   boolean
}

export interface WorkflowVM {
  workflowInstanceId: string
  obligationTitle:    string
  status:             WorkflowStatus
  currentPhase:       WorkflowPhase
  activePhases:       WorkflowPhase[]
  blockedReason:      string | null
  phaseHistory:       PhaseVM[]
  tasks:              TaskVM[]
}

export interface FilingInput {
  filing_channel:    FilingChannel
  reference_number?: string | null
  outcome?:          FilingOutcome
  outcome_reason?:   string | null
}
