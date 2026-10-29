'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Palette,
  Search,
  Plus,
  Trash2,
  Play,
  Clock,
  Briefcase,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { DataStore } from '@/services/dataStore';
import { Hobby, UserHobby, Project } from '@/types';

export default function HobbiesPage() {
  const currentUser = DataStore.getCurrentUser();
  const [allHobbies, setAllHobbies] = useState<Hobby[]>([]);
  const [userHobbies, setUserHobbies] = useState<UserHobby[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    setAllHobbies(DataStore.getHobbies());
    setUserHobbies(DataStore.getUserHobbies(currentUser.id));
    setProjects(DataStore.getProjects(currentUser.id));
  }, [currentUser.id]);

  const handleAddHobby = (hobbyId: string) => {
    DataStore.addUserHobby(currentUser.id, hobbyId, 30);
    setUserHobbies(DataStore.getUserHobbies(currentUser.id));
  };

  const handleRemoveHobby = (hobbyId: string) => {
    DataStore.removeUserHobby(currentUser.id, hobbyId);
    setUserHobbies(DataStore.getUserHobbies(currentUser.id));
  };

  const categories = ['All', ...new Set(allHobbies.map((h) => h.category))];

  const filteredHobbies = allHobbies.filter((h) => {
    const matchesQuery =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || h.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My Hobbies & Disciplines
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your active practice pursuits, daily goals, and associated portfolio artifacts.
          </p>
        </div>

        <Link
          href="/focus"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Launch Focus Session</span>
        </Link>
      </div>

      {/* Active User Hobbies Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Active Hobbies ({userHobbies.length})
        </h2>

        {userHobbies.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center">
            <Palette className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              No active hobbies selected yet.
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Browse the library below and add one to start tracking your daily practice.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userHobbies.map((uh) => {
              const hobbyProjects = projects.filter((p) => p.hobby_id === uh.hobby_id);
              return (
                <div
                  key={uh.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                        {uh.hobby?.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveHobby(uh.hobby_id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Remove hobby"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {uh.hobby?.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {uh.hobby?.description}
                    </p>

                    <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        <span>{uh.daily_target_mins}m target/day</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-teal-500" />
                        <span>{hobbyProjects.length} projects</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400 capitalize">
                      Level: <strong className="text-slate-700 dark:text-slate-200">{uh.current_level}</strong>
                    </span>
                    <Link
                      href={`/focus?hobby=${uh.hobby_id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Practice Now</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Explore & Add Hobbies Library */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Discover Hobbies Library
            </h2>
            <p className="text-xs text-slate-400">Add new skills to your daily routine</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search hobbies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Hobbies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredHobbies.map((hob) => {
            const alreadyAdded = userHobbies.some((uh) => uh.hobby_id === hob.id);
            return (
              <div
                key={hob.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {hob.category}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                    {hob.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {hob.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {alreadyAdded ? (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active on profile
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAddHobby(hob.id)}
                      className="w-full py-1.5 rounded-xl border border-indigo-600 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add to My Hobbies
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
