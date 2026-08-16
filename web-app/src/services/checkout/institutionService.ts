import { ApiResponse } from '../../models/ApiResponse';
import httpClient from '../api/httpClient';

export interface CreateSessionRequest {
    institutionReference: string;
    customerReference?: string;
    amount: number;
    currency: string;
    description?: string;
    callbackUrl?: string;
}

export interface PaymentSessionApiResponse {
    sessionId: string;
    status: string;
    paymentUrl: string;
    expiresAt: string;
}

export const institutionService = {
    /**
     * Creates a new normalized Payment Session for an institution.
     */
    async createPaymentSession(institutionId: string, req: CreateSessionRequest): Promise<PaymentSessionApiResponse> {
        const res = await httpClient.post<ApiResponse<PaymentSessionApiResponse>>(
            `/institutions/${institutionId}/payment-sessions`,
            req
        );
        return res.data;
    },

    /**
     * Retrieves the current state of a payment session for the institution dashboard.
     */
    async getPaymentSession(institutionId: string, sessionId: string): Promise<PaymentSessionApiResponse> {
        const res = await httpClient.get<ApiResponse<PaymentSessionApiResponse>>(
            `/institutions/${institutionId}/payment-sessions/${sessionId}`
        );
        return res.data;
    }
};