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
    "BYPASSING_SSS_LAYER... FAILED",
    "ATTEMPTING_DIRECT_SQL_INJECTION..."
  ]);
  
  const logEndRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLogs = [
        `SCAN_PORT_${Math.floor(Math.random() * 9999)}`,
        "DUMP_MEM_0x" + Math.random().toString(16).slice(2, 10).toUpperCase(),
        "PACKET_INTERCEPT_SUCCESS",
        "TOR_NODE_ACTIVE"
      ];
      setLogs(prev => [...prev.slice(-8), newLogs[Math.floor(Math.random() * newLogs.length)]]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleInject = async () => {
    setLoading(true);
    setLogs(prev => [...prev, "FORCE_PAYLOAD_UPDATE", "ROOT_ACCESS_GRANTED", "MUTATING_PERSISTENCE"]);
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
      setLogs(["SYSTEM_REBOOT", "WIPING_ARTIFACTS", "VECTOR_OFFLINE"]);
    } catch (err) {
      alert(err);
    } finally {
      setReseting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#050505] selection:bg-red-500/40">
      {/* Breach Header */}
      <div className="p-6 border-b border-red-950/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-black rounded-lg border border-red-900/50 shadow-[0_0_10px_rgba(220,38,38,0.2)]">
            <Skull size={20} className="text-red-600" />
          </div>
          <div>
            <h2 className="font-mono text-xs font-black text-red-600 tracking-tighter uppercase">
              Heist Simulation
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
               <div className="h-1 w-1 bg-red-600 rounded-full animate-ping"></div>
               <span className="text-[8px] font-mono text-red-900 uppercase font-black tracking-widest">Sandbox v2.0</span>
            </div>
          </div>
        </div>
        <Binary size={16} className="text-red-900/30" />
      </div>

      <div className="p-6 space-y-6 flex-grow overflow-y-auto">
        {/* Terminal Log */}
        <div className="bg-black border border-red-950/50 rounded-xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-3 py-1.5 bg-red-950/10 border-b border-red-950/20">
             <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-900/30"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-red-900/30"></div>
             </div>
             <span className="text-[8px] font-mono text-red-900 uppercase font-black tracking-widest">Bash</span>
          </div>
          <div className="p-4 font-mono text-[9px] space-y-1.5 h-40 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-2 text-red-600/60 uppercase">
                <span className={log.includes("GRANTED") || log.includes("REBOOT") ? "text-emerald-500 font-black" : ""}>
                  <ChevronRight size={8} className="inline mr-1" />
                  {log}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Button */}
        <div className="space-y-4 pt-2">
          <button
            onClick={handleInject}
            disabled={loading}
            className="w-full group relative overflow-hidden rounded-xl transition-all active:scale-95 disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-900 to-black group-hover:via-red-800 transition-all duration-500"></div>
            <div className="relative p-8 flex flex-col items-center gap-4 border border-white/5 backdrop-blur-sm">
              <div className="p-4 bg-black/60 rounded-full border border-red-500/20 group-hover:scale-110 transition-transform duration-500">
                <Zap size={32} className="text-red-500" />
              </div>
              <span className="block font-black text-white uppercase tracking-tighter text-sm leading-tight">
                Inject Malicious Script
              </span>
            </div>
          </button>

          <div className="p-4 rounded-xl bg-red-950/10 border border-red-900/20 flex gap-3">
            <AlertTriangle size={14} className="text-red-900 shrink-0 mt-0.5" />
            <p className="text-[9px] text-red-900 leading-tight font-black uppercase tracking-tighter">
              Bypasses MPC authentication protocols via direct persistence layer mutation.
            </p>
          </div>
        </div>
      </div>

      {/* Authorized Reset */}
      <div className="p-6 border-t border-red-950/30 bg-black/20">
        <button 
          onClick={handleReset}
          disabled={resetting}
          className="w-full py-2.5 bg-zinc-950 hover:bg-emerald-950 border border-emerald-900/30 text-emerald-500 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          {resetting ? <RotateCcw className="animate-spin" size={12} /> : <RotateCcw size={12} />}
          System Restore
        </button>
      </div>
    </div>
  );
};

export default HeistControl;
