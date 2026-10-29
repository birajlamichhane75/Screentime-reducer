'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Trophy,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DataStore } from '@/services/dataStore';
import { Challenge, ChallengeSubmission } from '@/types';
import { formatDate } from '@/lib/utils';

function ChallengeDetailContent() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.id as string;
  const currentUser = DataStore.getCurrentUser();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [existingSubmission, setExistingSubmission] = useState<ChallengeSubmission | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const all = DataStore.getChallenges();
    const ch = all.find((c) => c.id === challengeId);
    if (ch) {
      setChallenge(ch);
      setTitle(`Submission: ${ch.title}`);
    }

    const subs = DataStore.getSubmissions(currentUser.id);
    const prev = subs.find((s) => s.challenge_id === challengeId);
    if (prev) setExistingSubmission(prev);
  }, [challengeId, currentUser.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !evidenceUrl || !challenge) return;

    setIsSubmitting(true);
    setTimeout(() => {
      DataStore.submitChallenge(
        currentUser.id,
        challenge.id,
        title,
        description,
        evidenceUrl
      );

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setIsSubmitting(false);
      setSuccess(true);
    }, 400);
  };

  if (!challenge) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Challenge not found.</p>
        <Link href="/challenges" className="text-xs font-bold text-indigo-600 mt-2 inline-block">
          &larr; Back to all challenges
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      <Link
        href="/challenges"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Challenges</span>
      </Link>

      {/* Challenge Overview Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              {challenge.category}
            </span>
            <span className="text-amber-600 dark:text-amber-400 font-extrabold flex items-center gap-1">
              <Flame className="w-4 h-4 fill-amber-500" />
              +{challenge.reward_points} Points
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {challenge.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            {challenge.description}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
          <strong className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Submission Criteria
          </strong>
          <p className="text-slate-700 dark:text-slate-300">{challenge.submission_requirements}</p>
          <div className="pt-2 flex items-center gap-4 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Est. Duration: {challenge.duration_mins} mins
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Due: {formatDate(challenge.deadline)}
            </span>
          </div>
        </div>

        {existingSubmission || success ? (
          <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Challenge Completed!
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              You earned <strong className="text-emerald-600 font-bold">+{challenge.reward_points} achievement points</strong> recorded in your ledger.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                href="/rewards"
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                View Points Ledger
              </Link>
              <Link
                href="/challenges"
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs"
              >
                Next Challenge &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Submit Your Challenge Evidence
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Submission Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Reflections & Evidence Notes
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you observed, techniques applied, or problems solved..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Evidence URL / Image / Code Link
              </label>
              <input
                type="url"
                required
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="https://imgur.com/... or GitHub link or ArtStation URL"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <button
              type="submit"
              id="submit-challenge-work-btn"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : `Submit & Claim +${challenge.reward_points} Points`}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ChallengeDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading challenge...</div>}>
      <ChallengeDetailContent />
    </Suspense>
  );
}
