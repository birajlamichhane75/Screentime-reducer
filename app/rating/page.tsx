'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Flame,
  Clock,
  Shield,
  Gift,
  Upload,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { Profile, CreatorConsistencyRating } from '@/types';

export default function RatingPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [userRating, setUserRating] = useState<CreatorConsistencyRating | null>(null);

  useEffect(() => {
    const user = DataStore.getCurrentUser();
    setCurrentUser(user);
    setUserRating(DataStore.getCreatorRating(user.id));
  }, []);

  const score = userRating?.score ?? 98;
  const tier = userRating?.tier ?? 'Platinum';

  // Single sign (Shield) filled with tier color and specular shine
  const getTierFillAndColor = (t: string) => {
    switch (t) {
      case 'Platinum':
        return 'text-indigo-400 fill-indigo-400';
      case 'Gold':
        return 'text-amber-400 fill-amber-400';
      case 'Silver':
        return 'text-slate-400 fill-slate-300';
      default:
        return 'text-amber-700 fill-amber-700';
    }
  };

  return (
    <MobileShell hideBottomNav={false}>
      <div className="flex flex-col min-h-full px-4 pt-4 pb-8 space-y-4">
        {/* Top Header: Using only text-sm */}
        <div className="flex items-center justify-between pb-2">
          <button
            onClick={() => router.back()}
            className="p-1 -ml-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 dark:text-white">
            <Shield className={`w-4 h-4 ${getTierFillAndColor(tier)}`} />
            <span>Consistency Rating</span>
          </div>
          <Link
            href="/rewards"
            className="p-1 -mr-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            title="Rewards"
          >
            <Gift className="w-5 h-5" />
          </Link>
        </div>

        {/* Big Hero Card: Only 2 font sizes (text-2xl and text-sm) */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-center space-y-3">
          {/* 3D Shield Badge with Shining Inside */}
          <div className="flex items-center justify-center">
            <div
              className={`relative w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden border-t-2 border-white/60 ${
                tier === 'Platinum'
                  ? 'bg-gradient-to-br from-indigo-300 via-indigo-500 to-indigo-700 shadow-[0_6px_0_#312e81,0_10px_20px_rgba(79,70,229,0.4),inset_0_2px_4px_rgba(255,255,255,0.8)]'
                  : tier === 'Gold'
                  ? 'bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 shadow-[0_6px_0_#78350f,0_10px_20px_rgba(245,158,11,0.4),inset_0_2px_4px_rgba(255,255,255,0.8)]'
                  : 'bg-gradient-to-br from-slate-100 via-slate-300 to-slate-500 shadow-[0_6px_0_#334155,0_10px_20px_rgba(100,116,139,0.4),inset_0_2px_4px_rgba(255,255,255,0.8)]'
              }`}
            >
              <Shield className="w-9 h-9 fill-white text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
              <span className="absolute inset-0 -translate-x-full animate-shine-sweep bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Score: Just the score in text-2xl (no /100) */}
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono block">
              {score}
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white block">
              {tier} Creator
            </span>
          </div>

          {/* Progress Bar with 3 Checkpoints (0 and 100 removed) */}
          <div className="space-y-2 pt-1 max-w-xs mx-auto">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0E0830] dark:bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
              />
            </div>
            {/* Exactly 3 Checkpoint Signs on Progress Bar (Silver, Gold, Platinum) */}
            <div className="flex items-center justify-between text-sm px-1">
              {/* Silver Checkpoint Sign */}
              <div className="flex items-center gap-1 text-slate-400">
                <Shield className="w-3.5 h-3.5 text-slate-400 fill-slate-300" />
                <span className="font-bold">65 Silver</span>
              </div>

              {/* Gold Checkpoint Sign */}
              <div className="flex items-center gap-1 text-amber-500">
                <Shield className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span className="font-bold">80 Gold</span>
              </div>

              {/* Platinum Checkpoint Sign */}
              <div className="flex items-center gap-1 text-indigo-500">
                <Shield className="w-3.5 h-3.5 text-indigo-500 fill-indigo-400" />
                <span className="font-bold">95 Plat</span>
              </div>
            </div>
          </div>
        </div>

        {/* Just Daily Ratio & Active Streak (No Org Search or Org Selected) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Daily Ratio */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center space-y-1 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Clock className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {userRating?.avg_interval_hours ?? 24}h
            </span>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Daily Ratio
            </span>
          </div>

          {/* Active Streak */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center space-y-1 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Flame className="w-5 h-5 text-slate-700 dark:text-slate-200" />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {userRating?.streak_days ?? 7}d
            </span>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Active Streak
            </span>
          </div>
        </div>

        {/* Rating Checkpoints: Bigger Text, Single Sign with Colors, Big Interval, No Tiny Right Clutter */}
        <div className="space-y-3">
          <span className="text-sm font-bold text-slate-900 dark:text-white block px-1">
            Checkpoints
          </span>

          {/* Platinum Checkpoint */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              score >= 95
                ? 'bg-slate-50 dark:bg-slate-800 border-[#0E0830] dark:border-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* 3D Platinum Shield Coin with Shining Inside */}
                <div className="relative w-13 h-13 rounded-2xl bg-gradient-to-br from-[#c7d2fe] via-[#6366f1] to-[#3730a3] shadow-[0_5px_0_#1e1b4b,0_8px_16px_rgba(79,70,229,0.35),inset_0_2px_4px_rgba(255,255,255,0.8)] border-t-2 border-white/60 flex items-center justify-center overflow-hidden">
                  <Shield className="w-6 h-6 fill-white text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                  <span className="absolute inset-0 -translate-x-full animate-shine-sweep bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
                </div>
                <div>
                  <span className="text-2xl font-black text-indigo-400 block">
                    Platinum
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Score 95–100
                  </span>
                </div>
              </div>
              {/* Right Side: Medium Font with Interval */}
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 text-right">
                Every 24 hours
              </span>
            </div>
          </div>

          {/* Gold Checkpoint */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              score >= 80 && score < 95
                ? 'bg-slate-50 dark:bg-slate-800 border-[#0E0830] dark:border-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* 3D Gold Shield Coin with Shining Inside */}
                <div className="relative w-13 h-13 rounded-2xl bg-gradient-to-br from-[#fef08a] via-[#eab308] to-[#854d0e] shadow-[0_5px_0_#451a03,0_8px_16px_rgba(234,179,8,0.35),inset_0_2px_4px_rgba(255,255,255,0.8)] border-t-2 border-white/60 flex items-center justify-center overflow-hidden">
                  <Shield className="w-6 h-6 fill-white text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                  <span className="absolute inset-0 -translate-x-full animate-shine-sweep bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
                </div>
                <div>
                  <span className="text-2xl font-black text-amber-400 block">
                    Gold
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Score 80–94
                  </span>
                </div>
              </div>
              {/* Right Side: Medium Font with Interval */}
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 text-right">
                Every 48 hours
              </span>
            </div>
          </div>

          {/* Silver Checkpoint */}
          <div
            className={`p-4 rounded-2xl border transition-all ${
              score >= 65 && score < 80
                ? 'bg-slate-50 dark:bg-slate-800 border-[#0E0830] dark:border-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* 3D Silver Shield Coin with Shining Inside */}
                <div className="relative w-13 h-13 rounded-2xl bg-gradient-to-br from-[#f1f5f9] via-[#94a3b8] to-[#475569] shadow-[0_5px_0_#1e293b,0_8px_16px_rgba(100,116,139,0.35),inset_0_2px_4px_rgba(255,255,255,0.8)] border-t-2 border-white/60 flex items-center justify-center overflow-hidden">
                  <Shield className="w-6 h-6 fill-white text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
                  <span className="absolute inset-0 -translate-x-full animate-shine-sweep bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-400 block">
                    Silver
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Score 65–79
                  </span>
                </div>
              </div>
              {/* Right Side: Medium Font with Interval */}
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 text-right">
                Every 72 hours
              </span>
            </div>
          </div>
        </div>

        {/* Direct Upload CTA (Only text-sm) */}
        <div className="pt-2">
          <Link
            href="/upload"
            className="w-full py-4 rounded-2xl bg-[#0E0830] hover:bg-[#1a1147] text-white text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Today&apos;s Craft</span>
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}
