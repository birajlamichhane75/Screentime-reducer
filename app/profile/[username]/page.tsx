'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Settings,
  MoreVertical,
  BadgeCheck,
  Play,
  Mail,
  Bookmark,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { ContactTalentModal } from '@/components/talent/ContactTalentModal';
import { VideoPost, Profile } from '@/types';

function ProfileContent({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const username = resolvedParams.username;

  const [creatorProfile, setCreatorProfile] = useState<Profile | null>(null);
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const allProfiles = DataStore.getProfiles();
    const found = allProfiles.find(
      (p) => p.username.toLowerCase() === username.toLowerCase()
    );

    if (found) {
      setCreatorProfile(found);
      const userVids = DataStore.getVideosByCreator(found.id);
      setVideos(userVids.length > 0 ? userVids : DataStore.getVideos().slice(0, 3));

      const currentUser = DataStore.getCurrentUser();
      setIsSaved(DataStore.isCreatorSaved(currentUser.id, found.id));
    } else {
      // Fallback
      const vids = DataStore.getVideos();
      const matchVid = vids.find(
        (v) => v.creator.username.toLowerCase() === username.toLowerCase()
      );
      if (matchVid) {
        setCreatorProfile({
          id: matchVid.creator_id,
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
        });
        setVideos(vids.filter((v) => v.creator.username === username));
      }
    }
  }, [username]);

  const handleToggleSave = () => {
    if (!creatorProfile) return;
    const currentUser = DataStore.getCurrentUser();
    const added = DataStore.toggleSaveCreator(currentUser.id, creatorProfile.id);
    setIsSaved(added);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <MobileShell>
      <div className="flex flex-col min-h-full px-4 pt-3 pb-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 -ml-1.5 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-xs text-slate-800 dark:text-white">
            @{username}
          </span>
          <button className="p-1.5 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Stats Header */}
        <div className="flex items-center justify-between gap-4 py-2">
          {/* Avatar */}
          <div className="relative">
            <img
              src={
                creatorProfile?.avatar_url ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
              }
              alt={creatorProfile?.full_name || 'Creator'}
              className="w-18 h-18 rounded-full object-cover ring-2 ring-indigo-600/30 p-0.5"
            />
          </div>

          {/* Stats: Videos | Followers | Following */}
          <div className="flex-1 flex items-center justify-around text-center">
            <div>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                {videos.length || 18}
              </p>
              <p className="text-[10px] text-slate-400">Videos</p>
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">18.1K</p>
              <p className="text-[10px] text-slate-400">Followers</p>
            </div>
            <div>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white">180</p>
              <p className="text-[10px] text-slate-400">Following</p>
            </div>
          </div>
        </div>

        {/* Name, Verified Badge & Bio */}
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-bold text-slate-900 dark:text-white">
              {creatorProfile?.full_name || username}
            </h1>
            <span title="Verified Creator">
              <BadgeCheck className="w-4 h-4 fill-indigo-600 text-white" />
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">@{username}</p>

          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
            {creatorProfile?.bio ||
              'Acoustic Guitarist & Singer-Songwriter 🎸 Music is my language.'}
          </p>
        </div>

        {/* Action Buttons: Contact Talent & Save */}
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Talent</span>
          </button>
          <button
            onClick={handleToggleSave}
            className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
              isSaved
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-indigo-600' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        {/* 3-Column Video Thumbnail Grid */}
        <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-3">
          <div className="grid grid-cols-3 gap-1.5">
            {videos.map((vid) => (
              <Link
                key={vid.id}
                href={`/video/${vid.id}`}
                className="relative aspect-3/4 rounded-lg overflow-hidden bg-slate-800 group"
              >
                <img
                  src={vid.thumbnail_url}
                  alt={vid.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5 text-[10px] font-bold text-white drop-shadow-xs">
                  <Play className="w-2.5 h-2.5 fill-white" />
                  <span>{formatNumber(vid.views_count)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

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

export default function DynamicUserProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs">Loading profile...</div>}>
      <ProfileContent params={params} />
    </React.Suspense>
  );
}
