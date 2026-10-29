'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Palette,
  Timer,
  Trophy,
  Briefcase,
  Award,
  Compass,
  FileCheck2,
  LineChart,
  Bell,
  Settings,
  Layers,
  BookmarkCheck,
} from 'lucide-react';
import { RoleSwitcher } from './RoleSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { DataStore } from '@/services/dataStore';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Talent Feed', href: '/feed', icon: Layers },
  { label: 'Explore Directory', href: '/explore', icon: Compass },
  { label: 'Selected Works', href: '/saved', icon: BookmarkCheck },
  { label: 'Focus & Practice', href: '/focus', icon: Timer },
  { label: 'My Portfolio', href: '/portfolio', icon: Briefcase },
  { label: 'Challenges', href: '/challenges', icon: Trophy },
  { label: 'Notifications & Emails', href: '/notifications', icon: Bell },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function StudentSidebar() {
  const pathname = usePathname();
  const currentUser = DataStore.getCurrentUser();

  return (
    <aside className="w-60 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] flex flex-col h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <Link href="/feed" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#0E0830] text-white flex items-center justify-center font-bold text-xs">
            S
          </div>
          <div>
            <span className="font-semibold text-sm text-slate-900 dark:text-white tracking-tight">
              SkillBridge
            </span>
          </div>
        </Link>
        <ThemeToggle />
      </div>

      {/* Account Info Pill */}
      <div className="mx-3 my-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
            {currentUser.full_name}
          </p>
          <p className="text-[10px] text-slate-400 truncate">
            {currentUser.email || `${currentUser.username}@talent.skillbridge.dev`}
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-slate-100 dark:bg-slate-800 text-[#0E0830] dark:text-white font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#0E0830] dark:text-[#c4bbf0]' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Role Switcher */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <RoleSwitcher />
      </div>
    </aside>
  );
}
