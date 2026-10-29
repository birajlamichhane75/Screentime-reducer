'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Gift,
  Camera,
  Sparkles,
  Users,
  Award,
  Building2,
  CheckCircle2,
  Flame,
  Clock,
  Trophy,
  BookmarkCheck,
  Check,
  Copy,
  ExternalLink,
  Lock,
  ChevronRight,
  X,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { Profile, CreatorConsistencyRating, CreatorReward, RewardEvent } from '@/types';

export default function RewardsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [userRating, setUserRating] = useState<CreatorConsistencyRating | null>(null);
  const [rewards, setRewards] = useState<CreatorReward[]>([]);
  const [history, setHistory] = useState<RewardEvent[]>([]);
  const [activeTab, setActiveTab] = useState<'available' | 'history'>('available');
  const [claimedSuccessModal, setClaimedSuccessModal] = useState<{
    show: boolean;
    reward?: CreatorReward;
    code?: string;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const user = DataStore.getCurrentUser();
    setCurrentUser(user);
    setUserRating(DataStore.getCreatorRating(user.id));
    setRewards(DataStore.getCreatorRewards(user.id));
    setHistory(DataStore.getRewardEvents(user.id));
  }, []);

  const totalPoints = history.reduce((sum, h) => sum + (h.points || 0), 0);

  const handleClaimReward = (reward: CreatorReward) => {
    if (!currentUser) return;
    const result = DataStore.claimCreatorReward(currentUser.id, reward.id);
    if (result.success && result.reward) {
      setRewards(DataStore.getCreatorRewards(currentUser.id));
      setHistory(DataStore.getRewardEvents(currentUser.id));
      setClaimedSuccessModal({
        show: true,
        reward: result.reward,
        code: result.reward.claimCode,
      });
    }
  };

  const handleCopyCode = (code?: string) => {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getRewardIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'camera':
        return <Camera className="w-6 h-6 text-[#0E0830] dark:text-[#c4bbf0]" />;
      case 'sparkles':
        return <Sparkles className="w-6 h-6 text-[#0E0830] dark:text-[#c4bbf0]" />;
      case 'users':
        return <Users className="w-6 h-6 text-[#0E0830] dark:text-[#c4bbf0]" />;
      case 'award':
        return <Award className="w-6 h-6 text-[#0E0830] dark:text-[#c4bbf0]" />;
      case 'building2':
        return <Building2 className="w-6 h-6 text-slate-400" />;
      default:
        return <Gift className="w-6 h-6 text-[#0E0830] dark:text-[#c4bbf0]" />;
    }
  };

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case 'work_selected':
        return <BookmarkCheck className="w-5 h-5 text-emerald-600" />;
      case 'milestone_reached':
        return <Award className="w-5 h-5 text-[#0E0830] dark:text-[#c4bbf0]" />;
      case 'streak_bonus':
        return <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />;
      case 'reward_claimed':
        return <Gift className="w-5 h-5 text-purple-600" />;
      case 'challenge_completed':
        return <Trophy className="w-5 h-5 text-amber-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#0E0830] dark:text-[#c4bbf0]" />;
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
            <Gift className="w-3.5 h-3.5 text-[#0E0830] dark:text-[#c4bbf0]" />
            <span>Creator Rewards</span>
          </div>
          <Link
            href="/rating"
            className="p-1.5 -mr-1.5 rounded-lg text-slate-500 hover:text-[#0E0830] dark:hover:text-white transition-colors"
            title="Rating"
          >
            <Trophy className="w-4 h-4" />
          </Link>
        </div>

        {/* Work Status Summary Bar (High Visual / Big Icons) */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-around text-center">
          <Link href="/rating" className="flex flex-col items-center group">
            <span className="text-xl">
              {userRating?.tier === 'Platinum' ? '💎' : userRating?.tier === 'Gold' ? '🥇' : '🥈'}
            </span>
            <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 group-hover:text-[#0E0830]">
              {userRating?.score ?? 98}/100
            </span>
            <span className="text-[9px] uppercase font-semibold text-slate-400">
              {userRating?.tier ?? 'Platinum'}
            </span>
          </Link>

          <div className="w-px h-8 bg-slate-200/80 dark:bg-slate-800" />

          <div className="flex flex-col items-center">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
              {userRating?.streak_days ?? 7}d
            </span>
            <span className="text-[9px] uppercase font-semibold text-slate-400">
              Daily Streak
            </span>
          </div>

          <div className="w-px h-8 bg-slate-200/80 dark:bg-slate-800" />

          <div className="flex flex-col items-center">
            <Trophy className="w-5 h-5 text-[#0E0830] dark:text-[#c4bbf0]" />
            <span className="text-xs font-bold text-[#0E0830] dark:text-[#c4bbf0] mt-0.5">
              {totalPoints}
            </span>
            <span className="text-[9px] uppercase font-semibold text-slate-400">
              Reward Points
            </span>
          </div>
        </div>

        {/* Clean Segmented Tab Switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('available')}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'available'
                ? 'bg-white dark:bg-slate-900 text-[#0E0830] dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Available Rewards ({rewards.filter((r) => r.status !== 'locked').length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'history'
                ? 'bg-white dark:bg-slate-900 text-[#0E0830] dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Reward History ({history.length})
          </button>
        </div>

        {/* TAB 1: Available Rewards Right Now Based On Work */}
        {activeTab === 'available' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Earned from Your Creative Craft
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {userRating?.tier} Level
              </span>
            </div>

            {rewards.map((reward) => {
              const isUnlocked = reward.status === 'unlocked';
              const isClaimed = reward.status === 'claimed';
              const isLocked = reward.status === 'locked';

              return (
                <div
                  key={reward.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isClaimed
                      ? 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200/70 dark:border-slate-800'
                      : isUnlocked
                      ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 shadow-xs'
                      : 'bg-white dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Big Icon Container */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        isClaimed
                          ? 'bg-slate-100 dark:bg-slate-800'
                          : isUnlocked
                          ? 'bg-[#0E0830]/5 dark:bg-[#0E0830]/40 border border-[#0E0830]/20'
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                    >
                      {getRewardIcon(reward.icon)}
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {reward.title}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#0E0830] text-white shrink-0">
                          {reward.valueTag}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {reward.perkDescription}
                      </p>

                      {/* Requirement & Action Row */}
                      <div className="flex items-center justify-between pt-1.5">
                        <span className="text-[10px] text-slate-400 font-medium">
                          Requires {reward.requiredTier} (Score {reward.minScore}+)
                        </span>

                        {isUnlocked && (
                          <button
                            onClick={() => handleClaimReward(reward)}
                            className="px-3 py-1.5 rounded-lg bg-[#0E0830] hover:bg-[#1a1147] text-white text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <span>Claim</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}

                        {isClaimed && (
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Claimed</span>
                          </div>
                        )}

                        {isLocked && (
                          <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                            <Lock className="w-3 h-3" />
                            <span>Locked</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: Reward History */}
        {activeTab === 'history' && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Redemptions & Earned Milestones
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {history.length} Events
              </span>
            </div>

            {history.map((event) => (
              <div
                key={event.id}
                className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {getHistoryIcon(event.event_type)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {event.description}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(event.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-[#0E0830] dark:text-[#c4bbf0]">
                    +{event.points} pts
                  </span>
                  <p className="text-[9px] text-emerald-600 font-semibold">
                    Verified
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Claimed Reward Success Modal */}
        {claimedSuccessModal && claimedSuccessModal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#0E0830]/10 text-[#0E0830] dark:text-[#c4bbf0] flex items-center justify-center mx-auto text-2xl">
                🎁
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Reward Unlocked!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You claimed &quot;{claimedSuccessModal.reward?.title}&quot; based on your Platinum upload streak.
                </p>
              </div>

              {/* Redemption Voucher Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Your Voucher Code
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-base font-black text-[#0E0830] dark:text-[#c4bbf0] tracking-wider">
                    {claimedSuccessModal.code}
                  </span>
                  <button
                    onClick={() => handleCopyCode(claimedSuccessModal.code)}
                    className="p-1 rounded text-slate-500 hover:text-slate-900"
                    title="Copy Code"
                  >
                    {copiedCode ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setClaimedSuccessModal(null)}
                className="w-full py-2.5 rounded-xl bg-[#0E0830] hover:bg-[#1a1147] text-white text-xs font-bold transition-colors shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}

