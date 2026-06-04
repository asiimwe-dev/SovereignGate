import React from 'react';
import { SystemProvider, useSystem } from './context/SystemContext';
import CommandConsole from './components/CommandConsole';
import HeistControl from './components/HeistControl';
import AlertModal from './components/Shared/AlertModal';

const AppContent = () => {
  console.log("SovereignGate: AppContent Rendering...");
  const system = useSystem();
  
  if (!system) {
    console.error("SovereignGate: SystemContext value is null! Check SystemProvider.");
    return <div className="p-20 text-white bg-red-900">Context Error: System state unavailable.</div>;
  }

  const { isCompromised } = system;
  console.log("SovereignGate: Compromise state:", isCompromised);

  return (
    <div className={`min-h-screen flex flex-col md:flex-row overflow-hidden transition-all duration-700 ${isCompromised ? 'pointer-events-none' : ''}`}>
      {isCompromised && <AlertModal />}
      
      {/* Left 75%: The Fortress */}
      <main className="min-h-screen w-full md:w-[75%] p-8 bg-[#020617] border-r border-slate-800/50 overflow-y-auto relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]"></div>
        
        <header className="mb-12 border-b border-slate-800/50 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-100 tracking-tighter uppercase italic">
              Sovereign<span className="text-sky-500">Gate</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-[0.4em] uppercase mt-1">
              National Treasury Control Core // Phase 2 Auth
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">System Status: Active</p>
            <p className="text-[9px] font-mono text-sky-500/50 uppercase tracking-widest mt-0.5">Uptime: 99.9997%</p>
          </div>
        </header>
        
        <CommandConsole />
      </main>

      {/* Right 25%: The Attack Vector */}
      <aside className="w-full md:w-[25%] bg-black overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10">
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
