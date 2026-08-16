import { ApiResponse, Transaction } from "@/models/ApiResponse";
import { endpoints } from "@/services/api/endpoints";
import { apiFetch } from "@/services/api/httpClient";
import { idempotencyKeyService } from "./idempotencyKeyService";
import { TransactionResult } from "@/models/TransactionTypes";

export interface InternalTransferPayload {
  sourceAccountNumber: string;
  recipientAccountNumber: string;
  amount: number;
  description?: string;
  scheduledDate?: string;
  idempotencyKey?: string;
  assertion?: any; // WebAuthn AuthenticationResponseJSON
}

export interface DepositPayload {
  accountNumber: string;
  amount: number;
  description?: string;
  idempotencyKey?: string;
}

export interface WithdrawPayload {
  accountNumber: string;
  amount: number;
  idempotencyKey?: string;
}

export interface ExternalPaymentPayload {
  sourceAccountNumber: string;
  routingNumber: string;
  recipientAccountNumber: string;
  recipientName: string;
  amount: number;
  idempotencyKey?: string;
  assertion?: any;
}

export interface QrPhPaymentPayload {
  sourceAccountNumber: string;
  qrPayload: string;
  amount: number;
  idempotencyKey?: string;
  assertion?: any;
}

export function normalizeTransactionResult(response: any): TransactionResult {
  // Safe default for network/unhandled errors
  if (!response || !response.success) {
    const errorCode = response?.error || "SERVICE_UNAVAILABLE";
    
    // Phase C: If it's a network timeout or completely unhandled service crash, transition to UNKNOWN instead of FAILED
    const isNetworkUncertainty = 
      errorCode === "SERVICE_UNAVAILABLE" || 
      errorCode === "NETWORK_TIMEOUT" ||
      errorCode === "UNKNOWN_ERROR";

    return {
      status: isNetworkUncertainty ? "UNKNOWN" : "FAILED",
      failureCode: errorCode,
      failureMessage: response?.message || "Transaction failed or service unavailable.",
    };
  }

  // Map valid responses
  const data = response.data || {};
  const status = (data.status === "COMPLETED" ? "SUCCESS" : data.status) || "SUCCESS";
  
  return {
    status: status as "SUCCESS" | "PENDING" | "FAILED",
    transactionReference: data.transactionReference,
    processedAt: data.processedAt || new Date().toISOString(),
  };
}

export const transactionService = {
  // Phase D: Request WebAuthn challenge for transaction intent
  createTransactionChallenge: async (intentPayload: any): Promise<any> => {
    // In production, this calls the backend (e.g., POST /auth/webauthn/transaction-challenge)
    // For now, we return a mocked PublicKeyCredentialRequestOptionsJSON
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          challenge: "mock-cryptographic-challenge-string",
          timeout: 60000,
          rpId: window.location.hostname,
          allowCredentials: [],
          userVerification: "required",
        });
      }, 500);
    });
  },

  transferInternal: async (payload: InternalTransferPayload): Promise<ApiResponse<Transaction>> => {
    const key = payload.idempotencyKey || idempotencyKeyService.generateKey();

    // ADAPTER: Map frontend UI fields to exact Spring Boot DTO fields
    const backendPayload = {
      sourceAccountNumber: payload.sourceAccountNumber,
      destinationAccountNumber: payload.recipientAccountNumber, // Mapped field
      amount: payload.amount,
      description: payload.description,
      scheduledDate: payload.scheduledDate,
      idempotencyKey: key,
      assertion: payload.assertion, // Phase D: Send signed assertion
    };

    return apiFetch<ApiResponse<Transaction>>(endpoints.transfers.internal, {
      method: "POST",
      body: JSON.stringify(backendPayload),
      idempotencyKey: key,
    });
  },

  deposit: async (payload: DepositPayload | string, amount?: number, description?: string): Promise<ApiResponse<Transaction>> => {
    let body: any;
    let key: string;
    if (typeof payload === "object") {
      body = payload;
      key = payload.idempotencyKey || idempotencyKeyService.generateKey();
    } else {
      body = { accountNumber: payload, amount, description };
      key = idempotencyKeyService.generateKey();
    }

    return apiFetch<ApiResponse<Transaction>>(endpoints.transactions.deposit, {
      method: "POST",
      body: JSON.stringify(body),
      idempotencyKey: key,
    });
  },

  withdraw: async (payload: WithdrawPayload): Promise<ApiResponse<Transaction>> => {
    const key = payload.idempotencyKey || idempotencyKeyService.generateKey();
    return apiFetch<ApiResponse<Transaction>>(endpoints.transactions.withdraw, {
      method: "POST",
      body: JSON.stringify(payload),
      idempotencyKey: key,
    });
  },

  externalPayment: async (payload: ExternalPaymentPayload): Promise<ApiResponse<Transaction>> => {
    const key = payload.idempotencyKey || idempotencyKeyService.generateKey();

    // ADAPTER: Map frontend UI fields to exact Spring Boot DTO fields
    const backendPayload = {
      sourceAccountNumber: payload.sourceAccountNumber,
      routingNumber: payload.routingNumber,
      destinationAccountNumber: payload.recipientAccountNumber, // Mapped field
      description: `Wire to ${payload.recipientName}`, // Merged field for backend logging
      amount: payload.amount,
      idempotencyKey: key,
      assertion: payload.assertion, // Phase D
    };

    return apiFetch<ApiResponse<Transaction>>(endpoints.transactions.externalPayment, {
      method: "POST",
      body: JSON.stringify(backendPayload),
      idempotencyKey: key,
    });
  },

  qrPhPayment: async (payload: QrPhPaymentPayload): Promise<ApiResponse<Transaction>> => {
    // Generate idempotency key if not provided
    const key = payload.idempotencyKey || idempotencyKeyService.generateKey();
    
    // As per the plan, if the endpoint doesn't exist yet, we fail cleanly
    // rather than falling back to externalPayment.
    return Promise.reject(new Error("QR Ph integration unavailable"));
  },

  getHistory: async (accountNumber: string, page = 0, size = 10): Promise<ApiResponse<{ content: Transaction[] }>> => {
    return apiFetch<ApiResponse<{ content: Transaction[] }>>(
      `${endpoints.transactions.history(accountNumber)}?page=${page}&size=${size}`, 
      { method: "GET" }
    );
  },
};