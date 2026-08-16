CREATE TABLE transaction_intents (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    rail VARCHAR(50) NOT NULL,
    source_account_id VARCHAR(50) NOT NULL,
    recipient VARCHAR(255) NOT NULL,
    amount DECIMAL(19, 4) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    fee DECIMAL(19, 4) NOT NULL,
    total DECIMAL(19, 4) NOT NULL,
    idempotency_key VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    executed_transaction_id BIGINT
);

CREATE INDEX idx_transaction_intents_user_id ON transaction_intents(user_id);
CREATE INDEX idx_transaction_intents_status ON transaction_intents(status);
