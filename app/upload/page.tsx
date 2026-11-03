'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Upload,
  Plus,
  Sparkles,
  X,
  RefreshCw,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { SupabaseService } from '@/services/supabaseService';
import { VideoStorage } from '@/lib/videoStorage';
import { CreatorConsistencyRating } from '@/types';
import { TrustSafetyEngine } from '@/components/trust-safety/TrustSafetyEngine';

export default function UploadVideoPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Sports');
  const [caption, setCaption] = useState<string>('Daily practice session ✨');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>(''); // No dummy video by default
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [isCustomCategoryModalOpen, setIsCustomCategoryModalOpen] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatusMessage, setUploadStatusMessage] = useState<string>('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    setCategories(DataStore.getCategories().filter((c) => c !== 'All'));
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
      setIsVerified(false);

      // Extract authentic real video frame as the thumbnail
      try {
        const realThumbnail = await VideoStorage.generateVideoThumbnail(file);
        if (realThumbnail) {
          setThumbnailUrl(realThumbnail);
        }
      } catch (err) {
        console.warn('Could not extract video thumbnail:', err);
      }
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
    if (!caption.trim() || !selectedCategory || !videoPreviewUrl) return;

    setIsSubmitting(true);
    const currentUser = DataStore.getCurrentUser();

    const newVideoId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `vid-${Date.now()}`;

    let finalVideoUrl = videoPreviewUrl;

    // 1. If user selected a local video file, store in browser IndexedDB so it always plays
    if (videoFile) {
      try {
        const localBlobUrl = await VideoStorage.saveVideoBlob(newVideoId, videoFile);
        if (localBlobUrl) {
          finalVideoUrl = localBlobUrl;
        }
      } catch (e) {
        console.warn('IndexedDB video cache notice:', e);
      }

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

    let finalThumbnail = thumbnailUrl;
    if (!finalThumbnail && videoFile) {
      try {
        finalThumbnail = await VideoStorage.generateVideoThumbnail(videoFile);
      } catch (err) {
        console.warn('Could not generate thumbnail on submit:', err);
      }
    }

    DataStore.addVideo({
      id: newVideoId,
      creator_id: currentUser.id,
      caption: caption.trim(),
      category: selectedCategory,
      video_url: finalVideoUrl,
      thumbnail_url: finalThumbnail,
      duration_seconds: 15,
    });

    setUploadStatusMessage('Video saved in Supabase!');

    setTimeout(() => {
      setIsSubmitting(false);
      setUploadStatusMessage('');
      router.push('/feed');
    }, 600);
  };

  return (
    <MobileShell hideBottomNav={true}>
      <div className="flex flex-col min-h-full px-5 py-5 justify-between space-y-6">
        <div className="space-y-5">
          {/* Top Header */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
            <Link
              href="/feed"
              className="p-1 -ml-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-black text-base text-slate-900 dark:text-white">
              Upload Video
            </h1>
            <div className="w-5" />
          </div>

          {/* Actual Selected Video Box (No dummy video by default) */}
          <div className="card-3d relative aspect-16/10 w-full rounded-3xl overflow-hidden flex items-center justify-center">
            {videoPreviewUrl ? (
              <div className="relative w-full h-full bg-slate-950">
                <video
                  src={videoPreviewUrl}
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-black/90 text-white text-xs font-bold backdrop-blur-md transition-all shadow-md flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Change</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-6 text-slate-400 space-y-3 cursor-pointer w-full h-full hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors group select-none"
              >
                <div className="w-24 h-24 rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-md flex items-center justify-center overflow-hidden border border-slate-200/80 dark:border-white/10 group-hover:scale-105 transition-transform p-1">
                  <img
                    src="/showup-hero.jpg"
                    alt="ShowUp! Practice"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center">
                  <span className="text-sm font-bold text-slate-900 dark:text-white block">
                    Select Practice Video
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Tap to choose from device
                  </span>
                </div>
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

          {/* Caption Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-900 dark:text-white block">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value.slice(0, 200))}
              rows={2}
              placeholder="Describe your creative work or mention organization..."
              className="card-3d w-full px-4 py-3 rounded-2xl text-slate-900 dark:text-white text-sm font-medium focus:border-purple-500 outline-hidden resize-none"
              required
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-900 dark:text-white">
                Category
              </label>
              <span className="text-sm font-bold text-[#0E0830] dark:text-indigo-400">
                {selectedCategory}
              </span>
            </div>

            {/* Quick Pills */}
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto no-scrollbar py-0.5">
              {categories.slice(0, 10).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleSelectCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-[#0E0830] text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setIsCustomCategoryModalOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold border border-dashed border-[#0E0830]/40 text-[#0E0830] dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Custom</span>
              </button>
            </div>
          </div>

          {/* AI Trust & Safety Check (Button opens modal with scan & verification) */}
          <TrustSafetyEngine
            hasVideo={Boolean(videoPreviewUrl)}
            videoPreviewUrl={videoPreviewUrl}
            selectedCategory={selectedCategory}
            videoTitle={caption.trim() || 'My Daily Practice'}
            isVerified={isVerified}
            onVerificationPassed={() => setIsVerified(true)}
            onVerificationFailed={() => setIsVerified(false)}
            onResetVerification={() => setIsVerified(false)}
          />
        </div>

        {/* Upload Video Submit Button (Locked until verification is approved) */}
        <div className="pt-2 pb-2">
          <button
            type="button"
            onClick={handlePostVideo}
            disabled={isSubmitting || !caption.trim() || !videoPreviewUrl || !isVerified}
            className="btn-3d w-full py-4 px-5 rounded-2xl text-white font-black text-sm tracking-wide flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{uploadStatusMessage || 'Saving to Supabase...'}</span>
              </span>
            ) : !isVerified ? (
              <span>Upload Video (AI Check Required)</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>Upload Video</span>
              </>
            )}
          </button>
        </div>

        {/* Custom Category Modal */}
        {isCustomCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="card-3d w-full max-w-xs rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  Add Category
                </h3>
                <button
                  onClick={() => setIsCustomCategoryModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <input
                type="text"
                value={customCategoryInput}
                onChange={(e) => setCustomCategoryInput(e.target.value)}
                placeholder="Category name..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0E0830] outline-hidden"
                autoFocus
              />

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCustomCategoryModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCustomCategory}
                  className="btn-3d flex-1 py-2.5 rounded-xl text-white text-xs font-bold"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
