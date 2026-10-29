'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Bookmark,
  Mail,
  Share2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  BadgeCheck,
  CheckCircle2,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { ContactTalentModal } from '@/components/talent/ContactTalentModal';
import { VideoPost } from '@/types';

function VideoViewerContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const videoId = resolvedParams.id;

  const [video, setVideo] = useState<VideoPost | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(12);
  const [duration, setDuration] = useState(30);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = DataStore.getVideoById(videoId) || DataStore.getVideos()[0];
    if (vid) {
      setVideo(vid);
      const currentUser = DataStore.getCurrentUser();
      setIsSaved(DataStore.isCreatorSaved(currentUser.id, vid.creator_id));
    }
  }, [videoId]);

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

  const handleToggleSave = () => {
    if (!video) return;
    const currentUser = DataStore.getCurrentUser();
    const added = DataStore.toggleSaveCreator(currentUser.id, video.creator_id);
    setIsSaved(added);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `SkillBridge - ${video?.creator.full_name}`,
        text: video?.caption,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Video link copied to clipboard!');
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <MobileShell hideBottomNav={true} darkFeed={true}>
      <div className="relative w-full h-full min-h-[720px] bg-black select-none overflow-hidden flex flex-col justify-between">
        {/* Top Header Overlay */}
        <div className="absolute top-0 left-0 right-0 z-30 pt-2 pb-3 px-4 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <button
            onClick={() => router.back()}
            className="p-1.5 -ml-1.5 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/70 backdrop-blur-md transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Fullscreen Video View */}
        <div
          onClick={handleTogglePlay}
          className="relative flex-1 w-full h-full bg-neutral-950 flex items-center justify-center cursor-pointer overflow-hidden"
        >
          {video && (
            <video
              ref={videoRef}
              src={video.video_url}
              poster={video.thumbnail_url}
              loop
              muted={isMuted}
              playsInline
              autoPlay
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-cover"
            />
          )}

          {/* Right Action Rail (Save, Contact, Share) - Screen 11 */}
          {video && (
            <div className="absolute right-3.5 bottom-24 z-20 flex flex-col items-center gap-5">
              {/* Save / Bookmark Button */}
              <div className="flex flex-col items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleSave();
                  }}
                  className={`p-3 rounded-full active:scale-125 transition-transform backdrop-blur-md ${
                    isSaved ? 'bg-indigo-600 text-white' : 'bg-black/50 text-white hover:bg-black/80'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
                </button>
                <span className="text-[10px] font-semibold text-white drop-shadow-md mt-1">
                  {isSaved ? 'Saved' : 'Save'}
                </span>
              </div>

              {/* Contact Button */}
              <div className="flex flex-col items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsContactModalOpen(true);
                  }}
                  className="p-3 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-md active:scale-125 transition-transform"
                >
                  <Mail className="w-5 h-5" />
                </button>
                <span className="text-[10px] font-semibold text-white drop-shadow-md mt-1">
                  Contact
                </span>
              </div>

              {/* Share Button */}
              <div className="flex flex-col items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
                  className="p-3 rounded-full bg-black/50 text-white hover:bg-black/80 backdrop-blur-md active:scale-125 transition-transform"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <span className="text-[10px] font-semibold text-white drop-shadow-md mt-1">
                  Share
                </span>
              </div>
            </div>
          )}

          {/* Bottom Left Creator, Follow button & Caption Overlay */}
          {video && (
            <div className="absolute bottom-16 left-4 right-20 z-20 text-white pointer-events-auto">
              <div className="flex items-center gap-2">
                <Link
                  href={`/profile/${video.creator.username}`}
                  onClick={(e) => e.stopPropagation()}
                  className="font-bold text-sm tracking-wide hover:underline drop-shadow-md"
                >
                  @{video.creator.username}
                </Link>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFollowing(!isFollowing);
                  }}
                  className={`px-3 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                    isFollowing
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>

              <p className="text-xs text-white/90 mt-1.5 line-clamp-2 drop-shadow-md leading-relaxed font-normal">
                {video.caption}
              </p>

              {/* Talent Category Chip */}
              <div className="mt-2 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-medium text-white shadow-xs">
                  <span>+</span>
                  <span>{video.category}</span>
                </span>
              </div>
            </div>
          )}

          {/* Bottom Playback Controls Bar (Screen 11) */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-white text-[11px] font-semibold pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleTogglePlay();
              }}
              className="p-1 rounded-full text-white/90 hover:text-white"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            {/* Time Indicator e.g. 00:12 / 00:30 */}
            <div className="text-xs text-white/90 font-mono tracking-wider drop-shadow-xs">
              {formatSeconds(currentTime)} / {formatSeconds(duration)}
            </div>
          </div>
        </div>
      </div>

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
    <React.Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white text-xs">Loading video...</div>}>
      <VideoViewerContent params={params} />
    </React.Suspense>
  );
}
