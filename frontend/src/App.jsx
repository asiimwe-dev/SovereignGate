import React from 'react';
import { SystemProvider, useSystem } from './context/SystemContext';
import CommandConsole from './components/CommandConsole';
import HeistControl from './components/HeistControl';
import AlertModal from './components/Shared/AlertModal';
import { ShieldCheck, Activity } from 'lucide-react';

const AppContent = () => {
  const system = useSystem();
  
  if (!system) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-red-500 font-mono animate-pulse">CRITICAL_SYSTEM_ERROR: CONTEXT_UNAVAILABLE</div>
      </div>
    );
  }

  const { isCompromised } = system;

  return (
    <div className={`min-h-screen flex flex-col md:flex-row overflow-hidden transition-all duration-700 ${isCompromised ? 'pointer-events-none' : ''}`}>
      {isCompromised && <AlertModal />}
      
      {/* Left 75%: The Fortress */}
      <main className="min-h-screen w-full md:w-[75%] p-8 bg-[#020617] border-r border-slate-800/50 overflow-y-auto relative selection:bg-sky-500/30">
        {/* Subtle Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]"></div>
        
        <header className="mb-12 border-b border-slate-800/50 pb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-600 to-emerald-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <div className="relative p-2 bg-slate-900 rounded-full border border-slate-800">
                <ShieldCheck className="text-sky-400" size={24} />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-100 tracking-tighter uppercase italic flex items-center gap-2">
                Sovereign<span className="text-sky-500">Gate</span>
                <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>
              </h1>
              <p className="text-[10px] text-slate-500 font-mono tracking-[0.4em] uppercase mt-1">
                National Treasury Control Core // Auth Phase 2
              </p>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 px-6 py-3 bg-slate-900/50 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
            <div className="space-y-1">
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Uptime Metric</p>
              <div className="flex items-center gap-2">
                <Activity size={12} className="text-emerald-500 animate-pulse" />
                <span className="text-xs font-mono text-emerald-400">99.99997%</span>
              </div>
            </div>
            <div className="w-[1px] h-8 bg-slate-800"></div>
            <div className="space-y-1">
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">System Status</p>
              <div className="flex items-center gap-2 text-sky-400">
                <span className="text-xs font-mono font-bold tracking-widest">ENCRYPTED</span>
              </div>
            </div>
          </div>
        </header>
        
        <div className="max-w-6xl mx-auto">
          <CommandConsole />
        </div>
      </main>

      {/* Right 25%: The Attack Vector */}
      <aside className="w-full md:w-[25%] bg-black overflow-hidden relative shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-10 border-l border-slate-800/50">
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
