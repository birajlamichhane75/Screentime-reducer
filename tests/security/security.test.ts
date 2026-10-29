import { describe, it, expect } from 'vitest';
import {
  canPublishOpportunity,
  canContactTalent,
  canViewProject,
  canManageApplication,
} from '@/lib/permissions';
import { Organization, Project, Application } from '@/types';

describe('Security & RBAC Enforcement', () => {
  const verifiedOrg: Organization = {
    id: 'org-verified',
    user_id: 'user-org-1',
    name: 'Verified Labs',
    org_type: 'company',
    official_email: 'scouts@verified.org',
    description: 'Vetted partner',
    contact_name: 'Jane Doe',
    verification_status: 'verified',
    created_at: '',
    updated_at: '',
  };

  const pendingOrg: Organization = {
    ...verifiedOrg,
    id: 'org-pending',
    verification_status: 'pending',
  };

  it('allows verified organizations to publish opportunities and contact talent', () => {
    expect(canPublishOpportunity(verifiedOrg)).toBe(true);
    expect(canContactTalent(verifiedOrg)).toBe(true);
  });

  it('blocks unverified organizations from publishing opportunities or contacting talent', () => {
    expect(canPublishOpportunity(pendingOrg)).toBe(false);
    expect(canContactTalent(pendingOrg)).toBe(false);
    expect(canPublishOpportunity(null)).toBe(false);
  });

  it('enforces project visibility privacy boundaries', () => {
    const privateProject: Project = {
      id: 'proj-priv',
      user_id: 'student-owner',
      hobby_id: 'hob-1',
      title: 'Private Sketchbook',
      description: 'Draft notes',
      skills_demonstrated: ['Drawing'],
      visibility: 'private',
      project_date: '2026-10-20',
      created_at: '',
      updated_at: '',
    };

    // Owner can view
    expect(canViewProject(privateProject, 'student-owner', 'student')).toBe(true);

    // Another student cannot view
    expect(canViewProject(privateProject, 'other-student', 'student')).toBe(false);

    // An organization cannot view private project
    expect(canViewProject(privateProject, 'org-user', 'organization')).toBe(false);

    // Admin can view for safety moderation
    expect(canViewProject(privateProject, 'admin-user', 'admin')).toBe(true);
  });

  it('allows discoverable projects to be viewed by vetted organizations', () => {
    const discoverableProject: Project = {
      id: 'proj-disc',
      user_id: 'student-owner',
      hobby_id: 'hob-1',
      title: 'Character Design Portfolio',
      description: 'Discoverable work',
      skills_demonstrated: ['Digital Painting'],
      visibility: 'discoverable',
      project_date: '2026-10-20',
      created_at: '',
      updated_at: '',
    };

    // Verified organization can view discoverable work
    expect(canViewProject(discoverableProject, 'org-user', 'organization')).toBe(true);

    // Unrelated student cannot browse private discoverable portfolio directly
    expect(canViewProject(discoverableProject, 'other-student', 'student')).toBe(false);
  });
});
