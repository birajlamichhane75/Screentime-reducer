'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  Briefcase,
  BookmarkPlus,
  Send,
  Sparkles,
  MapPin,
  ExternalLink,
  Check,
} from 'lucide-react';
import { DataStore } from '@/services/dataStore';
import { Profile, Project, Skill } from '@/types';

export default function DiscoverTalentPage() {
  const [talents, setTalents] = useState<Profile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [invitedId, setInvitedId] = useState<string | null>(null);

  useEffect(() => {
    // Only return discoverable profiles
    const profiles = DataStore.getProfiles().filter(
      (p) => p.role === 'student' && p.is_discoverable && !p.is_private
    );
    setTalents(profiles);
    setProjects(DataStore.getProjects());
  }, []);

  const handleToggleShortlist = (userId: string) => {
    setShortlistedIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSendInvite = (talent: Profile) => {
    DataStore.addNotification(
      talent.id,
      'Organization Invitation to Apply!',
      'Apex Tech Guild scouted your discoverable portfolio and invited you to apply to the 2026 Creative Tech Fellowship!',
      'opportunity',
      '/opportunities/opp-01'
    );
    setInvitedId(talent.id);
    setTimeout(() => setInvitedId(null), 3000);
  };

  const filteredTalent = talents.filter((t) => {
    const userProjs = projects.filter((p) => p.user_id === t.id);
    const skillsDemonstrated = userProjs.flatMap((p) => p.skills_demonstrated);

    const matchesQuery =
      t.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skillsDemonstrated.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesQuery;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-3">
          <Users className="w-3.5 h-3.5" />
          <span>Talent Discovery Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Discover Opted-In Talent
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Search students who have opted into portfolio discovery. Review verifiable project evidence and invite high-fit candidates to apply.
        </p>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by student name, bio, or skill (e.g. Digital Painting, TypeScript)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Talent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTalent.map((talent) => {
          const userProjs = projects.filter((p) => p.user_id === talent.id);
          const isShortlisted = shortlistedIds.includes(talent.id);

          return (
            <div
              key={talent.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black text-base flex items-center justify-center shrink-0">
                      {talent.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {talent.full_name}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {talent.location} &bull; {talent.education_level}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleShortlist(talent.id)}
                    className={`p-2 rounded-xl text-xs font-semibold border transition-colors ${
                      isShortlisted
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-600'
                    }`}
                    title={isShortlisted ? 'Remove from shortlist' : 'Shortlist candidate'}
                  >
                    <BookmarkPlus className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {talent.bio}
                </p>

                {/* Portfolio Preview */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Verified Portfolio Artifacts ({userProjs.length})
                  </span>
                  {userProjs.slice(0, 2).map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div className="truncate pr-2">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {p.title}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          Skills: {p.skills_demonstrated.join(', ')}
                        </p>
                      </div>
                      {p.external_url && (
                        <a
                          href={p.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-600 dark:text-indigo-400 shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSendInvite(talent)}
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  {invitedId === talent.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Invitation Sent!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Invite to Apply</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
