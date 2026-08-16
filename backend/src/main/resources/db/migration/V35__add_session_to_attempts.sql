-- V35__add_session_to_attempts.sql
-- Phase C: Link internal payment attempts to external payment sessions safely

ALTER TABLE payment_attempts ADD COLUMN IF NOT EXISTS payment_session_id VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_pa_session_id ON payment_attempts(payment_session_id);