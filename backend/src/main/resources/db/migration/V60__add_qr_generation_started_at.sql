-- V60__add_qr_generation_started_at.sql
-- PHASE 1: Add QR Generation state timestamp and Merchant Payment Profile tables

ALTER TABLE payment_intents ADD COLUMN IF NOT EXISTS qr_generation_started_at TIMESTAMP;

CREATE TABLE IF NOT EXISTS merchant_payment_profiles (
    id BIGSERIAL PRIMARY KEY,
    merchant_id BIGINT NOT NULL,
    provider VARCHAR(50) NOT NULL,
    external_merchant_id VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    is_preferred BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_merchant_profile FOREIGN KEY (merchant_id) REFERENCES merchants(id)
);

-- Drop legacy V29 table to prevent schema duplication
DROP TABLE IF EXISTS dynamic_qr_payments;

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
