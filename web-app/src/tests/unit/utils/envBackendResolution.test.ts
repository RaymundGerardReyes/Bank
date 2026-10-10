import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { resolveBackendUrl, resolveBackendOrigin } from "@/server/config/env";

describe("Backend URL and Origin Resolution Invariants", () => {
  const originalRuntimeEnv = process.env.RUNTIME_ENV;

  afterEach(() => {
    process.env.RUNTIME_ENV = originalRuntimeEnv;
  });

  describe("Host Machine (Non-Docker) Environment", () => {
    beforeEach(() => {
      delete process.env.RUNTIME_ENV;
    });

    it("rewrites http://backend:8080 to http://127.0.0.1:8086", () => {
      expect(resolveBackendUrl("http://backend:8080")).toBe("http://127.0.0.1:8086");
    });

    it("rewrites http://backend:8086 to http://127.0.0.1:8086", () => {
      expect(resolveBackendUrl("http://backend:8086")).toBe("http://127.0.0.1:8086");
    });

    it("rewrites bare http://backend to http://127.0.0.1:8086", () => {
      expect(resolveBackendUrl("http://backend")).toBe("http://127.0.0.1:8086");
    });

    it("preserves URL paths when rewriting backend host", () => {
      expect(resolveBackendUrl("http://backend:8080/api/v1/auth/login")).toBe(
        "http://127.0.0.1:8086/api/v1/auth/login"
      );
    });

    it("resolves origin correctly to protocol and host:port", () => {
      expect(resolveBackendOrigin("http://backend:8080/api/v1/auth/login")).toBe(
        "http://127.0.0.1:8086"
      );
    });

    it("leaves external domain URLs unchanged", () => {
      expect(resolveBackendUrl("https://api.mundbank.ph/api/v1")).toBe(
        "https://api.mundbank.ph/api/v1"
      );
      expect(resolveBackendOrigin("https://api.mundbank.ph/api/v1")).toBe(
        "https://api.mundbank.ph"
      );
    });

    it("handles empty or undefined inputs gracefully", () => {
      expect(resolveBackendUrl(undefined)).toBe("");
      expect(resolveBackendUrl("")).toBe("");
      expect(resolveBackendOrigin(undefined)).toBe("");
      expect(resolveBackendOrigin("")).toBe("");
    });
  });

  describe("Docker Container Environment", () => {
    beforeEach(() => {
      process.env.RUNTIME_ENV = "docker";
    });

    it("rewrites host-mapped port 8086 to internal container port 8080", () => {
      expect(resolveBackendUrl("http://backend:8086")).toBe("http://backend:8080");
    });

    it("preserves internal container port 8080", () => {
      expect(resolveBackendUrl("http://backend:8080")).toBe("http://backend:8080");
    });

    it("preserves external domains in docker", () => {
      expect(resolveBackendUrl("https://bank.mundbank.ph")).toBe("https://bank.mundbank.ph");
    });
  });
});

