'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, User, Mail, Lock, GraduationCap, Briefcase, AlertCircle } from 'lucide-react';
import { DataStore } from '@/services/dataStore';
import { SupabaseService } from '@/services/supabaseService';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { UserRole } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    setTimeout(async () => {
      // Create user profile in storage
      const newUserId = `usr-${Date.now()}`;
      const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_');
      
      const newProfile = {
        id: newUserId,
        email,
        role,
        full_name: fullName,
        username,
        daily_goal_minutes: 30,
        is_private: false,
        is_discoverable: true,
        allow_org_contact: true,
        baseline_screen_time_mins: 180,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured()) {
        try {
          const supabase = createClient();
          await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName, username, role } }
          });
          await SupabaseService.syncProfile(newProfile);
        } catch {}
      }

      const profiles = DataStore.getProfiles();
      profiles.push(newProfile);
      localStorage.setItem('sb_profiles', JSON.stringify(profiles));
      DataStore.setCurrentUserId(newUserId);

      setIsLoading(false);
      if (role === 'student') {
        router.push('/feed');
      } else {
        router.push('/explore');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100">
      <PublicNavbar />

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30 mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Create your account
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Join SkillBridge to turn focus into real opportunities.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              I want to join as:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  role === 'student'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <GraduationCap className={`w-5 h-5 mb-1 ${role === 'student' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                <p className="text-xs font-bold text-slate-900 dark:text-white">Student / Talent</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Practice & unlock opportunities</p>
              </button>

              <button
                type="button"
                onClick={() => setRole('organization')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  role === 'organization'
                    ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/40 ring-2 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Briefcase className={`w-5 h-5 mb-1 ${role === 'organization' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                <p className="text-xs font-bold text-slate-900 dark:text-white">Organization</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Discover talent & post grants</p>
              </button>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Morgan"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password (min 8 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              id="submit-register-btn"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Creating account...' : 'Continue to Onboarding'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
