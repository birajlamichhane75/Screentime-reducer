'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Compass,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  BadgeCheck,
  Building2,
  Briefcase,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DataStore } from '@/services/dataStore';
import { Opportunity, Project, Application } from '@/types';
import { formatDate } from '@/lib/utils';
import { calculateOpportunityMatch } from '@/services/matching';

function OpportunityDetailContent() {
  const params = useParams();
  const router = useRouter();
  const oppId = params.id as string;
  const currentUser = DataStore.getCurrentUser();

  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [existingApplication, setExistingApplication] = useState<Application | null>(null);

  // Application form state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [introductionText, setIntroductionText] = useState(
    'I have been developing my craft daily and would love to contribute to this initiative. Please review my attached portfolio artifacts.'
  );
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    const opps = DataStore.getOpportunities();
    const found = opps.find((o) => o.id === oppId);
    if (found) setOpp(found);

    const projs = DataStore.getProjects(currentUser.id);
    setUserProjects(projs);
    if (projs.length > 0) {
      setSelectedProjectIds([projs[0].id]);
    }

    const apps = DataStore.getApplications(currentUser.id);
    const existing = apps.find((a) => a.opportunity_id === oppId);
    if (existing) setExistingApplication(existing);
  }, [oppId, currentUser.id]);

  if (!opp) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Opportunity not found.</p>
        <Link href="/opportunities" className="text-xs font-bold text-indigo-600 mt-2 inline-block">
          &larr; Back to all opportunities
        </Link>
      </div>
    );
  }

  const userSkills = DataStore.getUserSkills(currentUser.id);
  const userSessions = DataStore.getSessions(currentUser.id);
  const matchResult = calculateOpportunityMatch(opp, {
    profile: currentUser,
    skills: userSkills,
    projects: userProjects,
    sessions: userSessions,
  });

  const handleToggleProject = (id: string) => {
    setSelectedProjectIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!introductionText) return;

    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const newApp = DataStore.submitApplication(
          currentUser.id,
          opp.id,
          introductionText,
          selectedProjectIds
        );
        setExistingApplication(newApp);

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });

        setIsSubmitting(false);
        setSubmittedSuccess(true);
        setShowApplyModal(false);
      } catch (err: any) {
        alert(err.message || 'Application could not be submitted');
        setIsSubmitting(false);
      }
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <Link
        href="/opportunities"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Opportunities</span>
      </Link>

      {/* Main Opportunity Card */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              {opp.opportunity_type.replace('_', ' ')}
            </span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <span>{opp.organization?.name}</span>
              {opp.organization?.verification_status === 'verified' && (
                <BadgeCheck className="w-3.5 h-3.5 text-teal-500" />
              )}
            </span>
            <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {matchResult.score}% Match Score
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {opp.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-slate-400" />
              {opp.location} ({opp.location_type})
            </span>
            {opp.compensation_details && (
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {opp.compensation_details}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              Due: {formatDate(opp.deadline)}
            </span>
          </div>
        </div>

        {/* Transparent Match Breakdown */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Why this opportunity was recommended to you:</span>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc list-inside space-y-1">
            {matchResult.reasons.map((r, idx) => (
              <li key={idx}>{r}</li>
            ))}
          </ul>
        </div>

        {/* Detailed Description */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
            Opportunity Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {opp.description}
          </p>
        </div>

        {/* Requirements & Skills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {opp.required_skills.map((sk) => (
                <span
                  key={sk}
                  className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Eligibility Criteria
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {opp.eligibility_criteria || 'Open to all self-directed learners with demonstrable craft.'}
            </p>
          </div>
        </div>

        {/* Application CTA or Status Banner */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          {existingApplication || submittedSuccess ? (
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <h3 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    Application Submitted ({existingApplication?.status || 'submitted'})
                  </h3>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                    The organization has been notified and can review your verified portfolio evidence.
                  </p>
                </div>
              </div>
              <Link
                href="/applications"
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shrink-0"
              >
                Track Status &rarr;
              </Link>
            </div>
          ) : (
            <button
              type="button"
              id="open-apply-modal-btn"
              onClick={() => setShowApplyModal(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-sm shadow-lg shadow-teal-600/30 transition-all hover:scale-102 flex items-center justify-center gap-2"
            >
              <span>Apply With Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">
                Application Review
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Apply to {opp.title}
              </h2>
            </div>

            <form onSubmit={handleApplicationSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Attach Verified Portfolio Projects:
                </label>
                {userProjects.length === 0 ? (
                  <p className="text-xs text-rose-500">
                    You have not published any portfolio projects yet. You can still apply with your statement!
                  </p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {userProjects.map((p) => {
                      const isChecked = selectedProjectIds.includes(p.id);
                      return (
                        <div
                          key={p.id}
                          onClick={() => handleToggleProject(p.id)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between ${
                            isChecked
                              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <span className="truncate">{p.title}</span>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="h-3.5 w-3.5 rounded text-indigo-600"
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Introduction / Statement of Interest
                </label>
                <textarea
                  rows={4}
                  required
                  value={introductionText}
                  onChange={(e) => setIntroductionText(e.target.value)}
                  placeholder="Explain why you are excited for this opportunity and how your practice has prepared you..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="confirm-submit-application-btn"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OpportunityDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading opportunity details...</div>}>
      <OpportunityDetailContent />
    </Suspense>
  );
}
