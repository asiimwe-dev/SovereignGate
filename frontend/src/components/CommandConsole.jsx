import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { useApi } from '../hooks/useApi';
import StatusBadge from './Shared/StatusBadge';
import { 
  ShieldCheck, 
  UserCheck, 
  Key, 
  RefreshCw, 
  Landmark, 
  Cpu, 
  Hash, 
  ExternalLink, 
  HardDrive, 
  CheckCircle2,
  Fingerprint,
  Radio
} from 'lucide-react';
import MPCVisualizer from './MPCVisualizer';

const CommandConsole = () => {
  const { batch, loading, sharesSubmitted } = useSystem();
  const { submitShare } = useApi();
  const [submitting, setSubmitting] = useState(null);

  if (loading || !batch) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="relative">
          <RefreshCw className="animate-spin text-sky-500" size={48} />
          <div className="absolute inset-0 blur-xl bg-sky-500/20 animate-pulse"></div>
        </div>
        <p className="mt-6 font-mono text-[10px] text-sky-500 tracking-[0.4em] uppercase animate-pulse">
          Synchronizing Core...
        </p>
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
      console.error(err);
    } finally {
      setSubmitting(null);
    }
  };

  const dummyHash = "a3f2b1c0d9e8f7a6b5c4d3e2f1a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8";

  return (
    <div className="space-y-10 py-4">
      {/* Ledger Glass Card */}
      <section className="relative overflow-hidden group rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/[0.02] to-transparent pointer-events-none"></div>
        
        <div className="p-8 md:p-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="flex items-start gap-6">
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] group-hover:border-sky-500/30 transition-colors duration-500">
                <Landmark className="text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]" size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight text-white">{batch.funding_vote}</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Index:</span>
                    <span className="text-[10px] font-mono text-sky-400 font-bold">{batch.batch_id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Radio size={12} className="text-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-emerald-500/70 uppercase tracking-widest font-black">Live Data Relay</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-auto">
              <StatusBadge status={batch.status} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className="relative group/item p-6 rounded-2xl bg-slate-950/40 border border-slate-800/50 hover:border-sky-500/20 transition-all duration-500">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-3 flex items-center gap-2">
                <HardDrive size={12} /> Source Reserve
              </p>
              <p className="font-mono text-sm text-sky-400 font-medium">{batch.source_account}</p>
            </div>
            
            <div className="relative group/item p-6 rounded-2xl bg-slate-950/40 border border-slate-800/50 hover:border-sky-500/20 transition-all duration-500">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mb-3 flex items-center gap-2">
                <Fingerprint size={12} /> Verified Payee
              </p>
              <p className="font-bold text-slate-200 tracking-tight">{batch.payload.recipient}</p>
            </div>

            <div className="relative p-6 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/10 shadow-[inset_0_0_30px_rgba(16,185,129,0.02)]">
              <p className="text-[10px] text-emerald-500 uppercase font-black tracking-[0.2em] mb-3">Disbursement Total</p>
              <p className="text-4xl font-black text-emerald-400 tabular-nums tracking-tighter drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]">
                {batch.payload.amount.toLocaleString()} <span className="text-xs font-normal opacity-40 ml-1 tracking-normal">UGX</span>
              </p>
            </div>
          </div>

          {/* SHA-256 Forensic Footer */}
          <div className="mt-10 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="group/hash relative cursor-help">
              <div className="flex items-center gap-4 px-4 py-2 bg-slate-950 rounded-xl border border-slate-800 group-hover/hash:border-emerald-500/30 transition-all duration-500">
                <Hash size={14} className="text-slate-500 group-hover/hash:text-emerald-500 transition-colors" />
                <span className="text-[10px] font-mono text-slate-400 tracking-tighter overflow-hidden text-ellipsis max-w-[200px] sm:max-w-none">
                  {dummyHash.slice(0, 16)}<span className="opacity-20 text-slate-600">...</span>{dummyHash.slice(-16)}
                </span>
              </div>
              {/* Pro Max Tooltip */}
              <div className="absolute bottom-full left-0 mb-4 invisible group-hover/hash:visible opacity-0 group-hover/hash:opacity-100 transition-all duration-500 translate-y-2 group-hover/hash:translate-y-0 z-50">
                 <div className="bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] w-80 lg:w-[400px]">
                   <div className="flex items-center justify-between mb-3">
                     <p className="text-[10px] text-sky-500 font-black uppercase tracking-widest">Full Cryptographic Checksum</p>
                     <div className="px-2 py-0.5 bg-sky-500/10 rounded text-[9px] text-sky-400 border border-sky-500/20 font-bold">SHA-256</div>
                   </div>
                   <code className="text-[11px] block break-all text-slate-400 font-mono leading-relaxed bg-black/40 p-3 rounded-lg border border-slate-800">
                    {dummyHash}
                   </code>
                 </div>
                 <div className="w-4 h-4 bg-slate-900 border-r border-b border-slate-700 rotate-45 -mt-2 ml-8"></div>
              </div>
            </div>

            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/5 rounded-full border border-emerald-500/10">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>
                 <span className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest">Integrity Valid</span>
               </div>
               <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                  <Cpu size={14} />
                  <span>V-KERNEL 4.0</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* MPC Hardware Rack */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {admins.map((admin) => {
          const isSigned = sharesSubmitted.includes(admin.id);
          const isProcessing = submitting === admin.id;

          return (
            <div key={admin.id} className="relative group/bay">
              <div className={`relative overflow-hidden rounded-3xl transition-all duration-1000 border-2 ${
                isSigned 
                  ? 'border-emerald-500 bg-emerald-950/10 shadow-[0_0_40px_rgba(16,185,129,0.1)]' 
                  : 'border-slate-800 bg-slate-900/20 border-dashed hover:border-slate-700 hover:bg-slate-900/40'
              }`}>
                {/* Hardware Rack Detail */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-800/50 flex">
                   <div className={`h-full w-1/3 border-r border-slate-900 ${isSigned ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                   <div className={`h-full w-1/3 border-r border-slate-900 ${isSigned ? 'bg-emerald-500/60' : 'bg-slate-700'}`}></div>
                   <div className={`h-full w-1/3 ${isSigned ? 'bg-emerald-500/30' : 'bg-slate-700'}`}></div>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div className={`p-4 rounded-2xl border transition-all duration-700 ${
                      isSigned ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-slate-950 border-slate-800'
                    }`}>
                      {isSigned ? (
                        <CheckCircle2 className="text-emerald-400" size={28} />
                      ) : (
                        <Key className="text-slate-600 group-hover/bay:text-sky-500 transition-colors" size={28} />
                      )}
                    </div>
                    <div className="text-right">
                       <p className={`text-[9px] font-black tracking-widest uppercase mb-1 ${isSigned ? 'text-emerald-500' : 'text-slate-600'}`}>
                         MPC_PORT_{admin.id.toString().padStart(2, '0')}
                       </p>
                       <div className="flex justify-end gap-1">
                          {[1,2,3].map(led => (
                            <div key={led} className={`w-1.5 h-1.5 rounded-full ${isSigned ? 'bg-emerald-500 shadow-[0_0_5px_#10b981]' : 'bg-slate-800'}`}></div>
                          ))}
                       </div>
                    </div>
                  </div>

                  <div className="space-y-1 mb-10">
                    <h3 className="font-black text-slate-100 tracking-tight text-base uppercase">{admin.role}</h3>
                    <p className="text-xs text-slate-500 font-mono italic tracking-tighter">{admin.name}</p>
                  </div>

                  {isSigned ? (
                    <div className="py-4 px-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between animate-in fade-in zoom-in-95 duration-700">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Share Locked</span>
                        <span className="text-[10px] font-mono text-emerald-400/60 truncate w-32">0x{admin.share.slice(0, 12)}...</span>
                      </div>
                      <div className="relative h-10 w-10 flex items-center justify-center">
                         <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
                         <ShieldCheck className="text-emerald-400 relative z-10" size={20} />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSign(admin)}
                      disabled={isProcessing || batch.status === 'SETTLED' || batch.status === 'CRITICAL_COMPROMISE'}
                      aria-label={`Insert security token for ${admin.name}`}
                      className="w-full relative group/btn overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-500/40 py-4 transition-all duration-300 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none shadow-lg shadow-black/40"
                    >
                      <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                      <div className="relative flex items-center justify-center gap-3">
                        {isProcessing ? (
                          <>
                            <div className="relative h-5 w-5">
                              <RefreshCw size={20} className="animate-spin text-sky-500" />
                            </div>
                            <span className="text-xs font-black text-sky-500 uppercase tracking-[0.2em]">Authenticating</span>
                          </>
                        ) : (
                          <>
                            <UserCheck size={18} className="text-slate-500 group-hover/btn:text-sky-400 transition-colors" />
                            <span className="text-xs font-black text-slate-400 group-hover/btn:text-sky-400 uppercase tracking-[0.2em] transition-colors">
                              Insert Touch Key
                            </span>
                          </>
                        )}
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <MPCVisualizer />
    </div>
  );
};

export default CommandConsole;
