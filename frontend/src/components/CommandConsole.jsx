import React, { useState, useEffect } from 'react';
import { useSystem } from '../context/SystemContext';
import { useApi } from '../hooks/useApi';
import StatusBadge from './Shared/StatusBadge';
import MPCVisualizer from './MPCVisualizer';
import { 
  LockKeyhole, 
  UserCheck, 
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Cpu,
  Lock,
  ArrowRight
} from 'lucide-react';

const CommandConsole = () => {
  const { batch, selectedBatch, loading, sharesSubmitted, setSharesSubmitted } = useSystem();
  const { submitShare } = useApi();
  const [submitting, setSubmitting] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [executionMessage, setExecutionMessage] = useState('');
  const [backendSharesCount, setBackendSharesCount] = useState(0);

  // Use selectedBatch if available, otherwise use default batch
  const currentBatch = selectedBatch || batch;

  // Reset shares when batch ID changes
  useEffect(() => {
    if (currentBatch?.batch_id) {
      setSharesSubmitted([]);
      setBackendSharesCount(0);
    }
  }, [currentBatch?.batch_id, setSharesSubmitted]);

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
      const response = await submitShare(currentBatch.batch_id, admin.id, adminShares[admin.id], `HW-TOKEN-${admin.id}-${Date.now()}`);
      console.log('Share submitted:', response);
      
      // Use the backend's shares_count response (SINGLE SOURCE OF TRUTH)
      if (response.shares_count !== undefined) {
        setBackendSharesCount(response.shares_count);
      }
      
      // Track which nodes were signed from the response
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
    // Use backend shares count (source of truth)
    const signatureCount = backendSharesCount;
    
    if (signatureCount < 2) {
      setExecutionMessage(`INSUFFICIENT THRESHOLD: ${signatureCount} of 2 required signatures present. Core ledger remains locked.`);
      setTimeout(() => setExecutionMessage(''), 4000);
      return;
    }

    setExecuting(true);
    try {
      // Call the execute-settlement endpoint
      const response = await fetch(`http://localhost:8000/api/v1/mpc/execute-settlement?batch_id=${currentBatch.batch_id}`, {
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
      
      // Reset share counts after successful execution
      setBackendSharesCount(0);
      setSharesSubmitted([]);
      
      setTimeout(() => setExecutionMessage(''), 5000);
    } catch (err) {
      console.error('Execution error:', err);
      setExecutionMessage(`EXECUTION ERROR: ${err.message}`);
      setTimeout(() => setExecutionMessage(''), 4000);
    } finally {
      setExecuting(false);
    }
  };

  if (loading || !currentBatch) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="animate-pulse-gold">
          <div className="w-14 h-14 rounded-2xl bg-[#0f131a] border border-[#C5A059]/40 flex items-center justify-center mb-6 shadow-lg">
            <Cpu className="text-[#C5A059] animate-spin" size={26} style={{ animationDuration: '6s' }} />
          </div>
        </div>
        <p className="font-mono text-xs text-slate-400 uppercase tracking-[0.2em] font-bold">
          Synchronizing Authorization Layer...
        </p>
      </div>
    );
  }

  const isSettled = currentBatch.status === 'SETTLED';
  const signatureCount = backendSharesCount;  // Use backend's shares_count (source of truth)
  const thresholdReady = signatureCount >= 2;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* LEDGER INFORMATION CARD */}
      <section className="institutional-card p-6 md:p-8 bg-[#0f131a] border-[#1f2937]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-5 border-b border-[#1f2937]">
          <div>
            <h2 className="institutional-header text-xl md:text-2xl font-black mb-1.5 flex items-center gap-2">
              <span className="text-[#C5A059]">◆</span> {currentBatch.funding_vote}
            </h2>
            <p className="data-mono text-[10px] text-slate-500 uppercase tracking-widest">{currentBatch.batch_id}</p>
          </div>
          <StatusBadge status={currentBatch.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="institutional-card p-4 bg-[#07090e] border-[#1f2937] hover:border-[#1f2937]">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-1.5 tracking-widest">Source Account</p>
            <p className="data-mono text-xs text-slate-300 font-bold break-all">{currentBatch.source_account}</p>
          </div>
          <div className="institutional-card p-4 bg-[#07090e] border-[#1f2937] hover:border-[#1f2937]">
            <p className="text-[10px] text-slate-500 uppercase font-black mb-1.5 tracking-widest">Authorized Payee</p>
            <p className="text-xs font-black text-slate-200 uppercase tracking-tight truncate">{currentBatch.payload?.recipient}</p>
          </div>
          <div className="institutional-card p-4 bg-gradient-to-br from-[#07090e] to-[#0f131a] border-[#1f2937] hover:border-[#1f2937]">
            <p className="text-[10px] text-[#C5A059] uppercase font-black mb-1 tracking-widest flex items-center gap-1.5">
              <DollarSign size={12} /> Approved Amount
            </p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <p className="text-2xl font-black text-[#C5A059] data-mono">
                {(currentBatch.payload?.amount || 0).toLocaleString()}
              </p>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">UGX</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3-KEY SECURITY CHAMBER & VISUALIZER */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="institutional-header text-lg font-black flex items-center gap-2">
              3-Key Authorization Chamber
            </h3>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-0.5">Volatile memory signature accumulation</p>
          </div>
          <div className="text-xs font-mono text-slate-300 uppercase tracking-widest px-3 py-1.5 bg-[#0f131a] rounded-lg border border-[#1f2937]">
            Nodes: <span className="text-[#C5A059] font-black">{signatureCount}</span><span className="text-slate-500"> / 3</span>
          </div>
        </div>

        {/* MPC Visualizer integrated directly */}
        <MPCVisualizer />

        {/* Node share committer inputs */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-500 ${isSettled ? 'opacity-50 pointer-events-none' : ''}`}>
          {authorityNodes.map((admin) => {
            const isSigned = sharesSubmitted.includes(admin.id);
            const isProcessing = submitting === admin.id;

            return (
              <div 
                key={admin.id} 
                className={`institutional-card overflow-hidden transition-all duration-300 ${
                  isSigned 
                    ? 'border-emerald-500 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.05)] animate-pulse-emerald' 
                    : 'border-[#1f2937] bg-[#0f131a] hover:border-[#374151]'
                }`}
              >
                <div className="p-5 space-y-4">
                  {/* Authority Header */}
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-[#C5A059] uppercase tracking-widest mb-0.5">Node {admin.id}</p>
                      <h4 className="institutional-header text-sm font-black leading-snug tracking-tight text-slate-100">{admin.role}</h4>
                      <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-1">{admin.name}</p>
                    </div>
                    <div className={`p-2 rounded-lg transition-all flex-shrink-0 border ${
                      isSigned 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-[#07090e] text-slate-600 border-[#1f2937]'
                    }`}>
                      <UserCheck size={18} />
                    </div>
                  </div>

                  {/* Auth Share Entry */}
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">
                      Cryptographic Share
                    </label>
                    <div className="relative">
                      <input 
                        type="password"
                        value={adminShares[admin.id]}
                        onChange={(e) => handleShareChange(admin.id, e.target.value)}
                        disabled={isSigned || currentBatch.status === 'SETTLED' || currentBatch.status === 'CRITICAL_COMPROMISE'}
                        className="w-full bg-[#07090e] border border-[#1f2937] rounded-lg px-3 py-2.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-[#C5A059]/40 disabled:opacity-40 disabled:bg-[#07090e] transition-colors"
                        placeholder="••••••••••••••••"
                      />
                      {isSigned && (
                        <div className="absolute inset-0 bg-emerald-950/20 rounded-lg flex items-center justify-center border border-emerald-500/10">
                          <span className="text-[10px] font-mono text-emerald-400 font-black tracking-[0.2em] uppercase">Committed</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Commit Button */}
                  <button
                    onClick={() => handleSign(admin)}
                    disabled={isProcessing || isSigned || currentBatch.status === 'SETTLED' || currentBatch.status === 'CRITICAL_COMPROMISE'}
                    className={`w-full py-2.5 rounded-lg font-black text-[10px] uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer ${
                      isSigned 
                        ? 'bg-emerald-500/5 text-emerald-400 border border-emerald-500/20 cursor-not-allowed' 
                        : 'bg-[#07090e] border border-[#1f2937] text-slate-400 hover:border-[#C5A059]/50 hover:text-[#C5A059] hover:bg-[#0f131a]'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-3 h-3 rounded-full border-2 border-[#C5A059]/30 border-t-[#C5A059] animate-spin" />
                        Encrypting...
                      </>
                    ) : isSigned ? (
                      <>
                        <CheckCircle2 size={14} />
                        Authorized
                      </>
                    ) : (
                      <>
                        <LockKeyhole size={14} />
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
      <section className="space-y-4">
        {/* Status Message Alert */}
        {executionMessage && (
          <div className={`institutional-card p-4 flex items-start gap-3 animate-in fade-in duration-300 ${
            executionMessage.includes('INSUFFICIENT') || executionMessage.includes('ERROR')
              ? 'system-warning' 
              : 'system-success'
          }`}>
            <div className="mt-0.5">
              {executionMessage.includes('INSUFFICIENT') || executionMessage.includes('ERROR') ? (
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
        <div className="relative">
          {thresholdReady && !isSettled && currentBatch.status !== 'CRITICAL_COMPROMISE' && (
            <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#D4B873] opacity-35 blur animate-pulse-gold pointer-events-none"></span>
          )}
          <button
            onClick={handleExecuteClearing}
            disabled={isSettled || currentBatch.status === 'CRITICAL_COMPROMISE' || !thresholdReady || executing}
            className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] relative transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 ${
              isSettled || currentBatch.status === 'CRITICAL_COMPROMISE' || !thresholdReady || executing
                ? 'bg-slate-900 text-slate-600 border border-[#1f2937] cursor-not-allowed'
                : 'bg-gradient-to-r from-[#C5A059] to-[#D4B873] text-black border border-[#C5A059] hover:shadow-[0_0_20px_rgba(197,160,89,0.25)] font-bold'
            }`}
          >
            {executing ? (
              <>
                <div className="inline-block w-4 h-4 rounded-full border-2 border-black/35 border-t-black animate-spin" />
                Executing Settlement Clearing...
              </>
            ) : isSettled ? (
              <>
                <CheckCircle2 size={16} /> Transaction Settled & Disbursed
              </>
            ) : !thresholdReady ? (
              <>
                <Lock size={16} /> Awaiting Quorum ({signatureCount} of 2 Shares committed)
              </>
            ) : (
              <>
                Execute Settlement Clearing <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </section>

      {/* Settlement Success Display */}
      {isSettled && (
        <div className="institutional-card system-success p-6 border-l-4 border-emerald-500 animate-in zoom-in-95 duration-500 bg-emerald-950/5">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 size={24} />
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="font-black text-sm text-emerald-400 uppercase tracking-wide">
                Transaction Authenticated & Settled
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                2-of-3 Quorum verified via threshold secret reconstruction in volatile memory. Reconstructed credentials have been purged. Funds disbursed to beneficiary via RTGS clearing protocol.
              </p>
              <div className="space-y-1">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Combined Vault Signature</span>
                <p className="data-mono text-[10px] text-emerald-400 bg-black/60 p-3 rounded-lg border border-emerald-500/10 break-all leading-tight">
                  {currentBatch.combined_signature || "AUTHENTICATION_HASH_LEDGER_CONFIRMATION"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandConsole;
