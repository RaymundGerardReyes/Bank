-- V6__orchestration_and_routing.sql

-- Payment Orchestration: Core Gateways
CREATE TABLE IF NOT EXISTS payment_gateways (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'STRIPE', 'ADYEN', 'LOCAL_RTGS'
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    priority INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

-- Smart Routing Rules (Dynamic routing based on currency/amount)
CREATE TABLE IF NOT EXISTS routing_rules (
    id BIGSERIAL PRIMARY KEY,
    currency VARCHAR(10) NOT NULL,
    min_amount NUMERIC(19, 4) NOT NULL DEFAULT 0.0000,
    max_amount NUMERIC(19, 4),
    primary_gateway_id BIGINT NOT NULL,
    fallback_gateway_id BIGINT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_route_primary FOREIGN KEY (primary_gateway_id) REFERENCES payment_gateways(id),
    CONSTRAINT fk_route_fallback FOREIGN KEY (fallback_gateway_id) REFERENCES payment_gateways(id)
);

CREATE INDEX idx_routing_currency ON routing_rules(currency);

-- Orchestration Event Logs (Tracks failovers and latency)
CREATE TABLE IF NOT EXISTS orchestration_events (
    id BIGSERIAL PRIMARY KEY,
    transaction_reference VARCHAR(100) NOT NULL,
    gateway_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'ROUTED', 'FAILED', 'FAILOVER_TRIGGERED'
    latency_ms INT,
    error_code VARCHAR(100),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_orch_gateway FOREIGN KEY (gateway_id) REFERENCES payment_gateways(id)
);

CREATE INDEX idx_orch_events_tx ON orchestration_events(transaction_reference);