-- First create the merchants table (required by payment_intents FK)
CREATE TABLE IF NOT EXISTS merchants (
    id BIGSERIAL PRIMARY KEY,
    merchant_code VARCHAR(50) UNIQUE NOT NULL,
    legal_name VARCHAR(255) NOT NULL,
    business_registration_number VARCHAR(100) UNIQUE NOT NULL,
    tax_id VARCHAR(100),
    industry_code VARCHAR(50),
    beneficial_owner_name VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'APPLICATION',
    risk_profile VARCHAR(50),
    settlement_account VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE payment_intents (
    id BIGSERIAL PRIMARY KEY,
    intent_id VARCHAR(100) UNIQUE NOT NULL,
    merchant_id BIGINT NOT NULL,
    customer_account_number VARCHAR(100) NOT NULL,
    amount DECIMAL(19, 4) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    fee_amount DECIMAL(19, 4) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL, -- CREATED, REQUIRES_ACTION, AUTHORIZED, CAPTURED, FAILED, REFUNDED
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_payment_intents_merchant FOREIGN KEY (merchant_id) REFERENCES merchants (id)
);

CREATE TABLE refunds (
    id BIGSERIAL PRIMARY KEY,
    refund_id VARCHAR(100) UNIQUE NOT NULL,
    payment_intent_id BIGINT NOT NULL,
    amount DECIMAL(19, 4) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) NOT NULL, -- PENDING, COMPLETED, FAILED
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_refunds_payment_intent FOREIGN KEY (payment_intent_id) REFERENCES payment_intents (id)
);

-- Merged from V18__harden_vam_and_api_keys.sql
-- VULN 3: Add explicit persistence for Scheduled Transfer VAM restrictions across async threads
ALTER TABLE transactions 
    ADD COLUMN IF NOT EXISTS scheduled_vam_restriction VARCHAR(50);

-- VULN 5: Retroactively secure all legacy V5 API Keys.
-- Bind them strictly to the root master ledger of the customer that owns them.
UPDATE api_keys ak
SET linked_account_id = (
    SELECT a.account_number 
    FROM accounts a 
    WHERE a.customer_id = ak.customer_id 
      AND (a.parent_account_id IS NULL OR a.parent_account_id = '') 
    LIMIT 1
)
WHERE ak.linked_account_id IS NULL;

-- API Gateway: OAuth2-style merchant API client credentials
-- Provisioned by ApiClientService, distinct from legacy customer api_keys
CREATE TABLE IF NOT EXISTS api_clients (
    id BIGSERIAL PRIMARY KEY,
    client_id VARCHAR(255) NOT NULL UNIQUE,
    client_secret_hash VARCHAR(512) NOT NULL,
    merchant_id BIGINT NOT NULL,
    environment VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    scopes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT fk_api_clients_merchant FOREIGN KEY (merchant_id) REFERENCES merchants (id)
);

CREATE INDEX IF NOT EXISTS idx_api_clients_client_id ON api_clients(client_id);
CREATE INDEX IF NOT EXISTS idx_api_clients_merchant_id ON api_clients(merchant_id);
