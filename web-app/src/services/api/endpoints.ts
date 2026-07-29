import { API_ENDPOINTS } from "@/utils/constants";

export const endpoints = {
  auth: {
    login: API_ENDPOINTS.AUTH_LOGIN,
    refresh: API_ENDPOINTS.AUTH_REFRESH,
    logout: API_ENDPOINTS.AUTH_LOGOUT,
    otp: API_ENDPOINTS.AUTH_OTP,
  },
  accounts: {
    list: API_ENDPOINTS.ACCOUNTS,
    byId: (id: string) => `${API_ENDPOINTS.ACCOUNTS}/${id}`,
  },
  transfers: {
    internal: API_ENDPOINTS.TRANSFERS_INTERNAL,
  },
  transactions: {
    deposit: API_ENDPOINTS.TRANSACTIONS_DEPOSIT,
    withdraw: API_ENDPOINTS.TRANSACTIONS_WITHDRAW,
    externalPayment: API_ENDPOINTS.TRANSACTIONS_EXTERNAL,
    history: (accountNumber: string) => `/transactions/history/${accountNumber}`,
  },
  statements: {
    byAccount: (accountNumber: string) => `/statements/account/${accountNumber}`,
  },
  products: API_ENDPOINTS.PRODUCTS,
  admin: {
    audit: API_ENDPOINTS.ADMIN_AUDIT,
    status: API_ENDPOINTS.ADMIN_STATUS,
  },
};
