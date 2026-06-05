import React from 'react';
import { useSystem } from '../context/SystemContext';
import { Shield, ShieldAlert, Cpu, Lock, Unlock, CheckCircle2, Server } from 'lucide-react';

const MPCVisualizer = () => {
  const { batch, selectedBatch, sharesSubmitted } = useSystem();
  
  const currentBatch = selectedBatch || batch;
  const isCompromised = currentBatch?.status === 'CRITICAL_COMPROMISE';
  const isSettled = currentBatch?.status === 'SETTLED';
  
  // Calculate shares submitted based on sharesSubmitted array
  const activeShares = sharesSubmitted || [];
  const quorumCount = activeShares.length;
  const isQuorumMet = quorumCount >= 2;

  // Authorities mapping for display inside nodes
  const authorities = [
    { id: 1, label: "Accountant Gen.", short: "AG" },
    { id: 2, label: "MoFPED Comm.", short: "MF" },
    { id: 3, label: "BoU Auditor", short: "BoU" }
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#090d16] border border-[#1f2937] p-6 shadow-xl">
      {/* Dynamic Radar/Scan lines for security aesthetic */}
      <div className="absolute inset-0 opacity-15 pointer-events-none z-0" 
           style={{ 
             backgroundImage: `radial-gradient(${isCompromised ? '#ef4444' : isSettled ? '#10b981' : '#c5a059'} 1.5px, transparent 0)`, 
             backgroundSize: '24px 24px' 
           }}>
      </div>
      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#c5a059]/10 to-transparent pointer-events-none z-0 animate-scan-line top-0"></div>

      <div className="relative z-10 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1f2937]/50 pb-4">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg ${
              isCompromised ? 'bg-red-500/10 text-red-500' : 
              isSettled ? 'bg-emerald-500/10 text-emerald-400' : 
              'bg-[#c5a059]/10 text-[#c5a059]'
            }`}>
              {isCompromised ? <ShieldAlert size={18} className="animate-bounce" /> : <Shield size={18} />}
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">
                Multi-Party Computation (MPC) Graph
              </h4>
              <p className="text-[11px] text-slate-500 font-mono tracking-tight mt-0.5">
                Shamir's Secret Sharing (2-of-3 Quorum)
              </p>
            </div>
          </div>
          <span className={`font-mono text-xs px-3 py-1 rounded-full uppercase font-black border ${
            isCompromised ? 'bg-red-950/20 text-red-500 border-red-900/30' :
            isSettled ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30' :
            isQuorumMet ? 'bg-amber-950/20 text-[#c5a059] border-[#c5a059]/30 animate-pulse-gold' :
            'bg-slate-900 text-slate-400 border-[#1f2937]'
          }`}>
            {isCompromised ? "Isolation Protocol" :
             isSettled ? "Clearing Settled" :
             isQuorumMet ? "Quorum Authenticated" :
             `Awaiting Quorum (${quorumCount}/2)`}
          </span>
        </div>

        {/* Visual Graph Layout */}
        <div className="relative h-64 md:h-56 flex items-center justify-center">
          
          {/* SVG Connection Paths */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 500 220">
            <defs>
              {/* Gradients */}
              <linearGradient id="glow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1f2937" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#c5a059" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Path 1: Node 1 (80, 45) -> Vault (380, 110) */}
            <path 
              d="M 120 45 Q 240 30 360 95" 
              fill="none" 
              stroke={isCompromised ? "#7f1d1d" : activeShares.includes(1) ? "#c5a059" : "#1f2937"} 
              strokeWidth={activeShares.includes(1) ? "2.5" : "1.5"}
              className={activeShares.includes(1) && !isCompromised && !isSettled ? "animate-laser-flow" : ""}
            />

            {/* Path 2: Node 2 (80, 110) -> Vault (380, 110) */}
            <path 
              d="M 120 110 L 360 110" 
              fill="none" 
              stroke={isCompromised ? "#7f1d1d" : activeShares.includes(2) ? "#c5a059" : "#1f2937"} 
              strokeWidth={activeShares.includes(2) ? "2.5" : "1.5"}
              className={activeShares.includes(2) && !isCompromised && !isSettled ? "animate-laser-flow" : ""}
            />

            {/* Path 3: Node 3 (80, 175) -> Vault (380, 110) */}
            <path 
              d="M 120 175 Q 240 190 360 125" 
              fill="none" 
              stroke={isCompromised ? "#7f1d1d" : activeShares.includes(3) ? "#c5a059" : "#1f2937"} 
              strokeWidth={activeShares.includes(3) ? "2.5" : "1.5"}
              className={activeShares.includes(3) && !isCompromised && !isSettled ? "animate-laser-flow" : ""}
            />
          </svg>

          {/* Graph Nodes Layer */}
          <div className="absolute inset-0 w-full h-full flex justify-between items-center px-4 z-10">
            
            {/* Left Column: 3 Authority Nodes */}
            <div className="flex flex-col justify-between h-full py-2 w-36">
              {authorities.map((auth) => {
                const isSigned = activeShares.includes(auth.id);
                return (
                  <div key={auth.id} className="flex items-center gap-2.5">
                    <div 
                      className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center cursor-default shadow-md ${
                        isCompromised ? 'border-red-900 bg-red-950/20 text-red-500 animate-shake-extreme' :
                        isSigned ? 'border-[#c5a059] bg-[#c5a059]/10 text-[#c5a059] shadow-[#c5a059]/10' :
                        'border-[#1f2937] bg-slate-900/60 text-slate-500 hover:border-slate-800'
                      }`}
                      title={auth.label}
                    >
                      <Cpu size={18} className={isSigned && !isCompromised ? "animate-pulse" : ""} />
                      <span className="text-[9px] font-black uppercase font-mono tracking-tighter mt-0.5">{auth.short}</span>
                    </div>
                    <div>
                      <p className={`text-xs font-black uppercase leading-tight ${isSigned ? 'text-slate-200' : 'text-slate-500'}`}>
                        Node {auth.id}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono leading-none mt-0.5">
                        {isSigned ? "COMMITTED" : "AWAITING"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Central Clearing Gate Vault */}
            <div className="flex flex-col items-center justify-center mr-8">
              <div 
                className={`w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center p-3 relative ${
                  isCompromised ? 'border-red-600 bg-red-950/30 text-red-500 animate-pulse' :
                  isSettled ? 'border-emerald-500 bg-emerald-950/30 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.25)]' :
                  isQuorumMet ? 'border-[#c5a059] bg-[#c5a059]/10 text-[#c5a059] shadow-[0_0_20px_rgba(197,160,89,0.2)]' :
                  'border-[#1f2937] bg-slate-950 text-slate-600'
                }`}
              >
                {/* Glow rings */}
                {isQuorumMet && !isCompromised && !isSettled && (
                  <span className="absolute inset-0 rounded-2xl border border-[#c5a059] animate-ping opacity-25"></span>
                )}
                
                {isCompromised ? <ShieldAlert size={32} className="animate-bounce" /> :
                 isSettled ? <CheckCircle2 size={32} /> :
                 isQuorumMet ? <Unlock size={30} className="text-[#c5a059]" /> :
                 <Lock size={28} />}
                
                <span className="text-[9px] font-black font-mono tracking-widest uppercase mt-1 text-center leading-none">
                  {isCompromised ? "BLOCKED" : isSettled ? "SETTLED" : "VAULT"}
                </span>
              </div>
              <div className="mt-2.5 text-center">
                <p className="text-xs font-black uppercase tracking-wider text-slate-300">
                  {isCompromised ? "隔離プロトコル" : "RTGS Clearing Gate"}
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {isCompromised ? "CRITICAL LOCKOUT" : 
                   isSettled ? "SETTLEMENT COMPLETE" :
                   isQuorumMet ? "AUTH READY" : "LOCKED"}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default MPCVisualizer;
