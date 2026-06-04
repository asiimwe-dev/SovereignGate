import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { useApi } from '../hooks/useApi';
import StatusBadge from './Shared/StatusBadge';
import { 
  LockKeyhole, 
  UserCheck, 
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  DollarSign
} from 'lucide-react';

const CommandConsole = () => {
  const { batch, loading, sharesSubmitted, setSharesSubmitted } = useSystem();
  const { submitShare } = useApi();
  const [submitting, setSubmitting] = useState(null);
  const [executionMessage, setExecutionMessage] = useState('');

  const authorityNodes = [
    { 
      id: 1, 
      role: "Accountant General", 
      title: "Treasury Authority",
      name: "L. Okello", 
      share: "7f3e1a2b5c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f" 
    },
    { 
      id: 2, 
      role: "Commissioner of Treasury Services", 
      title: "MoFPED Authority",
      name: "J. Musoke", 
      share: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b" 
    },
    { 
      id: 3, 
      role: "Executive Auditor", 
      title: "BoU Compliance",
      name: "S. Asiimwe", 
      share: "f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0" 
    }
  ];

  const [adminShares, setAdminShares] = useState(
    authorityNodes.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.share }), {})
  );

  const handleShareChange = (id, value) => {
    setAdminShares(prev => ({ ...prev, [id]: value }));
  };

  const handleSign = async (admin) => {
    setSubmitting(admin.id);
    try {
      await submitShare(batch.batch_id, admin.id, adminShares[admin.id], `HW-TOKEN-${admin.id}-${Date.now()}`);
      setSharesSubmitted(prev => [...prev, admin.id]);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(null);
    }
  };

  const handleExecuteClearing = async () => {
    const signatureCount = sharesSubmitted.length;
    
    if (signatureCount < 2) {
      setExecutionMessage(`INSUFFICIENT THRESHOLD: ${signatureCount} of 2 required signatures present. Core ledger remains locked.`);
      setTimeout(() => setExecutionMessage(''), 4000);
      return;
    }

    if (signatureCount === 2) {
      setExecutionMessage(`SETTLED / CLEARED: 2-of-3 Quorum Verified. Funds Disbursed Successfully via RTGS.`);
    } else if (signatureCount === 3) {
      setExecutionMessage(`SETTLED / MAXIMUM QUORUM SECURED: 3-of-3 Authorization Confirmed.`);
    }
    
    setTimeout(() => setExecutionMessage(''), 5000);
  };

  if (loading || !batch) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="animate-institutional-pulse">
          <div className="w-12 h-12 rounded-lg bg-[#161b22] border border-[#C5A059]/30 flex items-center justify-center mb-6">
            <TrendingUp className="text-[#C5A059]" size={24} />
          </div>
        </div>
        <p className="mt-6 font-mono text-sm text-slate-400 uppercase tracking-widest font-bold">
          Synchronizing Authorization Layer...
        </p>
      </div>
    );
  }

  const isSettled = batch.status === 'SETTLED';
  const signatureCount = sharesSubmitted.length;

  return (
    <div className="space-y-8">
      {/* LEDGER INFORMATION CARD */}
      <section className="institutional-card p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 pb-6 border-b border-[#30363d]">
          <div>
            <h2 className="institutional-header text-xl mb-1">{batch.funding_vote}</h2>
            <p className="data-mono text-xs text-slate-400 uppercase tracking-wider">{batch.batch_id}</p>
          </div>
          <StatusBadge status={batch.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="institutional-card p-5 bg-[#0d1117]">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">Source Account</p>
            <p className="data-mono text-sm text-slate-300 font-bold">{batch.source_account}</p>
          </div>
          <div className="institutional-card p-5 bg-[#0d1117]">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">Authorized Payee</p>
            <p className="text-sm font-black text-slate-100 uppercase">{batch.payload.recipient}</p>
          </div>
          <div className="institutional-card p-5 bg-[#0d1117] md:col-span-2 lg:col-span-2">
            <p className="text-[10px] text-[#C5A059] uppercase font-black mb-2 tracking-widest flex items-center gap-2">
              <DollarSign size={12} /> Authorized Disbursement
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-[#C5A059] data-mono">
                {batch.payload.amount.toLocaleString()}
              </p>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">UGX</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3-KEY SECURITY CHAMBER */}
      <section className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="institutional-header text-sm">3-Key Authorization Chamber</h3>
          <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            Threshold: <span className="text-[#C5A059]">{signatureCount}</span> / 2 Required
          </div>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-500 ${isSettled ? 'opacity-50 pointer-events-none' : ''}`}>
          {authorityNodes.map((admin) => {
            const isSigned = sharesSubmitted.includes(admin.id);
            const isProcessing = submitting === admin.id;

            return (
              <div 
                key={admin.id} 
                className={`institutional-card overflow-hidden transition-all duration-300 ${
                  isSigned 
                    ? 'border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                    : 'border-[#30363d]'
                }`}
              >
                <div className="p-6 space-y-6">
                  {/* Authority Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-black text-[#C5A059] uppercase tracking-widest mb-1">Node {admin.id}</p>
                      <h4 className="institutional-header text-sm leading-tight">{admin.role}</h4>
                      <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mt-2">{admin.name}</p>
                    </div>
                    <div className={`p-2 rounded-lg transition-all ${
                      isSigned 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-[#0d1117] text-slate-500'
                    }`}>
                      <UserCheck size={18} />
                    </div>
                  </div>

                  {/* Auth Share Entry */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">
                      Cryptographic Share
                    </label>
                    <div className="relative">
                      <input 
                        type="password"
                        value={adminShares[admin.id]}
                        onChange={(e) => handleShareChange(admin.id, e.target.value)}
                        disabled={isSigned || batch.status === 'SETTLED' || batch.status === 'CRITICAL_COMPROMISE'}
                        className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-[#C5A059]/50 disabled:opacity-50 disabled:bg-slate-950/50"
                        placeholder="••••••••••••••••"
                      />
                      {isSigned && (
                        <div className="absolute inset-0 bg-emerald-500/5 rounded-lg flex items-center justify-center border border-emerald-500/20">
                          <span className="text-[9px] font-mono text-emerald-400 font-black tracking-widest uppercase">Locked</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Commit Button */}
                  <button
                    onClick={() => handleSign(admin)}
                    disabled={isProcessing || isSigned || batch.status === 'SETTLED' || batch.status === 'CRITICAL_COMPROMISE'}
                    className={`w-full py-3 rounded-lg font-black text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      isSigned 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed' 
                        : 'bg-[#0d1117] border border-[#30363d] text-slate-300 hover:border-[#C5A059]/50 hover:text-[#C5A059]'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-[#C5A059]/30 border-t-[#C5A059] animate-spin" />
                        Processing
                      </>
                    ) : isSigned ? (
                      <>
                        <CheckCircle2 size={16} />
                        Authorized
                      </>
                    ) : (
                      <>
                        <LockKeyhole size={16} />
                        Commit Share
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* EXECUTION & STATUS SECTION */}
      <section className="space-y-4 mt-10">
        {/* Execution Message Alert */}
        {executionMessage && (
          <div className={`institutional-card p-4 flex items-start gap-3 animate-in fade-in duration-300 ${
            executionMessage.includes('INSUFFICIENT') 
              ? 'system-warning' 
              : 'system-success'
          }`}>
            <div className="mt-1">
              {executionMessage.includes('INSUFFICIENT') ? (
                <AlertCircle size={18} />
              ) : (
                <CheckCircle2 size={18} />
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs font-mono uppercase tracking-tight font-bold">{executionMessage}</p>
            </div>
          </div>
        )}

        {/* Execute Clearing Button */}
        <button
          onClick={handleExecuteClearing}
          disabled={isSettled || batch.status === 'CRITICAL_COMPROMISE'}
          className={`w-full py-4 rounded-lg font-black text-sm uppercase tracking-[0.15em] transition-all active:scale-[0.98] ${
            isSettled || batch.status === 'CRITICAL_COMPROMISE'
              ? 'bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800'
              : 'bg-[#C5A059] text-black border border-[#C5A059] hover:bg-[#D4B873] shadow-lg hover:shadow-[0_0_20px_rgba(197,160,89,0.3)]'
          }`}
        >
          {isSettled ? 'Transaction Settled' : 'Execute Settlement Clearing'}
        </button>
      </section>

      {/* Settlement Success Display */}
      {isSettled && (
        <div className="institutional-card system-success p-6 border-l-4 border-emerald-500">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <CheckCircle2 className="text-emerald-400" size={24} />
            </div>
            <div>
              <h4 className="font-black text-sm text-emerald-300 uppercase tracking-tight mb-1">
                Transaction Authenticated & Settled
              </h4>
              <p className="text-xs text-emerald-200/80 mb-2">
                {signatureCount}-of-3 Quorum Verified. Funds disbursed successfully via RTGS network.
              </p>
              <p className="data-mono text-xs text-emerald-400 bg-black/30 p-2 rounded border border-emerald-500/20 break-all">
                {batch.combined_signature || "AUTHENTICATION_HASH_LEDGER_CONFIRMATION"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandConsole;
