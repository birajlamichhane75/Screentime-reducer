'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookmarkCheck,
  Mail,
  ExternalLink,
  Trash2,
  CheckCircle2,
  Building2,
  Info,
  X,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { SelectedWork, Profile, WorkSelectionEmail } from '@/types';

export default function SelectedWorksPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [selectedWorks, setSelectedWorks] = useState<SelectedWork[]>([]);
  const [previewEmail, setPreviewEmail] = useState<WorkSelectionEmail | null>(null);

  useEffect(() => {
    const user = DataStore.getCurrentUser();
    setCurrentUser(user);

    const isOrg = user.role === 'organization';
    const all = DataStore.getSelectedWorks();
    if (isOrg) {
      setSelectedWorks(all.filter((s) => s.org_id === user.id || !s.org_id));
    } else {
      setSelectedWorks(all.filter((s) => s.creator_id === user.id || s.creator_email === user.email));
    }
  }, []);

  const isOrg = currentUser?.role === 'organization';

  const handleRemoveSelection = (work: SelectedWork) => {
    if (!currentUser) return;
    DataStore.selectWork({
      orgId: work.org_id,
      orgName: work.org_name,
      videoId: work.video_id,
    });
    setSelectedWorks((prev) => prev.filter((s) => s.id !== work.id));
  };

  const handleOpenEmailPreview = (work: SelectedWork) => {
    const emails = DataStore.getEmailsForUser(work.creator_email);
    const found = emails.find((e) => e.work_id === work.video_id) || emails[0];
    if (found) {
      setPreviewEmail(found);
    } else {
      setPreviewEmail({
        id: `email-preview-${work.id}`,
        recipient_email: work.creator_email,
        recipient_name: work.creator_name,
        recipient_id: work.creator_id,
        org_id: work.org_id,
        org_name: work.org_name,
        work_id: work.video_id,
        work_title: work.work_title,
        work_category: work.work_category,
        subject: `[ShowUp!] ${work.org_name} selected your work: "${work.work_title}"`,
        body_text: `Hi ${work.creator_name},\n\nGreat news! ${work.org_name} reviewed your work on ShowUp! and selected "${work.work_title}" for upcoming program opportunities.\n\nDelivered to: ${work.creator_email}`,
        sent_at: work.selected_at,
        status: 'delivered',
      });
    }
  };

  return (
    <MobileShell>
      <div className="flex flex-col min-h-full px-4 pt-3 pb-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3">
          <Link
            href="/feed"
            className="p-1.5 -ml-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-semibold text-xs text-slate-900 dark:text-white">
            {isOrg ? 'Organization Shortlist' : 'Selected Works'}
          </h1>
          <div className="w-6" />
        </div>

        {/* Relaxing Context Pill */}
        <div className="mb-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#0E0830] dark:text-[#c4bbf0] shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 dark:text-slate-300">
            {isOrg ? (
              <span>
                Works you have selected and shortlisted. An email notification was automatically sent to each creator&apos;s registered email when selected.
              </span>
            ) : (
              <span>
                Projects selected by verified scouting organizations. You receive an email in your account inbox whenever an organization selects your work.
              </span>
            )}
          </div>
        </div>

        {/* Selected Works List */}
        {selectedWorks.length > 0 ? (
          <div className="space-y-3">
            {selectedWorks.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                    <img
                      src={item.thumbnail_url}
                      alt={item.work_title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/60 text-white text-[8px] font-mono">
                      {item.work_category}
                    </span>
                  </div>

                  <div className="min-w-0 space-y-1">
                    <h2 className="font-semibold text-xs text-slate-900 dark:text-white line-clamp-1">
                      {item.work_title}
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Creator: <strong className="font-medium text-slate-700 dark:text-slate-300">{item.creator_name}</strong>
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      Account Email: {item.creator_email}
                    </p>

                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="inline-flex items-center gap-1 text-[9px] font-medium px-2 py-0.5 rounded bg-[#0E0830]/10 text-[#0E0830] dark:text-[#c4bbf0] border border-[#0E0830]/20">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Selected by {item.org_name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleOpenEmailPreview(item)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
                    title="View notification email delivered to user"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#0E0830] dark:text-[#c4bbf0]" />
                    <span>View Email</span>
                  </button>

                  <Link
                    href={`/video/${item.video_id}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="View video"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  {isOrg && (
                    <button
                      onClick={() => handleRemoveSelection(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                      title="Remove from shortlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-2">
            <BookmarkCheck className="w-8 h-8 text-slate-300 mx-auto" />
            <h2 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              No selected works yet
            </h2>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              {isOrg
                ? 'Browse the talent feed and select student works to shortlist them for opportunities.'
                : 'When organizations select your work, they will appear here along with confirmation emails.'}
            </p>
            <div className="pt-2">
              <Link
                href="/feed"
                className="inline-block px-3 py-1.5 rounded-lg bg-[#0E0830] text-white text-xs font-semibold hover:bg-[#1a1147] transition-colors shadow-xs"
              >
                Go to Feed
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Email Preview Modal */}
      {previewEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0E0830] dark:text-[#c4bbf0]" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Email Delivered to User Account
                </h2>
              </div>
              <button
                onClick={() => setPreviewEmail(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              <p>
                <strong className="text-slate-800 dark:text-slate-200">Recipient Account:</strong> {previewEmail.recipient_email}
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">Sender:</strong> {previewEmail.org_name} via ShowUp!
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">Subject:</strong> {previewEmail.subject}
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">Delivered At:</strong> {new Date(previewEmail.sent_at).toLocaleString()}
              </p>
            </div>

            <div className="max-h-60 overflow-y-auto whitespace-pre-wrap text-xs text-slate-700 dark:text-slate-300 leading-relaxed p-3.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200/80 dark:border-slate-800 font-sans">
              {previewEmail.body_text}
            </div>

            <button
              onClick={() => setPreviewEmail(null)}
              className="w-full py-2 rounded-lg bg-[#0E0830] text-white text-xs font-semibold hover:bg-[#1a1147] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </MobileShell>
  );
}
