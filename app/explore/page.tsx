'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Search,
  Menu,
  SlidersHorizontal,
  MoreHorizontal,
  Play,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { VideoPost } from '@/types';

export default function ExplorePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [videos, setVideos] = useState<VideoPost[]>([]);

  useEffect(() => {
    setCategories(DataStore.getCategories());
    setVideos(DataStore.getVideos());

    // Sync live from Supabase if configured & tables exist
    DataStore.syncFromSupabase().then(() => {
      setCategories(DataStore.getCategories());
      setVideos(DataStore.getVideos());
    });
  }, []);

  const filteredVideos = videos.filter((vid) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      vid.category.toLowerCase() === selectedCategory.toLowerCase();

    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      (vid.title && vid.title.toLowerCase().includes(q)) ||
      vid.caption.toLowerCase().includes(q) ||
      vid.category.toLowerCase().includes(q) ||
      vid.creator.username.toLowerCase().includes(q) ||
      vid.creator.full_name.toLowerCase().includes(q);

    return matchesCategory && matchesQuery;
  });

  return (
    <MobileShell hideBottomNav={false}>
      <div className="flex flex-col min-h-full px-4 pt-1 pb-4">
        {/* Top Header - Left Logo + Right Hamburger Menu (Matching screenshot) */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
              SkillBridge
            </span>
          </div>

          <button
            onClick={() => router.push('/settings')}
            className="p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        {/* Search Bar with Search Icon on Left and Sliders/Filter on Right (Matching screenshot) */}
        <div className="relative mt-1 mb-3">
          <div className="flex items-center w-full px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 transition-all focus-within:ring-2 focus-within:ring-indigo-500">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search talent, skills, or creators..."
              className="w-full bg-transparent text-slate-900 dark:text-white text-xs outline-hidden placeholder:text-slate-400"
            />
            <button
              onClick={() => {
                if (searchQuery) setSearchQuery('');
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 ml-1"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Tabs - Horizontally Scrollable Pills (Matching screenshot) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-1">
          {categories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
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

        {/* Video Grid - Clean 2-column layout with thumbnails, title, creator, and duration (Matching screenshot) */}
        <div className="grid grid-cols-2 gap-3.5 pt-1">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="group flex flex-col cursor-pointer"
              onClick={() => router.push(`/video/${video.id}`)}
            >
              {/* Rounded Thumbnail with Duration Badge at Bottom Right */}
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-900 shadow-xs group-hover:shadow-md transition-shadow">
                <img
                  src={video.thumbnail_url}
                  alt={video.title || video.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Duration Badge in Bottom Right (e.g. 00:45, 01:20, 00:38) */}
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold tracking-wide">
                  {video.duration_formatted || '01:00'}
                </span>
              </div>

              {/* Title Below Thumbnail (Bold, crisp text) */}
              <h3 className="font-bold text-xs text-slate-900 dark:text-white leading-tight mt-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {video.title || video.caption}
              </h3>

              {/* Creator Row (Avatar, Handle, and Three Dots Menu) */}
              <div className="flex items-center justify-between mt-1 text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5 min-w-0">
                  <img
                    src={
                      video.creator.avatar_url ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80'
                    }
                    alt={video.creator.username}
                    className="w-4 h-4 rounded-full object-cover shrink-0"
                  />
                  <span className="text-[11px] truncate">
                    @{video.creator.username}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Options for @${video.creator.username}`);
                  }}
                  className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="py-20 text-center text-slate-400 space-y-2">
            <p className="text-xs">No talent videos found matching "{searchQuery}".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-xs text-indigo-600 font-semibold underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
