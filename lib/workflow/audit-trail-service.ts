/**
 * AuditTrailService — Sprint 4
 *
 * Append-only audit log for all workflow and task state changes.
 *
 * Invariants (enforced at call sites — every service depends on this):
 *   1. Called within the same logical operation as the state change it records.
 *   2. Never throws — write failures are logged to console but do not propagate.
 *      Business operations must not fail because of audit failures.
 *   3. No UPDATE, no DELETE — enforced by DB RLS (REVOKE UPDATE, DELETE FROM authenticated).
 *   4. actor_user_id is null when actor_type != 'user'.
 */

import type {
  AuditEventToCreate,
  AuditLogRow,
  EntityType,
  WorkflowDbAdapter,
} from './types'

export class AuditTrailService {
  /**
   * Append a single audit event. Never throws.
   */
  async log(event: AuditEventToCreate, db: WorkflowDbAdapter): Promise<void> {
    try {
      await db.appendAuditLog([event])
    } catch (err) {
      console.error('[AuditTrailService] Failed to write audit log:', err, event)
    }
  }

  /**
   * Append multiple audit events atomically. Never throws.
   * Preferred for phase advances that touch multiple tasks simultaneously.
   */
  async logBatch(events: AuditEventToCreate[], db: WorkflowDbAdapter): Promise<void> {
    if (events.length === 0) return
    try {
      await db.appendAuditLog(events)
    } catch (err) {
      console.error('[AuditTrailService] Failed to write audit log batch:', err)
    }
  }

  /**
   * Read audit history for a task or workflow instance, ordered by created_at ASC.
   */
  async getHistory(
    entityType: EntityType,
    entityId:   string,
    db:         WorkflowDbAdapter
  ): Promise<AuditLogRow[]> {
    return db.getAuditLog(entityType, entityId)
  }
}

export const auditTrailService = new AuditTrailService()
