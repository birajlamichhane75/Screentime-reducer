'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bookmark, User, Sparkles, ExternalLink } from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { SavedCreator } from '@/types';

export default function SavedTalentPage() {
  const router = useRouter();
  const [savedCreators, setSavedCreators] = useState<SavedCreator[]>([]);

  useEffect(() => {
    const currentUser = DataStore.getCurrentUser();
    const saved = DataStore.getSavedCreators(currentUser.id);
    setSavedCreators(saved);
  }, []);

  const handleToggleRemove = (creatorId: string) => {
    const currentUser = DataStore.getCurrentUser();
    DataStore.toggleSaveCreator(currentUser.id, creatorId);
    setSavedCreators((prev) => prev.filter((s) => s.creator_id !== creatorId));
  };

  return (
    <MobileShell>
      <div className="flex flex-col min-h-full px-4 pt-3 pb-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-3">
          <Link
            href="/discover"
            className="p-1.5 -ml-1.5 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold text-sm text-slate-900 dark:text-white">
            Saved Talent
          </h1>
          <div className="w-8" />
        </div>

        {/* Saved Talent List (Screen 12) */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {savedCreators.map((item) => {
            const creator = item.creator;
            const primaryCategory =
              creator.talent_categories?.[0] || 'Dance';

            return (
              <div
                key={item.id}
                className="py-3.5 flex items-center justify-between gap-3 group"
              >
                {/* Left: Avatar & Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={
                      creator.avatar_url ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                    }
                    alt={creator.full_name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {creator.full_name}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate">
                      @{creator.username}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="inline-block text-[9px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                        {primaryCategory}
                      </span>
                      <Link
                        href={`/profile/${creator.username}`}
                        className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-0.5"
                      >
                        <span>View Profile</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right: Active Bookmark Icon */}
                <button
                  onClick={() => handleToggleRemove(item.creator_id)}
                  title="Remove from saved talent"
                  className="p-2 rounded-full text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Bookmark className="w-5 h-5 fill-indigo-600" />
                </button>
              </div>
            );
          })}
        </div>

        {savedCreators.length === 0 && (
          <div className="py-20 text-center text-slate-400 space-y-2">
            <Bookmark className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              No saved creators yet.
            </p>
            <p className="text-[11px] max-w-xs mx-auto">
              Bookmark promising creators while browsing videos to easily contact them later.
            </p>
            <Link
              href="/discover"
              className="inline-block mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold shadow-xs"
            >
              Discover Talent
            </Link>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
