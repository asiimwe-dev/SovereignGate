import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, ChevronDown } from 'lucide-react';

const BatchSelector = ({ onBatchSelect, currentBatch }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      // Fetch all batches from the database
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
    <div className="institutional-card p-6 bg-[#0d1117] border border-[#30363d]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#161b22] rounded-lg border border-[#30363d]">
            <Database size={20} className="text-[#C5A059]" />
          </div>
          <div>
            <h3 className="institutional-header text-lg font-black">Batch Selection</h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Select transaction batch to dispatch</p>
          </div>
        </div>
        <button
          onClick={fetchBatches}
          disabled={loading}
          className="p-2 rounded-lg bg-[#161b22] border border-[#30363d] text-slate-400 hover:text-[#C5A059] hover:border-[#C5A059]/50 transition-all"
          title="Refresh batches"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Current Batch Display */}
      <div className="mb-4 p-4 bg-[#161b22] rounded-lg border border-[#30363d]">
        <p className="text-[11px] text-slate-500 uppercase font-black mb-2 tracking-widest">Currently Dispatching</p>
        {currentBatch ? (
          <div>
            <p className="data-mono text-sm text-[#C5A059] font-bold mb-2">{currentBatch.batch_id}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-slate-600 uppercase tracking-wider">Vote</p>
                <p className="text-slate-300 font-mono">{currentBatch.funding_vote}</p>
              </div>
              <div>
                <p className="text-slate-600 uppercase tracking-wider">Status</p>
                <p className={`font-black uppercase tracking-tighter ${
                  currentBatch.status === 'SETTLED' ? 'text-emerald-400' :
                  currentBatch.status === 'CRITICAL_COMPROMISE' ? 'text-red-400' :
                  'text-amber-400'
                }`}>
                  {currentBatch.status}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 text-sm italic">No batch selected</p>
        )}
      </div>

      {/* Batch List Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full py-3 px-4 bg-[#161b22] border border-[#30363d] rounded-lg text-sm font-black text-slate-300 uppercase tracking-widest flex items-center justify-between hover:border-[#C5A059]/50 transition-all"
        >
          <span>{batches.length > 0 ? 'Available Batches' : 'No batches found'}</span>
          <ChevronDown size={18} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#161b22] border border-[#30363d] rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-slate-500">
                <div className="inline-block w-4 h-4 rounded-full border-2 border-[#C5A059]/30 border-t-[#C5A059] animate-spin" />
              </div>
            ) : batches.length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-sm">
                No batches available
              </div>
            ) : (
              batches.map((batch) => (
                <button
                  key={batch.batch_id}
                  onClick={() => handleBatchSelect(batch)}
                  className={`w-full text-left px-4 py-3 border-b border-[#30363d] last:border-b-0 transition-all ${
                    currentBatch?.batch_id === batch.batch_id
                      ? 'bg-[#C5A059]/10 border-l-2 border-l-[#C5A059]'
                      : 'hover:bg-[#0d1117]'
                  }`}
                >
                  <p className="data-mono text-xs font-bold text-[#C5A059] mb-1">{batch.batch_id}</p>
                  <p className="text-xs text-slate-400 font-mono mb-1">{batch.funding_vote}</p>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-600">
                      {batch.payload?.recipient || 'Unknown Recipient'}
                    </span>
                    <span className={`font-black px-2 py-1 rounded ${
                      batch.status === 'SETTLED' ? 'bg-emerald-500/20 text-emerald-300' :
                      batch.status === 'CRITICAL_COMPROMISE' ? 'bg-red-500/20 text-red-300' :
                      'bg-amber-500/20 text-amber-300'
                    }`}>
                      {batch.status}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Amount Info */}
      {currentBatch && (
        <div className="mt-4 p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
          <p className="text-[10px] text-emerald-600 uppercase font-black tracking-widest mb-1">Authorized Disbursement Amount</p>
          <p className="text-lg font-black text-emerald-400 data-mono">
            {(currentBatch.payload?.amount || 0).toLocaleString()} <span className="text-xs text-emerald-600">UGX</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default BatchSelector;
