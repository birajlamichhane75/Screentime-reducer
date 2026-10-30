'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

const LANDING_ICONS = [
  { src: '/creative-icons/drawing.jpg', alt: 'Drawing and Recording Creative Routine' },
  { src: '/creative-icons/cooking.jpg', alt: 'Cooking and Recording Creative Routine' },
  { src: '/creative-icons/dancing.jpg', alt: 'Dancing and Recording Creative Routine' },
  { src: '/creative-icons/soccer.jpg', alt: 'Playing Soccer and Recording Creative Routine' },
  { src: '/creative-icons/painting.jpg', alt: 'Painting and Recording Creative Routine' },
];

export default function LandingPage() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % LANDING_ICONS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b071e] text-slate-900 dark:text-white flex flex-col justify-between px-6 py-6 transition-colors">
      {/* Minimal Top Brand Bar */}
      <header className="flex items-center justify-between w-full max-w-md mx-auto">
        <span className="font-extrabold text-lg tracking-tight text-[#0E0830] dark:text-white">
          ShowUp!
        </span>
        <ThemeToggle />
      </header>

      {/* Main Hero Center: Half-Screen Icon, 5-Word One-Liner, and Button */}
      <main className="flex-1 flex flex-col items-center justify-center text-center my-auto w-full max-w-md mx-auto space-y-6">
        {/* Big Icon: Creative Routine and Recording (Covers ~half screen, using user's uploaded icons with simple movement animation) */}
        <div className="w-[82vw] h-[44vh] max-w-sm max-h-[420px] flex items-center justify-center relative select-none">
          <img
            src={LANDING_ICONS[activeIdx].src}
            alt={LANDING_ICONS[activeIdx].alt}
            className="w-full h-full object-contain mix-blend-multiply dark:invert dark:mix-blend-screen transition-all duration-500 transform animate-gentle-float hover:scale-105"
          />
        </div>

        {/* 3-Second Cycle Dots Indicator */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {LANDING_ICONS.map((icon, i) => (
            <button
              key={icon.src}
              onClick={() => setActiveIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIdx
                  ? 'w-6 bg-[#0E0830] dark:bg-white'
                  : 'w-1.5 bg-slate-200 dark:bg-slate-700'
              }`}
              aria-label={`Show ${icon.alt}`}
            />
          ))}
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
        <span>ShowUp! &bull; Creator Platform</span>
      </footer>
    </div>
  );
}
