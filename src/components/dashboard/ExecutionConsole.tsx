import React from "react";
import { Play, Loader2, ArrowLeftRight } from "lucide-react";
import { SettlementPayload } from "@/types/sentinel";

interface ExecutionConsoleProps {
  payload: SettlementPayload;
  onUpdatePayload: (next: SettlementPayload) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const ExecutionConsole: React.FC<ExecutionConsoleProps> = ({
  payload,
  onUpdatePayload,
  onSubmit,
  isLoading,
}) => {
  const toggleAmount = () => {
    onUpdatePayload({
      ...payload,
      amountUsd: payload.amountUsd === 24000 ? 85000 : 24000,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Dispatch Audit Pipeline
          </h2>
          <button
            onClick={toggleAmount}
            type="button"
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition"
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            Switch Scenario (${payload.amountUsd.toLocaleString()})
          </button>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div>
            <label className="block text-slate-400 mb-1">
              Transaction Ref ID
            </label>
            <input
              type="text"
              readOnly
              value={payload.transactionId}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-slate-300"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">
              Payee Tenant DID
            </label>
            <input
              type="text"
              readOnly
              value={payload.payeeDid}
              className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-slate-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Volume (USD)</label>
              <input
                type="text"
                readOnly
                value={`$${payload.amountUsd.toLocaleString()}`}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-emerald-400 font-semibold"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Category</label>
              <input
                type="text"
                readOnly
                value={payload.category}
                className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2 text-slate-300"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-medium py-2.5 rounded-lg transition"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Executing inside TEE Enclave...
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Verify & Settle Transaction
          </>
        )}
      </button>
    </div>
  );
};
