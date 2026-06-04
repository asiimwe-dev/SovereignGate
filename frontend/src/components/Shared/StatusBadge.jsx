import React from 'react';
import { clsx } from 'clsx';
import { CheckCircle2, ShieldAlert, Clock, AlertTriangle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const configs = {
    SAFE: {
      style: "bg-emerald-950/40 text-emerald-400 border-emerald-500/30",
      icon: <CheckCircle2 size={12} />,
      label: "SECURE"
    },
    SIGNING: {
      style: "bg-sky-950/40 text-sky-400 border-sky-500/30 animate-pulse",
      icon: <Clock size={12} />,
      label: "MPC SIGNING"
    },
    CRITICAL_COMPROMISE: {
      style: "bg-red-600 text-white border-red-400 animate-pulse-fast font-black",
      icon: <ShieldAlert size={12} />,
      label: "CRITICAL COMPROMISE"
    },
    SETTLED: {
      style: "bg-emerald-500 text-white border-emerald-400 font-bold",
      icon: <CheckCircle2 size={12} />,
      label: "SETTLED"
    },
    PENDING_SIGNATURE: {
      style: "bg-amber-950/40 text-amber-400 border-amber-500/30",
      icon: <Clock size={12} />,
      label: "AWAITING QUORUM"
    }
  };

  const config = configs[status] || configs.SAFE;

  return (
    <div className={clsx(
      "px-3 py-1 rounded-full text-[10px] border flex items-center gap-1.5 uppercase tracking-widest transition-all duration-500",
      config.style
    )}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
};

export default StatusBadge;
