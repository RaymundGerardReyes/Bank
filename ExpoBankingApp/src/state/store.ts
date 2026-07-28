import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import accountReducer from './accountSlice';
import transactionReducer from './transactionSlice';
import uiReducer from './uiSlice';
import { authApi } from './api/authApi';
import { accountApi } from './api/accountApi';
import { transactionApi } from './api/transactionApi';
import { statementApi } from './api/statementApi';
import { productApi } from './api/productApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountReducer,
    transaction: transactionReducer,
    ui: uiReducer,
    [authApi.reducerPath]: authApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [statementApi.reducerPath]: statementApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      accountApi.middleware,
      transactionApi.middleware,
      statementApi.middleware,
      productApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
