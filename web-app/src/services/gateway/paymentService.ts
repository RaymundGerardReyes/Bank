import { CreatePaymentIntentRequest, PaymentIntent, DynamicQrPayment } from '../../models/GatewayModels';
import { ApiResponse } from '../../models/ApiResponse';
import { httpClient } from '../api/httpClient';

export interface CheckoutSessionRequest {
  paymentIntentId: string;
  amount: number;
  currency: string;
  description: string;
  customerReference: string;
  successUrl: string;
  failUrl: string;
  cancelUrl: string;
  merchantOrderId: string;
}

export interface PaymentSessionResponse {
  paymentIntentId: string;
  provider: string;
  checkoutType: 'HOSTED' | 'API';
  checkoutUrl: string;
  expiresAt: string;
  transactionReference: string;
}

export const paymentService = {
  // Triggers the ExternalPaymentGateway logic on the backend
  createCheckoutSession: async (
    intentId: string,
    payload: CheckoutSessionRequest,
    idempotencyKey?: string
  ): Promise<ApiResponse<PaymentSessionResponse>> => {
    return httpClient.post<ApiResponse<PaymentSessionResponse>>(
      `/gateway/payments/${intentId}/checkout`,
      payload,
      { idempotencyKey }
    );
  },

  getPaymentIntent: async (intentId: string): Promise<ApiResponse<PaymentIntent>> => {
    return httpClient.get<ApiResponse<PaymentIntent>>(`/gateway/payments/${intentId}`);
  },

  getPayment: async (intentId: string): Promise<ApiResponse<PaymentIntent>> => {
    return httpClient.get<ApiResponse<PaymentIntent>>(`/gateway/payments/${intentId}`);
  },

  createPaymentIntent: async (req: CreatePaymentIntentRequest): Promise<ApiResponse<PaymentSessionResponse>> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (req.idempotencyKey) {
      headers['Idempotency-Key'] = req.idempotencyKey;
    } else {
      console.warn('[PaymentService] Missing Idempotency-Key in request payload! This may cause backend rejection.');
    }

    const response = await fetch('/api/proxy/gateway/payments/intents', {
      method: 'POST',
      headers,
      body: JSON.stringify(req),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    return response.json();
  },

  listPayments: async (): Promise<ApiResponse<PaymentIntent[]>> => {
    return httpClient.get<ApiResponse<PaymentIntent[]>>('/gateway/payments');
  },

  generateQr: async (intentId: string): Promise<ApiResponse<DynamicQrPayment>> => {
    return httpClient.post<ApiResponse<DynamicQrPayment>>(`/gateway/qr-payments/generate`, { intentId });
  },

  getQrStatus: async (qrRef: string): Promise<ApiResponse<DynamicQrPayment>> => {
    return httpClient.get<ApiResponse<DynamicQrPayment>>(`/gateway/qr-payments/${qrRef}`);
  }
};