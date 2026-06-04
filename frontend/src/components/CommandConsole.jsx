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
  const [executing, setExecuting] = useState(false);
  const [executionMessage, setExecutionMessage] = useState('');

  // Reset shares when batch ID changes
  React.useEffect(() => {
    if (batch?.batch_id) {
      setSharesSubmitted([]);
    }
  }, [batch?.batch_id, setSharesSubmitted]);

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
      const response = await submitShare(batch.batch_id, admin.id, adminShares[admin.id], `HW-TOKEN-${admin.id}-${Date.now()}`);
      console.log('Share submitted:', response);
      // Track which node was signed from the response
      if (!sharesSubmitted.includes(admin.id)) {
        setSharesSubmitted(prev => [...prev, admin.id]);
      }
    } catch (err) {
      console.error('Share submission error:', err);
      setExecutionMessage(`ERROR: Failed to submit share for Node ${admin.id}`);
      setTimeout(() => setExecutionMessage(''), 4000);
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

    setExecuting(true);
    try {
      // Call the new execute-settlement endpoint
      const response = await fetch(`http://localhost:8000/api/v1/mpc/execute-settlement?batch_id=${batch.batch_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Execution failed');
      }

      const data = await response.json();
      
      if (signatureCount === 2) {
        setExecutionMessage(`SETTLED / CLEARED: 2-of-3 Quorum Verified. Funds Disbursed Successfully via RTGS.`);
      } else if (signatureCount === 3) {
        setExecutionMessage(`SETTLED / MAXIMUM QUORUM SECURED: 3-of-3 Authorization Confirmed.`);
      }
      
      setTimeout(() => setExecutionMessage(''), 5000);
    } catch (err) {
      console.error('Execution error:', err);
      setExecutionMessage(`EXECUTION ERROR: ${err.message}`);
      setTimeout(() => setExecutionMessage(''), 4000);
    } finally {
      setExecuting(false);
    }
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
  const thresholdReady = signatureCount >= 2;

  return (
    <div className="space-y-8">
      {/* LEDGER INFORMATION CARD */}
      <section className="institutional-card p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 pb-6 border-b border-[#30363d]">
          <div>
            <h2 className="institutional-header text-2xl font-black mb-2">{batch.funding_vote}</h2>
            <p className="data-mono text-xs text-slate-400 uppercase tracking-wider">{batch.batch_id}</p>
          </div>
          <StatusBadge status={batch.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="institutional-card p-5 bg-[#0d1117]">
            <p className="text-[11px] text-slate-500 uppercase font-black mb-2 tracking-widest">Source Account</p>
            <p className="data-mono text-sm text-slate-300 font-bold">{batch.source_account}</p>
          </div>
          <div className="institutional-card p-5 bg-[#0d1117]">
            <p className="text-[11px] text-slate-500 uppercase font-black mb-2 tracking-widest">Authorized Payee</p>
            <p className="text-sm font-black text-slate-100 uppercase">{batch.payload.recipient}</p>
          </div>
          <div className="institutional-card p-5 bg-[#0d1117] md:col-span-2 lg:col-span-2">
            <p className="text-[11px] text-[#C5A059] uppercase font-black mb-2 tracking-widest flex items-center gap-2">
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="institutional-header text-lg font-black">3-Key Authorization Chamber</h3>
          <div className="text-sm font-mono text-slate-300 uppercase tracking-widest px-3 py-2 bg-[#161b22] rounded-lg border border-[#30363d]">
            Active: <span className="text-[#C5A059] font-black">{signatureCount}</span><span className="text-slate-500"> / 3 Nodes</span>
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
                <div className="p-6 space-y-5">
                  {/* Authority Header */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-black text-[#C5A059] uppercase tracking-widest mb-1">Node {admin.id}</p>
                      <h4 className="institutional-header text-base font-black leading-snug">{admin.role}</h4>
                      <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mt-2">{admin.name}</p>
                    </div>
                    <div className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                      isSigned 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : 'bg-[#0d1117] text-slate-500'
                    }`}>
                      <UserCheck size={20} />
                    </div>
                  </div>

                  {/* Auth Share Entry */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">
                      Cryptographic Share
                    </label>
                    <div className="relative">
                      <input 
                        type="password"
                        value={adminShares[admin.id]}
                        onChange={(e) => handleShareChange(admin.id, e.target.value)}
                        disabled={isSigned || batch.status === 'SETTLED' || batch.status === 'CRITICAL_COMPROMISE'}
                        className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-sm font-mono text-slate-300 focus:outline-none focus:border-[#C5A059]/50 disabled:opacity-50 disabled:bg-slate-950/50 transition-colors"
                        placeholder="••••••••••••••••"
                      />
                      {isSigned && (
                        <div className="absolute inset-0 bg-emerald-500/5 rounded-lg flex items-center justify-center border border-emerald-500/20">
                          <span className="text-xs font-mono text-emerald-400 font-black tracking-widest uppercase">Locked</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Commit Button */}
                  <button
                    onClick={() => handleSign(admin)}
                    disabled={isProcessing || isSigned || batch.status === 'SETTLED' || batch.status === 'CRITICAL_COMPROMISE'}
                    className={`w-full py-3 rounded-lg font-black text-sm uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all active:scale-95 ${
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
                        <CheckCircle2 size={18} />
                        Authorized
                      </>
                    ) : (
                      <>
                        <LockKeyhole size={18} />
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
        {/* Status Message Alert */}
        {executionMessage && (
          <div className={`institutional-card p-4 flex items-start gap-3 animate-in fade-in duration-300 ${
            executionMessage.includes('INSUFFICIENT') || executionMessage.includes('ERROR')
              ? 'system-warning' 
              : 'system-success'
          }`}>
            <div className="mt-1">
              {executionMessage.includes('INSUFFICIENT') || executionMessage.includes('ERROR') ? (
                <AlertCircle size={20} />
              ) : (
                <CheckCircle2 size={20} />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-mono uppercase tracking-tight font-bold">{executionMessage}</p>
            </div>
          </div>
        )}

        {/* Execute Clearing Button */}
        <button
          onClick={handleExecuteClearing}
          disabled={isSettled || batch.status === 'CRITICAL_COMPROMISE' || !thresholdReady || executing}
          className={`w-full py-4 rounded-lg font-black text-base uppercase tracking-[0.15em] transition-all active:scale-[0.98] ${
            isSettled || batch.status === 'CRITICAL_COMPROMISE' || !thresholdReady || executing
              ? 'bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800'
              : 'bg-[#C5A059] text-black border border-[#C5A059] hover:bg-[#D4B873] shadow-lg hover:shadow-[0_0_20px_rgba(197,160,89,0.3)]'
          }`}
        >
          {executing ? (
            <>
              <div className="inline-block w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin mr-2" />
              Executing Settlement...
            </>
          ) : isSettled ? (
            'Transaction Settled'
          ) : !thresholdReady ? (
            `Awaiting 2 of 3 Shares (${signatureCount} submitted)`
          ) : (
            'Execute Settlement Clearing'
          )}
        </button>
      </section>

      {/* Settlement Success Display */}
      {isSettled && (
        <div className="institutional-card system-success p-6 border-l-4 border-emerald-500">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-lg">
              <CheckCircle2 className="text-emerald-400" size={28} />
            </div>
            <div>
              <h4 className="font-black text-base text-emerald-300 uppercase tracking-tight mb-2">
                Transaction Authenticated & Settled
              </h4>
              <p className="text-sm text-emerald-200/80 mb-3">
                {signatureCount}-of-3 Quorum Verified. Funds disbursed successfully via RTGS network.
              </p>
              <p className="data-mono text-xs text-emerald-400 bg-black/30 p-3 rounded border border-emerald-500/20 break-all">
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
