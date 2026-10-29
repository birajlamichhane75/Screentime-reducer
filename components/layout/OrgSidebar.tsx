'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  Users,
  FileCheck2,
  BookmarkCheck,
  Building2,
  Sparkles,
  LogOut,
  BadgeCheck,
} from 'lucide-react';
import { RoleSwitcher } from './RoleSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { DataStore } from '@/services/dataStore';

const orgNavItems = [
  { label: 'Overview', href: '/org-dashboard', icon: LayoutDashboard },
  { label: 'Post Opportunity', href: '/post-opportunity', icon: PlusCircle },
  { label: 'Manage Opportunities', href: '/manage-opportunities', icon: Briefcase },
  { label: 'Discover Talent', href: '/discover-talent', icon: Users, badge: 'Direct' },
  { label: 'Applications', href: '/org-applications', icon: FileCheck2 },
  { label: 'Shortlisted Talent', href: '/shortlist', icon: BookmarkCheck },
  { label: 'Organization Profile', href: '/org-profile', icon: Building2 },
];

export function OrgSidebar() {
  const pathname = usePathname();
  const orgs = DataStore.getOrganizations();
  const currentOrg = orgs[0];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-screen sticky top-0 z-40 select-none">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <Link href="/org-dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-teal-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
              Skill<span className="text-teal-600 dark:text-teal-400">Bridge</span>
            </span>
            <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider">
              Org Portal
            </p>
          </div>
        </Link>
        <ThemeToggle />
      </div>

      {/* Org Verification Status Indicator */}
      <div className="mx-3 my-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
            {currentOrg?.name || 'Apex Tech Guild'}
          </p>
          {currentOrg?.verification_status === 'verified' ? (
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              <BadgeCheck className="w-3 h-3" />
              Verified
            </span>
          ) : (
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
              Pending
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          {currentOrg?.verification_status === 'verified'
            ? 'Fully authorized to post and review talent.'
            : 'Awaiting admin verification before publishing.'}
        </p>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {orgNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/org-dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                  }`}
                >
                  {item.badge}
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
