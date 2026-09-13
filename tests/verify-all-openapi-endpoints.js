/**
 * Comprehensive OpenAPI Verification Script
 * Validates 100% of all OpenAPI endpoints against the live Banking backend.
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const BFF_KEY = 'WQhQECsf4nIhiZ3H+CQRIaOIOnxbgBmbA9sRHpaKlaM=';
const GATEWAY_KEY = 'sk_test_2026_university_erp_sandbox_key';
const USER_EMAIL = 'user@example.com';
const USER_PASSWORD = 'Password123!';

async function run() {
    console.log('Logging in to obtain JWT session token...');
    const loginRes = await fetch(`${BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: USER_EMAIL, password: USER_PASSWORD })
    });
    const loginData = await loginRes.json();
    const token = loginData.token || loginData.data?.token;
    if (!token) throw new Error('Login failed: ' + JSON.stringify(loginData));
    console.log('Authentication successful. Token acquired.\n');

    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Internal-BFF-Key': BFF_KEY
    };

    const gatewayHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GATEWAY_KEY}`
    };

    const results = [];

    async function check(num, name, method, path, headers, body, validator) {
        try {
            const res = await fetch(`${BASE_URL}${path}`, {
                method,
                headers,
                body: body ? JSON.stringify(body) : undefined
            });
            let data = null;
            const text = await res.text();
            try { data = JSON.parse(text); } catch (e) { data = text; }
            
            const valid = validator(res.status, data);
            results.push({
                num,
                name,
                endpoint: `${method} ${path}`,
                status: res.status,
                passed: valid,
                details: valid ? 'OK' : (typeof data === 'object' ? JSON.stringify(data).slice(0, 100) : text.slice(0, 100))
            });
        } catch (err) {
            results.push({
                num,
                name,
                endpoint: `${method} ${path}`,
                status: 'ERR',
                passed: false,
                details: err.message
            });
        }
    }

    // 1. POST /api/v1/transfers
    await check(1, 'Transfer Standard', 'POST', '/api/v1/transfers', authHeaders, {
        sourceAccountNumber: '4859220013371001',
        destinationAccountNumber: '4859220013371002',
        amount: 5.00,
        idempotencyKey: 'idem_op_1_' + Date.now()
    }, s => s === 200 || s === 201);

    // 2. POST /api/v1/transfers/
    await check(2, 'Transfer Slash', 'POST', '/api/v1/transfers/', authHeaders, {
        sourceAccountNumber: '4859220013371001',
        destinationAccountNumber: '4859220013371002',
        amount: 5.00,
        idempotencyKey: 'idem_op_2_' + Date.now()
    }, s => s === 200 || s === 201);

    // 3. POST /api/v1/transfers/internal
    await check(3, 'Transfer Internal', 'POST', '/api/v1/transfers/internal', authHeaders, {
        sourceAccountNumber: '4859220013371001',
        destinationAccountNumber: '4859220013371002',
        amount: 5.00,
        idempotencyKey: 'idem_op_3_' + Date.now()
    }, s => s === 200 || s === 201);

    // 4. POST /api/v1/transfers/internal/
    await check(4, 'Transfer Internal Slash', 'POST', '/api/v1/transfers/internal/', authHeaders, {
        sourceAccountNumber: '4859220013371001',
        destinationAccountNumber: '4859220013371002',
        amount: 5.00,
        idempotencyKey: 'idem_op_4_' + Date.now()
    }, s => s === 200 || s === 201);

    // 5. POST /api/v1/transfers/external
    await check(5, 'Transfer External Wire', 'POST', '/api/v1/transfers/external', authHeaders, {
        sourceAccountNumber: '4859220013371001',
        destinationAccountNumber: 'EXT-NOVA-999',
        routingNumber: 'ROUTING-1234',
        recipientName: 'Nova Global',
        amount: 25.00,
        railName: 'SWIFT',
        idempotencyKey: 'idem_op_5_' + Date.now()
    }, s => s === 200 || s === 201);

    // 6. POST /api/v1/transfers/external/
    await check(6, 'Transfer External Wire Slash', 'POST', '/api/v1/transfers/external/', authHeaders, {
        sourceAccountNumber: '4859220013371001',
        destinationAccountNumber: 'EXT-NOVA-999',
        routingNumber: 'ROUTING-1234',
        recipientName: 'Nova Global',
        amount: 25.00,
        railName: 'SWIFT',
        idempotencyKey: 'idem_op_6_' + Date.now()
    }, s => s === 200 || s === 201);

    // 7. POST /api/v1/transactions/deposit
    await check(7, 'Deposit Funds', 'POST', '/api/v1/transactions/deposit', authHeaders, {
        accountNumber: '4859220013371001',
        amount: 100.00,
        idempotencyKey: 'idem_op_7_' + Date.now()
    }, s => s === 200 || s === 201);

    // 8. POST /api/v1/transactions/withdraw
    await check(8, 'Withdraw Funds', 'POST', '/api/v1/transactions/withdraw', authHeaders, {
        accountNumber: '4859220013371001',
        amount: 10.00,
        idempotencyKey: 'idem_op_8_' + Date.now()
    }, s => s === 200 || s === 201);

    // 9. POST /api/v1/transactions/external-payment
    await check(9, 'External Payment Rail', 'POST', '/api/v1/transactions/external-payment', authHeaders, {
        sourceAccountNumber: '4859220013371001',
        destinationAccountNumber: 'EXT-NOVA-999',
        routingNumber: 'ROUTING-1234',
        recipientName: 'Nova Global',
        amount: 10.00,
        railName: 'SWIFT',
        idempotencyKey: 'idem_op_9_' + Date.now()
    }, s => s === 200 || s === 201);

    // 10. GET /api/v1/transactions/history
    await check(10, 'Transaction History', 'GET', '/api/v1/transactions/history?accountNumber=4859220013371001', authHeaders, null, (s, d) => s === 200 && (Array.isArray(d?.data) || Array.isArray(d?.data?.content)));

    // 11. GET /api/v1/transactions/trace/{keyPrefix} (Gated for admin/teller, 403 for customer)
    await check(11, 'Transaction Trace (RBAC Gated)', 'GET', '/api/v1/transactions/trace/idem', authHeaders, null, s => s === 200 || s === 403);

    // 12. POST /api/v1/transactions/{id}/dispute
    const histRes = await fetch(`${BASE_URL}/api/v1/transactions/history?accountNumber=4859220013371001`, { headers: authHeaders });
    const histJson = await histRes.json();
    const txId = histJson.data?.content?.[0]?.id || histJson.data?.[0]?.id || 1;
    const txRef = histJson.data?.content?.[0]?.transactionReference || 'TXN-REF-1';
    await check(12, 'Dispute Transaction', 'POST', `/api/v1/transactions/${txId}/dispute`, authHeaders, {
        reasonCode: 'FRAUDULENT_ACTIVITY',
        notes: 'Verification test dispute'
    }, s => s === 200 || s === 201);

    // 13. POST /api/v1/transactions/receipt/send
    await check(13, 'Send Transaction Receipt', 'POST', '/api/v1/transactions/receipt/send', authHeaders, {
        transactionReference: txRef,
        amount: 25.00,
        date: '2026-09-13',
        sourceEmail: USER_EMAIL,
        recipientEmail: USER_EMAIL
    }, s => s === 200);

    // 14. POST /api/v1/transactions/intents
    let mfaIntentId = null;
    const intentRes = await fetch(`${BASE_URL}/api/v1/transactions/intents`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
            sourceAccountId: '4859220013371001',
            recipient: '4859220013371002',
            amount: 20.00,
            currency: 'USD',
            rail: 'INTERNAL',
            idempotencyKey: 'idem_op_14_' + Date.now()
        })
    });
    const intentData = await intentRes.json();
    mfaIntentId = intentData.data?.id;
    results.push({
        num: 14,
        name: 'Create Transaction Intent',
        endpoint: 'POST /api/v1/transactions/intents',
        status: intentRes.status,
        passed: intentRes.status === 200 && !!mfaIntentId,
        details: mfaIntentId ? `ID: ${mfaIntentId}` : 'Created'
    });

    // 15. POST /api/v1/transactions/intents/{id}/authorization/options
    let challenge = null;
    const optRes = await fetch(`${BASE_URL}/api/v1/transactions/intents/${mfaIntentId}/authorization/options`, {
        method: 'POST',
        headers: authHeaders
    });
    const optData = await optRes.json();
    challenge = optData.data?.challenge;
    results.push({
        num: 15,
        name: 'MFA Authorization Options',
        endpoint: `POST /api/v1/transactions/intents/{id}/authorization/options`,
        status: optRes.status,
        passed: optRes.status === 200 && !!challenge,
        details: challenge ? 'Challenge generated' : 'OK'
    });

    // 16. POST /api/v1/transactions/intents/{id}/authorization/verify
    await check(16, 'Verify MFA Code', 'POST', `/api/v1/transactions/intents/${mfaIntentId}/authorization/verify`, authHeaders, {
        challenge: challenge,
        assertionPayload: 'test_payload'
    }, s => s === 200);

    // Intent 2 for Mobile Push Flow
    const pushIntentRes = await fetch(`${BASE_URL}/api/v1/transactions/intents`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
            sourceAccountId: '4859220013371001',
            recipient: '4859220013371002',
            amount: 15.00,
            currency: 'USD',
            rail: 'INTERNAL',
            idempotencyKey: 'idem_push_' + Date.now()
        })
    });
    const pushIntentId = (await pushIntentRes.json()).data?.id;

    // 17. POST /api/v1/transactions/intents/{id}/authorization/push-request
    await check(17, 'Request Push Authorization', 'POST', `/api/v1/transactions/intents/${pushIntentId}/authorization/push-request`, authHeaders, {
        deviceToken: 'fcm_test_token_123',
        devicePlatform: 'ANDROID'
    }, s => s === 200);

    // 18. GET /api/v1/transactions/intents/{id}/authorization/status
    await check(18, 'Get Authorization Status', 'GET', `/api/v1/transactions/intents/${pushIntentId}/authorization/status`, authHeaders, null, s => s === 200);

    // 19. POST /api/v1/transactions/intents/{id}/authorization/approve
    await check(19, 'Approve Push Authorization', 'POST', `/api/v1/transactions/intents/${pushIntentId}/authorization/approve`, authHeaders, null, s => s === 200);

    // 20. POST /api/v1/transactions/intents/{id}/authorization/deny
    const denyIntentRes = await fetch(`${BASE_URL}/api/v1/transactions/intents`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
            sourceAccountId: '4859220013371001',
            recipient: '4859220013371002',
            amount: 5.00,
            currency: 'USD',
            rail: 'INTERNAL',
            idempotencyKey: 'idem_deny_' + Date.now()
        })
    });
    const denyIntentId = (await denyIntentRes.json()).data?.id;
    await fetch(`${BASE_URL}/api/v1/transactions/intents/${denyIntentId}/authorization/push-request`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ deviceToken: 'fcm_deny_token', devicePlatform: 'ANDROID' })
    });
    await check(20, 'Deny Authorization', 'POST', `/api/v1/transactions/intents/${denyIntentId}/authorization/deny`, authHeaders, null, s => s === 200);

    // 21. POST /api/v1/transactions/intents/{id}/execute
    await check(21, 'Execute Intent', 'POST', `/api/v1/transactions/intents/${mfaIntentId}/execute`, authHeaders, null, s => s === 200);

    // 22. POST /api/v1/statements/generate
    await check(22, 'Generate Account Statement', 'POST', '/api/v1/statements/generate?accountNumber=4859220013371001&startDate=2026-01-01&endDate=2026-12-31', authHeaders, null, s => s === 200 || s === 201);

    // 23. GET /api/v1/statements/account/{accountNumber}
    await check(23, 'Get Account Statements', 'GET', '/api/v1/statements/account/4859220013371001', authHeaders, null, s => s === 200);

    // 24. POST /api/v1/gateway/checkout/sessions
    await check(24, 'Create Checkout Session', 'POST', '/api/v1/gateway/checkout/sessions', {
        ...gatewayHeaders,
        'Idempotency-Key': 'idem_cs_' + Date.now()
    }, {
        reference: 'ORDER-EXHAUSTIVE-' + Date.now(),
        currency: 'PHP',
        successUrl: 'https://example.com/success',
        cancelUrl: 'https://example.com/cancel',
        lineItems: [{ name: 'Tuition Fee', quantity: 1, unitAmount: 500.00 }]
    }, s => s === 200 || s === 201);

    // 25. POST /api/v1/gateway/payments/intents
    let gwIntentId = null;
    const gwIntentRes = await fetch(`${BASE_URL}/api/v1/gateway/payments/intents`, {
        method: 'POST',
        headers: {
            ...gatewayHeaders,
            'Idempotency-Key': 'idem_gw_' + Date.now()
        },
        body: JSON.stringify({
            sourceAccountId: '4859220013371001',
            merchantReference: 'ORDER-GW-' + Date.now(),
            amount: 150.00,
            currency: 'PHP',
            description: 'Gateway Intent Full Verification'
        })
    });
    const gwIntentJson = await gwIntentRes.json();
    gwIntentId = gwIntentJson.data?.paymentIntentId;
    results.push({
        num: 25,
        name: 'Create Gateway Payment Intent',
        endpoint: 'POST /api/v1/gateway/payments/intents',
        status: gwIntentRes.status,
        passed: gwIntentRes.status === 200 && !!gwIntentId,
        details: gwIntentId || 'Created'
    });

    // 26. GET /api/v1/gateway/payments/{intentId}
    await check(26, 'Get Payment Intent (Merchant Gateway)', 'GET', `/api/v1/gateway/payments/${gwIntentId}`, gatewayHeaders, null, s => s === 200);

    // 27. GET /api/v1/gateway/payments/intents/{intentId}
    await check(27, 'Get Payment Intent (Payment Gateway)', 'GET', `/api/v1/gateway/payments/intents/${gwIntentId}`, gatewayHeaders, null, s => s === 200);

    // 28. POST /api/v1/gateway/payment-intents/{intentId}/qr
    let qrRef = null;
    const qrRes = await fetch(`${BASE_URL}/api/v1/gateway/payment-intents/${gwIntentId}/qr`, {
        method: 'POST',
        headers: gatewayHeaders
    });
    const qrJson = await qrRes.json();
    qrRef = qrJson.qrReference;
    results.push({
        num: 28,
        name: 'Generate Dynamic QR',
        endpoint: `POST /api/v1/gateway/payment-intents/{intentId}/qr`,
        status: qrRes.status,
        passed: qrRes.status === 200 && !!qrRef,
        details: qrRef || 'QR Generated'
    });

    // 29. POST /api/v1/gateway/payment-intents/qr/{qrReference}/scan
    await check(29, 'Scan Dynamic QR', 'POST', `/api/v1/gateway/payment-intents/qr/${qrRef}/scan`, gatewayHeaders, null, s => s === 200);

    // 30. POST /api/v1/gateway/payments/{intentId}/refund
    await check(30, 'Refund Payment Intent', 'POST', `/api/v1/gateway/payments/${gwIntentId}/refund`, {
        ...gatewayHeaders,
        'Idempotency-Key': 'idem_ref_' + Date.now()
    }, {
        amount: 50.00,
        reason: 'Customer return'
    }, s => s === 200 || s === 201);

    console.log('========================================================================================================');
    console.log('📋 COMPLETE OPENAPI ENDPOINT AUDIT & VERIFICATION MATRIX');
    console.log('========================================================================================================');
    console.log('| No | Endpoint | HTTP Status | Status | Details |');
    console.log('|----|----------|-------------|--------|---------|');
    let allPassed = true;
    for (const r of results) {
        const icon = r.passed ? '✅ PASSED' : '❌ FAILED';
        if (!r.passed) allPassed = false;
        console.log(`| ${String(r.num).padEnd(2)} | ${r.endpoint.padEnd(52)} | ${String(r.status).padEnd(11)} | ${icon} | ${r.details.padEnd(25)} |`);
    }
    console.log('========================================================================================================\n');
    console.log(`OVERALL RESULT: ${results.filter(r => r.passed).length}/${results.length} endpoints passed.`);
    if (!allPassed) process.exit(1);
}

run().catch(e => {
    console.error('Fatal test error:', e);
    process.exit(1);
});
