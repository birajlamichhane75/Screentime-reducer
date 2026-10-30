'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, ShieldAlert, Sparkles, Loader2, RefreshCw, SlidersHorizontal } from 'lucide-react';
import {
  VerificationCheck,
  OverallStatus,
  SimulationScenario,
  VerificationFailureDetails,
} from './types';
import { VerificationCheckItem } from './VerificationCheckItem';
import { VerificationProgress } from './VerificationProgress';
import { VerificationResult } from './VerificationResult';
import { SupportTicketModal } from './SupportTicketModal';

const INITIAL_CHECKS: VerificationCheck[] = [
  {
    id: 'originality',
    label: 'Originality Check',
    description: 'Detect potential duplicate, stolen, or previously uploaded content.',
    status: 'waiting',
    passedMessage: 'No duplicate detected',
    failedMessage: 'Possible duplicate content detected',
  },
  {
    id: 'authenticity',
    label: 'Authenticity Check',
    description: 'Check for signs of manipulated, misleading, or AI-generated activity.',
    status: 'waiting',
    passedMessage: 'No concerns detected',
    failedMessage: 'Synthetic or manipulated patterns flagged',
  },
  {
    id: 'safety',
    label: 'Content Safety Check',
    description: 'Screen for violence, exploitation, hazards, and unsafe practices.',
    status: 'waiting',
    passedMessage: 'Passed safety guidelines',
    failedMessage: 'Safety hazard or violation flagged',
  },
  {
    id: 'human_rights',
    label: 'Human Rights & Privacy Check',
    description: 'Inspect for hateful content, harassment, exploitation, and privacy breaches.',
    status: 'waiting',
    passedMessage: 'Passed privacy & dignity rules',
    failedMessage: 'Potential privacy or conduct concern',
  },
  {
    id: 'relevance',
    label: 'Activity Relevance Check',
    description: 'Ensure video represents a legitimate hobby matching the selected category.',
    status: 'waiting',
    passedMessage: 'Activity relevance confirmed',
    failedMessage: 'Category mismatch or non-creative routine',
  },
];

interface TrustSafetyEngineProps {
  hasVideo: boolean;
  selectedCategory: string;
  videoTitle: string;
  onVerificationPassed: () => void;
  onVerificationFailed: () => void;
  onResetVerification: () => void;
}

