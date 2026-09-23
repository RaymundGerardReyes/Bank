/**
 * Domain Refactoring E2E Test Harness
 * Provides shared assertion primitives, configuration parsers, domain matching validators,
 * and test result reporting across all 4 tiers.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

export class AssertionFailure extends Error {
  constructor(message, expected, actual) {
    super(message);
    this.name = 'AssertionFailure';
    this.expected = expected;
    this.actual = actual;
  }
}

export const assert = {
  isTrue(value, msg = 'Expected value to be true') {
    if (value !== true) {
      throw new AssertionFailure(`${msg} (actual: ${value})`, true, value);
    }
  },

  isFalse(value, msg = 'Expected value to be false') {
    if (value !== false) {
      throw new AssertionFailure(`${msg} (actual: ${value})`, false, value);
    }
  },

  equal(actual, expected, msg = 'Values are not equal') {
    if (actual !== expected) {
      throw new AssertionFailure(`${msg} - expected: ${expected}, actual: ${actual}`, expected, actual);
    }
  },

  strictEqual(actual, expected, msg = 'Values are not strictly equal') {
    if (actual !== expected) {
      throw new AssertionFailure(`${msg} - expected: ${expected}, actual: ${actual}`, expected, actual);
    }
  },

  includes(haystack, needle, msg = 'Substring/element not found') {
    if (typeof haystack === 'string' && !haystack.includes(needle)) {
      throw new AssertionFailure(`${msg} - string does not include "${needle}"`, needle, haystack);
    } else if (Array.isArray(haystack) && !haystack.includes(needle)) {
      throw new AssertionFailure(`${msg} - array does not include item`, needle, haystack);
    }
  },

  notIncludes(haystack, needle, msg = 'Substring/element should not be present') {
    if (typeof haystack === 'string' && haystack.includes(needle)) {
      throw new AssertionFailure(`${msg} - string should not include "${needle}"`, `(not) ${needle}`, haystack);
    } else if (Array.isArray(haystack) && haystack.includes(needle)) {
      throw new AssertionFailure(`${msg} - array should not include item`, `(not) ${needle}`, haystack);
    }
  },

  match(str, regex, msg = 'String does not match regex') {
    if (!regex.test(str)) {
      throw new AssertionFailure(`${msg} - value "${str}" does not match pattern ${regex}`, regex.toString(), str);
    }
  },

  notMatch(str, regex, msg = 'String should not match regex') {
    if (regex.test(str)) {
      throw new AssertionFailure(`${msg} - value "${str}" unexpectedly matched pattern ${regex}`, `not ${regex.toString()}`, str);
    }
  },

  throws(fn, expectedErrorSubstring = null, msg = 'Expected function to throw') {
    let didThrow = false;
    let thrownError = null;
    try {
      fn();
    } catch (e) {
      didThrow = true;
      thrownError = e;
    }
    if (!didThrow) {
      throw new AssertionFailure(msg, 'Exception thrown', 'No exception thrown');
    }
    if (expectedErrorSubstring && !thrownError.message.includes(expectedErrorSubstring)) {
      throw new AssertionFailure(`Thrown error message "${thrownError.message}" does not include "${expectedErrorSubstring}"`, expectedErrorSubstring, thrownError.message);
    }
  }
};

/**
 * Safe file reader: strictly avoids .env or encrypted files (F8 Zero Decryption Invariant)
 */
export function readProjectFile(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/');
  if (normalized.endsWith('.env') || normalized.endsWith('.env.development') || normalized.includes('.env.keys')) {
    throw new Error(`SECURITY VIOLATION (R4/F8): Attempted to read encrypted secret file: ${relativePath}`);
  }
  const fullPath = path.resolve(PROJECT_ROOT, relativePath);
  return fs.readFileSync(fullPath, 'utf8');
}

/**
 * Checks if a file exists relative to project root
 */
export function projectFileExists(relativePath) {
  const fullPath = path.resolve(PROJECT_ROOT, relativePath);
  return fs.existsSync(fullPath);
}

/**
 * Nginx configuration parser helper
 */
