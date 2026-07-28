import { ApiResponse } from '../../models/ApiResponse';
import { LoginResponse } from '../../models/User';
import { apiClient } from '../api/apiClient';

export const faceAuthService = {
    /**
     * Sends the 512-D face embedding to Spring Boot for verification.
     * Matches the POST /api/auth/verify-face architecture requirement.
     */
    verifyFace: async (embedding: number[]): Promise<LoginResponse> => {
        const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/verify-face', {
            embedding: embedding, // The mathematical vector, NOT an image
        });
        return response.data.data;
    },

    /**
     * Sends the 512-D face embedding to Spring Boot for initial enrollment.
     * Matches the POST /api/auth/register-face architecture requirement.
     */
    registerFace: async (embedding: number[]): Promise<boolean> => {
        const response = await apiClient.post<ApiResponse<boolean>>('/auth/register-face', {
            embedding: embedding,
        });
        return response.data.success;
    }
};