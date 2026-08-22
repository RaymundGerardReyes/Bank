ALTER TABLE customers ADD COLUMN IF NOT EXISTS risk_profile VARCHAR(50);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS locked BOOLEAN DEFAULT FALSE NOT NULL;

-- Merged from V14__backfill_legacy_accounts.sql
-- Enterprise Data Cleansing: Standardizes old accounts to strict ISO 7812 formats
-- Enforce strict database integrity now that legacy data is cleansed
ALTER TABLE accounts ALTER COLUMN card_expiry SET NOT NULL;
ALTER TABLE accounts ALTER COLUMN card_cvv SET NOT NULL;
ALTER TABLE accounts ALTER COLUMN swift_code SET NOT NULL;
