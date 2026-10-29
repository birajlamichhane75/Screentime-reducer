'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Video, Users, Trophy, Play, CheckCircle2 } from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';

export default function LandingPage() {
  return (
    <MobileShell hideBottomNav={true}>
      <div className="flex flex-col min-h-full px-5 py-2">
        {/* Top Navbar */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
              SkillBridge
            </span>
          </div>
          <Link
            href="/login"
            className="text-xs font-semibold px-3 py-1.5 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Sign In
          </Link>
        </div>

        {/* Hero Section */}
        <div className="mt-6 text-center space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.2]">
            Your Talent <br />
            Deserves to <span className="text-indigo-600 dark:text-indigo-400">Be Seen.</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            Show what you love doing. Get discovered by universities, clubs, and organizations looking for your talent.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-3 max-w-xs mx-auto">
            <Link
              href="/feed"
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-semibold text-xs tracking-wide shadow-md shadow-indigo-600/25 transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>Open Creator Home Feed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/explore"
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 active:scale-98 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>Open Explore Grid</span>
            </Link>
            <Link
              href="/showcase"
              className="w-full py-2 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] text-center hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
            >
              ✦ View Responsive UI Showcase
            </Link>
          </div>
        </div>

        {/* Visual Showcase (3 Floating Phone Cards) */}
        <div className="mt-8 relative h-48 flex items-center justify-center overflow-hidden">
          {/* Card 1: Left */}
          <div className="w-28 h-40 rounded-2xl overflow-hidden shadow-lg border border-slate-700/30 transform -rotate-6 -translate-x-12 translate-y-2 relative group">
            <img
              src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80"
              alt="Guitarist"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
              <span className="text-[9px] text-white font-medium">@alexmusic</span>
            </div>
          </div>

          {/* Card 2: Center Featured */}
          <div className="w-32 h-44 rounded-2xl overflow-hidden shadow-2xl border-2 border-indigo-500/50 transform z-10 scale-105 relative">
            <img
              src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80"
              alt="Dancer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
              <span className="text-[10px] text-white font-bold">@sarahdance</span>
              <span className="text-[8px] text-indigo-300 font-medium">Contemporary Dance</span>
            </div>
            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Play className="w-2.5 h-2.5 fill-white" />
            </div>
          </div>

          {/* Card 3: Right */}
          <div className="w-28 h-40 rounded-2xl overflow-hidden shadow-lg border border-slate-700/30 transform rotate-6 translate-x-12 translate-y-2 relative">
            <img
              src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=300&auto=format&fit=crop&q=80"
              alt="Soccer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
              <span className="text-[9px] text-white font-medium">@mikessoccer</span>
            </div>
          </div>
        </div>

        {/* 3 Steps */}
        <div className="mt-8 grid grid-cols-3 gap-2 text-center border-t border-slate-100 dark:border-slate-800/80 pt-6">
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center mb-1.5">
              1
            </div>
            <h4 className="text-[11px] font-bold text-slate-900 dark:text-white">Upload Talent</h4>
            <p className="text-[9px] text-slate-400 mt-0.5">Short video clip</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center mb-1.5">
              2
            </div>
            <h4 className="text-[11px] font-bold text-slate-900 dark:text-white">Get Discovered</h4>
            <p className="text-[9px] text-slate-400 mt-0.5">By organizations</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center mb-1.5">
              3
            </div>
            <h4 className="text-[11px] font-bold text-slate-900 dark:text-white">Unlock Future</h4>
            <p className="text-[9px] text-slate-400 mt-0.5">Real opportunities</p>
          </div>
        </div>

        {/* Bottom Banner Card (Screen 1) */}
        <div className="mt-8 mb-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white relative overflow-hidden shadow-lg border border-indigo-900/50">
          <div className="relative z-10 max-w-[200px]">
            <h3 className="text-xs font-bold text-slate-100 leading-tight">
              Looking for Talent? <br />
              Find It Here.
            </h3>
            <Link
              href="/discover"
              className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-semibold transition-all"
            >
              <span>Explore Talent</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <img
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&auto=format&fit=crop&q=80"
            alt="Photographer"
            className="absolute -right-2 -bottom-2 w-28 h-28 object-cover rounded-full opacity-80"
          />
        </div>
      </div>
    </MobileShell>
  );
}
