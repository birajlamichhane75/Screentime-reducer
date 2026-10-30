'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  Search,
  Filter,
  ArrowRight,
  Briefcase,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  BadgeCheck,
} from 'lucide-react';
import { DataStore } from '@/services/dataStore';
import { Opportunity, OpportunityType } from '@/types';
import { formatDate } from '@/lib/utils';
import { rankOpportunities } from '@/services/matching';

export default function OpportunitiesPage() {
  const currentUser = DataStore.getCurrentUser();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [remoteOnly, setRemoteOnly] = useState(false);

  useEffect(() => {
    const opps = DataStore.getOpportunities();
    setOpportunities(opps);
  }, []);

  const userSkills = DataStore.getUserSkills(currentUser.id);
  const userProjects = DataStore.getProjects(currentUser.id);
  const userSessions = DataStore.getSessions(currentUser.id);

  const ranked = rankOpportunities(opportunities, {
    profile: currentUser,
    skills: userSkills,
    projects: userProjects,
    sessions: userSessions,
  });

  const filteredMatches = ranked.filter((match) => {
    const opp = match.opportunity;
    const matchesSearch =
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opp.organization?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.required_skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'all' || opp.opportunity_type === selectedType;
    const matchesRemote = !remoteOnly || opp.location_type === 'remote';

    return matchesSearch && matchesType && matchesRemote;
  });

  const oppTypes: { label: string; value: string }[] = [
    { label: 'All Opportunities', value: 'all' },
    { label: 'Scholarships & Grants', value: 'scholarship' },
    { label: 'Internships', value: 'internship' },
    { label: 'Mentorships', value: 'mentorship' },
    { label: 'Competitions', value: 'competition' },
    { label: 'Club Recruitment', value: 'club_recruitment' },
    { label: 'Paid Projects', value: 'paid_project' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Talent & Opportunity Marketplace</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Explore Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Apply to scholarships, internships, mentorships, and student clubs vetted by ShowUp!.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by title, organization, or required skill (e.g. Digital Painting, React)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="h-3.5 w-3.5 rounded text-indigo-600 border-slate-300"
              />
              <span>Remote Only</span>
            </label>
          </div>
        </div>

        {/* Opportunity Type Pills */}
        <div className="flex flex-wrap gap-2">
          {oppTypes.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setSelectedType(t.value)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedType === t.value
                  ? 'bg-teal-600 text-white shadow-xs font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredMatches.length} opportunities</span>
          <span>Ranked by transparent skill and portfolio match</span>
        </div>

        {filteredMatches.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center">
            <Compass className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              No matching opportunities found
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search terms or expanding your filter criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map((match) => {
              const opp = match.opportunity;
              return (
                <div
                  key={opp.id}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                        {opp.opportunity_type.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <span>{opp.organization?.name}</span>
                        {opp.organization?.verification_status === 'verified' && (
                          <span title="Verified Organization">
                            <BadgeCheck className="w-3.5 h-3.5 text-teal-500" />
                          </span>
                        )}
                      </span>
                      <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {match.score}% Match Score
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      {opp.title}
                    </h2>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {opp.description}
                    </p>

                    {/* Match explanation tag */}
                    <div className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>{match.reasons[0]}</span>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {opp.location} ({opp.location_type})
                      </span>
                      {opp.compensation_details && (
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {opp.compensation_details}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Deadline: {formatDate(opp.deadline)}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <Link
                      href={`/opportunities/${opp.id}`}
                      className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2"
                    >
                      <span>View & Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
