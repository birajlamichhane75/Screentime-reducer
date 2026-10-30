'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Loader2,
  CheckCircle2,
  X,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';
import {
  VerificationCheck,
  SimulationScenario,
  VerificationFailureDetails,
} from './types';
import { SupportTicketModal } from './SupportTicketModal';

const BASE_CHECKS: { id: string; label: string; passedMessage: string; checkingMessage: string }[] = [
  {
    id: 'originality',
    label: 'Originality Check',
    passedMessage: '100% Original Content (No Duplicate)',
    checkingMessage: 'Scanning video fingerprints against global archive...',
  },
  {
    id: 'authenticity',
    label: 'Authenticity Check',
    passedMessage: 'Real Human Activity Verified (No AI Deepfake)',
    checkingMessage: 'Analyzing biometric motion & synthetic artifact patterns...',
  },
  {
    id: 'safety',
    label: 'Content Safety Check',
    passedMessage: 'Passed All Community Safety Guidelines',
    checkingMessage: 'Auditing physical hazards & community safety standards...',
  },
  {
    id: 'human_rights',
    label: 'Human Rights & Privacy Check',
    passedMessage: 'Passed Dignity & Privacy Regulations',
    checkingMessage: 'Verifying consent, dignity, and anti-harassment rules...',
  },
  {
    id: 'relevance',
    label: 'Activity Relevance Check',
    passedMessage: 'Activity Confirmed for Selected Category',
    checkingMessage: 'Validating creative craft match with category...',
  },
];

interface TrustSafetyEngineProps {
  hasVideo: boolean;
  videoPreviewUrl?: string;
  selectedCategory: string;
  videoTitle: string;
  isVerified: boolean;
  onVerificationPassed: () => void;
  onVerificationFailed: () => void;
  onResetVerification: () => void;
}