export function TrustSafetyEngine({
  hasVideo,
  selectedCategory,
  videoTitle,
  onVerificationPassed,
  onVerificationFailed,
  onResetVerification,
}: TrustSafetyEngineProps) {
  const [checks, setChecks] = useState<VerificationCheck[]>(INITIAL_CHECKS);
  const [overallStatus, setOverallStatus] = useState<OverallStatus>('idle');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [failureDetails, setFailureDetails] = useState<VerificationFailureDetails | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [simulationScenario, setSimulationScenario] = useState<SimulationScenario>('pass');
  const [showDevControls, setShowDevControls] = useState(false);

  const verificationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset verification whenever video or category changes
  useEffect(() => {
    handleReset();
  }, [hasVideo, selectedCategory]);

  const handleReset = () => {
    if (verificationTimerRef.current) {
      clearTimeout(verificationTimerRef.current);
      verificationTimerRef.current = null;
    }
    setChecks(INITIAL_CHECKS.map((c) => ({ ...c, status: 'waiting' })));
    setOverallStatus('idle');
    setCurrentStepIndex(-1);
    setFailureDetails(null);
    onResetVerification();
  };

  const isButtonEnabled = hasVideo && Boolean(selectedCategory) && overallStatus !== 'checking';

  const runVerification = () => {
    if (!isButtonEnabled) return;

    // Reset checks to initial waiting state
    setChecks(INITIAL_CHECKS.map((c) => ({ ...c, status: 'waiting' })));
    setOverallStatus('checking');
    setCurrentStepIndex(0);
    setFailureDetails(null);

    executeStep(0, [...INITIAL_CHECKS]);
  };

  const executeStep = (stepIdx: number, currentChecks: VerificationCheck[]) => {
    if (stepIdx >= currentChecks.length) {
      // Completed all checks successfully
      setOverallStatus('passed');
      onVerificationPassed();
      return;
    }

    setCurrentStepIndex(stepIdx);

    // Set current step to checking
    const updatedWithChecking = currentChecks.map((c, i) =>
      i === stepIdx ? { ...c, status: 'checking' as const, statusMessage: 'Checking...' } : c
    );
    setChecks(updatedWithChecking);

    // Simulated verification delay (500ms per step)
    verificationTimerRef.current = setTimeout(() => {
      // Check simulation failure conditions for developer testing
      const targetCheck = updatedWithChecking[stepIdx];

      if (simulationScenario === 'error' && stepIdx === 2) {
        setOverallStatus('error');
        onVerificationFailed();
        return;
      }

      const shouldFailOriginality = simulationScenario === 'fail_originality' && targetCheck.id === 'originality';
      const shouldFailAuthenticity = simulationScenario === 'fail_authenticity' && targetCheck.id === 'authenticity';
      const shouldFailSafety = simulationScenario === 'fail_safety' && targetCheck.id === 'safety';
      const shouldFailRelevance = simulationScenario === 'fail_relevance' && targetCheck.id === 'relevance';

      if (shouldFailOriginality || shouldFailAuthenticity || shouldFailSafety || shouldFailRelevance) {
        // Step failed
        const failedChecks = updatedWithChecking.map((c, i) =>
          i === stepIdx ? { ...c, status: 'failed' as const } : c
        );
        setChecks(failedChecks);
        setOverallStatus('failed');

        let issue = 'Verification guideline flagged';
        let explanation = 'Your video could not be approved by automated safety verification.';

        if (shouldFailOriginality) {
          issue = 'Possible duplicate content';
          explanation = 'This video appears similar to previously uploaded content. SkillBridge requires original work by its creators.';
        } else if (shouldFailAuthenticity) {
          issue = 'Synthetic or manipulated movement flagged';
          explanation = 'Verification detected synthetic artifact patterns inconsistent with natural human practice.';
        } else if (shouldFailSafety) {
          issue = 'Unsafe activity guidelines';
          explanation = 'Verification flagged activities that may pose physical hazard or violate community safety standards.';
        } else if (shouldFailRelevance) {
          issue = `Content mismatch with category "${selectedCategory}"`;
          explanation = `The activity depicted does not appear to match the selected category "${selectedCategory}". Please choose a matching hobby category.`;
        }

        setFailureDetails({
          checkId: targetCheck.id,
          checkLabel: targetCheck.label,
          issue,
          explanation,
        });

        onVerificationFailed();
        return;
      }

      // Step passed, advance to next
      const passedChecks = updatedWithChecking.map((c, i) =>
        i === stepIdx ? { ...c, status: 'passed' as const } : c
      );
      setChecks(passedChecks);

      executeStep(stepIdx + 1, passedChecks);
    }, 550);
  };

  const calculateProgress = () => {
    if (overallStatus === 'passed') return 100;
    if (overallStatus === 'idle') return 0;
    const passedCount = checks.filter((c) => c.status === 'passed').length;
    const checkingBonus = checks.some((c) => c.status === 'checking') ? 10 : 0;
    return Math.min(100, (passedCount / checks.length) * 100 + checkingBonus);
  };

  const handleContactSupport = () => {
    alert('Connecting you with the SkillBridge Trust & Safety Team at support@skillbridge.dev');
  };

  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
      {/* Engine Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#0E0830] text-white flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              AI Trust &amp; Safety Engine
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Verifies authenticity, safety &amp; craft relevance before publishing
            </p>
          </div>
        </div>

        {/* Developer Testing Toggle (Discreet) */}
        {process.env.NODE_ENV !== 'production' && (
          <button
            type="button"
            onClick={() => setShowDevControls(!showDevControls)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Developer Simulation Controls"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Developer Scenario Control Panel (Only visible when toggled in dev) */}
      {showDevControls && (
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#0E0830] dark:text-indigo-400 text-[11px]">
              DEV TEST SCENARIO
            </span>
            <span className="text-[10px] text-slate-400">Simulated states</span>
          </div>
          <select
            value={simulationScenario}
            onChange={(e) => {
              setSimulationScenario(e.target.value as SimulationScenario);
              handleReset();
            }}
            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 outline-hidden"
          >
            <option value="pass">Scenario: All 5 Checks Pass (Default)</option>
            <option value="fail_originality">Scenario: Fail Originality (Duplicate)</option>
            <option value="fail_authenticity">Scenario: Fail Authenticity (AI/Manipulated)</option>
            <option value="fail_safety">Scenario: Fail Content Safety (Hazard)</option>
            <option value="fail_relevance">Scenario: Fail Category Relevance (Mismatch)</option>
            <option value="error">Scenario: Service Network Error</option>
          </select>
        </div>
      )}

      {/* Verification Trigger Button (Item 4 in instructions) */}
      {overallStatus === 'idle' && (
        <button
          type="button"
          onClick={runVerification}
          disabled={!isButtonEnabled}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#0E0830] hover:bg-[#1a1147] active:scale-98 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed group"
        >
          <Sparkles className="w-4 h-4 text-indigo-300 group-hover:rotate-12 transition-transform" />
          <span>AI Trust &amp; Safety Check</span>
        </button>
      )}

      {/* Active or Completed Verification Panel */}
      {overallStatus !== 'idle' && (
        <div className="space-y-4 pt-1">
          {/* Progress Indicator */}
          <VerificationProgress
            progressPercent={calculateProgress()}
            currentStepIndex={currentStepIndex}
            totalSteps={checks.length}
            isComplete={overallStatus === 'passed'}
            hasFailed={overallStatus === 'failed'}
          />

          {/* 5 Verification Check Items */}
          <div className="space-y-2">
            {checks.map((check) => (
              <VerificationCheckItem key={check.id} check={check} />
            ))}
          </div>

          {/* Result or Error State */}
          {(overallStatus === 'passed' || overallStatus === 'failed' || overallStatus === 'error') && (
            <VerificationResult
              status={overallStatus}
              failureDetails={failureDetails}
              onRetry={runVerification}
              onOpenTicketModal={() => setIsTicketModalOpen(true)}
              onContactSupport={handleContactSupport}
            />
          )}

          {/* Re-verify action if finished */}
          {overallStatus !== 'checking' && (
            <button
              type="button"
              onClick={handleReset}
              className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 mx-auto pt-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset &amp; Run Checks Again</span>
            </button>
          )}
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
