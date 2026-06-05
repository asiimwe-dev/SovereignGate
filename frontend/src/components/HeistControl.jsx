import React, { useState, useEffect, useRef } from 'react';
import { useApi } from '../hooks/useApi';
import { Zap, AlertTriangle, Database, ChevronRight, RotateCcw, ShieldCheck, Terminal, ShieldAlert } from 'lucide-react';

const HeistControl = () => {
  const { triggerInject, resetSystem } = useApi();
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [logs, setLogs] = useState([
    "SYS_BOOT_SEQUENCE_OK",
    "RTGS_CRYPTO_INTERFACE_READY",
    "MUTATION_MONITORING_ENGINE_ACTIVE",
    "AWAITING_ADMINISTRATIVE_ACTIONS"
  ]);
  
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleInject = async () => {
    setLoading(true);
    setLogs(prev => [
      ...prev,
      ">> INITIATING DIAGNOSTIC MUTATION TEST",
      ">> BYPASSING MPC VALIDATION LAYER",
      ">> MUTATING LEDGER RECORD PAYLOAD",
      ">> DATABASE PERSISTENCE LAYER MODIFIED"
    ]);
    try {
      await triggerInject();
      setLogs(prev => [...prev, "CRITICAL: LEDGER_INTEGRITY_VIOLATION_TRIGGERED"]);
    } catch (err) {
      console.error(err);
      setLogs(prev => [...prev, "ERROR: INJECTION_FAILURE"]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setResetting(true);
    setLogs(prev => [...prev, ">> ROLLBACK COMMAND RECEIVED", ">> RE-INITIALIZING DATABASE LEDGER"]);
    try {
      await resetSystem();
      setLogs([
        "SYS_BOOT_SEQUENCE_OK",
        "DATABASE_RESTORED_TO_BASELINE_INTEGRITY",
        "RTGS_MUTATION_MONITORING_ACTIVE"
      ]);
    } catch (err) {
      setLogs(prev => [...prev, "ERROR: DATABASE_RESTORE_FAILED"]);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0f131a] border-t md:border-t-0 md:border-l border-[#1f2937] selection:bg-red-500/10">
      
      {/* Header */}
      <div className="p-5 border-b border-[#1f2937] bg-[#07090e] flex items-center justify-between">
        <div>
          <h2 className="font-mono text-sm font-black text-slate-300 tracking-tight uppercase">
            Vulnerability Simulation
          </h2>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-0.5">Penetration testing suite</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-mono text-red-500 font-bold uppercase tracking-wider">Sim Mode</span>
        </div>
      </div>

      <div className="p-5 space-y-5 flex-grow overflow-y-auto">
        
        {/* Diagnostic Terminal */}
        <div className="institutional-card bg-[#07090e] border-[#1f2937] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-[#0f131a] border-b border-[#1f2937]">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-[#C5A059]" />
              <span className="text-xs font-mono text-slate-400 uppercase font-black tracking-widest">Forensic logs</span>
            </div>
            <div className="flex gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500/30"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500/30"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/30"></span>
            </div>
          </div>
          
          <div className="p-4 font-mono text-xs space-y-1.5 h-48 overflow-y-auto text-slate-400">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-1.5 text-slate-500 hover:text-slate-300 transition-colors leading-tight">
                <span className="text-[#C5A059] shrink-0 font-bold">»</span>
                <code className={`${
                  log.includes("MUTATION") || log.includes("MODIFIED") || log.includes("VIOLATION")
                    ? "text-red-400 font-bold"
                    : log.includes("RESTORED") || log.includes("ACTIVE") || log.includes("OK")
                    ? "text-emerald-400 font-bold"
                    : "text-slate-400"
                }`}>
                  {log}
                </code>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-4">
          
          {/* Inject Mutation Script Button */}
          <div className="institutional-card p-4 bg-gradient-to-br from-[#07090e] to-[#0f131a] border-red-900/30 hover:border-red-500/30 transition-all shadow-lg">
            <button
              onClick={handleInject}
              disabled={loading}
              className="w-full group cursor-pointer transition-all active:scale-[0.98]"
            >
              <div className="flex flex-col items-center gap-3">
                <div className={`p-3 rounded-xl transition-all border ${
                  loading 
                    ? 'bg-red-500/20 text-red-500 border-red-500/30 animate-pulse' 
                    : 'bg-red-950/20 text-red-400 border-red-900/20 group-hover:bg-red-500/10 group-hover:text-red-400 group-hover:border-red-500/30'
                }`}>
                  <Zap size={20} />
                </div>
                <div className="text-center space-y-1">
                  <span className="block font-black text-xs text-slate-200 uppercase tracking-wider">
                    Inject Out-Of-Band Mutation
                  </span>
                  <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    Simulates attacker DB rewrite
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Warnings explaining what this does */}
          <div className="p-3.5 rounded-xl bg-red-950/10 border border-red-900/25 flex gap-3 items-start">
            <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs text-red-400 leading-tight font-black uppercase tracking-wider">
                Vulnerability Alert Vector
              </p>
              <p className="text-[11px] text-slate-500 leading-normal uppercase font-mono tracking-tight">
                Alters database directly without MPC signing keys. Tests the hash integrity guard. Triggers emergency lockout on next query.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Baseline Restore Controller */}
      <div className="p-5 border-t border-[#1f2937] bg-[#07090e] space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 uppercase tracking-widest">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>Incident Remediation</span>
        </div>
        
        <button 
          onClick={handleReset}
          disabled={resetting}
          className="w-full py-3 bg-[#0f131a] hover:bg-emerald-500/5 border border-[#1f2937] hover:border-emerald-500/30 text-emerald-400 text-sm font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-40"
        >
          {resetting ? (
            <div className="w-4 h-4 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
          ) : (
            <RotateCcw size={14} />
          )}
          System Rollback Recovery
        </button>
      </div>

    </div>
  );
};

export default HeistControl;
