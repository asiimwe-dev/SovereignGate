import React from 'react';
import { useSystem } from '../context/SystemContext';
import { Shield, Cpu, Activity, Network } from 'lucide-react';

const MPCVisualizer = () => {
  const { batch } = useSystem();
  
  const isCompromised = batch?.status === 'CRITICAL_COMPROMISE';
  const isSettled = batch?.status === 'SETTLED';

  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800/50 shadow-2xl">
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
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Cryptographic Mesh</h3>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-12 relative">
          {/* Fixed SVG Paths using absolute coordinates */}
          <svg viewBox="0 0 500 200" className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={isCompromised ? "#7f1d1d" : "#0ea5e9"} stopOpacity="0" />
                <stop offset="50%" stopColor={isCompromised ? "#ef4444" : "#38bdf8"} stopOpacity="0.5" />
                <stop offset="100%" stopColor={isCompromised ? "#7f1d1d" : "#0ea5e9"} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M 100 100 Q 250 50 400 100" fill="none" stroke="url(#lineGrad)" strokeWidth="2" className="animate-pulse" />
            <path d="M 100 100 Q 250 150 400 100" fill="none" stroke="url(#lineGrad)" strokeWidth="2" />
          </svg>

          <div className="flex gap-16 relative z-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-4 group">
                <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-700 transform group-hover:scale-110 ${
                  isCompromised 
                    ? 'border-red-600 bg-red-950/30 animate-shake' 
                    : 'border-sky-500/40 bg-slate-900'
                }`}>
                  <Cpu size={28} className={isCompromised ? 'text-red-500' : 'text-sky-400'} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MPCVisualizer;
