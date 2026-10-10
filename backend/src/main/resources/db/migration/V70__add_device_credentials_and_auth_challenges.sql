-- V70: Add device credentials and authentication challenges for device-bound biometric authentication

CREATE TABLE IF NOT EXISTS device_credentials (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    device_id VARCHAR(255) NOT NULL UNIQUE,
    public_key VARCHAR(2048) NOT NULL,
    algorithm VARCHAR(50) NOT NULL DEFAULT 'SHA256withECDSA',
    device_model VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP,
    CONSTRAINT fk_device_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE INDEX IF NOT EXISTS idx_device_credentials_customer_id ON device_credentials(customer_id);
CREATE INDEX IF NOT EXISTS idx_device_credentials_device_id ON device_credentials(device_id);

CREATE TABLE IF NOT EXISTS device_auth_challenges (
    id BIGSERIAL PRIMARY KEY,
    challenge VARCHAR(255) NOT NULL UNIQUE,
    device_id VARCHAR(255) NOT NULL,
    customer_id BIGINT NOT NULL,
    purpose VARCHAR(50) NOT NULL DEFAULT 'BIOMETRIC_LOGIN',
    expires_at TIMESTAMP NOT NULL,
    consumed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_device_auth_challenges_device_id ON device_auth_challenges(device_id);
CREATE INDEX IF NOT EXISTS idx_device_auth_challenges_challenge ON device_auth_challenges(challenge);

