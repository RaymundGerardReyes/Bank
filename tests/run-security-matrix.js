const newman = require('newman');
const path = require('path');
const fs = require('fs');

// Configuration
const COLLECTION_PATH = path.join(__dirname, 'security-matrix.json');
const REPORT_DIR = path.join(__dirname, 'reports');
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const BFF_KEY = process.env.INTERNAL_BFF_API_KEY || 'secret-bff-key';
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'test-jwt-token';
const WEBHOOK_SECRET = process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET || 'whsec_test_secret_123456789';

// Ensure the reports directory exists for our audit files
if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
}

/**
 * Helper to run a Newman collection or specific folder as a Promise
 * Now includes automated HTML report generation via 'htmlextra'
 */
function executeNewman(folderName, extraEnvVars = [], isParallel = false) {
    // 1. Create a safe, unique filename for each report
    const safeName = (folderName || 'All_Tests').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Add a random suffix for parallel runs to guarantee no file overwrites
    const reportSuffix = isParallel ? `_${timestamp}_parallel_${Math.floor(Math.random() * 1000)}` : `_${timestamp}`;
    const reportFile = path.join(REPORT_DIR, `security_audit_${safeName}${reportSuffix}.html`);

    return new Promise((resolve, reject) => {
        newman.run({
            collection: require(COLLECTION_PATH),
            folder: folderName,
            environment: {
                values: [
                    { key: 'baseUrl', value: BASE_URL },
                    { key: 'bffKey', value: BFF_KEY },
                    { key: 'authToken', value: AUTH_TOKEN },
                    { key: 'webhookSecret', value: WEBHOOK_SECRET },
                    ...extraEnvVars
                ]
            },
            // 2. Enable both CLI output and the HTML Extra reporter
            reporters: ['cli', 'htmlextra'],
            reporter: {
                htmlextra: {
                    export: reportFile, // Destination path for the HTML file
                    title: `Security Audit: ${folderName || 'Full Matrix'}`,
                    browserTitle: "NovaBank Security Audit",
                    showEnvironmentData: true,
                    timezone: "Asia/Manila", // Set to your local time for accurate audit logs
                    hideRequestBody: ["password", "token"], // Mask sensitive data in reports
                }
            }
        }, (err, summary) => {
            if (err || summary.run.failures.length > 0) {
                return reject(err || new Error(`Tests failed in folder: ${folderName || 'All'}`));
            }
            resolve(summary);
        });
    });
}

async function runFullSecurityMatrix() {
    console.log('====================================================');
    console.log('🚀 STARTING PRODUCTION-HARDENING SECURITY TESTS');
    console.log('====================================================\n');

    try {
        // --- PHASE 1: SEQUENTIAL FUNCTIONAL & SECURITY GATES ---
        console.log('📋 [Phase 1/2] Running Sequential Security Gates...\n');
        
        console.log('👉 Gate 1: URL Allowlisting & Redirect Safety');
        await executeNewman('1. URL Allowlisting Gates');

        console.log('👉 Gate 2: Sequential Idempotency & Replay Verification');
        await executeNewman('2. Idempotency & Replay Gates');

        console.log('👉 Gate 3: Webhook Signatures & Boundary Validation');
        await executeNewman('3. Webhook Pipeline Gates');

        console.log('👉 Gate 4: Internal BFF Identity Validation');
        await executeNewman('4. BFF Boundary Gates');

        // --- PHASE 2: SIMULTANEOUS CONCURRENCY & RACE-CONDITION GATES ---
        console.log('\n⚡ [Phase 2/2] Running Simultaneous Race-Condition Gates with Newman...\n');
        
        const sharedRaceKey = 'race-idem-' + Date.now();
        const sharedWebhookEventId = 'evt_race_' + Date.now();

        console.log(`Firing 2 concurrent requests with shared Idempotency-Key: ${sharedRaceKey}`);

        // Launch two Newman instances simultaneously. Notice we pass 'true' for the isParallel flag.
        await Promise.all([
            executeNewman('5. Race Condition Simulation', [
                { key: 'raceIdempotencyKey', value: sharedRaceKey },
                { key: 'raceEventId', value: sharedWebhookEventId }
            ], true),
            executeNewman('5. Race Condition Simulation', [
                { key: 'raceIdempotencyKey', value: sharedRaceKey },
                { key: 'raceEventId', value: sharedWebhookEventId }
            ], true)
        ]);

        console.log('\n====================================================');
        console.log('✅ ALL SECURITY HARDENING GATES PASSED (100% SUCCESS)');
        console.log(`📂 Audit reports saved to: ${REPORT_DIR}`);
        console.log('====================================================');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ SECURITY GATE TEST FAILED:', error.message);
        console.log(`📂 Check the generated reports in ${REPORT_DIR} for details.`);
        process.exit(1);
    }
}

runFullSecurityMatrix();
