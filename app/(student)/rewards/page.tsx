'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  Flame,
  Sparkles,
  Trophy,
  Briefcase,
  CheckCircle2,
  Calendar,
  Lock,
  ShieldAlert,
} from 'lucide-react';
import { DataStore } from '@/services/dataStore';
import { RewardEvent, UserAchievement } from '@/types';
import { DEFAULT_ACHIEVEMENTS } from '@/services/rewards';
import { formatDate } from '@/lib/utils';

export default function RewardsPage() {
  const currentUser = DataStore.getCurrentUser();
  const [rewardEvents, setRewardEvents] = useState<RewardEvent[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);

  useEffect(() => {
    setRewardEvents(DataStore.getRewardEvents(currentUser.id));
    setUserAchievements(DataStore.getUserAchievements(currentUser.id));
  }, [currentUser.id]);

  const totalPoints = rewardEvents.reduce((sum, r) => sum + r.points, 0);
  const unlockedCodes = userAchievements.map((ua) => ua.achievement?.code);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Ledger Balance Hero */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-500 via-indigo-600 to-indigo-900 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-3">
              <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>Immutable Achievement Ledger</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black">
              {totalPoints} <span className="text-xl font-bold opacity-80">Points Accumulated</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-md">
              Points are awarded server-side for completed focus sessions, verified portfolio projects, and accepted community challenges.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/focus"
              className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-100 transition-colors"
            >
              Earn +10 in Focus Mode
            </Link>
          </div>
        </div>
      </div>

      {/* Milestone Badges System */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Milestone Badges ({userAchievements.length} / {DEFAULT_ACHIEVEMENTS.length} Unlocked)
          </h2>
          <p className="text-xs text-slate-400">
            Earn permanent credentials by consistently advancing your craft
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEFAULT_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlockedCodes.includes(ach.code);
            return (
              <div
                key={ach.code}
                className={`p-5 rounded-3xl border transition-all flex items-start gap-4 ${
                  isUnlocked
                    ? 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/60 shadow-xs'
                    : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isUnlocked
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shadow-sm'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isUnlocked ? <Award className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {ach.title}
                    </h3>
                    {isUnlocked && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {ach.description}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-2">
                    Requirement: {ach.criteria_value} {ach.criteria_type.replace('_', ' ')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transactional Reward Events Ledger */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Reward Ledger History ({rewardEvents.length} Events)
          </h2>
          <p className="text-xs text-slate-400">
            Audit-safe, append-only record of all point transactions
          </p>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {rewardEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {evt.description}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                      <span className="capitalize">{evt.event_type.replace('_', ' ')}</span>
                      <span>&bull;</span>
                      <span>{formatDate(evt.created_at)}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400">
                    +{evt.points} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Policy Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
        <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          Internal achievement points represent platform engagement milestones. Points possess no direct monetary cash value and do not guarantee scholarships, employment, or external awards.
        </p>
      </div>
    </div>
  );
}
