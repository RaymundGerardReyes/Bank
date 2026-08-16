CREATE TABLE authorization_attempts (
    id BIGSERIAL PRIMARY KEY,
    transaction_intent_id BIGINT NOT NULL,
    challenge VARCHAR(255) NOT NULL UNIQUE,
    credential_id VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    verified_at TIMESTAMP,
    CONSTRAINT fk_auth_attempt_intent FOREIGN KEY (transaction_intent_id) REFERENCES transaction_intents(id)
);

CREATE INDEX idx_auth_attempts_intent_id ON authorization_attempts(transaction_intent_id);
