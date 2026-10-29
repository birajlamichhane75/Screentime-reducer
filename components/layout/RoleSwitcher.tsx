'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataStore } from '@/services/dataStore';
import { Profile, UserRole } from '@/types';
import { Building2, GraduationCap, ChevronDown, Check } from 'lucide-react';

export function RoleSwitcher() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCurrentUser(DataStore.getCurrentUser());
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    const updated = DataStore.switchRole(role);
    setCurrentUser(updated);
    setIsOpen(false);

    if (role === 'student') {
      router.push('/feed');
    } else if (role === 'organization') {
      router.push('/org-dashboard');
    }
  };

  if (!currentUser) return null;

  const isOrg = currentUser.role === 'organization';

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="role-switcher-dropdown"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
        aria-expanded={isOpen}
      >
        {isOrg ? (
          <Building2 className="w-3.5 h-3.5 text-[#0E0830] dark:text-[#c4bbf0]" />
        ) : (
          <GraduationCap className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
        )}
        <span className="capitalize">
          {isOrg ? 'Organization' : 'Creator'}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-60 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg z-50 p-1.5 animate-in fade-in">
          <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
            Switch Perspective
          </div>

          <button
            onClick={() => handleRoleSelect('student')}
            className={`flex items-center justify-between w-full px-2.5 py-2 text-xs rounded-lg text-left transition-colors ${
              currentUser.role === 'student'
                ? 'bg-slate-100 dark:bg-slate-800 text-[#0E0830] dark:text-white font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 text-slate-500" />
              <div>
                <p className="font-medium text-xs">Talent Creator</p>
                <p className="text-[10px] text-slate-400">Share work peacefully, no vanity stats</p>
              </div>
            </div>
            {currentUser.role === 'student' && <Check className="w-3.5 h-3.5 text-[#0E0830] dark:text-[#c4bbf0]" />}
          </button>

          <button
            onClick={() => handleRoleSelect('organization')}
            className={`flex items-center justify-between w-full px-2.5 py-2 text-xs rounded-lg text-left transition-colors ${
              currentUser.role === 'organization'
                ? 'bg-slate-100 dark:bg-slate-800 text-[#0E0830] dark:text-white font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4 text-[#0E0830] dark:text-[#c4bbf0]" />
              <div>
                <p className="font-medium text-xs">Organization Scout</p>
                <p className="text-[10px] text-slate-400">Select work & notify creators via email</p>
              </div>
            </div>
            {currentUser.role === 'organization' && <Check className="w-3.5 h-3.5 text-[#0E0830] dark:text-[#c4bbf0]" />}
          </button>
        </div>
      )}
    </div>
  );
}
