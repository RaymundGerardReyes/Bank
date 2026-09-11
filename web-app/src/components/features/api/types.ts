export interface ApiKey {
  id: number;
  name: string;
  applicationId?: string | null;
  applicationName?: string | null;
  environment: "LIVE" | "SANDBOX";
  keyPrefix: string;
  maskedHash: string;
  rawKey?: string | null;
  cidrWhitelist: string;
  scopes: string[];
  linkedAccountId?: string | null;
  perTransactionLimit?: number | null;
  dailyLimit?: number | null;
  expiresAt: string;
  revokedAt?: string | null;
  lastUsedAt?: string | null;
  createdAt: string;
}

export interface MerchantStatus {
  hasMerchantProfile: boolean;
  verified: boolean;
  legalName?: string | null;
  merchantCode?: string | null;
  businessRegistrationNumber?: string | null;
  settlementAccountNumber?: string | null;
  status?: string | null;
  eligibleForLive: boolean;
}

export interface NewlyGeneratedKeyData {
  name: string;
  rawKey: string;
  environment: string;
  linkedAccountId?: string | null;
  scopes?: string[];
}

export interface OnboardingSuccessData {
  merchantId: number | string;
  settlementAccountNumber: string;
  apiKey: string;
  merchantCode: string;
  environment: "LIVE" | "SANDBOX";
  cidrWhitelist: string;
  scopes: string[];
  onboardingType: "DEVELOPER" | "MERCHANT";
  legalName: string;
  businessRegistrationNumber?: string;
}

export interface MerchantOnboardingFormProps {
  initialType?: "DEVELOPER" | "MERCHANT";
  initialEnvironment?: "LIVE" | "SANDBOX";
  onSuccess?: (data: OnboardingSuccessData) => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

export interface ScopeItem {
  id: string;
  label: string;
}

export interface ScopeGroup {
  domain: string;
  scopes: ScopeItem[];
}

export const SCOPE_GROUPS: ScopeGroup[] = [
  {
    domain: "Virtual Accounts & Sub-Ledgers (VAM)",
    scopes: [
      { id: "accounts:read", label: "Read Accounts & Balances" },
      { id: "accounts:write", label: "Create / Manage Accounts" },
    ],
  },
  {
    domain: "Treasury & Rail Routing",
    scopes: [
      { id: "treasury:read", label: "Read Transfers & Routes" },
      { id: "treasury:write", label: "Execute Interbank Transfers" },
    ],
  },
  {
    domain: "Payment Gateway Checkout",
    scopes: [
      { id: "payments:write", label: "Process Card / QR Checkout" },
    ],
  },
  {
    domain: "Payroll & Batch Disbursement",
    scopes: [
      { id: "payroll:read", label: "Read Payroll Schedules" },
      { id: "payroll:write", label: "Dispatch Batch Payroll" },
    ],
  },
  {
    domain: "Ledger Parity & Journal",
    scopes: [
      { id: "ledger:read", label: "Read Double-Entry Journal" },
      { id: "ledger:write", label: "Post Manual Journal Adjustments" },
    ],
  },
  {
    domain: "Fraud Risk AI",
    scopes: [
      { id: "risk:read", label: "Read Risk Assessments" },
      { id: "risk:write", label: "Evaluate Transaction Risk Rules" },
    ],
  },
];
