'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Settings,
  Shield,
  Bell,
  Eye,
  LogOut,
  Moon,
  Sun,
  Laptop,
  CheckCircle2,
  User,
  Building2,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { Profile } from '@/types';

export default function MobileSettingsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [isDiscoverable, setIsDiscoverable] = useState(true);
  const [allowOrgContact, setAllowOrgContact] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const user = DataStore.getCurrentUser();
    setCurrentUser(user);
    setIsDiscoverable(user.is_discoverable ?? true);
    setAllowOrgContact(user.allow_org_contact ?? true);
  }, []);

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
      <div className="flex flex-col min-h-full px-5 py-4 justify-between">
        <div className="space-y-5">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-1">
            <Link
              href="/profile"
              className="p-2 -ml-2 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-sm text-slate-900 dark:text-white">
              Settings
            </h1>
            <div className="w-8" />
          </div>

          {/* Account Card */}
          {currentUser && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <img
                src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser.full_name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentUser.full_name}
                </p>
                <p className="text-[11px] text-slate-400">@{currentUser.username}</p>
                <span className="inline-block mt-1 text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                  {currentUser.role}
                </span>
              </div>
            </div>
          )}

          {/* Privacy & Discovery Settings */}
          <div className="space-y-3 pt-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Privacy & Discovery
            </h2>

            <div className="space-y-2">
              {/* Discoverable Portfolio */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5 max-w-[240px]">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    Discoverable Talent
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Allow verified organizations to find your talent videos in discovery.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleDiscoverable}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    isDiscoverable ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      isDiscoverable ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Allow Organization Contact */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5 max-w-[240px]">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    Organization Invitations
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Receive direct opportunity and audition requests from universities.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleOrgContact}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    allowOrgContact ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      allowOrgContact ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2 pt-2">
            <Link
              href="/profile/edit"
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between"
            >
              <span>Edit Profile Details</span>
              <span className="text-slate-400">→</span>
            </Link>

            <Link
              href="/feed"
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between"
            >
              <span>Switch to Video Feed</span>
              <span className="text-slate-400">→</span>
            </Link>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="pt-6">
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full py-3 px-4 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </MobileShell>
  );
}
