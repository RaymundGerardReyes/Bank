CREATE TABLE compliance_evidence_records (
    id BIGSERIAL PRIMARY KEY,
    evidence_reference VARCHAR(100) UNIQUE NOT NULL,
    regulatory_requirement_id BIGINT NOT NULL,
    evidence_type VARCHAR(50) NOT NULL, -- AUDIT_LOG, CONFIGURATION, INCIDENT_REPORT, PEN_TEST
    description TEXT NOT NULL,
    file_uri VARCHAR(255),
    verified_by VARCHAR(100),
    verified_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cer_requirement FOREIGN KEY (regulatory_requirement_id) REFERENCES regulatory_requirements(id)
);
