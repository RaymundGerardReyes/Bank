CREATE TABLE IF NOT EXISTS payment_authorizations (
    id BIGSERIAL PRIMARY KEY,
    authorization_reference VARCHAR(255) UNIQUE NOT NULL,
    checkout_session_id VARCHAR(255) NOT NULL,
    payment_intent_id VARCHAR(255) NOT NULL,
    customer_account_number VARCHAR(255) NOT NULL,
    merchant_id BIGINT NOT NULL,
    amount DECIMAL(19,4) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    authorized_at TIMESTAMP,
    expires_at TIMESTAMP,
    CONSTRAINT uk_authorization_session UNIQUE (checkout_session_id)
);
