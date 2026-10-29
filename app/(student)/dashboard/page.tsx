'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Timer,
  Trophy,
  Award,
  Briefcase,
  Compass,
  ArrowRight,
  Flame,
  Sparkles,
  Calendar,
  CheckCircle2,
  Play,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { DataStore } from '@/services/dataStore';
import {
  Profile,
  UserHobby,
  ActivitySession,
  Project,
  Challenge,
  Opportunity,
  RewardEvent,
  UserAchievement,
} from '@/types';
import { formatMinutes } from '@/lib/utils';
import { rankOpportunities } from '@/services/matching';

export default function StudentDashboardPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [userHobbies, setUserHobbies] = useState<UserHobby[]>([]);
  const [sessions, setSessions] = useState<ActivitySession[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [rewardEvents, setRewardEvents] = useState<RewardEvent[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);

  useEffect(() => {
    const user = DataStore.getCurrentUser();
    setCurrentUser(user);
    setUserHobbies(DataStore.getUserHobbies(user.id));
    setSessions(DataStore.getSessions(user.id));
    setProjects(DataStore.getProjects(user.id));
    setChallenges(DataStore.getChallenges());
    setOpportunities(DataStore.getOpportunities());
    setRewardEvents(DataStore.getRewardEvents(user.id));
    setAchievements(DataStore.getUserAchievements(user.id));
  }, []);

  if (!currentUser) return null;

  const totalPoints = rewardEvents.reduce((sum, r) => sum + r.points, 0);
  const completedSessions = sessions.filter((s) => s.status === 'completed');
  const totalPracticeSeconds = completedSessions.reduce((sum, s) => sum + s.duration_seconds, 0);
  const totalPracticeMinutes = Math.round(totalPracticeSeconds / 60);

  // Completed challenges count
  const completedChallengesCount = DataStore.getSubmissions(currentUser.id).filter(
    (s) => s.status === 'accepted'
  ).length;

  // Ranked opportunities based on matching engine
  const userSkills = DataStore.getUserSkills(currentUser.id);
  const rankedOpps = rankOpportunities(opportunities, {
    profile: currentUser,
    skills: userSkills,
    projects,
    sessions,
  });

  // Weekly Practice Data for Recharts
  const weeklyChartData = [
    { day: 'Mon', minutes: 30 },
    { day: 'Tue', minutes: 45 },
    { day: 'Wed', minutes: 20 },
    { day: 'Thu', minutes: 50 },
    { day: 'Fri', minutes: 30 },
    { day: 'Sat', minutes: 60 },
    { day: 'Sun', minutes: Math.min(60, totalPracticeMinutes % 60 || 45) },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome back, {currentUser.full_name.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Every minute you create is a step toward your future.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/focus"
            id="header-start-focus-btn"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all hover:scale-102"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Start Focus Session</span>
          </Link>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Practice Time */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Practice Time
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Timer className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {formatMinutes(totalPracticeMinutes)}
          </p>
          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Target: {currentUser.daily_goal_minutes}m/day</span>
          </p>
        </div>

        {/* Card 2: Completed Challenges */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Challenges
            </span>
            <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {completedChallengesCount}
          </p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">
            {challenges.length} active available
          </p>
        </div>

        {/* Card 3: Achievement Points */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Points Ledger
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {totalPoints} <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">pts</span>
          </p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">
            {achievements.length} badges unlocked
          </p>
        </div>

        {/* Card 4: Portfolio Projects */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Projects
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {projects.length}
          </p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">
            Verified artifacts
          </p>
        </div>

        {/* Card 5: Matched Opportunities */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Matched Opps
            </span>
            <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {rankedOpps.filter((r) => r.score >= 50).length}
          </p>
          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
            Top match: {rankedOpps[0]?.score || 0}%
          </p>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Continue Your Journey + Recommended Opportunities */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Your Journey (Active Hobbies) */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Continue Your Journey
                </h2>
                <p className="text-xs text-slate-400">Active hobbies and daily targets</p>
              </div>
              <Link
                href="/hobbies"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>Manage</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {userHobbies.map((uh) => (
                <div
                  key={uh.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {uh.hobby?.category || 'Hobby'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        {uh.current_level}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {uh.hobby?.name || 'Creative Hobby'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {uh.notes || 'Target: ' + uh.daily_target_mins + ' mins/day'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      Goal: {uh.daily_target_mins}m / day
                    </span>
                    <Link
                      href={`/focus?hobby=${uh.hobby_id}`}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Start</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Opportunities */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Recommended Opportunities
                </h2>
                <p className="text-xs text-slate-400">
                  Ranked transparently by your verified skills and portfolio
                </p>
              </div>
              <Link
                href="/opportunities"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {rankedOpps.slice(0, 3).map((match) => {
                const opp = match.opportunity;
                return (
                  <div
                    key={opp.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                          {opp.opportunity_type.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">
                          &bull; {opp.organization?.name || 'Verified Partner'}
                        </span>
                        <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
                          {match.score}% Match
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {opp.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {match.reasons[0] || opp.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/opportunities/${opp.id}`}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Practice Analytics Chart */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Practice Consistency This Week
                </h2>
                <p className="text-xs text-slate-400">Minutes spent in focused practice mode</p>
              </div>
              <Link
                href="/screen-time"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Full Impact Report &rarr;
              </Link>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} unit="m" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#FFF',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="minutes" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Challenges & Recent Achievements */}
        <div className="space-y-6">
          {/* Recommended Challenges */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Active Challenges
                </h2>
                <p className="text-xs text-slate-400">Test your craft and earn points</p>
              </div>
              <Link
                href="/challenges"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                All &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {challenges.slice(0, 3).map((ch) => (
                <div
                  key={ch.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      <span>{ch.category}</span>
                      <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                        +{ch.reward_points} pts
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {ch.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {ch.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium">
                      Est. {ch.duration_mins}m
                    </span>
                    <Link
                      href={`/challenges/${ch.id}`}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Start &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges & Milestones */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Unlocked Milestones
                </h2>
                <p className="text-xs text-slate-400">Verifiable skill badges</p>
              </div>
              <Link
                href="/rewards"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Rewards &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {achievements.map((ua) => (
                <div
                  key={ua.id}
                  className="p-3 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/50 to-transparent dark:from-indigo-950/30 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {ua.achievement?.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {ua.achievement?.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
