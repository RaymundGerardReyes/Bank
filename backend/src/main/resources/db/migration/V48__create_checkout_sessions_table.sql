CREATE TABLE IF NOT EXISTS checkout_sessions (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    merchant_id BIGINT NOT NULL,
    idempotency_key VARCHAR(255) NOT NULL,
    payment_intent_id VARCHAR(255) NOT NULL,
    amount DECIMAL(19,4) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    selected_payment_method VARCHAR(255),
    success_url TEXT NOT NULL,
    cancel_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    CONSTRAINT uk_merchant_idempotency UNIQUE (merchant_id, idempotency_key)
);
