import { ApiResponse, Transaction } from "@/models/ApiResponse";
import { endpoints } from "@/services/api/endpoints";
import { apiFetch } from "@/services/api/httpClient";
import { idempotencyKeyService } from "./idempotencyKeyService";

export interface InternalTransferPayload {
  sourceAccountNumber: string;
  recipientAccountNumber: string;
  amount: number;
  description?: string;
  scheduledDate?: string;
  idempotencyKey?: string;
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
}

export const transactionService = {
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
    };

    return apiFetch<ApiResponse<Transaction>>(endpoints.transactions.externalPayment, {
      method: "POST",
      body: JSON.stringify(backendPayload),
      idempotencyKey: key,
    });
  },

  getHistory: async (accountNumber: string, page = 0, size = 10): Promise<ApiResponse<{ content: Transaction[] }>> => {
    return apiFetch<ApiResponse<{ content: Transaction[] }>>(
      `${endpoints.transactions.history(accountNumber)}?page=${page}&size=${size}`, 
      { method: "GET" }
    );
  },
};