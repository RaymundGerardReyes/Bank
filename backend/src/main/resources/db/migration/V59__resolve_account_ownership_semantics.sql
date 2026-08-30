-- V59__resolve_account_ownership_semantics.sql
-- PHASE 3: Repair Merchant-related account ownership semantics

-- 1. Add explicit merchant ownership representation to accounts
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS merchant_id BIGINT;

-- 2. Add referential integrity to the merchants table
ALTER TABLE accounts ADD CONSTRAINT fk_accounts_merchant FOREIGN KEY (merchant_id) REFERENCES merchants(id);

-- 3. Drop NOT NULL on customer_id because accounts can now exclusively belong to merchants
ALTER TABLE accounts ALTER COLUMN customer_id DROP NOT NULL;

-- 4. Safe Backfill: Migrate illegally mapped merchant IDs out of the customer_id column
UPDATE accounts 
SET merchant_id = customer_id, 
    customer_id = NULL 
WHERE account_number LIKE 'MERCHANT-SETTLEMENT-%' 
  AND customer_id IS NOT NULL;
  
-- 5. Index for performance on lookup queries
CREATE INDEX IF NOT EXISTS idx_accounts_merchant_id ON accounts(merchant_id);
