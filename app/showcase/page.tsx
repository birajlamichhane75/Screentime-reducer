'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Bell,
  Share2,
  BadgeCheck,
  CheckCircle2,
  ArrowRight,
  Info,
  BookmarkCheck,
  Mail,
  Building2,
  GraduationCap,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';

export default function ShowcasePage() {
  const [activeScreen, setActiveScreen] = useState<'feed' | 'explore'>('feed');
  const [activeFeedCategory, setActiveFeedCategory] = useState('All');
  const [isSelected, setIsSelected] = useState(true);
  const [showEmailToast, setShowEmailToast] = useState(false);

  const exploreVideos = [
    {
      id: '1',
      title: 'Contemporary Dance Routine',
      creator: 'emmadance',
      duration: '00:45',
      thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80',
      category: 'Dance',
    },
    {
      id: '2',
      title: 'Realistic Portrait Drawing',
      creator: 'artbylucas',
      duration: '01:20',
      thumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&auto=format&fit=crop&q=80',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80',
      category: 'Drawing',
    },
    {
      id: '3',
      title: 'Football Skills Training',
      creator: 'mikesoccer',
      duration: '00:38',
      thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&auto=format&fit=crop&q=80',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80',
      category: 'Sports',
    },
    {
      id: '4',
      title: 'Cover Song - Someone Like You',
      creator: 'emmamusic',
      duration: '01:12',
      thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
      category: 'Music',
    },
    {
      id: '5',
      title: 'Building a React Project',
      creator: 'alexdev',
      duration: '02:10',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=80',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=60&auto=format&fit=crop&q=80',
      category: 'Coding',
    },
    {
      id: '6',
      title: 'Sunset Photography Tips',
      creator: 'jamesphoto',
      duration: '00:55',
      thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&auto=format&fit=crop&q=80',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=60&auto=format&fit=crop&q=80',
      category: 'Photography',
    },
  ];

  return (
    <MobileShell hideBottomNav={false}>
      <div className="flex flex-col min-h-full px-4 pt-3 pb-6">
        {/* Screen Switcher Tabs */}
        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800 mb-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-full">
            <button
              onClick={() => setActiveScreen('feed')}
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-colors text-center ${
                activeScreen === 'feed'
                  ? 'bg-white dark:bg-slate-900 text-[#0E0830] dark:text-[#c4bbf0] shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              1. Focused Work Feed
            </button>
            <button
              onClick={() => setActiveScreen('explore')}
              className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-colors text-center ${
                activeScreen === 'explore'
                  ? 'bg-white dark:bg-slate-900 text-[#0E0830] dark:text-[#c4bbf0] shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              2. Explore Directory
            </button>
          </div>
        </div>

        {/* Feature Context Banner */}
        <div className="mb-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#0E0830] dark:text-[#c4bbf0] shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-white">
              Clean, Relaxing Big-Tech UI
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Public likes, follower counters, and comments have been removed. Organizations have the exclusive ability to Select Work, which immediately sends an email to the creator&apos;s account email.
            </p>
          </div>
        </div>

        {/* SCREEN 1: CREATOR WORK FEED */}
        {activeScreen === 'feed' && (
          <div className="space-y-3">
            {/* Top Bar */}
            <div className="flex items-center justify-between py-1">
              <span className="font-semibold text-sm text-slate-900 dark:text-white">
                Talent Showcase
              </span>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <Link href="/explore" className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
                  <Search className="w-4 h-4" />
                </Link>
                <Link href="/notifications" className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
                  <Bell className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Category Navigation - Clean White & Brand */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {['All', 'Music', 'Dance', 'Drawing', 'Sports', 'Coding'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFeedCategory(cat)}
                  className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                    activeFeedCategory === cat
                      ? 'bg-[#0E0830] text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Simulated Email Sent Toast */}
            {showEmailToast && (
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    Email delivered to <strong>sarah@dance.skillbridge.dev</strong>
                  </span>
                </div>
                <button
                  onClick={() => setShowEmailToast(false)}
                  className="text-slate-400 hover:text-slate-600 text-[10px] font-semibold"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Main Video Card (NO likes, comments, followers) */}
            <div className="relative w-full max-w-xl mx-auto aspect-4/5 sm:max-h-[64vh] rounded-2xl overflow-hidden bg-slate-950 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&auto=format&fit=crop&q=80"
                alt="Guitar Player"
                className="w-full h-full object-cover"
              />

              {/* Duration Badge */}
              <div className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-md bg-black/50 text-white text-[10px] font-medium backdrop-blur-xs">
                02:15
              </div>

              {/* Right Action Rail (For Organization: Select Work, Contact, Share) */}
              <div className="absolute right-3.5 bottom-12 flex flex-col items-center gap-3 text-white z-20">
                {/* Organization Select Work Button */}
                <button
                  onClick={() => {
                    setIsSelected(!isSelected);
                    if (!isSelected) setShowEmailToast(true);
                  }}
                  className={`p-2.5 rounded-xl backdrop-blur-md flex flex-col items-center transition-colors ${
                    isSelected ? 'bg-[#0E0830] text-white shadow-md ring-2 ring-white/30' : 'bg-black/50 text-white'
                  }`}
                  title="Organization: Select Work"
                >
                  <BookmarkCheck className={`w-5 h-5 ${isSelected ? 'fill-white text-white' : ''}`} />
                  <span className="text-[9px] font-semibold mt-0.5">
                    {isSelected ? 'Selected' : 'Select'}
                  </span>
                </button>

                {/* Contact Button */}
                <button
                  onClick={() => alert('Contact modal opens: invites talent to opportunity.')}
                  className="p-2.5 rounded-xl bg-black/50 text-white backdrop-blur-md flex flex-col items-center"
                >
                  <Mail className="w-5 h-5" />
                  <span className="text-[9px] font-semibold mt-0.5">Contact</span>
                </button>

                {/* Share Button */}
                <button
                  onClick={() => alert('Work link copied.')}
                  className="p-2.5 rounded-xl bg-black/50 text-white backdrop-blur-md flex flex-col items-center"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="text-[9px] font-semibold mt-0.5">Share</span>
                </button>
              </div>

              {/* Bottom Left Info */}
              <div className="absolute bottom-4 left-4 right-16 text-white space-y-1 z-20">
                <div className="flex items-center gap-1.5 font-semibold text-xs">
                  <span>@sarahmusic</span>
                  <BadgeCheck className="w-3.5 h-3.5 text-[#c4bbf0] shrink-0" />
                  <span className="text-white/60 text-[10px]">· Music</span>
                </div>
                <p className="text-xs text-white/95 leading-relaxed font-normal">
                  Practicing a new acoustic song and vocal melody ✨
                </p>
                {isSelected && (
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0E0830] border border-white/20 text-[10px] text-white">
                      <BookmarkCheck className="w-3 h-3 text-[#c4bbf0]" />
                      <span>Shortlisted by Organization</span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 text-center">
              <Link
                href="/feed"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0E0830] dark:text-[#c4bbf0] hover:underline"
              >
                <span>Launch Interactive Feed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* SCREEN 2: EXPLORE DIRECTORY */}
        {activeScreen === 'explore' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              {exploreVideos.map((vid) => (
                <div
                  key={vid.id}
                  className="group rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-xs flex flex-col"
                >
                  <div className="relative aspect-4/3 bg-slate-900 overflow-hidden">
                    <img
                      src={vid.thumbnail}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-mono">
                      {vid.duration}
                    </span>
                  </div>
                  <div className="p-2.5 space-y-1">
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 line-clamp-1">
                      {vid.title}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>@{vid.creator}</span>
                      <span className="text-[#0E0830] dark:text-[#c4bbf0]">{vid.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
