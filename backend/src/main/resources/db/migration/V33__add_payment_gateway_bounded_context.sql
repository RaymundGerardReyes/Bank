-- V33__add_payment_gateway_bounded_context.sql
-- Establishes the authoritative state tracking for external payment providers

CREATE TABLE payment_attempts (
    id BIGSERIAL PRIMARY KEY,
    attempt_id VARCHAR(100) UNIQUE NOT NULL,
    payment_intent_id BIGINT NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_reference VARCHAR(255),
    checkout_url TEXT,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    CONSTRAINT fk_pa_payment_intent FOREIGN KEY (payment_intent_id) REFERENCES payment_intents (id)
);

CREATE TABLE payment_events (
    id BIGSERIAL PRIMARY KEY,
    event_id VARCHAR(100) UNIQUE NOT NULL,
    payment_intent_id BIGINT NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    raw_payload TEXT NOT NULL,
    idempotency_key VARCHAR(255) UNIQUE NOT NULL,
    processed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pe_payment_intent FOREIGN KEY (payment_intent_id) REFERENCES payment_intents (id)
);

-- Crucial indexes for fast webhook lookups and idempotency guarantees
CREATE INDEX idx_payment_attempts_intent ON payment_attempts(payment_intent_id);
CREATE INDEX idx_payment_events_intent ON payment_events(payment_intent_id);
CREATE INDEX idx_payment_events_idempotency ON payment_events(idempotency_key);