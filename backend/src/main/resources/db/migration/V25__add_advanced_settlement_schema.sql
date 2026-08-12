CREATE TABLE settlement_windows (
    id BIGSERIAL PRIMARY KEY,
    window_reference VARCHAR(100) UNIQUE NOT NULL,
    cycle_type VARCHAR(50) NOT NULL, -- INTRADAY, EOD
    rail VARCHAR(50) NOT NULL, -- PESONET, INSTAPAY, PHILPASS
    cut_off_time TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL, -- OPEN, CLOSED, RECONCILED, FAILED
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE settlement_instructions (
    id BIGSERIAL PRIMARY KEY,
    instruction_id VARCHAR(100) UNIQUE NOT NULL,
    settlement_window_id BIGINT NOT NULL,
    merchant_id BIGINT NOT NULL,
    amount DECIMAL(19, 4) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(50) NOT NULL, -- PENDING, SENT, ACKNOWLEDGED, REJECTED
    destination_account VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_si_window FOREIGN KEY (settlement_window_id) REFERENCES settlement_windows(id),
    CONSTRAINT fk_si_merchant FOREIGN KEY (merchant_id) REFERENCES merchants(id)
);

CREATE TABLE settlement_exceptions (
    id BIGSERIAL PRIMARY KEY,
    exception_reference VARCHAR(100) UNIQUE NOT NULL,
    settlement_instruction_id BIGINT NOT NULL,
    error_code VARCHAR(100) NOT NULL,
    error_description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL, -- UNRESOLVED, RESOLVED, MANUAL_INTERVENTION
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_se_instruction FOREIGN KEY (settlement_instruction_id) REFERENCES settlement_instructions(id)
);
