import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ENV } from '../../config/env';
import { ApiResponse } from '../../models/ApiResponse';
import { Account, AccountSummary } from '../../models/Account';
import { tokenStorageService } from '../../services/auth/tokenStorageService';

export const accountApi = createApi({
  reducerPath: 'accountApi',
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
  tagTypes: ['Accounts'],
  endpoints: (builder) => ({
    getAccounts: builder.query<ApiResponse<AccountSummary[]>, void>({
      query: () => '/accounts',
      providesTags: ['Accounts'],
    }),
    getAccountByNumber: builder.query<ApiResponse<Account>, string>({
      query: (accountNumber) => `/accounts/${accountNumber}`,
    }),
    openAccount: builder.mutation<ApiResponse<Account>, { accountType: string; initialDeposit: number }>({
      query: (body) => ({
        url: '/accounts',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Accounts'],
    }),
  }),
});

export const { useGetAccountsQuery, useGetAccountByNumberQuery, useOpenAccountMutation } = accountApi;
