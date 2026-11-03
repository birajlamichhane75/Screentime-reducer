'use client';

import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0b071e] text-slate-900 dark:text-white flex flex-col justify-between px-6 py-6 transition-colors">
      {/* Minimal Top Brand Bar */}
      <header className="flex items-center justify-between w-full max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl overflow-hidden shadow-xs border border-slate-200/60 dark:border-slate-800">
            <img
              src="/showup-logo.jpg"
              alt="ShowUp! Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-[#0E0830] dark:text-white">
            ShowUp!
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Hero Center: 3D ShowUp! Hero Visual, 5-Word One-Liner, and Button */}
      <main className="flex-1 flex flex-col items-center justify-center text-center my-auto w-full max-w-md mx-auto space-y-6">
        {/* Big 3D Logo / Icon: Stepping out of screen and recording */}
        <div className="w-[85vw] h-[46vh] max-w-sm max-h-[440px] flex items-center justify-center relative select-none rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-sm p-3 group">
          <img
            src="/showup-hero.jpg"
            alt="ShowUp! - Step out and record your craft"
            className="w-full h-full object-contain transition-all duration-500 transform animate-gentle-float group-hover:scale-105"
          />
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
