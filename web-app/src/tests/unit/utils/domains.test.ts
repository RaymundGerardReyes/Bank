import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getRootDomain, getApiBaseUrl } from "@/utils/domains";
import { generateCspHeader } from "@/security/csp";

describe("domains utility", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Clone env before each test to isolate environment modifications
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_BASE_DOMAIN;
    delete process.env.NEXT_PUBLIC_PLATFORM_DOMAIN;
    delete process.env.PLATFORM_DOMAIN;
    delete process.env.NEXT_PUBLIC_API_URL;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("getRootDomain", () => {
    it("returns default fallback 'localhost' when no environment variables or window are set", () => {
      expect(getRootDomain()).toBe("localhost");
    });

    it("returns custom fallback when specified and env is empty", () => {
      expect(getRootDomain("custombank.ph")).toBe("custombank.ph");
    });

    it("prioritizes NEXT_PUBLIC_BASE_DOMAIN over other env variables", () => {
      process.env.NEXT_PUBLIC_BASE_DOMAIN = "testbank.com";
      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN = "pay.testbank.com";
      process.env.PLATFORM_DOMAIN = "bank.testbank.com";

      expect(getRootDomain()).toBe("testbank.com");
    });

    it("reads NEXT_PUBLIC_PLATFORM_DOMAIN when NEXT_PUBLIC_BASE_DOMAIN is absent", () => {
      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN = "testbank.com";
      expect(getRootDomain()).toBe("testbank.com");
    });

    it("reads PLATFORM_DOMAIN when NEXT_PUBLIC_* variables are absent", () => {
      process.env.PLATFORM_DOMAIN = "testbank.com";
      expect(getRootDomain()).toBe("testbank.com");
    });

    it("strips known service prefixes: api., pay., bank., applicant., admin., ops., portal.", () => {
      const prefixes = ["api.", "pay.", "bank.", "applicant.", "admin.", "ops.", "portal."];
      for (const prefix of prefixes) {
        process.env.NEXT_PUBLIC_PLATFORM_DOMAIN = `${prefix}testbank.com`;
        expect(getRootDomain()).toBe("testbank.com");
      }
    });

    it("strips nested/stacked service prefixes like api.pay.testbank.com", () => {
      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN = "api.pay.testbank.com";
      expect(getRootDomain()).toBe("testbank.com");

      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN = "api.bank.testbank.com";
      expect(getRootDomain()).toBe("testbank.com");

      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN = "api.applicant.testbank.com";
      expect(getRootDomain()).toBe("testbank.com");

      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN = "pay.portal.testbank.com";
      expect(getRootDomain()).toBe("testbank.com");
    });

    it("strips protocols, ports, and trailing paths", () => {
      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN = "https://pay.testbank.com:8443/v1/accounts";
      expect(getRootDomain()).toBe("testbank.com");

      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN = "http://bank.testbank.com:3000";
      expect(getRootDomain()).toBe("testbank.com");
    });

    it("handles localhost and 127.0.0.1 correctly", () => {
      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN = "localhost";
      expect(getRootDomain()).toBe("localhost");

      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN = "127.0.0.1";
      expect(getRootDomain()).toBe("127.0.0.1");

      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN = "http://localhost:3000";
      expect(getRootDomain()).toBe("localhost");

      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN = "http://127.0.0.1:8080/api";
      expect(getRootDomain()).toBe("127.0.0.1");
    });

    it("handles edge cases: uppercase, leading/trailing whitespace, and empty strings", () => {
      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN = "  PAY.TESTBANK.COM  ";
      expect(getRootDomain()).toBe("testbank.com");

      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN = "   ";
      expect(getRootDomain("fallback.ph")).toBe("fallback.ph");
    });

    it("cleans custom fallback domain passed as parameter", () => {
      expect(getRootDomain("pay.custombank.com")).toBe("custombank.com");
      expect(getRootDomain("api.bank.enterprise.org")).toBe("enterprise.org");
      expect(getRootDomain("localhost:3000")).toBe("localhost");
    });

    it("derives domain from currentHost / browser hostname on non-localhost domain", () => {
      expect(getRootDomain(undefined, "portal.testbank.com")).toBe("testbank.com");
      expect(getRootDomain(undefined, "bank.testbank.com")).toBe("testbank.com");
    });
  });

  describe("getApiBaseUrl", () => {
    it("returns 'http://localhost:8080' by default when no environment domain is set", () => {
      expect(getApiBaseUrl()).toBe("http://localhost:8080");
    });

    it("returns 'http://localhost:8080' when domain is localhost", () => {
      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN = "localhost";
      expect(getApiBaseUrl()).toBe("http://localhost:8080");
    });

    it("returns 'http://localhost:8080' when domain is 127.0.0.1", () => {
      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN = "127.0.0.1";
      expect(getApiBaseUrl()).toBe("http://localhost:8080");
    });

    it("guarantees canonical https://api.testbank.com when input is a service subdomain (no nested subdomains)", () => {
      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN = "pay.testbank.com";
      expect(getApiBaseUrl()).toBe("https://api.testbank.com");

      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN = "bank.testbank.com";
      expect(getApiBaseUrl()).toBe("https://api.testbank.com");

      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN = "applicant.testbank.com";
      expect(getApiBaseUrl()).toBe("https://api.testbank.com");
    });

    it("guarantees canonical https://api.testbank.com when input is already api.testbank.com (no api.api. duplicate)", () => {
      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN = "api.testbank.com";
      expect(getApiBaseUrl()).toBe("https://api.testbank.com");
    });

    it("guarantees canonical https://api.testbank.com when input is nested api.pay.testbank.com", () => {
      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN = "api.pay.testbank.com";
      expect(getApiBaseUrl()).toBe("https://api.testbank.com");
    });

    it("respects NEXT_PUBLIC_API_URL override if explicitly set", () => {
      process.env.NEXT_PUBLIC_API_URL = "https://custom-gateway.testbank.com/api";
      expect(getApiBaseUrl()).toBe("https://custom-gateway.testbank.com/api");

      // Trims trailing slashes
      process.env.NEXT_PUBLIC_API_URL = "https://custom-gateway.testbank.com/api/";
      expect(getApiBaseUrl()).toBe("https://custom-gateway.testbank.com/api");
    });

    it("supports passing custom fallback domain", () => {
      expect(getApiBaseUrl("pay.globalbank.com")).toBe("https://api.globalbank.com");
      expect(getApiBaseUrl("localhost")).toBe("http://localhost:8080");
    });
  });

  describe("generateCspHeader", () => {
    it("includes https://*.${platformDomain} in connect-src when PLATFORM_DOMAIN is set", () => {
      process.env.PLATFORM_DOMAIN = "testbank.com";
      const csp = generateCspHeader();
      expect(csp).toContain("connect-src 'self' wss: ws: https://testbank.com https://*.testbank.com http://testbank.com http://*.testbank.com");
    });

    it("includes https://*.${platformDomain} in connect-src when NEXT_PUBLIC_PLATFORM_DOMAIN is set", () => {
      process.env.NEXT_PUBLIC_PLATFORM_DOMAIN = "testbank.com";
      const csp = generateCspHeader();
      expect(csp).toContain("https://*.testbank.com");
    });

    it("defaults connect-src without platform domain when env variables are not set", () => {
      const csp = generateCspHeader();
      expect(csp).toContain("connect-src 'self' wss: ws:");
      expect(csp).not.toContain("https://*");
    });

    it("includes nonce in script-src when nonce is provided", () => {
      const csp = generateCspHeader("test-nonce-123");
      expect(csp).toContain("script-src 'self' 'nonce-test-nonce-123' 'unsafe-inline'");
    });
  });
});
