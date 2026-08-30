-- V62__satisfy_hibernate_qr_schema.sql
-- Re-create payment_qr_codes to satisfy Hibernate validation for PaymentQrCode entity

CREATE TABLE IF NOT EXISTS payment_qr_codes (
    id BIGSERIAL PRIMARY KEY,
    payment_intent_id BIGINT UNIQUE NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_qr_reference VARCHAR(100) NOT NULL,
    qr_type VARCHAR(50) NOT NULL,
    payload TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_qr_payment_intent FOREIGN KEY (payment_intent_id) REFERENCES payment_intents(id)
);
