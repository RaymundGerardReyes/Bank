import { Account, ApiResponse } from "@/models/ApiResponse";
import { endpoints } from "@/services/api/endpoints";
import { apiFetch } from "@/services/api/httpClient";

export const accountService = {
  getAccounts: async (): Promise<ApiResponse<Account[]>> => {
    return apiFetch<ApiResponse<Account[]>>(endpoints.accounts.list);
  },
  getAccountById: async (id: string): Promise<ApiResponse<Account>> => {
    return apiFetch<ApiResponse<Account>>(endpoints.accounts.byId(id));
  },
  // --- NEW: Enterprise VAM Sub-Account Creation ---
  openAccount: async (payload: { customerId: number; currency: string; initialDeposit: number; accountType: string }): Promise<ApiResponse<Account>> => {
    return apiFetch<ApiResponse<Account>>(endpoints.accounts.list, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};