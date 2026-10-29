'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Search,
  Plus,
  User,
  Sparkles,
} from 'lucide-react';
import { DataStore } from '@/services/dataStore';
import { Profile } from '@/types';

interface MobileShellProps {
  children: React.ReactNode;
  hideBottomNav?: boolean;
  darkFeed?: boolean;
}

export function MobileShell({ children, hideBottomNav = false, darkFeed = false }: MobileShellProps) {
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

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Responsive Shell: 100% width on Mobile, 60% Centered on Desktop */}
      <main
        className={`w-full lg:w-[60%] mx-auto min-h-screen flex flex-col relative border-x-0 lg:border-x border-slate-200/80 dark:border-slate-800/80 shadow-xs ${
          darkFeed ? 'bg-black text-white' : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100'
        }`}
      >
        {/* Top Demo Helper Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2 text-xs border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/80 text-slate-500">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[11px]">SkillBridge</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 hidden sm:inline">Role:</span>
            <select
              value={currentUser?.id || 'usr-student-001'}
              onChange={(e) => handleRoleSwitch(e.target.value)}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-md px-2 py-0.5 text-[11px] focus:ring-1 focus:ring-indigo-500 outline-hidden font-medium"
            >
              <option value="usr-student-001">Sarah Music (@sarahmusic - Creator)</option>
              <option value="usr-student-002">Emma Dance (@emmadance)</option>
              <option value="usr-student-003">Mike Soccer (@mikesoccer)</option>
              <option value="usr-org-001">Creative Arts University (Org)</option>
            </select>
          </div>
        </div>

        {/* Page Content Body */}
        <div className="flex-1 pb-20">
          {children}
        </div>

        {/* Responsive Sticky Bottom Navigation Bar (Centered within 60% container) */}
        {!hideBottomNav && (
          <nav
            className="sticky bottom-0 z-40 border-t bg-white/95 dark:bg-slate-900/95 border-slate-100 dark:border-slate-800/80 text-slate-400 dark:text-slate-500 backdrop-blur-md px-6 py-2 flex items-center justify-around"
          >
            {/* 1. Home */}
            <Link
              href="/feed"
              className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
                pathname === '/feed' || pathname === '/'
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Home
                className={`w-5 h-5 ${
                  pathname === '/feed' || pathname === '/'
                    ? 'fill-indigo-600 dark:fill-indigo-400 text-indigo-600 dark:text-indigo-400'
                    : 'stroke-[1.8]'
                }`}
              />
              <span className="text-[10px] tracking-tight">Home</span>
            </Link>

            {/* 2. Explore */}
            <Link
              href="/explore"
              className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
                pathname === '/explore'
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Search
                className={`w-5 h-5 ${
                  pathname === '/explore' ? 'stroke-[2.8]' : 'stroke-[1.8]'
                }`}
              />
              <span className="text-[10px] tracking-tight">Explore</span>
            </Link>

            {/* 3. Elevated Purple Plus Button */}
            <Link
              href="/upload"
              prefetch={false}
              className="flex items-center justify-center -mt-6 p-1 group"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/35 group-active:scale-95 transition-transform ring-4 ring-white dark:ring-slate-900">
                <Plus className="w-6 h-6 stroke-[3]" />
              </div>
            </Link>

            {/* 4. Messages */}
            <Link
              href="/notifications"
              className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors relative ${
                pathname === '/notifications'
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="relative">
                <svg
                  className={`w-5 h-5 ${
                    pathname === '/notifications'
                      ? 'stroke-indigo-600 dark:stroke-indigo-400 fill-indigo-50 dark:fill-indigo-950/40'
                      : 'stroke-current fill-none'
                  }`}
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.75.75 0 01-.84-.84c.14-.94.46-1.84.94-2.64A7.857 7.857 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">Messages</span>
            </Link>

            {/* 5. Profile */}
            <Link
              href="/profile"
              className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors ${
                pathname === '/profile'
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User
                className={`w-5 h-5 ${
                  pathname === '/profile' ? 'stroke-[2.5]' : 'stroke-[1.8]'
                }`}
              />
              <span className="text-[10px] tracking-tight">Profile</span>
            </Link>
          </nav>
        )}
      </main>
    </div>
  );
}
