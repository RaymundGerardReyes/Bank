import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ENV } from '../../config/env';
import { ApiResponse } from '../../models/ApiResponse';
import { Product } from '../../models/Product';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: ENV.API_BASE_URL,
  }),
  endpoints: (builder) => ({
    getProducts: builder.query<ApiResponse<Product[]>, void>({
      query: () => '/products',
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
