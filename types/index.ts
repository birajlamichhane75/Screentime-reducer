export type UserRole = 'student' | 'organization' | 'admin';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type SessionStatus = 'started' | 'paused' | 'completed' | 'cancelled';

export type ProjectVisibility = 'public' | 'private' | 'discoverable';

export type ChallengeStatus = 'draft' | 'active' | 'archived';

export type SubmissionStatus = 'submitted' | 'under_review' | 'accepted' | 'rejected';

export type OrgType = 'university' | 'student_club' | 'company' | 'nonprofit' | 'community' | 'other';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type OpportunityType =
  | 'scholarship'
  | 'internship'
  | 'mentorship'
  | 'competition'
  | 'club_recruitment'
  | 'paid_project'
  | 'volunteer'
  | 'collaboration';

export type LocationType = 'remote' | 'hybrid' | 'in_person';

export type OpportunityStatus = 'draft' | 'published' | 'closed' | 'archived';

export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'shortlisted'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export type RewardEventType =
  | 'session_completed'
  | 'project_created'
  | 'challenge_completed'
  | 'milestone_reached'
  | 'streak_bonus';

export type NotificationType =
  | 'achievement'
  | 'opportunity'
  | 'application'
  | 'challenge'
  | 'verification'
  | 'system';

export interface Profile {
  id: string;
  email?: string;
  role: UserRole;
  full_name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  education_level?: string;
  daily_goal_minutes: number;
  is_private: boolean;
  is_discoverable: boolean;
  allow_org_contact: boolean;
  baseline_screen_time_mins: number;
  created_at: string;
  updated_at: string;
}

export interface Hobby {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  icon_name: string;
  is_active: boolean;
  created_at: string;
}

export interface UserHobby {
  id: string;
  user_id: string;
  hobby_id: string;
  daily_target_mins: number;
  weekly_target_mins: number;
  current_level: ExperienceLevel;
  notes?: string;
  created_at: string;
  hobby?: Hobby;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  experience_level: ExperienceLevel;
  years_exp: number;
  created_at: string;
  skill?: Skill;
}

export interface ActivitySession {
  id: string;
  user_id: string;
  hobby_id: string;
  goal_text?: string;
  duration_seconds: number;
  status: SessionStatus;
  started_at: string;
  completed_at?: string;
  notes?: string;
  evidence_url?: string;
  reward_awarded: boolean;
  created_at: string;
  hobby?: Hobby;
}

export interface ProjectMedia {
  id: string;
  project_id: string;
  media_url: string;
  media_type: 'image' | 'video' | 'document';
  file_size_bytes?: number;
  sort_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  hobby_id: string;
  title: string;
  description: string;
  skills_demonstrated: string[];
  external_url?: string;
  github_url?: string;
  visibility: ProjectVisibility;
  project_date: string;
  created_at: string;
  updated_at: string;
  media?: ProjectMedia[];
  hobby?: Hobby;
  author?: Profile;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: ExperienceLevel;
  duration_mins: number;
  reward_points: number;
  start_date: string;
  deadline: string;
  submission_requirements: string;
  status: ChallengeStatus;
  created_by?: string;
  created_at: string;
}

export interface ChallengeSubmission {
  id: string;
  challenge_id: string;
  user_id: string;
  title: string;
  description: string;
  evidence_url?: string;
  status: SubmissionStatus;
  review_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  points_awarded: number;
  created_at: string;
  challenge?: Challenge;
  author?: Profile;
}

export interface RewardEvent {
  id: string;
  user_id: string;
  points: number;
  event_type: RewardEventType;
  reference_id?: string;
  reference_type?: string;
  description: string;
  created_at: string;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon_name: string;
  category: string;
  points_threshold: number;
  criteria_type: string;
  criteria_value: number;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  achievement?: Achievement;
}

export interface Organization {
  id: string;
  user_id: string;
  name: string;
  org_type: OrgType;
  website?: string;
  official_email: string;
  description: string;
  logo_url?: string;
  location?: string;
  contact_name: string;
  contact_phone?: string;
  verification_status: VerificationStatus;
  verified_at?: string;
  verified_by?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface Opportunity {
  id: string;
  organization_id: string;
  title: string;
  description: string;
  opportunity_type: OpportunityType;
  required_skills: string[];
  preferred_experience?: string;
  eligibility_criteria?: string;
  location?: string;
  location_type: LocationType;
  compensation_details?: string;
  deadline: string;
  openings_count: number;
  application_instructions?: string;
  status: OpportunityStatus;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
  organization?: Organization;
}

export interface Application {
  id: string;
  opportunity_id: string;
  applicant_id: string;
  status: ApplicationStatus;
  introduction_text?: string;
  review_notes?: string;
  created_at: string;
  updated_at: string;
  opportunity?: Opportunity;
  applicant?: Profile;
  project_ids?: string[];
  projects?: Project[];
}

export interface ScreenTimeEntry {
  id: string;
  user_id: string;
  entry_date: string;
  baseline_mins: number;
  current_mins: number;
  saved_mins: number;
  notes?: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  link_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface ContentReport {
  id: string;
  reporter_id: string;
  reported_item_type: 'project' | 'profile' | 'opportunity' | 'organization';
  reported_item_id: string;
  reason: string;
  details?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  action_taken?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface MatchResult {
  opportunity: Opportunity;
  score: number;
  breakdown: {
    skillOverlap: number;
    portfolioRelevance: number;
    activityEvidence: number;
    preferenceFit: number;
  };
  reasons: string[];
}

export interface VideoPost {
  id: string;
  creator_id: string;
  creator: {
    username: string;
    full_name: string;
    avatar_url?: string;
    is_verified?: boolean;
    bio?: string;
    categories?: string[];
    followers_count?: number;
    following_count?: number;
    videos_count?: number;
    location?: string;
  };
  video_url: string;
  thumbnail_url: string;
  title?: string;
  caption: string;
  category: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  views_count: number;
  duration_seconds?: number;
  duration_formatted?: string;
  is_liked?: boolean;
  is_saved?: boolean;
  created_at: string;
}

export interface SavedCreator {
  id: string;
  org_id: string;
  creator_id: string;
  creator: Profile & {
    talent_categories?: string[];
    followers_count?: number;
    videos_count?: number;
  };
  created_at: string;
}

export interface ContactRequest {
  id: string;
  org_id: string;
  org_name: string;
  org_avatar?: string;
  creator_id: string;
  opportunity_title: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}
