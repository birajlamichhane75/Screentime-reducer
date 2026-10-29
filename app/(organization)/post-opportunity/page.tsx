'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase,
  ArrowLeft,
  ArrowRight,
  PlusCircle,
  BadgeCheck,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { DataStore } from '@/services/dataStore';
import { OpportunityType, LocationType, Organization } from '@/types';

export default function PostOpportunityPage() {
  const router = useRouter();
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);

  const [title, setTitle] = useState('');
  const [opportunityType, setOpportunityType] = useState<OpportunityType>('scholarship');
  const [description, setDescription] = useState('');
  const [skillsInput, setSkillsInput] = useState('Digital Painting, UI/UX Design');
  const [eligibility, setEligibility] = useState('Open to all high school and undergraduate students.');
  const [location, setLocation] = useState('Austin, TX or Remote');
  const [locationType, setLocationType] = useState<LocationType>('remote');
  const [compensation, setCompensation] = useState('$1,500 Creative Project Grant');
  const [deadline, setDeadline] = useState('');
  const [openings, setOpenings] = useState(3);
  const [instructions, setInstructions] = useState('Attach your most representative portfolio project.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setDeadline(new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10));
    const orgs = DataStore.getOrganizations();
    if (orgs.length > 0) {
      setCurrentOrg(orgs[0]);
    }
  }, []);

  const isVerified = currentOrg?.verification_status === 'verified';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !eligibility || !deadline) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!isVerified) {
      setError('Your organization must be verified by administrators before publishing public opportunities.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const skillsArray = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      DataStore.createOpportunity(currentOrg!.id, {
        title,
        description,
        opportunity_type: opportunityType,
        required_skills: skillsArray,
        eligibility_criteria: eligibility,
        location,
        location_type: locationType,
        compensation_details: compensation,
        deadline,
        openings_count: openings,
        application_instructions: instructions,
        status: 'published',
        is_demo: false,
      });

      setIsSubmitting(false);
      router.push('/org-dashboard');
    }, 400);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <Link
          href="/org-dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Post New Opportunity
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Publish a scholarship, internship, mentorship, or paid project challenge for talent.
        </p>
      </div>

      {!isVerified && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Verification Required:</strong> Only approved partner organizations can publish live opportunities. If you need immediate testing, use the Admin Switcher to approve verification requests.
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6"
      >
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Opportunity Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 2026 Creative Tech Fellowship ($2,500 Grant)"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Opportunity Type
            </label>
            <select
              value={opportunityType}
              onChange={(e) => setOpportunityType(e.target.value as OpportunityType)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            >
              <option value="scholarship">Scholarship / Grant</option>
              <option value="internship">Internship / Apprenticeship</option>
              <option value="mentorship">Industry Mentorship</option>
              <option value="competition">Competition / Challenge</option>
              <option value="club_recruitment">Student Club Recruitment</option>
              <option value="paid_project">Paid Project / Commission</option>
              <option value="volunteer">Volunteer Opportunity</option>
              <option value="collaboration">Creative Collaboration</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Work Location Type
            </label>
            <select
              value={locationType}
              onChange={(e) => setLocationType(e.target.value as LocationType)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            >
              <option value="remote">Fully Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="in_person">In-Person</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Detailed Description & Learning Outcomes
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the opportunity, responsibilities, learning support, and schedule..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Required Skills (comma separated)
          </label>
          <input
            type="text"
            required
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="e.g. Digital Painting, UI/UX Design, React"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Compensation / Award Details
            </label>
            <input
              type="text"
              value={compensation}
              onChange={(e) => setCompensation(e.target.value)}
              placeholder="e.g. $2,500 Grant or $22/hour"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Application Deadline
            </label>
            <input
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Eligibility Requirements
          </label>
          <input
            type="text"
            required
            value={eligibility}
            onChange={(e) => setEligibility(e.target.value)}
            placeholder="e.g. High school or undergraduate student, ages 16-24."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          />
        </div>

        <button
          type="submit"
          id="publish-opp-btn"
          disabled={isSubmitting || !isVerified}
          className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-teal-600/30 transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isSubmitting ? 'Publishing...' : 'Publish Opportunity to Marketplace'}</span>
        </button>
      </form>
    </div>
  );
}
