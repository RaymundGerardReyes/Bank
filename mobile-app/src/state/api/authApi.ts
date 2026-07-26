import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ENV } from '../../config/env';
import { ApiResponse } from '../../models/ApiResponse';
import { LoginResponse, User } from '../../models/User';
import { tokenStorageService } from '../../services/auth/tokenStorageService';

export const authApi = createApi({
  reducerPath: 'authApi',
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
    login: builder.mutation<ApiResponse<LoginResponse>, { username: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getCurrentUser: builder.query<ApiResponse<User>, void>({
      query: () => '/customers/me',
    }),
  }),
});

export const { useLoginMutation, useGetCurrentUserQuery } = authApi;
