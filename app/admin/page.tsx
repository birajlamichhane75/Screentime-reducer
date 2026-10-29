'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Building,
  CheckCircle2,
  Users,
  AlertTriangle,
  BarChart3,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  Trophy,
} from 'lucide-react';
import { DataStore } from '@/services/dataStore';
import { Organization, Profile, Opportunity } from '@/types';

export default function AdminOverviewPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    setOrgs(DataStore.getOrganizations());
    setUsers(DataStore.getProfiles());
    setOpportunities(DataStore.getOpportunities());
  }, []);

  const pendingVerifications = orgs.filter((o) => o.verification_status === 'pending');
  const verifiedOrgs = orgs.filter((o) => o.verification_status === 'verified');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>System Administration & Ecosystem Safety</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Platform Overview
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor ecosystem health, review organization partner verifications, and supervise platform activity.
        </p>
      </div>

      {/* Pending Verification Notice */}
      {pendingVerifications.length > 0 && (
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <h2 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                {pendingVerifications.length} Organization Verification Request Awaiting Decision
              </h2>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                Review official business credentials before partner opportunities become public.
              </p>
            </div>
          </div>
          <Link
            href="/admin/verification-requests"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs shrink-0"
          >
            Review Now &rarr;
          </Link>
        </div>
      )}

      {/* Platform Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Users
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {users.length}
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            +100% organic growth
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Partner Orgs
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {orgs.length}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            {verifiedOrgs.length} verified &bull; {pendingVerifications.length} pending
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Active Opps
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {opportunities.length}
          </p>
          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
            Published listings
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Safety Reports
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            0
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            All clear
          </p>
        </div>
      </div>

      {/* Quick Ops Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/verification-requests"
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all shadow-xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600">
            Verification Requests
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Approve or reject organization partnership applications.
          </p>
        </Link>

        <Link
          href="/admin/opportunities"
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all shadow-xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Building className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600">
            Opportunities Moderation
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review live listings to prevent misleading claims or scams.
          </p>
        </Link>

        <Link
          href="/admin/analytics"
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 transition-all shadow-xs group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600">
            Ecosystem Analytics
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Measure practice sessions, screen time reclaimed, and matching efficiency.
          </p>
        </Link>
      </div>
    </div>
  );
}
