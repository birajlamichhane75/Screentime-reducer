'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const [shortlistedOpps, setShortlistedOpps] = useState<Opportunity[]>([]);
  const [otherOpps, setOtherOpps] = useState<Opportunity[]>([]);
  const [userInterestsLabel, setUserInterestsLabel] = useState<string>('');

  useEffect(() => {
    const user = DataStore.getCurrentUser();
    setCurrentUser(user);

    // Get user's uploaded videos and their categories
    const allVideos = DataStore.getVideos();
    const myVideos = allVideos.filter((v) => v.creator_id === user.id);
    const uploadedCats = myVideos.map((v) => v.category.toLowerCase().trim());

    // Get user's selected hobbies / interests
    const userHobbies = DataStore.getUserHobbies(user.id);
    const hobbyNames = userHobbies.map((uh) => uh.hobby?.name.toLowerCase().trim() || '');

    // Combine distinct user signals
    const allSignals = Array.from(new Set([...uploadedCats, ...hobbyNames].filter(Boolean)));
    setUserInterestsLabel(
      allSignals.length > 0
        ? allSignals.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')
        : 'Creative Practice'
    );

    // Get all opportunities from organizations
    const allOpps = DataStore.getOpportunities();

    // Shortlist opportunities matching the user's uploaded work or selected interests
    const shortlisted: Opportunity[] = [];
    const others: Opportunity[] = [];

    allOpps.forEach((opp) => {
      const skillsStr = (opp.required_skills || []).join(' ').toLowerCase();
      const titleStr = opp.title.toLowerCase();
      const descStr = opp.description.toLowerCase();
      const fullText = `${skillsStr} ${titleStr} ${descStr}`;

      const isMatch = allSignals.some((signal) => {
        if (!signal) return false;
        if (fullText.includes(signal)) return true;
        if (signal.includes('art') || signal.includes('draw') || signal.includes('paint')) {
          return (
            fullText.includes('art') ||
            fullText.includes('paint') ||
            fullText.includes('draw') ||
            fullText.includes('visual')
          );
        }
        if (signal.includes('dance')) {
          return fullText.includes('dance') || fullText.includes('choreograph');
        }
        if (signal.includes('sport') || signal.includes('soccer')) {
          return (
            fullText.includes('soccer') ||
            fullText.includes('sport') ||
            fullText.includes('athlet')
          );
        }
        if (signal.includes('cook') || signal.includes('food')) {
          return (
            fullText.includes('cook') ||
            fullText.includes('culinary') ||
            fullText.includes('food')
          );
        }
        if (signal.includes('music') || signal.includes('sing')) {
          return (
            fullText.includes('music') ||
            fullText.includes('sing') ||
            fullText.includes('song') ||
            fullText.includes('vocal')
          );
        }
        if (signal.includes('code') || signal.includes('tech')) {
          return (
            fullText.includes('code') ||
            fullText.includes('tech') ||
            fullText.includes('developer')
          );
        }
        return false;
      });

      if (isMatch) {
        shortlisted.push(opp);
      } else {
        others.push(opp);
      }
    });

    if (allSignals.length === 0) {
      setShortlistedOpps(allOpps);
      setOtherOpps([]);
    } else {
      setShortlistedOpps(shortlisted.length > 0 ? shortlisted : allOpps);
      setOtherOpps(shortlisted.length > 0 ? others : []);
    }
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
      <div className="flex flex-col min-h-full px-5 py-6 space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => router.back()}
            className="text-base font-bold text-slate-700 dark:text-slate-200 hover:text-[#0E0830] dark:hover:text-white"
          >
            Back
          </button>
          <span className="text-base font-bold text-slate-900 dark:text-white">
            Opportunities
          </span>
          <Link
            href="/rating"
            className="text-base font-bold text-slate-700 dark:text-slate-200 hover:text-[#0E0830] dark:hover:text-white"
          >
            Rating
          </Link>
        </div>

        {/* Shortlist Hero Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Opportunities For You
          </h1>
          <p className="text-base text-slate-700 dark:text-slate-300">
            Shortlisted based on your uploaded videos and practice in {userInterestsLabel}. Mention organization usernames when uploading to get scouted.
          </p>
        </div>

        {/* Shortlisted Opportunities List */}
        <div className="space-y-5">
          {shortlistedOpps.map((opp) => {
            const orgName = opp.organization?.name || 'Partner Organization';
            const orgHandle = getOrgHandle(opp);

            return (
              <div
                key={opp.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
              >
                {/* Organization Name & Mention Handle in Notice */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-[#0E0830] dark:text-indigo-400 block">
                      {orgName}
                    </span>
                    <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                      {orgHandle}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-snug">
                    {opp.title}
                  </h2>
                </div>

                {/* What the organization is looking for */}
                <div className="space-y-1">
                  <span className="text-base font-bold text-slate-900 dark:text-white block">
                    What they are looking for:
                  </span>
                  <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    {opp.description}
                  </p>
                </div>

                {/* How to get noticed by this organization */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-base font-bold text-slate-900 dark:text-white block">
                    How to get noticed:
                  </span>
                  <p className="text-base text-slate-700 dark:text-slate-300">
                    Tag <span className="font-bold text-[#0E0830] dark:text-white">{orgHandle}</span> in your daily upload caption so their scouts review your work directly.
                  </p>
                </div>

                {/* Action to Upload and Mention */}
                <div className="pt-1">
                  <Link
                    href="/upload"
                    className="block text-center w-full py-4 rounded-2xl bg-[#0E0830] hover:bg-[#1a1147] text-white text-base font-bold transition-all shadow-md active:scale-98"
                  >
                    Upload Practice & Mention {orgHandle}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Opportunities (if any others exist) */}
        {otherOpps.length > 0 && (
          <div className="space-y-4 pt-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              More Opportunities
            </h2>
            <div className="space-y-5">
              {otherOpps.map((opp) => {
                const orgName = opp.organization?.name || 'Partner Organization';
                const orgHandle = getOrgHandle(opp);

                return (
                  <div
                    key={opp.id}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-slate-500 dark:text-slate-400 block">
                          {orgName}
                        </span>
                        <span className="text-base font-bold text-slate-600 dark:text-slate-300">
                          {orgHandle}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-snug">
                        {opp.title}
                      </h3>
                    </div>

                    <div className="space-y-1">
                      <span className="text-base font-bold text-slate-900 dark:text-white block">
                        What they are looking for:
                      </span>
                      <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                        {opp.description}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                      <span className="text-base font-bold text-slate-900 dark:text-white block">
                        How to get noticed:
                      </span>
                      <p className="text-base text-slate-700 dark:text-slate-300">
                        Tag <span className="font-bold text-[#0E0830] dark:text-white">{orgHandle}</span> in your daily upload caption so their scouts review your work directly.
                      </p>
                    </div>

                    <div className="pt-1">
                      <Link
                        href="/upload"
                        className="block text-center w-full py-4 rounded-2xl bg-[#0E0830] hover:bg-[#1a1147] text-white text-base font-bold transition-all shadow-md active:scale-98"
                      >
                        Upload Practice & Mention {orgHandle}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
