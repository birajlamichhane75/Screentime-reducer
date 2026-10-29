'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DataStore } from '@/services/dataStore';
import { OrgType, Organization } from '@/types';

export default function OrgOnboardingPage() {
  const router = useRouter();
  const currentUser = DataStore.getCurrentUser();

  const [name, setName] = useState('');
  const [orgType, setOrgType] = useState<OrgType>('company');
  const [website, setWebsite] = useState('');
  const [officialEmail, setOfficialEmail] = useState(currentUser.email || '');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contactName, setContactName] = useState(currentUser.full_name || '');
  const [contactPhone, setContactPhone] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const orgs = DataStore.getOrganizations();
      const newOrg: Organization = {
        id: `org-${Date.now()}`,
        user_id: currentUser.id,
        name,
        org_type: orgType,
        website,
        official_email: officialEmail,
        description,
        logo_url: logoUrl || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80',
        location,
        contact_name: contactName,
        contact_phone: contactPhone,
        verification_status: 'pending', // Pending admin verification
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      orgs.push(newOrg);
      localStorage.setItem('sb_organizations', JSON.stringify(orgs));
      DataStore.updateProfile(currentUser.id, { role: 'organization' });

      setIsSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Organization Registration & Verification</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Register Your Organization
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Connect young talent with scholarships, internships, mentorships, and student club opportunities.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          {submitted ? (
            <div className="text-center py-6 space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Verification Request Submitted
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{name}</strong>! Your organization profile has been registered with status <strong className="text-amber-600 font-semibold">pending</strong>. Platform administrators will review your credentials to ensure young user safety before your opportunities can be published publicly.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  id="go-to-org-dashboard-btn"
                  onClick={() => router.push('/org-dashboard')}
                  className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
                >
                  <span>Go to Organization Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Vertex Creative Labs"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Organization Type
                  </label>
                  <select
                    value={orgType}
                    onChange={(e) => setOrgType(e.target.value as OrgType)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="university">University / Higher Ed</option>
                    <option value="student_club">Student Club / Guild</option>
                    <option value="company">Company / Startup</option>
                    <option value="nonprofit">Nonprofit Foundation</option>
                    <option value="community">Community Collective</option>
                    <option value="other">Other Organization</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Official Website
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://vertexlabs.edu"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Institutional Email
                  </label>
                  <input
                    type="email"
                    value={officialEmail}
                    onChange={(e) => setOfficialEmail(e.target.value)}
                    placeholder="scouts@vertexlabs.edu"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Organization Description & Mission
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your student initiatives, mission, and the opportunities you plan to offer..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    HQ Location (City, State/Country)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Denver, CO"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Authorized Representative
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Full Representative Name"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="submit-org-onboarding-btn"
                disabled={isSubmitting}
                className="w-full mt-4 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Submitting Application...' : 'Submit Verification Request'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
