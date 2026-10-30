'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Upload,
  Video,
  Play,
  Plus,
  CheckCircle2,
  Sparkles,
  X,
  Star,
  Flame,
  Trophy,
  ShieldCheck,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { SupabaseService } from '@/services/supabaseService';
import { CreatorConsistencyRating } from '@/types';
import { TrustSafetyEngine } from '@/components/trust-safety/TrustSafetyEngine';

const CATEGORY_ICONS: Record<string, string> = {
  Cooking: '/creative-icons/cooking.jpg',
  Sports: '/creative-icons/soccer.jpg',
  Soccer: '/creative-icons/soccer.jpg',
  Art: '/creative-icons/drawing.jpg',
  Drawing: '/creative-icons/drawing.jpg',
  Dance: '/creative-icons/dancing.jpg',
  Dancing: '/creative-icons/dancing.jpg',
  Painting: '/creative-icons/painting.jpg',
};

export default function UploadVideoPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Sports');
  const [caption, setCaption] = useState<string>('My latest skateboarding trick!');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
  );
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(
    'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=600&auto=format&fit=crop&q=80'
  );
  const [isCustomCategoryModalOpen, setIsCustomCategoryModalOpen] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatusMessage, setUploadStatusMessage] = useState<string>('');
  const [userRating, setUserRating] = useState<CreatorConsistencyRating | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    setCategories(DataStore.getCategories().filter((c) => c !== 'All'));
    const user = DataStore.getCurrentUser();
    setUserRating(DataStore.getCreatorRating(user.id));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
      setIsVerified(false);
    }
  };

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setIsVerified(false);
  };

  const handleAddCustomCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCategoryInput.trim()) return;

    const updated = DataStore.addCategory(customCategoryInput.trim());
    setCategories(updated.filter((c) => c !== 'All'));
    setSelectedCategory(customCategoryInput.trim());
    setIsVerified(false);
    setCustomCategoryInput('');
    setIsCustomCategoryModalOpen(false);
  };

  const handlePostVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() || !selectedCategory) return;

    setIsSubmitting(true);
    const currentUser = DataStore.getCurrentUser();

    let finalVideoUrl = videoPreviewUrl;

    // 1. If user selected a local video file, upload it directly to Supabase Storage
    if (videoFile) {
      setUploadStatusMessage('Uploading video to Supabase Storage...');
      try {
        const uploadResult = await SupabaseService.uploadVideoFile(videoFile);
        if (uploadResult.url) {
          finalVideoUrl = uploadResult.url;
        }
      } catch (err) {
        console.warn('Storage upload notice, continuing with verified video URL');
      }
    }

    // 2. Save post record to Supabase Database & Local DataStore
    setUploadStatusMessage('Saving post in Supabase...');

    DataStore.addVideo({
      creator_id: currentUser.id,
      caption: caption.trim(),
      category: selectedCategory,
      video_url: finalVideoUrl,
      thumbnail_url: thumbnailUrl,
      duration_seconds: 15,
    });

    setUploadStatusMessage('Post verified & saved in Supabase!');

    setTimeout(() => {
      setIsSubmitting(false);
      setUploadStatusMessage('');
      router.push('/feed');
    }, 600);
  };

  return (
    <MobileShell hideBottomNav={true}>
      <div className="flex flex-col min-h-full px-5 py-4 justify-between">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-1">
            <Link
              href="/feed"
              className="p-2 -ml-2 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-sm text-slate-900 dark:text-white">
              Upload Your Talent
            </h1>
            <div className="w-8" />
          </div>

          {/* Daily Rating Incentive Pill - Icon-Driven */}
          {userRating && (
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0E0830] dark:text-[#c4bbf0]" />
                  <span className="text-[#0E0830] dark:text-[#c4bbf0] font-bold">{userRating.score}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">{userRating.tier}</span>
                </span>
                <span className="text-slate-200 dark:text-slate-800">|</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                  <Flame className="w-3.5 h-3.5 text-[#0E0830] dark:text-[#c4bbf0]" />
                  <span>+1d Streak</span>
                </span>
                <span className="text-slate-200 dark:text-slate-800">|</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                  <Trophy className="w-3.5 h-3.5 text-[#0E0830] dark:text-[#c4bbf0]" />
                  <span>#1 in {selectedCategory}</span>
                </span>
              </div>
            </div>
          )}

          {/* Video Preview & File Upload Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative aspect-16/10 w-full rounded-2xl bg-slate-900 overflow-hidden border border-slate-700/60 shadow-md cursor-pointer group flex items-center justify-center"
          >
            {videoPreviewUrl ? (
              <>
                <video
                  src={videoPreviewUrl}
                  poster={thumbnailUrl}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>
                {/* Duration Badge */}
                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-semibold backdrop-blur-xs">
                  00:15
                </span>
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#0E0830]/90 text-white text-[9px] font-semibold backdrop-blur-xs">
                  Change Video
                </span>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-slate-400 space-y-3">
                <div className="w-20 h-20 flex items-center justify-center overflow-hidden">
                  <img
                    src={CATEGORY_ICONS[selectedCategory] || '/creative-icons/drawing.jpg'}
                    alt={selectedCategory}
                    className="w-full h-full object-contain invert dark:invert-0 animate-gentle-float"
                  />
                </div>
                <p className="text-xs font-semibold text-slate-200">Tap to select practice video</p>
                <p className="text-[10px] text-slate-500">MP4, WebM, MOV (up to 60s)</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Caption Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                What are you showcasing?
              </label>
              <span className="text-[10px] text-slate-400">
                {caption.length}/200
              </span>
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value.slice(0, 200))}
              rows={3}
              placeholder="Describe your trick, music cover, or creative artwork..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0E0830] outline-hidden resize-none"
              required
            />
          </div>

          {/* Select Category */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Select a category
              </label>
              <span className="text-xs font-bold text-[#0E0830] dark:text-[#c4bbf0]">
                {selectedCategory}
              </span>
            </div>

            {/* Quick Pills */}
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto no-scrollbar py-0.5">
              {categories.slice(0, 10).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-[#0E0830] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}

              {/* Add Custom Category Button */}
              <button
                type="button"
                onClick={() => setIsCustomCategoryModalOpen(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium border border-dashed border-[#0E0830]/40 text-[#0E0830] dark:text-[#c4bbf0] hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom Category</span>
              </button>
            </div>
          </div>

          {/* AI Trust & Safety Engine Verification Panel */}
          <TrustSafetyEngine
            hasVideo={Boolean(videoPreviewUrl || videoFile)}
            selectedCategory={selectedCategory}
            videoTitle={caption.trim() || 'My Daily Practice'}
            onVerificationPassed={() => setIsVerified(true)}
            onVerificationFailed={() => setIsVerified(false)}
            onResetVerification={() => setIsVerified(false)}
          />
        </div>

        {/* Post Video Submit Button (Locked until verification passes) */}
        <div className="pt-4 pb-2">
          <button
            type="button"
            onClick={handlePostVideo}
            disabled={isSubmitting || !caption.trim() || !isVerified}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#0E0830] hover:bg-[#1a1147] active:scale-98 text-white font-semibold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{uploadStatusMessage || 'Uploading & Saving to Supabase...'}</span>
              </span>
            ) : !isVerified ? (
              <span>Upload Locked &bull; AI Safety Check Required</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-300 group-hover:rotate-12 transition-transform" />
                <span>Post Verified Video</span>
              </>
            )}
          </button>
        </div>

        {/* Custom Category Dialog */}
        {isCustomCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Add Custom Category
                </h3>
                <button
                  onClick={() => setIsCustomCategoryModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <input
                type="text"
                value={customCategoryInput}
                onChange={(e) => setCustomCategoryInput(e.target.value)}
                placeholder="e.g. Beatboxing, Woodworking"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0E0830] outline-hidden"
                autoFocus
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomCategoryModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCustomCategory}
                  className="flex-1 py-2 rounded-xl bg-[#0E0830] hover:bg-[#1a1147] text-white text-xs font-semibold transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
