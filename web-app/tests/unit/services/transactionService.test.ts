import { describe, it, expect, vi } from "vitest";
import { idempotencyKeyService } from "@/services/transaction/idempotencyKeyService";

describe("IdempotencyKeyService", () => {
  it("should generate a valid non-empty idempotency key", () => {
    const key = idempotencyKeyService.generateKey();
    expect(key).toBeDefined();
    expect(typeof key).toBe("string");
    expect(key.length).toBeGreaterThan(10);
  });

  it("should generate unique keys on successive calls", () => {
    const key1 = idempotencyKeyService.generateKey();
    const key2 = idempotencyKeyService.generateKey();
    expect(key1).not.toBe(key2);
  });
});
