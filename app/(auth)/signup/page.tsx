'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ArrowLeft, Flame, Building2, ArrowRight } from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';

function SignupRoleSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'org' ? 'organization' : 'creator';
  const [selectedRole, setSelectedRole] = useState<'creator' | 'organization'>(initialRole);

  const handleContinue = (role: 'creator' | 'organization') => {
    setSelectedRole(role);
    router.push(`/signup/details?role=${role}`);
  };

  return (
    <MobileShell hideBottomNav={true}>
      <div className="flex flex-col min-h-full px-5 py-6 justify-between max-w-md mx-auto w-full">
        <div className="space-y-6 pt-2">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-2xl text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-[#0E0830] dark:text-indigo-400" />
              <span>SkillBridge Auth</span>
            </div>
            <div className="w-8" />
          </div>

          {/* Heading */}
          <div className="space-y-1.5 text-center pt-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-space">
              Create Your Account
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Choose your profile type to customize your experience
            </p>
          </div>

          {/* Role Cards in Gen Z Style */}
          <div className="space-y-3.5 pt-2">
            {/* Gen Z Creator Card */}
            <div
              onClick={() => handleContinue('creator')}
              className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex flex-col space-y-3 group ${
                selectedRole === 'creator'
                  ? 'border-[#0E0830] dark:border-white bg-slate-50/80 dark:bg-slate-800/60 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Flame className="w-6 h-6" />
                </div>
                <span className="genz-badge bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-300/40">
                  ⚡ Gen Z Creator
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0E0830] dark:group-hover:text-indigo-300">
                  I&apos;m a Gen Z Creator
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Drop daily craft videos, build your consistency streak, unlock rating checkpoints, and get discovered by organizations directly.
                </p>
              </div>

              <div className="pt-1 flex items-center text-xs font-bold text-[#0E0830] dark:text-indigo-300 gap-1">
                <span>Start Practicing &bull; Gen Z Path</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Organization Card */}
            <div
              onClick={() => handleContinue('organization')}
              className={`p-5 rounded-3xl border-2 cursor-pointer transition-all flex flex-col space-y-3 group ${
                selectedRole === 'organization'
                  ? 'border-[#0E0830] dark:border-white bg-slate-50/80 dark:bg-slate-800/60 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="genz-badge bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-300/40">
                  🏢 Talent Scout
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0E0830] dark:group-hover:text-indigo-300">
                  I&apos;m an Organization / Scout
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Discover genuine youth talent, shortlist videos, dispatch scouting notifications, and offer scholarships or apprenticeships.
                </p>
              </div>

              <div className="pt-1 flex items-center text-xs font-bold text-[#0E0830] dark:text-indigo-300 gap-1">
                <span>Start Scouting &bull; Organization Path</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
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

export default function SignupRoleSelectionPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center text-xs font-bold">Loading...</div>}>
      <SignupRoleSelectionContent />
    </React.Suspense>
  );
}
