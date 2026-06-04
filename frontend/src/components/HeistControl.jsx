import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { Terminal, Zap, AlertTriangle, Skull } from 'lucide-react';

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
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 text-red-500">
        <Skull size={24} />
        <h2 className="font-black tracking-tighter text-xl uppercase italic">Heist Sandbox</h2>
      </div>

      <div className="bg-black/40 border border-red-900/50 p-4 rounded-lg mb-6">
        <div className="flex items-center gap-2 text-red-400 mb-2">
          <Terminal size={14} />
          <span className="text-[10px] font-mono uppercase">Developer Console</span>
        </div>
        <p className="text-[11px] text-red-200/60 leading-relaxed font-mono">
          $ ssh root@treasury-db-01<br/>
          $ sudo -u postgres psql<br/>
          $ UPDATE payment_batches SET payload_json = replace(...)
        </p>
      </div>

      <div className="flex-grow space-y-4">
        <button
          onClick={handleInject}
          disabled={loading}
          className="w-full group bg-red-950 hover:bg-red-900 border border-red-500/50 p-6 rounded-xl flex flex-col items-center gap-3 transition-all transform active:scale-95"
        >
          <Zap size={40} className="text-red-500 group-hover:scale-110 transition-transform" />
          <div className="text-center">
            <span className="block font-black text-red-100 uppercase tracking-tighter">Inject Malicious Script</span>
            <span className="text-[10px] text-red-400 font-mono italic">(Modify Database Payload)</span>
          </div>
        </button>

        <div className="p-4 rounded-lg bg-red-900/10 border border-red-900/30 flex gap-3">
          <AlertTriangle size={18} className="text-red-600 shrink-0" />
          <p className="text-[10px] text-red-300 leading-tight">
            Triggering this action bypasses application-level encryption and directly mutates the persistence layer to simulate a root-level compromise.
          </p>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-red-900/30">
        <p className="text-[9px] text-red-900 font-bold uppercase tracking-widest text-center">
          Exploit Vector Trigger Engine v1.0
        </p>
      </div>
    </div>
  );
};

export default HeistControl;
