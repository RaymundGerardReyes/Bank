import { apiFetch } from "@/services/api/httpClient";
import { Account, ApiResponse } from "@/models/ApiResponse";
import { endpoints } from "@/services/api/endpoints";

export const accountService = {
  getAccounts: async (): Promise<ApiResponse<Account[]>> => {
    return apiFetch<ApiResponse<Account[]>>(endpoints.accounts.list);
  },

  getAccountById: async (id: string): Promise<ApiResponse<Account>> => {
    return apiFetch<ApiResponse<Account>>(endpoints.accounts.byId(id));
  },
};
