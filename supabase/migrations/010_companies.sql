-- 010_companies.sql
CREATE TABLE IF NOT EXISTS companies (
  company_id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name                  text NOT NULL,
  cuin                        text,
  incorporation_date          date,
  registered_office_province  text,
  status                      text NOT NULL DEFAULT 'active'
                              CHECK (status IN ('active', 'inactive', 'under winding-up', 'struck-off')),
  tenant_owner_id             uuid NOT NULL REFERENCES tenant_accounts(tenant_id),
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS company_profiles (
  company_profile_id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id                  uuid NOT NULL REFERENCES companies(company_id),
  corporate_form              text NOT NULL CHECK (corporate_form IN ('private', 'unlisted_public', 'listed')),
  is_smc                      boolean NOT NULL DEFAULT false,
  is_public_interest_company  boolean NOT NULL DEFAULT false,
  is_public_sector_company    boolean NOT NULL DEFAULT false,
  is_government_controlled    boolean NOT NULL DEFAULT false,
  is_foreign_owned_majority   boolean NOT NULL DEFAULT false,
  financial_year_end_month    integer NOT NULL CHECK (financial_year_end_month BETWEEN 1 AND 12),
  financial_year_end_day      integer NOT NULL CHECK (financial_year_end_day BETWEEN 1 AND 31),
  paid_up_capital             numeric(20, 2),
  exchange                    text,
  listing_date                date,
  effective_from              date NOT NULL DEFAULT CURRENT_DATE,
  effective_to                date
);

CREATE TABLE IF NOT EXISTS company_attributes (
  attribute_id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_profile_id  uuid NOT NULL REFERENCES company_profiles(company_profile_id),
  attribute_key       text NOT NULL,
  attribute_value     text NOT NULL,
  effective_from      date NOT NULL DEFAULT CURRENT_DATE,
  effective_to        date
);

CREATE TABLE IF NOT EXISTS company_regulatory_categories (
  company_profile_id   uuid NOT NULL REFERENCES company_profiles(company_profile_id),
  category_id          uuid NOT NULL REFERENCES regulatory_categories(category_id),
  PRIMARY KEY (company_profile_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_companies_tenant ON companies(tenant_owner_id);
CREATE INDEX IF NOT EXISTS idx_company_profiles_company ON company_profiles(company_id)
  WHERE effective_to IS NULL;
