'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Upload,
  Compass,
  ArrowRight,
  Play,
  BookmarkCheck,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { VideoStorage } from '@/lib/videoStorage';
import { VideoPost, Profile } from '@/types';

// The creative activities using the user's uploaded icons
const CREATIVE_ACTIVITIES = [
  {
    id: 'cooking',
    title: 'Cooking',
    subtitle: 'Culinary routines & kitchen creations',
    image: '/creative-icons/cooking.jpg',
  },
  {
    id: 'soccer',
    title: 'Playing Soccer',
    subtitle: 'Athletic drills, juggles & field skills',
    image: '/creative-icons/soccer.jpg',
  },
  {
    id: 'drawing',
    title: 'Drawing',
    subtitle: 'Sketches, canvas art & illustration',
    image: '/creative-icons/drawing.jpg',
  },
  {
    id: 'dancing',
    title: 'Dancing',
    subtitle: 'Choreography, balance & rhythm routines',
    image: '/creative-icons/dancing.jpg',
  },
  {
    id: 'painting',
    title: 'Painting & Art',
    subtitle: 'Studio painting, brushwork & craft routines',
    image: '/creative-icons/painting.jpg',
  },
];

export default function CreatorHomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentVideos, setRecentVideos] = useState<VideoPost[]>([]);
  const [playableUrls, setPlayableUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const user = DataStore.getCurrentUser();
    setCurrentUser(user);

    const loadVideos = async () => {
      // First load local videos
      const all = DataStore.getVideos();
      setRecentVideos(all);

      // Resolve playable URLs (IndexedDB or remote)
      const urlMap: Record<string, string> = {};
      for (const v of all.slice(0, 10)) {
        urlMap[v.id] = await VideoStorage.resolvePlayableUrl(v.id, v.video_url);
      }
      setPlayableUrls(urlMap);

      // Sync from Supabase in background
      await DataStore.syncFromSupabase();
      const updated = DataStore.getVideos();
      setRecentVideos(updated);
      for (const v of updated.slice(0, 10)) {
        if (!urlMap[v.id]) {
          urlMap[v.id] = await VideoStorage.resolvePlayableUrl(v.id, v.video_url);
        }
      }
      setPlayableUrls({ ...urlMap });
    };

    loadVideos();
  }, []);

  // Cycle through creative activities every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CREATIVE_ACTIVITIES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentActivity = CREATIVE_ACTIVITIES[activeIndex];

  // Navigate directly to the upload form (DO NOT open computer drive here)
  const handleGoToUpload = () => {
    router.push('/upload');
  };

  return (
    <MobileShell hideBottomNav={false}>
      <div className="flex flex-col min-h-full px-4 pt-3 pb-8 space-y-6">
        {/* Top Header: Simple & Relaxed */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <span className="font-black text-base tracking-tight text-slate-900 dark:text-white">
              SkillBridge
            </span>
          </div>
          <span className="text-xs font-bold text-slate-400">Creator Studio</span>
        </div>

        {/* BIG UPLOAD BOX (Clicking navigates to upload form) */}
        <div
          onClick={handleGoToUpload}
          className="relative w-full aspect-[4/5] sm:aspect-square max-h-[480px] rounded-3xl border-2 border-dashed border-[#0E0830]/30 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-[#0E0830] dark:hover:border-white transition-all duration-300 cursor-pointer shadow-xs p-6 flex flex-col items-center justify-between text-center select-none group active:scale-[0.99]"
        >
          {/* Subtle Record Dot Header */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#0E0830] dark:bg-white animate-pulse" />
            <span>Daily Practice Record</span>
          </div>

          {/* Animated Big Icon Area (User's uploaded icons changing every 3 seconds with gentle movement animation) */}
          <div className="my-auto flex flex-col items-center justify-center space-y-3">
            <div className="w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center overflow-hidden">
              <img
                src={currentActivity.image}
                alt={currentActivity.title}
                className="w-full h-full object-contain mix-blend-multiply dark:invert dark:mix-blend-screen transition-all duration-300 transform animate-gentle-float group-hover:scale-105"
              />
            </div>

            <div className="space-y-0.5 transition-opacity duration-300">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {currentActivity.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {currentActivity.subtitle}
              </p>
            </div>
          </div>

          {/* Action Prompt -> Navigates to Upload Video Form */}
          <div className="w-full pt-2">
            <button
              type="button"
              onClick={handleGoToUpload}
              className="w-full py-4 rounded-2xl bg-[#0E0830] hover:bg-[#1a1147] text-white text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-lg active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Video</span>
            </button>
          </div>

          {/* 3-Second Activity Progress Dots */}
          <div className="flex items-center gap-1.5 pt-1">
            {CREATIVE_ACTIVITIES.map((act, i) => (
              <span
                key={act.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? 'w-6 bg-[#0E0830] dark:bg-white'
                    : 'w-1.5 bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Explore Categories Prompt Box */}
        <Link
          href="/explore"
          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-[#0E0830] dark:hover:border-slate-600 transition-all flex items-center justify-between group shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#0E0830] dark:text-white">
              <Compass className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Explore Categories
              </h3>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0E0830] group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>

        {/* RECENT UPLOADS FEED: SEE THE VIDEOS YOU JUST UPLOADED AND PLAY THEM */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Recent Practice Videos
            </h2>
            <Link
              href="/explore"
              className="text-xs font-bold text-[#0E0830] dark:text-indigo-400 hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {recentVideos.slice(0, 6).map((video) => {
              const url = playableUrls[video.id] || video.video_url;

              return (
                <div
                  key={video.id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs space-y-3 p-4"
                >
                  {/* Creator Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={video.creator?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                        alt={video.creator?.full_name || 'Creator'}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          {video.creator?.full_name || 'Creator'}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400 block">
                          {video.category}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/video/${video.id}`}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300"
                    >
                      Watch
                    </Link>
                  </div>

                  {/* Playable Video Player */}
                  <div className="relative aspect-16/10 w-full rounded-2xl bg-black overflow-hidden shadow-inner">
                    <video
                      src={url}
                      poster={video.thumbnail_url}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Caption */}
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                    {video.caption || video.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
