'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Upload,
  Compass,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { Profile } from '@/types';

// The 6 creative activities with people doing creative work and recording
const CREATIVE_ACTIVITIES = [
  {
    id: 'cooking',
    title: 'Cooking',
    subtitle: 'Culinary routines & kitchen creations',
    // Cooking with recording camera icon
    icon: (
      <svg
        viewBox="0 0 160 160"
        className="w-32 h-32 stroke-[#0E0830] dark:stroke-white stroke-[2.2] fill-none stroke-linecap-round stroke-linejoin-round transition-all duration-300"
      >
        {/* Chef Hat */}
        <path d="M55 52 C45 52 40 42 48 34 C44 24 55 16 66 22 C72 14 88 14 94 22 C105 16 116 24 112 34 C120 42 115 52 105 52 Z" />
        <path d="M52 52 L108 52 L105 66 L55 66 Z" />
        {/* Cooking Pan & Whisk / Utensil */}
        <ellipse cx="80" cy="100" rx="36" ry="12" />
        <path d="M44 100 L48 118 C48 126 62 132 80 132 C98 132 112 126 112 118 L116 100" />
        <path d="M116 106 L144 94" />
        {/* Recording Camera in top corner */}
        <rect x="110" y="24" width="28" height="20" rx="4" />
        <polygon points="138,29 150,22 150,39 138,32" />
        <circle cx="118" cy="34" r="3" />
        {/* Steam waves */}
        <path d="M68 88 Q72 80 68 74" />
        <path d="M80 88 Q84 78 80 72" />
        <path d="M92 88 Q96 80 92 74" />
      </svg>
    ),
  },
  {
    id: 'soccer',
    title: 'Playing Soccer',
    subtitle: 'Athletic drills, juggles & field skills',
    // Soccer with recording camera icon
    icon: (
      <svg
        viewBox="0 0 160 160"
        className="w-32 h-32 stroke-[#0E0830] dark:stroke-white stroke-[2.2] fill-none stroke-linecap-round stroke-linejoin-round transition-all duration-300"
      >
        {/* Player Running / Kicking Pose */}
        <circle cx="68" cy="32" r="12" />
        <path d="M68 44 L60 82 L42 108" />
        <path d="M60 76 L86 98 L104 94" />
        <path d="M68 54 L92 48 L104 62" />
        <path d="M68 54 L44 64 L36 54" />
        {/* Soccer Ball */}
        <circle cx="118" cy="116" r="18" />
        <polygon points="118,104 126,110 123,120 113,120 110,110" />
        <path d="M118 104 L118 98" />
        <path d="M126 110 L134 110" />
        <path d="M123 120 L128 128" />
        <path d="M113 120 L108 128" />
        <path d="M110 110 L102 110" />
        {/* Recording Camera in corner */}
        <rect x="18" y="22" width="28" height="20" rx="4" />
        <polygon points="46,27 58,20 58,37 46,30" />
        <circle cx="26" cy="32" r="3" />
        {/* Motion Speed Lines */}
        <path d="M96 114 L90 114" />
        <path d="M94 122 L86 122" />
      </svg>
    ),
  },
  {
    id: 'drawing',
    title: 'Drawing',
    subtitle: 'Sketches, canvas art & digital illustration',
    // Drawing on easel with recording camera
    icon: (
      <svg
        viewBox="0 0 160 160"
        className="w-32 h-32 stroke-[#0E0830] dark:stroke-white stroke-[2.2] fill-none stroke-linecap-round stroke-linejoin-round transition-all duration-300"
      >
        {/* Art Easel */}
        <path d="M80 20 L44 140" />
        <path d="M80 20 L116 140" />
        <path d="M80 20 L80 140" />
        <path d="M36 100 L124 100" />
        {/* Canvas Board */}
        <rect x="48" y="38" width="64" height="52" rx="4" />
        {/* Artwork Sketch on Canvas */}
        <path d="M60 76 Q72 52 84 68 T102 60" />
        <circle cx="68" cy="52" r="5" />
        {/* Artist Hand holding brush */}
        <path d="M104 88 L126 72" />
        <path d="M126 72 L132 66" />
        {/* Recording Camera */}
        <rect x="18" y="24" width="28" height="20" rx="4" />
        <polygon points="46,29 58,22 58,39 46,32" />
        <circle cx="26" cy="34" r="3" />
      </svg>
    ),
  },
  {
    id: 'coding',
    title: 'Coding',
    subtitle: 'Software, algorithms & digital architecture',
    // Coding on screen with recording camera
    icon: (
      <svg
        viewBox="0 0 160 160"
        className="w-32 h-32 stroke-[#0E0830] dark:stroke-white stroke-[2.2] fill-none stroke-linecap-round stroke-linejoin-round transition-all duration-300"
      >
        {/* Laptop / Monitor */}
        <rect x="36" y="44" width="88" height="58" rx="6" />
        <path d="M22 110 L138 110 L126 122 L34 122 Z" />
        {/* Code Brackets on Screen */}
        <path d="M62 64 L52 73 L62 82" />
        <path d="M98 64 L108 73 L98 82" />
        <path d="M84 62 L76 84" />
        {/* Recording Camera */}
        <rect x="110" y="18" width="28" height="20" rx="4" />
        <polygon points="138,23 150,16 150,33 138,26" />
        <circle cx="118" cy="28" r="3" />
      </svg>
    ),
  },
  {
    id: 'dancing',
    title: 'Dancing',
    subtitle: 'Choreography, balance & rhythm routines',
    // Dancer with recording camera
    icon: (
      <svg
        viewBox="0 0 160 160"
        className="w-32 h-32 stroke-[#0E0830] dark:stroke-white stroke-[2.2] fill-none stroke-linecap-round stroke-linejoin-round transition-all duration-300"
      >
        {/* Dancer Body Pose */}
        <circle cx="80" cy="28" r="12" />
        <path d="M80 40 L80 80 L62 114 L50 142" />
        <path d="M80 74 L104 94 L128 90" />
        {/* Expressive Dancer Arms */}
        <path d="M80 50 Q104 38 122 46" />
        <path d="M80 50 Q56 42 38 28" />
        {/* Musical Flow / Sparkles */}
        <path d="M120 22 Q128 14 136 22" />
        <path d="M48 68 Q40 76 34 70" />
        {/* Recording Camera */}
        <rect x="18" y="88" width="28" height="20" rx="4" />
        <polygon points="46,93 58,86 58,103 46,96" />
        <circle cx="26" cy="98" r="3" />
      </svg>
    ),
  },
  {
    id: 'singing',
    title: 'Singing',
    subtitle: 'Vocal performance, acoustic & lyrics practice',
    // Singer / Microphone with soundwaves and recording camera
    icon: (
      <svg
        viewBox="0 0 160 160"
        className="w-32 h-32 stroke-[#0E0830] dark:stroke-white stroke-[2.2] fill-none stroke-linecap-round stroke-linejoin-round transition-all duration-300"
      >
        {/* Studio Microphone */}
        <rect x="68" y="28" width="24" height="42" rx="12" />
        <line x1="68" y1="42" x2="92" y2="42" />
        <line x1="68" y1="52" x2="92" y2="52" />
        <path d="M58 48 C58 68 102 68 102 48" />
        <line x1="80" y1="70" x2="80" y2="108" />
        <line x1="60" y1="108" x2="100" y2="108" />
        {/* Audio Soundwaves */}
        <path d="M46 36 Q38 48 46 60" />
        <path d="M36 28 Q26 48 36 68" />
        <path d="M114 36 Q122 48 114 60" />
        <path d="M124 28 Q134 48 124 68" />
        {/* Recording Camera */}
        <rect x="110" y="88" width="28" height="20" rx="4" />
        <polygon points="138,93 150,86 150,103 138,96" />
        <circle cx="118" cy="98" r="3" />
      </svg>
    ),
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
          <Link
            href="/explore"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0E0830] dark:text-white text-xs font-semibold transition-colors"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore</span>
          </Link>
        </div>

        {/* BIG UPLOAD BOX (Centerpiece of Home) */}
        <div
          onClick={handleBoxClick}
          className="relative w-full aspect-[4/5] sm:aspect-square max-h-[480px] rounded-3xl border-2 border-dashed border-[#0E0830]/30 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-[#0E0830] dark:hover:border-white transition-all duration-300 cursor-pointer shadow-xs p-6 flex flex-col items-center justify-between text-center select-none group"
        >
          {/* Subtle Record Dot Header */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#0E0830] dark:bg-white animate-pulse" />
            <span>Daily Practice Record</span>
          </div>

          {/* Animated Big Icon Area (Changes every 3 seconds) */}
          <div className="my-auto flex flex-col items-center justify-center space-y-4">
            <div className="transform transition-transform duration-500 group-hover:scale-105">
              {currentActivity.icon}
            </div>

            <div className="space-y-1 transition-opacity duration-300">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {currentActivity.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentActivity.subtitle}
              </p>
            </div>
          </div>

          {/* Action Prompt */}
          <div className="w-full space-y-2 pt-2">
            <button
              type="button"
              className="w-full py-3.5 rounded-2xl bg-[#0E0830] hover:bg-[#1a1147] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-lg"
            >
              <Upload className="w-4 h-4" />
              <span>Tap to Upload Video</span>
            </button>
            <p className="text-[10px] text-slate-400 font-medium">
              3-sec showcase &bull; Updates daily consistency score
            </p>
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
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Explore Talent Directory
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Browse cooking, soccer, drawing, coding, dancing, singing
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0E0830] group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>
      </div>
    </MobileShell>
  );
}
