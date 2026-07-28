import { apiClient } from '../api/apiClient';
import { ENDPOINTS } from '../api/endpoints';
import { ApiResponse } from '../../models/ApiResponse';
import { Statement } from '../../models/Statement';

export const statementService = {
  getStatementsForAccount: async (accountNumber: string): Promise<Statement[]> => {
    const response = await apiClient.get<ApiResponse<Statement[]>>(
      ENDPOINTS.STATEMENTS.BY_ACCOUNT(accountNumber)
    );
    return response.data.data;
  },

  generateStatement: async (accountNumber: string, startDate: string, endDate: string): Promise<Statement> => {
    const response = await apiClient.post<ApiResponse<Statement>>(
      ENDPOINTS.STATEMENTS.GENERATE,
      { accountNumber, startDate, endDate }
    );
    return response.data.data;
  },
};
