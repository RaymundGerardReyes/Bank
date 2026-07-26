import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';
import { ApiResponse } from '../../models/ApiResponse';
import {
  Transaction,
  InternalTransferRequest,
  DepositRequest,
  WithdrawRequest,
  ExternalPaymentRequest,
} from '../../models/Transaction';

export const transactionService = {
  transferInternal: async (request: InternalTransferRequest): Promise<Transaction> => {
    const response = await apiClient.post<ApiResponse<Transaction>>(
      ENDPOINTS.TRANSACTIONS.TRANSFER_INTERNAL,
      request
    );
    return response.data.data;
  },

  deposit: async (request: DepositRequest): Promise<Transaction> => {
    const response = await apiClient.post<ApiResponse<Transaction>>(
      ENDPOINTS.TRANSACTIONS.DEPOSIT,
      request
    );
    return response.data.data;
  },

  withdraw: async (request: WithdrawRequest): Promise<Transaction> => {
    const response = await apiClient.post<ApiResponse<Transaction>>(
      ENDPOINTS.TRANSACTIONS.WITHDRAW,
      request
    );
    return response.data.data;
  },

  externalPayment: async (request: ExternalPaymentRequest): Promise<Transaction> => {
    const response = await apiClient.post<ApiResponse<Transaction>>(
      ENDPOINTS.TRANSACTIONS.EXTERNAL_PAYMENT,
      request
    );
    return response.data.data;
  },

  getTransactionHistory: async (accountNumber: string): Promise<Transaction[]> => {
    const response = await apiClient.get<ApiResponse<Transaction[]>>(
      ENDPOINTS.TRANSACTIONS.HISTORY(accountNumber)
    );
    return response.data.data;
  },
};
