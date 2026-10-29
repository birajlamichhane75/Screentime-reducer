'use client';

import React, { useState } from 'react';
import { X, Send, Sparkles, CheckCircle2 } from 'lucide-react';
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
  const [opportunityTitle, setOpportunityTitle] = useState('Collaboration Opportunity');
  const [message, setMessage] = useState(
    "We'd love to collaborate with you for an upcoming university event. Your talent is amazing!"
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
      }, 1800);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Contact Talent</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Opportunity Request Sent!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              {creator.full_name} has received your invitation in their notifications inbox.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Creator Preview */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <img
                src={creator.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={creator.full_name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">{creator.full_name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">@{creator.username}</p>
              </div>
            </div>

            {/* Opportunity Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                Opportunity Title
              </label>
              <input
                type="text"
                value={opportunityTitle}
                onChange={(e) => setOpportunityTitle(e.target.value)}
                placeholder="e.g. Campus Event Performance or Internship"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Message */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Message
                </label>
                <span className="text-[11px] text-slate-400">
                  {message.length}/500
                </span>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                rows={4}
                placeholder="Explain the opportunity and why you'd love to connect..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !opportunityTitle.trim() || !message.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Sending Request...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Request</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
