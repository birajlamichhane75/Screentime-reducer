'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { Profile, Opportunity } from '@/types';

export default function RewardsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [shortlistedOpps, setShortlistedOpps] = useState<Opportunity[]>([]);
  const [otherOpps, setOtherOpps] = useState<Opportunity[]>([]);
  const [userInterestsLabel, setUserInterestsLabel] = useState<string>('');
  const [appliedMap, setAppliedMap] = useState<Record<string, boolean>>({});

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

    // Check existing applications
    const apps = DataStore.getApplications(user.id);
    const appMap: Record<string, boolean> = {};
    apps.forEach((a) => {
      appMap[a.opportunity_id] = true;
    });
    setAppliedMap(appMap);
  }, []);

  const handleApply = (oppId: string) => {
    if (!currentUser) return;
    try {
      DataStore.submitApplication(
        currentUser.id,
        oppId,
        'I am consistently practicing this craft daily.'
      );
      setAppliedMap((prev) => ({ ...prev, [oppId]: true }));
    } catch {
      setAppliedMap((prev) => ({ ...prev, [oppId]: true }));
    }
  };

  return (
    <MobileShell hideBottomNav={true}>
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
            Shortlisted based on your uploaded videos and practice in {userInterestsLabel}.
          </p>
        </div>

        {/* Shortlisted Opportunities List */}
        <div className="space-y-5">
          {shortlistedOpps.map((opp) => {
            const orgName = opp.organization?.name || 'Partner Organization';
            const isApplied = appliedMap[opp.id];

            return (
              <div
                key={opp.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
              >
                {/* Organization Name */}
                <div className="space-y-1">
                  <span className="text-base font-bold text-[#0E0830] dark:text-indigo-400 block">
                    {orgName}
                  </span>
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

                {/* Simple Action */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleApply(opp.id)}
                    disabled={isApplied}
                    className={`w-full py-4 rounded-2xl text-base font-bold transition-all ${
                      isApplied
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-default'
                        : 'bg-[#0E0830] hover:bg-[#1a1147] text-white shadow-md active:scale-98'
                    }`}
                  >
                    {isApplied ? 'Application Submitted' : 'Apply Now'}
                  </button>
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
                const isApplied = appliedMap[opp.id];

                return (
                  <div
                    key={opp.id}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
                  >
                    <div className="space-y-1">
                      <span className="text-base font-bold text-slate-500 dark:text-slate-400 block">
                        {orgName}
                      </span>
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

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => handleApply(opp.id)}
                        disabled={isApplied}
                        className={`w-full py-4 rounded-2xl text-base font-bold transition-all ${
                          isApplied
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-default'
                            : 'bg-[#0E0830] hover:bg-[#1a1147] text-white shadow-md active:scale-98'
                        }`}
                      >
                        {isApplied ? 'Application Submitted' : 'Apply Now'}
                      </button>
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
