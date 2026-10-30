'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  Mail,
  BookmarkCheck,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { ContactRequest, NotificationItem, WorkSelectionEmail, Profile } from '@/types';

export default function NotificationsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [selectedTab, setSelectedTab] = useState<'All' | 'Emails' | 'Opportunities'>('All');
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [userEmails, setUserEmails] = useState<WorkSelectionEmail[]>([]);
  const [activeEmailModal, setActiveEmailModal] = useState<WorkSelectionEmail | null>(null);

  useEffect(() => {
    const user = DataStore.getCurrentUser();
    setCurrentUser(user);

    const reqs = DataStore.getContactRequests(user.id);
    setContactRequests(reqs);

    const notifs = DataStore.getNotifications(user.id);
    setNotifications(notifs);

    // Retrieve emails dispatched to user's registered account email
    const emails = DataStore.getEmailsForUser(user.email || user.id);
    setUserEmails(emails);

    notifs.forEach((n) => DataStore.markNotificationRead(n.id));
  }, []);

  const accountEmail =
    currentUser?.email || `${currentUser?.username || 'user'}@talent.showup.dev`;

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
            Inbox &amp; Notifications
          </h1>
          <div className="w-6" />
        </div>

        {/* Account Email Badge */}
        <div className="mb-3 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <Mail className="w-3.5 h-3.5 text-[#0E0830] dark:text-[#c4bbf0] shrink-0" />
            <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate">
              {accountEmail}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-[#0E0830]/10 text-[10px] text-[#0E0830] dark:text-[#c4bbf0] font-semibold shrink-0">
            {userEmails.length} Inbox
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
          {(
            [
              { key: 'All', label: 'All Updates' },
              { key: 'Emails', label: `Account Emails (${userEmails.length})` },
              { key: 'Opportunities', label: 'Inquiries' },
            ] as const
          ).map((tab) => {
            const isActive = selectedTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#0E0830] text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* EMAILS TAB */}
        {selectedTab === 'Emails' && (
          <div className="space-y-2.5">
            {userEmails.length > 0 ? (
              userEmails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => setActiveEmailModal(email)}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer shadow-xs transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-[#0E0830] dark:text-[#c4bbf0] font-medium">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{email.org_name}</span>
                    </div>
                    <span className="text-slate-400 text-[10px]">
                      {new Date(email.sent_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {email.subject}
                  </p>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {email.body_text}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
                    <span>Delivered to: {email.recipient_email}</span>
                    <span className="text-[#0E0830] dark:text-[#c4bbf0] font-medium flex items-center gap-0.5">
                      Read Email <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                No selection emails yet. You will receive an email here whenever an organization shortlists your work.
              </div>
            )}
          </div>
        )}

        {/* INQUIRIES TAB */}
        {selectedTab === 'Opportunities' && (
          <div className="space-y-2.5">
            {contactRequests.length > 0 ? (
              contactRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#0E0830] dark:text-[#c4bbf0]" />
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {req.org_name}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    &quot;{req.opportunity_title}&quot;
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {req.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                No direct opportunity inquiries yet.
              </div>
            )}
          </div>
        )}

        {/* ALL TAB */}
        {selectedTab === 'All' && (
          <div className="space-y-2.5">
            {/* Show selection emails first */}
            {userEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => setActiveEmailModal(email)}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer shadow-xs transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-[#0E0830] dark:text-[#c4bbf0] font-medium">
                    <BookmarkCheck className="w-3.5 h-3.5" />
                    <span>Work Selected by {email.org_name}</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#0E0830]/10 text-[#0E0830] dark:text-[#c4bbf0] font-medium">
                    Email Delivered
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  {email.work_title}
                </p>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {email.body_text}
                </p>

                <p className="text-[10px] text-slate-400 pt-0.5">
                  Delivered to account: {email.recipient_email} · Click to read
                </p>
              </div>
            ))}

            {/* General notifications */}
            {notifications.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 space-y-1"
              >
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Email Reader Modal */}
      {activeEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0E0830] dark:text-[#c4bbf0]" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Account Email Notification
                </h2>
              </div>
              <button
                onClick={() => setActiveEmailModal(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              <p>
                <strong className="text-slate-800 dark:text-slate-200">To:</strong>{' '}
                {activeEmailModal.recipient_email}
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">From:</strong>{' '}
                {activeEmailModal.org_name} &lt;notifications@showup.dev&gt;
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">Subject:</strong>{' '}
                {activeEmailModal.subject}
              </p>
              <p>
                <strong className="text-slate-800 dark:text-slate-200">Date:</strong>{' '}
                {new Date(activeEmailModal.sent_at).toLocaleString()}
              </p>
            </div>

            <div className="max-h-60 overflow-y-auto whitespace-pre-wrap text-xs text-slate-700 dark:text-slate-300 leading-relaxed p-3.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200/80 dark:border-slate-800 font-sans">
              {activeEmailModal.body_text}
            </div>

            <button
              onClick={() => setActiveEmailModal(null)}
              className="w-full py-2 rounded-lg bg-[#0E0830] text-white text-xs font-semibold hover:bg-[#1a1147] transition-colors"
            >
              Close Email
            </button>
          </div>
        </div>
      )}
    </MobileShell>
  );
}
