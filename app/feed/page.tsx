'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Upload,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { Profile } from '@/types';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const user = DataStore.getCurrentUser();
    setCurrentUser(user);
  }, []);

  // Cycle through creative activities every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CREATIVE_ACTIVITIES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentActivity = CREATIVE_ACTIVITIES[activeIndex];

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      router.push('/upload');
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      router.push('/upload');
    }
  };

  return (
    <MobileShell hideBottomNav={false}>
      <div className="flex flex-col min-h-full px-4 pt-3 pb-8 space-y-5">
        {/* Hidden File Input for direct picking */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelected}
          className="hidden"
        />

        {/* Top Header: Simple & Relaxed */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
              SkillBridge
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium">Daily Showcase</span>
        </div>

        {/* BIG UPLOAD BOX (Centerpiece of Home) */}
        <div
          onClick={handleBoxClick}
          className="relative w-full aspect-[4/5] sm:aspect-square max-h-[500px] rounded-3xl border-2 border-dashed border-[#0E0830]/30 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-[#0E0830] dark:hover:border-white transition-all duration-300 cursor-pointer shadow-xs p-6 flex flex-col items-center justify-between text-center select-none group"
        >
          {/* Subtle Record Dot Header */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
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
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentActivity.subtitle}
              </p>
            </div>
          </div>

          {/* Action Prompt */}
          <div className="w-full pt-2">
            <button
              type="button"
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
      </div>
    </MobileShell>
  );
}
