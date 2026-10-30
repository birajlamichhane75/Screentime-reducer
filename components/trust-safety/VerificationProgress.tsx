'use client';

import React from 'react';

interface VerificationProgressProps {
  progressPercent: number;
  currentStepIndex: number;
  totalSteps: number;
  isComplete: boolean;
  hasFailed: boolean;
}

export function VerificationProgress({
  progressPercent,
  currentStepIndex,
  totalSteps,
  isComplete,
  hasFailed,
}: VerificationProgressProps) {
  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {isComplete
            ? 'All checks finished'
            : hasFailed
            ? 'Verification stopped'
            : `Evaluating step ${Math.min(currentStepIndex + 1, totalSteps)} of ${totalSteps}`}
        </span>
        <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-slate-400">
          {Math.round(progressPercent)}%
        </span>
      </div>

      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            hasFailed
              ? 'bg-red-500'
              : isComplete
              ? 'bg-emerald-500'
              : 'bg-[#0E0830] dark:bg-indigo-400'
          }`}
          style={{ width: `${Math.min(100, Math.max(2, progressPercent))}%` }}
        />
      </div>
    </div>
  );
}
