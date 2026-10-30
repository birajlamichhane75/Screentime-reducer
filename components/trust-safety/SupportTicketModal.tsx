'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { VerificationFailureDetails } from './types';

interface SupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  category: string;
  failureDetails?: VerificationFailureDetails | null;
}

export function SupportTicketModal({
  isOpen,
  onClose,
  videoTitle,
  category,
  failureDetails,
}: SupportTicketModalProps) {
  const [issueType] = useState<string>(
    failureDetails
      ? `AI Verification Flag: ${failureDetails.checkLabel}`
      : 'AI Verification False Positive Appeal'
  );
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulated ticket dispatch with short delay
    setTimeout(() => {
      const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedTicketId(ticketId);
      setIsSubmitting(false);
    }, 700);
  };

  const handleResetAndClose = () => {
    setSubmittedTicketId(null);
    setAdditionalDetails('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#0E0830] dark:text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Create Support Ticket
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedTicketId ? (
          <div className="py-4 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Ticket Submitted for Human Review
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Reference ID: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{submittedTicketId}</span>
              </p>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Our safety review team will evaluate your original craft submission within 24 hours and notify your verified email.
            </p>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full py-3 rounded-2xl bg-[#0E0830] hover:bg-[#1a1147] text-white text-xs font-bold transition-all shadow-md"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {/* Auto-selected Issue Type */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Issue Type (Auto-selected)
              </label>
              <input
                type="text"
                value={issueType}
                readOnly
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium cursor-not-allowed"
              />
            </div>

            {/* Video Name & Category */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Video Reference
                </label>
                <input
                  type="text"
                  value={videoTitle || 'Practice Video'}
                  readOnly
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium truncate cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <input
                  type="text"
                  value={category || 'Creative Activity'}
                  readOnly
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium cursor-not-allowed"
                />
              </div>
            </div>

            {/* Failed Verification Category */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Flagged Verification Category
              </label>
              <input
                type="text"
                value={failureDetails?.checkLabel || 'Originality Check'}
                readOnly
                className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-red-600 dark:text-red-400 font-semibold text-xs cursor-not-allowed"
              />
            </div>

            {/* AI Explanation */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                AI Automated Explanation
              </label>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                {failureDetails?.explanation ||
                  'Automated verification marked potential resemblance to previously shared routines. Human verification requested.'}
              </div>
            </div>

            {/* Additional Details (Optional) */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Additional Details (Optional)
              </label>
              <textarea
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                placeholder="Explain why this activity is your original creative practice..."
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0E0830] outline-hidden resize-none"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-2xl bg-[#0E0830] hover:bg-[#1a1147] text-white font-bold transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Ticket</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
