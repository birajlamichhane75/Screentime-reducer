'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BadgeCheck,
  Mail,
  BookmarkCheck,
  Grid,
  CheckCircle2,
  X,
  Building2,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { ContactTalentModal } from '@/components/talent/ContactTalentModal';
import { VideoPost, Profile, WorkSelectionEmail } from '@/types';

function ProfileContent({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const username = resolvedParams.username;

  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [creatorProfile, setCreatorProfile] = useState<Profile | null>(null);
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [emailNotice, setEmailNotice] = useState<WorkSelectionEmail | null>(null);

  useEffect(() => {
    const user = DataStore.getCurrentUser();
    setCurrentUser(user);

    const allProfiles = DataStore.getProfiles();
    const found = allProfiles.find(
      (p) => p.username.toLowerCase() === username.toLowerCase()
    );

    if (found) {
      setCreatorProfile(found);
      const userVids = DataStore.getVideosByCreator(found.id);
      setVideos(userVids.length > 0 ? userVids : DataStore.getVideos().slice(0, 3));
      setIsSaved(DataStore.isCreatorSaved(user.id, found.id));
    } else {
      const vids = DataStore.getVideos();
      const matchVid = vids.find(
        (v) => v.creator.username.toLowerCase() === username.toLowerCase()
      );
      if (matchVid) {
        const generated: Profile = {
          id: matchVid.creator_id,
          email: matchVid.creator.email || `${matchVid.creator.username}@talent.skillbridge.dev`,
          username: matchVid.creator.username,
          full_name: matchVid.creator.full_name,
          avatar_url: matchVid.creator.avatar_url,
          bio: matchVid.creator.bio || 'Talented Creator showcasing work on SkillBridge.',
          location: matchVid.creator.location || 'United States',
          role: 'student',
          daily_goal_minutes: 45,
          is_private: false,
          is_discoverable: true,
          allow_org_contact: true,
          baseline_screen_time_mins: 180,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setCreatorProfile(generated);
        setVideos(vids.filter((v) => v.creator.username === username));
        setIsSaved(DataStore.isCreatorSaved(user.id, generated.id));
      }
    }
  }, [username]);

  const isOrg = currentUser?.role === 'organization';

  const handleToggleSelectCreator = () => {
    if (!creatorProfile || !currentUser) return;

    if (!isOrg) {
      alert('Only verified organizations can shortlist or select talent. Switch to an Organization role to shortlist creators.');
      return;
    }

    const added = DataStore.toggleSaveCreator(currentUser.id, creatorProfile.id);
    setIsSaved(added);

    if (added && videos.length > 0) {
      // Send selection email for their featured work
      const featured = videos[0];
      const result = DataStore.selectWork({
        orgId: currentUser.id,
        orgName: currentUser.full_name || 'Creative Arts University',
        videoId: featured.id,
        notes: `Selected profile and portfolio of @${creatorProfile.username}`,
      });
      if (result.emailSent) {
        setEmailNotice(result.emailSent);
      }
    } else {
      setEmailNotice(null);
    }
  };

  const recipientEmail =
    creatorProfile?.email || `${creatorProfile?.username || 'talent'}@talent.skillbridge.dev`;

  return (
    <MobileShell>
      <div className="flex flex-col min-h-full px-4 pt-3 pb-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 -ml-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-xs text-slate-800 dark:text-white">
            @{username}
          </span>
          <div className="w-6" />
        </div>

        {/* Email Dispatched Toast */}
        {emailNotice && (
          <div className="mb-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-2 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Creator Shortlisted & Email Sent
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Notification delivered to <strong>{emailNotice.recipient_email}</strong>.
                </p>
              </div>
            </div>
            <button
              onClick={() => setEmailNotice(null)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Profile Card */}
        <div className="flex items-center gap-4 py-2">
          {/* Avatar */}
          <img
            src={
              creatorProfile?.avatar_url ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
            }
            alt={creatorProfile?.full_name || 'Creator'}
            className="w-16 h-16 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />

          {/* Meaningful Purpose Metrics: Works Shared & Org Selections (NO followers/following) */}
          <div className="flex-1 grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                {videos.length || 1}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Works Shared
              </p>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <p className="text-base font-semibold text-[#0E0830] dark:text-[#c4bbf0]">
                {(creatorProfile as any)?.selected_works_count || 2}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Org Selections
              </p>
            </div>
          </div>
        </div>

        {/* Name, Handle, Bio */}
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm font-semibold text-slate-900 dark:text-white">
              {creatorProfile?.full_name || username}
            </h1>
            <BadgeCheck className="w-3.5 h-3.5 text-[#0E0830] dark:text-[#c4bbf0]" />
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">@{username}</p>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
            {creatorProfile?.bio ||
              'Acoustic Guitarist & Singer-Songwriter 🎸 Music is my language.'}
          </p>

          <p className="text-[11px] text-slate-400 pt-1">
            Contact email: <span className="text-slate-600 dark:text-slate-300">{recipientEmail}</span>
          </p>
        </div>

        {/* Organization Actions: Contact Talent & Select Creator */}
        {isOrg ? (
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="flex-1 py-2 px-3 rounded-lg bg-[#0E0830] hover:bg-[#1a1147] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Talent</span>
            </button>
            <button
              onClick={handleToggleSelectCreator}
              className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                isSaved
                  ? 'border-[#0E0830] bg-[#0E0830] text-white shadow-xs'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <BookmarkCheck className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
              <span>{isSaved ? 'Shortlisted' : 'Shortlist'}</span>
            </button>
          </div>
        ) : (
          <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center text-[11px] text-slate-500 dark:text-slate-400">
            Discoverable Talent Portfolio · Verified on SkillBridge
          </div>
        )}

        {/* 3-Column Video Thumbnail Grid (NO like counts) */}
        <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-3">
          <div className="flex items-center justify-between pb-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5 text-slate-400" />
              <span>Shared Works</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {videos.map((vid) => (
              <Link
                key={vid.id}
                href={`/video/${vid.id}`}
                className="relative aspect-3/4 rounded-lg overflow-hidden bg-slate-900 group"
              >
                <img
                  src={vid.thumbnail_url}
                  alt={vid.title || 'Work'}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-mono">
                  {vid.duration_formatted || '01:00'}
                </span>
                {vid.is_selected_by_org && (
                  <span className="absolute bottom-1.5 left-1.5 p-1 rounded bg-[#0E0830] text-white">
                    <BookmarkCheck className="w-3 h-3" />
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Talent Modal */}
      {creatorProfile && (
        <ContactTalentModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          creator={{
            id: creatorProfile.id,
            username: creatorProfile.username,
            full_name: creatorProfile.full_name,
            avatar_url: creatorProfile.avatar_url,
          }}
        />
      )}
    </MobileShell>
  );
}

export default function UserPublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs">Loading profile...</div>}>
      <ProfileContent params={params} />
    </React.Suspense>
  );
}
