export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    VERIFY_OTP: '/auth/verify-otp',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  CUSTOMERS: {
    REGISTER: '/customers',
    ME: '/customers/me',
    UPDATE_PROFILE: '/customers/profile',
  },
  ACCOUNTS: {
    BASE: '/accounts',
    OPEN: '/accounts',
    SUMMARY: '/accounts/summary',
    BY_NUMBER: (num: string) => `/accounts/${num}`,
    CHANGE_STATUS: (num: string) => `/accounts/${num}/status`,
  },
  TRANSACTIONS: {
    TRANSFER_INTERNAL: '/transfers/internal',
    DEPOSIT: '/transactions/deposit',
    WITHDRAW: '/transactions/withdraw',
    EXTERNAL_PAYMENT: '/transactions/external-payment',
    HISTORY: (accountNumber: string) => `/transactions/history/${accountNumber}`,
  },
  STATEMENTS: {
    GENERATE: '/statements/generate',
    BY_ACCOUNT: (accountNumber: string) => `/statements/account/${accountNumber}`,
  },
  PRODUCTS: {
    CATALOG: '/products',
  },
  ADMIN: {
    AUDIT_LOGS: '/admin/audit',
  },
};
