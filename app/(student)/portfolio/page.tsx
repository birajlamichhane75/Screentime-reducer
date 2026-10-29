'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Plus,
  ExternalLink,
  Code2,
  Eye,
  Lock,
  Globe,
  Award,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { DataStore } from '@/services/dataStore';
import { Project, Profile, UserAchievement } from '@/types';
import { formatDate } from '@/lib/utils';

export default function PortfolioPage() {
  const currentUser = DataStore.getCurrentUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [filterVisibility, setFilterVisibility] = useState<string>('all');

  useEffect(() => {
    setProjects(DataStore.getProjects(currentUser.id));
    setAchievements(DataStore.getUserAchievements(currentUser.id));
  }, [currentUser.id]);

  const filteredProjects = projects.filter((p) => {
    if (filterVisibility === 'all') return true;
    return p.visibility === filterVisibility;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Portfolio Header & Hero Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-teal-950 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/30 border border-indigo-400/30 flex items-center justify-center text-xl font-black text-white shrink-0">
              {currentUser.full_name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{currentUser.full_name}</h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30">
                  {currentUser.is_discoverable ? 'Discoverable' : 'Private'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">{currentUser.bio}</p>
              <p className="text-[11px] text-slate-400 mt-1">
                {currentUser.location} &bull; {currentUser.education_level}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/portfolio/new"
              id="new-project-cta"
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Projects Controls & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Curated Projects & Evidence ({filteredProjects.length})
          </h2>
          <p className="text-xs text-slate-400">
            Tangible proof of your craft used to match scholarships and opportunities
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {['all', 'public', 'discoverable', 'private'].map((vis) => (
            <button
              key={vis}
              type="button"
              onClick={() => setFilterVisibility(vis)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                filterVisibility === vis
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              {vis}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center">
          <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No projects in this category
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Upload your completed sketches, GitHub codebases, or video edits to start building your verified portfolio.
          </p>
          <Link
            href="/portfolio/new"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Project</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Media preview banner */}
                {proj.media && proj.media.length > 0 ? (
                  <div className="h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                    <img
                      src={proj.media[0].media_url}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/70 text-white backdrop-blur-md flex items-center gap-1">
                        {proj.visibility === 'public' && <Globe className="w-3 h-3" />}
                        {proj.visibility === 'discoverable' && <Eye className="w-3 h-3" />}
                        {proj.visibility === 'private' && <Lock className="w-3 h-3" />}
                        <span className="capitalize">{proj.visibility}</span>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-32 bg-gradient-to-r from-indigo-50 to-teal-50 dark:from-indigo-950/30 dark:to-teal-950/30 flex items-center justify-center text-slate-400">
                    <Briefcase className="w-8 h-8" />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[10px]">
                      {proj.hobby?.name || 'Creative Project'}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      {formatDate(proj.project_date)}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Skills Demonstrated Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {proj.skills_demonstrated.map((sk) => (
                      <span
                        key={sk}
                        className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Links & Actions footer */}
              <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {proj.external_url && (
                    <a
                      href={proj.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Link</span>
                    </a>
                  )}
                  {proj.github_url && (
                    <a
                      href={proj.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:underline flex items-center gap-1"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  )}
                </div>

                <Link
                  href={`/portfolio/${proj.id}`}
                  className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600"
                >
                  View Artifact &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
