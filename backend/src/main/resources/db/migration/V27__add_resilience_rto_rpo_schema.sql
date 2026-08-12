CREATE TABLE critical_business_services (
    id BIGSERIAL PRIMARY KEY,
    service_name VARCHAR(100) UNIQUE NOT NULL,
    rto_minutes INT NOT NULL, -- Recovery Time Objective
    rpo_minutes INT NOT NULL, -- Recovery Point Objective
    max_tolerable_downtime_minutes INT NOT NULL,
    recovery_strategy TEXT NOT NULL,
    status VARCHAR(50) NOT NULL, -- ONLINE, DEGRADED, RECOVERING, OFFLINE
    last_tested_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);
