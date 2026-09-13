/**
 * Standalone Zero-Dependency Postman Suite Runner for NovaBank
 * Executes all test collections in tests/ using Node.js 18+ native fetch
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const BFF_URL = process.env.BFF_URL || 'http://localhost:3000';
const BFF_KEY = process.env.INTERNAL_BFF_API_KEY || 'WQhQECsf4nIhiZ3H+CQRIaOIOnxbgBmbA9sRHpaKlaM=';
const USER_EMAIL = process.env.USER_EMAIL || 'user@example.com';
const USER_PASSWORD = process.env.USER_PASSWORD || 'Password123!';
const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY || 'sk_test_2026_university_erp_sandbox_key';
const LIVE_API_KEY = process.env.LIVE_API_KEY || 'sk_live_2026_university_erp_production_key';
const WEBHOOK_SECRET = process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET || 'whsec_test_secret_123456789';

function createExpect(actual) {
    let isNot = false;
    const assertion = {
        get to() { return this; },
        get be() { return this; },
        get have() { return this; },
        get is() { return this; },
        get that() { return this; },
        get not() { isNot = !isNot; return this; },
        get empty() {
            const isEmpty = actual == null || actual.length === 0 || Object.keys(actual).length === 0;
            if (isNot ? isEmpty : !isEmpty) {
                throw new Error(`Expected ${JSON.stringify(actual)} ${isNot ? 'not ' : ''}to be empty`);
            }
            return this;
        },
        status(expected) {
            const passed = actual === expected;
            if (isNot ? passed : !passed) {
                throw new Error(`Expected status ${expected}, got ${actual}`);
            }
            return this;
        },
        eql(expected) {
            const passed = JSON.stringify(actual) === JSON.stringify(expected);
            if (isNot ? passed : !passed) {
                throw new Error(`Expected ${JSON.stringify(actual)} ${isNot ? 'not ' : ''}to equal ${JSON.stringify(expected)}`);
            }
            return this;
        },
        equal(expected) { return this.eql(expected); },
        a(expectedType) {
            let actualType = typeof actual;
            if (Array.isArray(actual)) actualType = 'array';
            else if (actual === null) actualType = 'null';
            const passed = actualType === expectedType;
            if (isNot ? passed : !passed) {
                throw new Error(`Expected type ${expectedType}, got ${actualType}`);
            }
            return this;
        },
        an(expectedType) { return this.a(expectedType); },
        oneOf(list) {
            const passed = list.includes(actual);
            if (isNot ? passed : !passed) {
                throw new Error(`Expected ${actual} to be one of ${JSON.stringify(list)}`);
            }
            return this;
        },
        include(sub) {
            const str = String(actual);
            const passed = str.includes(sub);
            if (isNot ? passed : !passed) {
                throw new Error(`Expected '${str}' ${isNot ? 'not ' : ''}to include '${sub}'`);
            }
            return this;
        },
        above(n) {
            if (actual <= n) throw new Error(`Expected ${actual} to be above ${n}`);
            return this;
        },
        below(n) {
            if (actual >= n) throw new Error(`Expected ${actual} to be below ${n}`);
            return this;
        }
    };
    return assertion;
}

function replaceVars(str, env) {
    if (!str || typeof str !== 'string') return str;
    return str.replace(/\{\{([^{}]+)\}\}/g, (_, key) => {
        const trimmed = key.trim();
        if (trimmed === '$timestamp') return String(Date.now());
        if (trimmed === '$randomInt') return String(Math.floor(Math.random() * 10000));
        if (trimmed === '$guid' || trimmed === '$randomUUID') return crypto.randomUUID();
        if (env[trimmed] !== undefined) return String(env[trimmed]);
        return `{{${trimmed}}}`;
    });
}

function createPmContext(env, responseObj, jsonBody, rawText, testCollector) {
    const pm = {
        environment: {
            get: (k) => env[k],
            set: (k, v) => { env[k] = v; }
        },
        variables: {
            get: (k) => env[k],
            set: (k, v) => { env[k] = v; }
        },
        expect: createExpect,
        test: (name, fn) => {
            try {
                fn();
                testCollector.push({ name, passed: true });
            } catch (err) {
                testCollector.push({ name, passed: false, error: err.message });
            }
        },
        response: responseObj ? {
            code: responseObj.status,
            status: responseObj.status,
            to: {
                have: {
                    status: (code) => {
                        if (responseObj.status !== code) {
                            throw new Error(`Expected status ${code} but got ${responseObj.status}`);
                        }
                    }
                }
            },
            json: () => jsonBody,
            text: () => rawText
        } : null
    };
    return pm;
}

async function executeRequestItem(item, env) {
    const req = item.request;
    if (!req) return { name: item.name, skipped: true };

    const testResults = [];

    // 1. Run Pre-request scripts
    if (item.event) {
        for (const evt of item.event) {
            if (evt.listen === 'prerequest' && evt.script && evt.script.exec) {
                const scriptCode = Array.isArray(evt.script.exec) ? evt.script.exec.join('\n') : evt.script.exec;
                const pm = createPmContext(env, null, null, null, testResults);
                try {
                    const fn = new Function('pm', 'console', scriptCode);
                    fn(pm, console);
                } catch (e) {
                    console.warn(`[PREREQUEST WARNING] [${item.name}]: ${e.message}`);
                }
            }
        }
    }

    // 2. Prepare URL, Headers, and Body
    let rawUrl = (req.url && req.url.raw) ? req.url.raw : (typeof req.url === 'string' ? req.url : '');
    rawUrl = replaceVars(rawUrl, env);

    const headers = {};
    if (req.header) {
        for (const h of req.header) {
            if (h.key && h.value) {
                headers[h.key] = replaceVars(h.value, env);
            }
        }
    }

    let body = undefined;
    if (req.body && req.body.raw && req.method !== 'GET' && req.method !== 'HEAD') {
        body = replaceVars(req.body.raw, env);
    }

    // 3. Dispatch HTTP Request
    let response;
    let rawText = '';
    let jsonBody = null;
    if (rawUrl.includes('/transfers') && (!headers['Authorization'] || !headers['Authorization'].startsWith('Bearer ey'))) {
        console.log('[DEBUG AUTH]', item.name, 'Auth:', headers['Authorization'], 'env.sessionToken:', env.sessionToken ? env.sessionToken.slice(0, 15) : 'MISSING');
    }
    try {
        response = await fetch(rawUrl, {
            method: req.method || 'GET',
            headers,
            body
        });
        rawText = await response.text();
        try {
            jsonBody = JSON.parse(rawText);
        } catch {
            jsonBody = null;
        }
    } catch (netErr) {
        return {
            name: item.name,
            passed: false,
            error: `Network error connecting to ${rawUrl}: ${netErr.message}`,
            tests: [{ name: 'Network Connectivity', passed: false, error: netErr.message }]
        };
    }

    // 4. Run Test scripts
    if (item.event) {
        for (const evt of item.event) {
            if (evt.listen === 'test' && evt.script && evt.script.exec) {
                const scriptCode = Array.isArray(evt.script.exec) ? evt.script.exec.join('\n') : evt.script.exec;
                const pm = createPmContext(env, response, jsonBody, rawText, testResults);
                try {
                    const fn = new Function('pm', 'console', scriptCode);
                    fn(pm, console);
                } catch (e) {
                    testResults.push({ name: 'Test Script Evaluation', passed: false, error: e.message });
                }
            }
        }
    }

    const allPassed = testResults.every(t => t.passed);
    return {
        name: item.name,
        method: req.method,
        url: rawUrl,
        statusCode: response.status,
        passed: allPassed,
        tests: testResults
    };
}

async function runCollectionFile(filePath, initialEnv) {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const collectionName = (content.info && content.info.name) ? content.info.name : path.basename(filePath);
    console.log(`\n====================================================`);
    console.log(`🚀 Collection: ${collectionName} (${path.basename(filePath)})`);
    console.log(`====================================================`);

    const env = Object.assign({}, initialEnv);

    // Flatten items (handles folders)
    function collectItems(itemList) {
        let res = [];
        for (const it of itemList) {
            if (it.item && Array.isArray(it.item)) {
                res = res.concat(collectItems(it.item));
            } else {
                res.push(it);
            }
        }
        return res;
    }

    const items = collectItems(content.item || []);
    let passedCount = 0;
    let failedCount = 0;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const res = await executeRequestItem(item, env);
        if (res.skipped) continue;

        if (res.passed) {
            console.log(`  ✅ [${i + 1}/${items.length}] ${res.name} (HTTP ${res.statusCode})`);
            passedCount++;
        } else {
            console.log(`  ❌ [${i + 1}/${items.length}] ${res.name} (HTTP ${res.statusCode})`);
            if (res.tests) {
                res.tests.forEach(t => {
                    if (!t.passed) console.log(`      ↳ Failure: ${t.name} -> ${t.error}`);
                });
            }
            if (res.error) console.log(`      ↳ Error: ${res.error}`);
            failedCount++;
        }
    }

    console.log(`\n  Summary: ${passedCount} passed, ${failedCount} failed of ${items.length} requests.`);
    Object.assign(initialEnv, env);
    return { name: collectionName, file: path.basename(filePath), total: items.length, passed: passedCount, failed: failedCount };
}

async function main() {
    console.log('====================================================');
    console.log('🌟 NOVA BANK ZERO-DEPENDENCY SUITE RUNNER');
    console.log(`Target: ${BASE_URL}`);
    console.log('====================================================');

    const defaultEnv = {
        baseUrl: BASE_URL,
        bffUrl: BFF_URL,
        bffKey: BFF_KEY,
        internalBffKey: BFF_KEY,
        userEmail: USER_EMAIL,
        userPassword: USER_PASSWORD,
        gatewayApiKey: GATEWAY_API_KEY,
        liveApiKey: LIVE_API_KEY,
        sourceAccountId: '4859220013371001',
        sourceAccountNumber: '4859220013371001',
        destinationAccountNumber: '4859220013371002',
        phpSourceAccount: '4859220013372001',
        phpDestAccount: '4859220013372002',
        usdSourceAccount: '4859220013371001',
        webhookSecret: WEBHOOK_SECRET
    };

    let sharedSessionToken = null;
    try {
        const loginRes = await fetch(`${BASE_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: USER_EMAIL, password: USER_PASSWORD })
        });
        const loginData = await loginRes.json();
        const token = loginData.token || (loginData.data && loginData.data.token);
        if (token) {
            defaultEnv.sessionToken = token;
            sharedSessionToken = token;
        }
    } catch (e) {
        // Fallback to in-test login
    }

    const collections = [
        'account-management-tests.json',
        'internal-transfer-tests.json',
        'external-payment-tests.json',
        'transaction-controller-tests.json',
        'intents-and-statements-tests.json',
        'vam-transfer-tests.json',
        'gateway-payment-intent-postman-collection.json',
        '04-fx-tests.json'
    ];

    const results = [];
    for (const col of collections) {
        const fullPath = path.join(__dirname, col);
        if (fs.existsSync(fullPath)) {
            const currentEnv = Object.assign({}, defaultEnv);
            if (sharedSessionToken) currentEnv.sessionToken = sharedSessionToken;
            const r = await runCollectionFile(fullPath, currentEnv);
            if (currentEnv.sessionToken) sharedSessionToken = currentEnv.sessionToken;
            results.push(r);
        }
    }

    console.log('\n====================================================');
    console.log('🏆 FINAL TEST MATRIX SUMMARY');
    console.log('====================================================');
    let allPassed = true;
    for (const r of results) {
        const icon = r.failed === 0 ? '✅' : '❌';
        console.log(`${icon} ${r.name}: ${r.passed}/${r.total} passed (${r.failed} failed)`);
        if (r.failed > 0) allPassed = false;
    }
    console.log('====================================================\n');

    process.exit(allPassed ? 0 : 1);
}

main().catch(err => {
    console.error('Fatal execution error:', err);
    process.exit(1);
});

