'use client';

import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0b071e] text-slate-900 dark:text-white flex flex-col justify-between px-6 py-6 transition-colors">
      {/* Minimal Top Brand Bar */}
      <header className="flex items-center justify-between w-full max-w-md mx-auto">
        <span className="font-extrabold text-lg tracking-tight text-[#0E0830] dark:text-white">
          SkillBridge
        </span>
        <ThemeToggle />
      </header>

      {/* Main Hero Center: Half-Screen Outline Icon, 5-Word One-Liner, and Button */}
      <main className="flex-1 flex flex-col items-center justify-center text-center my-auto w-full max-w-md mx-auto space-y-8">
        {/* Big Outline Icon: Doing Creative Routine & Recording (Covers ~half screen, outline only, no color) */}
        <div className="w-[82vw] h-[44vh] max-w-sm max-h-[420px] flex items-center justify-center">
          <svg
            viewBox="0 0 320 320"
            className="w-full h-full stroke-[#0E0830] dark:stroke-white stroke-[2] fill-none stroke-linecap-round stroke-linejoin-round"
            aria-label="Creative Routine and Recording"
          >
            {/* Recording Camera Tripod */}
            <path d="M70 230 L50 290" />
            <path d="M90 230 L110 290" />
            <path d="M80 230 L80 290" />
            <path d="M60 270 L100 270" />

            {/* Video Camera Body */}
            <rect x="45" y="160" width="70" height="50" rx="8" />
            {/* Camera Lens */}
            <polygon points="115,172 145,155 145,215 115,198" />
            {/* Top Handle */}
            <path d="M60 160 L60 145 L100 145 L100 160" />
            {/* Tape Reel / Viewfinder */}
            <circle cx="65" cy="185" r="9" />
            <circle cx="95" cy="185" r="9" />
            {/* Recording Indicator */}
            <circle cx="58" cy="170" r="3" />

            {/* Recording Sight Lines / Focus Frame */}
            <path d="M165 140 L180 140" />
            <path d="M165 140 L165 155" />
            <path d="M295 140 L280 140" />
            <path d="M295 140 L295 155" />
            <path d="M165 260 L180 260" />
            <path d="M165 260 L165 245" />
            <path d="M295 260 L280 260" />
            <path d="M295 260 L295 245" />

            {/* Creator Doing Routine: Head & Body */}
            <circle cx="230" cy="90" r="22" />
            <path d="M230 112 L230 185" />

            {/* Creator Arms Active In Routine (Painting / Instrument / Athletic) */}
            <path d="M230 135 L195 160 L185 190" />
            <path d="M230 135 L265 155 L285 140" />

            {/* Creative Canvas / Easel / Craft */}
            <path d="M180 170 L180 265" />
            <path d="M180 190 L160 270" />
            <path d="M180 190 L200 270" />
            <rect x="155" y="170" width="50" height="40" rx="4" />

            {/* Creative Waves / Routine Rhythm */}
            <path d="M245 80 Q255 70 265 80 T285 80" />
            <path d="M250 100 Q265 92 275 105" />

            {/* Athletic / Dance Pose Legs */}
            <path d="M230 185 L210 265" />
            <path d="M230 185 L255 255 L275 265" />
          </svg>
        </div>

        {/* One Liner with Exactly 5 Words */}
        <p className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Practice daily. Get discovered directly.
        </p>

        {/* Button to Sign In / Get Started */}
        <div className="w-full pt-2">
          <Link
            href="/login"
            className="block w-full py-4 rounded-2xl bg-[#0E0830] hover:bg-[#1a1147] text-white text-base font-bold transition-all shadow-md active:scale-98"
          >
            Get Started
          </Link>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full text-center text-xs text-slate-400 pb-2">
        <span>SkillBridge &bull; Creator Platform</span>
      </footer>
    </div>
  );
}
