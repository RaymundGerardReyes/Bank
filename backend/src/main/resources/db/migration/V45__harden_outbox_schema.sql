ALTER TABLE payment_event_outbox
ADD COLUMN locked_at TIMESTAMP,
ADD COLUMN locked_by VARCHAR(255),
ADD COLUMN last_http_status INT,
ADD COLUMN updated_at TIMESTAMP;

-- Index to quickly find stuck leases
CREATE INDEX idx_outbox_delivering_lease ON payment_event_outbox(status, locked_at);
