-- V10__relax_legacy_api_keys_constraints.sql
-- Relax legacy V5 NOT NULL constraints on prefix and masked_hash columns for API key creation

ALTER TABLE api_keys ALTER COLUMN prefix DROP NOT NULL;
ALTER TABLE api_keys ALTER COLUMN masked_hash DROP NOT NULL;
