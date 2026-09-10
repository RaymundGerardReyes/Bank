-- V63__add_application_and_limits_to_api_keys.sql
-- Satisfy Hibernate schema validation for multi-app credentials and transactional limits

ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS application_id VARCHAR(100);
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS application_name VARCHAR(255);
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS per_transaction_limit NUMERIC(19, 4);
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS daily_limit NUMERIC(19, 4);

CREATE INDEX IF NOT EXISTS idx_api_keys_application_id ON api_keys(application_id);

