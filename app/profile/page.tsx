'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Settings,
  BadgeCheck,
  Mail,
  Grid,
  Play,
  Upload,
  BookmarkCheck,
  CheckCircle2,
  Sparkles,
  Plus,
  Star,
  Flame,
  Trophy,
  Clock,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { ContactTalentModal } from '@/components/talent/ContactTalentModal';
import { Profile, VideoPost, SelectedWork, CreatorConsistencyRating, RATING_CHECKPOINTS } from '@/types';

export default function MobileProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [selectedWorksCount, setSelectedWorksCount] = useState<number>(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [userRating, setUserRating] = useState<CreatorConsistencyRating | null>(null);

  useEffect(() => {
    const user = DataStore.getCurrentUser();
    setCurrentUser(user);
    setProfileData(user);
    setUserRating(DataStore.getCreatorRating(user.id));

    const userVideos = DataStore.getVideosByCreator(user.id);
    setVideos(userVideos.length > 0 ? userVideos : DataStore.getVideos().slice(0, 3));

    // Get count of works selected by organizations
    const allSelected = DataStore.getSelectedWorks();
    const count = allSelected.filter(
      (s) => s.creator_id === user.id || s.creator_email === user.email
    ).length;
    setSelectedWorksCount(count);
  }, []);

  const accountEmail =
    profileData?.email || `${profileData?.username || 'user'}@dance.skillbridge.dev`;

  return (
    <MobileShell hideBottomNav={false}>
      <div className="flex flex-col min-h-full px-4 pt-3 pb-6">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 -ml-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
            @{profileData?.username || 'creator'}
          </span>
          <Link
            href="/settings"
            className="p-1.5 -mr-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            title="Settings & Account"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-4 py-3">
          {/* Avatar */}
          <img
            src={
              profileData?.avatar_url ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
            }
            alt={profileData?.full_name || 'Creator'}
            className="w-16 h-16 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />

          {/* Meaningful Purpose Metrics: Works Shared & Org Selections (NO followers/following) */}
          <div className="flex-1 grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                {videos.length}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Works Shared
              </p>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <p className="text-base font-semibold text-[#0E0830] dark:text-[#c4bbf0]">
                {selectedWorksCount || 2}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Org Selections
              </p>
            </div>
          </div>
        </div>

        {/* Name, Handle, Bio */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm font-semibold text-slate-900 dark:text-white">
              {profileData?.full_name || 'Sarah Johnson'}
            </h1>
            <BadgeCheck className="w-3.5 h-3.5 text-[#0E0830] dark:text-[#c4bbf0]" />
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            @{profileData?.username || 'sarahdance'}
          </p>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
            {profileData?.bio ||
              'Dancer | Choreographer | Dreamer. Focusing on creative mastery and opportunity scouting.'}
          </p>
        </div>

        {/* Verified Account Email Pill */}
        <div className="mt-3 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <Mail className="w-3.5 h-3.5 text-[#0E0830] dark:text-[#c4bbf0] shrink-0" />
            <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate">
              {accountEmail}
            </span>
          </div>
          <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#0E0830]/10 text-[#0E0830] dark:text-[#c4bbf0]">
            Verified
          </span>
        </div>

        {/* DoorDash Style 0-100 Consistency Rating & Tier Card */}
        {userRating && (
          <div className="mt-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <Link href="/rating" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
                <span className="text-xl">
                  {userRating.tier === 'Platinum' && '💎'}
                  {userRating.tier === 'Gold' && '🥇'}
                  {userRating.tier === 'Silver' && '🥈'}
                  {userRating.tier === 'Bronze' && '🥉'}
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0E0830] dark:group-hover:text-[#c4bbf0]">
                      {userRating.tier} Tier
                    </span>
                    <span className="text-xs font-bold text-[#0E0830] dark:text-[#c4bbf0]">
                      {userRating.score}/100
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Daily Upload Ratio · View Details →</p>
                </div>
              </Link>

              <Link
                href="/upload"
                className="px-2.5 py-1 rounded-lg bg-[#0E0830] hover:bg-[#1a1147] text-white text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3 h-3" />
                <span>Upload</span>
              </Link>
            </div>

            {/* 3 Metric Pills with Icons */}
            <div className="grid grid-cols-3 gap-2 text-center pt-0.5">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center">
                <Flame className="w-4 h-4 text-[#0E0830] dark:text-[#c4bbf0] mb-0.5" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">{userRating.streak_days}d</span>
                <span className="text-[9px] text-slate-400 uppercase font-medium">Streak</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center">
                <Clock className="w-4 h-4 text-[#0E0830] dark:text-[#c4bbf0] mb-0.5" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">{userRating.avg_interval_hours}h</span>
                <span className="text-[9px] text-slate-400 uppercase font-medium">Interval</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 flex flex-col items-center">
                <Trophy className="w-4 h-4 text-[#0E0830] dark:text-[#c4bbf0] mb-0.5" />
                <span className="text-xs font-bold text-[#0E0830] dark:text-[#c4bbf0]">{userRating.checkpoint.perk}</span>
                <span className="text-[9px] text-slate-400 uppercase font-medium">Search Rank</span>
              </div>
            </div>

            {/* Visual 3-Tier Checkpoint Progression */}
            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] pt-1">
              <div className={`p-1.5 rounded-lg border flex flex-col items-center gap-0.5 ${
                userRating.score >= 65
                  ? 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                  : 'border-slate-200/60 dark:border-slate-800 opacity-50'
              }`}>
                <span className="font-semibold">Silver</span>
                <span className="text-[9px] font-mono text-slate-400">65-79</span>
              </div>

              <div className={`p-1.5 rounded-lg border flex flex-col items-center gap-0.5 ${
                userRating.score >= 80
                  ? 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                  : 'border-slate-200/60 dark:border-slate-800 opacity-50'
              }`}>
                <span className="font-semibold">Gold</span>
                <span className="text-[9px] font-mono text-slate-400">80-94</span>
              </div>

              <div className={`p-1.5 rounded-lg border flex flex-col items-center gap-0.5 ${
                userRating.score >= 95
                  ? 'border-[#0E0830] bg-[#0E0830]/5 dark:bg-[#0E0830]/30 text-[#0E0830] dark:text-[#c4bbf0] font-semibold shadow-2xs'
                  : 'border-slate-200/60 dark:border-slate-800 opacity-50'
              }`}>
                <span className="font-semibold">Platinum</span>
                <span className="text-[9px] font-mono text-slate-400">95-100</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4">
          <Link
            href="/profile/edit"
            className="flex-1 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium text-center transition-colors"
          >
            Edit Profile
          </Link>
          <Link
            href="/upload"
            className="flex-1 py-2 px-3 rounded-lg bg-[#0E0830] hover:bg-[#1a1147] text-white text-xs font-medium text-center transition-colors shadow-xs flex items-center justify-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Work</span>
          </Link>
        </div>

        {/* Works Section Header */}
        <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-3">
          <div className="flex items-center justify-between pb-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5 text-slate-400" />
              <span>Portfolio Works</span>
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              No public like counters
            </span>
          </div>

          {/* 3-Column Video Thumbnail Grid (NO like counts) */}
          <div className="grid grid-cols-3 gap-1.5">
            {videos.map((vid) => (
              <Link
                key={vid.id}
                href={`/video/${vid.id}`}
                className="relative aspect-3/4 rounded-lg overflow-hidden bg-slate-900 group"
              >
                <img
                  src={vid.thumbnail_url}
                  alt={vid.title || 'Work'}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />

                {/* Duration Badge */}
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-mono">
                  {vid.duration_formatted || '01:00'}
                </span>

                {/* Organization Selection Indicator */}
                {vid.is_selected_by_org && (
                  <span className="absolute bottom-1.5 left-1.5 p-1 rounded bg-[#0E0830] text-white" title="Selected by organization">
                    <BookmarkCheck className="w-3 h-3" />
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Talent Modal */}
      {profileData && (
        <ContactTalentModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          creator={{
            id: profileData.id,
            username: profileData.username,
            full_name: profileData.full_name,
            avatar_url: profileData.avatar_url,
          }}
        />
      )}
    </MobileShell>
  );
}
