import React from 'react';
import { SystemProvider, useSystem } from './context/SystemContext';
import CommandConsole from './components/CommandConsole';
import HeistControl from './components/HeistControl';
import AlertModal from './components/Shared/AlertModal';

const AppContent = () => {
  const { isCompromised } = useSystem();

  return (
    <div className="min-h-screen flex flex-col md-flex-row overflow-hidden">
      {isCompromised && <AlertModal />}
      
      {/* Left 75%: Official Treasury Console */}
      <main className="min-h-screen w-full md:w-3/4 p-6 bg-slate-900 border-r border-slate-700 overflow-y-auto">
        <header className="mb-8 "> {/*border-b border-slate-700 pB-4 */}
          <div flex justify-between items-center>
            <div>
              <h1 className="text-2xl font-bold text-treasury-gold traching-tighter">SOVEREIGN GATE</h1>
              <p className="text-slate-400 text-sm uppercase traching-widest font-semibold">National Treasury Control Core</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">SESSION ID: UG-BOU-2026-X83</p>
              <p className="text-xs text-green-500 font-mono">ENCRYPTION: SEPP256K1_SSS_2_3</p>
            </div>
          </div>
        </header>
        
        <CommandConsole />
      </main>

      {/* Right 25%: Heist Sandbox */}
      <aside className="w-full md:w-1/4 p-6 bg-slate-950 overflow-y-auto shadow-2xl">
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