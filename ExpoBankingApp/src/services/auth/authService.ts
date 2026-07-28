import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';
import { ApiResponse } from '../../models/ApiResponse';
import { LoginResponse, User } from '../../models/User';
import { tokenStorageService } from './tokenStorageService';

export const authService = {
  login: async (username: string, passwordHash: string): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(ENDPOINTS.AUTH.LOGIN, {
      email: username,
      password: passwordHash,
    });
    const data = response.data.data;
    await tokenStorageService.saveTokens(data.token, data.refreshToken);
    return data;
  },

  verifyOtp: async (otpCode: string): Promise<boolean> => {
    const response = await apiClient.post<ApiResponse<boolean>>(ENDPOINTS.AUTH.VERIFY_OTP, {
      code: otpCode,
    });
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Ignore network failure on logout
    } finally {
      await tokenStorageService.clearTokens();
    }
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(ENDPOINTS.CUSTOMERS.ME);
    return response.data.data;
  },
};
