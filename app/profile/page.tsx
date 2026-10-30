'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Settings,
  Mail,
  Upload,
  Play,
  BookmarkCheck,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { Profile, VideoPost } from '@/types';

export default function MobileProfilePage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [selectedWorksCount, setSelectedWorksCount] = useState<number>(0);

  useEffect(() => {
    const user = DataStore.getCurrentUser();
    setProfileData(user);

    const userVideos = DataStore.getVideosByCreator(user.id);
    setVideos(userVideos.length > 0 ? userVideos : DataStore.getVideos().slice(0, 3));

    const allSelected = DataStore.getSelectedWorks();
    const count = allSelected.filter(
      (s) => s.creator_id === user.id || s.creator_email === user.email
    ).length;
    setSelectedWorksCount(count);
  }, []);

  const accountEmail =
    profileData?.email || `${profileData?.username || 'user'}@skillbridge.dev`;

  return (
    <MobileShell hideBottomNav={false}>
      <div className="flex flex-col min-h-full px-5 pt-4 pb-8 space-y-6">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => router.back()}
            className="p-1 -ml-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-base font-bold text-slate-900 dark:text-white">
            @{profileData?.username || 'creator'}
          </span>
          <Link
            href="/settings"
            className="p-1 -mr-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            title="Settings & Account"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>

        {/* User Info Section: Clean, Centered & Legible */}
        <div className="flex flex-col items-center text-center space-y-3">
          <img
            src={
              profileData?.avatar_url ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
            }
            alt={profileData?.full_name || 'Creator'}
            className="w-24 h-24 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
          />

          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {profileData?.full_name || 'Sarah Johnson'}
            </h1>
            <p className="text-base text-slate-500 dark:text-slate-400">
              @{profileData?.username || 'sarahdance'}
            </p>
          </div>

          <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-md">
            {profileData?.bio ||
              'Creative talent practicing daily routines and connecting directly with scouting organizations.'}
          </p>

          {/* Verified Account Email Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Mail className="w-4 h-4 text-[#0E0830] dark:text-[#c4bbf0]" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {accountEmail}
            </span>
          </div>
        </div>

        {/* 2 Clean Metrics Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-xs">
            <span className="text-2xl font-black text-slate-900 dark:text-white block">
              {videos.length}
            </span>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 block">
              Works Shared
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-xs">
            <span className="text-2xl font-black text-[#0E0830] dark:text-[#c4bbf0] block">
              {selectedWorksCount || 2}
            </span>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 block">
              Org Selections
            </span>
          </div>
        </div>

        {/* Clean Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/profile/edit"
            className="py-3 px-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white text-base font-bold text-center transition-colors"
          >
            Edit Profile
          </Link>
          <Link
            href="/upload"
            className="py-3 px-4 rounded-2xl bg-[#0E0830] hover:bg-[#1a1147] text-white text-base font-bold text-center transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Work</span>
          </Link>
        </div>

        {/* Portfolio Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Shared Practice
            </h2>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {videos.length} Videos
            </span>
          </div>

          {/* 3-Column Video Thumbnail Grid */}
          <div className="grid grid-cols-3 gap-2">
            {videos.map((vid) => (
              <Link
                key={vid.id}
                href={`/video/${vid.id}`}
                className="relative aspect-3/4 rounded-xl overflow-hidden bg-slate-900 group shadow-xs"
              >
                <img
                  src={vid.thumbnail_url}
                  alt={vid.title || 'Work'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 text-white text-sm font-mono leading-none">
                  {vid.duration_formatted || '01:00'}
                </span>

                {/* Organization Selection Indicator */}
                {vid.is_selected_by_org && (
                  <span
                    className="absolute bottom-1.5 left-1.5 p-1 rounded-md bg-[#0E0830] text-white"
                    title="Selected by organization"
                  >
                    <BookmarkCheck className="w-3.5 h-3.5" />
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
