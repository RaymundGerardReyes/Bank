import { ApiResponse } from '../../models/ApiResponse';
import httpClient from '../api/httpClient';

export type PaymentMethod = 'CARD' | 'EWALLET' | 'QR' | 'ONLINE_BANKING' | 'CASH_OTC';

export interface SessionValidationResponse {
    valid: boolean;
    sessionId: string;
    institutionName: string;
    institutionReference: string;
    customerReference?: string;
    amount: number;
    currency: string;
    expiresAt: string;
    status: string;
}

export interface InitiatePaymentRequest {
    paymentMethod: PaymentMethod;
}

export interface PaymentInitiationResponse {
    attemptId?: string;
    checkoutUrl?: string;
    expiresAt?: string;
    reference?: string;
    instructions?: string;
}

export interface PaymentSessionStatusResponse {
    sessionId: string;
    status: string;
}

export const checkoutService = {
    /**
     * Validates the integrity, expiry, and state of a payment session on page load.
     */
    async validateSession(sessionId: string): Promise<SessionValidationResponse> {
        const res = await httpClient.get<ApiResponse<SessionValidationResponse>>(
            `/payment-sessions/${sessionId}/validate`
        );
        return res.data;
    },

    /**
     * Dispatches the selected payment method to the router and receives the checkout URL or instructions.
     */
    async initiatePayment(sessionId: string, method: PaymentMethod): Promise<PaymentInitiationResponse> {
        const res = await httpClient.post<ApiResponse<PaymentInitiationResponse>>(
            `/payment-sessions/${sessionId}/initiate`,
            { paymentMethod: method }
        );
        return res.data;
    },

    /**
     * Lightweight endpoint specifically designed for polling the active state of the session.
     */
    async getSessionStatus(sessionId: string): Promise<PaymentSessionStatusResponse> {
        const res = await httpClient.get<ApiResponse<PaymentSessionStatusResponse>>(
            `/payment-sessions/${sessionId}/status`
        );
        return res.data;
    }
};