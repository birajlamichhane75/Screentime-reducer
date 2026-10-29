'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  Bell,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Plus,
  BadgeCheck,
  Menu,
  SlidersHorizontal,
  CheckCircle2,
  ArrowRight,
  Info,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';

export default function ShowcasePage() {
  const [activeScreen, setActiveScreen] = useState<'feed' | 'explore'>('feed');
  const [activeFeedCategory, setActiveFeedCategory] = useState('All');
  const [activeExploreCategory, setActiveExploreCategory] = useState('All');

  const exploreVideos = [
    {
      id: '1',
      title: 'Contemporary Dance Routine',
      creator: 'emmadance',
      duration: '00:45',
      thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80',
    },
    {
      id: '2',
      title: 'Realistic Portrait Drawing',
      creator: 'artbylucas',
      duration: '01:20',
      thumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&auto=format&fit=crop&q=80',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80',
    },
    {
      id: '3',
      title: 'Football Skills Training',
      creator: 'mikesoccer',
      duration: '00:38',
      thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&auto=format&fit=crop&q=80',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80',
    },
    {
      id: '4',
      title: 'Cover Song - Someone Like You',
      creator: 'emmamusic',
      duration: '01:12',
      thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
    },
    {
      id: '5',
      title: 'Building a React Project',
      creator: 'alexdev',
      duration: '02:10',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=80',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=60&auto=format&fit=crop&q=80',
    },
    {
      id: '6',
      title: 'Sunset Photography Tips',
      creator: 'jamesphoto',
      duration: '00:55',
      thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <MobileShell hideBottomNav={false}>
      <div className="flex flex-col min-h-full px-4 pt-2 pb-6">
        {/* Screen Switcher Tabs (No fake frames, responsive 60% container) */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 mb-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full">
            <button
              onClick={() => setActiveScreen('feed')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all text-center ${
                activeScreen === 'feed'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              1. Creator Home (Feed)
            </button>
            <button
              onClick={() => setActiveScreen('explore')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all text-center ${
                activeScreen === 'explore'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              2. Explore Page (Grid)
            </button>
          </div>
        </div>

        {/* Feature Context Banner */}
        <div className="mb-3 p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-950 dark:text-indigo-200">
            <span className="font-bold">
              {activeScreen === 'feed' ? 'Creator Home (Discover Talent Feed)' : 'Explore Page (Search & Browse)'}
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
              {activeScreen === 'feed'
                ? 'Full responsive video feed with horizontally scrollable categories, verified creator details, solid category pill, and right action rail.'
                : 'Clean 2-column browse grid with duration badges, creator handles, search bar, and filter controls.'}
            </p>
          </div>
        </div>

        {/* SCREEN 1: CREATOR HOME (FEED VIEW) */}
        {activeScreen === 'feed' && (
          <div className="space-y-3">
            {/* Top Header */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  SkillBridge
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Link href="/explore" className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <Search className="w-5 h-5 stroke-[2]" />
                </Link>
                <Link href="/notifications" className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <Bell className="w-5 h-5 stroke-[2]" />
                </Link>
              </div>
            </div>

            {/* Category Navigation */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {['All', 'Music', 'Dance', 'Drawing', 'Sports', 'Coding'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFeedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeFeedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Main Video Card (Screen 1) */}
            <div className="relative w-full max-w-xl mx-auto aspect-4/5 sm:max-h-[66vh] rounded-3xl overflow-hidden bg-black shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&auto=format&fit=crop&q=80"
                alt="Guitar Player"
                className="w-full h-full object-cover"
              />

              {/* Duration Badge */}
              <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-md bg-black/60 text-white text-[11px] font-semibold backdrop-blur-md">
                02:15
              </div>

              {/* Right Action Rail */}
              <div className="absolute right-3.5 bottom-12 flex flex-col items-center gap-3.5 text-white z-20">
                {/* Creator Avatar with + */}
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Sarah Music"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500"
                  />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                    +
                  </div>
                </div>

                {/* Like */}
                <div className="flex flex-col items-center">
                  <Heart className="w-6 h-6 fill-white text-white drop-shadow-md" />
                  <span className="text-[11px] font-bold mt-0.5">2.4K</span>
                </div>

                {/* Comment */}
                <div className="flex flex-col items-center">
                  <MessageCircle className="w-6 h-6 fill-white text-white drop-shadow-md" />
                  <span className="text-[11px] font-bold mt-0.5">186</span>
                </div>

                {/* Share */}
                <div className="flex flex-col items-center">
                  <Share2 className="w-6 h-6 text-white drop-shadow-md" />
                  <span className="text-[10px] font-bold mt-0.5">Share</span>
                </div>

                {/* More */}
                <MoreHorizontal className="w-5 h-5 text-white drop-shadow-md" />
              </div>

              {/* Bottom Left Info */}
              <div className="absolute bottom-4 left-4 right-16 text-white space-y-1.5 z-20">
                <div className="flex items-center gap-1.5 font-bold text-sm">
                  <span>@sarahmusic</span>
                  <BadgeCheck className="w-4 h-4 fill-blue-500 text-white shrink-0" />
                </div>
                <p className="text-xs text-white/95 leading-relaxed whitespace-pre-line font-medium drop-shadow-md">
                  Practicing a new song ✨{'\n'}
                  What do you think?
                </p>
                <div className="pt-1">
                  <span className="inline-block px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold shadow-xs">
                    Music
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Peeking Card */}
            <div className="relative w-full max-w-xl mx-auto h-24 rounded-3xl overflow-hidden bg-black shadow-md opacity-95">
              <img
                src="https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=800&auto=format&fit=crop&q=80"
                alt="Skateboarder"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-semibold backdrop-blur-md">
                01:03
              </span>
              <div className="absolute bottom-3 left-4 text-white text-xs font-bold flex items-center gap-2">
                <span>Next Video</span>
                <span className="text-[10px] text-indigo-300 font-semibold">Tap to play</span>
              </div>
            </div>

            <div className="pt-2 text-center">
              <Link
                href="/feed"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Open Full Interactive Creator Feed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* SCREEN 2: EXPLORE PAGE (GRID VIEW) */}
        {activeScreen === 'explore' && (
          <div className="space-y-3">
            {/* Top Header */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  SkillBridge
                </span>
              </div>

              <button className="p-2 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Menu className="w-5 h-5 stroke-[2]" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <div className="flex items-center w-full px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700">
                <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                <span className="truncate">Search talent, skills, or creators...</span>
                <SlidersHorizontal className="w-4 h-4 text-slate-400 ml-auto shrink-0" />
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {['All', 'Music', 'Dance', 'Drawing', 'Sports', 'Coding'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveExploreCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeExploreCategory === cat
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 2-Column Video Grid */}
            <div className="grid grid-cols-2 gap-3.5 pt-1">
              {exploreVideos.map((item) => (
                <Link
                  key={item.id}
                  href={`/explore`}
                  className="group flex flex-col"
                >
                  {/* Thumbnail with duration */}
                  <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 shadow-xs group-hover:shadow-md transition-shadow">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-semibold tracking-wide backdrop-blur-md">
                      {item.duration}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white mt-2 line-clamp-1 leading-tight group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>

                  {/* Creator */}
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mt-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <img
                        src={item.avatar}
                        alt={item.creator}
                        className="w-4 h-4 rounded-full object-cover shrink-0"
                      />
                      <span className="text-[11px] truncate">@{item.creator}</span>
                    </div>
                    <MoreHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="pt-2 text-center">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Open Full Interactive Explore Grid</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
