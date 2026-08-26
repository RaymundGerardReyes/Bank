export type TransactionState =
  | "FORM"
  | "VALIDATING"
  | "REVIEW"
  | "AUTHENTICATING"
  | "SUBMITTING"
  | "PROCESSING"
  | "RECONCILING"
  | "UNKNOWN"
  | "SUCCESS"
  | "PENDING"
  | "FAILED";

export type PaymentRail =
  | "INTERNAL"
  | "BANK_TRANSFER"
  | "QR_PH";

export interface TransactionResult {
  status: "SUCCESS" | "PENDING" | "FAILED" | "UNKNOWN";
  transactionReference?: string;
  processedAt?: string;
  failureCode?: string;
  failureMessage?: string;
}

export type TransactionDirection = 'INBOUND' | 'OUTBOUND' | 'ALL';

export interface TransactionHistoryFilter {
  accountNumber: string;
  direction?: TransactionDirection;
  page?: number;
  size?: number;
}

export interface TransactionHistoryRecord {
  transactionReference: string;
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  senderName: string;          // Maps to the extracted name of the sender
  recipientName: string;       // Maps to the extracted name of the receiver
  amount: number;
  currency: string;
  status: string;              // e.g., 'COMPLETED', 'PENDING', 'FAILED'
  entryType: 'CREDIT' | 'DEBIT'; // Maps to backend EntryType
  createdAt: string;
  description: string;
}
