export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
  requestId?: string;
  errorCode?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: "USER" | "ADMIN" | "TELLER" | "MERCHANT" | "OPS_OFFICER";
  mfaEnabled: boolean;
  passkeyRegistered: boolean;
  createdAt: string;
}

export interface Account {
  id: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: string;
  status: "ACTIVE" | "FROZEN" | "CLOSED";
  
  // --- NEW ENTERPRISE VAM HIERARCHY FIELDS ---
  parentAccountId?: string | null;
  accountName?: string | null;
  // --- NEW ENTERPRISE ROUTING FIELDS ---
  swiftCode?: string;
  cardExpiry?: string;
  cardCvv?: string;
  createdAt: string;
}

export interface Transaction {
  id?: string;
  transactionRef?: string;
  transactionReference?: string;
  sourceAccountNumber?: string;
  destinationAccountNumber?: string;
  accountNumber?: string;
  type?: "DEPOSIT" | "WITHDRAWAL" | "INTERNAL_TRANSFER" | "EXTERNAL_PAYMENT";
  entryType?: "CREDIT" | "DEBIT" | string;
  amount: number;
  currency?: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "SCHEDULED" | string;
  description?: string;
  recipientAccount?: string;
  createdAt: string;
}

export interface Statement {
  id: string | number;
  accountNumber: string;
  startDate?: string;
  endDate?: string;
  periodStart?: string;
  periodEnd?: string;
  pdfUrl?: string;
  downloadUrl?: string;
  generatedAt?: string;
}