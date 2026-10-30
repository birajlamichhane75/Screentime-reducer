'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Loader2,
  CheckCircle2,
  X,
  AlertTriangle,
  RefreshCw,
  SlidersHorizontal,
  FileCheck,
} from 'lucide-react';
import {
  VerificationCheck,
  OverallStatus,
  SimulationScenario,
  VerificationFailureDetails,
} from './types';
import { SupportTicketModal } from './SupportTicketModal';

const VERIFICATION_CHECKS: VerificationCheck[] = [
  {
    id: 'originality',
    label: 'Originality Check',
    description: 'Detect potential duplicate, stolen, or previously uploaded content.',
    status: 'waiting',
    passedMessage: '100% Original Content',
    failedMessage: 'Possible duplicate content detected',
  },
  {
    id: 'authenticity',
    label: 'Authenticity Check',
    description: 'Check for signs of manipulated, misleading, or AI-generated activity.',
    status: 'waiting',
    passedMessage: 'Real Human Activity Verified',
    failedMessage: 'Synthetic or manipulated patterns flagged',
  },
  {
    id: 'safety',
    label: 'Content Safety Check',
    description: 'Screen for violence, exploitation, hazards, and unsafe practices.',
    status: 'waiting',
    passedMessage: 'Passed All Safety Guidelines',
    failedMessage: 'Safety hazard or violation flagged',
  },
  {
    id: 'human_rights',
    label: 'Human Rights & Privacy Check',
    description: 'Inspect for hateful content, harassment, exploitation, and privacy breaches.',
    status: 'waiting',
    passedMessage: 'Passed Community Privacy Rules',
    failedMessage: 'Potential privacy or conduct concern',
  },
  {
    id: 'relevance',
    label: 'Activity Relevance Check',
    description: 'Ensure video represents a legitimate hobby matching the selected category.',
    status: 'waiting',
    passedMessage: 'Activity Relevance Confirmed',
    failedMessage: 'Category mismatch or non-creative routine',
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
  const [modalPhase, setModalPhase] = useState<'scanning' | 'verified' | 'failed' | 'error'>('scanning');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState('Initializing AI verification scanner...');
  const [failureDetails, setFailureDetails] = useState<VerificationFailureDetails | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [simulationScenario, setSimulationScenario] = useState<SimulationScenario>('pass');
  const [showDevControls, setShowDevControls] = useState(false);

  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset verification whenever video or category changes
  useEffect(() => {
    handleReset();
  }, [hasVideo, selectedCategory]);

  const handleReset = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setModalPhase('scanning');
    setScanProgress(0);
    setFailureDetails(null);
    onResetVerification();
  };

  const openVerificationModal = () => {
    if (!hasVideo || !selectedCategory) return;
    setIsModalOpen(true);

    if (isVerified) {
      setModalPhase('verified');
      setScanProgress(100);
      return;
    }

    startScanningProcess();
  };

  const startScanningProcess = () => {
    setModalPhase('scanning');
    setScanProgress(0);
    setFailureDetails(null);

    let progress = 0;
    const intervalTime = 60; // Updates every 60ms for ~2.6 seconds total
    const totalSteps = 42;
    const stepIncrement = 100 / totalSteps;

    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }

    scanIntervalRef.current = setInterval(() => {
      progress += stepIncrement;

      if (progress < 25) {
        setScanMessage('Scanning video frame authenticity & motion...');
      } else if (progress < 55) {
        setScanMessage('Checking originality & scanning fingerprint database...');
      } else if (progress < 85) {
        setScanMessage(`Analyzing activity relevance for ${selectedCategory}...`);
      } else {
        setScanMessage('Finalizing safety & human rights verification...');
      }

      setScanProgress(Math.min(100, Math.round(progress)));

      if (progress >= 100) {
        if (scanIntervalRef.current) {
          clearInterval(scanIntervalRef.current);
          scanIntervalRef.current = null;
        }

        // Check for simulated failure scenarios
        if (simulationScenario === 'error') {
          setModalPhase('error');
          onVerificationFailed();
          return;
        }

        if (simulationScenario !== 'pass') {
          setModalPhase('failed');
          let issue = 'Verification guideline flagged';
          let explanation = 'Your video could not be approved by automated safety verification.';

          if (simulationScenario === 'fail_originality') {
            issue = 'Possible duplicate content';
            explanation = 'This video appears similar to previously uploaded content. SkillBridge requires original work by its creators.';
          } else if (simulationScenario === 'fail_authenticity') {
            issue = 'Synthetic or manipulated movement flagged';
            explanation = 'Verification detected synthetic patterns inconsistent with natural human practice.';
          } else if (simulationScenario === 'fail_safety') {
            issue = 'Unsafe activity guidelines';
            explanation = 'Verification flagged activities that may pose physical hazard or violate community safety standards.';
          } else if (simulationScenario === 'fail_relevance') {
            issue = `Content mismatch with category "${selectedCategory}"`;
            explanation = `The activity depicted does not appear to match "${selectedCategory}". Please choose a matching hobby category.`;
          }

          setFailureDetails({
            checkId: 'originality',
            checkLabel: 'AI Safety Check',
            issue,
            explanation,
          });
          onVerificationFailed();
          return;
        }

        // Success
        setModalPhase('verified');
      }
    }, intervalTime);
  };

  const handleContinue = () => {
    setIsModalOpen(false);
    onVerificationPassed();
  };

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
                Ready for publishing
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={openVerificationModal}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all active:scale-95 shadow-2xs"
          >
            Review Checks
          </button>
        </div>
      )}

      {/* Developer Scenario Control (Available in dev for edge-case testing) */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="flex items-center justify-between px-1">
          <button
            type="button"
            onClick={() => setShowDevControls(!showDevControls)}
            className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Developer Test Mode</span>
          </button>
        </div>
      )}

      {showDevControls && (
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs animate-in fade-in">
          <span className="font-bold text-[#0E0830] dark:text-indigo-400 text-xs block">
            SIMULATE VERIFICATION SCENARIO
          </span>
          <select
            value={simulationScenario}
            onChange={(e) => {
              setSimulationScenario(e.target.value as SimulationScenario);
              handleReset();
            }}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-200 outline-hidden"
          >
            <option value="pass">Scenario: All 5 Checks Pass (Default)</option>
            <option value="fail_originality">Scenario: Fail Originality (Duplicate)</option>
            <option value="fail_authenticity">Scenario: Fail Authenticity (AI Synthetic)</option>
            <option value="fail_safety">Scenario: Fail Content Safety (Hazard)</option>
            <option value="fail_relevance">Scenario: Fail Category Relevance (Mismatch)</option>
            <option value="error">Scenario: Service Network Error</option>
          </select>
        </div>
      )}

      {/* 2. AI TRUST & SAFETY MODAL WITH BACKGROUND BLUR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl space-y-6 relative select-none">
            {/* Top Close Button (only if not scanning) */}
            {modalPhase !== 'scanning' && (
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* PHASE A: SCANNING VIDEO FOR FEW SECONDS */}
            {modalPhase === 'scanning' && (
              <div className="space-y-6 text-center py-2">
                {/* Header */}
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-xs font-bold text-[#0E0830] dark:text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Trust &amp; Safety Engine</span>
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight pt-1">
                    Scanning Video...
                  </h2>
                </div>

                {/* Animated Scanner Preview Box */}
                <div className="relative aspect-16/10 w-full rounded-2xl bg-slate-950 overflow-hidden border-2 border-indigo-500/40 shadow-xl flex items-center justify-center">
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
                    <div className="flex flex-col items-center justify-center space-y-2 text-slate-500">
                      <FileCheck className="w-12 h-12 text-indigo-400" />
                    </div>
                  )}

                  {/* Scanning Laser Beam Line */}
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_18px_#22d3ee] animate-laser-scan" />

                  {/* Scanning Radar Overlay Grid */}
                  <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

                  {/* Real-time Percentage Overlay */}
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md text-white font-mono font-bold text-sm">
                    {scanProgress}%
                  </div>
                </div>

                {/* Status Message & Progress Bar */}
                <div className="space-y-2.5">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-[#0E0830] dark:to-cyan-400 h-full rounded-full transition-all duration-100 ease-out"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {scanMessage}
                  </p>
                </div>
              </div>
            )}

            {/* PHASE B: VERIFICATION APPROVED (BIG FONT) */}
            {modalPhase === 'verified' && (
              <div className="space-y-6 py-2">
                {/* Hero Badge & Title */}
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Verification Complete
                  </h2>
                  <p className="text-base font-semibold text-emerald-700 dark:text-emerald-300">
                    Your video passed all Trust &amp; Safety checks.
                  </p>
                </div>

                {/* 5 Checks in BIG FONT */}
                <div className="space-y-2.5">
                  {VERIFICATION_CHECKS.map((check) => (
                    <div
                      key={check.id}
                      className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                          {check.label}
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300 shrink-0">
                        {check.passedMessage}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Big Continue Button (Closes modal and enables upload) */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="w-full py-4 rounded-2xl bg-[#0E0830] hover:bg-[#1a1147] dark:bg-white dark:hover:bg-slate-200 text-white dark:text-[#0E0830] text-base font-black transition-all shadow-lg active:scale-95"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* PHASE C: FAILED VERIFICATION */}
            {modalPhase === 'failed' && failureDetails && (
              <div className="space-y-5 py-2">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto shadow-sm">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    Verification Not Approved
                  </h2>
                </div>

                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 space-y-1.5">
                  <span className="text-sm font-black text-red-900 dark:text-red-200 block">
                    Issue: {failureDetails.issue}
                  </span>
                  <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed font-medium">
                    {failureDetails.explanation}
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsTicketModalOpen(true)}
                    className="w-full py-3.5 rounded-2xl bg-[#0E0830] text-white text-sm font-bold transition-all shadow-md active:scale-95"
                  >
                    Request Human Review
                  </button>
                  <button
                    type="button"
                    onClick={startScanningProcess}
                    className="w-full py-3 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all"
                  >
                    Scan Again
                  </button>
                </div>
              </div>
            )}

            {/* PHASE D: ERROR */}
            {modalPhase === 'error' && (
              <div className="space-y-5 text-center py-2">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Verification Unavailable
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                  We could not connect to the verification engine. Please check your network and try again.
                </p>
                <button
                  type="button"
                  onClick={startScanningProcess}
                  className="w-full py-3.5 rounded-2xl bg-[#0E0830] text-white text-sm font-bold transition-all shadow-md"
                >
                  Retry Verification
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
