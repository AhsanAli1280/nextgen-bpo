/**
 * Compliance Platform — typed integration boundary (Sprint 5A).
 *
 * Defines the PORT the UI calls. Implementations live in Sprint 5B / WS0
 * (SupabaseWorkflowDbAdapter + create-event-instance Edge Function + data loaders),
 * where they consume the existing Sprint 1–4 services (rule engine, workflow services).
 *
 * 5A SHIPS NO IMPLEMENTATION. `unconfiguredPort` throws IntegrationNotImplemented so
 * the UI compiles and renders against a typed contract without any mock business logic.
 * There is deliberately NO fake rule engine and NO fake workflow engine here.
 */

import type {
  DashboardData,
  WizardConfig,
  WizardAnswers,
  ObligationChainVM,
  CalendarObligationVM,
  WorkflowVM,
  FilingInput,
} from './types'

export class IntegrationNotImplemented extends Error {
  constructor(method: string) {
    super(
      `IntegrationNotImplemented: ${method} — wired in Sprint 5B (WS0). ` +
      `5A renders typed boundaries only; no mock business logic.`
    )
    this.name = 'IntegrationNotImplemented'
  }
}

/**
 * The single boundary between Sprint 5A UI and Sprint 5B backend integration.
 * Every method maps to an existing service (see SERVICE_INTEGRATION_MAP.md):
 *   - loadDashboard / loadCalendar / loadWorkflow → tenant-scoped reads + view-model mapping
 *   - getWizardConfig → Events taxonomy (server)
 *   - createEventInstance → `create-event-instance` Edge Fn (runRuleEngine + initializeWorkflow)
 *   - advancePhase / completeTask / recordFiling → WorkflowInstanceService / TaskAssignmentEngine
 */
export interface ComplianceDataPort {
  loadDashboard(companyId: string): Promise<DashboardData>
  getWizardConfig(eventTypeId: string): Promise<WizardConfig>
  createEventInstance(input: {
    companyId:   string
    eventTypeId: string
    answers:     WizardAnswers
    eventDate:   string
    demoSessionId?: string | null
  }): Promise<ObligationChainVM>
  loadCalendar(companyId: string): Promise<CalendarObligationVM[]>
  loadWorkflow(workflowInstanceId: string): Promise<WorkflowVM>
  advancePhase(workflowInstanceId: string, toPhase: string): Promise<WorkflowVM>
  startTask(taskId: string): Promise<void>
  completeTask(taskId: string): Promise<void>
  recordFiling(workflowInstanceId: string, filing: FilingInput): Promise<WorkflowVM>
}

/**
 * Default port used until WS0 lands. Every call throws — guarantees no screen
 * silently shows fabricated data. Swap for the real adapter in Sprint 5B.
 */
export const unconfiguredPort: ComplianceDataPort = {
  loadDashboard:       async () => { throw new IntegrationNotImplemented('loadDashboard') },
  getWizardConfig:     async () => { throw new IntegrationNotImplemented('getWizardConfig') },
  createEventInstance: async () => { throw new IntegrationNotImplemented('createEventInstance') },
  loadCalendar:        async () => { throw new IntegrationNotImplemented('loadCalendar') },
  loadWorkflow:        async () => { throw new IntegrationNotImplemented('loadWorkflow') },
  advancePhase:        async () => { throw new IntegrationNotImplemented('advancePhase') },
  startTask:           async () => { throw new IntegrationNotImplemented('startTask') },
  completeTask:        async () => { throw new IntegrationNotImplemented('completeTask') },
  recordFiling:        async () => { throw new IntegrationNotImplemented('recordFiling') },
}

/**
 * Resolver indirection so 5B can register the real port without touching UI imports.
 */
let activePort: ComplianceDataPort = unconfiguredPort
export function setCompliancePort(port: ComplianceDataPort): void { activePort = port }
export function compliancePort(): ComplianceDataPort { return activePort }
