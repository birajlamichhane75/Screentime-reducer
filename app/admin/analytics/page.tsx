'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Timer,
  Briefcase,
  Compass,
  FileCheck2,
  Building,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DataStore } from '@/services/dataStore';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({
    userCount: 0,
    sessionCount: 0,
    projectCount: 0,
    oppCount: 0,
    appCount: 0,
    orgCount: 0,
    totalPoints: 0,
  });

  useEffect(() => {
    const users = DataStore.getProfiles();
    const sessions = DataStore.getSessions('usr-student-001');
    const projects = DataStore.getProjects();
    const opps = DataStore.getOpportunities();
    const apps = DataStore.getApplications();
    const orgs = DataStore.getOrganizations();
    const rewards = DataStore.getRewardEvents('usr-student-001');

    setStats({
      userCount: users.length,
      sessionCount: sessions.length,
      projectCount: projects.length,
      oppCount: opps.length,
      appCount: apps.length,
      orgCount: orgs.length,
      totalPoints: rewards.reduce((sum, r) => sum + r.points, 0),
    });
  }, []);

  const engagementByHobby = [
    { name: 'Digital Art', sessions: 42, color: '#4F46E5' },
    { name: 'Coding', sessions: 58, color: '#0D9488' },
    { name: 'Photography', sessions: 24, color: '#F59E0B' },
    { name: 'Writing', sessions: 31, color: '#EC4899' },
    { name: 'Music', sessions: 19, color: '#8B5CF6' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-3">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Platform Growth & Behavioral Impact</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Platform Ecosystem Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Measure how effective SkillBridge is at shifting time from passive social feeds into tangible craft.
        </p>
      </div>

      {/* 6 Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Users</span>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{stats.userCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Focus Sessions</span>
          <p className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{stats.sessionCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Portfolio Projs</span>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{stats.projectCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Opportunities</span>
          <p className="text-xl font-black text-teal-600 dark:text-teal-400 mt-1">{stats.oppCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Applications</span>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{stats.appCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Points Awarded</span>
          <p className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">{stats.totalPoints}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Practice Sessions by Discipline
            </h2>
            <p className="text-xs text-slate-400">Distribution of focused hours across creative disciplines</p>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementByHobby}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="sessions" fill="#0D9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Opportunity Conversion Funnel
            </h2>
            <p className="text-xs text-slate-400">From match recommendation to application and decision</p>
          </div>
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                <span>Recommendations Generated</span>
                <span>100% (148)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="w-full h-full bg-indigo-600 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                <span>Detailed Views</span>
                <span>64% (95)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="w-[64%] h-full bg-teal-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                <span>Applications Submitted</span>
                <span>38% (56)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="w-[38%] h-full bg-amber-500 rounded-full" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                <span>Candidates Shortlisted / Accepted</span>
                <span>18% (27)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="w-[18%] h-full bg-emerald-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
