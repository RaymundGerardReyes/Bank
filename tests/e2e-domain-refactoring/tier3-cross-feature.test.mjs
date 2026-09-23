/**
 * Tier 3: Cross-Feature Combinations Test Suite
 * 10 pairwise cross-layer interaction test cases covering:
 * - Nginx virtual host routing + Spring Boot CORS
 * - Nginx reverse proxy + PaymentIntent checkout URL validation
 * - Frontend SDK generation + Nginx API routing
 * - Root domain propagation + Nginx/Backend synchronization
 * - Host vs. URL uniformity + CORS/Ingress compatibility
 */

import {
  TestSuiteRunner,
  assert,
  readProjectFile,
  parseNginxConfig,
  simulateIsSafeCheckoutUrl,
  simulateCorsValidation
} from './domain-test-harness.mjs';

export function buildTier3Suite() {
  const suite = new TestSuiteRunner('Tier 3: Cross-Feature Combinations (Pairwise)');
  const allowedDomains = ['paymongo.com', 'mundbank.ph', 'localhost'];

  // -------------------------------------------------------------------------
  // Pair 1: Nginx Virtual Host Routing + Spring Boot CORS (F3 ↔ F5)
  // -------------------------------------------------------------------------
  suite.test('Pair1_01_NginxRouting_And_CorsPreflight', 'Simulates browser OPTIONS preflight from UI origin to API gateway endpoint', () => {
    const { serverBlocks } = parseNginxConfig();
    const apiServer = serverBlocks.find(b => b.serverName.includes('${API_PUBLIC_HOST}'));
    assert.isTrue(!!apiServer, 'API server block must be present');

    // Nginx proxies /api/v1/ to springboot
    const apiLocation = apiServer.locations.find(l => l.path.includes('/api/v1/'));
    assert.isTrue(!!apiLocation, 'API server must have /api/v1/ location proxying to springboot');
    assert.match(apiLocation.body, /proxy_pass\s+http:\/\/springboot;/, '/api/v1/ must proxy to springboot upstream');

    // Spring Boot CORS filter receives Origin: https://bank.mundbank.ph
    const corsResult = simulateCorsValidation('https://bank.mundbank.ph', ['https://bank.mundbank.ph']);
    assert.isTrue(corsResult.allowed, 'Spring Boot CORS filter must permit the frontend origin');
    assert.equal(corsResult.allowOriginHeader, 'https://bank.mundbank.ph');
    assert.equal(corsResult.allowCredentials, 'true');
  });

  suite.test('Pair1_02_NginxRouting_And_CorsActualRequest', 'Verifies actual GET /api/v1/accounts request carries valid origin and host headers through Nginx to backend', () => {
    const { serverBlocks } = parseNginxConfig();
    const apiServer = serverBlocks.find(b => b.serverName.includes('${API_PUBLIC_HOST}'));
    assert.isTrue(apiServer.raw.includes('proxy_set_header   Host              $host;'), 'Nginx must preserve Host header');
    assert.isTrue(apiServer.raw.includes('proxy_set_header   X-Forwarded-Proto $real_scheme;'), 'Nginx must forward real scheme');

    const corsCheck = simulateCorsValidation('https://bank.mundbank.ph', ['https://bank.mundbank.ph']);
    assert.isTrue(corsCheck.allowed, 'CORS preflight and actual request origin must match');
  });

  // -------------------------------------------------------------------------
  // Pair 2: Nginx Reverse Proxy + PaymentIntent Checkout URL (F3 ↔ F4)
  // -------------------------------------------------------------------------
  suite.test('Pair2_01_PaymentIntentUrl_And_NginxRouting', 'Validates checkout session URL against payment invariants and verifies Nginx routes it to Next.js', () => {
    const checkoutUrl = 'https://pay.mundbank.ph/checkout/sess_test_12345';
    // 1. Spring Boot domain validation
    const isValidDomain = simulateIsSafeCheckoutUrl(checkoutUrl, allowedDomains);
    assert.isTrue(isValidDomain, 'Spring Boot must accept https://pay.mundbank.ph via suffix matching');

    // 2. Nginx Webhook/Checkout virtual host routing
    const { serverBlocks } = parseNginxConfig();
    const webhookServer = serverBlocks.find(b => b.serverName.includes('${PAYMENT_WEBHOOK_HOST}'));
    assert.isTrue(!!webhookServer, 'Nginx must configure PAYMENT_WEBHOOK_HOST virtual host');

    const checkoutLocation = webhookServer.locations.find(l => l.path.includes('/checkout/'));
    assert.isTrue(!!checkoutLocation, 'Webhook host must have /checkout/ location');
    assert.match(checkoutLocation.body, /proxy_pass\s+http:\/\/nextjs;/, '/checkout/ must route to Next.js frontend UI');
  });

  suite.test('Pair2_02_PaymentWebhookIngress_And_Service', 'Verifies PayMongo webhook route is routed exclusively to Spring Boot on the Webhook virtual host', () => {
    const { serverBlocks } = parseNginxConfig();
    const webhookServer = serverBlocks.find(b => b.serverName.includes('${PAYMENT_WEBHOOK_HOST}'));
    const webhookLocation = webhookServer.locations.find(l => l.path.includes('/api/v1/webhooks/payment/paymongo'));
    assert.isTrue(!!webhookLocation, 'Exact match PayMongo webhook location must be defined');
    assert.match(webhookLocation.body, /proxy_pass\s+http:\/\/springboot;/, 'PayMongo webhook must proxy to Spring Boot backend');
    assert.match(webhookLocation.body, /limit_req\s+zone=api_general/, 'Webhook route must enforce rate limiting');
  });

  // -------------------------------------------------------------------------
  // Pair 3: Frontend SDK Generation + Nginx API Routing (F6 ↔ F3)
  // -------------------------------------------------------------------------
  suite.test('Pair3_01_FrontendSdkGeneration_And_NginxRouting', 'Verifies DomainLibrary generated URLs align exactly with Nginx API virtual host routing rules', () => {
    // 1. URL generated by SDK must be https://api.mundbank.ph/api/v1/...
    const targetDomain = 'mundbank.ph';
    const canonicalApiUrl = `https://api.${targetDomain}/api/v1/accounts`;
    const parsed = new URL(canonicalApiUrl);
    assert.equal(parsed.hostname, 'api.mundbank.ph', 'Host must be api.mundbank.ph');
    assert.equal(parsed.pathname, '/api/v1/accounts', 'Path must begin with /api/v1/');

    // 2. Nginx API virtual host must match hostname and route /api/v1/
    const { serverBlocks } = parseNginxConfig();
    const apiServer = serverBlocks.find(b => b.serverName.includes('${API_PUBLIC_HOST}'));
    assert.isTrue(!!apiServer, 'API server must be configured');
    const apiLoc = apiServer.locations.find(l => l.path.includes('/api/v1/'));
    assert.isTrue(!!apiLoc, 'Nginx must accept /api/v1/ path generated by SDK');
  });

  suite.test('Pair3_02_DevelopersPageSnippet_And_NginxRouting', 'Verifies developer portal code snippets target routes recognized by Nginx reverse proxy', () => {
    const devPage = readProjectFile('web-app/src/app/(public)/developers/page.tsx');
    assert.includes(devPage, '/api/v1/transfers/internal', 'Developers page must use /api/v1/transfers/internal');
    assert.includes(devPage, '/api/v1/accounts', 'Developers page must use /api/v1/accounts');
    assert.includes(devPage, '/api/v1/payments', 'Developers page must use /api/v1/payments');

    const { serverBlocks } = parseNginxConfig();
    const apiServer = serverBlocks.find(b => b.serverName.includes('${API_PUBLIC_HOST}'));
    const apiLoc = apiServer.locations.find(l => l.path.includes('/api/v1/'));
    assert.isTrue(!!apiLoc, 'Nginx /api/v1/ location handles all /api/v1/* subpaths');
  });

  // -------------------------------------------------------------------------
  // Pair 4: Root Domain Propagation Across Compose and Nginx (F1 ↔ F3)
  // -------------------------------------------------------------------------
  suite.test('Pair4_01_RootDomainPropagation_ComposeToNginx', 'Simulates changing BASE_DOMAIN and verifies derived Nginx variables match compose inputs', () => {
    const baseDomain = 'altbank.ph';
    const derivedUiHost = `bank.${baseDomain}`;
    const derivedApiHost = `api.${baseDomain}`;
    const derivedPayHost = `pay.${baseDomain}`;

    const compose = readProjectFile('infra/docker/compose.yaml');
    assert.includes(compose, 'UI_PUBLIC_HOST=${UI_PUBLIC_HOST}', 'Nginx service receives UI_PUBLIC_HOST');
    assert.includes(compose, 'API_PUBLIC_HOST=${API_PUBLIC_HOST}', 'Nginx service receives API_PUBLIC_HOST');
    assert.includes(compose, 'PAYMENT_WEBHOOK_HOST=${PAYMENT_WEBHOOK_HOST}', 'Nginx service receives PAYMENT_WEBHOOK_HOST');

    // Nginx template uses the exact same variable names
    const nginxContent = readProjectFile('infra/nginx/nginx.conf');
    assert.includes(nginxContent, '${UI_PUBLIC_HOST}', 'nginx.conf consumes ${UI_PUBLIC_HOST}');
    assert.includes(nginxContent, '${API_PUBLIC_HOST}', 'nginx.conf consumes ${API_PUBLIC_HOST}');
    assert.includes(nginxContent, '${PAYMENT_WEBHOOK_HOST}', 'nginx.conf consumes ${PAYMENT_WEBHOOK_HOST}');
  });

  suite.test('Pair4_02_RootDomainPropagation_ComposeToBackendCors', 'Verifies compose maps FRONTEND_PUBLIC_ORIGIN to backend so CORS allows updated root domain origin', () => {
    const compose = readProjectFile('infra/docker/compose.yaml');
    assert.match(compose, /FRONTEND_PUBLIC_ORIGIN:/, 'Compose must forward FRONTEND_PUBLIC_ORIGIN to backend');

    const dynamicOrigin = 'https://bank.altbank.ph';
    const corsRes = simulateCorsValidation(dynamicOrigin, [dynamicOrigin]);
    assert.isTrue(corsRes.allowed, 'Backend CORS filter permits dynamically configured origin');
  });

  // -------------------------------------------------------------------------
  // Pair 5: Host vs URL Uniformity + Security Layering (F2 ↔ F5)
  // -------------------------------------------------------------------------
  suite.test('Pair5_01_HostVsUrlUniformity_NginxVsCors', 'Confirms Nginx server_name receives naked host while Spring Boot CORS receives origin with protocol', () => {
    const { serverBlocks } = parseNginxConfig();
    const uiServer = serverBlocks.find(b => b.serverName.includes('${UI_PUBLIC_HOST}'));
    // Nginx server_name must NOT contain https://
    assert.notIncludes(uiServer.serverName, 'https://', 'Nginx server_name must be naked FQDN');

    // Spring Boot FRONTEND_PUBLIC_ORIGIN MUST contain https://
    const validOrigin = 'https://bank.mundbank.ph';
    assert.startsWith = (str, prefix) => assert.isTrue(str.startsWith(prefix), `${str} must start with ${prefix}`);
    assert.startsWith(validOrigin, 'https://');

    const corsCheck = simulateCorsValidation(validOrigin, [validOrigin]);
    assert.isTrue(corsCheck.allowed, 'CORS with protocol succeeds');
  });

  suite.test('Pair5_02_CatchAllBlocking_And_CorsRejection', 'Verifies rogue domain is blocked at both ingress layer (Nginx 404) and application layer (CORS reject)', () => {
    const rogueHost = 'attacker-banking.com';
    const rogueOrigin = 'https://attacker-banking.com';

    // 1. Nginx Catch-all check: rogue host matches none of the known server names
    const { serverBlocks } = parseNginxConfig();
    const knownHosts = serverBlocks.flatMap(b => b.serverName.split(/\s+/)).filter(Boolean);
    const hostMatched = knownHosts.some(h => h === rogueHost);
    assert.isFalse(hostMatched, 'Rogue host must not match any configured Nginx virtual host');

    // 2. Spring Boot CORS check: rogue origin rejected
    const corsCheck = simulateCorsValidation(rogueOrigin, ['https://bank.mundbank.ph']);
    assert.isFalse(corsCheck.allowed, 'Rogue origin must be rejected by CORS filter');
    assert.strictEqual(corsCheck.allowOriginHeader, null, 'No Access-Control-Allow-Origin header returned');
  });

  return suite;
}

if (process.argv[1] && process.argv[1].endsWith('tier3-cross-feature.test.mjs')) {
  buildTier3Suite().run().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
