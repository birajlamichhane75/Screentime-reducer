'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  BookmarkCheck,
  Send,
  Mail,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { DataStore } from '@/services/dataStore';
import { Profile, Project, WorkSelectionEmail } from '@/types';

export default function DiscoverTalentPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [talents, setTalents] = useState<Profile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [emailNotice, setEmailNotice] = useState<string | null>(null);
  const [invitedId, setInvitedId] = useState<string | null>(null);

  useEffect(() => {
    const user = DataStore.getCurrentUser();
    setCurrentUser(user);

    const profiles = DataStore.getProfiles()
      .filter((p) => p.role === 'student' && p.is_discoverable && !p.is_private)
      .sort((a, b) => (b.consistency_rating ?? 2.0) - (a.consistency_rating ?? 2.0));
    setTalents(profiles);
    setProjects(DataStore.getProjects());

    const saved = DataStore.getSavedCreators(user.id);
    setShortlistedIds(saved.map((s) => s.creator_id));
  }, []);

  const handleToggleShortlist = (talent: Profile) => {
    if (!currentUser) return;
    const added = DataStore.toggleSaveCreator(currentUser.id, talent.id);

    setShortlistedIds((prev) =>
      added ? [...prev, talent.id] : prev.filter((id) => id !== talent.id)
    );

    if (added) {
      const email = talent.email || `${talent.username}@talent.skillbridge.dev`;
      // Send official selection email
      DataStore.selectWork({
        orgId: currentUser.id,
        orgName: currentUser.full_name || 'Creative Arts University',
        videoId: `creator-profile-${talent.id}`,
        notes: `Selected student profile for scouting pipeline`,
      });

      setEmailNotice(`Selected ${talent.full_name}! Notification email delivered to ${email}`);
      setTimeout(() => setEmailNotice(null), 4000);
    }
  };

  const handleSendInvite = (talent: Profile) => {
    DataStore.addNotification(
      talent.id,
      'Organization Opportunity Invitation',
      'An invitation to apply was sent to your account profile.',
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
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
          Discover Opted-In Talent
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Search student creators who have opted into portfolio discovery. Select standout candidates to shortlist them; an automated email notification is dispatched to their account email.
        </p>
      </div>

      {/* Email Dispatched Toast */}
      {emailNotice && (
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{emailNotice}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by student name, bio, or skill (e.g. Painting, Guitar, Soccer)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-hidden focus:border-[#0E0830]"
          />
        </div>
      </div>

      {/* Talent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTalent.map((talent) => {
          const userProjs = projects.filter((p) => p.user_id === talent.id);
          const isShortlisted = shortlistedIds.includes(talent.id);
          const talentEmail = talent.email || `${talent.username}@talent.skillbridge.dev`;

          return (
            <div
              key={talent.id}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={talent.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={talent.full_name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-semibold text-xs text-slate-900 dark:text-white">
                          {talent.full_name}
                        </h3>
                        {talent.consistency_rating && (
                          <span className="px-1.5 py-0.5 rounded-md bg-[#0E0830]/10 text-[#0E0830] dark:text-[#c4bbf0] border border-[#0E0830]/20 font-bold text-[9px] flex items-center gap-0.5">
                            <span>{talent.consistency_rating >= 95 ? '💎' : talent.consistency_rating >= 80 ? '🥇' : '🥈'}</span>
                            <span>{talent.consistency_rating}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        @{talent.username} · {talent.location}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleShortlist(talent)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors flex items-center gap-1 ${
                      isShortlisted
                        ? 'border-[#0E0830] bg-[#0E0830] text-white shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    title={isShortlisted ? 'Shortlisted' : 'Select & Shortlist'}
                  >
                    <BookmarkCheck className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-white' : ''}`} />
                    <span>{isShortlisted ? 'Selected' : 'Select'}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {talent.bio}
                </p>

                <p className="text-[10px] text-slate-400 pt-1">
                  Account Email: {talentEmail}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <Link
                  href={`/profile/${talent.username}`}
                  className="text-[#0E0830] dark:text-[#c4bbf0] font-medium hover:underline flex items-center gap-1"
                >
                  <span>View Portfolio</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <button
                  type="button"
                  onClick={() => handleSendInvite(talent)}
                  disabled={invitedId === talent.id}
                  className="px-3 py-1 rounded-md bg-[#0E0830] hover:bg-[#1a1147] text-white text-xs font-medium transition-colors"
                >
                  {invitedId === talent.id ? 'Invited ✓' : 'Invite to Apply'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
