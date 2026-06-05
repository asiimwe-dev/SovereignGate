import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, ChevronDown, Check } from 'lucide-react';

const BatchSelector = ({ onBatchSelect, currentBatch }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/gate/batches');
      if (response.ok) {
        const data = await response.json();
        setBatches(data.batches || []);
      }
    } catch (err) {
      console.error('Failed to fetch batches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleBatchSelect = (batch) => {
    onBatchSelect(batch);
    setIsOpen(false);
  };

  return (
    <div className="institutional-card p-5 md:p-6 bg-[#0f131a] border-[#1f2937]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#07090e] rounded-xl border border-[#1f2937] text-[#C5A059]">
            <Database size={18} />
          </div>
          <div>
            <h3 className="institutional-header text-base font-black">Ledger Batch Selection</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Select settlement queue batch</p>
          </div>
        </div>
        <button
          onClick={fetchBatches}
          disabled={loading}
          className="p-2 rounded-lg bg-[#07090e] border border-[#1f2937] text-slate-400 hover:text-[#C5A059] hover:border-[#C5A059]/40 active:scale-95 cursor-pointer transition-all"
          title="Refresh batches"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Selected Batch Details */}
      <div className="mb-4 p-4 bg-[#07090e] rounded-xl border border-[#1f2937] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Active Dispatch Batch</p>
          {currentBatch ? (
            <div>
              <p className="data-mono text-xs text-[#C5A059] font-bold">{currentBatch.batch_id}</p>
              <div className="flex items-center gap-4 text-[10px] text-slate-400 mt-1">
                <span>Vote: <strong className="text-slate-300 font-mono">{currentBatch.funding_vote}</strong></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                <span>Payee: <strong className="text-slate-300">{currentBatch.payload?.recipient}</strong></span>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-xs italic">No batch selected</p>
          )}
        </div>

        {currentBatch && (
          <div className="flex items-center gap-3 self-start sm:self-center">
            <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
              currentBatch.status === 'SETTLED' ? 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30' :
              currentBatch.status === 'CRITICAL_COMPROMISE' ? 'bg-red-950/20 text-red-500 border-red-900/30 animate-pulse' :
              'bg-amber-950/20 text-amber-400 border-amber-900/30'
            }`}>
              {currentBatch.status === 'CRITICAL_COMPROMISE' ? 'CRITICAL COMPROMISE' : currentBatch.status}
            </span>
          </div>
        )}
      </div>

      {/* Custom Dropdown Trigger */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-3 px-4 bg-[#07090e] border border-[#1f2937] hover:border-[#374151] rounded-xl text-xs font-black text-slate-300 uppercase tracking-widest flex items-center justify-between transition-all cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
            {currentBatch ? 'Change Settlement Batch' : 'Select a Batch'}
          </span>
          <ChevronDown size={16} className={`transition-transform duration-300 text-slate-500 ${isOpen ? 'rotate-180 text-[#C5A059]' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f131a] border border-[#1f2937] rounded-xl shadow-2xl z-50 max-h-72 overflow-y-auto divide-y divide-[#1f2937]/50 animate-in fade-in slide-in-from-top-2 duration-200">
            {loading ? (
              <div className="p-6 text-center text-slate-500">
                <div className="inline-block w-5 h-5 rounded-full border-2 border-[#C5A059]/30 border-t-[#C5A059] animate-spin" />
              </div>
            ) : batches.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs uppercase tracking-wider">
                No active batches found
              </div>
            ) : (
              batches.map((batch) => {
                const isSelected = currentBatch?.batch_id === batch.batch_id;
                return (
                  <button
                    key={batch.batch_id}
                    onClick={() => handleBatchSelect(batch)}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#C5A059]/5 border-l-2 border-l-[#C5A059]'
                        : 'hover:bg-[#07090e]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="data-mono text-xs font-bold text-[#C5A059]">{batch.batch_id}</p>
                        <span className="text-[9px] text-slate-500 font-mono">({batch.funding_vote})</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {batch.payload?.recipient} — <strong className="text-slate-300">{(batch.payload?.amount || 0).toLocaleString()} UGX</strong>
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                        batch.status === 'SETTLED' ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/20' :
                        batch.status === 'CRITICAL_COMPROMISE' ? 'bg-red-950/20 text-red-500 border border-red-900/20' :
                        'bg-amber-950/20 text-amber-400 border border-amber-900/20'
                      }`}>
                        {batch.status}
                      </span>
                      {isSelected && <Check size={14} className="text-[#C5A059]" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchSelector;
