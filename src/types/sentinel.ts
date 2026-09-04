export type SettlementCategory =
  | "INFRASTRUCTURE"
  | "PAYROLL"
  | "LEGAL_AUDIT"
  | "HARDWARE";

export interface SettlementPayload {
  readonly transactionId: string;
  readonly payeeDid: string;
  readonly amountUsd: number;
  readonly category: SettlementCategory;
  readonly documentHash: string;
}

export type VerdictDecision =
  | "AUTO_APPROVED"
  | "ESCALATED_MANUAL_REVIEW"
  | "POLICY_REJECTED";

export interface SettlementVerdict {
  readonly verdictId: string;
  readonly transactionId: string;
  readonly payeeDid: string;
  readonly amountUsd: number;
  readonly category: SettlementCategory;
  readonly decision: VerdictDecision;
  readonly executionTimeMs: number;
  readonly enclaveAttestationHash: string;
  readonly auditedTimestamp: string;
  readonly complianceMessage: string;
}

export interface EnclaveSession {
  readonly sessionToken: string;
  readonly enclaveDid: string;
  readonly expiresAt: number;
}
