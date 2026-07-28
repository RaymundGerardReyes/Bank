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
  role: "USER" | "ADMIN" | "TELLER";
  mfaEnabled: boolean;
  passkeyRegistered: boolean;
  createdAt: string;
}

export interface Account {
  id: string;
  accountNumber: string;
  accountType: "CHECKING" | "SAVINGS" | "INVESTMENT";
  balance: number;
  currency: string;
  status: "ACTIVE" | "FROZEN" | "CLOSED";
  createdAt: string;
}

export interface Transaction {
  id: string;
  transactionRef: string;
  accountNumber: string;
  type: "DEPOSIT" | "WITHDRAWAL" | "INTERNAL_TRANSFER" | "EXTERNAL_PAYMENT";
  amount: number;
  currency: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  description: string;
  recipientAccount?: string;
  createdAt: string;
}

export interface Statement {
  id: string;
  accountNumber: string;
  periodStart: string;
  periodEnd: string;
  downloadUrl: string;
  generatedAt: string;
}
