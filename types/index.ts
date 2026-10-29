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
  | 'streak_bonus'
  | 'reward_claimed'
  | 'work_selected';

export type NotificationType =
  | 'achievement'
  | 'opportunity'
  | 'application'
  | 'challenge'
  | 'verification'
  | 'system';

export type RatingTier = 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
export type RatingCheckpointTitle = RatingTier;

export interface RatingCheckpoint {
  tier: RatingTier;
  level: number;
  title: RatingTier;
  badge: string;
  minScore: number;
  icon: string;
  perk: string;
}

export const RATING_CHECKPOINTS: RatingCheckpoint[] = [
  {
    tier: 'Platinum',
    level: 4,
    title: 'Platinum',
    badge: '💎 Platinum (95-100)',
    minScore: 95,
    icon: 'Diamond',
    perk: '#1 Rank',
  },
  {
    tier: 'Gold',
    level: 3,
    title: 'Gold',
    badge: '🥇 Gold (80-94)',
    minScore: 80,
    icon: 'Award',
    perk: 'Top 3',
  },
  {
    tier: 'Silver',
    level: 2,
    title: 'Silver',
    badge: '🥈 Silver (65-79)',
    minScore: 65,
    icon: 'Shield',
    perk: 'Priority',
  },
  {
    tier: 'Bronze',
    level: 1,
    title: 'Bronze',
    badge: '🥉 Bronze (<65)',
    minScore: 0,
    icon: 'Circle',
    perk: 'Standard',
  },
];

export interface CreatorConsistencyRating {
  score: number; // 0 - 100 DoorDash style score
  tier: RatingTier;
  checkpoint: RatingCheckpoint;
  streak_days: number;
  last_uploaded_at: string;
  avg_interval_hours: number;
  hours_since_last_upload: number;
  total_uploads: number;
  is_daily_active: boolean;
  next_checkpoint_hint: string;
}

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
  consistency_rating?: number;
  rating_checkpoint?: RatingCheckpointTitle;
  upload_streak_days?: number;
  last_uploaded_at?: string;
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
    email?: string;
    avatar_url?: string;
    is_verified?: boolean;
    bio?: string;
    categories?: string[];
    followers_count?: number;
    following_count?: number;
    videos_count?: number;
    selected_works_count?: number;
    location?: string;
    consistency_rating?: number;
    rating_checkpoint?: RatingCheckpointTitle;
    upload_streak_days?: number;
    last_uploaded_at?: string;
  };
  video_url: string;
  thumbnail_url: string;
  title?: string;
  caption: string;
  category: string;
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
  views_count: number;
  duration_seconds?: number;
  duration_formatted?: string;
  is_liked?: boolean;
  is_saved?: boolean;
  is_selected_by_org?: boolean;
  selections_count?: number;
  selected_by?: Array<{
    org_id: string;
    org_name: string;
    selected_at: string;
    email_sent_to?: string;
  }>;
  created_at: string;
}

export interface SelectedWork {
  id: string;
  org_id: string;
  org_name: string;
  video_id: string;
  creator_id: string;
  creator_name: string;
  creator_email: string;
  work_title: string;
  work_category: string;
  video_url: string;
  thumbnail_url: string;
  selected_at: string;
  email_id?: string;
  notes?: string;
}

export interface WorkSelectionEmail {
  id: string;
  recipient_email: string;
  recipient_name: string;
  recipient_id: string;
  org_id: string;
  org_name: string;
  org_email?: string;
  work_id: string;
  work_title: string;
  work_category: string;
  subject: string;
  body_text: string;
  sent_at: string;
  status: 'delivered' | 'sent';
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

export interface CreatorReward {
  id: string;
  title: string;
  category: string;
  icon: string;
  requiredTier: RatingTier;
  minScore: number;
  perkDescription: string;
  valueTag: string;
  status: 'unlocked' | 'claimed' | 'locked';
  claimedAt?: string;
  claimCode?: string;
}
