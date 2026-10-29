'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Briefcase,
  ArrowLeft,
  ArrowRight,
  Upload,
  Sparkles,
  Link as LinkIcon,
  Code2,
  Globe,
  Lock,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DataStore } from '@/services/dataStore';
import { Hobby, Skill, Project } from '@/types';

export default function NewProjectPage() {
  const router = useRouter();
  const currentUser = DataStore.getCurrentUser();
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);

  const [title, setTitle] = useState('');
  const [hobbyId, setHobbyId] = useState('');
  const [description, setDescription] = useState('');
  const [skillsInput, setSkillsInput] = useState('Digital Painting, Color Grading');
  const [externalUrl, setExternalUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [mediaUrl, setMediaUrl] = useState(
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80'
  );
  const [visibility, setVisibility] = useState<Project['visibility']>('discoverable');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const h = DataStore.getHobbies();
    setHobbies(h);
    if (h.length > 0) setHobbyId(h[0].id);
    setAllSkills(DataStore.getSkills());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !hobbyId || !description) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const skillsArray = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const created = DataStore.createProject(currentUser.id, {
        title,
        description,
        hobby_id: hobbyId,
        skills_demonstrated: skillsArray,
        external_url: externalUrl || undefined,
        github_url: githubUrl || undefined,
        visibility,
        media_url: mediaUrl || undefined,
      });

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });

      setIsSubmitting(false);
      router.push('/portfolio');
    }, 400);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portfolio</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Add Project to Portfolio
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Showcase tangible evidence of your skills to partner organizations and mentors.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Project Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Atmospheric Concept Study: Solar Observatory"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          />
        </div>

        {/* Hobby Category */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Hobby Category
          </label>
          <select
            value={hobbyId}
            onChange={(e) => setHobbyId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          >
            {hobbies.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.category})
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Description & Process
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you created, the tools used, challenges overcome, and the principles applied..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          />
        </div>

        {/* Skills Demonstrated */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Skills Demonstrated (comma separated)
          </label>
          <input
            type="text"
            required
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="e.g. React & Next.js, TypeScript, UI/UX Design"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
          />
        </div>

        {/* Media / Image URL */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Media / Evidence Image URL
          </label>
          <div className="relative">
            <Upload className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... or image link"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            In production connected to Supabase, this directly uploads to private Storage with signed delivery tokens.
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Live Preview / External Link (Optional)
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://myproject.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              GitHub Repository (Optional)
            </label>
            <div className="relative">
              <Code2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>
        </div>

        {/* Visibility */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Project Visibility
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setVisibility('discoverable')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                visibility === 'discoverable'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <Eye className="w-4 h-4 mb-1" />
              <p className="text-xs font-bold">Discoverable</p>
              <p className="text-[10px] text-slate-400">Vetted orgs only</p>
            </button>

            <button
              type="button"
              onClick={() => setVisibility('public')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                visibility === 'public'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <Globe className="w-4 h-4 mb-1" />
              <p className="text-xs font-bold">Public</p>
              <p className="text-[10px] text-slate-400">Visible to all</p>
            </button>

            <button
              type="button"
              onClick={() => setVisibility('private')}
              className={`p-3 rounded-2xl border text-left transition-all ${
                visibility === 'private'
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <Lock className="w-4 h-4 mb-1" />
              <p className="text-xs font-bold">Private</p>
              <p className="text-[10px] text-slate-400">Only you</p>
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="submit"
            id="publish-project-btn"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isSubmitting ? 'Publishing...' : 'Publish to Portfolio (+20 pts)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
