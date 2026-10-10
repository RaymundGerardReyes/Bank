import { ApiResponse } from '../../models/ApiResponse';
import { Institution } from '../../models/Institution';
import {
  DepositRequest,
  ExternalPaymentRequest,
  InternalTransferRequest,
  Transaction,
  WithdrawRequest,
} from '../../models/Transaction';
import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';

export const transactionService = {
  getInstitutions: async (rail?: string): Promise<Institution[]> => {
    const response = await apiClient.get<ApiResponse<Institution[]>>(
      ENDPOINTS.TRANSACTIONS.INSTITUTIONS(rail)
    );
    return response.data?.data || [];
  },
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
    // We use <any> here to bypass strict typing so we can unwrap the PagedResponse
    const response = await apiClient.get<any>(
      ENDPOINTS.TRANSACTIONS.HISTORY(accountNumber)
    );
    // Extract the 'content' array from Spring Boot's PagedResponse wrapper or direct array
    const data = response.data?.data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data)) return data;
    return [];
  },
};
