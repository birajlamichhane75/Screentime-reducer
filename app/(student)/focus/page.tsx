'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Award,
  ArrowRight,
  Flame,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DataStore } from '@/services/dataStore';
import { UserHobby, ActivitySession } from '@/types';
import { formatSeconds } from '@/lib/utils';

function FocusModeContent() {
  const searchParams = useSearchParams();
  const preselectedHobbyId = searchParams.get('hobby') || '';

  const currentUser = DataStore.getCurrentUser();
  const [userHobbies, setUserHobbies] = useState<UserHobby[]>([]);
  const [selectedHobbyId, setSelectedHobbyId] = useState(preselectedHobbyId);
  const [sessionMinutes, setSessionMinutes] = useState(30);
  const [goalText, setGoalText] = useState('');

  // Active Timer State
  const [activeSession, setActiveSession] = useState<ActivitySession | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Completion modal state
  const [notes, setNotes] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [completionResult, setCompletionResult] = useState<{
    pointsAwarded: number;
    newAchievements: { title: string; description: string }[];
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const hobbies = DataStore.getUserHobbies(currentUser.id);
    setUserHobbies(hobbies);
    if (!selectedHobbyId && hobbies.length > 0) {
      setSelectedHobbyId(hobbies[0].hobby_id);
    }
  }, [currentUser.id, selectedHobbyId]);

  // Timer Tick Loop
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleStartSession = () => {
    if (!selectedHobbyId) return;
    const totalSeconds = sessionMinutes * 60;
    const session = DataStore.startSession(
      currentUser.id,
      selectedHobbyId,
      totalSeconds,
      goalText
    );
    setActiveSession(session);
    setTimeLeft(totalSeconds);
    setIsRunning(true);
    setIsFinished(false);
    setCompletionResult(null);
  };

  const handlePauseResume = () => {
    setIsRunning((prev) => !prev);
  };

  const handleCancelSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setActiveSession(null);
    setTimeLeft(0);
    setIsFinished(false);
  };

  const handleCompleteSession = () => {
    if (!activeSession) return;
    const result = DataStore.completeSession(activeSession.id, notes, evidenceUrl);

    // Fire celebration confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setCompletionResult({
      pointsAwarded: result.pointsAwarded,
      newAchievements: result.newAchievements.map((a) => ({
        title: a.title,
        description: a.description,
      })),
    });
  };

  const handleResetForNext = () => {
    setActiveSession(null);
    setCompletionResult(null);
    setIsFinished(false);
    setNotes('');
    setEvidenceUrl('');
  };

  const selectedHobbyObj = userHobbies.find((uh) => uh.hobby_id === selectedHobbyId)?.hobby;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
          <Timer className="w-3.5 h-3.5" />
          <span>Distraction-Free Focus Practice</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Focus Mode
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-lg mx-auto">
          Put down passive social media feeds and dedicate focused time to your real-world hobby.
        </p>
      </div>

      {/* Main Focus Window */}
      {!activeSession ? (
        /* Configuration State */
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              1. Select Hobby to Practice
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {userHobbies.map((uh) => {
                const isSelected = selectedHobbyId === uh.hobby_id;
                return (
                  <button
                    key={uh.id}
                    type="button"
                    onClick={() => setSelectedHobbyId(uh.hobby_id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {uh.hobby?.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {uh.hobby?.category} &bull; Target: {uh.daily_target_mins}m/day
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              2. Session Duration
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setSessionMinutes(mins)}
                  className={`py-3 rounded-2xl border text-center font-bold text-sm transition-all ${
                    sessionMinutes === mins
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              3. Practice Goal (Optional)
            </label>
            <input
              type="text"
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="e.g. Sketch 3 hand gesture poses or implement responsive navbar"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm"
            />
          </div>

          <button
            type="button"
            id="start-focus-session-btn"
            onClick={handleStartSession}
            disabled={!selectedHobbyId}
            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base shadow-lg shadow-indigo-600/30 transition-all hover:scale-101 flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Start {sessionMinutes}-Minute Practice Session</span>
          </button>
        </div>
      ) : completionResult ? (
        /* Completion Summary Modal State */
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Practice Session Completed!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {Math.round(activeSession.duration_seconds / 60)} minutes of dedicated focus logged.
            </p>
          </div>

          {completionResult.pointsAwarded > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 inline-flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-sm">
              <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
              <span>+{completionResult.pointsAwarded} Achievement Points Recorded in Ledger!</span>
            </div>
          )}

          {completionResult.newAchievements.length > 0 && (
            <div className="space-y-2 max-w-md mx-auto">
              {completionResult.newAchievements.map((ach, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-left flex items-center gap-3"
                >
                  <Award className="w-6 h-6 text-indigo-600 shrink-0" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{ach.title}</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleResetForNext}
              className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
            >
              Start Another Session
            </button>
            <a
              href="/portfolio/new"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <span>Add to Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ) : (
        /* Active Focus Timer Interface */
        <div className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-8 animate-in fade-in">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Practicing: {selectedHobbyObj?.name}
            </span>
            {activeSession.goal_text && (
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1 italic">
                &ldquo;{activeSession.goal_text}&rdquo;
              </p>
            )}
          </div>

          {/* Large Countdown Display */}
          <div className="py-4">
            <div className="text-6xl sm:text-8xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
              {formatSeconds(timeLeft)}
            </div>
            <p className="text-xs font-semibold text-slate-400 mt-2">
              {isRunning ? 'Focused practice in progress...' : 'Session Paused'}
            </p>
          </div>

          {/* Controls */}
          {!isFinished ? (
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                id="pause-resume-timer-btn"
                onClick={handlePauseResume}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isRunning ? 'Pause Timer' : 'Resume Timer'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFinished(true)}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finish Early</span>
              </button>

              <button
                type="button"
                onClick={handleCancelSession}
                className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            /* Session Completed Notes & Evidence Form */
            <div className="max-w-md mx-auto text-left space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Log Your Focus Session Notes
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  What did you practice or accomplish?
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Completed 2 landscape value studies in watercolor..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Evidence URL or Image Link (Optional)
                </label>
                <input
                  type="url"
                  value={evidenceUrl}
                  onChange={(e) => setEvidenceUrl(e.target.value)}
                  placeholder="https://imgur.com/... or GitHub link"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <button
                type="button"
                id="claim-session-reward-btn"
                onClick={handleCompleteSession}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Save Session & Record Points</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Product Principle & Honesty Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
        <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          <strong>Self-Reported Craft Practice:</strong> A completed timer represents self-reported effort unless backed by verifiable evidence uploaded to your portfolio. ShowUp! rewards deliberate practice consistency over passive scrolling.
        </p>
      </div>
    </div>
  );
}

export default function FocusModePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading focus timer...</div>}>
      <FocusModeContent />
    </Suspense>
  );
}
