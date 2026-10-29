'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Building2,
  Sparkles,
  Trophy,
  CheckCircle2,
  Mail,
  Bookmark,
  Bell,
  Eye,
} from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { DataStore } from '@/services/dataStore';
import { ContactRequest, NotificationItem } from '@/types';

export default function NotificationsPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'All' | 'Opportunities' | 'System'>('All');
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const currentUser = DataStore.getCurrentUser();
    const reqs = DataStore.getContactRequests(currentUser.id);
    setContactRequests(reqs);

    const notifs = DataStore.getNotifications(currentUser.id);
    setNotifications(notifs);

    // Mark as read
    notifs.forEach((n) => DataStore.markNotificationRead(n.id));
  }, []);

  interface DisplayNotificationItem {
    id: string;
    title: string;
    subtitle: string;
    message?: string;
    type: string;
    timestamp: string;
    avatar?: string;
    isOpportunity: boolean;
  }

  const opportunityItems: DisplayNotificationItem[] = contactRequests.map((req) => ({
    id: req.id,
    title: `${req.org_name} sent you an opportunity`,
    subtitle: `"${req.opportunity_title}"`,
    message: req.message,
    type: 'opportunity',
    timestamp: '2 hours ago',
    avatar: req.org_avatar,
    isOpportunity: true,
  }));

  const systemItems: DisplayNotificationItem[] = [
    {
      id: 'sys-01',
      title: 'Your video reached 10K views!',
      subtitle: 'Contemporary freestyle in the studio is trending.',
      message: 'Keep creating and uploading your creative projects.',
      type: 'system',
      timestamp: '3 days ago',
      isOpportunity: false,
    },
    {
      id: 'sys-02',
      title: 'Welcome to SkillBridge',
      subtitle: 'Upload your talent and get discovered by top organizations.',
      message: 'Share your skills with verified universities, clubs, and scouting partners.',
      type: 'system',
      timestamp: '5 days ago',
      isOpportunity: false,
    },
  ];

  const allItems = [...opportunityItems, ...systemItems];

  const displayedItems =
    selectedTab === 'All'
      ? allItems
      : selectedTab === 'Opportunities'
      ? opportunityItems
      : systemItems;

  return (
    <MobileShell>
      <div className="flex flex-col min-h-full px-4 pt-3 pb-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-3">
          <Link
            href="/feed"
            className="p-1.5 -ml-1.5 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-bold text-sm text-slate-900 dark:text-white">
            Notifications
          </h1>
          <div className="w-8" />
        </div>

        {/* Horizontal Filter Tabs: All | Opportunities | System */}
        <div className="flex items-center gap-1.5 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          {(['All', 'Opportunities', 'System'] as const).map((tab) => {
            const isActive = selectedTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Notifications List (Screen 14) */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {displayedItems.map((item) => (
            <div key={item.id} className="py-3.5 flex items-start gap-3 group">
              {/* Icon / Avatar */}
              {item.isOpportunity ? (
                <div className="relative">
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt="Org"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600">
                      <Building2 className="w-5 h-5" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px]">
                    <Sparkles className="w-2.5 h-2.5" />
                  </div>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center text-amber-600">
                  <Trophy className="w-5 h-5" />
                </div>
              )}

              {/* Message Details */}
              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </p>
                <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  {item.subtitle}
                </p>
                {item.message && (
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                    "{item.message}"
                  </p>
                )}
                <p className="text-[9px] text-slate-400 pt-0.5">{item.timestamp}</p>
              </div>

              {/* Action Button */}
              {item.isOpportunity && (
                <button
                  onClick={() =>
                    alert(
                      `Opportunity invitation from ${item.title}:\n\n${item.subtitle}\n\n${item.message}`
                    )
                  }
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-indigo-600 hover:border-indigo-400 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {displayedItems.length === 0 && (
          <div className="py-20 text-center text-slate-400 space-y-2">
            <Bell className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              No notifications in {selectedTab}.
            </p>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
