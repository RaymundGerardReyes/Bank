ALTER TABLE authorization_attempts
ADD COLUMN auth_type VARCHAR(50) DEFAULT 'WEBAUTHN',
ADD COLUMN ip_address VARCHAR(50),
ADD COLUMN amount DECIMAL(19,4),
ADD COLUMN source_account VARCHAR(255),
ADD COLUMN destination_account VARCHAR(255);
