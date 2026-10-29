'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Settings,
  MoreVertical,
  BadgeCheck,
  Play,
  Share2,
  Mail,
  Bookmark,
  Sparkles,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { ContactTalentModal } from '@/components/talent/ContactTalentModal';
import { VideoPost, Profile } from '@/types';

export default function CreatorProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const user = DataStore.getCurrentUser();
    setCurrentUser(user);

    // If currently logged in as organization, show Sarah Johnson's profile as the talent preview!
    const targetUserId = user.role === 'organization' ? 'usr-student-001' : user.id;
    const userVids = DataStore.getVideosByCreator(targetUserId);
    setVideos(userVids.length > 0 ? userVids : DataStore.getVideos());

    if (user.role === 'organization') {
      setIsSaved(DataStore.isCreatorSaved(user.id, 'usr-student-001'));
    }
  }, []);

  const profileData =
    currentUser?.role === 'organization'
      ? DataStore.getProfileById('usr-student-001') || currentUser
      : currentUser;

  const isOwnProfile = currentUser?.role !== 'organization';

  const handleToggleSave = () => {
    if (!currentUser || !profileData) return;
    const added = DataStore.toggleSaveCreator(currentUser.id, profileData.id);
    setIsSaved(added);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <MobileShell>
      <div className="flex flex-col min-h-full px-4 pt-3 pb-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-3">
          <Link
            href="/feed"
            className="p-1.5 -ml-1.5 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-bold text-xs text-slate-800 dark:text-white">
            @{profileData?.username || 'sarahdance'}
          </span>
          <div className="flex items-center gap-1">
            <Link
              href="/settings"
              className="p-1.5 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <Settings className="w-4 h-4" />
            </Link>
            <button className="p-1.5 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile Stats Header */}
        <div className="flex items-center justify-between gap-4 py-2">
          {/* Avatar */}
          <div className="relative">
            <img
              src={
                profileData?.avatar_url ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
              }
              alt={profileData?.full_name || 'Creator'}
              className="w-18 h-18 rounded-full object-cover ring-2 ring-indigo-600/30 p-0.5"
            />
          </div>

          {/* Stats: Videos | Followers | Following */}
          <div className="flex-1 flex items-center justify-around text-center">
            <div>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                {videos.length || 42}
              </p>
              <p className="text-[10px] text-slate-400">Videos</p>
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">12.4K</p>
              <p className="text-[10px] text-slate-400">Followers</p>
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">256</p>
              <p className="text-[10px] text-slate-400">Following</p>
            </div>
          </div>
        </div>

        {/* Name, Verified Badge & Bio */}
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-bold text-slate-900 dark:text-white">
              {profileData?.full_name || 'Sarah Johnson'}
            </h1>
            <span title="Verified Talent Creator">
              <BadgeCheck className="w-4 h-4 fill-indigo-600 text-white" />
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            @{profileData?.username || 'sarahdance'}
          </p>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
            {profileData?.bio ||
              'Dancer | Choreographer | Dreamer. Turning passion into opportunities ✨'}
          </p>
        </div>

        {/* Talent Category Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          {['Dance', 'Choreography', 'Fitness'].map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-semibold"
            >
              {tag}
            </span>
          ))}
          <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-semibold">
            +2
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4">
          {isOwnProfile ? (
            <>
              <Link
                href="/profile/edit"
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold text-center transition-colors"
              >
                Edit Profile
              </Link>
              <Link
                href="/upload"
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold text-center transition-colors shadow-xs"
              >
                Upload Video
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Talent</span>
              </button>
              <button
                onClick={handleToggleSave}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                  isSaved
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-indigo-600' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </>
          )}
        </div>

        {/* 3-Column Video Thumbnail Grid (Screen 8) */}
        <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-3">
          <div className="grid grid-cols-3 gap-1.5">
            {videos.map((vid) => (
              <Link
                key={vid.id}
                href={`/video/${vid.id}`}
                className="relative aspect-3/4 rounded-lg overflow-hidden bg-slate-800 group"
              >
                <img
                  src={vid.thumbnail_url}
                  alt={vid.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 text-[10px] font-bold text-white drop-shadow-xs">
                  <Play className="w-2.5 h-2.5 fill-white" />
                  <span>{formatNumber(vid.views_count)}</span>
                </div>
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
