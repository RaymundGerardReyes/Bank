-- V56__add_idempotency_claims_schema.sql
-- Dedicated idempotency claims table to enforce uniqueness before financial intent creation.

CREATE TABLE idempotency_claims (
    id BIGSERIAL PRIMARY KEY,
    merchant_id BIGINT NOT NULL,
    idempotency_key VARCHAR(255) NOT NULL,
    request_hash VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    response_body TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_merchant_idempotency_key UNIQUE (merchant_id, idempotency_key)
);

CREATE INDEX idx_idempotency_claims_hash ON idempotency_claims (request_hash);
