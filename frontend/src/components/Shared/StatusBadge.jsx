import React from 'react';
import { clsx } from 'clsx';
import { CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const configs = {
    SAFE: {
      style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: <CheckCircle2 size={12} />,
      label: "SECURE"
    },
    SIGNING: {
      style: "bg-slate-500/10 text-slate-400 border-slate-500/20 animate-institutional-pulse",
      icon: <Clock size={12} />,
      label: "SIGNING IN PROGRESS"
    },
    CRITICAL_COMPROMISE: {
      style: "bg-red-600 text-white border-red-500 animate-pulse font-black",
      icon: <AlertTriangle size={12} />,
      label: "SYSTEM ISOLATION ACTIVE"
    },
    SETTLED: {
      style: "bg-emerald-500 text-white border-emerald-400 font-bold",
      icon: <CheckCircle2 size={12} />,
      label: "SETTLED"
    },
    PENDING_SIGNATURE: {
      style: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      icon: <Clock size={12} />,
      label: "AWAITING QUORUM"
    }
  };

  const config = configs[status] || configs.SAFE;

  return (
    <div className={clsx(
      "px-3 py-1.5 rounded-lg text-xs border flex items-center gap-1.5 uppercase tracking-widest transition-all duration-500 font-black",
      config.style
    )}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
};

export default StatusBadge;
