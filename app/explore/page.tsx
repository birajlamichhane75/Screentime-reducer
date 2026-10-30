'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  BookmarkCheck,
  CheckCircle2,
  X,
  ArrowLeft,
  ChevronRight,
  Play,
  Flame,
  Trophy,
  ChefHat,
  Activity,
  Palette,
  Code2,
  Music,
  Mic2,
  Headphones,
  Zap,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { VideoPost, Profile } from '@/types';

interface CategoryBox {
  id: string;
  name: string;
  icon?: React.ElementType;
  image?: string;
}

const CATEGORY_BOXES: CategoryBox[] = [
  { id: 'Cooking', name: 'Cooking', image: '/creative-icons/cooking.jpg' },
  { id: 'Sports', name: 'Soccer', image: '/creative-icons/soccer.jpg' },
  { id: 'Art', name: 'Drawing', image: '/creative-icons/drawing.jpg' },
  { id: 'Dance', name: 'Dancing', image: '/creative-icons/dancing.jpg' },
  { id: 'Painting', name: 'Painting', image: '/creative-icons/painting.jpg' },
  { id: 'Coding', name: 'Coding', icon: Code2 },
  { id: 'Singing', name: 'Singing', icon: Mic2 },
  { id: 'Music', name: 'Music', icon: Headphones },
];

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategoryParam = searchParams.get('category');

  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategoryParam || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [selectedWorkNotice, setSelectedWorkNotice] = useState<string | null>(null);
  const [selectionState, setSelectionState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const user = DataStore.getCurrentUser();
    setCurrentUser(user);

    const all = DataStore.getVideos();
    setVideos(all);

    const initialMap: Record<string, boolean> = {};
    all.forEach((v) => {
      initialMap[v.id] = DataStore.isWorkSelected(user.id, v.id);
    });
    setSelectionState(initialMap);

    DataStore.syncFromSupabase().then(() => {
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

  // Filter videos for the selected category
  const categoryVideos = videos
    .filter((vid) => {
      if (!selectedCategory) return true;
      const catLower = selectedCategory.toLowerCase();
      const matchesCat =
        vid.category.toLowerCase().includes(catLower) ||
        (catLower === 'dance' && vid.category.toLowerCase().includes('dance')) ||
        (catLower === 'sports' && (vid.category.toLowerCase().includes('sport') || vid.category.toLowerCase().includes('soccer'))) ||
        (catLower === 'art' && (vid.category.toLowerCase().includes('art') || vid.category.toLowerCase().includes('draw'))) ||
        (catLower === 'music' && (vid.category.toLowerCase().includes('music') || vid.category.toLowerCase().includes('piano'))) ||
        (catLower === 'cooking' && (vid.category.toLowerCase().includes('cook') || vid.category.toLowerCase().includes('food'))) ||
        (catLower === 'singing' && (vid.category.toLowerCase().includes('sing') || vid.category.toLowerCase().includes('vocal'))) ||
        (catLower === 'coding' && (vid.category.toLowerCase().includes('code') || vid.category.toLowerCase().includes('tech')));

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        (vid.title && vid.title.toLowerCase().includes(q)) ||
        vid.caption.toLowerCase().includes(q) ||
        vid.creator.username.toLowerCase().includes(q) ||
        vid.creator.full_name.toLowerCase().includes(q);

      return matchesCat && matchesQuery;
    })
    .sort((a, b) => {
      const rA = a.creator?.consistency_rating ?? 2.0;
      const rB = b.creator?.consistency_rating ?? 2.0;
      if (rB !== rA) return rB - rA;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const getCategoryCount = (catId: string) => {
    const catLower = catId.toLowerCase();
    return videos.filter((vid) => {
      return (
        vid.category.toLowerCase().includes(catLower) ||
        (catLower === 'dance' && vid.category.toLowerCase().includes('dance')) ||
        (catLower === 'sports' && (vid.category.toLowerCase().includes('sport') || vid.category.toLowerCase().includes('soccer'))) ||
        (catLower === 'art' && (vid.category.toLowerCase().includes('art') || vid.category.toLowerCase().includes('draw'))) ||
        (catLower === 'music' && (vid.category.toLowerCase().includes('music') || vid.category.toLowerCase().includes('piano'))) ||
        (catLower === 'cooking' && (vid.category.toLowerCase().includes('cook') || vid.category.toLowerCase().includes('food'))) ||
        (catLower === 'singing' && (vid.category.toLowerCase().includes('sing') || vid.category.toLowerCase().includes('vocal'))) ||
        (catLower === 'coding' && (vid.category.toLowerCase().includes('code') || vid.category.toLowerCase().includes('tech')))
      );
    }).length;
  };

  return (
    <MobileShell hideBottomNav={false}>
      <div className="flex flex-col min-h-full px-4 pt-3 pb-8 space-y-4">
        {/* Email Dispatched Toast */}
        {selectedWorkNotice && (
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 flex items-center justify-between animate-in fade-in shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0E0830] dark:text-[#c4bbf0] shrink-0" />
              <span>{selectedWorkNotice}</span>
            </div>
            <button onClick={() => setSelectedWorkNotice(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* VIEW 1: CATEGORY BOXES (When no category is selected) */}
        {!selectedCategory && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                Explore Categories
              </h1>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <div className="flex items-center w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 focus-within:border-[#0E0830] focus-within:bg-white transition-colors">
                <Search className="w-5 h-5 text-slate-400 shrink-0 mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search creators or keywords"
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-hidden font-medium"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Grid of Category Boxes: Big Icon and Just Category Name */}
            <div className="grid grid-cols-2 gap-3.5 pt-1">
              {CATEGORY_BOXES.map((box) => {
                const IconComponent = box.icon;
                const count = getCategoryCount(box.id);

                return (
                  <div
                    key={box.id}
                    onClick={() => setSelectedCategory(box.id)}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/90 dark:border-slate-800 hover:border-[#0E0830] dark:hover:border-white transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex flex-col items-center text-center space-y-2.5 group active:scale-95"
                  >
                    {/* Big Icon */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center p-2.5 overflow-hidden group-hover:scale-105 transition-transform">
                      {box.image ? (
                        <img
                          src={box.image}
                          alt={box.name}
                          className="w-full h-full object-contain mix-blend-multiply dark:invert dark:mix-blend-screen"
                        />
                      ) : (
                        IconComponent && <IconComponent className="w-14 h-14 text-[#0E0830] dark:text-white stroke-[1.8]" />
                      )}
                    </div>

                    {/* Category Name and Number of Videos Uploaded */}
                    <div className="space-y-0.5">
                      <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-[#0E0830] dark:group-hover:text-white tracking-tight">
                        {box.name}
                      </h2>
                      <span className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 block">
                        {count} {count === 1 ? 'Video' : 'Videos'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: SPECIFIC CATEGORY VIDEOS (When category is clicked) */}
        {selectedCategory && (
          <div className="space-y-4">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between pb-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0E0830] dark:text-white text-sm font-bold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All Categories</span>
              </button>

              <span className="text-base font-black text-slate-900 dark:text-white">
                {selectedCategory}
              </span>
            </div>

            {/* Search Input for Category */}
            <div className="relative">
              <div className="flex items-center w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 focus-within:border-[#0E0830] focus-within:bg-white transition-colors">
                <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${selectedCategory}`}
                  className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-hidden font-medium"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Video Grid for Specific Category */}
            {categoryVideos.length > 0 ? (
              <div className="grid grid-cols-2 gap-2.5">
                {categoryVideos.map((video) => {
                  const isSelected = !!selectionState[video.id];

                  return (
                    <div
                      key={video.id}
                      onClick={() => router.push(`/video/${video.id}`)}
                      className="group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col"
                    >
                      {/* Video Thumbnail Box */}
                      <div className="relative aspect-4/5 w-full bg-slate-900 overflow-hidden">
                        <img
                          src={video.thumbnail_url}
                          alt={video.title || video.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Top Overlay: Category Badge */}
                        <div className="absolute top-2 left-2 flex items-center px-2 py-1 rounded-md bg-black/60 text-white text-xs font-bold backdrop-blur-xs">
                          <span>{video.category}</span>
                        </div>

                        {/* Organization Select Work Button */}
                        {isOrg && (
                          <button
                            onClick={(e) => handleSelectWork(e, video)}
                            className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-md transition-all shadow-xs ${
                              isSelected
                                ? 'bg-[#0E0830] text-white'
                                : 'bg-black/40 text-white hover:bg-black/60'
                            }`}
                            title="Select Work"
                          >
                            <BookmarkCheck className={`w-4 h-4 ${isSelected ? 'fill-white' : ''}`} />
                          </button>
                        )}

                        {/* Play Indicator */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                          <div className="w-9 h-9 rounded-full bg-white/95 text-[#0E0830] flex items-center justify-center shadow-md">
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </div>
                        </div>

                        {/* Bottom Overlay: Creator Name */}
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-xs">
                          <span className="font-bold drop-shadow-xs truncate">
                            {video.creator.full_name}
                          </span>
                        </div>
                      </div>

                      {/* Video Caption & Info */}
                      <div className="p-2.5">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug">
                          {video.title || video.caption}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  No videos found in {selectedCategory}
                </p>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="px-3 py-1.5 rounded-lg bg-[#0E0830] text-white text-xs font-medium"
                >
                  View All Categories
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </MobileShell>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh] text-xs text-slate-400">
          Loading categories...
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
