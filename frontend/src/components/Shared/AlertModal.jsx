import React from 'react';
import { AlertTriangle, Lock, ShieldX, Database } from 'lucide-react';

const AlertModal = () => {
  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden crimson-meltdown flex items-center justify-center p-4 backdrop-blur-xl">
      {/* Cinematic Glitch Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none animate-glitch bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      <div className="max-w-4xl w-full relative animate-shake">
        {/* Main Alarm Box */}
        <div className="bg-black/80 border-4 border-red-600 rounded-2xl shadow-[0_0_100px_rgba(220,38,38,0.5)] overflow-hidden">
          {/* Aggressive Header */}
          <div className="bg-red-600 p-6 flex items-center gap-4 text-white">
            <div className="animate-pulse">
              <AlertTriangle size={64} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-4xl font-black font-mono tracking-[0.2em] uppercase leading-none">
                [ CRITICAL INTEGRITY COMPROMISE ]
              </h1>
              <p className="mt-2 text-red-100 font-bold tracking-widest text-lg">
                UNAUTHORIZED DATABASE PAYLOAD MUTATION DETECTED
              </p>
            </div>
          </div>

          <div className="p-10 space-y-8">
            {/* The Diff Comparison Engine */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-500 font-mono text-sm uppercase tracking-widest">
                <Database size={16} />
                <span>Payload Integrity Verification Failed</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Expected State */}
                <div className="bg-zinc-900 border border-emerald-900/50 p-6 rounded-xl relative group">
                  <div className="absolute top-0 right-0 bg-emerald-900/20 text-emerald-500 px-3 py-1 rounded-bl-lg text-[10px] font-black uppercase tracking-tighter">
                    Expected Ledger State
                  </div>
                  <pre className="text-emerald-400 font-mono text-sm overflow-hidden text-ellipsis">
                    {JSON.stringify({ recipient: "World Bank (IDA)" }, null, 2)}
                  </pre>
                </div>

                {/* Found State (Compromised) */}
                <div className="bg-red-950/20 border border-red-500/50 p-6 rounded-xl relative animate-pulse shadow-[inset_0_0_20px_rgba(220,38,38,0.2)]">
                  <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 rounded-bl-lg text-[10px] font-black uppercase tracking-tighter">
                    Corrupted State Found
                  </div>
                  <pre className="text-red-500 font-mono text-sm font-bold overflow-hidden text-ellipsis">
                    {JSON.stringify({ recipient: "Roadway Company Ltd" }, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Lockout Protocol */}
            <div className="border-t border-red-900/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex gap-8">
                <div className="flex items-center gap-2 text-red-400 font-mono text-xs uppercase tracking-[0.2em]">
                  <Lock size={16} />
                  <span>System Arrest Active</span>
                </div>
                <div className="flex items-center gap-2 text-red-400 font-mono text-xs uppercase tracking-[0.2em]">
                  <ShieldX size={16} />
                  <span>Gateway Purged</span>
                </div>
              </div>
              <div className="bg-red-600/10 border border-red-600 text-red-600 px-6 py-2 font-black text-sm animate-pulse uppercase tracking-widest italic">
                Awaiting Forensics Override
              </div>
            </div>
          </div>
        </div>

        {/* Aggregate Error Logs (Small scrolling text) */}
        <div className="mt-8 overflow-hidden h-12 mask-fade-out pointer-events-none">
          <div className="text-[10px] font-mono text-red-900/60 flex flex-col gap-1 animate-[marquee_2s_linear_infinite]">
            <p>LOG :: [SEC-772] :: HASH_MISMATCH_VOTE_130_SHA256_VERIFY_FAILURE</p>
            <p>LOG :: [SYS-901] :: INTERRUPT_VECTOR_0x00192_HALTED</p>
            <p>LOG :: [NET-442] :: RE-ROUTING_ATTEMPT_LOGGED_IP_82.112.4.9</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
