-- V34__add_payment_sessions.sql
-- Additive migration for Phase A: Institution API + PaymentSession Domain

-- 1. Safely extend the existing merchants table to act as an Institution if needed
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS institution_type VARCHAR(50);

-- 2. Create the new Payment Sessions table
CREATE TABLE IF NOT EXISTS payment_sessions (
    id BIGSERIAL PRIMARY KEY,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    institution_id BIGINT NOT NULL,
    institution_reference VARCHAR(255) NOT NULL,
    customer_reference VARCHAR(255),
    amount NUMERIC(19,4) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'PHP',
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'CREATED',
    callback_url TEXT,
    expires_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_ps_institution FOREIGN KEY (institution_id) REFERENCES merchants (id)
);

-- 3. Create indexes for fast lookup by institution and session ID
CREATE INDEX IF NOT EXISTS idx_ps_institution ON payment_sessions(institution_id);
CREATE INDEX IF NOT EXISTS idx_ps_session_id ON payment_sessions(session_id);