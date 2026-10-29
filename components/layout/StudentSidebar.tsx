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
  Sparkles,
  LogOut,
  Flame,
} from 'lucide-react';
import { RoleSwitcher } from './RoleSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { DataStore } from '@/services/dataStore';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  isHot?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Hobbies', href: '/hobbies', icon: Palette },
  { label: 'Focus Mode', href: '/focus', icon: Timer, isHot: true },
  { label: 'Challenges', href: '/challenges', icon: Trophy, badge: 'Active' },
  { label: 'My Portfolio', href: '/portfolio', icon: Briefcase },
  { label: 'Rewards & Points', href: '/rewards', icon: Award },
  { label: 'Opportunities', href: '/opportunities', icon: Compass, badge: 'New' },
  { label: 'Applications', href: '/applications', icon: FileCheck2 },
  { label: 'Screen Time Impact', href: '/screen-time', icon: LineChart },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function StudentSidebar() {
  const pathname = usePathname();
  const currentUser = DataStore.getCurrentUser();
  const rewardEvents = DataStore.getRewardEvents(currentUser.id);
  const totalPoints = rewardEvents.reduce((sum, r) => sum + r.points, 0);

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-400 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
              Skill<span className="text-indigo-600 dark:text-indigo-400">Bridge</span>
            </span>
            <p className="text-[10px] text-slate-400 font-medium">Talent & Growth</p>
          </div>
        </Link>
        <ThemeToggle />
      </div>

      {/* Points & Level Micro-Card */}
      <div className="mx-3 my-3 p-3 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-teal-50/50 dark:from-indigo-950/40 dark:to-teal-950/20 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Achievement
            </p>
            <p className="text-sm font-black text-slate-900 dark:text-white">
              {totalPoints} <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">pts</span>
            </p>
          </div>
        </div>
        <Link
          href="/rewards"
          className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Ledger &rarr;
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.isHot ? 'text-amber-500' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile & Role Bar */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <RoleSwitcher />
          <Link
            href="/login"
            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
