import React, { useState } from 'react';
import { AlertTriangle, Lock, ShieldX, Database, ChevronRight, Binary, Fingerprint, RotateCcw } from 'lucide-react';
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
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6">
      {/* Red Alert Light (Ambient) */}
      <div className="absolute inset-0 bg-red-600/5 animate-pulse-fast pointer-events-none"></div>

      <div className="max-w-4xl w-full relative animate-shake">
        {/* Compact Alarm Box */}
        <div className="bg-zinc-950 border-2 border-red-600 rounded-2xl shadow-[0_0_80px_rgba(220,38,38,0.3)] overflow-hidden">
          {/* Header */}
          <div className="bg-red-600 p-4 sm:p-6 flex items-center gap-4 text-white shadow-lg">
            <div className="relative shrink-0">
               <AlertTriangle size={48} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-mono tracking-wider uppercase leading-none">
                CRITICAL INTEGRITY BREACH
              </h1>
              <p className="mt-1 text-red-100 font-bold text-xs uppercase tracking-widest">
                System Arrest Initiated
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Diff Comparison */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-red-900/50 pb-2">
                <div className="flex items-center gap-2 text-red-500 font-mono text-[10px] uppercase tracking-widest font-black">
                  <Fingerprint size={16} />
                  <span>Payload Integrity Mismatch</span>
                </div>
                <div className="text-red-900 font-mono text-[10px] font-black uppercase">
                  ID: 0x882_X
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Expected State */}
                <div className="bg-black/40 border border-emerald-900/30 p-4 rounded-xl relative shadow-inner">
                  <div className="absolute top-0 right-0 bg-emerald-900/20 text-emerald-500 px-2 py-0.5 rounded-bl-lg text-[8px] font-black uppercase tracking-widest border-l border-b border-emerald-900/30">
                    Trusted
                  </div>
                  <p className="text-[9px] text-emerald-900 font-black uppercase tracking-widest mb-2">Original Ledger</p>
                  <div className="font-mono text-xs text-emerald-400 bg-black/40 p-3 rounded-lg border border-emerald-900/10 overflow-x-auto">
                    "recipient": "World Bank (IDA)"
                  </div>
                </div>

                {/* Found State */}
                <div className="bg-red-950/5 border border-red-600 p-4 rounded-xl relative animate-pulse shadow-[inset_0_0_20px_rgba(220,38,38,0.1)]">
                  <div className="absolute top-0 right-0 bg-red-600 text-white px-2 py-0.5 rounded-bl-lg text-[8px] font-black uppercase tracking-widest border-l border-b border-red-600">
                    Malicious
                  </div>
                  <p className="text-[9px] text-red-900 font-black uppercase tracking-widest mb-2">Injected Mutation</p>
                  <div className="font-mono text-xs text-red-500 font-black bg-black/60 p-3 rounded-lg border border-red-500/30 overflow-x-auto">
                    "recipient": "Roadway Co. Ltd"
                  </div>
                </div>
              </div>
            </div>

            {/* Protocol & Recovery */}
            <div className="border-t border-red-900/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex items-center gap-2 text-red-400 font-mono text-[9px] uppercase tracking-widest font-black">
                  <Lock size={14} className="text-red-600" />
                  <span>Kernel Lock</span>
                </div>
                <div className="flex items-center gap-2 text-red-400 font-mono text-[9px] uppercase tracking-widest font-black">
                  <ShieldX size={14} className="text-red-600" />
                  <span>Gate Purged</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <button 
                  onClick={handleRestore}
                  disabled={restoring}
                  className="bg-black border border-emerald-500 text-emerald-500 px-6 py-3 font-black text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-emerald-500 hover:text-black transition-all active:scale-95 disabled:opacity-50"
                >
                  {restoring ? <RotateCcw className="animate-spin" size={14} /> : <RotateCcw size={14} />}
                  Authorized Recovery
                </button>
                <p className="text-[8px] font-mono text-red-900 uppercase tracking-[0.2em]">Forensic Override Level 9</p>
              </div>
            </div>
          </div>
        </div>

        {/* Aggregate Error Logs */}
        <div className="mt-4 px-4 overflow-hidden h-8 mask-fade-out pointer-events-none opacity-40">
          <div className="text-[9px] font-mono text-red-700 space-y-1 animate-[marquee_10s_linear_infinite]">
            <p>LOG :: [SEC-772] :: HASH_MISMATCH_VOTE_130_SHA256_FAILURE</p>
            <p>LOG :: [SYS-901] :: INTERRUPT_VECTOR_0x00192_HALTED</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
