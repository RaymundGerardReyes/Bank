CREATE TABLE customer_complaints (
    id BIGSERIAL PRIMARY KEY,
    complaint_reference VARCHAR(100) UNIQUE NOT NULL,
    customer_id BIGINT NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g., SERVICE_OUTAGE, UNAUTHORIZED_FEE, BEHAVIOR
    channel VARCHAR(50) NOT NULL, -- PHONE, EMAIL, APP
    status VARCHAR(50) NOT NULL, -- OPEN, ESCALATED, RESOLVED
    sla_deadline TIMESTAMP NOT NULL,
    assigned_officer VARCHAR(100),
    resolution_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    CONSTRAINT fk_cc_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
);
