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

export default function CreatorHomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
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
              ShowUp!
            </span>
          </div>
          <span className="text-xs font-bold text-slate-400">Creator Studio</span>
        </div>

        {/* BIG UPLOAD BOX (3D Floating Tactile Card) */}
        <div
          onClick={handleGoToUpload}
          className="card-3d card-3d-interactive relative w-full aspect-[4/5] sm:aspect-square max-h-[490px] rounded-3xl p-6 flex flex-col items-center justify-between text-center select-none cursor-pointer group"
        >
          {/* Animated Big 3D Icon Area (ShowUp! 3D Hero Art) */}
          <div className="my-auto flex flex-col items-center justify-center space-y-4 pt-4">
            <div className="w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-purple-500/5 to-amber-500/5 dark:from-purple-500/10 dark:to-amber-500/10 p-3 border border-purple-200/40 dark:border-purple-900/30 shadow-[0_12px_32px_rgba(14,8,48,0.06)] group-hover:scale-105 transition-all duration-300">
              <img
                src="/showup-hero.jpg"
                alt="ShowUp!"
                className="w-full h-full object-contain animate-gentle-float"
              />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Show Up &amp; Record
              </h2>
            </div>
          </div>

          {/* Action Prompt -> Navigates to Upload Video Form */}
          <div className="w-full pt-2">
            <button
              type="button"
              onClick={handleGoToUpload}
              className="btn-3d w-full py-4 rounded-2xl text-white text-sm font-extrabold flex items-center justify-center gap-2 group-hover:shadow-lg active:scale-95 transition-all tracking-wide"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Video</span>
            </button>
          </div>
        </div>

        {/* Explore Categories Prompt Box */}
        <Link
          href="/explore"
          className="card-3d card-3d-interactive p-4 rounded-2xl flex items-center justify-between group shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0E0830] to-indigo-800 text-white flex items-center justify-center shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Explore Categories
              </h3>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0E0830] dark:group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
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
                  className="card-3d rounded-3xl overflow-hidden space-y-3 p-4 shadow-sm"
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
                      poster={video.thumbnail_url?.startsWith('data:') ? video.thumbnail_url : undefined}
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
