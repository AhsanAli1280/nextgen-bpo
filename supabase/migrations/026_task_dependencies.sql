-- 026_task_dependencies.sql
-- Sprint 4: Task dependency graph (finish-to-start and finish-to-finish)
-- Per WORKFLOW_STATE_MACHINE.md §8.5 (new migration, not in Sprint 4 Arch doc)
-- Circular dependency prevention enforced in application layer (DependencyEngine service)
-- Depends on: 013 (workflow_instances), 022 (tasks), 009 (tenant_accounts, users)

CREATE TABLE IF NOT EXISTS task_dependencies (
  task_dependency_id    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_instance_id  uuid        NOT NULL
                        REFERENCES  workflow_instances(workflow_instance_id) ON DELETE CASCADE,
  tenant_id             uuid        NOT NULL
                        REFERENCES  tenant_accounts(tenant_id),
  upstream_task_id      uuid        NOT NULL
                        REFERENCES  tasks(task_id) ON DELETE CASCADE,
  downstream_task_id    uuid        NOT NULL
                        REFERENCES  tasks(task_id) ON DELETE CASCADE,
  dependency_type       text        NOT NULL
                        CHECK (dependency_type IN ('finish_to_start', 'finish_to_finish')),
  created_by_user_id    uuid        REFERENCES users(id),
  created_at            timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT uq_task_dependency  UNIQUE (upstream_task_id, downstream_task_id),
  CONSTRAINT no_self_dependency  CHECK  (upstream_task_id != downstream_task_id)
);

-- Index for downstream lookup (blocking check on task start/complete)
CREATE INDEX IF NOT EXISTS idx_task_dep_downstream
  ON task_dependencies(downstream_task_id, dependency_type);

-- Index for upstream lookup (satisfaction notification on task complete)
CREATE INDEX IF NOT EXISTS idx_task_dep_upstream
  ON task_dependencies(upstream_task_id, dependency_type);

CREATE INDEX IF NOT EXISTS idx_task_dep_workflow
  ON task_dependencies(workflow_instance_id);

ALTER TABLE task_dependencies ENABLE ROW LEVEL SECURITY;

-- Admin-only creation per OQ-8 (see SPRINT_4_HANDOFF.md §9)
CREATE POLICY tenant_isolation ON task_dependencies
  USING (tenant_id = auth_tenant_id());

-- UPDATE excluded: dependencies immutable once created (delete and recreate if change needed)
GRANT SELECT, INSERT, DELETE ON task_dependencies TO authenticated;
