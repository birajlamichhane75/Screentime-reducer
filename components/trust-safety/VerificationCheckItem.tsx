'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { VerificationCheck } from './types';

interface VerificationCheckItemProps {
  check: VerificationCheck;
}

export function VerificationCheckItem({ check }: VerificationCheckItemProps) {
  const { label, description, status, passedMessage, failedMessage, statusMessage } = check;

  const renderIcon = () => {
    switch (status) {
      case 'checking':
        return (
          <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center shrink-0">
            <Loader2 className="w-4 h-4 text-[#0E0830] dark:text-indigo-300 animate-spin" />
          </div>
        );
      case 'passed':
        return (
          <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        );
      case 'failed':
        return (
          <div className="w-6 h-6 rounded-full bg-red-50 dark:bg-red-950/50 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
          </div>
        );
      case 'waiting':
      default:
        return (
          <div className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
          </div>
        );
    }
  };

  const getStatusText = () => {
    if (status === 'passed') {
      return passedMessage;
    }
    if (status === 'failed') {
      return failedMessage || 'Verification failed';
    }
    if (status === 'checking') {
      return statusMessage || 'Checking...';
    }
    return 'Waiting';
  };

  return (
    <div
      className={`p-3 rounded-2xl border transition-all duration-300 flex items-start gap-3 ${
        status === 'passed'
          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40'
          : status === 'failed'
          ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50'
          : status === 'checking'
          ? 'bg-slate-50 dark:bg-slate-800/60 border-[#0E0830]/30 dark:border-indigo-500/40'
          : 'bg-white dark:bg-slate-900/60 border-slate-200/70 dark:border-slate-800'
      }`}
    >
      {renderIcon()}

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {label}
          </span>
          <span
            className={`text-[11px] font-semibold shrink-0 ${
              status === 'passed'
                ? 'text-emerald-700 dark:text-emerald-400'
                : status === 'failed'
                ? 'text-red-600 dark:text-red-400'
                : status === 'checking'
                ? 'text-[#0E0830] dark:text-indigo-300'
                : 'text-slate-400'
            }`}
          >
            {getStatusText()}
          </span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
          {description}
        </p>
      </div>
    </div>
  );
}

