-- V36__add_institution_callback_log.sql
-- Phase E: Add persistent tracking for outgoing webhooks from Bank to Institutions

CREATE TABLE IF NOT EXISTS institution_callback_log (
    id BIGSERIAL PRIMARY KEY,
    payment_session_id VARCHAR(100) NOT NULL,
    callback_url TEXT NOT NULL,
    payload TEXT NOT NULL,
    response_code INT,
    response_body TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, SUCCESS, FAILED
    attempt_count INT NOT NULL DEFAULT 0,
    next_retry_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inst_cb_session ON institution_callback_log(payment_session_id);
CREATE INDEX IF NOT EXISTS idx_inst_cb_status ON institution_callback_log(status);
CREATE INDEX IF NOT EXISTS idx_inst_cb_retry ON institution_callback_log(next_retry_at);