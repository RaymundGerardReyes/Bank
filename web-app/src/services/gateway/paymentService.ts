// Pattern: mirrors authService.ts — named object export, calls apiFetch, typed with ApiResponse<T>
import { apiFetch } from "@/services/api/httpClient";
import { ApiResponse } from "@/models/ApiResponse";
import { DynamicQrPayment, PaymentIntent, Refund } from "@/models/GatewayModels";
import { endpoints } from "@/services/api/endpoints";

export const paymentService = {
  listPayments: async (): Promise<ApiResponse<PaymentIntent[]>> => {
    return apiFetch<ApiResponse<PaymentIntent[]>>(endpoints.gateway.payments.list);
  },

  getPayment: async (intentId: string): Promise<ApiResponse<PaymentIntent>> => {
    return apiFetch<ApiResponse<PaymentIntent>>(endpoints.gateway.payments.byId(intentId));
  },

  authorizeIntent: async (intentId: string): Promise<ApiResponse<PaymentIntent>> => {
    return apiFetch<ApiResponse<PaymentIntent>>(endpoints.gateway.payments.authorize(intentId), {
      method: "POST",
    });
  },

  captureIntent: async (intentId: string): Promise<ApiResponse<PaymentIntent>> => {
    return apiFetch<ApiResponse<PaymentIntent>>(endpoints.gateway.payments.capture(intentId), {
      method: "POST",
    });
  },

  refundIntent: async (
    intentId: string,
    amount: number,
    reason: string
  ): Promise<ApiResponse<Refund>> => {
    return apiFetch<ApiResponse<Refund>>(endpoints.gateway.payments.refund(intentId), {
      method: "POST",
      body: JSON.stringify({ amount, reason }),
      idempotencyKey: crypto.randomUUID(),
    });
  },

  generateQr: async (intentId: string): Promise<ApiResponse<DynamicQrPayment>> => {
    return apiFetch<ApiResponse<DynamicQrPayment>>(endpoints.gateway.qr.generate(intentId), {
      method: "POST",
    });
  },

  getQrStatus: async (qrReference: string): Promise<ApiResponse<DynamicQrPayment>> => {
    return apiFetch<ApiResponse<DynamicQrPayment>>(endpoints.gateway.qr.status(qrReference));
  },
};
