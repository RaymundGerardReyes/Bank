-- Transactions table definition for ledger records and idempotency checks
CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_reference VARCHAR(100) NOT NULL UNIQUE,
    idempotency_key VARCHAR(100) UNIQUE,
    source_account_number VARCHAR(50) NOT NULL,
    destination_account_number VARCHAR(50) NOT NULL,
    amount NUMERIC(19, 4) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_idempotency ON transactions(idempotency_key);
CREATE INDEX idx_transactions_source_acc ON transactions(source_account_number);
CREATE INDEX idx_transactions_dest_acc ON transactions(destination_account_number);
