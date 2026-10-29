'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Building,
  ExternalLink,
  ShieldCheck,
  Mail,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DataStore } from '@/services/dataStore';
import { Organization } from '@/types';
import { formatDate } from '@/lib/utils';

export default function VerificationRequestsPage() {
  const currentUser = DataStore.getCurrentUser();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);

  useEffect(() => {
    setOrganizations(DataStore.getOrganizations());
  }, []);

  const handleApprove = (orgId: string) => {
    DataStore.updateOrganizationVerification(orgId, 'verified', currentUser.id);
    setOrganizations(DataStore.getOrganizations());

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleReject = (orgId: string) => {
    DataStore.updateOrganizationVerification(
      orgId,
      'rejected',
      currentUser.id,
      rejectionReason || 'Incomplete institutional verification documentation.'
    );
    setOrganizations(DataStore.getOrganizations());
    setActiveOrgId(null);
    setRejectionReason('');
  };

  const pending = organizations.filter((o) => o.verification_status === 'pending');
  const resolved = organizations.filter((o) => o.verification_status !== 'pending');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Vetting & Approval Pipeline</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Organization Verification Requests
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Carefully review organizational credentials before granting publishing and talent outreach authority.
        </p>
      </div>

      {/* Pending Requests */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
          Pending Reviews ({pending.length})
        </h2>

        {pending.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              All organization verification requests are up to date!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((org) => (
              <div
                key={org.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-black text-base flex items-center justify-center shrink-0">
                      <Building className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {org.name}
                        </h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          {org.org_type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {org.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          {org.official_email}
                        </span>
                      </p>
                    </div>
                  </div>

                  {org.website && (
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 shrink-0"
                    >
                      <span>Official Website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Mission & Opportunities Description:
                  </strong>
                  {org.description}
                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-400">
                    Representative: <strong className="text-slate-700 dark:text-slate-200">{org.contact_name}</strong> {org.contact_phone && `(${org.contact_phone})`} &bull; Requested on {formatDate(org.created_at)}
                  </div>
                </div>

                {/* Decision Actions */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleApprove(org.id)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve Partner Verification</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveOrgId(activeOrgId === org.id ? null : org.id)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-600 text-xs font-bold transition-colors"
                    >
                      Reject...
                    </button>
                  </div>
                </div>

                {activeOrgId === org.id && (
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-3 animate-in fade-in">
                    <label className="block text-xs font-bold text-rose-800 dark:text-rose-300">
                      Rejection Reason (Provided to applicant):
                    </label>
                    <input
                      type="text"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="e.g. Non-institutional email or incomplete organizational website."
                      className="w-full px-3 py-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveOrgId(null)}
                        className="px-3 py-1.5 text-xs text-slate-500 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(org.id)}
                        className="px-4 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolved / Verified Organizations */}
      <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
          Verified Organizations ({resolved.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resolved.map((org) => (
            <div
              key={org.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {org.name}
                  </h3>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      org.verification_status === 'verified'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}
                  >
                    {org.verification_status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {org.location} &bull; {org.official_email}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
