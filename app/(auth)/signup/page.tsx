'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ArrowLeft, User, Building2, CheckCircle2 } from 'lucide-react';
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
      <div className="flex flex-col min-h-full px-6 py-4 justify-between">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
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
          <div className="space-y-1.5 text-center pt-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              How do you want to <br />
              use SkillBridge?
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Choose your role to get started
            </p>
          </div>

          {/* Role Cards */}
          <div className="space-y-3.5 pt-4">
            {/* Creator Card */}
            <div
              onClick={() => handleContinue('creator')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center space-y-3 ${
                selectedRole === 'creator'
                  ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 shadow-md shadow-indigo-600/10'
                  : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <User className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  I'm a Creator
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[200px]">
                  Showcase my skills, post talent videos, and get discovered.
                </p>
              </div>
            </div>

            {/* Organization Card */}
            <div
              onClick={() => handleContinue('organization')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center text-center space-y-3 ${
                selectedRole === 'organization'
                  ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 shadow-md shadow-indigo-600/10'
                  : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-white dark:bg-slate-900'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  I'm an Organization
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[200px]">
                  Discover talented people, universities, clubs, and scouting partners.
                </p>
              </div>
            </div>
          </div>
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

export default function SignupRoleSelectionPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-xs">Loading...</div>}>
      <SignupRoleSelectionContent />
    </React.Suspense>
  );
}
