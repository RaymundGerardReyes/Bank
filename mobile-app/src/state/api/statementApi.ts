import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ENV } from '../../config/env';
import { ApiResponse } from '../../models/ApiResponse';
import { Statement } from '../../models/Statement';
import { tokenStorageService } from '../../services/auth/tokenStorageService';

export const statementApi = createApi({
  reducerPath: 'statementApi',
  baseQuery: fetchBaseQuery({
    baseUrl: ENV.API_BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await tokenStorageService.getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getStatements: builder.query<ApiResponse<Statement[]>, string>({
      query: (accountNumber) => `/statements/account/${accountNumber}`,
    }),
  }),
});

export const { useGetStatementsQuery } = statementApi;
