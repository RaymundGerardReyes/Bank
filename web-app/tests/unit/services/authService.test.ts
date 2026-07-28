import { describe, it, expect } from "vitest";
import { formatCurrency, maskAccountNumber } from "@/utils/formatters";

describe("Formatters Utility", () => {
  it("should correctly format currency in USD", () => {
    const formatted = formatCurrency(1250.5, "USD");
    expect(formatted).toContain("1,250.50");
  });

  it("should correctly mask account numbers", () => {
    const masked = maskAccountNumber("1001987654");
    expect(masked).toBe("**** 7654");
  });
});
