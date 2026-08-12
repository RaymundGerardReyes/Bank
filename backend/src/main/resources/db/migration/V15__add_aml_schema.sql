CREATE TABLE aml_alerts (
    id BIGSERIAL PRIMARY KEY,
    transaction_reference VARCHAR(255) NOT NULL,
    account_number VARCHAR(255) NOT NULL,
    rule_triggered VARCHAR(255) NOT NULL,
    risk_score INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE aml_cases (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    assigned_analyst VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    resolution_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

CREATE TABLE suspicious_transaction_reports (
    id BIGSERIAL PRIMARY KEY,
    case_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    transaction_references TEXT NOT NULL,
    narrative TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    submitted_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE account_holds (
    id BIGSERIAL PRIMARY KEY,
    account_number VARCHAR(255) NOT NULL,
    case_id BIGINT,
    hold_amount DECIMAL(19, 2),
    reason TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    released_at TIMESTAMP
);

ALTER TABLE accounts
ADD COLUMN frozen BOOLEAN DEFAULT FALSE NOT NULL;

-- Merged from V15__add_fcm_token_to_customers.sql
-- Adds Firebase Cloud Messaging (FCM) device token tracking for push notifications
ALTER TABLE customers
ADD COLUMN fcm_token VARCHAR(255);

