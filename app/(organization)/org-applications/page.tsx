'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileCheck2,
  BookmarkCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { DataStore } from '@/services/dataStore';
import { Application, ApplicationStatus } from '@/types';
import { formatDate, getStatusBadgeClass } from '@/lib/utils';

export default function OrgApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    const apps = DataStore.getApplications();
    setApplications(apps);
    if (apps.length > 0) {
      setSelectedApp(apps[0]);
      setReviewNotes(apps[0].review_notes || '');
    }
  }, []);

  const handleUpdateStatus = (newStatus: ApplicationStatus) => {
    if (!selectedApp) return;
    setStatusUpdating(true);
    setTimeout(() => {
      const updated = DataStore.updateApplicationStatus(
        selectedApp.id,
        newStatus,
        reviewNotes
      );
      setApplications(DataStore.getApplications());
      setSelectedApp(updated);
      setStatusUpdating(false);
    }, 300);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-3">
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Candidate Review Pipeline</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Applicant Review
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Evaluate student candidates based on verifiable portfolio artifacts and logged focus practice.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center">
          <FileCheck2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No candidate applications yet
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Applications will appear here as students apply with their portfolios.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Applications List */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Applications ({applications.length})
            </h2>
            {applications.map((app) => {
              const isSelected = selectedApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => {
                    setSelectedApp(app);
                    setReviewNotes(app.review_notes || '');
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/40 shadow-xs ring-1 ring-teal-500'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusBadgeClass(
                        app.status
                      )}`}
                    >
                      {app.status.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400">{formatDate(app.created_at)}</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {app.applicant?.full_name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {app.opportunity?.title}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right 2 Columns: Candidate Deep-Dive & Action Controls */}
          <div className="lg:col-span-2">
            {selectedApp && (
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                {/* Candidate Overview */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-black text-base flex items-center justify-center shrink-0">
                      {selectedApp.applicant?.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black text-slate-900 dark:text-white">
                          {selectedApp.applicant?.full_name}
                        </h2>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusBadgeClass(
                            selectedApp.status
                          )}`}
                        >
                          {selectedApp.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {selectedApp.applicant?.location} &bull; {selectedApp.applicant?.education_level}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-xs text-slate-400">
                    <span>Applied for:</span>
                    <span className="block font-bold text-slate-800 dark:text-slate-200 text-xs">
                      {selectedApp.opportunity?.title}
                    </span>
                  </div>
                </div>

                {/* Candidate Statement */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Candidate Statement of Interest
                  </h3>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    &ldquo;{selectedApp.introduction_text}&rdquo;
                  </div>
                </div>

                {/* Attached Portfolio Artifacts */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Attached Portfolio Projects ({selectedApp.projects?.length || 0})
                  </h3>
                  {selectedApp.projects && selectedApp.projects.length > 0 ? (
                    <div className="space-y-3">
                      {selectedApp.projects.map((proj) => (
                        <div
                          key={proj.id}
                          className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                        >
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                              {proj.hobby?.name}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                              {proj.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {proj.description}
                            </p>
                          </div>
                          {proj.external_url && (
                            <a
                              href={proj.external_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 shrink-0"
                            >
                              <span>View Work</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">No projects explicitly linked to this submission.</p>
                  )}
                </div>

                {/* Review Notes Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Reviewer Notes / Feedback (Visible to Candidate)
                  </label>
                  <textarea
                    rows={3}
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Provide constructive feedback or next steps for interview/grant dispersal..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                {/* Status Decision Buttons */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 mr-2">Update Decision:</span>
                  <button
                    type="button"
                    disabled={statusUpdating}
                    onClick={() => handleUpdateStatus('shortlisted')}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                  >
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    <span>Shortlist</span>
                  </button>

                  <button
                    type="button"
                    disabled={statusUpdating}
                    onClick={() => handleUpdateStatus('accepted')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accept Candidate</span>
                  </button>

                  <button
                    type="button"
                    disabled={statusUpdating}
                    onClick={() => handleUpdateStatus('rejected')}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
