export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  INTERNAL_TRANSFER = 'INTERNAL_TRANSFER',
  EXTERNAL_PAYMENT = 'EXTERNAL_PAYMENT',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REVERSED = 'REVERSED',
}

export interface Transaction {
  id: number;
  transactionId: string;
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  idempotencyKey: string;
  timestamp: string;
}

export interface InternalTransferRequest {
  sourceAccountNumber: string;
  destinationAccountNumber: string;
  amount: number;
  description?: string;
  idempotencyKey: string;
}

export interface DepositRequest {
  accountNumber: string;
  amount: number;
  idempotencyKey: string;
}

export interface WithdrawRequest {
  accountNumber: string;
  amount: number;
  idempotencyKey: string;
}

export interface ExternalPaymentRequest {
  sourceAccountNumber: string;
  routingNumber: string;
  recipientAccountNumber: string;
  recipientName: string;
  amount: number;
  description?: string;
  idempotencyKey: string;
}
