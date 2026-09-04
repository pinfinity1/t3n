import { NextRequest, NextResponse } from "next/server";
import { SentinelService } from "@/services/sentinelService";
import { SettlementPayload } from "@/types/sentinel";
import { z } from "zod";

const requestValidator = z.object({
  transactionId: z.string().min(4),
  payeeDid: z.string().startsWith("did:t3n:"),
  amountUsd: z.number().positive(),
  category: z.enum(["INFRASTRUCTURE", "PAYROLL", "LEGAL_AUDIT", "HARDWARE"]),
  documentHash: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const parseResult = requestValidator.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          code: "VALIDATION_FAILED",
          details: parseResult.error.flatten(),
        },
        { status: 422 },
      );
    }

    const service = new SentinelService();
    const verdictResult = await service.processEnterpriseSettlement(
      parseResult.data as SettlementPayload,
    );

    if (!verdictResult.success) {
      return NextResponse.json(
        {
          code: "TEE_EXECUTION_ERROR",
          message: verdictResult.error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(verdictResult.data, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        code: "INTERNAL_CRITICAL_FAILURE",
        message:
          error instanceof Error
            ? error.message
            : "Unexpected enclave runtime halt",
      },
      { status: 500 },
    );
  }
}
