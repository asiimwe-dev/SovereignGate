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
  Radio,
  ChevronRight,
  FileCheck,
  Shield
} from 'lucide-react';
import MPCVisualizer from './MPCVisualizer';

const CommandConsole = () => {
  const { batch, loading, sharesSubmitted } = useSystem();
  const { submitShare } = useApi();
  const [submitting, setSubmitting] = useState(null);

  const initialAdmins = [
    { id: 1, role: "Accountant General", name: "L. Okello", share: "7f3e1a2b5c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f" },
    { id: 2, role: "Comm. Treasury Services", name: "J. Musoke", share: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b" },
    { id: 3, role: "BOU Compliance Auditor", name: "S. Asiimwe", share: "f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0" }
  ];

  const [adminShares, setAdminShares] = useState(
    initialAdmins.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.share }), {})
  );

  const handleShareChange = (id, value) => {
    setAdminShares(prev => ({ ...prev, [id]: value }));
  };

  const handleSign = async (admin) => {
    setSubmitting(admin.id);
    try {
      await submitShare(batch.batch_id, admin.id, adminShares[admin.id], `HW-TOKEN-${admin.id}-${Date.now()}`);
    } catch (err) {
      console.error(err);
      alert(err);
    } finally {
      setSubmitting(null);
    }
  };

  if (loading || !batch) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <RefreshCw className="animate-spin text-sky-500" size={56} />
        <p className="mt-6 font-mono text-sm text-sky-500 uppercase tracking-widest animate-pulse font-bold">
          Synchronizing Security Core...
        </p>
      </div>
    );
  }

  const isSettled = batch.status === 'SETTLED';

  return (
    <div className="space-y-10 py-6">
      {/* SUCCESS VISUALIZATION OVERLAY */}
      {isSettled && (
        <div className="relative overflow-hidden rounded-3xl bg-emerald-950/20 border-2 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)] animate-in fade-in zoom-in-95 duration-1000">
           <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
           <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                 <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                 <div className="relative p-6 bg-emerald-500/10 rounded-full border-4 border-emerald-500">
                    <FileCheck className="text-emerald-400" size={64} />
                 </div>
              </div>
              <div className="flex-grow space-y-4 text-center md:text-left">
                 <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">Transaction Authenticated</h2>
                    <p className="text-emerald-400 font-bold tracking-widest uppercase text-sm mt-1">2-of-3 Quorum Verified // Payout Finalized</p>
                 </div>
                 <div className="bg-black/40 border border-emerald-500/30 p-5 rounded-2xl">
                    <p className="text-[10px] font-mono text-emerald-900 uppercase font-black tracking-widest mb-2 flex items-center gap-2">
                       <Shield size={12} /> Digital Signature (ECDSA-SECP256K1)
                    </p>
                    <code className="text-xs font-mono text-emerald-500/80 break-all leading-relaxed block bg-black/20 p-3 rounded-lg border border-emerald-900/20">
                       {batch.combined_signature || "AUTHENTICATION_HASH_PENDING_RELAY"}
                    </code>
                 </div>
              </div>
              <div className="shrink-0 flex flex-col items-center gap-3">
                 <div className="h-12 w-12 rounded-full border-4 border-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="text-emerald-500" size={28} />
                 </div>
                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Settled</span>
              </div>
           </div>
        </div>
      )}

      {/* Ledger Card */}
      <section className={`relative overflow-hidden rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-slate-800 shadow-2xl transition-opacity duration-1000 ${isSettled ? 'opacity-40 grayscale-[0.5]' : ''}`}>
        <div className="p-8 md:p-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <Landmark className="text-sky-400" size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">{batch.funding_vote}</h2>
                <p className="text-xs font-mono text-slate-500 uppercase mt-1 tracking-widest">{batch.batch_id}</p>
              </div>
            </div>
            <StatusBadge status={batch.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 flex flex-col justify-center">
              <p className="text-[11px] text-slate-500 uppercase font-black mb-2 tracking-widest">Source account</p>
              <p className="font-mono text-sm text-sky-400 font-bold">{batch.source_account}</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800 flex flex-col justify-center">
              <p className="text-[11px] text-slate-500 uppercase font-black mb-2 tracking-widest">Authorized payee</p>
              <p className="text-sm font-black text-slate-200 uppercase">{batch.payload.recipient}</p>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/20 md:col-span-2 flex flex-col justify-center shadow-[inset_0_0_30px_rgba(16,185,129,0.03)]">
              <p className="text-[11px] text-emerald-500 uppercase font-black mb-2 tracking-widest">Authorized Disbursement Total</p>
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-black text-emerald-400 font-mono tracking-tighter">
                  {batch.payload.amount.toLocaleString()}
                </p>
                <span className="text-sm font-black text-emerald-500/50 uppercase tracking-widest">UGX</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MPC Administrative Rack */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-opacity duration-1000 ${isSettled ? 'opacity-30 pointer-events-none' : ''}`}>
        {initialAdmins.map((admin) => {
          const isSigned = sharesSubmitted.includes(admin.id);
          const isProcessing = submitting === admin.id;

          return (
            <div key={admin.id} className={`relative overflow-hidden rounded-[2rem] border-2 transition-all duration-700 ${
              isSigned ? 'border-emerald-500/50 bg-emerald-950/5' : 'border-slate-800 bg-slate-900/20 shadow-xl'
            }`}>
              <div className="p-8 space-y-8">
                <div className="flex justify-between items-center">
                  <div className={`p-3 rounded-xl border transition-colors ${isSigned ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                    <UserCheck size={24} />
                  </div>
                  <span className="text-xs font-mono text-slate-600 font-black tracking-widest uppercase">Port 0{admin.id}</span>
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-100 uppercase tracking-tight leading-tight">{admin.role}</h3>
                  <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mt-1.5 font-bold">{admin.name}</p>
                </div>

                {/* Share Input Field */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <ChevronRight size={12} className="text-sky-500" /> Auth Share Entry
                    </label>
                  </div>
                  <div className="relative group/input">
                    <input 
                      type="password"
                      value={adminShares[admin.id]}
                      onChange={(e) => handleShareChange(admin.id, e.target.value)}
                      disabled={isSigned || batch.status === 'SETTLED'}
                      className="w-full bg-black/40 border-2 border-slate-800 rounded-xl px-4 py-3.5 text-xs font-mono text-sky-400 focus:outline-none focus:border-sky-500/50 transition-all placeholder:text-slate-800 group-hover/input:border-slate-700"
                      placeholder="HEX_AUTH_KEY"
                    />
                    {isSigned && (
                      <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-[3px] rounded-lg flex items-center justify-center border border-emerald-500/30 animate-in fade-in duration-500">
                        <span className="text-[10px] font-mono text-emerald-400 font-black tracking-widest uppercase">Encrypted // Locked</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleSign(admin)}
                  disabled={isProcessing || isSigned || batch.status === 'SETTLED' || batch.status === 'CRITICAL_COMPROMISE'}
                  className={`w-full py-4.5 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.97] ${
                    isSigned 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-inner' 
                      : 'bg-slate-950 border-2 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-sky-400 hover:border-sky-500/50 shadow-2xl'
                  }`}
                >
                  {isProcessing ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : isSigned ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Key size={18} />
                  )}
                  {isSigned ? "Access Granted" : "Commit Share"}
                </button>
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
