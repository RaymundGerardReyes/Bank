import { describe, it, expect, vi, beforeEach } from "vitest";
import { merchantService } from "@/services/gateway/merchantService";
import { apiFetch } from "@/services/api/httpClient";
import { endpoints } from "@/services/api/endpoints";
import { MerchantLifecycleStage } from "@/models/GatewayModels";

// Mock the apiFetch utility
vi.mock("@/services/api/httpClient", () => ({
  apiFetch: vi.fn(),
}));

describe("merchantService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should advance merchant lifecycle correctly", async () => {
    const merchantId = "100";
    const expectedStatus: MerchantLifecycleStage = "APPLICATION";
    const nextStatus: MerchantLifecycleStage = "KYB";
    const reviewer = "ops_user";
    
    const mockResponse = { success: true, data: { status: nextStatus } };
    vi.mocked(apiFetch).mockResolvedValueOnce(mockResponse as any);

    const result = await merchantService.advanceLifecycle(
      merchantId, 
      expectedStatus, 
      nextStatus, 
      reviewer
    );
    
    expect(apiFetch).toHaveBeenCalledWith(endpoints.gateway.merchants.advance(merchantId), {
      method: "POST",
      body: JSON.stringify({ expectedStatus, nextStatus, reviewer, riskProfileUpdate: undefined }),
    });
    expect(result).toEqual(mockResponse);
  });
});
