import { describe, it, expect, vi, beforeEach } from "vitest";
import { paymentService } from "@/services/gateway/paymentService";
import { apiFetch } from "@/services/api/httpClient";
import { endpoints } from "@/services/api/endpoints";

// Mock the apiFetch utility
vi.mock("@/services/api/httpClient", () => ({
  apiFetch: vi.fn(),
}));

describe("paymentService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call list payments API", async () => {
    const mockResponse = { success: true, data: [] };
    vi.mocked(apiFetch).mockResolvedValueOnce(mockResponse as any);

    const result = await paymentService.listPayments();
    
    expect(apiFetch).toHaveBeenCalledWith(endpoints.gateway.payments.list);
    expect(result).toEqual(mockResponse);
  });

  it("should call create QR API", async () => {
    const intentId = "intent-123";
    const mockResponse = { success: true, data: { qrReference: "qr-123" } };
    vi.mocked(apiFetch).mockResolvedValueOnce(mockResponse as any);

    const result = await paymentService.generateQr(intentId);
    
    expect(apiFetch).toHaveBeenCalledWith(endpoints.gateway.qr.generate(intentId), {
      method: "POST",
    });
    expect(result).toEqual(mockResponse);
  });

  it("should poll QR status correctly", async () => {
    const qrReference = "qr-123";
    const mockResponse = { success: true, data: { status: "SCANNED" } };
    vi.mocked(apiFetch).mockResolvedValueOnce(mockResponse as any);

    const result = await paymentService.getQrStatus(qrReference);
    
    expect(apiFetch).toHaveBeenCalledWith(endpoints.gateway.qr.status(qrReference));
    expect(result).toEqual(mockResponse);
  });
});
