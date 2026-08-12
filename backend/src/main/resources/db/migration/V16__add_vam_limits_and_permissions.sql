-- V16__add_vam_limits_and_permissions.sql
-- Enterprise VAM: Add hierarchy, limits, and permissions to the ledger

ALTER TABLE accounts 
    ADD COLUMN IF NOT EXISTS account_type VARCHAR(50) DEFAULT 'MAIN',
    ADD COLUMN IF NOT EXISTS parent_account_id VARCHAR(50),
    ADD COLUMN IF NOT EXISTS account_name VARCHAR(100),
    ADD COLUMN IF NOT EXISTS daily_limit NUMERIC(19, 4),
    ADD COLUMN IF NOT EXISTS monthly_limit NUMERIC(19, 4),
    ADD COLUMN IF NOT EXISTS allow_incoming BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS allow_outgoing BOOLEAN DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS require_dual_approval BOOLEAN DEFAULT FALSE;

-- Index for fast hierarchy lookups
CREATE INDEX IF NOT EXISTS idx_accounts_parent_id ON accounts(parent_account_id);

-- Merged from V16__add_disputes_schema.sql
CREATE TABLE IF NOT EXISTS dispute_cases (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    transaction_reference VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    filed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    resolution_notes TEXT
);