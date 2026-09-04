"use client";

import React, { useState } from "react";
import { MetricsBar } from "@/components/dashboard/MetricsBar";
import { ExecutionConsole } from "@/components/dashboard/ExecutionConsole";
import { VerdictViewer } from "@/components/dashboard/VerdictViewer";
import { AuditLedger } from "@/components/dashboard/AuditLedger";
import { SettlementPayload, SettlementVerdict } from "@/types/sentinel";

const DEFAULT_DID = "did:t3n:b16d0d37f55ffd79fa7d41390c56169a6a798f37";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<SettlementVerdict | null>(null);
  const [history, setHistory] = useState<SettlementVerdict[]>([]);

  const [payload, setPayload] = useState<SettlementPayload>({
    transactionId: "TX-ENTERPRISE-2026-09",
    payeeDid: "did:t3n:9a7d41390c56169a6a798f37b16d0d37f55ffd79",
    amountUsd: 24000,
    category: "INFRASTRUCTURE",
    documentHash: "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
  });

  const handleExecute = async () => {
    setIsLoading(true);
    setError(null);
    setVerdict(null);

    try {
      const response = await fetch("/api/sentinel/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to complete confidential execution",
        );
      }

      const receivedVerdict = data as SettlementVerdict;
      setVerdict(receivedVerdict);
      setHistory((prev) => [receivedVerdict, ...prev]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans selection:bg-indigo-500 selection:text-white">
      <main className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            T3N Confidential Sentinel
          </h1>
          <p className="text-sm text-slate-400">
            Autonomous Zero-Knowledge Enterprise Settlement & Compliance Agent
          </p>
        </div>

        <MetricsBar did={DEFAULT_DID} status="ONLINE" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ExecutionConsole
            payload={payload}
            onUpdatePayload={setPayload}
            onSubmit={handleExecute}
            isLoading={isLoading}
          />
          <VerdictViewer verdict={verdict} error={error} />
        </div>

        <AuditLedger logs={history} />
      </main>
    </div>
  );
}
