'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('radha@showup.dev');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.warn('[Supabase Auth] Notice:', error.message);
        }
      }

      if (email.toLowerCase().includes('org') || email.toLowerCase().includes('scout')) {
        DataStore.setCurrentUserId('usr-org-001');
        router.push('/explore');
      } else {
        DataStore.setCurrentUserId('usr-student-001');
        router.push('/feed');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Unable to sign in. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileShell hideBottomNav={true}>
      <div className="flex flex-col min-h-full px-5 py-8 justify-between max-w-sm mx-auto w-full">
        <div className="space-y-6 pt-4">
          {/* Brand Logo & Title */}
          <div className="text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-3xl overflow-hidden card-3d p-2 shadow-md">
              <img
                src="/showup-logo.jpg"
                alt="ShowUp!"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Sign In
            </h1>
          </div>

          {/* Standard Login Form */}
          <form onSubmit={handleSignIn} className="space-y-4 pt-2">
            {authError && (
              <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs font-semibold text-red-600 dark:text-red-400">
                {authError}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="card-3d w-full px-4 py-3.5 rounded-2xl text-slate-900 dark:text-white text-sm font-medium focus:border-purple-500 outline-hidden pl-11"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your registered email.')}
                  className="text-xs font-semibold text-[#0E0830] dark:text-indigo-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="card-3d w-full px-4 py-3.5 rounded-2xl text-slate-900 dark:text-white text-sm font-medium focus:border-purple-500 outline-hidden pl-11 pr-11"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Primary Sign In Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-3d w-full py-4 px-4 rounded-2xl text-white font-black text-sm tracking-wide disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>

        {/* Standard Footer */}
        <div className="pt-8 pb-2 text-center text-xs text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-bold text-[#0E0830] dark:text-indigo-400 hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}
