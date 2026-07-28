import { apiFetch } from "@/services/api/httpClient";
import { ApiResponse, Transaction } from "@/models/ApiResponse";
import { endpoints } from "@/services/api/endpoints";
import { idempotencyKeyService } from "./idempotencyKeyService";

export interface InternalTransferPayload {
  sourceAccountNumber: string;
  recipientAccountNumber: string;
  amount: number;
  description?: string;
}

export const transactionService = {
  transferInternal: async (payload: InternalTransferPayload): Promise<ApiResponse<Transaction>> => {
    const idempotencyKey = idempotencyKeyService.generateKey();
    return apiFetch<ApiResponse<Transaction>>(endpoints.transfers.internal, {
      method: "POST",
      body: JSON.stringify(payload),
      idempotencyKey,
    });
  },

  deposit: async (accountNumber: string, amount: number, description?: string): Promise<ApiResponse<Transaction>> => {
    const idempotencyKey = idempotencyKeyService.generateKey();
    return apiFetch<ApiResponse<Transaction>>(endpoints.transactions.deposit, {
      method: "POST",
      body: JSON.stringify({ accountNumber, amount, description }),
      idempotencyKey,
    });
  },
};
