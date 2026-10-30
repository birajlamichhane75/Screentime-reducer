'use client';

import { WorkSelectionEmail, VideoPost, Profile } from '@/types';

const STORAGE_KEYS = {
  SENT_EMAILS: 'sb_sent_emails',
};

const memoryFallback: Record<string, any> = {};

function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return memoryFallback[key] !== undefined ? memoryFallback[key] : defaultValue;
  }
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    memoryFallback[key] = value;
    return;
  }
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Failed to save email to localStorage', err);
  }
}

export class EmailService {
  /**
   * Resolves recipient email from creator profile or account
   */
  static getRecipientEmail(creator: { email?: string; username: string }): string {
    if (creator.email && creator.email.includes('@')) {
      return creator.email;
    }
    // Standard mock domain fallback
    const userHandle = creator.username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return `${userHandle}@talent.showup.dev`;
  }

  /**
   * Sends an email notification to the creator when an organization selects their work.
   */
  static sendWorkSelectionEmail(params: {
    creator: {
      id: string;
      full_name: string;
      username: string;
      email?: string;
    };
    organization: {
      id: string;
      name: string;
      official_email?: string;
    };
    work: {
      id: string;
      title?: string;
      caption: string;
      category: string;
    };
    notes?: string;
  }): WorkSelectionEmail {
    const recipientEmail = this.getRecipientEmail(params.creator);
    const workTitle = params.work.title || params.work.caption.slice(0, 48) || 'Creative Project';

    const email: WorkSelectionEmail = {
      id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      recipient_email: recipientEmail,
      recipient_name: params.creator.full_name,
      recipient_id: params.creator.id,
      org_id: params.organization.id,
      org_name: params.organization.name,
      org_email: params.organization.official_email || 'admissions@creativearts.edu',
      work_id: params.work.id,
      work_title: workTitle,
      work_category: params.work.category,
      subject: `[ShowUp!] ${params.organization.name} selected your work: "${workTitle}"`,
      body_text: `Hi ${params.creator.full_name},

Great news! ${params.organization.name} discovered your talent on ShowUp! and selected your work "${workTitle}" (${params.work.category}) for upcoming opportunities.

Our verified organizations curate and shortlist talent directly. When an organization selects your work, it is saved into their scouting pipeline. They may reach out with invitations for scholarships, internships, or creative collaborations.

Details:
• Organization: ${params.organization.name}
• Selected Work: ${workTitle}
• Category: ${params.work.category}
• Date Selected: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
${params.notes ? `• Note from Organization: "${params.notes}"` : ''}

You can log into ShowUp! anytime to view your portfolio and organization interest.

Best regards,
The ShowUp! Talent Team
https://showup.dev`,
      sent_at: new Date().toISOString(),
      status: 'delivered',
    };

    // Persist email in local storage
    const allEmails = this.getAllEmails();
    allEmails.unshift(email);
    setStorage(STORAGE_KEYS.SENT_EMAILS, allEmails);

    // Development / Console log to confirm dispatch
    console.info(
      `%c[EMAIL DISPATCHED] To: ${recipientEmail} | Subject: ${email.subject}`,
      'color: #2563eb; font-weight: bold;'
    );

    return email;
  }

  /**
   * Retrieves all sent emails from storage
   */
  static getAllEmails(): WorkSelectionEmail[] {
    return getStorage<WorkSelectionEmail[]>(STORAGE_KEYS.SENT_EMAILS, [
      {
        id: 'email-sample-001',
        recipient_email: 'sarah@dance.skillbridge.dev',
        recipient_name: 'Sarah Johnson',
        recipient_id: 'usr-student-001',
        org_id: 'usr-org-001',
        org_name: 'Creative Arts University',
        org_email: 'admissions@creativearts.edu',
        work_id: 'vid-001',
        work_title: 'Contemporary Dance Routine',
        work_category: 'Dance',
        subject: '[ShowUp!] Creative Arts University selected your work: "Contemporary Dance Routine"',
        body_text: `Hi Sarah Johnson,\n\nGreat news! Creative Arts University discovered your talent on ShowUp! and selected your work "Contemporary Dance Routine" (Dance) for upcoming opportunities.\n\nOur verified organizations curate and shortlist talent directly. When an organization selects your work, it is saved into their scouting pipeline.\n\nBest regards,\nThe ShowUp! Talent Team`,
        sent_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        status: 'delivered',
      },
    ]);
  }

  /**
   * Retrieves emails specifically sent to a user by email or user ID
   */
  static getEmailsForUser(userEmailOrId: string): WorkSelectionEmail[] {
    const all = this.getAllEmails();
    const query = userEmailOrId.toLowerCase().trim();
    return all.filter(
      (e) =>
        e.recipient_id === userEmailOrId ||
        e.recipient_email.toLowerCase() === query ||
        (query.includes('@') && e.recipient_email.toLowerCase().includes(query))
    );
  }
}

