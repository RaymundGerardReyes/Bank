-- V38__harden_payment_state_machine.sql
-- Implements robust concurrency control (optimistic locking) and expands the webhook audit lifecycle.

-- 1. Add Optimistic Locking (version) to prevent concurrent state machine transitions
ALTER TABLE payment_attempts ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;
ALTER TABLE payment_sessions ADD COLUMN IF NOT EXISTS version BIGINT NOT NULL DEFAULT 0;

-- 2. Expand Inbound Webhook Events to support a full processing lifecycle and audit trail
ALTER TABLE inbound_webhook_events ADD COLUMN IF NOT EXISTS processing_status VARCHAR(50) NOT NULL DEFAULT 'RECEIVED';
ALTER TABLE inbound_webhook_events ADD COLUMN IF NOT EXISTS failure_reason TEXT;
ALTER TABLE inbound_webhook_events ADD COLUMN IF NOT EXISTS attempt_count INT NOT NULL DEFAULT 0;

-- 3. Index the processing status for fast queueing/review lookup
CREATE INDEX IF NOT EXISTS idx_iwh_processing_status ON inbound_webhook_events(processing_status);
