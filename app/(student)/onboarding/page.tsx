'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Palette,
  Target,
  Clock,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { DataStore } from '@/services/dataStore';

export default function StudentOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const currentUser = DataStore.getCurrentUser();
  const hobbies = DataStore.getHobbies();
  const skills = DataStore.getSkills();

  // Step 1: Basic Profile
  const [fullName, setFullName] = useState(currentUser.full_name || 'Alex Morgan');
  const [username, setUsername] = useState(currentUser.username || 'alex_creator');
  const [bio, setBio] = useState(currentUser.bio || 'Digital illustrator & coding enthusiast.');
  const [location, setLocation] = useState(currentUser.location || 'Austin, TX');
  const [educationLevel, setEducationLevel] = useState(currentUser.education_level || 'High School Senior');

  // Step 2: Select Interests
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(['hob-01', 'hob-02']);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['skl-03', 'skl-01']);

  // Step 3: Define Goals
  const [goals, setGoals] = useState<string[]>([
    'Improve a hobby',
    'Build a portfolio',
    'Find scholarships',
  ]);

  // Step 4: Practice Goal
  const [dailyMinutes, setDailyMinutes] = useState<number>(currentUser.daily_goal_minutes || 30);
  const [baselineScreenTime, setBaselineScreenTime] = useState<number>(currentUser.baseline_screen_time_mins || 240);

  // Step 5: Privacy
  const [isPrivate, setIsPrivate] = useState(currentUser.is_private || false);
  const [isDiscoverable, setIsDiscoverable] = useState(currentUser.is_discoverable ?? true);
  const [allowOrgContact, setAllowOrgContact] = useState(currentUser.allow_org_contact ?? true);

  const availableGoals = [
    'Improve a hobby',
    'Build a portfolio',
    'Find scholarships',
    'Find internships',
    'Join clubs & collectives',
    'Find mentors',
    'Find paid projects & commissions',
  ];

  const handleToggleHobby = (id: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  };

  const handleToggleSkill = (id: string) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleToggleGoal = (goal: string) => {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleFinishOnboarding = () => {
    DataStore.updateProfile(currentUser.id, {
      full_name: fullName,
      username,
      bio,
      location,
      education_level: educationLevel,
      daily_goal_minutes: dailyMinutes,
      baseline_screen_time_mins: baselineScreenTime,
      is_private: isPrivate,
      is_discoverable: isDiscoverable,
      allow_org_contact: allowOrgContact,
    });

    // Save selected hobbies
    selectedHobbies.forEach((hId) => {
      DataStore.addUserHobby(currentUser.id, hId, dailyMinutes);
    });

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full">
        {/* Progress Bar & Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Student Onboarding &bull; Step {step} of 6</span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-4">
            <div
              className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {step === 1 && 'Basic Profile'}
            {step === 2 && 'Choose Your Passions'}
            {step === 3 && 'Define Your Goals'}
            {step === 4 && 'Set Your Daily Practice Target'}
            {step === 5 && 'Privacy & Discoverability'}
            {step === 6 && "You're All Set!"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {step === 1 && 'Help verified organizations and mentors get to know your background.'}
            {step === 2 && 'Select the hobbies you want to develop into verified skills.'}
            {step === 3 && 'Tell us what opportunities and milestones you want to unlock.'}
            {step === 4 && 'Replace passive scrolling with deliberate, focused practice.'}
            {step === 5 && 'You maintain total control over your portfolio visibility.'}
            {step === 6 && 'Your personalized dashboard is ready to track your journey.'}
          </p>
        </div>

        {/* Step Cards */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          {/* STEP 1: Basic Profile */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Bio (Max 280 characters)
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    General Location (City, State)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Austin, TX"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Education Level
                  </label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="Middle School">Middle School</option>
                    <option value="High School Freshman">High School Freshman</option>
                    <option value="High School Sophomore">High School Sophomore</option>
                    <option value="High School Junior">High School Junior</option>
                    <option value="High School Senior">High School Senior</option>
                    <option value="College Undergraduate">College Undergraduate</option>
                    <option value="Self-Taught / Other">Self-Taught / Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Interests & Skills */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Select Hobbies to Practice (Pick at least 1):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {hobbies.map((hob) => {
                    const selected = selectedHobbies.includes(hob.id);
                    return (
                      <button
                        key={hob.id}
                        type="button"
                        onClick={() => handleToggleHobby(hob.id)}
                        className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          selected
                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-xs font-bold">{hob.name}</span>
                        {selected ? (
                          <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Skills you want to demonstrate or learn:
                </label>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skl) => {
                    const selected = selectedSkills.includes(skl.id);
                    return (
                      <button
                        key={skl.id}
                        type="button"
                        onClick={() => handleToggleSkill(skl.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          selected
                            ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        {skl.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Define Goals */}
          {step === 3 && (
            <div className="space-y-3 animate-in fade-in">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                What do you want to achieve on ShowUp!?
              </label>
              {availableGoals.map((g) => {
                const checked = goals.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleToggleGoal(g)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      checked
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm'
                    }`}
                  >
                    <span className="text-xs">{g}</span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        checked
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {checked && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* STEP 4: Set Practice Target */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Daily Practice Commitment:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[15, 30, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDailyMinutes(mins)}
                      className={`py-4 rounded-2xl border text-center transition-all ${
                        dailyMinutes === mins
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="block text-xl font-black">{mins}</span>
                      <span className="text-[11px] font-semibold text-slate-500">mins / day</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Estimated Current Social-Media Screen Time (minutes/day):
                </label>
                <input
                  type="number"
                  min={0}
                  max={720}
                  step={15}
                  value={baselineScreenTime}
                  onChange={(e) => setBaselineScreenTime(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  ShowUp! will calculate your annualized reclaimed hours as you complete focus blocks!
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: Privacy */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="chk-discoverable"
                  checked={isDiscoverable}
                  onChange={(e) => setIsDiscoverable(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <label htmlFor="chk-discoverable" className="text-xs font-bold text-slate-900 dark:text-white cursor-pointer">
                    Discoverable Portfolio
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Allow verified organizations to find your completed projects and invite you to relevant scholarships or internships.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="chk-allow-org"
                  checked={allowOrgContact}
                  onChange={(e) => setAllowOrgContact(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <label htmlFor="chk-allow-org" className="text-xs font-bold text-slate-900 dark:text-white cursor-pointer">
                    Allow Verified Organization Invitations
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Receive platform-controlled invitation notifications when an organization thinks you are a great match for their opening.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Confirmation */}
          {step === 6 && (
            <div className="text-center py-4 space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Ready to Grow, {fullName.split(' ')[0]}!
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Your profile is configured with a {dailyMinutes}-minute daily target across {selectedHobbies.length} selected hobbies. Next, visit your dashboard to launch your first focus session!
              </p>
            </div>
          )}

          {/* Nav Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <button
                type="button"
                id="onboarding-next-btn"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                id="onboarding-finish-btn"
                onClick={handleFinishOnboarding}
                className="px-8 py-3 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all hover:scale-102"
              >
                <span>Open Personalized Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
