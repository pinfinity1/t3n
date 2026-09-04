import React from "react";
import { SettlementVerdict } from "@/types/sentinel";
import { History, CheckCircle, AlertTriangle } from "lucide-react";

interface AuditLedgerProps {
  readonly logs: readonly SettlementVerdict[];
}

export const AuditLedger: React.FC<AuditLedgerProps> = ({ logs }) => {
  if (logs.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
        <History className="h-4 w-4 text-indigo-400" />
        <h3>Confidential Enclave Audit Trail (In-Memory Ledger)</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="border-b border-slate-800 text-slate-400">
            <tr>
              <th className="pb-2">Tx ID</th>
              <th className="pb-2">Volume</th>
              <th className="pb-2">Category</th>
              <th className="pb-2">Decision</th>
              <th className="pb-2">Enclave Attestation</th>
              <th className="pb-2">Audited Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {logs.map((item) => (
              <tr key={item.verdictId} className="hover:bg-slate-800/30">
                <td className="py-2.5 text-slate-300">{item.transactionId}</td>
                <td className="py-2.5 text-emerald-400 font-semibold">
                  ${item.amountUsd.toLocaleString()}
                </td>
                <td className="py-2.5 text-slate-400">{item.category}</td>
                <td className="py-2.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                      item.decision === "AUTO_APPROVED"
                        ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                    }`}
                  >
                    {item.decision === "AUTO_APPROVED" ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <AlertTriangle className="h-3 w-3" />
                    )}
                    {item.decision}
                  </span>
                </td>
                <td
                  className="py-2.5 text-indigo-400 truncate max-w-[140px]"
                  title={item.enclaveAttestationHash}
                >
                  {item.enclaveAttestationHash}
                </td>
                <td className="py-2.5 text-slate-400">
                  {new Date(item.auditedTimestamp).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
