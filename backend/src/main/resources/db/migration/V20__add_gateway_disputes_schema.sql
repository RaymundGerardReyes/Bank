CREATE TABLE gateway_disputes (
    id BIGSERIAL PRIMARY KEY,
    dispute_reference VARCHAR(100) UNIQUE NOT NULL,
    payment_intent_id BIGINT NOT NULL,
    merchant_id BIGINT NOT NULL,
    amount DECIMAL(19, 4) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    reason_code VARCHAR(50) NOT NULL, -- FRAUDULENT, UNRECOGNIZED, PRODUCT_NOT_RECEIVED
    status VARCHAR(50) NOT NULL, -- OPEN, UNDER_INVESTIGATION, WON, LOST
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    CONSTRAINT fk_gd_payment_intent FOREIGN KEY (payment_intent_id) REFERENCES payment_intents (id),
    CONSTRAINT fk_gd_merchant FOREIGN KEY (merchant_id) REFERENCES merchants (id)
);
