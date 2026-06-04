import React, { useState } from 'react';
import { AlertTriangle, Lock, ShieldAlert, RotateCcw } from 'lucide-react';
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
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/95 backdrop-blur-lg flex items-center justify-center p-4">
      {/* Subtle ambient effect */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-3xl w-full relative animate-in zoom-in-95 fade-in duration-300">
        {/* Professional Alert Card */}
        <div className="institutional-card border-l-4 border-l-red-600 overflow-hidden shadow-[0_0_100px_rgba(220,38,38,0.2)]">
          {/* Critical Header */}
          <div className="bg-gradient-to-r from-red-950 to-red-900/50 px-6 py-4 sm:px-8 sm:py-5 flex items-center gap-4 border-b border-red-500/20">
            <div className="shrink-0 p-3 bg-red-600/10 rounded-lg">
              <AlertTriangle size={32} className="text-red-500" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black font-mono tracking-wider uppercase text-slate-100">
                RTGS System Isolation Protocol Active
              </h1>
              <p className="mt-1 text-red-200/70 font-bold text-xs uppercase tracking-widest">
                Critical Hash Mismatch Detected
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Status Alert */}
            <div className="bg-red-600/5 border border-red-500/30 rounded-lg p-4">
              <p className="text-xs text-red-400 leading-relaxed font-mono uppercase tracking-tight font-black">
                The underlying database records have been manipulated out-of-band. Cryptographic signature validation failed. Transaction aborted. Core database write-privileges dropped dynamically.
              </p>
            </div>

            {/* Payload Comparison */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
                <span className="text-xs font-black text-red-500 uppercase tracking-widest">Payload Integrity Analysis</span>
                <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">ID: HASH_VIOLATION_001</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original Value (Trusted) */}
                <div className="bg-[#0d1117] border border-emerald-500/20 p-4 rounded-lg">
                  <div className="absolute top-0 right-0 bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-bl-lg text-[7px] font-black uppercase tracking-widest border-l border-b border-emerald-500/20">
                    Trusted Ledger
                  </div>
                  <p className="text-[8px] text-emerald-600/80 font-black uppercase tracking-widest mb-3 mt-1">Original Value</p>
                  <div className="font-mono text-xs text-emerald-400 bg-black/50 p-3 rounded border border-emerald-500/10">
                    <div className="text-[10px]">Payee: World Bank (IDA)</div>
                    <div className="text-[10px]">Route: Int-Settlement-01</div>
                  </div>
                </div>

                {/* Mutated Value (Malicious) */}
                <div className="bg-red-950/10 border border-red-600/40 p-4 rounded-lg animate-pulse">
                  <div className="absolute top-0 right-0 bg-red-600 text-white px-2 py-1 rounded-bl-lg text-[7px] font-black uppercase tracking-widest border-l border-b border-red-600">
                    Malicious Mutation
                  </div>
                  <p className="text-[8px] text-red-600/90 font-black uppercase tracking-widest mb-3 mt-1">Mutated Value</p>
                  <div className="font-mono text-xs text-red-500 font-black bg-black/60 p-3 rounded border border-red-600/30">
                    <div className="text-[10px]">Payee: Roadway Company Ltd</div>
                    <div className="text-[10px]">Route: TK-Shell-901</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recovery Actions */}
            <div className="border-t border-red-500/20 pt-6 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <div className="flex items-center gap-2 text-red-400 font-mono text-[9px] uppercase tracking-widest font-black">
                  <Lock size={14} className="text-red-600" />
                  <span>Kernel Lock</span>
                </div>
                <div className="flex items-center gap-2 text-red-400 font-mono text-[9px] uppercase tracking-widest font-black">
                  <ShieldAlert size={14} className="text-red-600" />
                  <span>Gate Purged</span>
                </div>
              </div>
              
              <button 
                onClick={handleRestore}
                disabled={restoring}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-5 py-2.5 font-black text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all active:scale-95"
              >
                {restoring ? (
                  <>
                    <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Restoring...
                  </>
                ) : (
                  <>
                    <RotateCcw size={14} />
                    Authorized Recovery
                  </>
                )}
              </button>
            </div>

            {/* Forensic Info */}
            <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-3">
              <p className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.2em] font-black">
                Forensic Override Level 9 | System Rollback Available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
