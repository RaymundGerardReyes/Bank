-- V54__seed_payment_rail_configurations.sql
-- Seed standard BSP and International Payment Rails

INSERT INTO payment_rail_configurations (rail_name, processing_type, max_amount_per_tx, active)
VALUES 
    ('SWIFT', 'REAL_TIME', 1000000.00, TRUE),
    ('INSTAPAY', 'REAL_TIME', 50000.00, TRUE),
    ('PESONET', 'BATCH', 500000.00, TRUE),
    ('FEDWIRE', 'REAL_TIME', 1000000.00, TRUE),
    ('ACH', 'BATCH', 100000.00, TRUE)
ON CONFLICT (rail_name) DO UPDATE 
SET processing_type = EXCLUDED.processing_type,
    max_amount_per_tx = EXCLUDED.max_amount_per_tx,
    active = EXCLUDED.active;
