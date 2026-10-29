'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ArrowLeft, Camera, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';

function SignupDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') === 'organization' ? 'organization' : 'creator';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    setLoading(true);

    setTimeout(() => {
      // In demo data store, if organization, switch to org, if creator switch to creator
      if (role === 'organization') {
        DataStore.setCurrentUserId('usr-org-001');
        router.push('/discover');
      } else {
        DataStore.setCurrentUserId('usr-student-001');
        router.push('/feed');
      }
    }, 400);
  };

  return (
    <MobileShell hideBottomNav={true}>
      <div className="flex flex-col min-h-full px-6 py-4 justify-between">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link
              href="/signup"
              className="p-2 -ml-2 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-1.5 font-bold text-sm text-slate-800 dark:text-white">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>SkillBridge</span>
            </div>
            <div className="w-8" />
          </div>

          {/* Heading */}
          <div className="space-y-1 text-center pt-1">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create Your Account
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
              Join as a {role}
            </p>
          </div>

          {/* Profile Photo Placeholder */}
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 relative group cursor-pointer hover:border-indigo-500 transition-colors">
              <User className="w-8 h-8 text-slate-400" />
              <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateAccount} className="space-y-3.5 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-semibold text-xs tracking-wide shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="pt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}

export default function SignupDetailsPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs">Loading...</div>}>
      <SignupDetailsContent />
    </React.Suspense>
  );
}
