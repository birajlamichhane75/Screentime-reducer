'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Play,
  BookmarkCheck,
  Mail,
  HeartOff,
  Building2,
  Palette,
  Music,
  Activity,
  Code2,
  Sparkles,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';

export default function VisualLandingPage() {
  return (
    <MobileShell hideBottomNav={true}>
      <div className="flex flex-col min-h-full px-4 sm:px-6 py-5 space-y-6">
        {/* Top Visual Brand Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0E0830] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              ✦
            </div>
            <span className="font-semibold text-base tracking-tight text-slate-900 dark:text-white">
              SkillBridge
            </span>
          </div>

          <Link
            href="/feed"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E0830] hover:bg-[#1a1147] text-white text-xs font-medium transition-colors shadow-xs"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Minimal Hero Header (Very little text, high visual emphasis) */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
            <Sparkles className="w-3 h-3 text-[#0E0830] dark:text-[#c4bbf0]" />
            <span>Creative Showcase</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Real Craft. <span className="text-[#0E0830] dark:text-[#c4bbf0]">Real Opportunities.</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Zero likes or vanity noise. Curated directly by organizations.
          </p>
        </div>

        {/* Visual Discipline Icons Row */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
          <Link
            href="/feed"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium hover:border-[#0E0830] hover:text-[#0E0830] dark:hover:border-[#c4bbf0] dark:hover:text-[#c4bbf0] transition-colors shadow-2xs"
          >
            <Palette className="w-3.5 h-3.5 text-[#0E0830] dark:text-[#c4bbf0]" />
            <span>Art</span>
          </Link>
          <Link
            href="/feed"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium hover:border-[#0E0830] hover:text-[#0E0830] dark:hover:border-[#c4bbf0] dark:hover:text-[#c4bbf0] transition-colors shadow-2xs"
          >
            <Music className="w-3.5 h-3.5 text-[#0E0830] dark:text-[#c4bbf0]" />
            <span>Music</span>
          </Link>
          <Link
            href="/feed"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium hover:border-[#0E0830] hover:text-[#0E0830] dark:hover:border-[#c4bbf0] dark:hover:text-[#c4bbf0] transition-colors shadow-2xs"
          >
            <Activity className="w-3.5 h-3.5 text-[#0E0830] dark:text-[#c4bbf0]" />
            <span>Dance</span>
          </Link>
          <Link
            href="/feed"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium hover:border-[#0E0830] hover:text-[#0E0830] dark:hover:border-[#c4bbf0] dark:hover:text-[#c4bbf0] transition-colors shadow-2xs"
          >
            <Code2 className="w-3.5 h-3.5 text-[#0E0830] dark:text-[#c4bbf0]" />
            <span>Code</span>
          </Link>
        </div>

        {/* Visual Bento Showcase (Pure Visuals) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Main Large Visual Card */}
          <Link
            href="/video/vid-03"
            className="group relative sm:col-span-2 rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 aspect-[16/9] block shadow-xs"
          >
            <img
              src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=80"
              alt="Fine Art Portrait"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Visual Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

            {/* Floating Top Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-[10px] font-semibold text-slate-900 dark:text-white flex items-center gap-1.5 shadow-sm">
                <Palette className="w-3 h-3 text-[#0E0830] dark:text-[#c4bbf0]" />
                <span>Visual Art</span>
              </div>
              <div className="px-2.5 py-1 rounded-md bg-[#0E0830] text-white backdrop-blur-md text-[10px] font-semibold flex items-center gap-1 shadow-sm">
                <BookmarkCheck className="w-3 h-3" />
                <span>Selected by Guild</span>
              </div>
            </div>

            {/* Centered Play Button Glyph */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/90 dark:bg-[#0E0830] text-[#0E0830] dark:text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
            </div>

            {/* Bottom Caption Strip */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-[10px] font-bold">
                  L
                </div>
                <span className="text-xs font-medium drop-shadow-xs">Lucas Silva — Oil on Canvas</span>
              </div>
              <span className="text-[10px] text-white/80 font-mono">Watch Preview</span>
            </div>
          </Link>

          {/* Secondary Visual Card 1: Music Acoustic */}
          <Link
            href="/video/vid-02"
            className="group relative rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 aspect-[4/3] block shadow-xs"
          >
            <img
              src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80"
              alt="Acoustic Guitar Session"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-[10px] font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1 shadow-xs">
              <Music className="w-2.5 h-2.5 text-[#0E0830] dark:text-[#c4bbf0]" />
              <span>Music</span>
            </div>

            {/* Animated Equalizer Wave Bars */}
            <div className="absolute top-3 right-3 flex items-end gap-0.5 h-3">
              <span className="w-0.5 h-3 bg-[#0E0830] dark:bg-[#c4bbf0] animate-pulse" />
              <span className="w-0.5 h-2 bg-[#0E0830] dark:bg-[#c4bbf0] animate-pulse delay-75" />
              <span className="w-0.5 h-3.5 bg-[#0E0830] dark:bg-[#c4bbf0] animate-pulse delay-150" />
              <span className="w-0.5 h-1.5 bg-[#0E0830] dark:bg-[#c4bbf0] animate-pulse delay-100" />
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-9 h-9 rounded-full bg-white/90 dark:bg-[#0E0830] text-[#0E0830] dark:text-white flex items-center justify-center shadow-md">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>

            <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
              <p className="text-xs font-medium truncate drop-shadow-xs">Alex Chen — Acoustic Session</p>
            </div>
          </Link>

          {/* Secondary Visual Card 2: Dance Choreography */}
          <Link
            href="/video/vid-01"
            className="group relative rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 aspect-[4/3] block shadow-xs"
          >
            <img
              src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80"
              alt="Contemporary Dance"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-[10px] font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1 shadow-xs">
              <Activity className="w-2.5 h-2.5 text-[#0E0830] dark:text-[#c4bbf0]" />
              <span>Dance</span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-9 h-9 rounded-full bg-white/90 dark:bg-[#0E0830] text-[#0E0830] dark:text-white flex items-center justify-center shadow-md">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
            </div>

            <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
              <p className="text-xs font-medium truncate drop-shadow-xs">Sarah Music — Contemporary Solo</p>
            </div>
          </Link>
        </div>

        {/* Minimal 3-Icon Visual Feature Bar (Zero Paragraphs) */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center gap-1 shadow-2xs">
            <HeartOff className="w-4 h-4 text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
              0 Likes
            </span>
          </div>

          <div className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center gap-1 shadow-2xs">
            <Building2 className="w-4 h-4 text-[#0E0830] dark:text-[#c4bbf0]" />
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
              Org Selected
            </span>
          </div>

          <div className="p-3 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center justify-center text-center gap-1 shadow-2xs">
            <Mail className="w-4 h-4 text-[#0E0830] dark:text-[#c4bbf0]" />
            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
              Direct Email
            </span>
          </div>
        </div>

        {/* Primary Visual Action */}
        <div className="pt-1">
          <Link
            href="/feed"
            className="w-full py-3 px-4 rounded-xl bg-[#0E0830] hover:bg-[#1a1147] text-white font-medium text-xs tracking-wide shadow-xs transition-colors flex items-center justify-center gap-2 group"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Open Talent Feed</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}
