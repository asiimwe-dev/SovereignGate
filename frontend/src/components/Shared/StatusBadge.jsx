import React from 'react';
import { clsx } from 'clsx';

const StatusBadge = ({ status }) => {
  const styles = {
    SAFE: "bg-green-900/30 text-green-400 border-green-500/50",
    SIGNING: "bg-blue-900/30 text-blue-400 border-blue-500/50 animate-pulse",
    CRITICAL_COMPROMISE: "bg-red-900/30 text-red-500 border-red-500/50 animate-pulse-fast font-bold",
    SETTLED: "bg-slate-700 text-slate-300 border-slate-500/50",
    PENDING_SIGNATURE: "bg-yellow-900/30 text-yellow-500 border-yellow-500/50"
  };

  return (
    <span className={clsx(
      "px-3 py-1 rounded-full text-xs border uppercase tracking-widest",
      styles[status] || styles.SAFE
    )}>
      {status.replace('_', ' ')}
    </span>
  );
};

export default StatusBadge;