-- V9__api_gateway_enforcement.sql
-- Additive migration altering existing api_keys table from V5 with key hashing, scopes, and expiration

ALTER TABLE api_keys ALTER COLUMN customer_id DROP NOT NULL;

ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS key_prefix VARCHAR(20) DEFAULT 'sk_test_';
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS key_hash VARCHAR(128);
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS cidr_whitelist VARCHAR(255) DEFAULT '0.0.0.0/0';
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS scopes VARCHAR(500) DEFAULT '';
ALTER TABLE api_keys ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '90' DAY);

-- Populate key_hash and key_prefix for any pre-existing V5 legacy rows if key_hash is null
UPDATE api_keys SET key_prefix = prefix WHERE key_prefix IS NULL AND prefix IS NOT NULL;
UPDATE api_keys SET key_hash = masked_hash WHERE key_hash IS NULL AND masked_hash IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_prefix ON api_keys(key_prefix);
