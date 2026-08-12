import { apiFetch } from "@/services/api/httpClient";
import { ApiResponse } from "@/models/ApiResponse";
import { FraudCase } from "@/models/GatewayModels";
import { endpoints } from "@/services/api/endpoints";

export const fraudService = {
  listCases: async (): Promise<ApiResponse<FraudCase[]>> => {
    return apiFetch<ApiResponse<FraudCase[]>>(endpoints.gateway.fraud.list);
  },

  getCase: async (caseId: string): Promise<ApiResponse<FraudCase>> => {
    return apiFetch<ApiResponse<FraudCase>>(endpoints.gateway.fraud.byId(caseId));
  },
};
