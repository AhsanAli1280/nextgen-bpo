-- 011_event_instances.sql
CREATE TABLE IF NOT EXISTS event_instances (
  event_instance_id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id                uuid NOT NULL REFERENCES companies(company_id),
  tenant_id                 uuid NOT NULL REFERENCES tenant_accounts(tenant_id),
  originating_event_card_id uuid REFERENCES event_cards(event_card_id),
  event_type_id             uuid NOT NULL REFERENCES event_types(event_type_id),
  event_date                date NOT NULL,
  declared_by_user_id       uuid REFERENCES users(id),
  declared_at               timestamptz NOT NULL DEFAULT now(),
  details                   jsonb NOT NULL DEFAULT '{}',
  demo_session_id           uuid,
  demo_expires_at           timestamptz
);

CREATE TABLE IF NOT EXISTS event_obligations (
  event_instance_id  uuid NOT NULL REFERENCES event_instances(event_instance_id),
  obligation_id      uuid NOT NULL,
  PRIMARY KEY (event_instance_id, obligation_id)
);

CREATE INDEX IF NOT EXISTS idx_event_instances_company ON event_instances(company_id);
CREATE INDEX IF NOT EXISTS idx_event_instances_tenant ON event_instances(tenant_id);
CREATE INDEX IF NOT EXISTS idx_event_instances_demo ON event_instances(demo_session_id)
  WHERE demo_session_id IS NOT NULL;
