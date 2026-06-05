import React, { useState } from 'react';
import { SystemProvider, useSystem } from './context/SystemContext';
import CommandConsole from './components/CommandConsole';
import HeistControl from './components/HeistControl';
import BatchSelector from './components/BatchSelector';
import AlertModal from './components/Shared/AlertModal';
import { Building2, Activity } from 'lucide-react';

const AppContent = () => {
  const system = useSystem();
  
  if (!system) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center">
        <div className="text-red-500 font-mono animate-pulse text-base">CRITICAL SYSTEM ERROR: CONTEXT UNAVAILABLE</div>
      </div>
    );
  }

  const { isCompromised, batch, selectedBatch, setSelectedBatch } = system;

  return (
    <div className="min-h-screen relative flex flex-col md:flex-row transition-all duration-700 bg-[#07090e]">
      {/* 
          ALARM OVERLAY: AlertModal 
          Positioned as a direct child of the root relative container to ensure it stays 
          interactive (pointer-events-auto) regardless of the content's state.
      */}
      {isCompromised && <AlertModal />}
      
      {/* Left 75%: RTGS Settlement Gateway (Main) */}
      <main className={`w-full md:w-[75%] p-6 md:p-8 bg-[#07090e] border-r border-[#1f2937] relative selection:bg-[#C5A059]/20 transition-all duration-700 ${isCompromised ? 'pointer-events-none opacity-40 blur-[4px]' : ''}`}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] institutional-grid z-0"></div>
        
        <header className="mb-8 border-b border-[#1f2937] pb-6 flex justify-between items-start md:items-center flex-col md:flex-row gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3.5 mb-2">
              <div className="p-2.5 bg-[#0f131a] rounded-xl border border-[#C5A059]/35 shadow-md">
                <Building2 className="text-[#C5A059]" size={22} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl institutional-header text-slate-100 flex items-center gap-2">
                  BANK OF UGANDA
                </h1>
                <p className="text-xs font-mono text-[#C5A059] tracking-[0.2em] uppercase mt-0.5 font-bold">
                  Sovereign Integrated Financial Gateway
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-mono uppercase tracking-widest ml-14 mt-1">RTGS Settlement Terminal — Multi-Signature Authorization Protocol</p>
          </div>
          
          <div className="flex items-center gap-5 px-4 py-2.5 bg-[#0f131a] rounded-xl border border-[#1f2937] shadow-sm">
            <div>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">System Status</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-black text-slate-200 uppercase tracking-tight">OPERATIONAL</span>
              </div>
            </div>
            <div className="w-[1px] h-6 bg-[#1f2937]"></div>
            <div>
              <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Uptime</p>
              <span className="text-sm font-mono text-emerald-400 font-bold tracking-tight mt-0.5 block">99.99997%</span>
            </div>
          </div>
        </header>
        
        <div className="max-w-5xl space-y-6 relative z-10">
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
      <aside className={`w-full md:w-[25%] bg-[#0f131a] relative border-l border-[#1f2937] md:sticky md:top-0 md:h-screen overflow-y-auto transition-all duration-700 ${isCompromised ? 'pointer-events-none opacity-40 blur-[4px]' : ''}`}>
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
