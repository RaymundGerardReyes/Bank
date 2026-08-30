import { apiFetch } from "@/services/api/httpClient";
import { ApiResponse } from "@/models/ApiResponse";
import { Merchant, MerchantBalance, MerchantLifecycleStage } from "@/models/GatewayModels";
import { endpoints } from "@/services/api/endpoints";

export const merchantService = {
  listMerchants: async (): Promise<ApiResponse<Merchant[]>> => {
    return apiFetch<ApiResponse<Merchant[]>>(endpoints.gateway.merchants.list);
  },

  getMerchant: async (merchantId: string): Promise<ApiResponse<Merchant>> => {
    return apiFetch<ApiResponse<Merchant>>(endpoints.gateway.merchants.byId(merchantId));
  },

  advanceLifecycle: async (
    merchantId: string,
    expectedStatus: MerchantLifecycleStage,
    nextStatus: MerchantLifecycleStage,
    reviewer: string,
    riskProfileUpdate?: string
  ): Promise<ApiResponse<Merchant>> => {
    return apiFetch<ApiResponse<Merchant>>(endpoints.gateway.merchants.advance(merchantId), {
      method: "POST",
      body: JSON.stringify({ expectedStatus, nextStatus, reviewer, riskProfileUpdate }),
    });
  },

  onboardDeveloper: async (
    payload: { legalName: string; merchantCode: string; businessRegistrationNumber: string; email: string; }
  ): Promise<{ merchantId: number; settlementAccountNumber: string; apiKey: string }> => {
    return apiFetch<{ merchantId: number; settlementAccountNumber: string; apiKey: string }>(endpoints.gateway.merchants.onboard, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
