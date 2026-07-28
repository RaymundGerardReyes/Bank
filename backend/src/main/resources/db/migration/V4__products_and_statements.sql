-- Products table definition
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    product_code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    interest_rate NUMERIC(7, 4) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_products_product_code ON products(product_code);

-- Statements table definition
CREATE TABLE IF NOT EXISTS statements (
    id BIGSERIAL PRIMARY KEY,
    account_number VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    pdf_storage_path VARCHAR(500),
    generated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_statements_account_number ON statements(account_number);
