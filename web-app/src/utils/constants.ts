export const API_ENDPOINTS = {
  AUTH_LOGIN: "/auth/login",
  AUTH_REFRESH: "/auth/refresh",
  AUTH_LOGOUT: "/auth/logout",
  AUTH_OTP: "/auth/otp",
  ACCOUNTS: "/accounts",
  TRANSFERS_INTERNAL: "/transfers/internal",
  TRANSACTIONS_DEPOSIT: "/transactions/deposit",
  TRANSACTIONS_WITHDRAW: "/transactions/withdraw",
  TRANSACTIONS_EXTERNAL: "/transactions/external-payment",
  STATEMENTS: "/statements",
  PRODUCTS: "/products",
  ADMIN_AUDIT: "/admin/audit",
  ADMIN_STATUS: "/admin/account-status",
} as const;

export const SESSION_COOKIE_NAME = "bank_session";
export const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
