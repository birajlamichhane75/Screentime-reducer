'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Shield,
  Eye,
  LogOut,
  CheckCircle2,
  Bell,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { Profile } from '@/types';

export default function MobileSettingsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [email, setEmail] = useState('');
  const [isDiscoverable, setIsDiscoverable] = useState(true);
  const [allowOrgContact, setAllowOrgContact] = useState(true);
  const [emailSavedToast, setEmailSavedToast] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const user = DataStore.getCurrentUser();
    setCurrentUser(user);
    setEmail(user.email || `${user.username}@talent.showup.dev`);
    setIsDiscoverable(user.is_discoverable ?? true);
    setAllowOrgContact(user.allow_org_contact ?? true);

    const saved = localStorage.getItem('sb_theme');
    if (saved === 'dark') {
      setCurrentTheme('dark');
    } else {
      setCurrentTheme('light');
    }
  }, []);

  const handleSelectTheme = (theme: 'light' | 'dark') => {
    setCurrentTheme(theme);
    localStorage.setItem('sb_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    DataStore.updateProfile(currentUser.id, { email: email.trim() });
    setEmailSavedToast(true);
    setTimeout(() => setEmailSavedToast(false), 2500);
  };

  const handleToggleDiscoverable = () => {
    const nextVal = !isDiscoverable;
    setIsDiscoverable(nextVal);
    if (currentUser) {
      DataStore.updateProfile(currentUser.id, { is_discoverable: nextVal });
    }
  };

  const handleToggleOrgContact = () => {
    const nextVal = !allowOrgContact;
    setAllowOrgContact(nextVal);
    if (currentUser) {
      DataStore.updateProfile(currentUser.id, { allow_org_contact: nextVal });
    }
  };

  const handleSignOut = () => {
    router.push('/login');
  };

  return (
    <MobileShell hideBottomNav={true}>
      <div className="flex flex-col min-h-full px-4 py-4 justify-between">
        <div className="space-y-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-1">
            <Link
              href="/profile"
              className="p-1.5 -ml-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-semibold text-xs text-slate-900 dark:text-white">
              Account &amp; Settings
            </h1>
            <div className="w-6" />
          </div>

          {/* Account Profile Card */}
          {currentUser && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center gap-3">
              <img
                src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser.full_name}
                className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  {currentUser.full_name}
                </p>
                <p className="text-[11px] text-slate-400">@{currentUser.username}</p>
                <span className="inline-block mt-0.5 text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.2 rounded bg-[#0E0830]/10 text-[#0E0830] dark:text-[#c4bbf0]">
                  {currentUser.role}
                </span>
              </div>
            </div>
          )}

          {/* Theme & Appearance Switcher */}
          <div className="space-y-2 pt-1">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Theme &amp; Appearance
            </h2>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectTheme('light')}
                className={`p-3 rounded-xl border flex flex-col items-start gap-1.5 transition-all text-left ${
                  currentTheme === 'light'
                    ? 'border-[#0E0830] bg-[#0E0830]/5 dark:bg-[#0E0830]/30 text-slate-900 dark:text-white shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Sun className={`w-4 h-4 ${currentTheme === 'light' ? 'text-[#0E0830] dark:text-[#c4bbf0]' : 'text-slate-400'}`} />
                  {currentTheme === 'light' && (
                    <span className="text-[10px] font-semibold text-[#0E0830] dark:text-[#c4bbf0]">Active</span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold">Light Theme</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Clean, bright porcelain &amp; slate
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTheme('dark')}
                className={`p-3 rounded-xl border flex flex-col items-start gap-1.5 transition-all text-left ${
                  currentTheme === 'dark'
                    ? 'border-[#0E0830] bg-[#0E0830]/5 dark:bg-[#0E0830]/30 text-slate-900 dark:text-white shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Moon className={`w-4 h-4 ${currentTheme === 'dark' ? 'text-[#0E0830] dark:text-[#c4bbf0]' : 'text-slate-400'}`} />
                  {currentTheme === 'dark' && (
                    <span className="text-[10px] font-semibold text-[#0E0830] dark:text-[#c4bbf0]">Active</span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold">Dark Theme</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Soothing obsidian &amp; slate
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Notification Email Settings */}
          <div className="space-y-2 pt-1">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Notification Email
            </h2>

            <form onSubmit={handleSaveEmail} className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#0E0830] dark:text-[#c4bbf0]" />
                  <span>Account Email for Work Selections</span>
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Whenever an organization selects or shortlists your work, an official email notification will be sent here.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-name@example.com"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-hidden focus:border-[#0E0830]"
                  required
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-[#0E0830] hover:bg-[#1a1147] text-white text-xs font-medium transition-colors"
                >
                  Save
                </button>
              </div>

              {emailSavedToast && (
                <p className="text-[11px] text-[#0E0830] dark:text-[#c4bbf0] font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-[#0E0830] dark:text-[#c4bbf0]" />
                  Email preference updated!
                </p>
              )}
            </form>
          </div>

          {/* Discovery Settings */}
          <div className="space-y-2 pt-1">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Organization Discovery
            </h2>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5 max-w-[240px]">
                  <p className="text-xs font-medium text-slate-900 dark:text-white">
                    Discoverable Work
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Allow verified universities and companies to discover your work.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleDiscoverable}
                  className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                    isDiscoverable ? 'bg-[#0E0830]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isDiscoverable ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5 max-w-[240px]">
                  <p className="text-xs font-medium text-slate-900 dark:text-white">
                    Organization Inquiries
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Allow organizations to send you direct invitations and opportunities.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleOrgContact}
                  className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                    allowOrgContact ? 'bg-[#0E0830]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      allowOrgContact ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="pt-6">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </MobileShell>
  );
}
