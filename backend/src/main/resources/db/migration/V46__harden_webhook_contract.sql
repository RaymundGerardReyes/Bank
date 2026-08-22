ALTER TABLE payment_event_outbox
ADD COLUMN api_version VARCHAR(10) NOT NULL DEFAULT 'v1',
ADD COLUMN sequence INT NOT NULL DEFAULT 1,
ADD COLUMN delivered_at TIMESTAMP;

-- Ensure that for a single payment intent, sequence numbers are strictly ordered and unique
CREATE UNIQUE INDEX idx_outbox_aggregate_seq ON payment_event_outbox(aggregate_type, aggregate_id, sequence);
