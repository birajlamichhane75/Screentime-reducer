'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ArrowLeft, Camera, User, Mail, Lock, Eye, EyeOff, Building2, Flame, ArrowRight, ShieldCheck } from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { SupabaseService } from '@/services/supabaseService';
import { Profile } from '@/types';

function SignupDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') === 'organization' ? 'organization' : 'creator';

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [category, setCategory] = useState('Dance');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) return;

    setLoading(true);
    setErrorMsg(null);

    const cleanUsername = username.trim().replace(/^@/, '') || email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newUserId = `usr-${Date.now()}`;

    const newProfile: Profile = {
      id: newUserId,
      email: email.trim(),
      role: role === 'organization' ? 'organization' : 'student',
      full_name: fullName.trim(),
      username: cleanUsername,
      avatar_url: role === 'organization'
        ? 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: role === 'organization'
        ? `Talent scouting partner specializing in ${category}. Connecting youth talent to grants & scholarships.`
        : `Gen Z Creator focusing on ${category}. Practicing daily and building consistency.`,
      location: 'United States',
      is_verified: true,
      consistency_rating: 65,
      upload_streak_days: 1,
      daily_goal_minutes: 45,
      is_private: false,
      is_discoverable: true,
      allow_org_contact: true,
      baseline_screen_time_mins: 180,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      // 1. If Supabase is configured, sign up via Supabase Auth & sync profile
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              username: cleanUsername,
              role: newProfile.role,
            },
          },
        });

        if (authError) {
          console.warn('[Supabase Auth] Notice:', authError.message);
        } else if (authData?.user) {
          console.log('[Supabase Auth] Registered user:', authData.user.id);
        }

        // Sync profile to Supabase database
        await SupabaseService.syncProfile(newProfile);
      }

      // 2. Add profile to local DataStore
      const profiles = DataStore.getProfiles();
      profiles.unshift(newProfile);
      localStorage.setItem('sb_profiles', JSON.stringify(profiles));
      DataStore.setCurrentUserId(newProfile.id);

      // 3. Route according to role
      if (role === 'organization') {
        router.push('/explore');
      } else {
        router.push('/feed');
      }
    } catch (err: any) {
      console.warn('Signup notice:', err.message);
      // Fallback seamlessly to local profile
      DataStore.setCurrentUserId(newProfile.id);
      if (role === 'organization') {
        router.push('/explore');
      } else {
        router.push('/feed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileShell hideBottomNav={true}>
      <div className="flex flex-col min-h-full px-5 py-6 justify-between max-w-md mx-auto w-full">
        <div className="space-y-5 pt-2">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link
              href="/signup"
              className="p-2 -ml-2 rounded-2xl text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {role === 'organization' ? (
                <>
                  <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Organization Portal</span>
                </>
              ) : (
                <>
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Gen Z Creator</span>
                </>
              )}
            </div>
            <div className="w-8" />
          </div>

          {/* Heading */}
          <div className="space-y-1 text-center pt-1">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-space">
              {role === 'organization' ? 'Register Organization' : 'Create Creator Profile'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {role === 'organization'
                ? 'Scout genuine youth talent & offer opportunities'
                : 'Turn your daily practice into real-world opportunities'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateAccount} className="space-y-3.5 pt-1">
            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400">
                {errorMsg}
              </div>
            )}

            {/* Full Name / Org Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {role === 'organization' ? 'Organization or University Name' : 'Full Name'}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={role === 'organization' ? 'e.g. Apex Tech Guild' : 'e.g. Sarah Johnson'}
                className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0E0830] outline-hidden"
                required
              />
            </div>

            {/* Username / Handle */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {role === 'organization' ? 'Organization Handle' : 'Creator Username'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-xs text-slate-400 font-bold">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder={role === 'organization' ? 'apextech' : 'sarahdance'}
                  className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0E0830] outline-hidden pl-8"
                  required
                />
              </div>
            </div>

            {/* Primary Activity / Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {role === 'organization' ? 'Primary Scouting Focus' : 'Creative Craft / Talent'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0E0830] outline-hidden"
              >
                <option value="Dance">Dance &amp; Choreography</option>
                <option value="Cooking">Cooking &amp; Culinary Arts</option>
                <option value="Sports">Soccer &amp; Athletics</option>
                <option value="Drawing">Drawing &amp; Art</option>
                <option value="Painting">Studio Painting</option>
                <option value="Singing">Singing &amp; Vocals</option>
                <option value="Music">Instrumental Music</option>
                <option value="Coding">Coding &amp; Software Tech</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {role === 'organization' ? 'Official Scout Email' : 'Email Address'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'organization' ? 'scout@organization.org' : 'creator@example.com'}
                  className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0E0830] outline-hidden pl-10"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full px-3.5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-[#0E0830] outline-hidden pl-10 pr-10"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 rounded-2xl bg-[#0E0830] hover:bg-[#1a1147] active:scale-98 text-white font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? (
                <span>Registering &bull; Syncing Supabase...</span>
              ) : (
                <>
                  <span>Join as {role === 'organization' ? 'Organization' : 'Gen Z Creator'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Realtime Supabase Badge */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encrypted Supabase Account &bull; Instant Scouting Access</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 pb-2 text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-[#0E0830] dark:text-indigo-400 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}

export default function SignupDetailsPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center text-xs font-bold">Loading...</div>}>
      <SignupDetailsContent />
    </React.Suspense>
  );
}
