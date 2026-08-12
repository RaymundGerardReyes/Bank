ALTER TABLE customers
ADD COLUMN risk_profile VARCHAR(50),
ADD COLUMN locked BOOLEAN DEFAULT FALSE NOT NULL;

-- Merged from V14__backfill_legacy_accounts.sql
-- Enterprise Data Cleansing: Standardizes old accounts to strict ISO 7812 formats
-- Enforce strict database integrity now that legacy data is cleansed
ALTER TABLE accounts ALTER COLUMN card_expiry SET NOT NULL;
ALTER TABLE accounts ALTER COLUMN card_cvv SET NOT NULL;
ALTER TABLE accounts ALTER COLUMN swift_code SET NOT NULL;

