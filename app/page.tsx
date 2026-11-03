'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-3d-lining text-slate-900 dark:text-white flex flex-col justify-between px-5 py-6 transition-colors selection:bg-[#0E0830] selection:text-white">
      {/* Top Brand Bar */}
      <header className="flex items-center justify-between w-full max-w-md mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 p-0.5">
            <img
              src="/showup-logo.jpg"
              alt="ShowUp! Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-black text-xl tracking-tight text-[#0E0830] dark:text-white font-space">
            ShowUp!
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Hero Center */}
      <main className="flex-1 flex flex-col items-center justify-center text-center my-auto w-full max-w-md mx-auto space-y-6">
        {/* Floating 3D Portal Visual */}
        <div className="card-3d card-3d-interactive w-[86vw] h-[46vh] max-w-sm max-h-[440px] flex items-center justify-center relative select-none rounded-[2rem] p-4 group">
          <div className="w-full h-full rounded-2xl overflow-hidden flex items-center justify-center">
            <img
              src="/showup-hero.jpg"
              alt="ShowUp! - Step out and record your craft"
              className="w-full h-full object-contain animate-gentle-float group-hover:scale-105 transition-all duration-500"
            />
          </div>
        </div>

        {/* Brand Tagline */}
        <div className="space-y-2">
          <p className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-space">
            Practice daily. Get discovered directly.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">
            Replace passive doomscrolling with authentic daily craft
          </p>
        </div>

        {/* Button to Sign In / Get Started */}
        <div className="w-full pt-1">
          <Link
            href="/login"
            className="btn-3d w-full py-4 rounded-2xl text-white text-base font-extrabold flex items-center justify-center gap-2 group transition-all"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full text-center text-xs text-slate-400 pb-2 font-medium">
        <span>ShowUp! &bull; Creator Platform</span>
      </footer>
    </div>
  );
}
