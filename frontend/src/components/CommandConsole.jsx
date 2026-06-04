import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { useApi } from '../hooks/useApi';
import StatusBadge from './Shared/StatusBadge';
import { ShieldCheck, UserCheck, Key, RefreshCw, Landmark } from 'lucide-react';
import MPCVisualizer from './MPCVisualizer';

const CommandConsole = () => {
  const { batch, loading } = useSystem();
  const { submitShare } = useApi();
  const [submitting, setSubmitting] = useState(null);

  if (loading || !batch) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-treasury-gold" size={48} />
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

  return (
    <div className="space-y-6">
      <section className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-inner">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <Landmark className="text-treasury-gold" size={32} />
            <div>
              <h2 className="text-xl font-bold">{batch.funding_vote}</h2>
              <p className="text-slate-400 text-xs font-mono">{batch.batch_id}</p>
            </div>
          </div>
          <StatusBadge status={batch.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Source Account</p>
            <p className="font-mono text-sm">{batch.source_account}</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Authorized Payee</p>
            <p className="font-bold text-slate-200">{batch.payload.recipient}</p>
          </div>
          <div className="bg-slate-900/50 p-4 rounded-lg col-span-2">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Total Payout Amount</p>
            <p className="text-2xl font-black text-treasury-gold">
              {batch.payload.amount.toLocaleString()} <span className="text-sm font-normal">UGX</span>
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {admins.map((admin) => (
          <div key={admin.id} className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <UserCheck className="text-blue-400" size={24} />
                <div className="text-[10px] bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                  ADMIN {admin.id}
                </div>
              </div>
              <h3 className="font-bold text-sm">{admin.role}</h3>
              <p className="text-xs text-slate-400 mb-4">{admin.name}</p>
            </div>
            
            <button
              onClick={() => handleSign(admin)}
              disabled={submitting === admin.id || batch.status === 'SETTLED' || batch.status === 'CRITICAL_COMPROMISE'}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 rounded font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              {submitting === admin.id ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Key size={14} />
              )}
              {batch.status === 'SETTLED' ? "AUTHORIZED" : "INSERT TOKEN & SIGN"}
            </button>
          </div>
        ))}
      </div>

      <MPCVisualizer />
    </div>
  );
};

export default CommandConsole;
