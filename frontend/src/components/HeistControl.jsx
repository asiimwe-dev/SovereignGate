import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { Terminal, Zap, AlertTriangle, Skull, Activity, Flame } from 'lucide-react';

const HeistControl = () => {
  const { triggerInject } = useApi();
  const [loading, setLoading] = useState(false);

  const handleInject = async () => {
    setLoading(true);
    try {
      await triggerInject();
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 border-l border-amber-900/50 selection:bg-red-500/30 selection:text-red-200">
      {/* Hacker Header */}
      <div className="p-6 border-b border-amber-900/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-950 rounded-lg border border-red-900/50">
            <Skull size={20} className="text-red-500 animate-pulse" />
          </div>
          <h2 className="font-mono text-lg font-black text-red-500 tracking-tighter uppercase italic drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]">
            Heist Sandbox
          </h2>
        </div>
        <Activity size={16} className="text-amber-900 animate-pulse" />
      </div>

      <div className="p-6 space-y-6 flex-grow overflow-y-auto">
        {/* Gritty Terminal */}
        <div className="bg-black/60 border border-red-950 p-5 rounded-xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent"></div>
          <div className="flex items-center gap-2 text-red-900 mb-3">
            <Terminal size={12} />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold">Remote Exploit Vector</span>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] text-red-500/40 leading-relaxed font-mono">
              <span className="text-red-500/60 font-bold">$</span> ssh-agent payload_gen<br/>
              <span className="text-red-500/60 font-bold">$</span> target: treasury-db-01<br/>
              <span className="text-red-500/60 font-bold">$</span> injection_mode: ROOT_SQL<br/>
              <span className="text-red-500/80 animate-pulse blink-cursor">awaiting_trigger</span>
            </p>
          </div>
        </div>

        {/* Danger Button */}
        <div className="space-y-4">
          <button
            onClick={handleInject}
            disabled={loading}
            className="w-full group relative overflow-hidden rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {/* Dangerous Gradient Layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-amber-700 to-red-900 group-hover:animate-glitch transition-all duration-300"></div>
            
            <div className="relative p-8 flex flex-col items-center gap-4 border border-white/10">
              <div className="p-4 bg-black/40 rounded-full border border-white/5 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12">
                <Zap size={32} className="text-white group-hover:text-amber-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              </div>
              <div className="text-center">
                <span className="block font-black text-white uppercase tracking-tighter text-sm italic group-hover:animate-shake">
                  Inject Malicious Script
                </span>
                <div className="mt-2 flex items-center justify-center gap-2">
                   <div className="h-1 w-1 bg-red-400 rounded-full animate-ping"></div>
                   <span className="text-[9px] text-red-200/50 font-mono uppercase font-black">Force Database Mutation</span>
                </div>
              </div>
            </div>

            {/* Scanning Line Effect */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/5 to-transparent h-1/2 w-full animate-[marquee_1s_linear_infinite] opacity-30"></div>
          </button>

          <div className="p-4 rounded-lg bg-red-950/20 border border-red-900/30 flex gap-3 group">
            <AlertTriangle size={16} className="text-red-900 group-hover:text-red-600 transition-colors shrink-0" />
            <p className="text-[10px] text-red-400/80 leading-tight italic font-medium">
              WARNING: This bypasses polynomial encryption. Direct layer-2 mutation simulation.
            </p>
          </div>
        </div>
      </div>

      {/* Version Footer */}
      <div className="p-4 border-t border-amber-900/20 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-red-950 font-black italic tracking-widest text-[10px]">
          <Flame size={12} />
          <span>BREACH_ENGINE_v2.4</span>
        </div>
        <div className="w-full h-1 bg-red-950 rounded-full overflow-hidden">
          <div className="w-2/3 h-full bg-red-900 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default HeistControl;
