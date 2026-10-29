'use client';

import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, Briefcase, Shield, Search, CheckCircle2 } from 'lucide-react';
import { DataStore } from '@/services/dataStore';
import { Profile } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setUsers(DataStore.getProfiles());
  }, []);

  const filtered = users.filter(
    (u) =>
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-3">
          <Users className="w-3.5 h-3.5" />
          <span>User Identity Supervision</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          User Accounts
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review registered talent, organizations, and administrator privileges across the platform.
        </p>
      </div>

      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
        {filtered.map((u) => (
          <div key={u.id} className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                  u.role === 'student'
                    ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600'
                    : u.role === 'organization'
                    ? 'bg-teal-100 dark:bg-teal-950 text-teal-600'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-600'
                }`}
              >
                {u.role === 'student' && <GraduationCap className="w-5 h-5" />}
                {u.role === 'organization' && <Briefcase className="w-5 h-5" />}
                {u.role === 'admin' && <Shield className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {u.full_name}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {u.role}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {u.email} &bull; {u.location || 'Location Not Specified'}
                </p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-400">
              <span className="block font-semibold text-slate-700 dark:text-slate-300">
                Target: {u.daily_goal_minutes}m/day
              </span>
              <span className="text-[10px]">Joined {formatDate(u.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
