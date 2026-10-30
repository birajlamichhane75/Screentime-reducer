'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookmarkCheck,
  Mail,
  Share2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  BadgeCheck,
  CheckCircle2,
  X,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { VideoStorage } from '@/lib/videoStorage';
import { ContactTalentModal } from '@/components/talent/ContactTalentModal';
import { VideoPost, Profile, WorkSelectionEmail } from '@/types';

function VideoViewerContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const videoId = resolvedParams.id;

  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [video, setVideo] = useState<VideoPost | null>(null);
  const [playableUrl, setPlayableUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(12);
  const [duration, setDuration] = useState(30);
  const [isWorkSelected, setIsWorkSelected] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [emailNotice, setEmailNotice] = useState<WorkSelectionEmail | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const user = DataStore.getCurrentUser();
    setCurrentUser(user);

    const vid = DataStore.getVideoById(videoId) || DataStore.getVideos()[0];
    if (vid) {
      setVideo(vid);
      setIsWorkSelected(DataStore.isWorkSelected(user.id, vid.id));
      VideoStorage.resolvePlayableUrl(vid.id, vid.video_url).then((url) => {
        setPlayableUrl(url);
      });
    }
  }, [videoId]);

  const isOrg = currentUser?.role === 'organization';

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(Math.floor(videoRef.current.currentTime));
      if (videoRef.current.duration) {
        setDuration(Math.floor(videoRef.current.duration));
      }
    }
  };

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  /**
   * Organization selects work. Sends email to creator's registered email.
   */
  const handleToggleSelectWork = () => {
    if (!video || !currentUser) return;

    if (!isOrg) {
      alert(
        'Selecting works is an organization-exclusive feature for scouting and shortlisting talent. Switch to an Organization role to select works.'
      );
      return;
    }

    const orgName = currentUser.full_name || 'Creative Arts University';
    const result = DataStore.selectWork({
      orgId: currentUser.id,
      orgName: orgName,
      videoId: video.id,
    });

    setIsWorkSelected(result.selected);

    if (result.selected && result.emailSent) {
      setEmailNotice(result.emailSent);
    } else {
      setEmailNotice(null);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `ShowUp! - ${video?.creator.full_name}`,
        text: video?.caption,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Link copied to clipboard.');
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <MobileShell hideBottomNav={true}>
      <div className="flex flex-col min-h-full px-4 pt-3 pb-6">
        {/* Top Header Bar - Clean in both Light & Dark Theme */}
        <div className="flex items-center justify-between pb-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 -ml-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            {isOrg && (
              <span className="px-2 py-0.5 rounded-md bg-[#0E0830]/10 text-[#0E0830] dark:text-[#c4bbf0] border border-[#0E0830]/20 text-[10px] font-medium flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                Scouting View
              </span>
            )}
          </div>
        </div>

        {/* Email Delivered Confirmation Toast */}
        {emailNotice && (
          <div className="mb-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white flex items-start justify-between gap-3 shadow-xs animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <p className="font-semibold text-slate-900 dark:text-white">
                  Work Selected &amp; Email Dispatched
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Notification delivered to <strong>{emailNotice.recipient_email}</strong>.
                </p>
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="text-[11px] font-semibold text-[#0E0830] dark:text-[#c4bbf0] hover:underline pt-0.5"
                >
                  View Sent Email Content &rarr;
                </button>
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

        {/* Framed Video Player Card */}
        {video && (
          <div className="space-y-3">
            <div
              onClick={handleTogglePlay}
              className="relative w-full max-w-xl mx-auto aspect-4/5 sm:max-h-[60vh] rounded-2xl overflow-hidden bg-slate-950 cursor-pointer group select-none shadow-sm border border-slate-200/70 dark:border-slate-800"
            >
              <video
                ref={videoRef}
                src={playableUrl || video.video_url}
                poster={video.thumbnail_url?.startsWith('data:') ? video.thumbnail_url : undefined}
                loop
                muted={isMuted}
                playsInline
                autoPlay
                onTimeUpdate={handleTimeUpdate}
                className="w-full h-full object-cover"
              />

              {/* Top Controls Overlay */}
              <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="p-1.5 rounded-md bg-black/40 text-white hover:bg-black/60 backdrop-blur-xs pointer-events-auto transition-colors"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                <span className="px-2 py-0.5 rounded-md bg-black/50 text-white text-[10px] font-mono">
                  {formatSeconds(currentTime)} / {formatSeconds(duration)}
                </span>
              </div>

              {/* Right Action Rail (NO likes, comments, followers) */}
              <div className="absolute right-3 bottom-12 z-20 flex flex-col items-center gap-3">
                {/* Organization Select Work Button */}
                {isOrg && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSelectWork();
                    }}
                    className={`p-2.5 rounded-xl active:scale-110 transition-all backdrop-blur-md flex flex-col items-center ${
                      isWorkSelected
                        ? 'bg-[#0E0830] text-white shadow-md ring-2 ring-white/30'
                        : 'bg-black/50 text-white hover:bg-black/70'
                    }`}
                    title={isWorkSelected ? 'Work Selected' : 'Select Work'}
                  >
                    <BookmarkCheck className={`w-5 h-5 ${isWorkSelected ? 'fill-white text-white' : ''}`} />
                    <span className="text-[9px] font-semibold mt-0.5">
                      {isWorkSelected ? 'Selected' : 'Select'}
                    </span>
                  </button>
                )}

                {/* Organization Contact Button */}
                {isOrg && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsContactModalOpen(true);
                    }}
                    className="p-2.5 rounded-xl bg-black/50 text-white hover:bg-black/70 backdrop-blur-md active:scale-110 transition-transform flex flex-col items-center"
                    title="Send Opportunity"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="text-[9px] font-semibold mt-0.5">Contact</span>
                  </button>
                )}

                {/* Share Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
                  className="p-2.5 rounded-xl bg-black/50 text-white hover:bg-black/70 backdrop-blur-md active:scale-110 transition-transform flex flex-col items-center"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                  <span className="text-[9px] font-semibold mt-0.5">Share</span>
                </button>
              </div>

              {/* Bottom Video Play / Pause Bar */}
              <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTogglePlay();
                  }}
                  className="p-1 rounded-md bg-black/40 text-white hover:bg-black/60"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                </button>
              </div>
            </div>

            {/* Work Details & Creator Card (Adapts cleanly to Light & Dark Theme) */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <Link
                  href={`/profile/${video.creator.username}`}
                  className="flex items-center gap-2 hover:underline"
                >
                  <img
                    src={video.creator.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={video.creator.full_name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                      <span>{video.creator.full_name}</span>
                      {video.creator.is_verified && <BadgeCheck className="w-3.5 h-3.5 text-[#0E0830] dark:text-[#c4bbf0]" />}
                    </p>
                    <p className="text-[10px] text-slate-400">@{video.creator.username}</p>
                  </div>
                </Link>

                <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-[10px] font-medium text-[#0E0830] dark:text-[#c4bbf0]">
                  {video.category}
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                {video.caption}
              </p>

              {isWorkSelected && (
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0E0830]/10 text-[#0E0830] dark:text-[#c4bbf0] text-[10px] font-medium border border-[#0E0830]/20">
                    <BookmarkCheck className="w-3 h-3" />
                    <span>Shortlisted for Organization Opportunity</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sent Email Preview Modal */}
      {showEmailModal && emailNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0E0830] dark:text-[#c4bbf0]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Notification Email Preview
                </h3>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              <p>
                <strong>To:</strong> {emailNotice.recipient_email}
              </p>
              <p>
                <strong>Subject:</strong> {emailNotice.subject}
              </p>
            </div>

            <div className="max-h-56 overflow-y-auto whitespace-pre-wrap text-xs text-slate-700 dark:text-slate-300 leading-relaxed p-3 bg-white dark:bg-slate-950 rounded-lg border border-slate-200/80 dark:border-slate-800 font-sans">
              {emailNotice.body_text}
            </div>

            <button
              onClick={() => setShowEmailModal(false)}
              className="w-full py-2 rounded-lg bg-[#0E0830] hover:bg-[#1a1147] text-white text-xs font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Contact Talent Modal */}
      {video && (
        <ContactTalentModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          creator={{
            id: video.creator_id,
            username: video.creator.username,
            full_name: video.creator.full_name,
            avatar_url: video.creator.avatar_url,
          }}
        />
      )}
    </MobileShell>
  );
}

export default function VideoViewerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-xs text-slate-500">Loading video...</div>}>
      <VideoViewerContent params={params} />
    </React.Suspense>
  );
}
