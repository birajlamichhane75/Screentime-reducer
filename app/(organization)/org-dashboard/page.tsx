'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Users,
  FileCheck2,
  BookmarkCheck,
  PlusCircle,
  BadgeCheck,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';
import { DataStore } from '@/services/dataStore';
import { Organization, Opportunity, Application } from '@/types';
import { formatDate } from '@/lib/utils';

export default function OrgDashboardPage() {
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const orgs = DataStore.getOrganizations();
    if (orgs.length > 0) {
      setCurrentOrg(orgs[0]);
    }
    const allOpps = DataStore.getOpportunities();
    setOpportunities(allOpps);
    const allApps = DataStore.getApplications();
    setApplications(allApps);
  }, []);

  if (!currentOrg) return null;

  const isVerified = currentOrg.verification_status === 'verified';
  const orgOpps = opportunities.filter((o) => o.organization_id === currentOrg.id);
  const orgApps = applications.filter((a) => a.opportunity?.organization_id === currentOrg.id);
  const shortlistedApps = orgApps.filter((a) => a.status === 'shortlisted');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {currentOrg.name}
            </h1>
            {isVerified ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <BadgeCheck className="w-3.5 h-3.5" />
                Verified Partner
              </span>
            ) : (
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                Pending Verification
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Talent recruitment, scholarship awards, and candidate review portal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/post-opportunity"
            id="post-opp-header-cta"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/30 transition-all hover:scale-102"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Opportunity</span>
          </Link>
        </div>
      </div>

      {/* Verification Notice Banner if Pending */}
      {!isVerified && (
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Identity Verification Under Review
            </h2>
            <p className="text-xs mt-1">
              Your organization verification is currently being reviewed by administrators. You may draft opportunities now; they will become publicly discoverable once approved.
            </p>
          </div>
          <Link
            href="/admin/verification-requests"
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs shrink-0"
          >
            Review Admin Status &rarr;
          </Link>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Opportunities
            </span>
            <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {orgOpps.length}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Published listings</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Applications
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {orgApps.length}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Candidate submissions</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Shortlisted
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <BookmarkCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {shortlistedApps.length}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Under high consideration</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Discoverable Talent
            </span>
            <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            Opted-In
          </p>
          <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold mt-1">
            Verified portfolios
          </p>
        </div>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Published Opportunities */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Your Opportunities ({orgOpps.length})
            </h2>
            <Link
              href="/manage-opportunities"
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Manage &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {orgOpps.map((opp) => (
              <div
                key={opp.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 transition-all flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                      {opp.opportunity_type.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Deadline: {formatDate(opp.deadline)}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {opp.title}
                  </h3>
                </div>

                <Link
                  href={`/org-applications`}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 shrink-0"
                >
                  Applications
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Candidate Applications ({orgApps.length})
            </h2>
            <Link
              href="/org-applications"
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Review All &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {orgApps.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No applications received yet.</p>
            ) : (
              orgApps.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {app.applicant?.full_name || 'Candidate'}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Applied for: <strong>{app.opportunity?.title}</strong>
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Status: {app.status}
                    </span>
                  </div>

                  <Link
                    href={`/org-applications`}
                    className="px-3 py-1.5 rounded-xl bg-teal-600 text-white font-bold text-xs shrink-0"
                  >
                    Review
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
