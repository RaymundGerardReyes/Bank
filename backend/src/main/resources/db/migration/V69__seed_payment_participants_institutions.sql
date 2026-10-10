-- V69__seed_payment_participants_institutions.sql
-- Seed standard financial institutions across Fedwire, ACH, InstaPay, PESONet, and SWIFT rails

INSERT INTO payment_participants (bic, institution_name, role, rail, status, settlement_account, connectivity_status, created_at)
VALUES
    -- US Fedwire / ACH Rails
    ('021000021', 'Chase Bank', 'RECEIVER', 'FEDWIRE,ACH', 'ACTIVE', 'SETTLE-CHASE-01', 'ONLINE', CURRENT_TIMESTAMP),
    ('026009593', 'Bank of America', 'RECEIVER', 'FEDWIRE,ACH', 'ACTIVE', 'SETTLE-BOFA-01', 'ONLINE', CURRENT_TIMESTAMP),
    ('121000248', 'Wells Fargo', 'RECEIVER', 'FEDWIRE,ACH', 'ACTIVE', 'SETTLE-WF-01', 'ONLINE', CURRENT_TIMESTAMP),
    ('021000089', 'Citibank N.A.', 'RECEIVER', 'FEDWIRE,ACH', 'ACTIVE', 'SETTLE-CITI-01', 'ONLINE', CURRENT_TIMESTAMP),

    -- Philippine InstaPay / PESONet Rails
    ('BDOUPHM2', 'BDO Unibank', 'RECEIVER', 'INSTAPAY,PESONET', 'ACTIVE', 'SETTLE-BDO-01', 'ONLINE', CURRENT_TIMESTAMP),
    ('BOPIPHMM', 'Bank of the Philippine Islands', 'RECEIVER', 'INSTAPAY,PESONET', 'ACTIVE', 'SETTLE-BPI-01', 'ONLINE', CURRENT_TIMESTAMP),
    ('MBTCPHMM', 'Metrobank', 'RECEIVER', 'INSTAPAY,PESONET', 'ACTIVE', 'SETTLE-METRO-01', 'ONLINE', CURRENT_TIMESTAMP),
    ('UBPHPHMM', 'UnionBank of the Philippines', 'RECEIVER', 'INSTAPAY,PESONET', 'ACTIVE', 'SETTLE-UBP-01', 'ONLINE', CURRENT_TIMESTAMP),

    -- International SWIFT Rail
    ('HSBCUS33', 'HSBC Bank USA', 'RECEIVER', 'SWIFT', 'ACTIVE', 'SETTLE-HSBC-01', 'ONLINE', CURRENT_TIMESTAMP),
    ('SCBLUS33', 'Standard Chartered Bank', 'RECEIVER', 'SWIFT', 'ACTIVE', 'SETTLE-STAN-01', 'ONLINE', CURRENT_TIMESTAMP),
    ('BARCGB22', 'Barclays Bank', 'RECEIVER', 'SWIFT', 'ACTIVE', 'SETTLE-BARC-01', 'ONLINE', CURRENT_TIMESTAMP)
ON CONFLICT (bic) DO UPDATE
SET institution_name = EXCLUDED.institution_name,
    role = EXCLUDED.role,
    rail = EXCLUDED.rail,
    status = EXCLUDED.status,
    settlement_account = EXCLUDED.settlement_account,
    connectivity_status = EXCLUDED.connectivity_status,
    updated_at = CURRENT_TIMESTAMP;
