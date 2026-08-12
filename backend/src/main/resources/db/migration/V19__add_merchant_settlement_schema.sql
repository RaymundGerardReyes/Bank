CREATE TABLE merchant_balances (
    id BIGSERIAL PRIMARY KEY,
    merchant_id BIGINT UNIQUE NOT NULL,
    available_balance DECIMAL(19, 4) NOT NULL DEFAULT 0.00,
    pending_balance DECIMAL(19, 4) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mb_merchant FOREIGN KEY (merchant_id) REFERENCES merchants (id)
);

CREATE TABLE settlement_batches (
    id BIGSERIAL PRIMARY KEY,
    batch_reference VARCHAR(100) UNIQUE NOT NULL,
    merchant_id BIGINT NOT NULL,
    amount DECIMAL(19, 4) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(50) NOT NULL, -- PENDING, PROCESSING, COMPLETED, FAILED
    destination_bank_account VARCHAR(100) NOT NULL,
    destination_routing_number VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    settled_at TIMESTAMP,
    CONSTRAINT fk_sb_merchant FOREIGN KEY (merchant_id) REFERENCES merchants (id)
);

-- Merged from V19__remove_fcm_token_legacy.sql
-- Enterprise Architecture Update: Dropping legacy Firebase FCM dependency
-- in favor of active WebSocket (STOMP) messaging.
ALTER TABLE customers DROP COLUMN IF EXISTS fcm_token;

