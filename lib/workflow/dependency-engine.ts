/**
 * DependencyEngine — Sprint 4
 *
 * Enforces finish-to-start and finish-to-finish task dependencies.
 * Circular dependency prevention via ancestor traversal in application layer.
 * Max chain depth = 10 (prevents pathological graphs).
 *
 * Per WORKFLOW_STATE_MACHINE.md §3.
 */

import { randomUUID } from 'crypto'
import { auditTrailService } from './audit-trail-service'
import type {
  AuditEventToCreate,
  DependencyType,
  TaskDependencyRow,
  TaskDependencyToCreate,
  TaskRow,
  WorkflowDbAdapter,
} from './types'
import {
  CircularDependencyDetected,
  CrossWorkflowDependencyNotSupported,
  DependencyChainTooDeep,
  TaskDependencyNotSatisfied,
} from './types'

const MAX_DEPTH = 10

/**
 * Traverse all ancestors of `startId` using the given dependency rows.
 * Returns the Set of all ancestor task IDs.
 * Throws DependencyChainTooDeep if traversal exceeds MAX_DEPTH.
 */
function findAncestors(startId: string, allDeps: TaskDependencyRow[]): Set<string> {
  const ancestors = new Set<string>()
  const queue: Array<{ id: string; depth: number }> = [{ id: startId, depth: 0 }]

  while (queue.length > 0) {
    const item = queue.shift()!
    if (item.depth > MAX_DEPTH) throw new DependencyChainTooDeep()

    const upstreams = allDeps
      .filter(d => d.downstream_task_id === item.id)
      .map(d => d.upstream_task_id)

    for (const up of upstreams) {
      if (!ancestors.has(up)) {
        ancestors.add(up)
        queue.push({ id: up, depth: item.depth + 1 })
      }
    }
  }

  return ancestors
}

export class DependencyEngine {
  /**
   * Add a dependency between two tasks.
   * Validates: same workflow, no self-dependency, no circular path.
   */
  async addDependency(
    upstreamTaskId:   string,
    downstreamTaskId: string,
    dependencyType:   DependencyType,
    createdByUserId:  string | null,
    db:               WorkflowDbAdapter
  ): Promise<TaskDependencyRow> {
    const [upstream, downstream] = await Promise.all([
      db.loadTask(upstreamTaskId),
      db.loadTask(downstreamTaskId),
    ])

    if (upstreamTaskId === downstreamTaskId) {
      throw new CircularDependencyDetected(upstreamTaskId, downstreamTaskId)
    }

    if (upstream.workflow_instance_id !== downstream.workflow_instance_id) {
      throw new CrossWorkflowDependencyNotSupported()
    }

    const allDeps = await db.loadAllDependenciesForWorkflow(upstream.workflow_instance_id)
    const ancestors = findAncestors(upstreamTaskId, allDeps)

    if (ancestors.has(downstreamTaskId)) {
      throw new CircularDependencyDetected(upstreamTaskId, downstreamTaskId)
    }

    const dep = await db.createTaskDependency({
      workflow_instance_id: upstream.workflow_instance_id,
      tenant_id:            upstream.tenant_id,
      upstream_task_id:     upstreamTaskId,
      downstream_task_id:   downstreamTaskId,
      dependency_type:      dependencyType,
      created_by_user_id:   createdByUserId,
    })

    return dep
  }

  /**
   * Check if a task can START (finish_to_start dependencies must be satisfied).
   * Throws TaskDependencyNotSatisfied if any upstream is not 'completed'.
   */
  async checkCanStart(taskId: string, db: WorkflowDbAdapter): Promise<void> {
    const deps = await db.loadTaskDependencies(taskId, 'downstream')
    const fts  = deps.filter(d => d.dependency_type === 'finish_to_start')

    for (const dep of fts) {
      const upstream = await db.loadTask(dep.upstream_task_id)
      if (upstream.status !== 'completed') {
        await auditTrailService.log({
          entity_type:   'task',
          entity_id:     taskId,
          tenant_id:     upstream.tenant_id,
          actor_type:    'system',
          actor_user_id: null,
          event_type:    'dependency_blocked',
          from_state:    null,
          to_state:      'blocked_by_dependency',
          reason:        `finish_to_start dependency on task ${dep.upstream_task_id} not satisfied`,
          metadata:      { upstream_task_id: dep.upstream_task_id, dependency_type: 'finish_to_start' },
        }, db)
        throw new TaskDependencyNotSatisfied(dep.upstream_task_id, 'finish_to_start')
      }
    }
  }

  /**
   * Check if a task can COMPLETE (finish_to_finish dependencies must be satisfied).
   * Throws TaskDependencyNotSatisfied if any upstream is not 'completed'.
   */
  async checkCanComplete(taskId: string, db: WorkflowDbAdapter): Promise<void> {
    const deps = await db.loadTaskDependencies(taskId, 'downstream')
    const ftf  = deps.filter(d => d.dependency_type === 'finish_to_finish')

    for (const dep of ftf) {
      const upstream = await db.loadTask(dep.upstream_task_id)
      if (upstream.status !== 'completed') {
        await auditTrailService.log({
          entity_type:   'task',
          entity_id:     taskId,
          tenant_id:     upstream.tenant_id,
          actor_type:    'system',
          actor_user_id: null,
          event_type:    'dependency_blocked',
          from_state:    null,
          to_state:      'blocked_by_dependency',
          reason:        `finish_to_finish dependency on task ${dep.upstream_task_id} not satisfied`,
          metadata:      { upstream_task_id: dep.upstream_task_id, dependency_type: 'finish_to_finish' },
        }, db)
        throw new TaskDependencyNotSatisfied(dep.upstream_task_id, 'finish_to_finish')
      }
    }
  }

  /**
   * Called when a task reaches 'completed'. Notifies downstream tasks.
   * Writes dependency_satisfied audit events for each now-unblocked downstream.
   */
  async onTaskCompleted(
    completedTask: TaskRow,
    db:            WorkflowDbAdapter
  ): Promise<void> {
    const downstreamDeps = await db.loadTaskDependencies(completedTask.task_id, 'upstream')
    if (downstreamDeps.length === 0) return

    const auditEvents: AuditEventToCreate[] = downstreamDeps.map(dep => ({
      entity_type:   'task' as const,
      entity_id:     dep.downstream_task_id,
      tenant_id:     completedTask.tenant_id,
      actor_type:    'system' as const,
      actor_user_id: null,
      event_type:    'dependency_satisfied' as const,
      from_state:    null,
      to_state:      'dependency_satisfied',
      reason:        null,
      metadata:      {
        upstream_task_id: completedTask.task_id,
        dependency_type:  dep.dependency_type,
      },
    }))

    await auditTrailService.logBatch(auditEvents, db)
  }
}

export const dependencyEngine = new DependencyEngine()
