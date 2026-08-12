import { apiFetch } from "@/services/api/httpClient";
import { ApiResponse } from "@/models/ApiResponse";
import {
  SettlementException,
  SettlementInstruction,
  SettlementWindow,
} from "@/models/GatewayModels";
import { endpoints } from "@/services/api/endpoints";

export const settlementService = {
  listWindows: async (): Promise<ApiResponse<SettlementWindow[]>> => {
    return apiFetch<ApiResponse<SettlementWindow[]>>(endpoints.gateway.settlement.windows);
  },

  listInstructions: async (): Promise<ApiResponse<SettlementInstruction[]>> => {
    return apiFetch<ApiResponse<SettlementInstruction[]>>(endpoints.gateway.settlement.list);
  },

  listExceptions: async (): Promise<ApiResponse<SettlementException[]>> => {
    return apiFetch<ApiResponse<SettlementException[]>>(endpoints.gateway.settlement.exceptions);
  },

  resolveException: async (
    exceptionId: string,
    resolutionNote: string
  ): Promise<ApiResponse<SettlementException>> => {
    return apiFetch<ApiResponse<SettlementException>>(
      endpoints.gateway.settlement.resolveException(exceptionId),
      {
        method: "POST",
        body: JSON.stringify({ resolutionNote }),
      }
    );
  },
};
