-- PL/pgSQL atomic function: create_event_with_obligations
-- Called from SupabaseDbAdapter.createEventWithObligations() via supabase.rpc(...)
-- All inserts are atomic: full rollback on any failure.
--
-- Parameters:
--   p_company_id            uuid
--   p_tenant_id             uuid
--   p_event_type_id         uuid | null        (null for date-driven mode)
--   p_event_date            date | null        (null for date-driven mode)
--   p_demo_session_id       uuid | null
--   p_demo_expires_at       timestamptz | null
--   p_obligations           jsonb              (array of obligation objects)
--
-- Returns: jsonb { event_instance_id, obligation_ids[], workflow_instance_ids[] }

CREATE OR REPLACE FUNCTION create_event_with_obligations(
  p_company_id        uuid,
  p_tenant_id         uuid,
  p_event_type_id     uuid,
  p_event_date        date,
  p_demo_session_id   uuid,
  p_demo_expires_at   timestamptz,
  p_obligations       jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_event_instance_id     uuid;
  v_obligation_id         uuid;
  v_workflow_instance_id  uuid;
  v_obligation_ids        uuid[]      := '{}';
  v_workflow_instance_ids uuid[]      := '{}';
  v_ob                    jsonb;
  v_upstream_rule_id      text;
  v_upstream_rv_id        uuid;
  v_upstream_obl_id       uuid;
  v_workflow_template_id  uuid;
  v_trigger_date          date;
  v_computed_deadline     date;
BEGIN

  -- 1. Create event_instance (Mode A only — when event_type_id is non-null)
  IF p_event_type_id IS NOT NULL THEN
    INSERT INTO event_instances
      (company_id, tenant_id, event_type_id, event_date, demo_session_id, demo_expires_at)
    VALUES
      (p_company_id, p_tenant_id, p_event_type_id, p_event_date, p_demo_session_id, p_demo_expires_at)
    RETURNING event_instance_id INTO v_event_instance_id;
  END IF;

  -- 2. Create obligations (first pass — without linked_obligation_id)
  FOR v_ob IN SELECT * FROM jsonb_array_elements(p_obligations) LOOP

    INSERT INTO obligations (
      company_id, tenant_id, rule_version_id, event_type_id,
      trigger_date, computed_deadline, status,
      linked_obligation_id, assigned_to_user_id,
      demo_session_id, demo_expires_at
    ) VALUES (
      p_company_id,
      p_tenant_id,
      (v_ob->>'rule_version_id')::uuid,
      (v_ob->>'event_type_id')::uuid,
      (v_ob->>'trigger_date')::date,
      (v_ob->>'computed_deadline')::date,
      COALESCE(v_ob->>'status', 'upcoming'),
      NULL,  -- linked_obligation_id set in second pass
      (v_ob->>'assigned_to_user_id')::uuid,
      p_demo_session_id,
      p_demo_expires_at
    )
    RETURNING obligation_id INTO v_obligation_id;

    v_obligation_ids := v_obligation_ids || v_obligation_id;

    -- Link to event_instance
    IF v_event_instance_id IS NOT NULL THEN
      INSERT INTO event_obligations (event_instance_id, obligation_id)
      VALUES (v_event_instance_id, v_obligation_id);
    END IF;

  END LOOP;

  -- 3. Second pass: wire linked_obligation_id for chained obligations
  FOR i IN 1..jsonb_array_length(p_obligations) LOOP
    v_ob := p_obligations->>(i-1);
    v_upstream_rule_id := v_ob->>'_linked_to_rule_id';

    IF v_upstream_rule_id IS NOT NULL THEN
      -- Find the obligation_id of the upstream obligation in this batch
      -- by matching its rule_version_id against the obligations we just created
      SELECT rule_versions.rule_version_id INTO v_upstream_rv_id
      FROM rule_versions
      WHERE rule_id = v_upstream_rule_id
        AND effective_to IS NULL
      LIMIT 1;

      IF v_upstream_rv_id IS NOT NULL THEN
        -- Find which position in p_obligations corresponds to this rule_version_id
        SELECT o.obligation_id INTO v_upstream_obl_id
        FROM obligations o
        WHERE o.obligation_id = ANY(v_obligation_ids)
          AND o.rule_version_id = v_upstream_rv_id
        LIMIT 1;

        IF v_upstream_obl_id IS NOT NULL THEN
          UPDATE obligations
          SET linked_obligation_id = v_upstream_obl_id
          WHERE obligation_id = v_obligation_ids[i];
        END IF;
      END IF;
    END IF;
  END LOOP;

  -- 4. Create workflow_instances for each obligation
  FOR i IN 1..cardinality(v_obligation_ids) LOOP
    v_obligation_id := v_obligation_ids[i];

    -- Lookup workflow_template via obligation_template → workflow_template chain
    SELECT wt.workflow_template_id INTO v_workflow_template_id
    FROM obligations ob
    JOIN rule_versions rv     ON ob.rule_version_id = rv.rule_version_id
    JOIN obligation_templates ot ON rv.rule_id = ot.rule_id
    JOIN workflow_templates wt   ON ot.obligation_template_id = wt.obligation_template_id
    WHERE ob.obligation_id = v_obligation_id
    LIMIT 1;

    IF v_workflow_template_id IS NOT NULL THEN
      INSERT INTO workflow_instances (
        obligation_id, event_instance_id, workflow_template_id,
        tenant_id, current_phase, substate_entered_at,
        demo_session_id, demo_expires_at
      ) VALUES (
        v_obligation_id,
        v_event_instance_id,
        v_workflow_template_id,
        p_tenant_id,
        'Not Started',
        now(),
        p_demo_session_id,
        p_demo_expires_at
      )
      RETURNING workflow_instance_id INTO v_workflow_instance_id;

      v_workflow_instance_ids := v_workflow_instance_ids || v_workflow_instance_id;

      -- Insert initial phase history row
      INSERT INTO workflow_phase_history (workflow_instance_id, phase, entered_at)
      VALUES (v_workflow_instance_id, 'Not Started', now());
    END IF;

  END LOOP;

  -- Return result as JSON
  RETURN jsonb_build_object(
    'event_instance_id',     v_event_instance_id,
    'obligation_ids',        to_jsonb(v_obligation_ids),
    'workflow_instance_ids', to_jsonb(v_workflow_instance_ids)
  );

EXCEPTION WHEN OTHERS THEN
  -- Full rollback is implicit (function runs in transaction)
  RAISE;
END;
$$;

-- Grant execute to service_role (the SupabaseDbAdapter uses service_role key)
GRANT EXECUTE ON FUNCTION create_event_with_obligations TO service_role;
