'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Search,
  Bell,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Play,
  Pause,
  Plus,
  Volume2,
  VolumeX,
  BadgeCheck,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { VideoPost } from '@/types';

export default function CreatorHomePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likeCountMap, setLikeCountMap] = useState<Record<string, number>>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const cats = DataStore.getCategories();
    setCategories(cats);

    const allVids = DataStore.getVideos();
    setVideos(allVids);

    const initialLikes: Record<string, boolean> = {};
    const initialCounts: Record<string, number> = {};
    allVids.forEach((v) => {
      initialLikes[v.id] = !!v.is_liked;
      initialCounts[v.id] = v.likes_count;
    });
    setLikedMap(initialLikes);
    setLikeCountMap(initialCounts);

    // Sync live from Supabase if configured & tables exist
    DataStore.syncFromSupabase().then(() => {
      const refreshed = DataStore.getVideos();
      setVideos(refreshed);
      setCategories(DataStore.getCategories());
    });
  }, []);

  const filteredVideos =
    selectedCategory === 'All'
      ? videos
      : videos.filter(
          (v) =>
            v.category.toLowerCase() === selectedCategory.toLowerCase() ||
            v.creator.categories?.some((c) => c.toLowerCase() === selectedCategory.toLowerCase())
        );

  const currentVideo = filteredVideos[currentIndex] || filteredVideos[0] || videos[0];
  const nextVideo = filteredVideos[currentIndex + 1] || filteredVideos[0];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [currentIndex, currentVideo]);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
    setShowPlayIcon(true);
    setTimeout(() => setShowPlayIcon(false), 500);
  };

  const handleToggleLike = (e: React.MouseEvent, vidId: string) => {
    e.stopPropagation();
    const result = DataStore.toggleLikeVideo(vidId);
    setLikedMap((prev) => ({ ...prev, [vidId]: result.isLiked }));
    setLikeCountMap((prev) => ({ ...prev, [vidId]: result.likesCount }));
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `SkillBridge - ${currentVideo?.creator.full_name}`,
        text: currentVideo?.caption,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Video link copied to clipboard!');
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <MobileShell hideBottomNav={false}>
      <div className="flex flex-col min-h-full px-4 pt-1 pb-4">
        {/* Top Header - Left Logo + Right Search & Notifications (Matching screenshot) */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
              SkillBridge
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/explore"
              className="p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Search className="w-5 h-5 stroke-[2]" />
            </Link>
            <Link
              href="/notifications"
              className="p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            >
              <Bell className="w-5 h-5 stroke-[2]" />
            </Link>
          </div>
        </div>

        {/* Category Navigation - Horizontally Scrollable Pills (Matching screenshot) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-2">
          {categories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentIndex(0);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Talent Video Card - Clean Video Display with Creator Info, Category and Actions */}
        {currentVideo ? (
          <div className="space-y-3">
            {/* Main Video Card (Screen 1 Main) */}
            <div
              onClick={handleTogglePlay}
              className="relative w-full max-w-xl mx-auto aspect-4/5 sm:max-h-[66vh] rounded-3xl overflow-hidden bg-black shadow-lg cursor-pointer group select-none"
            >
              <video
                ref={videoRef}
                src={currentVideo.video_url}
                poster={currentVideo.thumbnail_url}
                loop
                muted={isMuted}
                playsInline
                autoPlay
                className="w-full h-full object-cover"
              />

              {/* Top Gradient for Duration & Controls */}
              <div className="absolute top-0 left-0 right-0 p-3.5 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-xs pointer-events-auto transition-colors"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                {/* Duration Badge - e.g. 02:15 */}
                <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide">
                  {currentVideo.duration_formatted || '02:15'}
                </span>
              </div>

              {/* Play / Pause Animated Icon Overlay */}
              {showPlayIcon && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white scale-110 transition-transform">
                    {isPlaying ? <Play className="w-8 h-8 fill-white ml-1" /> : <Pause className="w-8 h-8 fill-white" />}
                  </div>
                </div>
              )}

              {/* Right Action Rail (Avatar with +, Like, Comment, Share, Three dots) */}
              <div className="absolute right-3 bottom-14 z-20 flex flex-col items-center gap-3.5 pointer-events-auto">
                {/* Creator Avatar with Follow Plus */}
                <div className="relative mb-0.5">
                  <Link
                    href={`/profile/${currentVideo.creator.username}`}
                    onClick={(e) => e.stopPropagation()}
                    className="block w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-indigo-500 to-pink-500"
                  >
                    <img
                      src={currentVideo.creator.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={currentVideo.creator.full_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </Link>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Plus className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                {/* Heart (Like) */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={(e) => handleToggleLike(e, currentVideo.id)}
                    className="p-1.5 active:scale-125 transition-transform"
                  >
                    <Heart
                      className={`w-6 h-6 drop-shadow-md ${
                        likedMap[currentVideo.id]
                          ? 'fill-rose-500 text-rose-500'
                          : 'fill-white text-white'
                      }`}
                    />
                  </button>
                  <span className="text-[11px] font-bold text-white drop-shadow-md mt-0.5">
                    {formatNumber(likeCountMap[currentVideo.id] || currentVideo.likes_count)}
                  </span>
                </div>

                {/* Comments */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Comments on @${currentVideo.creator.username}'s video`);
                    }}
                    className="p-1.5 active:scale-125 transition-transform"
                  >
                    <MessageCircle className="w-6 h-6 fill-white text-white drop-shadow-md" />
                  </button>
                  <span className="text-[11px] font-bold text-white drop-shadow-md mt-0.5">
                    {formatNumber(currentVideo.comments_count)}
                  </span>
                </div>

                {/* Share */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={handleShare}
                    className="p-1.5 active:scale-125 transition-transform"
                  >
                    <Share2 className="w-6 h-6 text-white drop-shadow-md" />
                  </button>
                  <span className="text-[10px] font-bold text-white drop-shadow-md mt-0.5">
                    Share
                  </span>
                </div>

                {/* Three Dots More Menu */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`More options for video ${currentVideo.id}`);
                  }}
                  className="p-1 text-white hover:text-slate-200"
                >
                  <MoreHorizontal className="w-5 h-5 drop-shadow-md" />
                </button>
              </div>

              {/* Bottom Left Creator, Caption and Category Pill Overlay */}
              <div className="absolute bottom-4 left-4 right-16 z-20 text-white pointer-events-auto space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/profile/${currentVideo.creator.username}`}
                    onClick={(e) => e.stopPropagation()}
                    className="font-bold text-sm tracking-tight hover:underline drop-shadow-md"
                  >
                    @{currentVideo.creator.username}
                  </Link>
                  <BadgeCheck className="w-4 h-4 fill-blue-500 text-white shrink-0 drop-shadow-xs" />
                </div>

                {/* Caption (e.g. Practicing a new song ✨ \n What do you think?) */}
                <p className="text-xs text-white/95 leading-relaxed whitespace-pre-line drop-shadow-md font-medium">
                  {currentVideo.caption}
                </p>

                {/* Solid Purple Category Tag Pill (e.g. Music) */}
                <div className="pt-1">
                  <span className="inline-block px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-xs">
                    {currentVideo.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Peeking Next Video Card (Matching screenshot bottom peek) */}
            {nextVideo && (
              <div
                onClick={() => {
                  setCurrentIndex((prev) => (prev + 1 < filteredVideos.length ? prev + 1 : 0));
                }}
                className="relative w-full max-w-xl mx-auto h-24 rounded-3xl overflow-hidden bg-black shadow-md cursor-pointer group opacity-90 hover:opacity-100 transition-opacity"
              >
                <img
                  src={nextVideo.thumbnail_url}
                  alt={nextVideo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {/* Next Video Duration Badge */}
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold">
                  {nextVideo.duration_formatted || '01:03'}
                </span>
                <div className="absolute bottom-3 left-4 text-white text-xs font-bold flex items-center gap-2">
                  <span>Next Video</span>
                  <span className="text-[10px] text-indigo-300 font-semibold">Tap to play</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400 space-y-2">
            <p className="text-xs">No videos in this category.</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-xs text-indigo-600 font-semibold underline"
            >
              View All
            </button>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
