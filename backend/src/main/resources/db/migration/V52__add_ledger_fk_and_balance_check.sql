-- V52__add_ledger_fk_and_balance_check.sql
-- Enforce referential integrity between ledger entries and their parent transactions
-- to prevent orphaned ledger records in the event of partial flushes.

ALTER TABLE ledger_entries
  ADD CONSTRAINT fk_ledger_transaction_reference
  FOREIGN KEY (transaction_reference) REFERENCES transactions(transaction_reference)
  ON DELETE RESTRICT;

-- Add a CHECK constraint to prevent negative balances at the storage layer.
ALTER TABLE accounts
  ADD CONSTRAINT chk_account_balance_non_negative
  CHECK (balance >= 0);

-- Add CHECK constraints on ledger_entries to prevent zero or negative amounts.
ALTER TABLE ledger_entries
  ADD CONSTRAINT chk_ledger_amount_positive
  CHECK (amount > 0);

-- Add CHECK on transactions to prevent zero or negative amounts.
ALTER TABLE transactions
  ADD CONSTRAINT chk_transaction_amount_positive
  CHECK (amount > 0);
