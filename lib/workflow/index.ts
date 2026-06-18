/**
 * lib/workflow — Sprint 4 barrel exports
 */

export * from './types'
export { auditTrailService, AuditTrailService } from './audit-trail-service'
export { taskGenerationService, TaskGenerationService } from './task-generation-service'
export { dependencyEngine, DependencyEngine } from './dependency-engine'
export { taskAssignmentEngine, TaskAssignmentEngine } from './task-assignment-engine'
export { workflowInstanceService, WorkflowInstanceService } from './workflow-instance-service'
export { InMemoryWorkflowDbAdapter, WORKFLOW_SEED } from './in-memory-workflow-adapter'
