import { apiFetch } from "@/services/api/httpClient";
import { ApiResponse, Statement } from "@/models/ApiResponse";
import { endpoints } from "@/services/api/endpoints";

export const statementService = {
  getStatements: async (accountNumber: string): Promise<ApiResponse<Statement[]>> => {
    return apiFetch<ApiResponse<Statement[]>>(endpoints.statements.byAccount(accountNumber));
  },
};
