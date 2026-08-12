-- V5__api_gateway_and_security.sql

-- API Gateway: Secure API Keys with rotation and IP whitelisting
CREATE TABLE IF NOT EXISTS api_keys (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    environment VARCHAR(20) NOT NULL, -- 'LIVE' or 'SANDBOX'
    prefix VARCHAR(10) NOT NULL,
    masked_hash VARCHAR(255) NOT NULL UNIQUE,
    ip_whitelist VARCHAR(255) DEFAULT '0.0.0.0/0',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE' or 'REVOKED'
    last_used_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT fk_api_keys_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE INDEX idx_api_keys_hash ON api_keys(masked_hash);
CREATE INDEX idx_api_keys_customer ON api_keys(customer_id);

-- Security: Immutable Audit Logs for Enterprise Compliance
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    actor VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    resource_id VARCHAR(100),
    details TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_actor ON audit_logs(actor);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
