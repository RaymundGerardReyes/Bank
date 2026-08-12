CREATE TABLE regulatory_requirements (
    id BIGSERIAL PRIMARY KEY,
    regulation VARCHAR(100) NOT NULL, -- e.g., 'MORPS', 'MORB', 'AFASA'
    section VARCHAR(100) NOT NULL, -- e.g., 'Sec 154', 'Circular 1213'
    applicability TEXT NOT NULL,
    control_description TEXT NOT NULL,
    implementation_status VARCHAR(50) NOT NULL, -- PLANNED, IMPLEMENTED, TESTED
    evidence_query TEXT, -- Optional query/pointer to evidence
    owner VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_regulatory_req_regulation ON regulatory_requirements(regulation);
