-- V7__payroll_and_ledger.sql

-- Bulk Distribution: Maker-Checker Dual Approval Workflow
CREATE TABLE IF NOT EXISTS disbursement_batches (
    id BIGSERIAL PRIMARY KEY,
    batch_reference VARCHAR(100) NOT NULL UNIQUE,
    maker_id BIGINT NOT NULL,
    checker_id BIGINT,
    source_account_number VARCHAR(50) NOT NULL,
    total_amount NUMERIC(19, 4) NOT NULL,
    total_items INT NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING_APPROVAL', -- 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'COMPLETED'
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT fk_batch_maker FOREIGN KEY (maker_id) REFERENCES customers(id),
    CONSTRAINT fk_batch_checker FOREIGN KEY (checker_id) REFERENCES customers(id)
);

-- Highly normalized batch items to prevent data redundancy
CREATE TABLE IF NOT EXISTS batch_items (
    id BIGSERIAL PRIMARY KEY,
    batch_id BIGINT NOT NULL,
    recipient_account_number VARCHAR(50) NOT NULL,
    amount NUMERIC(19, 4) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    transaction_reference VARCHAR(100),
    CONSTRAINT fk_batch_items_batch FOREIGN KEY (batch_id) REFERENCES disbursement_batches(id) ON DELETE CASCADE
);

CREATE INDEX idx_batch_items_batch_id ON batch_items(batch_id);

-- Strict Double-Entry Accounting Ledger
-- Replaces the need to update balances redundantly without a strict trace
CREATE TABLE IF NOT EXISTS ledger_entries (
    id BIGSERIAL PRIMARY KEY,
    transaction_reference VARCHAR(100) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    entry_type VARCHAR(10) NOT NULL, -- 'DEBIT' (money out) or 'CREDIT' (money in)
    amount NUMERIC(19, 4) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ledger_acc ON ledger_entries(account_number);
CREATE INDEX idx_ledger_tx ON ledger_entries(transaction_reference);