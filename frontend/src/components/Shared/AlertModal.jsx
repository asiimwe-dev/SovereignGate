import React from 'react';
import { ShieldAlert, Lock } from 'lucide-react';

const AlertModal = () => {
  return (
    <div className="crimson-lockout p-12 text-center animate-in fade-in duration-500">
      <ShieldAlert size={120} className="text-white mb-6 animate-pulse" />
      <h1 className="text-6xl font-black mb-4 tracking-tighter uppercase italic">
        Integrity Compromise Detected
      </h1>
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg border-2 border-white/30 max-w-2xl">
        <p className="text-2xl font-bold mb-6">
          CRITICAL: Database payload mutation detected. RSA-SHA256 checksum mismatch on Vote 130.
        </p>
        <div className="flex items-center justify-center gap-4 text-red-200 uppercase tracking-widest font-mono text-sm">
          <Lock size={20} />
          <span>System Execution Halted</span>
          <span className="opacity-50">|</span>
          <span>Gateway Locked</span>
          <span className="opacity-50">|</span>
          <span>MPC Buffer Purged</span>
        </div>
      </div>
      <p className="mt-12 font-mono text-white/40 animate-pulse">
        RE-ROUTING ATTEMPT LOGGED: Tokyo Shell Node 82.112.4.9
      </p>
    </div>
  );
};

export default AlertModal;