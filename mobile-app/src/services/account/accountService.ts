import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';
import { ApiResponse } from '../../models/ApiResponse';
import { Account, AccountSummary } from '../../models/Account';

export const accountService = {
  getAccounts: async (): Promise<AccountSummary[]> => {
    const response = await apiClient.get<ApiResponse<AccountSummary[]>>(ENDPOINTS.ACCOUNTS.BASE);
    return response.data.data;
  },

  getAccountByNumber: async (accountNumber: string): Promise<Account> => {
    const response = await apiClient.get<ApiResponse<Account>>(ENDPOINTS.ACCOUNTS.BY_NUMBER(accountNumber));
    return response.data.data;
  },

  openAccount: async (accountType: string, initialDeposit: number): Promise<Account> => {
    const response = await apiClient.post<ApiResponse<Account>>(ENDPOINTS.ACCOUNTS.OPEN, {
      accountType,
      initialDeposit,
    });
    return response.data.data;
  },

  changeAccountStatus: async (accountNumber: string, status: string): Promise<Account> => {
    const response = await apiClient.put<ApiResponse<Account>>(ENDPOINTS.ACCOUNTS.CHANGE_STATUS(accountNumber), {
      status,
    });
    return response.data.data;
  },
};
