-- V17__add_api_key_account_binding.sql
-- Enterprise API Gateway: Allow API Keys to be locked to a specific VAM Sub-Account

ALTER TABLE api_keys 
    ADD COLUMN IF NOT EXISTS linked_account_id VARCHAR(50);

CREATE INDEX IF NOT EXISTS idx_api_keys_linked_account ON api_keys(linked_account_id);