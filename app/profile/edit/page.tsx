'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, X, Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { Profile } from '@/types';

export default function EditProfilePage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('Sarah Johnson');
  const [username, setUsername] = useState('sarahdance');
  const [bio, setBio] = useState('Dancer | Choreographer | Dreamer. Turning passion into opportunities ✨');
  const [location, setLocation] = useState('New York, USA');
  const [categories, setCategories] = useState<string[]>(['Dance', 'Choreography', 'Fitness']);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const user = DataStore.getCurrentUser();
    if (user) {
      setFullName(user.full_name);
      setUsername(user.username);
      if (user.bio) setBio(user.bio);
      if (user.location) setLocation(user.location);
    }
  }, []);

  const handleRemoveCategory = (catToRemove: string) => {
    setCategories(categories.filter((c) => c !== catToRemove));
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryInput.trim()) return;
    if (!categories.includes(newCategoryInput.trim())) {
      setCategories([...categories, newCategoryInput.trim()]);
    }
    setNewCategoryInput('');
    setIsAddingCategory(false);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const currentUser = DataStore.getCurrentUser();
    DataStore.updateProfile(currentUser.id, {
      full_name: fullName,
      username: username,
      bio: bio,
      location: location,
    });

    setTimeout(() => {
      setIsSaving(false);
      router.push('/profile');
    }, 400);
  };

  return (
    <MobileShell hideBottomNav={true}>
      <div className="flex flex-col min-h-full px-5 py-4 justify-between">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-1">
            <Link
              href="/profile"
              className="p-2 -ml-2 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-sm text-slate-900 dark:text-white">
              Edit Profile
            </h1>
            <div className="w-8" />
          </div>

          {/* Profile Photo with Camera */}
          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative cursor-pointer group">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5" />
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSaveChanges} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-hidden resize-none"
              />
            </div>

            {/* Talent Categories with Tags */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Talent Categories
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                {categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold"
                  >
                    <span>{cat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(cat)}
                      className="hover:text-indigo-900 dark:hover:text-indigo-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {isAddingCategory ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={newCategoryInput}
                      onChange={(e) => setNewCategoryInput(e.target.value)}
                      placeholder="Category"
                      className="px-2 py-1 rounded-lg border border-indigo-400 bg-white dark:bg-slate-800 text-xs w-24 outline-hidden"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="px-2 py-1 bg-indigo-600 text-white rounded-lg text-xs"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-dashed border-indigo-400 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Category</span>
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Location (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
              />
            </div>
          </form>
        </div>

        {/* Save Changes Button */}
        <div className="pt-6">
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-semibold text-xs tracking-wide shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
          >
            {isSaving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </MobileShell>
  );
}
