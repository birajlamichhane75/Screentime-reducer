'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Share2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  BadgeCheck,
  BookmarkCheck,
  Mail,
  Info,
  CheckCircle2,
  X,
  Building2,
  ChevronRight,
  Sparkles,
  Plus,
  Flame,
  Trophy,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { VideoPost, Profile, WorkSelectionEmail, CreatorConsistencyRating } from '@/types';
import { ContactTalentModal } from '@/components/talent/ContactTalentModal';

export default function CreatorHomePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [videos, setVideos] = useState<VideoPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedWorkNotice, setSelectedWorkNotice] = useState<{
    show: boolean;
    email?: WorkSelectionEmail;
    workTitle: string;
    recipientEmail: string;
  } | null>(null);
  const [viewEmailModal, setViewEmailModal] = useState<WorkSelectionEmail | null>(null);
  const [selectionState, setSelectionState] = useState<Record<string, boolean>>({});
  const [userRating, setUserRating] = useState<CreatorConsistencyRating | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const user = DataStore.getCurrentUser();
    setCurrentUser(user);
    setUserRating(DataStore.getCreatorRating(user.id));

    const cats = DataStore.getCategories();
    setCategories(cats);

    const allVids = DataStore.getVideos();
    setVideos(allVids);

    // Initialize selection states for current user (org)
    const initialSelections: Record<string, boolean> = {};
    allVids.forEach((v) => {
      initialSelections[v.id] = DataStore.isWorkSelected(user.id, v.id);
    });
    setSelectionState(initialSelections);

    DataStore.syncFromSupabase().then(() => {
      const refreshed = DataStore.getVideos();
      setVideos(refreshed);
      setCategories(DataStore.getCategories());
    });
  }, []);

  const isOrg = currentUser?.role === 'organization';

  const filteredVideos = (
    selectedCategory === 'All'
      ? videos
      : videos.filter(
          (v) =>
            v.category.toLowerCase() === selectedCategory.toLowerCase() ||
            v.creator.categories?.some((c) => c.toLowerCase() === selectedCategory.toLowerCase())
        )
  ).sort((a, b) => {
    const rA = a.creator?.consistency_rating ?? 2.0;
    const rB = b.creator?.consistency_rating ?? 2.0;
    if (rB !== rA) return rB - rA;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const currentVideo = filteredVideos[currentIndex] || filteredVideos[0] || videos[0];
  const nextVideo = filteredVideos[currentIndex + 1] || filteredVideos[0];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [currentIndex, currentVideo]);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
    setShowPlayIcon(true);
    setTimeout(() => setShowPlayIcon(false), 500);
  };

  /**
   * Organization selects work they like.
   * Dispatches email to the user's account email address.
   */
  const handleSelectWork = (e: React.MouseEvent, vid: VideoPost) => {
    e.stopPropagation();
    if (!currentUser) return;

    if (!isOrg) {
      // Gentle guidance if student clicks
      alert(
        'Work Selection is exclusively available for verified organizations to scout talent. Switch your role to Organization to select works.'
      );
      return;
    }

    const orgName = currentUser.full_name || 'Creative Arts University';
    const result = DataStore.selectWork({
      orgId: currentUser.id,
      orgName: orgName,
      videoId: vid.id,
    });

    setSelectionState((prev) => ({
      ...prev,
      [vid.id]: result.selected,
    }));

    if (result.selected && result.emailSent) {
      setSelectedWorkNotice({
        show: true,
        email: result.emailSent,
        workTitle: vid.title || vid.caption,
        recipientEmail: result.emailSent.recipient_email,
      });
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `SkillBridge - ${currentVideo?.creator.full_name}`,
        text: currentVideo?.caption,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Link copied to clipboard.');
    }
  };

  return (
    <MobileShell hideBottomNav={false}>
      <div className="flex flex-col min-h-full px-4 pt-3 pb-4">
        {/* Top Header - Simple & Clean */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
              {isOrg ? 'Scout Talent' : 'Creative Feed'}
            </h1>
            <span className="text-[11px] text-slate-400 font-normal">
              — Clean & Focused
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Link
              href="/explore"
              className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Explore directory"
            >
              <Search className="w-4 h-4 stroke-[1.8]" />
            </Link>
            <Link
              href="/notifications"
              className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4 stroke-[1.8]" />
            </Link>
          </div>
        </div>

        {/* Category Pills - Clean White & Blue */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2.5 mb-2">
          {categories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentIndex(0);
                }}
                className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#0E0830] text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Creator Consistency Rating - Minimal Icon Bar (0-100 DoorDash Scale) */}
        {!isOrg && userRating && (
          <Link
            href="/rating"
            className="mb-3 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs shadow-2xs hover:border-[#0E0830] dark:hover:border-[#c4bbf0] transition-colors"
          >
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="inline-flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                <span className="text-sm">
                  {userRating.tier === 'Platinum' && '💎'}
                  {userRating.tier === 'Gold' && '🥇'}
                  {userRating.tier === 'Silver' && '🥈'}
                  {userRating.tier === 'Bronze' && '🥉'}
                </span>
                <span className="text-xs font-bold text-[#0E0830] dark:text-[#c4bbf0]">
                  {userRating.score}
                </span>
                <span className="text-[10px] uppercase font-semibold text-slate-400">
                  {userRating.tier}
                </span>
              </div>

              <span className="text-slate-200 dark:text-slate-800">|</span>

              <div className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{userRating.streak_days}d</span>
              </div>

              <span className="text-slate-200 dark:text-slate-800">|</span>

              <div className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                <Trophy className="w-3.5 h-3.5 text-[#0E0830] dark:text-[#c4bbf0]" />
                <span>{userRating.checkpoint.perk}</span>
              </div>
            </div>

            <span
              onClick={(e) => {
                e.stopPropagation();
                router.push('/upload');
              }}
              className="ml-2 px-2 py-1 rounded-lg bg-[#0E0830] hover:bg-[#1a1147] text-white text-[10px] font-semibold transition-colors flex items-center gap-1 shadow-xs shrink-0"
              title="Upload Daily"
            >
              <Plus className="w-3 h-3" />
              <span>Upload</span>
            </span>
          </Link>
        )}

        {/* Organization Field Sort Indicator - Clean Icon First */}
        {isOrg && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-700 dark:text-slate-300">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Ranked by Upload Ratio (0–100)</span>
            </div>
            <span className="text-[10px] font-bold text-[#0E0830] dark:text-[#c4bbf0]">
              💎 Platinum First
            </span>
          </div>
        )}

        {/* Selected Work Notification Toast */}
        {selectedWorkNotice && selectedWorkNotice.show && (
          <div className="mb-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 animate-in fade-in shadow-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-900 dark:text-slate-100 space-y-0.5">
                <p className="font-semibold">
                  Work Selected! Notification Email Sent.
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  An email has been delivered to <strong>{selectedWorkNotice.recipientEmail}</strong> for &quot;{selectedWorkNotice.workTitle}&quot;.
                </p>
                {selectedWorkNotice.email && (
                  <button
                    onClick={() => setViewEmailModal(selectedWorkNotice.email!)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0E0830] dark:text-[#c4bbf0] hover:underline pt-0.5"
                  >
                    <span>Preview Sent Email</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedWorkNotice(null)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Video Card - Relaxing, Clean & Uncluttered */}
        {currentVideo ? (
          <div className="space-y-3">
            <div
              onClick={handleTogglePlay}
              className="relative w-full max-w-xl mx-auto aspect-4/5 sm:max-h-[64vh] rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-sm cursor-pointer group select-none"
            >
              <video
                ref={videoRef}
                src={currentVideo.video_url}
                poster={currentVideo.thumbnail_url}
                loop
                muted={isMuted}
                playsInline
                autoPlay
                className="w-full h-full object-cover"
              />

              {/* Top Controls: Sound & Duration */}
              <div className="absolute top-0 left-0 right-0 p-3.5 flex items-center justify-between bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="p-1.5 rounded-md bg-black/40 text-white hover:bg-black/60 backdrop-blur-xs pointer-events-auto transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                <span className="px-2 py-0.5 rounded-md bg-black/50 text-white text-[10px] font-medium tracking-wide">
                  {currentVideo.duration_formatted || '02:15'}
                </span>
              </div>

              {/* Play / Pause Indicator */}
              {showPlayIcon && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-white">
                    {isPlaying ? <Play className="w-5 h-5 fill-white ml-0.5" /> : <Pause className="w-5 h-5 fill-white" />}
                  </div>
                </div>
              )}

              {/* Right Action Rail (NO likes, NO comments, NO follower counters!) */}
              <div className="absolute right-3 bottom-14 z-20 flex flex-col items-center gap-3 pointer-events-auto">
                {/* Organization Select Work Button */}
                {isOrg ? (
                  <button
                    onClick={(e) => handleSelectWork(e, currentVideo)}
                    className={`flex flex-col items-center p-2 rounded-xl backdrop-blur-md transition-all ${
                      selectionState[currentVideo.id]
                        ? 'bg-[#0E0830] text-white shadow-md ring-2 ring-white/30'
                        : 'bg-black/50 text-white hover:bg-black/70'
                    }`}
                    title={selectionState[currentVideo.id] ? 'Work Selected' : 'Select Work'}
                  >
                    <BookmarkCheck className={`w-5 h-5 ${selectionState[currentVideo.id] ? 'fill-white text-white' : ''}`} />
                    <span className="text-[9px] font-semibold mt-1">
                      {selectionState[currentVideo.id] ? 'Selected' : 'Select'}
                    </span>
                  </button>
                ) : (
                  // For students: quiet status indicator if selected by an organization
                  currentVideo.is_selected_by_org && (
                    <div
                      className="p-2 rounded-xl bg-black/50 text-[#c4bbf0] flex flex-col items-center"
                      title="Shortlisted by verified organizations"
                    >
                      <BookmarkCheck className="w-5 h-5 fill-[#c4bbf0] text-[#c4bbf0]" />
                      <span className="text-[8px] font-medium mt-0.5 text-white/90">Curated</span>
                    </div>
                  )
                )}

                {/* Organization Contact Talent Button */}
                {isOrg && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsContactModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-black/50 text-white hover:bg-black/70 backdrop-blur-md flex flex-col items-center"
                    title="Send Opportunity Invitation"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="text-[9px] font-semibold mt-1">Contact</span>
                  </button>
                )}

                {/* Clean Share Button */}
                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl bg-black/50 text-white hover:bg-black/70 backdrop-blur-md flex flex-col items-center"
                  title="Share work link"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="text-[9px] font-semibold mt-1">Share</span>
                </button>
              </div>

              {/* Bottom Creator & Caption Info (NO follower counts, NO follow buttons) */}
              <div className="absolute bottom-3 left-3 right-16 z-20 text-white pointer-events-auto">
                <div className="flex items-center gap-1.5 mb-1">
                  <Link
                    href={`/profile/${currentVideo.creator.username}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 hover:underline"
                  >
                    <img
                      src={currentVideo.creator.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt={currentVideo.creator.full_name}
                      className="w-7 h-7 rounded-full object-cover border border-white/40"
                    />
                    <span className="font-semibold text-xs tracking-wide">
                      @{currentVideo.creator.username}
                    </span>
                  </Link>
                  {currentVideo.creator.is_verified && (
                    <BadgeCheck className="w-3.5 h-3.5 text-[#c4bbf0]" />
                  )}
                  <span className="text-[10px] text-white/70">·</span>
                  <span className="text-[10px] font-medium text-white/80">
                    {currentVideo.category}
                  </span>
                  {currentVideo.creator.consistency_rating && (
                    <span className="px-1.5 py-0.5 rounded-md bg-[#0E0830] text-white text-[9px] font-bold flex items-center gap-0.5 shadow-xs border border-white/20">
                      {currentVideo.creator.consistency_rating >= 95 ? '💎' : currentVideo.creator.consistency_rating >= 80 ? '🥇' : '🥈'}
                      <span>{currentVideo.creator.consistency_rating}</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-white/90 line-clamp-2 leading-relaxed font-normal drop-shadow-xs">
                  {currentVideo.caption}
                </p>

                {/* Organization Selection Badge (if shortlisted) */}
                {currentVideo.is_selected_by_org && (
                  <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0E0830]/90 border border-white/20 text-[10px] text-white font-medium">
                    <BookmarkCheck className="w-3 h-3 text-[#c4bbf0]" />
                    <span>Shortlisted by Organization</span>
                  </div>
                )}
              </div>
            </div>

            {/* Next Video Preview - Clean Line */}
            <div
              onClick={() => setCurrentIndex((prev) => (prev + 1) % filteredVideos.length)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-xs cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-800/80 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={nextVideo?.thumbnail_url}
                  alt={nextVideo?.title || 'Next'}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate">
                    {nextVideo?.title || nextVideo?.caption}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Next by @{nextVideo?.creator.username} · {nextVideo?.category}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#0E0830] dark:text-[#c4bbf0] shrink-0">
                Play Next →
              </span>
            </div>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 text-xs">
            No talent videos found in this category.
          </div>
        )}
      </div>

      {/* Email Delivery Inspection Modal */}
      {viewEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0E0830] dark:text-[#c4bbf0]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Delivered Email Confirmation
                </h3>
              </div>
              <button
                onClick={() => setViewEmailModal(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              <p>
                <strong className="text-slate-800 dark:text-slate-200">To:</strong>{' '}
                {viewEmailModal.recipient_email} ({viewEmailModal.recipient_name})
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">From:</strong>{' '}
                SkillBridge Opportunities &lt;notifications@skillbridge.dev&gt;
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">Subject:</strong>{' '}
                {viewEmailModal.subject}
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">Status:</strong>{' '}
                <span className="text-emerald-600 font-semibold">Delivered</span>
              </p>
            </div>

            <div className="max-h-56 overflow-y-auto whitespace-pre-wrap text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans p-3 bg-white dark:bg-slate-950 rounded-lg border border-slate-200/80 dark:border-slate-800">
              {viewEmailModal.body_text}
            </div>

            <button
              onClick={() => setViewEmailModal(null)}
              className="w-full py-2 rounded-lg bg-[#0E0830] hover:bg-[#1a1147] text-white text-xs font-semibold transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* Organization Contact Talent Modal */}
      {currentVideo && (
        <ContactTalentModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          creator={{
            id: currentVideo.creator_id,
            username: currentVideo.creator.username,
            full_name: currentVideo.creator.full_name,
            avatar_url: currentVideo.creator.avatar_url,
          }}
        />
      )}
    </MobileShell>
  );
}
