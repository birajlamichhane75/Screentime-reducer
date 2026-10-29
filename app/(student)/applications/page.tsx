'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  Calendar,
  Building2,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import { DataStore } from '@/services/dataStore';
import { Application } from '@/types';
import { formatDate, getStatusBadgeClass } from '@/lib/utils';

export default function ApplicationsPage() {
  const currentUser = DataStore.getCurrentUser();
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    setApplications(DataStore.getApplications(currentUser.id));
  }, [currentUser.id]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Application Tracking</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          My Applications
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track the status of your submitted scholarship, internship, and project applications.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center">
          <FileCheck2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No applications submitted yet
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Explore active opportunities matched to your portfolio and submit your first application.
          </p>
          <Link
            href="/opportunities"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs"
          >
            <span>Explore Opportunities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(
                      app.status
                    )}`}
                  >
                    {app.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400">
                    &bull; Applied on {formatDate(app.created_at)}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {app.opportunity?.title || 'Opportunity'}
                </h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {app.opportunity?.organization?.name} &bull; {app.opportunity?.location}
                </p>

                {/* Introduction excerpt */}
                {app.introduction_text && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-2">
                    &ldquo;{app.introduction_text}&rdquo;
                  </p>
                )}

                {/* Organization Review Notes */}
                {app.review_notes && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                    <strong className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                      Reviewer Feedback:
                    </strong>
                    <span>{app.review_notes}</span>
                  </div>
                )}
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <Link
                  href={`/opportunities/${app.opportunity_id}`}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
                >
                  View Listing
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
