import React from 'react';
import { useSystem } from '../context/SystemContext';
import { Shield, Cpu, Activity, Zap, Network } from 'lucide-react';

const MPCVisualizer = () => {
  const { batch } = useSystem();
  
  const isCompromised = batch?.status === 'CRITICAL_COMPROMISE';
  const isSettled = batch?.status === 'SETTLED';

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800/50 shadow-2xl">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ 
             backgroundImage: `radial-gradient(${isCompromised ? '#ef4444' : '#3b82f6'} 1px, transparent 0)`, 
             backgroundSize: '32px 32px' 
           }}>
      </div>
      
      <div className="relative p-8">
        <div className="flex items-center justify-between mb-10 border-b border-slate-800/50 pb-5">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isCompromised ? 'bg-red-500/10' : 'bg-sky-500/10'}`}>
              <Network size={20} className={isCompromised ? 'text-red-500' : 'text-sky-400'} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">Cryptographic Mesh Topology</h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-full border border-slate-800">
             <div className={`w-1.5 h-1.5 rounded-full ${isCompromised ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`}></div>
             <span className="text-[9px] font-mono text-slate-500 uppercase font-black tracking-widest">Mesh Status: {isCompromised ? 'HALTED' : 'ACTIVE'}</span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-12 relative">
          {/* SVG Connection Lines with Flow Animation */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={isCompromised ? "#7f1d1d" : "#0ea5e9"} stopOpacity="0" />
                <stop offset="50%" stopColor={isCompromised ? "#ef4444" : "#38bdf8"} stopOpacity="0.5" />
                <stop offset="100%" stopColor={isCompromised ? "#7f1d1d" : "#0ea5e9"} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M 20% 40% Q 50% 10% 80% 40%" fill="none" stroke="url(#lineGrad)" strokeWidth="1" className="animate-pulse" />
            <path d="M 20% 40% Q 50% 70% 80% 40%" fill="none" stroke="url(#lineGrad)" strokeWidth="1" />
          </svg>

          <div className="flex gap-16 relative z-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-4 group">
                <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-700 transform group-hover:scale-110 ${
                  isCompromised 
                    ? 'border-red-600 bg-red-950/30 shadow-[0_0_25px_rgba(220,38,38,0.3)] animate-shake' 
                    : 'border-sky-500/40 bg-slate-900 shadow-[0_0_20px_rgba(56,189,248,0.1)]'
                }`}>
                  <Cpu size={28} className={isCompromised ? 'text-red-500' : 'text-sky-400'} />
                  {/* Internal Activity LED */}
                  <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${isCompromised ? 'bg-red-500' : 'bg-sky-400 animate-pulse'}`}></div>
                </div>
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-black font-mono text-slate-500 uppercase tracking-widest">Node_{i.toString().padStart(2, '0')}</span>
                  <p className={`text-[8px] font-mono ${isCompromised ? 'text-red-900' : 'text-sky-900'}`}>0x{Math.random().toString(16).slice(2, 8)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-20 flex flex-col items-center gap-6 transition-all duration-1000 ${isCompromised ? 'scale-110' : ''}`}>
            <div className="relative">
              {/* Outer Rotating Ring */}
              <div className={`absolute -inset-8 border border-dashed rounded-full opacity-20 ${
                isCompromised ? 'border-red-500 animate-[spin_2s_linear_infinite]' : 'border-sky-500 animate-[spin_8s_linear_infinite]'
              }`}></div>
              
              <div className={`p-6 rounded-full border-4 transition-all duration-500 ${
                isCompromised 
                  ? 'border-red-600 bg-red-950 shadow-[0_0_50px_rgba(220,38,38,0.5)] animate-pulse' 
                  : isSettled
                    ? 'border-emerald-500 bg-emerald-950 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                    : 'border-slate-800 bg-slate-900'
              }`}>
                <Shield size={56} className={isCompromised ? 'text-red-500' : isSettled ? 'text-emerald-400' : 'text-slate-700'} />
              </div>

              {/* Status Indicator */}
              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border whitespace-nowrap ${
                isCompromised ? 'bg-red-600 text-white border-red-400' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}>
                {isCompromised ? 'VERIFICATION_FAILED' : isSettled ? 'QUORUM_REACHED' : 'AWAITING_AUTH'}
              </div>
            </div>

            <div className="text-center max-w-sm">
              <p className={`text-xs font-mono font-bold tracking-tight ${isCompromised ? 'breach-text' : 'text-slate-500'}`}>
                {isCompromised 
                  ? 'CRITICAL_ERROR: MASTER_KEY_INTEGRITY_VIOLATED' 
                  : 'FIELD_ORDER: SECP256K1 // SCHEME: 2-OF-3_SSS'}
              </p>
              <div className="mt-3 flex justify-center gap-1">
                 {[1,2,3,4,5,6].map(i => (
                    <div key={i} className={`h-0.5 w-6 rounded-full ${isCompromised ? 'bg-red-900 animate-pulse' : 'bg-slate-800'}`} style={{animationDelay: `${i*100}ms`}}></div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MPCVisualizer;
