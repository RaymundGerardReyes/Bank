import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ENV } from '../../config/env';
import { ApiResponse } from '../../models/ApiResponse';
import { ExternalPaymentRequest, InternalTransferRequest, Transaction } from '../../models/Transaction';
import { tokenStorageService } from '../../services/auth/tokenStorageService';

export const transactionApi = createApi({
  reducerPath: 'transactionApi',
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
  tagTypes: ['Transactions'],
  endpoints: (builder) => ({
    getTransactionHistory: builder.query<ApiResponse<Transaction[]>, string>({
      query: (accountNumber) => `/transactions/history/${accountNumber}`,
      providesTags: ['Transactions'],
      transformResponse: (response: any) => {
        // Map Spring Boot's PagedResponse content to the standard array expected by the frontend
        return {
          ...response,
          data: response.data?.content || [],
        };
      },
    }),
    transferInternal: builder.mutation<ApiResponse<Transaction>, InternalTransferRequest>({
      query: (body) => ({
        url: '/transfers/internal',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Transactions'],
    }),
    externalPayment: builder.mutation<ApiResponse<Transaction>, ExternalPaymentRequest>({
      query: (body) => ({
        url: '/transactions/external-payment',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Transactions'],
    }),
  }),
});

export const { useGetTransactionHistoryQuery, useTransferInternalMutation, useExternalPaymentMutation } = transactionApi;
