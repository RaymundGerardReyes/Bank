-- V37__add_inbound_webhook_events.sql
-- Phase G: Dedicated idempotency table for INBOUND webhooks from external payment providers.
-- Separates provider-inbound event tracking from the internal payment_events table
-- which is used for system-generated reconciliation events.
-- The composite UNIQUE constraint on (provider, external_event_id) is the security boundary
-- that prevents double-processing of PayMongo / Paynamics / Maya webhook retries.

CREATE TABLE IF NOT EXISTS inbound_webhook_events (
    id                  BIGSERIAL PRIMARY KEY,
    provider            VARCHAR(50)         NOT NULL,
    external_event_id   VARCHAR(255)        NOT NULL,
    event_type          VARCHAR(100)        NOT NULL,
    raw_payload         TEXT                NOT NULL,
    signature_header    VARCHAR(512),
    verified            BOOLEAN             NOT NULL DEFAULT FALSE,
    provider_reference  VARCHAR(255),
    normalized_status   VARCHAR(50),
    received_at         TIMESTAMP           NOT NULL DEFAULT NOW(),
    processed_at        TIMESTAMP,
    CONSTRAINT uq_inbound_webhook_provider_event UNIQUE (provider, external_event_id)
);

CREATE INDEX IF NOT EXISTS idx_iwh_provider          ON inbound_webhook_events(provider);
CREATE INDEX IF NOT EXISTS idx_iwh_provider_ref      ON inbound_webhook_events(provider_reference);
CREATE INDEX IF NOT EXISTS idx_iwh_event_type        ON inbound_webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_iwh_received_at       ON inbound_webhook_events(received_at);
