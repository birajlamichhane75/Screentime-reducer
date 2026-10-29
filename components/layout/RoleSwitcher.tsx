'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataStore } from '@/services/dataStore';
import { Profile, UserRole } from '@/types';
import { Shield, Briefcase, GraduationCap, ChevronDown } from 'lucide-react';

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
      router.push('/dashboard');
    } else if (role === 'organization') {
      router.push('/org-dashboard');
    } else if (role === 'admin') {
      router.push('/admin');
    }
  };

  if (!currentUser) return null;

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="role-switcher-dropdown"
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 transition-colors shadow-xs"
        aria-expanded={isOpen}
      >
        {currentUser.role === 'student' && <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
        {currentUser.role === 'organization' && <Briefcase className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />}
        {currentUser.role === 'admin' && <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
        <span className="capitalize font-medium tracking-wide">
          Role: <strong className="font-bold">{currentUser.role}</strong> ({currentUser.full_name.split(' ')[0]})
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-2 animate-in fade-in zoom-in-95">
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Switch Active Persona
          </div>
          <div className="py-1 flex flex-col gap-1">
            <button
              onClick={() => handleRoleSelect('student')}
              className={`flex items-center gap-3 w-full px-3 py-2 text-xs rounded-xl text-left transition-colors ${
                currentUser.role === 'student'
                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold">Student / Talent</p>
                <p className="text-[11px] text-slate-400">Alex Morgan (Hobbyist)</p>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect('organization')}
              className={`flex items-center gap-3 w-full px-3 py-2 text-xs rounded-xl text-left transition-colors ${
                currentUser.role === 'organization'
                  ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold">Verified Organization</p>
                <p className="text-[11px] text-slate-400">Apex Tech Guild</p>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect('admin')}
              className={`flex items-center gap-3 w-full px-3 py-2 text-xs rounded-xl text-left transition-colors ${
                currentUser.role === 'admin'
                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold">Administrator</p>
                <p className="text-[11px] text-slate-400">Jordan Vance (Safety & Ops)</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
