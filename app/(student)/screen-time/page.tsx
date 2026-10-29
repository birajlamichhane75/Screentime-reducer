'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart as LineChartIcon,
  TrendingDown,
  Clock,
  Sparkles,
  Plus,
  ShieldAlert,
  Calendar,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { DataStore } from '@/services/dataStore';
import { ScreenTimeEntry } from '@/types';
import { calculateScreenTimeSavings, formatDate } from '@/lib/utils';

export default function ScreenTimeImpactPage() {
  const currentUser = DataStore.getCurrentUser();
  const [entries, setEntries] = useState<ScreenTimeEntry[]>([]);

  // Form input state
  const [baselineMins, setBaselineMins] = useState(currentUser.baseline_screen_time_mins || 240);
  const [currentMins, setCurrentMins] = useState(90);
  const [entryDate, setEntryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setEntries(DataStore.getScreenTimeEntries(currentUser.id));
    setEntryDate(new Date().toISOString().slice(0, 10));
  }, [currentUser.id]);

  const latestEntry = entries[0];
  const activeBaseline = latestEntry ? latestEntry.baseline_mins : baselineMins;
  const activeCurrent = latestEntry ? latestEntry.current_mins : currentMins;

  const metrics = calculateScreenTimeSavings(activeBaseline, activeCurrent);

  const chartData = entries
    .slice()
    .reverse()
    .map((e) => ({
      date: e.entry_date.slice(5),
      baseline: e.baseline_mins,
      current: e.current_mins,
      saved: e.saved_mins,
    }));

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    DataStore.addScreenTimeEntry(
      currentUser.id,
      entryDate,
      baselineMins,
      currentMins,
      notes
    );
    setEntries(DataStore.getScreenTimeEntries(currentUser.id));
    setShowForm(false);
    setNotes('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-3">
            <LineChartIcon className="w-3.5 h-3.5" />
            <span>Habit & Screen-Time Measurement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Screen-Time Impact Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Measure how replacing passive social feeds with deliberate hobby practice reclaims your time.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Screen-Time Entry</span>
        </button>
      </div>

      {/* 3 Impact Reclaimed Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Daily Reclaimed Time
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              {metrics.dailyReductionMins}
            </p>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">mins / day</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            From {activeBaseline}m baseline down to {activeCurrent}m
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Annualized Hours Saved
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
              {metrics.annualizedHours}
            </p>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">hours / year</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Reinvested into real creative craft
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Equivalent Full Days
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <p className="text-3xl font-black text-teal-600 dark:text-teal-400">
              {metrics.equivalentDays}
            </p>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400">full 24h days</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Reclaimed from algorithmic consumption
          </p>
        </div>
      </div>

      {/* Log Entry Form Modal / Accordion */}
      {showForm && (
        <form
          onSubmit={handleAddEntry}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-in fade-in"
        >
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Log New Voluntary Screen-Time Measurement
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Baseline Screen Time (mins/day)
              </label>
              <input
                type="number"
                min={0}
                max={720}
                value={baselineMins}
                onChange={(e) => setBaselineMins(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Today&apos;s Measured Screen Time (mins)
              </label>
              <input
                type="number"
                min={0}
                max={720}
                value={currentMins}
                onChange={(e) => setCurrentMins(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Reflection Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Swapped phone before bed with 30 mins sketching..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
            >
              Save Entry
            </button>
          </div>
        </form>
      )}

      {/* Screen Time Trend Area Chart */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Daily Screen Time vs Baseline (Minutes)
          </h2>
          <p className="text-xs text-slate-400">
            Downward trend shows reduced passive scrolling over time
          </p>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
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
              <Area type="monotone" dataKey="current" stroke="#4F46E5" fillOpacity={1} fill="url(#colorCurrent)" name="Current Screen Time (m)" />
              <Area type="monotone" dataKey="saved" stroke="#10B981" fillOpacity={1} fill="url(#colorSaved)" name="Reclaimed Time (m)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History Log Table */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Measurement History
        </h2>
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {entries.map((ent) => (
              <div key={ent.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {formatDate(ent.entry_date)}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                      +{ent.saved_mins} mins reclaimed
                    </span>
                  </div>
                  {ent.notes && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
                      &ldquo;{ent.notes}&rdquo;
                    </p>
                  )}
                </div>
                <div className="text-right text-xs text-slate-400">
                  <span>Current: <strong>{ent.current_mins}m</strong></span>
                  <span className="block text-[11px]">Baseline: {ent.baseline_mins}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance & Honesty Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
        <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          <strong>Self-Reported Screen Time:</strong> A web application cannot directly access system-wide device usage statistics through ordinary browser APIs. All screen-time values are voluntarily entered by the user to support intentional habit reflection.
        </p>
      </div>
    </div>
  );
}
