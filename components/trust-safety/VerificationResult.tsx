'use client';

import React from 'react';
import { CheckCircle2, AlertTriangle, RefreshCw, LifeBuoy, FileText } from 'lucide-react';
import { VerificationFailureDetails } from './types';

interface VerificationResultProps {
  status: 'passed' | 'failed' | 'error';
  failureDetails?: VerificationFailureDetails | null;
  onRetry: () => void;
  onOpenTicketModal: () => void;
  onContactSupport: () => void;
}

export function VerificationResult({
  status,
  failureDetails,
  onRetry,
  onOpenTicketModal,
  onContactSupport,
}: VerificationResultProps) {
  if (status === 'passed') {
    return (
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-2 animate-in fade-in">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Verification Complete</span>
        </div>
        <p className="text-xs text-emerald-900/90 dark:text-emerald-200/90 leading-relaxed">
          Your video has passed the SkillBridge Trust &amp; Safety checks. You can now upload your content.
        </p>
        <p className="text-[10px] text-emerald-700/70 dark:text-emerald-400/60 font-mono pt-0.5">
          Simulated check for development preview &bull; Upload authorized
        </p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="p-4 rounded-2xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 space-y-3.5 animate-in fade-in">
        <div className="flex items-center gap-2 text-red-800 dark:text-red-300 font-bold text-sm">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
          <span>Verification Not Approved</span>
        </div>

        <p className="text-xs text-slate-700 dark:text-slate-300">
          Your video could not pass the SkillBridge AI Trust &amp; Safety verification.
        </p>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-red-200/80 dark:border-red-900/40 space-y-1.5 text-xs">
          <div>
            <span className="font-bold text-slate-900 dark:text-white">Issue detected: </span>
            <span className="text-red-600 dark:text-red-400 font-medium">
              {failureDetails?.issue || 'Content guideline mismatch'}
            </span>
          </div>

          <div>
            <span className="font-bold text-slate-900 dark:text-white">Explanation: </span>
            <span className="text-slate-600 dark:text-slate-300">
              {failureDetails?.explanation ||
                'This video appears to conflict with community trust criteria. SkillBridge encourages genuine, safe, and original creative routines.'}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Automated systems can make mistakes. You can request a fast human review or file a ticket.
        </p>

        {/* Support Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={onContactSupport}
            className="py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <LifeBuoy className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>Contact Support</span>
          </button>

          <button
            type="button"
            onClick={onOpenTicketModal}
            className="py-2.5 px-3 rounded-xl bg-[#0E0830] hover:bg-[#1a1147] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Create Ticket</span>
          </button>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2.5 animate-in fade-in">
      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>Verification Error</span>
      </div>
      <p className="text-xs text-amber-900/90 dark:text-amber-200/90">
        A temporary service timeout occurred while reaching the Trust &amp; Safety check engine. Please retry.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="py-2 px-3.5 rounded-xl bg-[#0E0830] hover:bg-[#1a1147] text-white text-xs font-bold transition-colors flex items-center gap-1.5"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Retry Verification</span>
      </button>
    </div>
  );
}
