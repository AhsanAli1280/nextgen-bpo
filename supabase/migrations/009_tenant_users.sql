-- 009_tenant_users.sql
CREATE TABLE IF NOT EXISTS tenant_accounts (
  tenant_id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                 text NOT NULL,
  is_demo              boolean NOT NULL DEFAULT false,
  plan                 text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'professional', 'enterprise', 'demo')),
  file_storage_enabled boolean NOT NULL DEFAULT false,
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id  uuid NOT NULL REFERENCES tenant_accounts(tenant_id),
  email      text NOT NULL,
  full_name  text,
  role       text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);
