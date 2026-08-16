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
