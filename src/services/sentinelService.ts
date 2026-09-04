import { ENV } from "@/config/env";
import { T3NEnterpriseClient } from "@/lib/t3n/client";
import { Result, ok, err } from "@/lib/result";
import {
  SettlementPayload,
  SettlementVerdict,
  VerdictDecision,
} from "@/types/sentinel";

export class SentinelService {
  private client: T3NEnterpriseClient;

  constructor() {
    this.client = T3NEnterpriseClient.getInstance();
  }

  public async processEnterpriseSettlement(
    payload: SettlementPayload,
  ): Promise<Result<SettlementVerdict>> {
    const startTime = performance.now();

    if (payload.amountUsd <= 0) {
      return err(new Error("Transaction volume must be greater than zero USD"));
    }

    const writeResult = await this.client.writeEncryptedMap(
      `z::tenant::settlement::${payload.transactionId}`,
      {
        payee: payload.payeeDid,
        amount: payload.amountUsd,
        hash: payload.documentHash,
      },
    );

    if (!writeResult.success) {
      return err(writeResult.error);
    }

    const enclaveResult = await this.client.executeEnclaveRule(
      "treasury_policy_v2",
      {
        amountUsd: payload.amountUsd,
        category: payload.category,
        threshold: ENV.MAX_AUTO_APPROVAL_LIMIT,
      },
    );

    if (!enclaveResult.success) {
      return err(enclaveResult.error);
    }

    let decision: VerdictDecision = "AUTO_APPROVED";
    let complianceMessage =
      "Approved instantly within automated enterprise threshold parameters.";

    if (payload.amountUsd > ENV.MAX_AUTO_APPROVAL_LIMIT) {
      decision = "ESCALATED_MANUAL_REVIEW";
      complianceMessage = `Invoice amount exceeds auto-threshold ($${ENV.MAX_AUTO_APPROVAL_LIMIT.toLocaleString()} USD). Escalated to Dual-DID Governance.`;
    }

    const duration = Math.round(performance.now() - startTime);

    const verdict: SettlementVerdict = {
      verdictId: `vrd_${crypto.randomUUID()}`,
      transactionId: payload.transactionId,
      payeeDid: payload.payeeDid,
      amountUsd: payload.amountUsd,
      category: payload.category,
      decision,
      executionTimeMs: duration,
      enclaveAttestationHash: enclaveResult.data.attestationHash,
      auditedTimestamp: new Date().toISOString(),
      complianceMessage,
    };

    return ok(verdict);
  }
}
