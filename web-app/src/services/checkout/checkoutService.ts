import { ApiResponse } from '../../models/ApiResponse';
import httpClient from '../api/httpClient';

export type PaymentMethod = 'INTERNAL_ACCOUNT' | 'QR_PH' | 'CARD' | 'EWALLET' | 'QR' | 'ONLINE_BANKING' | 'CASH_OTC';

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

export interface PublicCheckoutSession {
    id: string;
    status: "ACTIVE" | "PAYMENT_PENDING" | "AUTHORIZED" | "PAID" | "PAYMENT_FAILED" | "EXPIRED" | "CANCELLED" | string;
    merchantName?: string;
    amount: number;
    currency: string;
    description?: string;
    paymentMethods?: string[];
    selectedPaymentMethod?: string;
    qrReference?: string;
    qrPayload?: string;
    qrStatus?: string;
    qrExpiresAt?: string;
    expiresAt?: string;
    returnUrl?: string;
    cancelUrl?: string;
    locked?: boolean;
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
    },

    // Retrieves the safe, sanitized public session data
    // Calls the Spring Boot API directly via Nginx gateway, bypassing Next.js BFF
    async getSessionDetails(sessionId: string): Promise<ApiResponse<PublicCheckoutSession>> {
        return httpClient.get<ApiResponse<PublicCheckoutSession>>(`/api/v1/checkout/sessions/${sessionId}`);
    },

    // Advances state from ACTIVE -> PAYMENT_PENDING
    async selectPaymentMethod(sessionId: string, payload: { paymentMethod: string }) {
        return httpClient.post<ApiResponse<any>>(`/api/v1/checkout/sessions/${sessionId}/payment-method`, payload);
    },

    // Advances state from PAYMENT_PENDING -> AUTHORIZED
    async authorizeAccount(sessionId: string, payload: { customerAccountNumber: string }) {
        return httpClient.post<ApiResponse<any>>(`/api/v1/checkout/sessions/${sessionId}/authorize`, payload);
    },

    // Advances state from AUTHORIZED -> PAID (Triggers the actual financial capture)
    async confirmPayment(sessionId: string) {
        return httpClient.post<ApiResponse<any>>(`/api/v1/checkout/sessions/${sessionId}/confirm`);
    },

    // Simulates customer scanning and completing QR Ph payment
    async simulateQrPayment(sessionId: string) {
        return httpClient.post<ApiResponse<any>>(`/api/v1/checkout/sessions/${sessionId}/qr/simulate-pay`);
    }
};