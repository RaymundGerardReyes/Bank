import { ApiResponse } from '../../models/ApiResponse';
import { LoginResponse } from '../../models/User';
import { apiClient } from '../api/apiClient';

export interface DeviceChallengeData {
    challenge: string;
    expiresAt: string;
    serverTime: string;
}

export interface DeviceStatusData {
    deviceId: string;
    status: string;
    deviceModel?: string;
    enrolledAt?: string;
    lastUsedAt?: string;
}

export const faceAuthService = {
    /**
     * Requests an unpredictable, single-use authentication challenge from Spring Boot.
     */
    requestChallenge: async (deviceId: string, purpose = 'BIOMETRIC_LOGIN'): Promise<DeviceChallengeData> => {
        const response = await apiClient.post<ApiResponse<DeviceChallengeData>>('/auth/challenge', {
            deviceId,
            purpose,
        });
        return response.data.data;
    },

    /**
     * Submits a signed cryptographic challenge to authenticate and obtain an authorized JWT session.
     */
    loginWithDevice: async (
        deviceId: string,
        challenge: string,
        signature: string
    ): Promise<LoginResponse> => {
        const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/device/login', {
            deviceId,
            challenge,
            signature,
        });
        return response.data.data;
    },

    /**
     * Registers a new device public key bound to the currently authenticated customer.
     */
    registerDevice: async (
        deviceId: string,
        publicKey: string,
        algorithm = 'SHA256withECDSA',
        deviceModel?: string
    ): Promise<boolean> => {
        const response = await apiClient.post<ApiResponse<void>>('/auth/device/register', {
            deviceId,
            publicKey,
            algorithm,
            deviceModel,
        });
        return response.data.success;
    },

    /**
     * Revokes a registered device credential.
     */
    revokeDevice: async (deviceId: string): Promise<boolean> => {
        const response = await apiClient.post<ApiResponse<void>>('/auth/device/revoke', {
            deviceId,
        });
        return response.data.success;
    },

    /**
     * Fetches current authorization status for a device.
     */
    getDeviceStatus: async (deviceId: string): Promise<DeviceStatusData> => {
        const response = await apiClient.get<ApiResponse<DeviceStatusData>>(`/auth/device/${encodeURIComponent(deviceId)}/status`);
        return response.data.data;
    },

    /**
     * Backward-compatible face verification adapter routing through verified cryptographic proof.
     */
    verifyFace: async (
        embedding?: number[],
        email?: string,
        deviceProof?: { deviceId: string; challenge: string; signature: string }
    ): Promise<LoginResponse> => {
        if (deviceProof) {
            return faceAuthService.loginWithDevice(
                deviceProof.deviceId,
                deviceProof.challenge,
                deviceProof.signature
            );
        }

        const payload: Record<string, any> = {};
        if (embedding && embedding.length > 0) payload.embedding = embedding;
        if (email && email.trim() !== '') payload.email = email.trim().toLowerCase();

        const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/verify-face', payload);
        return response.data.data;
    },
};