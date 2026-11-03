'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, Building2 } from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { Profile, Opportunity } from '@/types';

const ORG_HANDLES: Record<string, string> = {
  'org-01': '@apextech',
  'org-02': '@vertexlabs',
  'org-03': '@creativearts',
  'org-04': '@youthathletics',
  'org-05': '@culinarycreators',
  'org-06': '@soundwave',
};

export default function RewardsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    const user = DataStore.getCurrentUser();
    setCurrentUser(user);

    // Get all opportunities from DataStore
    const allOpps = DataStore.getOpportunities();

    // Ensure "The Future of Tech 2027" is always placed FIRST at position #1
    const prioritized = [...allOpps].sort((a, b) => {
      const isAFirst = a.title.toLowerCase().includes('the future of tech 2027');
      const isBFirst = b.title.toLowerCase().includes('the future of tech 2027');
      if (isAFirst && !isBFirst) return -1;
      if (!isAFirst && isBFirst) return 1;
      return 0;
    });

    setOpportunities(prioritized);
  }, []);

  const getOrgHandle = (opp: Opportunity) => {
    if (ORG_HANDLES[opp.organization_id]) return ORG_HANDLES[opp.organization_id];
    if (opp.organization?.name) {
      return '@' + opp.organization.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15);
    }
    return '@partner';
  };

  return (
    <MobileShell hideBottomNav={false}>
      <div className="flex flex-col min-h-full px-4 sm:px-5 py-5 space-y-5">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-[#0E0830] dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <span className="text-base font-black text-slate-900 dark:text-white">
            Opportunities
          </span>
          <Link
            href="/rating"
            className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-[#0E0830] dark:hover:text-white"
          >
            Rating
          </Link>
        </div>

        {/* Minimal Clean Hero Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Scholarships &amp; Hiring
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Daily practice qualifies you for verified awards &bull; Tag orgs in captions to get scouted
          </p>
        </div>

        {/* Streamlined Visual Opportunity Cards: Check/Hiring Image + Just 1 Headline & Reward */}
        <div className="space-y-4">
          {opportunities.map((opp, idx) => {
            const orgName = opp.organization?.name || 'Partner Organization';
            const orgHandle = getOrgHandle(opp);
            const isScholarship = opp.opportunity_type === 'scholarship';
            const rewardBadge =
              opp.reward_amount ||
              opp.compensation_details ||
              (isScholarship ? '$100K Scholarship' : 'Hiring Contract');

            // Default image assignments ensuring scholarship checks & hiring illustrations
            const imageSrc =
              opp.image_url ||
              (isScholarship
                ? idx === 0
                  ? '/opportunities/future-tech-scholarship-check.jpg'
                  : '/opportunities/arts-grant-check.jpg'
                : '/opportunities/hiring-contract.jpg');

            return (
              <div
                key={opp.id}
                className="card-3d card-3d-interactive overflow-hidden rounded-3xl group"
              >
                {/* 1. Large High-Impact Image Banner (Scholarship Check / Hiring Graphic) */}
                <div className="relative aspect-16/9 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={imageSrc}
                    alt={opp.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />

                  {/* Floating Organization Tag */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
                    <Building2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>{orgName}</span>
                    <span className="text-amber-400 font-semibold">{orgHandle}</span>
                  </div>

                  {/* Award / Hiring Tag */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-xs font-extrabold shadow-md flex items-center gap-1 text-white">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isScholarship ? 'Scholarship' : 'Hiring'}</span>
                  </div>
                </div>

                {/* 2. Just One Headline Text with Reward */}
                <div className="p-4 sm:p-5 space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                      {opp.title}
                    </h2>
                    <span className="shrink-0 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs sm:text-sm shadow-xs whitespace-nowrap">
                      {rewardBadge}
                    </span>
                  </div>

                  {/* Clean Action CTA */}
                  <Link
                    href="/upload"
                    className="btn-3d block text-center w-full py-3 rounded-2xl text-white text-xs sm:text-sm font-bold"
                  >
                    Upload Practice to Apply &bull; Tag {orgHandle}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MobileShell>
  );
}
