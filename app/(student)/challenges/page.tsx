'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Flame,
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { DataStore } from '@/services/dataStore';
import { Challenge, ChallengeSubmission } from '@/types';
import { formatDate } from '@/lib/utils';

export default function ChallengesPage() {
  const currentUser = DataStore.getCurrentUser();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    setChallenges(DataStore.getChallenges());
    setSubmissions(DataStore.getSubmissions(currentUser.id));
  }, [currentUser.id]);

  const categories = ['All', ...new Set(challenges.map((c) => c.category))];

  const filteredChallenges = challenges.filter((c) => {
    if (selectedCategory === 'All') return true;
    return c.category === selectedCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-3">
          <Trophy className="w-3.5 h-3.5" />
          <span>Platform Challenges & Sprints</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Community Skill Challenges
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Complete structured creative exercises to test your discipline, accumulate points, and build portfolio-worthy artifacts.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500 text-white shadow-xs font-bold'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChallenges.map((ch) => {
          const userSub = submissions.find((s) => s.challenge_id === ch.id);
          const isCompleted = userSub?.status === 'accepted';

          return (
            <div
              key={ch.id}
              className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition-all flex flex-col justify-between shadow-xs ${
                isCompleted
                  ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                  : 'border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    {ch.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-extrabold text-xs">
                    <Flame className="w-4 h-4 fill-amber-500" />
                    <span>+{ch.reward_points} pts</span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {ch.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {ch.description}
                </p>

                <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  <strong className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    Requirements:
                  </strong>
                  <span>{ch.submission_requirements}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {ch.duration_mins}m
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Deadline {formatDate(ch.deadline)}
                  </span>
                </div>

                {isCompleted ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed (+{ch.reward_points} pts)</span>
                  </span>
                ) : (
                  <Link
                    href={`/challenges/${ch.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-102"
                  >
                    <span>Submit Work</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
