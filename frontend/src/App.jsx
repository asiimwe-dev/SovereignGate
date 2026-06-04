import React, { useState } from 'react';
import { SystemProvider, useSystem } from './context/SystemContext';
import CommandConsole from './components/CommandConsole';
import HeistControl from './components/HeistControl';
import BatchSelector from './components/BatchSelector';
import AlertModal from './components/Shared/AlertModal';
import { Building2, Activity } from 'lucide-react';

const AppContent = () => {
  const system = useSystem();
  const [selectedBatch, setSelectedBatch] = useState(null);
  
  if (!system) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-red-500 font-mono animate-pulse">CRITICAL SYSTEM ERROR: CONTEXT UNAVAILABLE</div>
      </div>
    );
  }

  const { isCompromised, batch } = system;

  return (
    <div className="min-h-screen relative flex flex-col md:flex-row transition-all duration-700 bg-[#0d1117]">
      {/* 
          ALARM OVERLAY: AlertModal 
          Positioned as a direct child of the root relative container to ensure it stays 
          interactive (pointer-events-auto) regardless of the content's state.
      */}
      {isCompromised && <AlertModal />}
      
      {/* Left 75%: RTGS Settlement Gateway (Main) */}
      <main className={`w-full md:w-[75%] p-8 bg-[#0d1117] border-r border-[#30363d] relative selection:bg-[#C5A059]/20 transition-all duration-700 ${isCompromised ? 'pointer-events-none opacity-50 blur-sm' : ''}`}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] institutional-grid z-0"></div>
        
        <header className="mb-10 border-b border-[#30363d] pb-6 flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-[#161b22] rounded-lg border border-[#C5A059]/30">
                <Building2 className="text-[#C5A059]" size={22} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl institutional-header text-slate-50">
                  BANK OF UGANDA
                </h1>
                <p className="text-[11px] font-mono text-[#C5A059] tracking-[0.15em] uppercase mt-0.5">
                  Sovereign Integrated Financial Management Gateway
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-mono uppercase tracking-widest ml-14 mt-1">RTGS Settlement Terminal — Multi-Signature Authorization Protocol</p>
          </div>
          
          <div className="flex items-center gap-6 px-5 py-3 bg-[#161b22] rounded-xl border border-[#30363d]">
            <div>
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">System Status</p>
              <div className="flex items-center gap-2 mt-1">
                <Activity size={14} className="text-emerald-500 animate-institutional-pulse" />
                <span className="text-sm font-black text-slate-100 uppercase tracking-tight">OPERATIONAL</span>
              </div>
            </div>
            <div className="w-[1px] h-8 bg-[#30363d]"></div>
            <div>
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Uptime</p>
              <span className="text-sm font-mono text-emerald-400 font-bold tracking-tight">99.99997%</span>
            </div>
          </div>
        </header>
        
        <div className="max-w-5xl space-y-8">
          {/* Batch Selector */}
          <BatchSelector 
            currentBatch={selectedBatch || batch}
            onBatchSelect={setSelectedBatch}
          />
          
          {/* Command Console */}
          <CommandConsole />
        </div>
      </main>

      {/* Right 25%: Network Vulnerability & Penetration Testing Control */}
      <aside className={`w-full md:w-[25%] bg-[#161b22] relative border-l border-[#30363d] md:sticky md:top-0 md:h-screen overflow-y-auto transition-all duration-700 ${isCompromised ? 'pointer-events-none opacity-50 blur-sm' : ''}`}>
        <HeistControl />
      </aside>
    </div>
  );
};

function App() {
  return (
    <SystemProvider>
      <AppContent />
    </SystemProvider>
  );
}

export default App;
