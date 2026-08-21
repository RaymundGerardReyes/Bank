-- V39__add_webhook_endpoints_schema.sql

CREATE TABLE IF NOT EXISTS webhook_endpoints (
    id BIGSERIAL PRIMARY KEY,
    merchant_id BIGINT NOT NULL,
    url VARCHAR(500) NOT NULL,
    environment VARCHAR(20) NOT NULL, -- LIVE, SANDBOX
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, DISABLED
    events TEXT NOT NULL,
    secret_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhook_endpoints_merchant ON webhook_endpoints(merchant_id);

CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id BIGSERIAL PRIMARY KEY,
    endpoint_id BIGINT NOT NULL,
    event_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL, -- DELIVERED, FAILED, RETRYING
    response_code INT,
    response_body TEXT,
    duration_ms INT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_webhook_deliveries_endpoint FOREIGN KEY (endpoint_id) REFERENCES webhook_endpoints(id) ON DELETE CASCADE
);

CREATE INDEX idx_webhook_deliveries_endpoint ON webhook_deliveries(endpoint_id);
