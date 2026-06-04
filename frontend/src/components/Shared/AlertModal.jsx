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
      // SystemContext polling will pick up the change and remove this modal
    } catch (err) {
      alert(err);
      setRestoring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden crimson-meltdown flex items-center justify-center p-4 backdrop-blur-xl">
      {/* Cinematic Glitch Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none animate-glitch bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      {/* Red Alert Light (Ambient) */}
      <div className="absolute inset-0 bg-red-600/5 animate-pulse-fast"></div>

      <div className="max-w-5xl w-full relative animate-shake">
        {/* Main Alarm Box */}
        <div className="bg-black/90 border-[6px] border-red-600 rounded-[2.5rem] shadow-[0_0_150px_rgba(220,38,38,0.4)] overflow-hidden">
          {/* Aggressive Header */}
          <div className="bg-red-600 p-8 flex items-center gap-6 text-white shadow-lg">
            <div className="relative">
               <div className="absolute inset-0 blur-2xl bg-white/40 animate-pulse"></div>
               <AlertTriangle size={80} strokeWidth={3} className="relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
            </div>
            <div>
              <h1 className="text-5xl font-black font-mono tracking-[0.1em] uppercase leading-none italic">
                INTEGRITY BREACH
              </h1>
              <div className="mt-2 flex items-center gap-4 bg-black/20 px-4 py-1.5 rounded-lg border border-white/20">
                 <Binary size={18} className="text-red-100" />
                 <p className="text-red-500 font-black tracking-widest text-xl uppercase font-mono">
                   SYSTEM ARREST INITIATED
                 </p>
              </div>
            </div>
          </div>

          <div className="p-12 space-y-12">
            {/* The Diff Comparison Engine */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-red-900/50 pb-4">
                <div className="flex items-center gap-3 text-red-500 font-mono text-sm uppercase tracking-[0.3em] font-black">
                  <Fingerprint size={20} />
                  <span>Payload Integrity Mismatch</span>
                </div>
                <div className="px-3 py-1 bg-red-950 text-red-500 border border-red-900 text-[10px] font-mono font-black animate-pulse">
                  ERR_CODE: 0x882_X
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Expected State */}
                <div className="bg-zinc-900 border-2 border-emerald-900/40 p-8 rounded-3xl relative group shadow-2xl">
                  <div className="absolute top-0 right-0 bg-emerald-900/40 text-emerald-500 px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest border-l border-b border-emerald-800/50">
                    Trusted State
                  </div>
                  <div className="space-y-4">
                     <p className="text-[10px] text-emerald-900 font-black uppercase tracking-widest">Expected Ledger Map</p>
                     <div className="font-mono text-base text-emerald-400 bg-black/40 p-4 rounded-xl border border-emerald-900/20">
                        <span className="opacity-40">"recipient":</span> "World Bank (IDA)"
                     </div>
                  </div>
                </div>

                {/* Found State (Compromised) */}
                <div className="bg-red-950/10 border-2 border-red-500 p-8 rounded-3xl relative animate-pulse shadow-[inset_0_0_40px_rgba(220,38,38,0.15)] overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(220,38,38,0.05)_50%,transparent_75%)] bg-[length:250px_250px] animate-[marquee_2s_linear_infinite]"></div>
                  <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest border-l border-b border-red-500">
                    Malicious Mutation
                  </div>
                  <div className="space-y-4 relative z-10">
                     <p className="text-[10px] text-red-900 font-black uppercase tracking-widest">Injected Payload detected</p>
                     <div className="font-mono text-base text-red-500 font-black bg-black/60 p-4 rounded-xl border border-red-500/30">
                        <span className="opacity-40">"recipient":</span> "Roadway Co. Ltd"
                     </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lockout Protocol & Recovery Trigger */}
            <div className="border-t border-red-900/30 pt-10 flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                <div className="flex items-center gap-3 text-red-400 font-mono text-[10px] uppercase tracking-[0.2em] font-black">
                  <Lock size={18} className="text-red-600 animate-pulse" />
                  <span>Kernel Lock Active</span>
                </div>
                <div className="flex items-center gap-3 text-red-400 font-mono text-[10px] uppercase tracking-[0.2em] font-black">
                  <ShieldX size={18} className="text-red-600 animate-pulse" />
                  <span>Gateway Purged</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <button 
                  onClick={handleRestore}
                  disabled={restoring}
                  className="relative group pointer-events-auto cursor-pointer"
                >
                  <div className="absolute -inset-1 bg-emerald-500 rounded-lg blur opacity-0 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative bg-black border-2 border-emerald-500 text-emerald-500 px-8 py-4 font-black text-sm uppercase tracking-[0.2em] italic rounded-xl flex items-center gap-3 hover:bg-emerald-500 hover:text-black transition-all">
                    {restoring ? (
                      <RotateCcw className="animate-spin" size={18} />
                    ) : (
                      <RotateCcw size={18} />
                    )}
                    Perform Forensic Recovery
                  </div>
                </button>
                <p className="text-[9px] font-mono text-red-700 uppercase tracking-widest">Authorized Override Required</p>
              </div>
            </div>
          </div>
        </div>

        {/* Aggregate Error Logs */}
        <div className="mt-10 overflow-hidden h-16 mask-fade-out pointer-events-none border-x border-red-900/20 px-6">
          <div className="text-[11px] font-mono text-red-900/40 space-y-1 animate-[marquee_5s_linear_infinite]">
            <p>CRITICAL_FAULT :: [SEC-772] :: HASH_MISMATCH_VOTE_130_SHA256_VERIFY_FAILURE</p>
            <p>SECURITY_LOCK :: [SYS-901] :: INTERRUPT_VECTOR_0x00192_HALTED</p>
            <p>NETWORK_ALERT :: [NET-442] :: RE-ROUTING_ATTEMPT_LOGGED_IP_82.112.4.9</p>
            <p>MEM_PURGE :: [SSS-001] :: VOLATILE_BUFFER_WIPED_SUCCESSFULLY</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
