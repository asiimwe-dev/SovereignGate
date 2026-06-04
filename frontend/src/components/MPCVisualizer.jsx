import React from 'react';
import { useSystem } from '../context/SystemContext';
import { Shield, Cpu, Activity } from 'lucide-react';

const MPCVisualizer = () => {
  const { batch } = useSystem();
  
  const isCompromised = batch?.status === 'CRITICAL_COMPROMISE';

  return (
    <section className="bg-slate-950/80 p-6 rounded-xl border border-slate-800 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      
      <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
        <Activity size={18} className="text-blue-500" />
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">MPC Cryptographic Mesh</h3>
      </div>

      <div className="flex flex-col items-center justify-center py-8 relative">
        <div className="flex gap-12 relative z-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-500 ${
                isCompromised ? 'border-red-500 bg-red-900/20' : 'border-blue-500 bg-blue-900/20 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
              }`}>
                <Cpu size={24} className={isCompromised ? 'text-red-500' : 'text-blue-400'} />
              </div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Node {i}</span>
            </div>
          ))}
        </div>

        <svg className="absolute top-1/2 left-0 w-full h-24 -translate-y-1/2 pointer-events-none">
          <path d="M 100 50 L 300 50 L 500 50" fill="none" stroke={isCompromised ? "#ef4444" : "#3b82f6"} strokeWidth="2" strokeDasharray="4" />
        </svg>

        <div className={`mt-12 flex flex-col items-center gap-3 transition-all duration-700 ${isCompromised ? 'scale-110' : ''}`}>
          <div className={`p-4 rounded-full border-4 ${
            isCompromised ? 'border-red-600 bg-red-950 animate-pulse' : 'border-treasury-gold bg-slate-900'
          }`}>
            <Shield size={48} className={isCompromised ? 'text-red-500' : 'text-treasury-gold'} />
          </div>
          <div className="text-center">
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isCompromised ? 'text-red-500' : 'text-slate-500'}`}>
              {isCompromised ? 'Verification Failed' : 'Security Kernel'}
            </span>
            <p className={`text-xs font-mono ${isCompromised ? 'text-red-400' : 'text-blue-400'}`}>
              {isCompromised ? 'HASH_MISMATCH:PAYLOAD_INTEGRITY_VIOLATION' : 'POLYNOMIAL_FIELD: SECP256K1'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MPCVisualizer;