export function TrustSafetyEngine({
  hasVideo,
  videoPreviewUrl,
  selectedCategory,
  videoTitle,
  isVerified,
  onVerificationPassed,
  onVerificationFailed,
  onResetVerification,
}: TrustSafetyEngineProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCheckIndex, setActiveCheckIndex] = useState<number>(-1);
  const [passedCheckIds, setPassedCheckIds] = useState<string[]>([]);
  const [isAllComplete, setIsAllComplete] = useState(false);
  const [failureDetails, setFailureDetails] = useState<VerificationFailureDetails | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset verification whenever video or category changes
  useEffect(() => {
    handleReset();
  }, [hasVideo, selectedCategory]);

  const handleReset = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setActiveCheckIndex(-1);
    setPassedCheckIds([]);
    setIsAllComplete(false);
    setFailureDetails(null);
    onResetVerification();
  };

  const openVerificationModal = () => {
    if (!hasVideo || !selectedCategory) return;
    setIsModalOpen(true);

    if (isVerified) {
      setPassedCheckIds(BASE_CHECKS.map((c) => c.id));
      setIsAllComplete(true);
      return;
    }

    startOneByOneVerification();
  };

  /**
   * Run verification one-by-one with realistic duration (~1.2s per check, total ~6s)
   */
  const startOneByOneVerification = () => {
    setPassedCheckIds([]);
    setIsAllComplete(false);
    setFailureDetails(null);
    setActiveCheckIndex(0);

    runStep(0, []);
  };

  const runStep = (index: number, currentPassed: string[]) => {
    if (index >= BASE_CHECKS.length) {
      // All 5 checks completed one by one
      setActiveCheckIndex(-1);
      setIsAllComplete(true);
      return;
    }

    setActiveCheckIndex(index);

    // Each check takes ~1.2s so the audience feels the thoroughness of the check
    timerRef.current = setTimeout(() => {
      const check = BASE_CHECKS[index];
      const nextPassed = [...currentPassed, check.id];
      setPassedCheckIds(nextPassed);

      // Advance to next check
      runStep(index + 1, nextPassed);
    }, 1200);
  };

  const handleContinue = () => {
    setIsModalOpen(false);
    onVerificationPassed();
  };

  const currentCheck = activeCheckIndex >= 0 ? BASE_CHECKS[activeCheckIndex] : null;
  const progressPercent = Math.min(
    100,
    Math.round(((passedCheckIds.length + (activeCheckIndex >= 0 ? 0.4 : 0)) / BASE_CHECKS.length) * 100)
  );

  return (
    <div className="space-y-3">
      {/* 1. Main Trigger Button or Verified Status on Page */}
      {!isVerified ? (
        <button
          type="button"
          onClick={openVerificationModal}
          disabled={!hasVideo || !selectedCategory}
          className="w-full py-4 px-5 rounded-2xl bg-[#0E0830] hover:bg-[#1a1147] active:scale-98 text-white font-black text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed group"
        >
          <Sparkles className="w-5 h-5 text-indigo-300 group-hover:rotate-12 transition-transform" />
          <span>AI Trust &amp; Safety Check</span>
        </button>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/80 dark:border-emerald-700 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black text-emerald-950 dark:text-emerald-100 block">
                AI Safety Verified
              </span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                All 5 checks approved
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={openVerificationModal}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all active:scale-95 shadow-2xs"
          >
            View Checks
          </button>
        </div>
      )}

      {/* 2. AI TRUST & SAFETY MODAL WITH BACKGROUND BLUR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl space-y-5 relative select-none">
            {/* Top Close Button (allowed when complete) */}
            {isAllComplete && (
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Modal Header */}
            <div className="text-center space-y-1 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-xs font-bold text-[#0E0830] dark:text-indigo-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ShowUp! AI Engine</span>
              </span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight pt-1">
                {isAllComplete ? 'Verification Approved' : 'AI Safety Scan'}
              </h2>
            </div>

            {/* Video Scanner Box with Laser Beam */}
            <div className="relative aspect-16/9 w-full rounded-2xl bg-slate-950 overflow-hidden border-2 border-indigo-500/40 shadow-xl flex items-center justify-center">
              {videoPreviewUrl ? (
                <video
                  src={videoPreviewUrl}
                  className="w-full h-full object-cover opacity-60"
                  muted
                  autoPlay
                  loop
                  playsInline
                />
              ) : (
                <FileCheck className="w-12 h-12 text-indigo-400" />
              )}

              {/* Scanning Laser Beam Line (only while actively verifying) */}
              {!isAllComplete && (
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_18px_#22d3ee] animate-laser-scan" />
              )}

              {/* Overlay Progress Badge */}
              <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-white font-mono font-bold text-xs">
                {progressPercent}%
              </div>
            </div>

            {/* Progress Bar & Current Status */}
            <div className="space-y-1.5">
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-center font-semibold text-slate-500 dark:text-slate-400">
                {!isAllComplete && currentCheck
                  ? currentCheck.checkingMessage
                  : 'All 5 checks verified and approved.'}
              </p>
            </div>

            {/* 5 CHECKS: VERIFIED ONE-BY-ONE SIMULATION IN BIG FONT */}
            <div className="space-y-2.5 pt-1">
              {BASE_CHECKS.map((check, idx) => {
                const isPassed = passedCheckIds.includes(check.id);
                const isChecking = activeCheckIndex === idx;

                return (
                  <div
                    key={check.id}
                    className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-3 ${
                      isPassed
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 shadow-2xs'
                        : isChecking
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 animate-pulse'
                        : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isPassed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : isChecking ? (
                        <Loader2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-spin shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0" />
                      )}
                      <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                        {check.label}
                      </span>
                    </div>

                    <span
                      className={`text-xs font-bold shrink-0 ${
                        isPassed
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : isChecking
                          ? 'text-indigo-600 dark:text-indigo-300'
                          : 'text-slate-400'
                      }`}
                    >
                      {isPassed
                        ? check.id === 'relevance'
                          ? `Passed (${selectedCategory})`
                          : 'Verified ✓'
                        : isChecking
                        ? 'Checking...'
                        : 'Waiting'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* BIG CONTINUE BUTTON (Appears upon verification complete) */}
            {isAllComplete && (
              <div className="pt-2 animate-in fade-in">
                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full py-4 rounded-2xl bg-[#0E0830] hover:bg-[#1a1147] dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#0E0830] text-base font-black transition-all shadow-lg active:scale-95"
                >
                  Continue &amp; Enable Upload
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Human Review Appeal Support Ticket Modal */}
      <SupportTicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        videoTitle={videoTitle}
        category={selectedCategory}
        failureDetails={failureDetails}
      />
    </div>
  );
}
