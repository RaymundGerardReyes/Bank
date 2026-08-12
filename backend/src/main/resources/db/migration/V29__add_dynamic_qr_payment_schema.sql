CREATE TABLE dynamic_qr_payments (
    id BIGSERIAL PRIMARY KEY,
    qr_reference VARCHAR(100) UNIQUE NOT NULL,
    payment_intent_id BIGINT UNIQUE NOT NULL,
    qr_payload TEXT NOT NULL,
    status VARCHAR(50) NOT NULL, -- CREATED, ACTIVE, SCANNED, PAID, EXPIRED, CANCELLED
    expires_at TIMESTAMP NOT NULL,
    scanned_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_dqr_payment_intent FOREIGN KEY (payment_intent_id) REFERENCES payment_intents(id)
);
