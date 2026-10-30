'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2, Mail, Building2 } from 'lucide-react';
import { DataStore } from '@/services/dataStore';

interface ContactTalentModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: {
    id: string;
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

export function ContactTalentModal({ isOpen, onClose, creator }: ContactTalentModalProps) {
  const [opportunityTitle, setOpportunityTitle] = useState('Program & Project Invitation');
  const [message, setMessage] = useState(
    "We reviewed your portfolio on ShowUp! and were impressed by your talent. We'd love to connect with you regarding an upcoming opportunity."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opportunityTitle.trim() || !message.trim()) return;

    setIsSubmitting(true);
    const currentUser = DataStore.getCurrentUser();

    setTimeout(() => {
      DataStore.sendContactRequest({
        org_id: currentUser.id,
        org_name: currentUser.role === 'organization' ? currentUser.full_name : 'Creative Arts University',
        org_avatar: currentUser.avatar_url || 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&auto=format&fit=crop&q=80',
        creator_id: creator.id,
        opportunity_title: opportunityTitle,
        message: message,
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1600);
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-5 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#0E0830] dark:text-[#c4bbf0]" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Send Organization Inquiry
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#0E0830]/10 text-[#0E0830] dark:text-[#c4bbf0] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Inquiry Sent
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              {creator.full_name} has received your invitation in their notifications and account inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-3.5 space-y-3.5">
            {/* Creator Preview */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <img
                src={creator.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={creator.full_name}
                className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <div className="min-w-0">
                <p className="font-medium text-slate-900 dark:text-white text-xs truncate">
                  {creator.full_name}
                </p>
                <p className="text-[10px] text-slate-400">@{creator.username}</p>
              </div>
            </div>

            {/* Opportunity Title */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Opportunity Subject
              </label>
              <input
                type="text"
                value={opportunityTitle}
                onChange={(e) => setOpportunityTitle(e.target.value)}
                placeholder="e.g. Campus Event Performance or Fellowship"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:border-[#0E0830] outline-hidden"
                required
              />
            </div>

            {/* Message */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Message Details
                </label>
                <span className="text-[10px] text-slate-400">{message.length}/500</span>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                rows={3}
                placeholder="Describe the opportunity..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:border-[#0E0830] outline-hidden resize-none leading-relaxed"
                required
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2 px-3 rounded-lg bg-[#0E0830] hover:bg-[#1a1147] text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : 'Send Inquiry'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
