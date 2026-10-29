import { UserRole, Organization, Project, Application } from '@/types';

export function isStudent(role?: UserRole): boolean {
  return role === 'student';
}

export function isOrganization(role?: UserRole): boolean {
  return role === 'organization';
}

export function isAdmin(role?: UserRole): boolean {
  return role === 'admin';
}

export function canPublishOpportunity(organization?: Organization | null): boolean {
  if (!organization) return false;
  return organization.verification_status === 'verified';
}

export function canContactTalent(organization?: Organization | null): boolean {
  if (!organization) return false;
  return organization.verification_status === 'verified';
}

export function canViewProject(
  project: Project,
  viewerUserId?: string,
  viewerRole?: UserRole
): boolean {
  if (viewerRole === 'admin') return true;
  if (project.user_id === viewerUserId) return true;
  if (project.visibility === 'public') return true;
  if (project.visibility === 'discoverable' && viewerRole === 'organization') return true;
  return false;
}

export function canManageApplication(
  application: Application,
  actorUserId?: string,
  actorRole?: UserRole,
  actorOrgId?: string
): boolean {
  if (actorRole === 'admin') return true;
  if (application.applicant_id === actorUserId) return true;
  if (application.opportunity?.organization_id === actorOrgId) return true;
  return false;
}
