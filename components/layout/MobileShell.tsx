'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  BookmarkCheck,
  Bell,
  User,
  Layers,
  Building2,
  GraduationCap,
  Plus,
  Trophy,
  Gift,
  Upload,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { DataStore } from '@/services/dataStore';
import { Profile } from '@/types';

interface MobileShellProps {
  children: React.ReactNode;
  hideBottomNav?: boolean;
  darkFeed?: boolean;
}

export function MobileShell({ children, hideBottomNav = false }: MobileShellProps) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const user = DataStore.getCurrentUser();
    setCurrentUser(user);

    const notifs = DataStore.getNotifications(user.id);
    setUnreadCount(notifs.filter((n) => !n.is_read).length);
  }, [pathname]);

  const handleRoleSwitch = (newUserId: string) => {
    DataStore.setCurrentUserId(newUserId);
    const u = DataStore.getCurrentUser();
    setCurrentUser(u);
    window.location.reload();
  };

  const isOrg = currentUser?.role === 'organization';

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 selection:bg-[#0E0830] selection:text-white flex flex-col antialiased">
      {/* Responsive Shell: 100% width on Mobile, 60% Centered on Desktop */}
      <main className="w-full lg:w-[60%] mx-auto min-h-screen flex flex-col relative border-x-0 lg:border-x border-slate-200/70 dark:border-slate-800/80 shadow-xs bg-white dark:bg-[#111827] text-slate-900 dark:text-slate-100">
        {/* Top Minimal Role, Status Bar & Theme Toggle */}
        <header className="flex items-center justify-between px-3 sm:px-6 py-2.5 text-xs border-b border-slate-100 dark:border-slate-800/80 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md sticky top-0 z-40">
          <Link href="/feed" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-md bg-[#0E0830] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              S
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-slate-900 dark:text-white text-sm tracking-tight">
                SkillBridge
              </span>
              <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
                {isOrg ? 'Organization Portal' : 'Creative Studio'}
              </span>
            </div>
          </Link>

          {/* Right Controls: Role Switcher, Quick Links & Theme Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-[11px] font-medium text-slate-700 dark:text-slate-300">
              {isOrg ? (
                <Building2 className="w-3.5 h-3.5 text-[#0E0830] dark:text-[#c4bbf0] shrink-0" />
              ) : (
                <GraduationCap className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
              )}
              <select
                value={currentUser?.id || 'usr-student-001'}
                onChange={(e) => handleRoleSwitch(e.target.value)}
                className="bg-transparent border-none text-[11px] font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
                title="Switch persona"
              >
                <option value="usr-student-001">Sarah (Creator)</option>
                <option value="usr-student-002">Emma (Creator)</option>
                <option value="usr-student-003">Mike (Creator)</option>
                <option value="usr-org-001">Creative Arts (Org)</option>
              </select>
            </div>

            {/* Quick Explore Icon */}
            <Link
              href="/explore"
              className={`p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                pathname === '/explore' ? 'text-[#0E0830] dark:text-[#c4bbf0]' : 'text-slate-500'
              }`}
              title="Explore directory"
            >
              <Compass className="w-4 h-4" />
            </Link>

            {/* Updates Bell */}
            <Link
              href="/notifications"
              className={`p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative ${
                pathname === '/notifications' ? 'text-[#0E0830] dark:text-[#c4bbf0]' : 'text-slate-500'
              }`}
              title="Updates & Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute 0.5 top-0.5 right-0.5 w-3 h-3 bg-[#0E0830] text-white rounded-full text-[8px] flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </Link>

            {!isOrg && (
              <Link
                href="/upload"
                className="px-2.5 py-1 rounded-md bg-[#0E0830] hover:bg-[#1a1147] text-white font-medium text-[11px] flex items-center gap-1 shadow-xs transition-colors"
                title="Upload daily craft to increase rating"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upload</span>
              </Link>
            )}

            {/* Quick 1-Click Theme Toggle Button */}
            <ThemeToggle className="border border-slate-200/70 dark:border-slate-700/70 bg-slate-50 dark:bg-slate-800/80" />
          </div>
        </header>

        {/* Page Content Body */}
        <div className="flex-1 pb-20">
          {children}
        </div>

        {/* Relaxing Big-Tech Bottom Navigation Bar */}
        {!hideBottomNav && (
          <nav
            aria-label="Bottom Navigation"
            className="sticky bottom-0 z-40 border-t bg-white/95 dark:bg-[#111827]/95 border-slate-200/80 dark:border-slate-800/80 text-slate-500 dark:text-slate-400 backdrop-blur-md px-4 sm:px-8 py-2 flex items-center justify-around"
          >
            {/* 1. Home / Upload Feature */}
            <Link
              href="/feed"
              className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
                pathname === '/feed' || pathname === '/'
                  ? 'text-[#0E0830] dark:text-[#c4bbf0] font-bold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Upload className="w-5 h-5 stroke-[1.9]" />
              <span className="text-[11px] tracking-tight">Home</span>
            </Link>

            {/* 2. Rating Page */}
            <Link
              href="/rating"
              className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
                pathname === '/rating'
                  ? 'text-[#0E0830] dark:text-[#c4bbf0] font-bold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Trophy className="w-5 h-5 stroke-[1.9]" />
              <span className="text-[11px] tracking-tight">Rating</span>
            </Link>

            {/* 3. Rewards Page (Replaces message page) */}
            <Link
              href="/rewards"
              className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
                pathname === '/rewards' || pathname === '/messages'
                  ? 'text-[#0E0830] dark:text-[#c4bbf0] font-bold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Gift className="w-5 h-5 stroke-[1.9]" />
              <span className="text-[11px] tracking-tight">Rewards</span>
            </Link>

            {/* 4. Selected Work / Shortlist */}
            <Link
              href="/saved"
              className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
                pathname === '/saved'
                  ? 'text-[#0E0830] dark:text-[#c4bbf0] font-bold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookmarkCheck className="w-5 h-5 stroke-[1.9]" />
              <span className="text-[11px] tracking-tight">
                {isOrg ? 'Shortlist' : 'Selected'}
              </span>
            </Link>

            {/* 5. Profile & Settings */}
            <Link
              href="/profile"
              className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
                pathname === '/profile'
                  ? 'text-[#0E0830] dark:text-[#c4bbf0] font-bold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-5 h-5 stroke-[1.9]" />
              <span className="text-[11px] tracking-tight">Profile</span>
            </Link>
          </nav>
        )}
      </main>
    </div>
  );
}
