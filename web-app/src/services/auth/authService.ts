import { apiFetch } from "@/services/api/httpClient";
import { ApiResponse, UserProfile } from "@/models/ApiResponse";
import { endpoints } from "@/services/api/endpoints";

export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<UserProfile>> => {
    return apiFetch<ApiResponse<UserProfile>>(endpoints.auth.login, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async (): Promise<ApiResponse<void>> => {
    return apiFetch<ApiResponse<void>>(endpoints.auth.logout, {
      method: "POST",
    });
  },
};
