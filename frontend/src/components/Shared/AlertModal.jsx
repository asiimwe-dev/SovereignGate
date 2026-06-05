import React, { useState } from 'react';
import { AlertTriangle, Lock, ShieldAlert, RotateCcw, AlertOctagon, CornerDownRight } from 'lucide-react';
import { useApi } from '../../hooks/useApi';

const AlertModal = () => {
  const { resetSystem } = useApi();
  const [restoring, setRestoring] = useState(false);

  const handleRestore = async () => {
    setRestoring(true);
    try {
      await resetSystem();
    } catch (err) {
      alert(err);
      setRestoring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
      {/* Dynamic ambient alert pulses */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-red-600 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-red-900 rounded-full blur-[150px]"></div>
      </div>

      <div className="max-w-3xl w-full relative z-10 animate-in zoom-in-95 fade-in duration-300">
        
        {/* Threat Lockout Card */}
        <div className="institutional-card border-l-4 border-l-red-500 bg-[#0f131a] border-[#1f2937] overflow-hidden shadow-[0_0_80px_rgba(220,38,38,0.15)]">
          
          {/* Critical Header */}
          <div className="bg-gradient-to-r from-red-950/40 to-transparent px-6 py-5 sm:px-8 sm:py-6 flex items-center gap-4 border-b border-red-500/20">
            <div className="shrink-0 p-3 bg-red-500/10 rounded-xl border border-red-500/20 text-red-500 animate-pulse">
              <AlertTriangle size={32} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black font-mono tracking-[0.1em] uppercase text-slate-100 flex items-center gap-2">
                RTGS System Isolation Active
              </h1>
              <p className="mt-0.5 text-red-400 font-mono text-xs uppercase tracking-widest font-black">
                Hash verification integrity failure (Code: LEDGER_MUTATION_DETECTED)
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Incident Alert Details */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 sm:p-5">
              <div className="flex gap-2.5 text-red-400 items-start">
                <AlertOctagon size={18} className="shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs uppercase font-black tracking-wider leading-none">Security Invariant Triggered</p>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed uppercase mt-1">
                    An out-of-band database write attempt bypassed the Multi-Party Computation signing keys. The active integrity monitor detected a payload hash mismatch and terminated write permissions.
                  </p>
                </div>
              </div>
            </div>

            {/* Side-by-side Payload forensic analysis */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#1f2937] pb-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <CornerDownRight size={12} className="text-red-500" /> Payload Forensic Comparison
                </span>
                <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">INCIDENT_ID: SG-9021</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Trusted Payload */}
                <div className="bg-[#07090e] border border-emerald-500/15 p-4 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-bl-xl text-[9px] font-black uppercase tracking-widest border-l border-b border-emerald-500/10">
                    Expected
                  </div>
                  <p className="text-xs text-emerald-500 font-mono font-black uppercase tracking-widest mb-3">Trusted Ledger seed</p>
                  
                  <div className="font-mono text-xs text-slate-300 bg-black/40 p-3.5 rounded-lg border border-[#1f2937] space-y-1.5">
                    <div className="flex justify-between border-b border-[#1f2937]/50 pb-1">
                      <span className="text-slate-500">PAYEE:</span>
                      <span className="text-emerald-400 font-bold">World Bank (IDA)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">VOTE:</span>
                      <span>Vote 130 (MoFPED)</span>
                    </div>
                  </div>
                </div>

                {/* Mutated Payload */}
                <div className="bg-red-950/10 border border-red-500/30 p-4 rounded-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-red-600 text-white px-2.5 py-0.5 rounded-bl-xl text-[9px] font-black uppercase tracking-widest">
                    Mutated
                  </div>
                  <p className="text-xs text-red-400 font-mono font-black uppercase tracking-widest mb-3">Compromised record</p>
                  
                  <div className="font-mono text-xs text-slate-300 bg-black/40 p-3.5 rounded-lg border border-red-500/25 space-y-1.5">
                    <div className="flex justify-between border-b border-red-500/20 pb-1">
                      <span className="text-slate-500">PAYEE:</span>
                      <span className="text-red-400 font-bold">Roadway Company Ltd</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">VOTE:</span>
                      <span className="text-red-400">Vote 130 (MoFPED)</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Incident Controls */}
            <div className="border-t border-[#1f2937] pt-5 flex flex-col sm:flex-row justify-between items-center gap-5">
              
              {/* Lock statuses */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 self-start sm:self-center">
                <div className="flex items-center gap-2 text-slate-400 font-mono text-xs uppercase tracking-widest font-black">
                  <Lock size={14} className="text-red-500" />
                  <span>Kernel lock: active</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-mono text-xs uppercase tracking-widest font-black">
                  <ShieldAlert size={14} className="text-red-500" />
                  <span>Settlement: dropped</span>
                </div>
              </div>
              
              {/* Recover button */}
              <button 
                onClick={handleRestore}
                disabled={restoring}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-black font-black text-xs uppercase tracking-[0.15em] px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-emerald-950/20 border border-emerald-500/35 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                {restoring ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-slate-900 border-t-slate-100 animate-spin" />
                    Rolling Back...
                  </>
                ) : (
                  <>
                    <RotateCcw size={14} />
                    Authorized Rollback Restore
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Incident Footer metadata */}
          <div className="bg-[#07090e] border-t border-[#1f2937] px-6 py-3.5 text-center">
            <p className="text-xs font-mono text-slate-500 uppercase tracking-[0.2em] font-black">
              BoU Security Operations Center | Cryptographic Integrity Guard Level 5
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AlertModal;
