// ============================================================
// GatewayModels.ts
// TypeScript domain types matching the backend Java entities
// for the Merchant Portal and Operations Console portals.
// Pattern: mirrors ApiResponse.ts — plain interfaces, no classes.
// ============================================================

// ─── Payment Intents ─────────────────────────────────────────

export type PaymentIntentStatus =
  | "CREATED"
  | "QR_GENERATED"
  | "PENDING"
  | "AUTHORIZED"
  | "CAPTURED"
  | "SETTLED"
  | "REFUNDED"
  | "FAILED"
  | "EXPIRED"
  | "CANCELLED";

export interface PaymentIntent {
  id: number;
  intentId: string;
  merchantId: number;
  customerAccountNumber: string;
  amount: number;
  currency: string;
  feeAmount: number;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Dynamic QR Ph P2M ───────────────────────────────────────

export type QrStatus =
  | "CREATED"
  | "ACTIVE"
  | "SCANNED"
  | "PAID"
  | "EXPIRED"
  | "CANCELLED";

export interface DynamicQrPayment {
  id: number;
  qrReference: string;
  paymentIntentId: number;
  qrPayload: string;
  status: QrStatus;
  expiresAt: string;
  scannedAt?: string;
  createdAt: string;
}

// ─── Refunds ─────────────────────────────────────────────────

export interface Refund {
  id: number;
  refundId: string;
  paymentIntentId: number;
  amount: number;
  reason: string;
  status: string;
  createdAt: string;
}

// ─── Merchants ───────────────────────────────────────────────

export type MerchantLifecycleStage =
  | "APPLICATION"
  | "KYB"
  | "SCREENING"
  | "RISK_ASSESSMENT"
  | "COMPLIANCE_REVIEW"
  | "APPROVED"
  | "ACTIVE"
  | "REJECTED"
  | "SUSPENDED";

export interface Merchant {
  id: number;
  merchantCode: string;
  legalName: string;
  status: MerchantLifecycleStage;
  riskProfile?: string;
  settlementAccount?: string;
  createdAt: string;
  updatedAt?: string;
}

// ─── Merchant Balance ─────────────────────────────────────────

export interface MerchantBalance {
  id: number;
  merchantId: number;
  pendingBalance: number;
  settledBalance: number;
  currency: string;
  updatedAt: string;
}

// ─── Settlement ───────────────────────────────────────────────

export type SettlementWindowStatus = "OPEN" | "CLOSED" | "RECONCILED" | "FAILED";

export interface SettlementWindow {
  id: number;
  windowReference: string;
  cycleType: "INTRADAY" | "EOD";
  rail: string;
  cutOffTime: string;
  status: SettlementWindowStatus;
  createdAt: string;
}

export type SettlementInstructionStatus = "PENDING" | "SENT" | "ACKNOWLEDGED" | "REJECTED";

export interface SettlementInstruction {
  id: number;
  instructionId: string;
  settlementWindowId: number;
  merchantId: number;
  amount: number;
  currency: string;
  status: SettlementInstructionStatus;
  destinationAccount: string;
  createdAt: string;
}

export type SettlementExceptionStatus = "UNRESOLVED" | "RESOLVED" | "MANUAL_INTERVENTION";

export interface SettlementException {
  id: number;
  exceptionReference: string;
  settlementInstructionId: number;
  errorCode: string;
  errorDescription: string;
  status: SettlementExceptionStatus;
  createdAt: string;
}

// ─── Fraud ───────────────────────────────────────────────────

export type FraudDecision = "ALLOW" | "CHALLENGE" | "BLOCK";
export type FraudCaseStatus = "OPEN" | "INVESTIGATING" | "CONFIRMED" | "FALSE_POSITIVE";

export interface FraudCase {
  id: number;
  fraudReference: string;
  paymentIntentId: number;
  fraudScore: number;
  decision: FraudDecision;
  reasonCode: string;
  status: FraudCaseStatus;
  createdAt: string;
  updatedAt?: string;
}

// ─── Customer Complaints ──────────────────────────────────────

export type ComplaintStatus = "OPEN" | "ESCALATED" | "RESOLVED";

export interface CustomerComplaint {
  id: number;
  complaintReference: string;
  customerId: number;
  category: string;
  channel: string;
  status: ComplaintStatus;
  slaDeadline: string;
  assignedOfficer?: string;
  resolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

// ─── Regulatory Governance ────────────────────────────────────

export type ImplementationStatus = "PLANNED" | "IMPLEMENTED" | "TESTED" | "EXEMPT";

export interface RegulatoryRequirement {
  id: number;
  regulation: string;
  section: string;
  applicability: string;
  controlDescription: string;
  implementationStatus: ImplementationStatus;
  evidenceQuery?: string;
  owner: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ComplianceEvidenceRecord {
  id: number;
  evidenceReference: string;
  regulatoryRequirementId: number;
  evidenceType: "AUDIT_LOG" | "CONFIGURATION" | "INCIDENT_REPORT" | "PEN_TEST";
  description: string;
  fileUri?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
}



export interface PaymentSessionResponse {
  paymentIntentId: string;
  provider: string;
  checkoutType: 'HOSTED' | 'API';
  checkoutUrl: string;
  expiresAt: string;
  transactionReference: string;
}

export interface CreatePaymentIntentRequest {
  sourceAccountId: string;
  amount: number;
  description: string;
  merchantReference: string;
}

// Preserve existing models below...
