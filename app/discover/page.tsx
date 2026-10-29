'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Menu, Play, Sparkles, Filter } from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { VideoPost } from '@/types';

export default function OrganizationDiscoverPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [videos, setVideos] = useState<VideoPost[]>([]);

  useEffect(() => {
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

  const formatViews = (views: number) => {
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views.toString();
  };

  return (
    <MobileShell>
      <div className="flex flex-col min-h-full px-4 pt-3 pb-6">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3">
          <button className="p-1.5 -ml-1.5 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Discover Talent</span>
          </h1>
          <button className="p-1.5 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search singers, artists, athletes..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs pl-9 focus:ring-2 focus:ring-indigo-500 outline-hidden"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        {/* Horizontally Scrollable Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-1">
          {categories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 2-Column Talent Video Grid (Screen 10) */}
        <div className="grid grid-cols-2 gap-3">
          {filteredVideos.map((video) => (
            <Link
              key={video.id}
              href={`/video/${video.id}`}
              className="group flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-3/4 w-full bg-slate-800 overflow-hidden">
                <img
                  src={video.thumbnail_url}
                  alt={video.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* View Count */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[11px] font-bold text-white drop-shadow-md">
                  <Play className="w-3 h-3 fill-white" />
                  <span>{formatViews(video.views_count)}</span>
                </div>
              </div>

              {/* Creator details */}
              <div className="p-2.5 space-y-1">
                <p className="text-[11px] font-bold text-slate-900 dark:text-white line-clamp-1">
                  @{video.creator.username}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {video.caption}
                </p>
                <div className="pt-0.5">
                  <span className="inline-block text-[9px] font-semibold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                    {video.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <p className="text-xs">No talent videos found matching "{searchQuery}".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
