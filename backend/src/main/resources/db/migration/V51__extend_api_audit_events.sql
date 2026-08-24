-- V51__extend_api_audit_events.sql
-- Phase 15: Extend api_audit_events for complete external request history

ALTER TABLE api_audit_events
    ADD COLUMN IF NOT EXISTS api_key_id        BIGINT,
    ADD COLUMN IF NOT EXISTS environment       VARCHAR(20),
    ADD COLUMN IF NOT EXISTS linked_account_id VARCHAR(100),
    ADD COLUMN IF NOT EXISTS granted_scopes    TEXT,
    ADD COLUMN IF NOT EXISTS authentication_status  VARCHAR(30),
    ADD COLUMN IF NOT EXISTS authorization_status   VARCHAR(30),
    ADD COLUMN IF NOT EXISTS auth_failure_reason     VARCHAR(100),
    ADD COLUMN IF NOT EXISTS request_stage           VARCHAR(50),
    ADD COLUMN IF NOT EXISTS status_family           VARCHAR(5),
    ADD COLUMN IF NOT EXISTS latency_ms              BIGINT,
    ADD COLUMN IF NOT EXISTS idempotency_key         VARCHAR(255);

-- Indexes for historical investigation queries
CREATE INDEX IF NOT EXISTS idx_api_audit_api_key_id       ON api_audit_events(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_audit_linked_account   ON api_audit_events(linked_account_id);
CREATE INDEX IF NOT EXISTS idx_api_audit_merchant_id      ON api_audit_events(merchant_id);
CREATE INDEX IF NOT EXISTS idx_api_audit_response_code    ON api_audit_events(response_code);
CREATE INDEX IF NOT EXISTS idx_api_audit_created_at       ON api_audit_events(created_at);
CREATE INDEX IF NOT EXISTS idx_api_audit_auth_status      ON api_audit_events(authentication_status);
CREATE INDEX IF NOT EXISTS idx_api_audit_request_stage    ON api_audit_events(request_stage);
