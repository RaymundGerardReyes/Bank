const newman = require('newman');
const path = require('path');
const fs = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const BFF_URL = process.env.BFF_URL || 'http://localhost:3000';
const BFF_KEY = process.env.INTERNAL_BFF_API_KEY || 'WQhQECsf4nIhiZ3H+CQRIaOIOnxbgBmbA9sRHpaKlaM=';
const USER_EMAIL = process.env.USER_EMAIL || 'user@example.com';
const USER_PASSWORD = process.env.USER_PASSWORD || 'Password123!';
const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY || 'sk_test_2026_university_erp_sandbox_key';
const LIVE_API_KEY = process.env.LIVE_API_KEY || 'sk_live_2026_university_erp_production_key';
const WEBHOOK_SECRET = process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET || 'whsec_test_secret_123456789';

const defaultEnv = [
    { key: 'baseUrl', value: BASE_URL },
    { key: 'bffUrl', value: BFF_URL },
    { key: 'bffKey', value: BFF_KEY },
    { key: 'internalBffKey', value: BFF_KEY },
    { key: 'userEmail', value: USER_EMAIL },
    { key: 'userPassword', value: USER_PASSWORD },
    { key: 'gatewayApiKey', value: GATEWAY_API_KEY },
    { key: 'liveApiKey', value: LIVE_API_KEY },
    { key: 'sourceAccountId', value: '4859220013371001' },
    { key: 'sourceAccountNumber', value: '4859220013371001' },
    { key: 'destinationAccountNumber', value: '4859220013371002' },
    { key: 'phpSourceAccount', value: '4859220013372001' },
    { key: 'phpDestAccount', value: '4859220013372002' },
    { key: 'usdSourceAccount', value: '4859220013371001' },
    { key: 'webhookSecret', value: WEBHOOK_SECRET }
];

const suites = [
    { name: '01. Gateway Payment Intents Collection', file: 'gateway-payment-intent-postman-collection.json' },
    { name: '02. Account Management Suite', file: 'account-management-tests.json' },
    { name: '03. Internal Transfer Suite', file: 'internal-transfer-tests.json' },
    { name: '04. External Payment Gateway Suite', file: 'external-payment-tests.json' },
    { name: '05. Transaction Controller Suite', file: 'transaction-controller-tests.json' },
    { name: '06. Intents & Statements Suite', file: 'intents-and-statements-tests.json' },
    { name: '07. VAM Internal Transfer Suite', file: 'vam-transfer-tests.json' },
    { name: '08. FX Suite', file: '04-fx-tests.json' }
];

function runCollection(suite) {
    const collectionPath = path.join(__dirname, suite.file);
    return new Promise((resolve) => {
        console.log(`\n====================================================`);
        console.log(`🚀 Running Suite: ${suite.name} (${suite.file})`);
        console.log(`====================================================`);

        newman.run({
            collection: require(collectionPath),
            environment: {
                values: JSON.parse(JSON.stringify(defaultEnv))
            },
            reporters: ['cli']
        }, (err, summary) => {
            if (err) {
                console.error(`❌ Suite [${suite.name}] encountered fatal error:`, err);
                return resolve({ suite: suite.name, passed: false, error: err.message, failures: 1 });
            }
            const failures = summary.run.failures ? summary.run.failures.length : 0;
            const total = summary.run.stats.assertions.total;
            const failed = summary.run.stats.assertions.failed;
            console.log(`📊 Summary for [${suite.name}]: ${total - failed}/${total} assertions passed. (${failures} request failures)`);
            if (failures > 0 || failed > 0) {
                if (summary.run.failures) {
                    summary.run.failures.forEach(f => {
                        console.error(`   Fail: [${f.source ? f.source.name : 'Unknown'}] - ${f.error ? f.error.message : 'Failed'}`);
                    });
                }
                return resolve({ suite: suite.name, passed: false, failures: failures + failed, total });
            }
            resolve({ suite: suite.name, passed: true, failures: 0, total });
        });
    });
}

async function main() {
    console.log('====================================================');
    console.log('🌟 NOVA BANK COMPREHENSIVE END-TO-END TEST SUITE RUNNER');
    console.log(`Target: ${BASE_URL}`);
    console.log('====================================================');

    const results = [];
    for (const suite of suites) {
        const res = await runCollection(suite);
        results.push(res);
    }

    console.log('\n\n====================================================');
    console.log('🏆 FINAL TEST RESULTS SUMMARY');
    console.log('====================================================');
    let allPassed = true;
    for (const r of results) {
        const icon = r.passed ? '✅' : '❌';
        console.log(`${icon} ${r.suite}: ${r.passed ? 'PASSED' : 'FAILED (' + r.failures + ' failures)'}`);
        if (!r.passed) allPassed = false;
    }
    console.log('====================================================\n');

    process.exit(allPassed ? 0 : 1);
}

main().catch(err => {
    console.error('Fatal execution error:', err);
    process.exit(1);
});

