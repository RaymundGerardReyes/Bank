import { API_ENDPOINTS } from "@/utils/constants";

export const endpoints = {
  auth: {
    login: API_ENDPOINTS.AUTH_LOGIN,
    refresh: API_ENDPOINTS.AUTH_REFRESH,
    logout: API_ENDPOINTS.AUTH_LOGOUT,
    otp: API_ENDPOINTS.AUTH_OTP,
    forgotPassword: API_ENDPOINTS.AUTH_FORGOT_PASSWORD,
    resetPassword: API_ENDPOINTS.AUTH_RESET_PASSWORD,
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

  // --- GATEWAY: Payment Intents ---
  gateway: {
    payments: {
      list: API_ENDPOINTS.GATEWAY_PAYMENTS,
      byId: API_ENDPOINTS.GATEWAY_PAYMENT_BY_ID,
      authorize: API_ENDPOINTS.GATEWAY_PAYMENT_AUTHORIZE,
      capture: API_ENDPOINTS.GATEWAY_PAYMENT_CAPTURE,
      refund: API_ENDPOINTS.GATEWAY_PAYMENT_REFUND,
    },
    qr: {
      generate: API_ENDPOINTS.GATEWAY_QR_GENERATE,
      status: API_ENDPOINTS.GATEWAY_QR_STATUS,
    },
    merchants: {
      list: API_ENDPOINTS.GATEWAY_MERCHANTS,
      byId: API_ENDPOINTS.GATEWAY_MERCHANT_BY_ID,
      advance: API_ENDPOINTS.GATEWAY_MERCHANT_ADVANCE,
    },
    settlement: {
      list: API_ENDPOINTS.GATEWAY_SETTLEMENTS,
      windows: API_ENDPOINTS.GATEWAY_SETTLEMENT_WINDOWS,
      exceptions: API_ENDPOINTS.GATEWAY_SETTLEMENT_EXCEPTIONS,
      resolveException: API_ENDPOINTS.GATEWAY_SETTLEMENT_EXCEPTION_RESOLVE,
    },
    fraud: {
      list: API_ENDPOINTS.GATEWAY_FRAUD_CASES,
      byId: API_ENDPOINTS.GATEWAY_FRAUD_CASE_BY_ID,
    },
    complaints: {
      list: API_ENDPOINTS.GATEWAY_COMPLAINTS,
      resolve: API_ENDPOINTS.GATEWAY_COMPLAINT_RESOLVE,
    },
  },

  // --- GOVERNANCE: Compliance ---
  governance: {
    requirements: API_ENDPOINTS.GOVERNANCE_REQUIREMENTS,
    evidence: API_ENDPOINTS.GOVERNANCE_EVIDENCE,
    generateEvidence: API_ENDPOINTS.GOVERNANCE_GENERATE_EVIDENCE,
  },
};

