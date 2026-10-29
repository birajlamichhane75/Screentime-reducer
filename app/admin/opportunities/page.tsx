'use client';

import React, { useState, useEffect } from 'react';
import {
  Compass,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  Calendar,
  BadgeCheck,
} from 'lucide-react';
import { DataStore } from '@/services/dataStore';
import { Opportunity } from '@/types';
import { formatDate } from '@/lib/utils';

export default function AdminOpportunitiesModerationPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    setOpportunities(DataStore.getOpportunities());
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Listing Quality & Safety Moderation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Opportunities Moderation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Supervise published grants, internships, and scholarships to ensure safe opportunities for young learners.
        </p>
      </div>

      <div className="space-y-4">
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  {opp.opportunity_type.replace('_', ' ')}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {opp.organization?.name}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {opp.status}
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {opp.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">
                {opp.description}
              </p>
              <p className="text-[11px] text-slate-400">
                Deadline: {formatDate(opp.deadline)} &bull; {opp.location} ({opp.location_type})
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Compliant</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
