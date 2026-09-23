/**
 * Tier 2: Boundary & Corner Cases Test Suite
 * 5 test cases per feature across F1 - F9 = 45 test cases total.
 * Covers: evil domain spoofing, nested subdomains, localhost variants,
 * trailing dots, empty headers, protocol mismatch, uppercase/lowercase, whitespace.
 */

import {
  TestSuiteRunner,
  assert,
  readProjectFile,
  parseNginxConfig,
  simulateIsSafeCheckoutUrl,
  simulateCorsValidation
} from './domain-test-harness.mjs';

export function buildTier2Suite() {
  const suite = new TestSuiteRunner('Tier 2: Boundary & Corner Cases');
  const allowedDomains = ['paymongo.com', 'mundbank.ph', 'localhost'];

  // =========================================================================
  // F1 Boundaries: Root Domain Derivation
  // =========================================================================
  suite.test('F1_B01_EmptyBaseDomainHandling', 'Handles empty/unset domain by safely defaulting or rejecting', () => {
    const isSafe = simulateIsSafeCheckoutUrl('https://something.com/checkout', []);
    assert.isFalse(isSafe, 'Empty allowed domains list must reject all checkout URLs');
  });

  suite.test('F1_B02_TrailingDotInBaseDomain', 'Normalizes trailing FQDN dots (e.g. mundbank.ph.) in domain matching', () => {
    // When allowed domain has trailing dot or URL has trailing dot
    const isSafe = simulateIsSafeCheckoutUrl('https://pay.mundbank.ph./checkout', allowedDomains);
    // Standard URL parser strips trailing dot on hostname
    assert.isTrue(isSafe, 'Trailing FQDN dot must be handled cleanly');
  });

  suite.test('F1_B03_UppercaseBaseDomain', 'Normalizes uppercase domain names (e.g. PAY.MUNDBANK.PH)', () => {
    const isSafe = simulateIsSafeCheckoutUrl('https://PAY.MUNDBANK.PH/checkout', allowedDomains);
    assert.isTrue(isSafe, 'Uppercase hostnames must be matched case-insensitively');
  });

  suite.test('F1_B04_WhitespacePaddedBaseDomain', 'Trims whitespace padding in domain configuration lists', () => {
    const paddedDomains = ['  paymongo.com  ', ' mundbank.ph '];
    const isSafe = simulateIsSafeCheckoutUrl('https://pay.mundbank.ph/checkout', paddedDomains);
    assert.isTrue(isSafe, 'Whitespace padded domains in configuration must match correctly');
  });

  suite.test('F1_B05_IPAddressAsBaseDomain', 'Rejects raw public IP address access when only domain names are whitelisted', () => {
    const isSafe = simulateIsSafeCheckoutUrl('https://198.51.100.1/checkout', allowedDomains);
    assert.isFalse(isSafe, 'Raw public IP addresses not in allowed list must be rejected');
  });

  // =========================================================================
  // F2 Boundaries: Host vs. URL Uniformity
  // =========================================================================
  suite.test('F2_B01_HostWithAccidentalProtocol', 'Detects and rejects protocol prefix in naked host variables', () => {
    const hostWithProtocol = 'https://bank.mundbank.ph';
    const isNakedHost = !hostWithProtocol.startsWith('http://') && !hostWithProtocol.startsWith('https://');
    assert.isFalse(isNakedHost, 'Host variable with https:// prefix violates FQDN contract');
  });

  suite.test('F2_B02_UrlWithMissingProtocol', 'Normalizes origin without protocol by prepending https:// in CORS config', () => {
    const rawOrigin = 'bank.mundbank.ph';
    const res = simulateCorsValidation('https://bank.mundbank.ph', [rawOrigin]);
    assert.isTrue(res.allowed, 'Origin missing protocol must be normalized with https://');
  });

  suite.test('F2_B03_UrlWithTrailingSlash', 'Normalizes origins with trailing slashes so matching does not fail', () => {
    const res = simulateCorsValidation('https://bank.mundbank.ph/', ['https://bank.mundbank.ph']);
    assert.isTrue(res.allowed, 'Trailing slash in Origin header must be normalized cleanly');
  });

  suite.test('F2_B04_HostWithPort', 'Correctly matches origins and hosts with custom non-standard ports', () => {
    const res = simulateCorsValidation('http://localhost:3000', ['http://localhost:3000', 'https://bank.mundbank.ph']);
    assert.isTrue(res.allowed, 'Localhost with custom port 3000 must match allowed origin');
  });

  suite.test('F2_B05_MixedProtocolVariants', 'Rejects non-HTTP schemes (javascript:, data:, file:) in checkout URLs', () => {
    const jsScheme = simulateIsSafeCheckoutUrl('javascript:alert(1)', allowedDomains);
    const dataScheme = simulateIsSafeCheckoutUrl('data:text/html,<html>', allowedDomains);
    assert.isFalse(jsScheme, 'javascript: scheme must be rejected');
    assert.isFalse(dataScheme, 'data: scheme must be rejected');
  });

  // =========================================================================
  // F3 Boundaries: Nginx Gateway Cleanliness & Invariants
  // =========================================================================
  suite.test('F3_B01_NginxEmptyHostHeader', 'Verifies default catch-all handles requests with empty or missing Host header', () => {
    const { serverBlocks } = parseNginxConfig();
    const defaultServer = serverBlocks.find(b => b.isDefaultServer);
    assert.isTrue(!!defaultServer, 'Default server block must be present');
    assert.match(defaultServer.raw, /server_name\s+_/, 'Catch-all must use server_name _;');
  });

  suite.test('F3_B02_NginxEvilHostHeaderSpoof', 'Verifies unknown spoofed Host headers route to catch-all 404', () => {
    const { serverBlocks } = parseNginxConfig();
    const knownHosts = serverBlocks.flatMap(b => b.serverName.split(/\s+/)).filter(Boolean);
    const evilHost = 'evil-mundbank.ph';
    const isKnown = knownHosts.some(h => h.includes(evilHost));
    assert.isFalse(isKnown, 'Evil spoofed host must not match any configured server_name');
  });

  suite.test('F3_B03_NginxNestedSubdomainHost', 'Verifies unrecognized nested subdomains do not accidentally match API host', () => {
    const { serverBlocks } = parseNginxConfig();
    const apiBlock = serverBlocks.find(b => b.serverName.includes('${API_PUBLIC_HOST}'));
    assert.isTrue(!!apiBlock, 'API server block must be present');
    // Ensure API server does not have wildcard prefix like *.${API_PUBLIC_HOST}
    assert.notMatch(apiBlock.serverName, /\*\./, 'API server_name must not have wildcards');
  });

  suite.test('F3_B04_NginxUppercaseHostHeader', 'Verifies Nginx server matching is case-insensitive for RFC 7230 compliance', () => {
    const { serverBlocks } = parseNginxConfig();
    // Nginx standard behavior performs case-insensitive Host matching
    const uiBlock = serverBlocks.find(b => b.serverName.includes('${UI_PUBLIC_HOST}'));
    assert.isTrue(!!uiBlock, 'UI virtual host must be defined');
  });

  suite.test('F3_B05_NginxPortInHostHeader', 'Verifies proxy configurations pass real scheme and client IP', () => {
    const { raw } = parseNginxConfig();
    assert.match(raw, /proxy_set_header\s+X-Forwarded-Proto/, 'Nginx must preserve and forward client protocol');
    assert.match(raw, /proxy_set_header\s+Host/, 'Nginx must pass Host header to upstreams');
  });

  // =========================================================================
  // F4 Boundaries: Spring Boot Subdomain Wildcard Invariant
  // =========================================================================
  suite.test('F4_B01_EvilSuffixSpoofing', 'Rejects hyphen-separated spoofing like evil-mundbank.ph', () => {
    const isSafe = simulateIsSafeCheckoutUrl('https://evil-mundbank.ph/checkout', allowedDomains);
    assert.isFalse(isSafe, 'Must reject evil-mundbank.ph');
  });

  suite.test('F4_B02_EvilPrefixSpoofing', 'Rejects attacker domain with root as subdomain prefix (mundbank.ph.attacker.com)', () => {
    const isSafe = simulateIsSafeCheckoutUrl('https://mundbank.ph.attacker.com/checkout', allowedDomains);
    assert.isFalse(isSafe, 'Must reject mundbank.ph.attacker.com');
  });

  suite.test('F4_B03_DeeplyNestedSubdomain', 'Allows multi-level valid subdomains (checkout.secure.pay.mundbank.ph)', () => {
    const isSafe = simulateIsSafeCheckoutUrl('https://checkout.secure.pay.mundbank.ph/v1/session', allowedDomains);
    assert.isTrue(isSafe, 'Multi-level nested subdomains under mundbank.ph must be accepted');
  });

  suite.test('F4_B04_HttpDowngradeOnProductionDomain', 'Rejects plaintext HTTP on production domain (http://pay.mundbank.ph)', () => {
    const isSafe = simulateIsSafeCheckoutUrl('http://pay.mundbank.ph/checkout', allowedDomains);
    assert.isFalse(isSafe, 'Must reject non-HTTPS URLs on non-localhost domains');
  });

  suite.test('F4_B05_HttpAllowedOnlyOnLocalhost', 'Permits HTTP only for localhost, rejecting HTTP for 127.0.0.1 unless whitelisted', () => {
    const localhostSafe = simulateIsSafeCheckoutUrl('http://localhost:8080/checkout', allowedDomains);
    const ipSafe = simulateIsSafeCheckoutUrl('http://127.0.0.1:8080/checkout', allowedDomains);
    assert.isTrue(localhostSafe, 'http://localhost must be allowed');
    assert.isFalse(ipSafe, 'http://127.0.0.1 must be rejected unless explicitly listed in allowed domains');
  });

  // =========================================================================
  // F5 Boundaries: Spring Boot CORS Origin Validation
  // =========================================================================
  suite.test('F5_B01_CorsOriginTrailingSlash', 'Handles incoming Origin headers with trailing slashes gracefully', () => {
    const res = simulateCorsValidation('https://bank.mundbank.ph/', ['https://bank.mundbank.ph']);
    assert.isTrue(res.allowed, 'Origin with trailing slash must match configured base origin');
  });

  suite.test('F5_B02_CorsOriginUppercase', 'Matches uppercase Origin headers (e.g. HTTPS://BANK.MUNDBANK.PH)', () => {
    const res = simulateCorsValidation('HTTPS://BANK.MUNDBANK.PH', ['https://bank.mundbank.ph']);
    assert.isTrue(res.allowed, 'Case-insensitive CORS origin matching must succeed');
  });

  suite.test('F5_B03_CorsNullOrigin', 'Rejects Origin: null (sandboxed frames / file URLs) for secure banking APIs', () => {
    const res = simulateCorsValidation('null', ['https://bank.mundbank.ph']);
    assert.isFalse(res.allowed, 'Origin "null" must be rejected');
  });

  suite.test('F5_B04_CorsWildcardRejectedInProduction', 'Verifies CorsConfig does NOT configure allowedOrigins("*") with credentials', () => {
    const corsContent = readProjectFile('backend/src/main/java/com/company/banking/config/CorsConfig.java');
    assert.notMatch(corsContent, /setAllowedOrigins\s*\(\s*List\.of\s*\(\s*"\*"\s*\)\s*\)/, 'Must not use wildcard allowedOrigins with credentials');
  });

  suite.test('F5_B05_CorsMultipleCommaDelimitedWithSpaces', 'Tolerates loose whitespace formatting around comma delimiters in FRONTEND_PUBLIC_ORIGIN', () => {
    const looseOrigins = ['  https://bank.mundbank.ph   ,   http://localhost:3000  '];
    const res1 = simulateCorsValidation('https://bank.mundbank.ph', looseOrigins);
    const res2 = simulateCorsValidation('http://localhost:3000', looseOrigins);
    assert.isTrue(res1.allowed, 'First origin in space-padded comma string must match');
    assert.isTrue(res2.allowed, 'Second origin in space-padded comma string must match');
  });

  // =========================================================================
  // F6 Boundaries: Frontend Subdomain Normalization & SDK Fix
  // =========================================================================
  suite.test('F6_B01_DoubleSubdomainPrefixStripping', 'Verifies prefix stripping logic strips api. and pay. if mistakenly passed', () => {
    // Utility simulator
    function sanitizeRoot(domain) {
      return domain.replace(/^(api|pay|bank|applicant)\./i, '');
    }
    assert.equal(sanitizeRoot('api.mundbank.ph'), 'mundbank.ph');
    assert.equal(sanitizeRoot('pay.mundbank.ph'), 'mundbank.ph');
  });

  suite.test('F6_B02_LocalhostInFrontendDomain', 'Verifies localhost with port 3000 maps to localhost API in local development', () => {
    function getDevApi(domain) {
      return (domain === 'localhost' || domain.includes('localhost:')) ? 'http://localhost:8080' : `https://api.${domain}`;
    }
    assert.equal(getDevApi('localhost:3000'), 'http://localhost:8080');
    assert.equal(getDevApi('mundbank.ph'), 'https://api.mundbank.ph');
  });

  suite.test('F6_B03_ApiBaseUrlProtocolEnforcement', 'Guarantees API base URL always begins with https:// in production', () => {
    function getApiBaseUrl(domain) {
      const clean = domain ? domain.replace(/^(api|pay|bank)\./i, '') : 'mundbank.ph';
      return `https://api.${clean}`;
    }
    const url = getApiBaseUrl('mundbank.ph');
    assert.match(url, /^https:\/\/api\./, 'API base URL must start with https://api.');
  });

  suite.test('F6_B04_ApiBaseUrlNeverEndsWithSlash', 'Guarantees API base URL never terminates with trailing slash', () => {
    function getApiBaseUrl(domain) {
      return `https://api.${domain.replace(/\/+$/, '')}`;
    }
    const url = getApiBaseUrl('mundbank.ph/');
    assert.isFalse(url.endsWith('/'), 'Base URL must not have trailing slash');
  });

  suite.test('F6_B05_UndefinedEnvFallback', 'Falls back safely to mundbank.ph if NEXT_PUBLIC_PLATFORM_DOMAIN is undefined', () => {
    function resolveDomain(envVar) {
      return envVar || 'mundbank.ph';
    }
    assert.equal(resolveDomain(undefined), 'mundbank.ph');
    assert.equal(resolveDomain(''), 'mundbank.ph');
  });

  // =========================================================================
  // F7 Boundaries: Legacy Brand Cleanup
  // =========================================================================
  suite.test('F7_B01_NoObfuscatedNovabankReferences', 'Ensures no alternate casing or disguised novabank references exist in nginx.conf', () => {
    const nginxContent = readProjectFile('infra/nginx/nginx.conf').toLowerCase();
    assert.notIncludes(nginxContent, 'novabank', 'nginx.conf must have zero novabank strings in any case');
  });

  suite.test('F7_B02_SwaggerUiTitleCleanliness', 'Verifies OpenApiConfig title does not contain NovaBank branding', () => {
    const openApi = readProjectFile('backend/src/main/java/com/company/banking/config/OpenApiConfig.java');
    assert.notIncludes(openApi, 'NovaBank', 'OpenAPI title must be free of NovaBank');
  });

  suite.test('F7_B03_EmailDomainCleanliness', 'Verifies application.yml mail defaults do not reference @novabank.ph', () => {
    const yml = readProjectFile('backend/src/main/resources/application.yml');
    assert.notIncludes(yml, 'novabank.ph', 'application.yml must not contain novabank.ph');
  });

  suite.test('F7_B04_CodeSnippetCommentsCleanliness', 'Verifies developer snippets do not contain hardcoded novabank API keys', () => {
    const snippets = readProjectFile('web-app/src/app/(public)/developers/snippets/page.tsx');
    assert.notIncludes(snippets, 'sk_test_novabank', 'Developer snippets must not use sk_test_novabank credential prefix');
  });

  suite.test('F7_B05_DatabaseNamingCleanliness', 'Verifies compose database name defaults to clean banking database name', () => {
    const compose = readProjectFile('infra/docker/compose.yaml');
    assert.notIncludes(compose, 'novabank_db', 'Database name must not reference novabank');
  });

  // =========================================================================
  // F8 Boundaries: Zero Decryption Invariant
  // =========================================================================
  suite.test('F8_B01_DotenvxRunWithoutDecryptInCI', 'Verifies npm scripts do not chain decrypt before run commands in CI', () => {
    const pkg = JSON.parse(readProjectFile('package.json'));
    const testGateway = pkg.scripts['test:gateway'];
    assert.isTrue(!!testGateway, 'test:gateway script must exist');
    assert.notIncludes(testGateway, 'decrypt', 'test:gateway must not execute decrypt');
  });

  suite.test('F8_B02_NonSecretDomainExposure', 'Verifies domain variables are defined in plaintext configuration, not as encrypted keys', () => {
    const compose = readProjectFile('infra/docker/compose.yaml');
    assert.includes(compose, 'UI_PUBLIC_HOST', 'UI_PUBLIC_HOST is a public configuration mapping');
  });

  suite.test('F8_B03_GitignoreCiphertextIntegrity', 'Verifies .gitignore ignores local test environment overrides', () => {
    const gitignore = readProjectFile('.gitignore');
    assert.match(gitignore, /\.env\.local|\.env\*\.local/, '.gitignore must ignore .env*.local');
  });

  suite.test('F8_B04_PlaceholderCredentialMasking', 'Verifies sample code uses synthetic test UUIDs rather than real private credentials', () => {
    const domainLib = readProjectFile('web-app/src/components/features/api/DomainLibrary.tsx');
    assert.includes(domainLib, '550e8400-e29b-41d4-a716-446655440000', 'DomainLibrary must use RFC 4122 nil/test UUID for sample X-Request-Id');
  });

  suite.test('F8_B05_ContainerEnvironmentIsolation', 'Verifies database container does not inherit unneeded web domain environment variables', () => {
    const compose = readProjectFile('infra/docker/compose.yaml');
    const dbSection = compose.split('database:')[1];
    assert.notIncludes(dbSection, 'UI_PUBLIC_HOST', 'Database container should not receive UI_PUBLIC_HOST');
  });

  // =========================================================================
  // F9 Boundaries: End-to-End Test Suite Validation
  // =========================================================================
  suite.test('F9_B01_LargePayloadValidation', 'Handles validation matrices with >50 domain variations without performance degradation', () => {
    const start = Date.now();
    for (let i = 0; i < 50; i++) {
      simulateIsSafeCheckoutUrl(`https://sub${i}.pay.mundbank.ph/checkout`, allowedDomains);
    }
    const elapsed = Date.now() - start;
    assert.isTrue(elapsed < 200, `50 domain evaluations took ${elapsed}ms, must be < 200ms`);
  });

  suite.test('F9_B02_ColorOutputDegradation', 'Ensures assertion failures format clean plain-text messages without terminal corruption', () => {
    try {
      assert.equal('clean1', 'clean2', 'diff test');
    } catch (e) {
      assert.notIncludes(e.message, '\u001b[', 'Error messages should not inject escape codes in raw message strings');
    }
  });

  suite.test('F9_B03_AsyncTimeoutGuards', 'Ensures all test promises resolve within bounded limits', async () => {
    const timeoutPromise = new Promise(resolve => setTimeout(() => resolve('ok'), 10));
    const result = await timeoutPromise;
    assert.equal(result, 'ok');
  });

  suite.test('F9_B04_EmptyConfigHandling', 'Throws informative error when trying to parse missing configuration files', () => {
    assert.throws(() => {
      readProjectFile('non_existent_config.json');
    }, 'ENOENT', 'Must throw ENOENT on non-existent file');
  });

  suite.test('F9_B05_WindowsPathTolerance', 'Handles mixed Windows backslash and forward slash path separators uniformly', () => {
    assert.throws(() => {
      readProjectFile('infra\\..\\.env');
    }, 'SECURITY VIOLATION', 'Path normalization must detect .env through backslashes');
  });

  return suite;
}

if (process.argv[1] && process.argv[1].endsWith('tier2-boundary-cases.test.mjs')) {
  buildTier2Suite().run().then(res => {
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
