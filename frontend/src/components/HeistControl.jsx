import React, { useState, useEffect, useRef } from 'react';
import { useApi } from '../hooks/useApi';
import { Terminal, Zap, AlertTriangle, Skull, Activity, Flame, ChevronRight, Binary, RotateCcw } from 'lucide-react';

const HeistControl = () => {
  const { triggerInject, resetSystem } = useApi();
  const [loading, setLoading] = useState(false);
  const [resetting, setReseting] = useState(false);
  const [logs, setLogs] = useState([
    "INITIALIZING_EXPLOIT_VECTOR...",
    "SCANNING_TREASURY_NETWORK... DONE",
    "TARGET_IDENTIFIED: BOU-DB-01",
    "BYPASSING_SSS_LAYER... FAILED (k=2 required)",
    "ATTEMPTING_DIRECT_SQL_INJECTION..."
  ]);
  
  const logEndRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLogs = [
        `SCANNING_PORT_${Math.floor(Math.random() * 9999)}...`,
        "DUMPING_MEMORY_BLOCK_0x" + Math.random().toString(16).slice(2, 10).toUpperCase(),
        "ENCRYPTED_PACKET_INTERCEPTED",
        "ROUTING_THROUGH_TOR_NODE_" + Math.floor(Math.random() * 255)
      ];
      setLogs(prev => [...prev.slice(-8), newLogs[Math.floor(Math.random() * newLogs.length)]]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleInject = async () => {
    setLoading(true);
    setLogs(prev => [...prev, "EXECUTING_PAYLOAD_FORCE_UPDATE...", "ROOT_ACCESS_GRANTED", "MUTATING_PERSISTENCE_LAYER..."]);
    try {
      await triggerInject();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setReseting(true);
    try {
      await resetSystem();
      setLogs(["SYSTEM_REBOOT_DETECTED", "WIPING_BREACH_ARTIFACTS...", "EXPLOIT_VECTOR_OFFLINE"]);
    } catch (err) {
      alert(err);
    } finally {
      setReseting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#050505] selection:bg-red-500/40 selection:text-white">
      {/* Breach Header */}
      <div className="p-6 border-b border-red-950/50 flex items-center justify-between bg-gradient-to-b from-red-950/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 bg-red-600 rounded blur opacity-20 animate-pulse"></div>
            <div className="relative p-2 bg-black rounded-lg border border-red-900/50">
              <Skull size={20} className="text-red-600" />
            </div>
          </div>
          <div>
            <h2 className="font-mono text-sm font-black text-red-600 tracking-tighter uppercase italic">
              Heist Simulation
            </h2>
            <div className="flex items-center gap-2">
               <div className="h-1 w-1 bg-red-600 rounded-full animate-ping"></div>
               <span className="text-[8px] font-mono text-red-900 uppercase font-black tracking-widest text-xs">Sandbox Engine v2.0</span>
            </div>
          </div>
        </div>
        <Binary size={16} className="text-red-900/40" />
      </div>

      <div className="p-6 space-y-6 flex-grow overflow-y-auto">
        {/* Cinematic Hack Log */}
        <div className="bg-black border border-red-950/50 rounded-2xl shadow-2xl overflow-hidden group">
          <div className="flex items-center justify-between px-4 py-2 bg-red-950/20 border-b border-red-950/30">
             <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-900/50"></div>
                <div className="w-2 h-2 rounded-full bg-red-900/50"></div>
                <div className="w-2 h-2 rounded-full bg-red-900/50"></div>
             </div>
             <span className="text-[9px] font-mono text-red-900 uppercase font-black">Local Bash</span>
          </div>
          <div className="p-5 font-mono text-[10px] space-y-2 h-48 overflow-y-auto scrollbar-hide">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-3">
                <span className="text-red-900 shrink-0 select-none">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
                <span className={log.includes("GRANTED") || log.includes("REBOOT") ? "text-emerald-500" : "text-red-600/80"}>
                  <ChevronRight size={10} className="inline mr-1" />
                  {log}
                </span>
              </div>
            ))}
            <div className="flex gap-3 items-center">
               <span className="text-red-900">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
               <div className="h-3 w-1.5 bg-red-600 animate-pulse"></div>
            </div>
            <div ref={logEndRef} />
          </div>
        </div>

        {/* The "Danger" Button */}
        <div className="space-y-4 pt-2">
          <button
            onClick={handleInject}
            disabled={loading}
            aria-label="Inject malicious script to modify database"
            className="w-full group relative overflow-hidden rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_30px_rgba(153,27,27,0.2)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-900 to-black group-hover:from-red-500 group-hover:via-red-800 group-hover:to-red-950 transition-all duration-500"></div>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-red-400/10 to-transparent h-1/2 w-full animate-[marquee_1.5s_linear_infinite] opacity-50"></div>

            <div className="relative p-10 flex flex-col items-center gap-5 border border-white/5 backdrop-blur-sm">
              <div className="relative">
                <div className="absolute -inset-4 bg-red-600/20 rounded-full blur-xl group-hover:bg-red-500/40 transition-colors"></div>
                <div className="p-5 bg-black/60 rounded-full border border-red-500/20 group-hover:scale-110 transition-transform duration-700 group-hover:rotate-[360deg]">
                  <Zap size={36} className="text-red-500 group-hover:text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <span className="block font-black text-white uppercase tracking-tighter text-lg italic leading-tight">
                  Inject Malicious<br/>Script
                </span>
              </div>
            </div>
          </button>

          <div className="p-5 rounded-2xl bg-red-950/10 border border-red-900/20 flex gap-4">
            <AlertTriangle size={18} className="text-red-900 shrink-0 mt-0.5" />
            <p className="text-[10px] text-red-900 leading-relaxed font-bold italic">
              WARNING: Directly mutates persistence layer, bypassing MPC protocols.
            </p>
          </div>
        </div>
      </div>

      {/* Forensic Reset (Authorized Recovery) */}
      <div className="p-6 border-t border-red-950/30 bg-black/40 space-y-4">
        <button 
          onClick={handleReset}
          disabled={resetting}
          className="w-full py-3 bg-zinc-900 hover:bg-emerald-950 border border-emerald-900/30 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          {resetting ? <RotateCcw className="animate-spin" size={14} /> : <RotateCcw size={14} />}
          Authorized System Reset
        </button>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-red-950 font-black italic tracking-[0.3em] text-[9px]">
            <div className="flex items-center gap-2">
              <Flame size={12} />
              <span>CORE_MUTATOR_v4.1</span>
            </div>
            <span>STABLE</span>
          </div>
          <div className="w-full h-1 bg-red-950/30 rounded-full overflow-hidden">
            <div className="w-[85%] h-full bg-red-900/50 animate-pulse shadow-[0_0_10px_rgba(153,27,27,0.5)]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeistControl;
