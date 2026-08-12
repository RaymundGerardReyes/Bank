CREATE TABLE payment_participants (
    id BIGSERIAL PRIMARY KEY,
    bic VARCHAR(11) UNIQUE NOT NULL, -- Bank Identifier Code
    institution_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL, -- SENDER, RECEIVER, CLEARING_HOUSE
    rail VARCHAR(50) NOT NULL, -- PESONET, INSTAPAY, PHILPASS
    status VARCHAR(50) NOT NULL, -- ACTIVE, SUSPENDED
    settlement_account VARCHAR(100) NOT NULL,
    connectivity_status VARCHAR(50) NOT NULL, -- ONLINE, OFFLINE
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE payment_messages (
    id BIGSERIAL PRIMARY KEY,
    message_id VARCHAR(100) UNIQUE NOT NULL,
    payment_intent_id BIGINT NOT NULL,
    message_type VARCHAR(50) NOT NULL, -- e.g., pacs.008.001.08
    version VARCHAR(20) NOT NULL,
    sender_bic VARCHAR(11) NOT NULL,
    receiver_bic VARCHAR(11) NOT NULL,
    payload_xml TEXT NOT NULL,
    validation_status VARCHAR(50) NOT NULL, -- VALID, INVALID
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pm_intent FOREIGN KEY (payment_intent_id) REFERENCES payment_intents(id),
    CONSTRAINT fk_pm_sender FOREIGN KEY (sender_bic) REFERENCES payment_participants(bic),
    CONSTRAINT fk_pm_receiver FOREIGN KEY (receiver_bic) REFERENCES payment_participants(bic)
);
