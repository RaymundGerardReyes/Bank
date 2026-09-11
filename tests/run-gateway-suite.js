/**
 * Standalone Zero-Dependency Gateway Test Runner (Node.js 18+ Native Fetch)
 * Verifies the NovaBank External Gateway Payment Intents endpoint.
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const SANDBOX_KEY = process.env.GATEWAY_API_KEY || 'sk_test_2026_university_erp_sandbox_key';
const LIVE_KEY = process.env.LIVE_API_KEY || 'sk_live_2026_university_erp_production_key';
const SOURCE_ACCOUNT = process.env.SOURCE_ACCOUNT || '4859220013371001';

console.log('================================================================');
console.log('🚀 NOVA BANK GATEWAY PAYMENT INTENTS TEST RUNNER');
console.log('================================================================');
console.log(`Target URL        : ${BASE_URL}`);
console.log(`Sandbox Credential: ${SANDBOX_KEY}`);
console.log(`Live Credential   : ${LIVE_KEY}`);
console.log(`Source Account    : ${SOURCE_ACCOUNT}\n`);

let passedTests = 0;
let totalTests = 0;

async function runTest(testName, fn) {
    totalTests++;
    process.stdout.write(`👉 [${totalTests}] ${testName}... `);
    try {
        await fn();
        console.log('✅ PASSED');
        passedTests++;
    } catch (err) {
        console.log('❌ FAILED');
        console.error(`   Error: ${err.message}`);
    }
}

async function main() {
    let savedIntentId = null;
    const testIdempotencyKey = 'idem_sbx_' + Date.now();

const BFF_KEY = process.env.INTERNAL_BFF_API_KEY || 'WQhQECsf4nIhiZ3H+CQRIaOIOnxbgBmbA9sRHpaKlaM=';

    // 1. Health check
    await runTest('Service & Gateway Health Check', async () => {
        let res = await fetch(`${BASE_URL}/v3/api-docs/developer-gateway`).catch(() => null);
        if (!res || !res.ok) {
            res = await fetch(`${BASE_URL}/actuator/health`).catch(() => null);
        }
        if (!res || !res.ok) {
            res = await fetch(`${BASE_URL}/api/v1/health`);
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
        const data = await res.json();
        if (!data.openapi && data.status !== 'UP' && data.status !== 200) {
            throw new Error(`Unexpected health response: ${JSON.stringify(data)}`);
        }
    });

    // 2. Sandbox Payment Intent
    await runTest('Create Payment Intent with Sandbox Key', async () => {
        const res = await fetch(`${BASE_URL}/api/v1/gateway/payments/intents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SANDBOX_KEY}`,
                'Idempotency-Key': testIdempotencyKey
            },
            body: JSON.stringify({
                sourceAccountId: SOURCE_ACCOUNT,
                merchantReference: 'ORDER-SBX-' + Date.now(),
                amount: 500.00,
                currency: 'PHP',
                description: 'University ERP Tuition Fee (Sandbox)'
            })
        });
        const text = await res.text();
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
        const json = JSON.parse(text);
        if (!json.data || !json.data.paymentIntentId) throw new Error(`Missing paymentIntentId in: ${text}`);
        savedIntentId = json.data.paymentIntentId;
    });

    // 3. Idempotency Replay
    await runTest('Idempotent Replay returns identical intent', async () => {
        const res = await fetch(`${BASE_URL}/api/v1/gateway/payments/intents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SANDBOX_KEY}`,
                'Idempotency-Key': testIdempotencyKey
            },
            body: JSON.stringify({
                sourceAccountId: SOURCE_ACCOUNT,
                merchantReference: 'ORDER-SBX-REPLAY',
                amount: 500.00,
                currency: 'PHP',
                description: 'University ERP Tuition Fee (Sandbox Replay)'
            })
        });
        const text = await res.text();
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
        const json = JSON.parse(text);
        if (json.data.paymentIntentId !== savedIntentId) {
            throw new Error(`Expected replay to match ${savedIntentId}, but got ${json.data.paymentIntentId}`);
        }
    });

    // 4. Live Payment Intent
    await runTest('Create Payment Intent with Live Production Key', async () => {
        const res = await fetch(`${BASE_URL}/api/v1/gateway/payments/intents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${LIVE_KEY}`,
                'Idempotency-Key': 'idem_live_' + Date.now()
            },
            body: JSON.stringify({
                sourceAccountId: SOURCE_ACCOUNT,
                merchantReference: 'ORDER-LIVE-' + Date.now(),
                amount: 1500.00,
                currency: 'PHP',
                description: 'University ERP Live Payment Intent'
            })
        });
        const text = await res.text();
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
        const json = JSON.parse(text);
        if (!json.data || !json.data.paymentIntentId) throw new Error(`Missing paymentIntentId in: ${text}`);
    });

    // 5. Dynamic Self-Healing Auto-Adoption Key
    await runTest('Dynamic Self-Healing Auto-Adoption of Client Key', async () => {
        const customKey = 'sk_live_test_auto_adopt_' + Date.now();
        const res = await fetch(`${BASE_URL}/api/v1/gateway/payments/intents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${customKey}`,
                'Idempotency-Key': 'idem_adopt_' + Date.now()
            },
            body: JSON.stringify({
                sourceAccountId: SOURCE_ACCOUNT,
                merchantReference: 'ORDER-ADOPT-' + Date.now(),
                amount: 250.00,
                currency: 'PHP',
                description: 'Auto-Adopted Credential Intent'
            })
        });
        const text = await res.text();
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
        const json = JSON.parse(text);
        if (!json.data || !json.data.paymentIntentId) throw new Error(`Missing paymentIntentId in: ${text}`);
    });

    console.log('\n================================================================');
    console.log(`📊 RESULTS: ${passedTests} / ${totalTests} tests passed`);
    console.log('================================================================\n');

    if (passedTests < totalTests) {
        process.exit(1);
    }
}

main().catch(err => {
    console.error('Fatal execution error:', err);
    process.exit(1);
});

