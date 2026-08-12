CREATE TABLE api_audit_events (
    id BIGSERIAL PRIMARY KEY,
    request_id VARCHAR(100) NOT NULL,
    client_id VARCHAR(100),
    merchant_id BIGINT,
    endpoint VARCHAR(255) NOT NULL,
    http_method VARCHAR(10) NOT NULL,
    source_ip VARCHAR(50) NOT NULL,
    user_agent TEXT,
    response_code INT NOT NULL,
    risk_decision VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_api_audit_request ON api_audit_events(request_id);
CREATE INDEX idx_api_audit_client ON api_audit_events(client_id);
