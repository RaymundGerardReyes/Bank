CREATE TABLE payment_event_outbox (
    id BIGSERIAL PRIMARY KEY,
    event_id VARCHAR(100) UNIQUE NOT NULL,
    merchant_id BIGINT NOT NULL,
    aggregate_type VARCHAR(50) NOT NULL,
    aggregate_id VARCHAR(100) NOT NULL,
    idempotency_key VARCHAR(255) UNIQUE NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    attempt_count INT NOT NULL DEFAULT 0,
    next_attempt_at TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    last_error TEXT
);

CREATE INDEX idx_outbox_status_next_attempt ON payment_event_outbox(status, next_attempt_at);
CREATE INDEX idx_outbox_merchant_id ON payment_event_outbox(merchant_id);
