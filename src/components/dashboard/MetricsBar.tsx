import React from "react";
import { ShieldCheck, Cpu, Key } from "lucide-react";

interface MetricsBarProps {
  did: string;
  status: "ONLINE" | "PROCESSING" | "DEGRADED";
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ did, status }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-md">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs text-slate-400 font-medium">
            Node Security
          </div>
          <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {status} (TEE Enclave)
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex items-center gap-3">
        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-md">
          <Key className="h-5 w-5" />
        </div>
        <div className="overflow-hidden">
          <div className="text-xs text-slate-400 font-medium">Agent DID</div>
          <div
            className="text-xs font-mono text-indigo-300 truncate"
            title={did}
          >
            {did}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex items-center gap-3">
        <div className="p-2 bg-purple-500/10 text-purple-400 rounded-md">
          <Cpu className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs text-slate-400 font-medium">
            Network Context
          </div>
          <div className="text-sm font-semibold text-slate-200">
            Terminal 3 ADK v2
          </div>
        </div>
      </div>
    </div>
  );
};
