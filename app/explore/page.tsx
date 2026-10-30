'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  BookmarkCheck,
  CheckCircle2,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { VideoPost, Profile } from '@/types';

export default function ExplorePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [selectedWorkNotice, setSelectedWorkNotice] = useState<string | null>(null);
  const [selectionState, setSelectionState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const user = DataStore.getCurrentUser();
    setCurrentUser(user);

    setCategories(DataStore.getCategories());
    const all = DataStore.getVideos();
    setVideos(all);

    const initialMap: Record<string, boolean> = {};
    all.forEach((v) => {
      initialMap[v.id] = DataStore.isWorkSelected(user.id, v.id);
    });
    setSelectionState(initialMap);

    DataStore.syncFromSupabase().then(() => {
      setCategories(DataStore.getCategories());
      setVideos(DataStore.getVideos());
    });
  }, []);

  const isOrg = currentUser?.role === 'organization';

  const handleSelectWork = (e: React.MouseEvent, vid: VideoPost) => {
    e.stopPropagation();
    if (!currentUser) return;

    if (!isOrg) {
      alert('Only organizations can select work for scouting and opportunities.');
      return;
    }

    const result = DataStore.selectWork({
      orgId: currentUser.id,
      orgName: currentUser.full_name || 'Creative Arts University',
      videoId: vid.id,
    });

    setSelectionState((prev) => ({
      ...prev,
      [vid.id]: result.selected,
    }));

    if (result.selected && result.emailSent) {
      setSelectedWorkNotice(
        `Work selected! Notification email sent to ${result.emailSent.recipient_email}`
      );
      setTimeout(() => setSelectedWorkNotice(null), 4000);
    }
  };

  const filteredVideos = videos
    .filter((vid) => {
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
    })
    .sort((a, b) => {
      const rA = a.creator?.consistency_rating ?? 2.0;
      const rB = b.creator?.consistency_rating ?? 2.0;
      if (rB !== rA) return rB - rA;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <MobileShell hideBottomNav={false}>
      <div className="flex flex-col min-h-full px-4 pt-3 pb-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2">
          <h1 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
            Explore Directory
          </h1>
          <span className="text-[11px] text-slate-400">
            {filteredVideos.length} projects
          </span>
        </div>

        {/* Email Dispatched Toast */}
        {selectedWorkNotice && (
          <div className="mb-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 flex items-center justify-between animate-in fade-in shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0E0830] dark:text-[#c4bbf0] shrink-0" />
              <span>{selectedWorkNotice}</span>
            </div>
            <button onClick={() => setSelectedWorkNotice(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Search Bar - Clean Big-Tech Style */}
        <div className="relative mb-3">
          <div className="flex items-center w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 focus-within:border-[#0E0830] focus-within:bg-white transition-colors">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search talent, skills, or creator handles..."
              className="w-full bg-transparent text-slate-900 dark:text-white text-xs outline-hidden placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-1">
          {categories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#0E0830] text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 2-Column Clean Video Grid (NO vanity likes) */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="group flex flex-col rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              onClick={() => router.push(`/video/${video.id}`)}
            >
              {/* Thumbnail */}
              <div className="relative aspect-4/3 w-full bg-slate-950 overflow-hidden">
                <img
                  src={video.thumbnail_url}
                  alt={video.title || video.caption}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-mono">
                  {video.duration_formatted || '01:00'}
                </span>

                {/* Floating Rating Badge */}
                {video.creator.consistency_rating && (
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold flex items-center gap-0.5 shadow-xs">
                    {video.creator.consistency_rating >= 95 ? '💎' : video.creator.consistency_rating >= 80 ? '🥇' : '🥈'}
                    <span>{video.creator.consistency_rating}</span>
                  </span>
                )}

                {/* Organization Select Button overlay */}
                {isOrg && (
                  <button
                    onClick={(e) => handleSelectWork(e, video)}
                    className={`absolute top-1.5 right-1.5 p-1 rounded-md backdrop-blur-md transition-colors ${
                      selectionState[video.id]
                        ? 'bg-[#0E0830] text-white shadow-xs'
                        : 'bg-black/50 text-white hover:bg-black/70'
                    }`}
                    title={selectionState[video.id] ? 'Work Selected' : 'Select Work'}
                  >
                    <BookmarkCheck className={`w-3.5 h-3.5 ${selectionState[video.id] ? 'fill-white' : ''}`} />
                  </button>
                )}
              </div>

              {/* Information */}
              <div className="p-2.5 space-y-1">
                <h2 className="font-medium text-xs text-slate-900 dark:text-white line-clamp-1">
                  {video.title || video.caption}
                </h2>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate">@{video.creator.username}</span>
                  <span className="text-[#0E0830] dark:text-[#c4bbf0] shrink-0 font-medium">
                    {video.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}
