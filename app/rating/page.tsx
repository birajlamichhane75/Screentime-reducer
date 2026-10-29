'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Flame,
  Clock,
  Trophy,
  BookmarkCheck,
  Plus,
  Gift,
  CheckCircle2,
  Sparkles,
  Building2,
  TrendingUp,
  Shield,
  Zap,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { Profile, CreatorConsistencyRating, RATING_CHECKPOINTS } from '@/types';

export default function RatingPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [userRating, setUserRating] = useState<CreatorConsistencyRating | null>(null);
  const [selectedWorksCount, setSelectedWorksCount] = useState<number>(0);

  useEffect(() => {
    const user = DataStore.getCurrentUser();
    setCurrentUser(user);
    setUserRating(DataStore.getCreatorRating(user.id));

    const allSelected = DataStore.getSelectedWorks();
    const count = allSelected.filter(
      (s) => s.creator_id === user.id || s.creator_email === user.email
    ).length;
    setSelectedWorksCount(count);
  }, []);

  const score = userRating?.score ?? 98;
  const tier = userRating?.tier ?? 'Platinum';

  const getTierIcon = (t: string) => {
    switch (t) {
      case 'Platinum':
        return '💎';
      case 'Gold':
        return '🥇';
      case 'Silver':
        return '🥈';
      default:
        return '🥉';
    }
  };

  return (
    <MobileShell hideBottomNav={false}>
      <div className="flex flex-col min-h-full px-4 pt-3 pb-8 space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-1">
          <button
            onClick={() => router.back()}
            className="p-1.5 -ml-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
            <Trophy className="w-3.5 h-3.5 text-[#0E0830] dark:text-[#c4bbf0]" />
            <span>Consistency Rating</span>
          </div>
          <Link
            href="/rewards"
            className="p-1.5 -mr-1.5 rounded-lg text-slate-500 hover:text-[#0E0830] dark:hover:text-white transition-colors"
            title="Rewards"
          >
            <Gift className="w-4 h-4" />
          </Link>
        </div>

        {/* Big Hero Card - Clean & Visual */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 text-center shadow-xs">
          {/* Subtle background glow */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#0E0830]/5 dark:bg-[#0E0830]/30 rounded-full blur-2xl pointer-events-none" />

          {/* Huge Tier Emblem */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#0E0830]/5 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-4xl mb-3 shadow-2xs">
            {getTierIcon(tier)}
          </div>

          {/* Big DoorDash-Style 0-100 Score */}
          <div className="space-y-0.5">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
                {score}
              </span>
              <span className="text-sm font-semibold text-slate-400">/ 100</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {tier} Creator
            </h2>
            <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              ● Top 1% Upload Consistency
            </p>
          </div>

          {/* Clean Progress Meter */}
          <div className="mt-4 max-w-xs mx-auto">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#0E0830] dark:bg-[#c4bbf0] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
              <span>0</span>
              <span>🥈 65</span>
              <span>🥇 80</span>
              <span>💎 95</span>
              <span>100</span>
            </div>
          </div>
        </div>

        {/* 4 Big-Icon Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Metric 1: Upload Interval */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center text-center shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-[#0E0830] dark:text-[#c4bbf0]" />
            </div>
            <span className="text-base font-black text-slate-900 dark:text-white">
              {userRating?.avg_interval_hours ?? 24}h
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-400">
              Daily Ratio
            </span>
          </div>

          {/* Metric 2: Streak Days */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center text-center shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mb-2">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
            <span className="text-base font-black text-slate-900 dark:text-white">
              {userRating?.streak_days ?? 7}d
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-400">
              Active Streak
            </span>
          </div>

          {/* Metric 3: Search Priority */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center text-center shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/30 flex items-center justify-center mb-2">
              <Trophy className="w-5 h-5 text-[#0E0830] dark:text-[#c4bbf0]" />
            </div>
            <span className="text-base font-black text-[#0E0830] dark:text-[#c4bbf0]">
              #1 Rank
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-400">
              Org Search
            </span>
          </div>

          {/* Metric 4: Shortlisted Works */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center text-center shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-2">
              <BookmarkCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
              {selectedWorksCount || 3}
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-400">
              Org Selected
            </span>
          </div>
        </div>

        {/* Big Tier Breakdown Cards - DoorDash Scale */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Rating Checkpoints
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              Ratio / 24h
            </span>
          </div>

          {/* Platinum Tier */}
          <div
            className={`p-3 rounded-2xl border transition-all ${
              score >= 95
                ? 'bg-slate-50 dark:bg-slate-850 border-[#0E0830] dark:border-[#c4bbf0] shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200/70 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">💎</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Platinum
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">
                      95–100
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Daily Uploads (≤24h)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded-md bg-[#0E0830] text-white text-[10px] font-bold">
                  #1 Search Rank
                </span>
                <p className="text-[9px] text-emerald-600 font-medium mt-0.5">
                  $250 Gear Grant
                </p>
              </div>
            </div>
          </div>

          {/* Gold Tier */}
          <div
            className={`p-3 rounded-2xl border transition-all ${
              score >= 80 && score < 95
                ? 'bg-slate-50 dark:bg-slate-850 border-[#0E0830] dark:border-[#c4bbf0] shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200/70 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🥇</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Gold
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">
                      80–94
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Frequent Uploads (≤48h)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                  Top 3 Rank
                </span>
                <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                  1-on-1 Scouting
                </p>
              </div>
            </div>
          </div>

          {/* Silver Tier */}
          <div
            className={`p-3 rounded-2xl border transition-all ${
              score >= 65 && score < 80
                ? 'bg-slate-50 dark:bg-slate-850 border-[#0E0830] dark:border-[#c4bbf0] shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200/70 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🥈</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Silver
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">
                      65–79
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Regular Uploads (≤72h)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                  Priority Search
                </span>
                <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                  Pro Studio Suite
                </p>
              </div>
            </div>
          </div>

          {/* Bronze Tier */}
          <div
            className={`p-3 rounded-2xl border transition-all ${
              score < 65
                ? 'bg-slate-50 dark:bg-slate-850 border-[#0E0830] dark:border-[#c4bbf0] shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200/70 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🥉</span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Bronze
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">
                      &lt;65
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Occasional Uploads (&gt;72h)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-medium">
                  Standard Listing
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Organization Search Impact Visual Box */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0E0830] dark:text-[#c4bbf0]" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              How Organizations Find You
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            When verified partner universities and talent scouts filter by your field (Dance, Art, Music), high consistency creators (95+) are placed at the absolute top of discovery results.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-2 pt-2">
          <Link
            href="/upload"
            className="w-full py-3 rounded-xl bg-[#0E0830] hover:bg-[#1a1147] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Today&apos;s Craft (+Rating)</span>
          </Link>

          <Link
            href="/rewards"
            className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Gift className="w-4 h-4 text-[#0E0830] dark:text-[#c4bbf0]" />
            <span>View Available Rewards</span>
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}

