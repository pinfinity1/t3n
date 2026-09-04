import React from "react";
import { CheckCircle2, AlertTriangle, FileLock2, Clock } from "lucide-react";
import { SettlementVerdict } from "@/types/sentinel";

interface VerdictViewerProps {
  verdict: SettlementVerdict | null;
  error: string | null;
}

export const VerdictViewer: React.FC<VerdictViewerProps> = ({
  verdict,
  error,
}) => {
  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 text-rose-300 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-sm">
            Pipeline Execution Failure
          </div>
          <p className="text-xs mt-1 text-rose-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!verdict) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
        <FileLock2 className="h-10 w-10 text-slate-600 mb-3" />
        <div className="text-sm font-medium text-slate-400">
          Enclave Output Channel Inactive
        </div>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          Execute a settlement proposal to generate a cryptographically attested
          verdict from the TEE runtime.
        </p>
      </div>
    );
  }

  const isApproved = verdict.decision === "AUTO_APPROVED";

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
      <div
        className={`p-4 rounded-lg border flex items-center gap-3 ${
          isApproved
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
            : "bg-amber-500/10 border-amber-500/20 text-amber-300"
        }`}
      >
        {isApproved ? (
          <CheckCircle2 className="h-5 w-5 shrink-0" />
        ) : (
          <AlertTriangle className="h-5 w-5 shrink-0" />
        )}
        <div>
          <div className="text-xs font-mono uppercase tracking-wider">
            Status: {verdict.decision}
          </div>
          <div className="text-sm font-medium mt-0.5">
            {verdict.complianceMessage}
          </div>
        </div>
      </div>

      <div className="space-y-2.5 font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded-lg border border-slate-800">
        <div>
          <span className="text-slate-500">Verdict Identifier: </span>
          <span className="text-slate-300">{verdict.verdictId}</span>
        </div>
        <div>
          <span className="text-slate-500">Enclave Attestation: </span>
          <span className="text-indigo-400 break-all">
            {verdict.enclaveAttestationHash}
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Execution: {verdict.executionTimeMs}ms</span>
          </div>
          <div>
            Audited: {new Date(verdict.auditedTimestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};
