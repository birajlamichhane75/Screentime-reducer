'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, BookmarkCheck, CheckCircle2 } from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { VideoPost, Profile } from '@/types';

export default function OrganizationDiscoverPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [videos, setVideos] = useState<VideoPost[]>([]);

  useEffect(() => {
    setCurrentUser(DataStore.getCurrentUser());
    setCategories(DataStore.getCategories());
    setVideos(DataStore.getVideos());
  }, []);

  const filteredVideos = videos.filter((vid) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      vid.category.toLowerCase() === selectedCategory.toLowerCase();

    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      vid.caption.toLowerCase().includes(q) ||
      vid.category.toLowerCase().includes(q) ||
      vid.creator.username.toLowerCase().includes(q) ||
      vid.creator.full_name.toLowerCase().includes(q);

    return matchesCategory && matchesQuery;
  });

  return (
    <MobileShell>
      <div className="flex flex-col min-h-full px-4 pt-3 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-sm font-semibold text-slate-900 dark:text-white">
            Discover Talent Works
          </h1>
          <span className="text-[11px] text-slate-400">
            {filteredVideos.length} available
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search singers, dancers, developers, athletes..."
            className="w-full px-3 py-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white text-xs pl-8 focus:border-[#0E0830] outline-hidden transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        {/* Categories */}
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
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredVideos.map((video) => (
            <Link
              key={video.id}
              href={`/video/${video.id}`}
              className="group flex flex-col rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="relative aspect-3/4 w-full bg-slate-950 overflow-hidden">
                <img
                  src={video.thumbnail_url}
                  alt={video.caption}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-mono">
                  {video.duration_formatted || '01:00'}
                </span>
                {video.is_selected_by_org && (
                  <span className="absolute top-1.5 right-1.5 p-1 rounded bg-[#0E0830] text-white">
                    <BookmarkCheck className="w-3 h-3" />
                  </span>
                )}
              </div>

              <div className="p-2 space-y-1">
                <p className="text-xs font-medium text-slate-900 dark:text-white line-clamp-1">
                  @{video.creator.username}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {video.caption}
                </p>
                <span className="inline-block text-[9px] font-medium text-[#0E0830] dark:text-[#c4bbf0]">
                  {video.category}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}
