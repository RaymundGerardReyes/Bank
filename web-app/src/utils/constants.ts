export const API_ENDPOINTS = {
  AUTH_LOGIN: "/auth/login",
  AUTH_REFRESH: "/auth/refresh",
  AUTH_LOGOUT: "/auth/logout",
  AUTH_OTP: "/auth/otp",
  AUTH_FORGOT_PASSWORD: "/auth/forgot-password",
  AUTH_RESET_PASSWORD: "/auth/reset-password",
  ACCOUNTS: "/accounts",
  TRANSFERS_INTERNAL: "/transfers/internal",
  TRANSACTIONS_DEPOSIT: "/transactions/deposit",
  TRANSACTIONS_WITHDRAW: "/transactions/withdraw",
  TRANSACTIONS_EXTERNAL: "/transactions/external-payment",
  STATEMENTS: "/statements",
  PRODUCTS: "/products",
  ADMIN_AUDIT: "/admin/audit",
  ADMIN_STATUS: "/admin/account-status",

  // --- GATEWAY: Payment Intents ---
  GATEWAY_PAYMENTS: "/gateway/payments",
  GATEWAY_PAYMENT_BY_ID: (id: string) => `/gateway/payments/${id}`,
  GATEWAY_PAYMENT_AUTHORIZE: (id: string) => `/gateway/payments/${id}/authorize`,
  GATEWAY_PAYMENT_CAPTURE: (id: string) => `/gateway/payments/${id}/capture`,
  GATEWAY_PAYMENT_REFUND: (id: string) => `/gateway/payments/${id}/refund`,

  // --- GATEWAY: QR Ph P2M ---
  GATEWAY_QR_GENERATE: (intentId: string) => `/gateway/payment-intents/${intentId}/qr`,
  GATEWAY_QR_STATUS: (qrRef: string) => `/gateway/payment-intents/qr/${qrRef}/status`,

  // --- GATEWAY: Merchants & Developers ---
  GATEWAY_DEVELOPER_ONBOARD: "/developer/setup/onboard",
  GATEWAY_MERCHANTS: "/gateway/merchants",
  GATEWAY_MERCHANT_BY_ID: (id: string) => `/gateway/merchants/${id}`,
  GATEWAY_MERCHANT_ADVANCE: (id: string) => `/gateway/merchants/${id}/advance`,

  // --- GATEWAY: Settlement ---
  GATEWAY_SETTLEMENTS: "/gateway/settlements",
  GATEWAY_SETTLEMENT_WINDOWS: "/gateway/settlement-windows",
  GATEWAY_SETTLEMENT_EXCEPTIONS: "/gateway/settlement-exceptions",
  GATEWAY_SETTLEMENT_EXCEPTION_RESOLVE: (id: string) => `/gateway/settlement-exceptions/${id}/resolve`,

  // --- GATEWAY: Fraud ---
  GATEWAY_FRAUD_CASES: "/gateway/fraud-cases",
  GATEWAY_FRAUD_CASE_BY_ID: (id: string) => `/gateway/fraud-cases/${id}`,

  // --- GATEWAY: Complaints ---
  GATEWAY_COMPLAINTS: "/gateway/complaints",
  GATEWAY_COMPLAINT_RESOLVE: (ref: string) => `/gateway/complaints/${ref}/resolve`,

  // --- GOVERNANCE: Compliance ---
  GOVERNANCE_REQUIREMENTS: "/governance/regulatory-requirements",
  GOVERNANCE_EVIDENCE: "/governance/compliance-evidence",
  GOVERNANCE_GENERATE_EVIDENCE: (reqId: string) => `/governance/regulatory-requirements/${reqId}/evidence`,
} as const;

export const SESSION_COOKIE_NAME = "bank_session";
export const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
