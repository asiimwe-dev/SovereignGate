import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { useApi } from '../hooks/useApi';
import StatusBadge from './Shared/StatusBadge';
import { ShieldCheck, UserCheck, Key, RefreshCw, Landmark, Cpu, Hash, ExternalLink, HardDrive, CheckCircle2 } from 'lucide-react';
import MPCVisualizer from './MPCVisualizer';

const CommandConsole = () => {
  const { batch, loading, sharesSubmitted } = useSystem();
  const { submitShare } = useApi();
  const [submitting, setSubmitting] = useState(null);

  if (loading || !batch) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-950">
        <div className="relative">
          <RefreshCw className="animate-spin text-sky-500" size={64} />
          <div className="absolute inset-0 blur-2xl bg-sky-500/20 animate-pulse"></div>
        </div>
        <p className="mt-8 terminal-text text-sm tracking-[0.3em] uppercase animate-pulse">Establishing Secure Uplink...</p>
      </div>
    );
  }

  const admins = [
    { id: 1, role: "Accountant General", name: "L. Okello", share: "7f3e1a2b5c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f" },
    { id: 2, role: "Comm. Treasury Services", name: "J. Musoke", share: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b" },
    { id: 3, role: "BOU Compliance Auditor", name: "S. Asiimwe", share: "f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0" }
  ];

  const handleSign = async (admin) => {
    setSubmitting(admin.id);
    try {
      await submitShare(batch.batch_id, admin.id, admin.share, `HW-TOKEN-${admin.id}-${Date.now()}`);
    } catch (err) {
      alert(err);
    } finally {
      setSubmitting(null);
    }
  };

  const dummyHash = "a3f2b1c0d9e8f7a6b5c4d3e2f1a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Enterprise Ledger Card */}
      <section className="fortress-glass p-8 rounded-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-sky-500/10 rounded-2xl border border-sky-500/20 shadow-inner">
              <Landmark className="text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-100">{batch.funding_vote}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs font-mono text-slate-500 tracking-wider uppercase">Batch ID:</span>
                <span className="text-xs font-mono text-sky-500 bg-sky-500/5 px-2 py-0.5 rounded border border-sky-500/10">
                  {batch.batch_id}
                </span>
              </div>
            </div>
          </div>
          <StatusBadge status={batch.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="space-y-2 p-5 bg-slate-950/40 rounded-xl border border-slate-800/50 hover:border-sky-500/30 transition-colors group/item">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-2">
              <Hash size={12} /> Origin Account
            </p>
            <p className="font-mono text-sm text-sky-400 group-hover/item:text-sky-300 transition-colors">{batch.source_account}</p>
          </div>
          <div className="space-y-2 p-5 bg-slate-950/40 rounded-xl border border-slate-800/50 hover:border-sky-500/30 transition-colors group/item">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest flex items-center gap-2">
              <ExternalLink size={12} /> Authorized Payee
            </p>
            <p className="font-bold text-slate-200 group-hover/item:text-white transition-colors">{batch.payload.recipient}</p>
          </div>
          <div className="space-y-2 p-5 bg-slate-900/60 rounded-xl border border-sky-500/20 shadow-[inset_0_0_20px_rgba(14,165,233,0.05)]">
            <p className="text-[10px] text-sky-500 uppercase font-black tracking-widest">Total Disbursement</p>
            <p className="text-3xl font-black text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
              {batch.payload.amount.toLocaleString()} <span className="text-xs font-normal opacity-50 ml-1">UGX</span>
            </p>
          </div>
        </div>

        {/* Truncated Hash with Tooltip */}
        <div className="mt-8 pt-6 border-t border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3 group/hash relative">
            <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              Integrity Hash: 
              <span className="ml-2 text-emerald-500/80">{dummyHash.slice(0, 8)}...{dummyHash.slice(-8)}</span>
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-0 mb-3 invisible group-hover/hash:visible opacity-0 group-hover/hash:opacity-100 transition-all duration-300 translate-y-2 group-hover/hash:translate-y-0">
               <div className="bg-slate-900 border border-sky-500/30 p-3 rounded-lg shadow-2xl w-96">
                 <p className="text-[9px] text-sky-500 font-black uppercase mb-1 tracking-widest">Full SHA-256 Checksum</p>
                 <code className="text-[10px] break-all text-slate-300 font-mono leading-relaxed">{dummyHash}</code>
               </div>
               <div className="w-3 h-3 bg-slate-900 border-r border-b border-sky-500/30 rotate-45 -mt-1.5 ml-6"></div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 uppercase">
             <Cpu size={12} />
             <span>Hardware Kernel V4.2 Locked</span>
          </div>
        </div>
      </section>

      {/* MPC Hardware Bays */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {admins.map((admin) => {
          const isSigned = sharesSubmitted.includes(admin.id);
          const isProcessing = submitting === admin.id;

          return (
            <div key={admin.id} className="relative group/bay">
              <div className={`fortress-glass p-6 rounded-2xl transition-all duration-700 border-2 ${
                isSigned 
                  ? 'border-emerald-500 bg-emerald-950/10 shadow-[0_0_30px_rgba(16,185,129,0.15)]' 
                  : 'border-slate-800 border-dashed hover:border-slate-700'
              }`}>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 shadow-inner group-hover/bay:border-sky-500/30 transition-colors">
                    {isSigned ? (
                      <HardDrive className="text-emerald-400 animate-pulse" size={24} />
                    ) : (
                      <Key className="text-slate-700 group-hover/bay:text-slate-500 transition-colors" size={24} />
                    )}
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest uppercase border ${
                    isSigned ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-950 text-slate-600 border-slate-800'
                  }`}>
                    BAY_{admin.id.toString().padStart(2, '0')}
                  </div>
                </div>

                <div className="space-y-1 mb-8">
                  <h3 className="font-bold text-sm tracking-tight">{admin.role}</h3>
                  <p className="text-xs text-slate-500 font-mono tracking-tighter">{admin.name}</p>
                </div>

                {isSigned ? (
                  <div className="flex items-center justify-between py-2 border-t border-emerald-500/20 animate-in slide-in-from-bottom-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                      <CheckCircle2 size={14} />
                      TOKEN LOCKED
                    </div>
                    <div className="h-1 w-24 bg-emerald-900/50 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-400 w-full shadow-[0_0_8px_#34d399]"></div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSign(admin)}
                    disabled={isProcessing || batch.status === 'SETTLED' || batch.status === 'CRITICAL_COMPROMISE'}
                    className="w-full relative py-3 group/btn overflow-hidden rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/50 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center justify-center gap-3">
                      {isProcessing ? (
                        <>
                          <RefreshCw size={16} className="animate-spin text-sky-500" />
                          <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest">Processing...</span>
                        </>
                      ) : (
                        <>
                          <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping"></div>
                          <span className="text-[10px] font-black text-slate-400 group-hover/btn:text-sky-400 uppercase tracking-[0.2em] transition-colors">
                            Insert Security Token
                          </span>
                        </>
                      )}
                    </div>
                  </button>
                )}
              </div>
              
              {/* Decorative Physical Detail */}
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-12 bg-slate-800 rounded-full group-hover/bay:bg-sky-500/30 transition-colors"></div>
            </div>
          );
        })}
      </div>

      <MPCVisualizer />
    </div>
  );
};

export default CommandConsole;
