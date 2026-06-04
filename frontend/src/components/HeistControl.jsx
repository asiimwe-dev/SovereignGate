import React, { useState, useEffect, useRef } from 'react';
import { useApi } from '../hooks/useApi';
import { Zap, AlertTriangle, Database, ChevronRight, RotateCcw, ShieldAlert, Lock } from 'lucide-react';

const HeistControl = () => {
  const { triggerInject, resetSystem } = useApi();
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [logs, setLogs] = useState([
    "SYS_BOOT_SEQUENCE...",
    "RTGS_NETWORK_INTERFACE_INITIALIZED",
    "DIAGNOSTIC_TOOLS_READY",
    "AWAITING_ADMIN_COMMAND"
  ]);
  
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleInject = async () => {
    setLoading(true);
    setLogs(prev => [
      ...prev,
      ">> INITIATING_PAYLOAD_MUTATION_TEST",
      ">> DATABASE_ACCESS_LAYER_PROBING",
      ">> EXECUTING_PERSISTENCE_MODIFICATION",
      ">> DATABASE_RECORD_ALTERED"
    ]);
    try {
      await triggerInject();
    } catch (err) {
      console.error(err);
      setLogs(prev => [...prev, "ERROR: INJECTION_FAILED"]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setResetting(true);
    setLogs(prev => [...prev, ">> INITIATING_SYSTEM_RESTORE", ">> DATABASE_ROLLBACK_ACTIVE"]);
    try {
      await resetSystem();
      setLogs(["SYS_BOOT_SEQUENCE...", "SYSTEM_RESTORED_TO_BASELINE", "DIAGNOSTIC_TOOLS_READY"]);
    } catch (err) {
      setLogs(prev => [...prev, "ERROR: RESTORE_FAILED"]);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#161b22] border-t md:border-t-0 md:border-l border-[#30363d] selection:bg-red-500/10">
      {/* Professional Header */}
      <div className="p-6 border-b border-[#30363d] bg-[#0d1117] flex items-center justify-between">
        <div>
          <h2 className="font-mono text-xs font-black text-slate-300 tracking-tight uppercase">
            Network Vulnerability & Penetration Testing
          </h2>
          <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mt-1">Diagnostic Payload Mutation Suite</p>
        </div>
        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
      </div>

      <div className="p-6 space-y-6 flex-grow overflow-y-auto">
        {/* Diagnostic Log Terminal */}
        <div className="institutional-card bg-[#0d1117] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-700"></div>
              <div className="w-2 h-2 rounded-full bg-slate-700"></div>
            </div>
            <span className="text-[8px] font-mono text-slate-600 uppercase font-black tracking-widest">Terminal Output</span>
          </div>
          <div className="p-4 font-mono text-[8px] space-y-1 h-48 overflow-y-auto text-slate-500">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-2 text-slate-600 hover:text-slate-400 transition-colors">
                <span className="text-slate-700 shrink-0">{'>'}</span>
                <code className={`${
                  log.includes("ALTERED") || log.includes("RESTORED")
                    ? "text-emerald-500 font-bold"
                    : log.includes("ERROR")
                    ? "text-red-500 font-bold"
                    : "text-slate-500"
                }`}>
                  {log}
                </code>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>

        {/* Vulnerability Testing Controls */}
        <div className="space-y-3">
          {/* Primary Test Action */}
          <div className="institutional-card p-4 bg-gradient-to-br from-[#0d1117] to-[#161b22] border border-red-600/20 hover:border-red-600/40 transition-all">
            <button
              onClick={handleInject}
              disabled={loading}
              className="w-full group transition-all active:scale-[0.98]"
            >
              <div className="flex flex-col items-center gap-3 py-2">
                <div className={`p-3 rounded-lg transition-all ${
                  loading 
                    ? 'bg-red-600/20 text-red-500 animate-pulse' 
                    : 'bg-red-600/10 text-red-500 group-hover:bg-red-600/20'
                }`}>
                  <Zap size={20} />
                </div>
                <span className="block font-black text-xs text-slate-200 uppercase tracking-tight leading-tight">
                  Run Payload Mutation Test Script
                </span>
              </div>
            </button>
          </div>

          {/* Warning Box */}
          <div className="system-critical p-3 rounded-lg border-l-4 border-red-600/50 flex gap-2">
            <AlertTriangle size={14} className="text-red-600 shrink-0 mt-0.5" />
            <p className="text-[8px] text-red-500/80 leading-tight uppercase tracking-tighter font-black">
              Alters underlying database persistence layer out-of-band. Bypasses MPC authentication validation. Triggers RTGS isolation on detection.
            </p>
          </div>
        </div>
      </div>

      {/* Reset Controls Footer */}
      <div className="p-6 border-t border-[#30363d] bg-[#0d1117] space-y-2">
        <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest mb-3">Authorized Recovery</p>
        <button 
          onClick={handleReset}
          disabled={resetting}
          className="w-full py-2.5 bg-[#161b22] hover:bg-emerald-500/10 border border-[#30363d] hover:border-emerald-500/30 text-emerald-500 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {resetting ? (
            <div className="w-3 h-3 rounded-full border border-emerald-500/50 border-t-emerald-500 animate-spin" />
          ) : (
            <RotateCcw size={12} />
          )}
          System Baseline Restore
        </button>
      </div>
    </div>
  );
};

export default HeistControl;
