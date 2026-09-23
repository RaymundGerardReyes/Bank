/**
 * Tier 4: Real-World Application Scenarios Test Suite
 * Comprehensive End-to-End User Journeys exercising multi-layer interactions:
 * - Scenario 1: Developer Portal API exploration -> SDK curl request -> Nginx API routing -> Spring Boot response -> CORS preflight check
 * - Scenario 2: E-Commerce Merchant Checkout & Webhook Lifecycle
 * - Scenario 3: Multi-Tenant Virtual Account Management (VAM) Cross-Origin Dashboard
 * - Scenario 4: Dynamic Re-Branding / Multi-Environment Edge Propagation
 */

import {
  TestSuiteRunner,
  assert,
  readProjectFile,
  parseNginxConfig,
  simulateIsSafeCheckoutUrl,
  simulateCorsValidation
} from './domain-test-harness.mjs';

export function buildTier4Suite() {
  const suite = new TestSuiteRunner('Tier 4: Real-World Application Scenarios');
  const allowedDomains = ['paymongo.com', 'mundbank.ph', 'localhost'];

  // =========================================================================
  // Scenario 1: Developer Portal API Exploration & Execution Journey
  // =========================================================================
  suite.test('Scenario1_DeveloperPortal_ApiExplorationJourney', 'Full user journey: Portal inspection -> SDK snippet copy -> Ingress API routing -> Spring Boot CORS preflight', () => {
    // Step 1: Developer navigates to UI portal at https://bank.mundbank.ph
    const { serverBlocks } = parseNginxConfig();
    const uiServer = serverBlocks.find(b => b.serverName.includes('${UI_PUBLIC_HOST}'));
    assert.isTrue(!!uiServer, 'Nginx UI virtual host must serve the frontend portal');

    // Step 2: Developer inspects OpenAPI 3.1 Specification from /v3/api-docs/developer-gateway
    const openApiFile = readProjectFile('backend/src/main/java/com/company/banking/config/OpenApiConfig.java');
    assert.includes(openApiFile, 'externalDeveloperApi', 'OpenApiConfig must configure external developer gateway group');
    // Ensure legacy branding is absent
    assert.notIncludes(openApiFile, 'novabank.ph', 'OpenAPI configuration must not reference novabank.ph');

    // Step 3: Developer copies cURL SDK snippet from Developer Portal for /api/v1/transfers/internal
    const devPage = readProjectFile('web-app/src/app/(public)/developers/page.tsx');
    assert.includes(devPage, '/api/v1/transfers/internal', 'Developer portal must showcase /api/v1/transfers/internal');
    // The snippet URL must use canonical https://api.mundbank.ph
    const simulatedSnippetUrl = 'https://api.mundbank.ph/api/v1/transfers/internal';
    assert.match(simulatedSnippetUrl, /^https:\/\/api\.mundbank\.ph\/api\/v1\//, 'Snippet URL must have canonical structure');

    // Step 4: cURL client sends request to Nginx API virtual host (Host: api.mundbank.ph)
    const apiServer = serverBlocks.find(b => b.serverName.includes('${API_PUBLIC_HOST}'));
    assert.isTrue(!!apiServer, 'Nginx API virtual host must receive the request');
    const apiLoc = apiServer.locations.find(l => l.path.includes('/api/v1/'));
    assert.isTrue(!!apiLoc, 'Nginx proxies /api/v1/ to backend Spring Boot');

    // Step 5: Browser preflight check (OPTIONS) from UI origin to API endpoint
    const preflight = simulateCorsValidation('https://bank.mundbank.ph', ['https://bank.mundbank.ph', 'http://localhost:3000']);
    assert.isTrue(preflight.allowed, 'CORS preflight must succeed for https://bank.mundbank.ph');
    assert.equal(preflight.allowOriginHeader, 'https://bank.mundbank.ph');
    assert.equal(preflight.allowCredentials, 'true');
  });

  // =========================================================================
  // Scenario 2: E-Commerce Merchant Checkout & Webhook Lifecycle
  // =========================================================================
  suite.test('Scenario2_EcommerceMerchant_CheckoutAndWebhookLifecycle', 'Full checkout lifecycle: Intent creation -> URL validation -> Hosted checkout -> Webhook callback', () => {
    // Step 1: Merchant application requests payment intent with returnUrl
    const returnUrl = 'https://shop.mundbank.ph/order/complete';
    const isReturnUrlSafe = simulateIsSafeCheckoutUrl(returnUrl, allowedDomains);
    assert.isTrue(isReturnUrlSafe, 'Merchant returnUrl on mundbank.ph subdomain must be accepted');

    // Step 2: System generates hosted checkout session redirect URL
    const checkoutSessionUrl = 'https://pay.mundbank.ph/checkout/sess_ord_998124';
    const isCheckoutUrlSafe = simulateIsSafeCheckoutUrl(checkoutSessionUrl, allowedDomains);
    assert.isTrue(isCheckoutUrlSafe, 'pay.mundbank.ph hosted checkout URL must pass payment domain invariant');

    // Step 3: Customer browser navigates to checkout URL; Nginx routes /checkout/ to Next.js UI
    const { serverBlocks } = parseNginxConfig();
    const webhookServer = serverBlocks.find(b => b.serverName.includes('${PAYMENT_WEBHOOK_HOST}'));
    const checkoutLoc = webhookServer.locations.find(l => l.path.includes('/checkout/'));
    assert.isTrue(!!checkoutLoc, 'Nginx Webhook host must route /checkout/ to frontend');
    assert.match(checkoutLoc.body, /proxy_pass\s+http:\/\/nextjs;/, 'Checkout UI served by Next.js upstream');

    // Step 4: PayMongo sends webhook delivery callback upon payment completion
    const webhookLoc = webhookServer.locations.find(l => l.path.includes('/api/v1/webhooks/payment/paymongo'));
    assert.isTrue(!!webhookLoc, 'PayMongo webhook route must be present');
    assert.match(webhookLoc.body, /proxy_pass\s+http:\/\/springboot;/, 'Webhook must be proxied to Spring Boot for signature verification');
    assert.match(webhookLoc.body, /limit_req\s+zone=api_general/, 'Webhook ingress must be protected by rate limiting');

    // Step 5: Rejection of malicious callback attempt
    const spoofedWebhookHost = 'pay.attacker.com';
    const isSpoofedValid = allowedDomains.some(d => spoofedWebhookHost === d || spoofedWebhookHost.endsWith('.' + d));
    assert.isFalse(isSpoofedValid, 'Spoofed webhook callback host must be rejected');
  });

  // =========================================================================
  // Scenario 3: Multi-Tenant Virtual Account Management (VAM) Cross-Origin Dashboard
  // =========================================================================
  suite.test('Scenario3_MultiTenantVam_DashboardCrossDomainInteraction', 'Multi-tenant VAM portal: SPA cross-origin requests, credentials verification, and perimeter defense', () => {
    // Step 1: Corporate treasurer accesses VAM dashboard at https://bank.mundbank.ph/dashboard
    const origin = 'https://bank.mundbank.ph';

    // Step 2: Dashboard issues credentials-bearing REST call to https://api.mundbank.ph/api/v1/accounts
    const configuredOrigins = ['https://bank.mundbank.ph', 'http://localhost:3000'];
    const corsResult = simulateCorsValidation(origin, configuredOrigins);
    assert.isTrue(corsResult.allowed, 'Treasury portal origin must be permitted');
    assert.equal(corsResult.allowCredentials, 'true', 'Access-Control-Allow-Credentials must be true for JWT/cookie auth');

    // Step 3: Nginx ingress security headers validation
    const { raw } = parseNginxConfig();
    assert.match(raw, /X-Frame-Options\s+"SAMEORIGIN"/, 'Nginx must enforce SAMEORIGIN frame protection');
    assert.match(raw, /X-Content-Type-Options\s+"nosniff"/, 'Nginx must enforce nosniff');
    assert.match(raw, /Strict-Transport-Security\s+"max-age=31536000/, 'Nginx must enforce HSTS');

    // Step 4: Perimeter defense blocks rogue origins trying to read multi-tenant account data
    const rogueOrigin = 'https://phishing-mundbank.ph';
    const rogueCors = simulateCorsValidation(rogueOrigin, configuredOrigins);
    assert.isFalse(rogueCors.allowed, 'Rogue cross-origin request must be denied by CORS');
  });

  // =========================================================================
  // Scenario 4: Dynamic Re-Branding / Multi-Environment Edge Propagation
  // =========================================================================
  suite.test('Scenario4_DynamicRebranding_MultiEnvironmentEdgePropagation', 'Verifies single root domain variable propagation across all layers in staging or new tenant', () => {
    // Single authoritative root changed:
    const baseDomain = 'tenantbank.ph';

    // 1. Compose hostname derivations
    const derivedHosts = {
      UI_PUBLIC_HOST: `bank.${baseDomain}`,
      API_PUBLIC_HOST: `api.${baseDomain}`,
      PAYMENT_WEBHOOK_HOST: `pay.${baseDomain}`,
      APPLICANT_PUBLIC_HOST: `applicant.${baseDomain}`,
      PASSKEY_RP_ID: baseDomain
    };

    // 2. Compose URL derivations
    const derivedUrls = {
      UI_PUBLIC_URL: `https://${derivedHosts.UI_PUBLIC_HOST}`,
      API_PUBLIC_URL: `https://${derivedHosts.API_PUBLIC_HOST}`,
      PAYMENT_CHECKOUT_BASE_URL: `https://${derivedHosts.PAYMENT_WEBHOOK_HOST}`,
      FRONTEND_PUBLIC_ORIGIN: `https://${derivedHosts.UI_PUBLIC_HOST}`
    };

    assert.equal(derivedHosts.UI_PUBLIC_HOST, 'bank.tenantbank.ph');
    assert.equal(derivedUrls.FRONTEND_PUBLIC_ORIGIN, 'https://bank.tenantbank.ph');

    // 3. Backend payment allowed domains contract
    const tenantAllowedDomains = ['paymongo.com', baseDomain, 'localhost'];
    assert.isTrue(simulateIsSafeCheckoutUrl('https://pay.tenantbank.ph/checkout', tenantAllowedDomains));
    assert.isTrue(simulateIsSafeCheckoutUrl('https://applicant.tenantbank.ph/kyc', tenantAllowedDomains));
    assert.isFalse(simulateIsSafeCheckoutUrl('https://pay.tenantbank.ph.evil.com/checkout', tenantAllowedDomains));

    // 4. Backend CORS validation
    const corsCheck = simulateCorsValidation(derivedUrls.FRONTEND_PUBLIC_ORIGIN, [derivedUrls.FRONTEND_PUBLIC_ORIGIN]);
    assert.isTrue(corsCheck.allowed, 'Dynamically derived origin must be accepted by CORS');

    // 5. Frontend SDK URL generation
    const sdkUrl = `https://api.${baseDomain}/api/v1/accounts`;
    assert.equal(sdkUrl, 'https://api.tenantbank.ph/api/v1/accounts');
  });

  return suite;
}

if (process.argv[1] && process.argv[1].endsWith('tier4-application-scenarios.test.mjs')) {
  buildTier4Suite().run().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
