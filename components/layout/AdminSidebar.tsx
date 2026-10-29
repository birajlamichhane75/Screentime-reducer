'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  Building,
  CheckCircle2,
  Trophy,
  Compass,
  AlertTriangle,
  BarChart3,
  Users,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { RoleSwitcher } from './RoleSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { DataStore } from '@/services/dataStore';

const adminNavItems = [
  { label: 'Platform Overview', href: '/admin', icon: ShieldAlert },
  { label: 'Verification Requests', href: '/admin/verification-requests', icon: CheckCircle2, badge: '1 Pending' },
  { label: 'Organizations', href: '/admin/organizations', icon: Building },
  { label: 'User Accounts', href: '/admin/users', icon: Users },
  { label: 'Opportunity Moderation', href: '/admin/opportunities', icon: Compass },
  { label: 'Challenges Engine', href: '/admin/challenges', icon: Trophy },
  { label: 'Skills & Hobbies', href: '/admin/skills', icon: Sparkles },
  { label: 'Safety & Content Reports', href: '/admin/reports', icon: AlertTriangle },
  { label: 'Platform Analytics', href: '/admin/analytics', icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const orgs = DataStore.getOrganizations();
  const pendingCount = orgs.filter((o) => o.verification_status === 'pending').length;

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-screen sticky top-0 z-40 select-none">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-500 flex items-center justify-center text-white shadow-sm shadow-amber-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
              Skill<span className="text-amber-600 dark:text-amber-400">Bridge</span>
            </span>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
              Admin Ops
            </p>
          </div>
        </Link>
        <ThemeToggle />
      </div>

      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const badgeText = item.href === '/admin/verification-requests' && pendingCount > 0
            ? `${pendingCount} Pending`
            : item.badge;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {badgeText && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {badgeText}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

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
