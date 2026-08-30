-- V58__add_merchant_owner.sql
-- PHASE 2: Implement Merchant Ownership Redesign

-- 1. Add the column (Nullable for safe rollout, preserving legacy test fixtures 999 and 1001)
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS owner_id BIGINT;

-- 2. Add the foreign key constraint to enforce referential integrity
ALTER TABLE merchants ADD CONSTRAINT fk_merchant_owner FOREIGN KEY (owner_id) REFERENCES customers(id);

-- 3. Add an index to optimize the upcoming Phase 5 lookup queries
CREATE INDEX IF NOT EXISTS idx_merchants_owner_id ON merchants(owner_id);