export function parseNginxConfig() {
  const content = readProjectFile('infra/nginx/nginx.conf');
  
  // Extract server blocks
  const serverBlocks = [];
  const serverRegex = /server\s*\{([\s\S]*?)\n\s*\}/g;
  let match;
  while ((match = serverRegex.exec(content)) !== null) {
    const blockContent = match[1];
    
    // server_name
    const serverNameMatch = blockContent.match(/server_name\s+([^;]+);/);
    const serverName = serverNameMatch ? serverNameMatch[1].trim() : '';
    
    // listen
    const listenMatches = [...blockContent.matchAll(/listen\s+([^;]+);/g)].map(m => m[1].trim());
    const isDefaultServer = listenMatches.some(l => l.includes('default_server'));
    
    // locations
    const locationMatches = [...blockContent.matchAll(/location\s+([^{]+)\{([\s\S]*?)\}/g)].map(m => ({
      path: m[1].trim(),
      body: m[2].trim()
    }));
    
    serverBlocks.push({
      raw: blockContent,
      serverName,
      listenMatches,
      isDefaultServer,
      locations: locationMatches
    });
  }
  
  return {
    raw: content,
    serverBlocks
  };
}

/**
 * Backend Spring Boot Payment URL Validator logic simulator
 * Directly replicates PaymentIntentOrchestrationService.isSafeCheckoutUrl
 */
export function simulateIsSafeCheckoutUrl(url, allowedDomainsList) {
  if (!allowedDomainsList || allowedDomainsList.length === 0) return false;
  try {
    const parsed = new URL(url);
    const scheme = parsed.protocol.replace(':', '');
    const host = parsed.hostname;
    
    if (!scheme.toLowerCase().startsWith('https') && host !== 'localhost') {
      if (!scheme.toLowerCase().startsWith('http') || host !== 'localhost') {
        return false;
      }
    }
    if (!host) return false;
    
    return allowedDomainsList.some(d => {
      const trimmed = d.trim().toLowerCase();
      const lowerHost = host.toLowerCase();
      return lowerHost === trimmed || lowerHost.endsWith('.' + trimmed);
    });
  } catch (e) {
    return false;
  }
}

/**
 * Backend Spring Boot CORS logic simulator
 * Replicates Spring Boot CorsFilter behavior given configured allowedOrigins
 */
export function simulateCorsValidation(originHeader, configuredOrigins) {
  if (!originHeader) return { allowed: false };
  if (!configuredOrigins || configuredOrigins.length === 0) return { allowed: false };

  // Normalize origins
  const normalizedOrigins = configuredOrigins.flatMap(orig => 
    orig.split(',').map(s => {
      let trimmed = s.trim();
      if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
        trimmed = 'https://' + trimmed;
      }
      return trimmed.replace(/\/+$/, '');
    })
  );

  const reqOrigin = originHeader.trim().replace(/\/+$/, '');
  const match = normalizedOrigins.some(o => o.toLowerCase() === reqOrigin.toLowerCase());
  
  return {
    allowed: match,
    allowOriginHeader: match ? reqOrigin : null,
    allowCredentials: match ? 'true' : null
  };
}

/**
 * Centralized Test Suite Collector & Runner
 */
export class TestSuiteRunner {
  constructor(suiteName) {
    this.suiteName = suiteName;
    this.tests = [];
    this.results = [];
  }

  test(id, description, fn) {
    this.tests.push({ id, description, fn });
  }

  async run() {
    console.log(`\n======================================================================`);
    console.log(`🚀 Running Suite: ${this.suiteName} (${this.tests.length} assertions)`);
    console.log(`======================================================================`);

    let passedCount = 0;
    let failedCount = 0;
    const startTime = Date.now();

    for (const t of this.tests) {
      const testStart = Date.now();
      try {
        await t.fn();
        const duration = Date.now() - testStart;
        console.log(`  ✅ [${t.id}] ${t.description} (${duration}ms)`);
        this.results.push({ id: t.id, description: t.description, status: 'PASSED', duration });
        passedCount++;
      } catch (err) {
        const duration = Date.now() - testStart;
        console.log(`  ❌ [${t.id}] ${t.description} (${duration}ms)`);
        console.log(`     Error: ${err.message}`);
        this.results.push({ 
          id: t.id, 
          description: t.description, 
          status: 'FAILED', 
          duration,
          error: err.message,
          expected: err.expected,
          actual: err.actual
        });
        failedCount++;
      }
    }

    const totalDuration = Date.now() - startTime;
    console.log(`----------------------------------------------------------------------`);
    console.log(`📊 Suite Results: ${passedCount}/${this.tests.length} passed (${failedCount} failed) in ${totalDuration}ms`);
    console.log(`======================================================================\n`);

    return {
      suiteName: this.suiteName,
      total: this.tests.length,
      passed: passedCount,
      failed: failedCount,
      duration: totalDuration,
      results: this.results
    };
  }
}
