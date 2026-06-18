-- 021_auth_hooks.sql
CREATE OR REPLACE FUNCTION public.add_tenant_claims(event jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  claims jsonb;
  user_tenant_id uuid;
  user_role text;
BEGIN
  SELECT tenant_id, role INTO user_tenant_id, user_role
  FROM public.users WHERE id = (event ->> 'user_id')::uuid;

  IF user_tenant_id IS NULL THEN
    RETURN event;
  END IF;

  claims := event -> 'claims';
  claims := jsonb_set(claims, '{tenant_id}', to_jsonb(user_tenant_id));
  claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
  RETURN jsonb_set(event, '{claims}', claims);
END;
$$;

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Register add_tenant_claims as Auth Hook in Supabase Dashboard:
-- Authentication → Hooks → Custom Access Token → select add_tenant_claims
