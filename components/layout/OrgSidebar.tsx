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
} from 'lucide-react';
import { RoleSwitcher } from './RoleSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { DataStore } from '@/services/dataStore';

const orgNavItems = [
  { label: 'Overview', href: '/org-dashboard', icon: LayoutDashboard },
  { label: 'Discover Talent', href: '/explore', icon: Users },
  { label: 'Selected Shortlist', href: '/saved', icon: BookmarkCheck },
  { label: 'Post Opportunity', href: '/post-opportunity', icon: PlusCircle },
  { label: 'Applications', href: '/org-applications', icon: FileCheck2 },
];

export function OrgSidebar() {
  const pathname = usePathname();
  const orgs = DataStore.getOrganizations();
  const currentOrg = orgs[0];

  return (
    <aside className="w-60 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] flex flex-col h-screen sticky top-0 z-40 select-none">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <Link href="/org-dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-[#0E0830] flex items-center justify-center text-white font-bold text-xs">
            S
          </div>
          <div>
            <span className="font-semibold text-sm text-slate-900 dark:text-white tracking-tight">
              SkillBridge
            </span>
            <p className="text-[10px] text-[#0E0830] dark:text-[#c4bbf0] font-semibold uppercase tracking-wider">
              Org Portal
            </p>
          </div>
        </Link>
        <ThemeToggle />
      </div>

      {/* Org Verification Card */}
      <div className="mx-3 my-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
          {currentOrg?.name || 'Creative Arts University'}
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Verified Organization Partner
        </p>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {orgNavItems.map((item) => {
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

      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <RoleSwitcher />
      </div>
    </aside>
  );
}
