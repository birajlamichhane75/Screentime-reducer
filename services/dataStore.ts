'use client';

import {
  Profile,
  Hobby,
  Skill,
  UserHobby,
  UserSkill,
  ActivitySession,
  Project,
  Challenge,
  ChallengeSubmission,
  RewardEvent,
  Achievement,
  UserAchievement,
  Organization,
  Opportunity,
  Application,
  ScreenTimeEntry,
  NotificationItem,
  UserRole,
  VideoPost,
  SavedCreator,
  ContactRequest,
  SelectedWork,
  WorkSelectionEmail,
  RatingCheckpoint,
  CreatorConsistencyRating,
  RATING_CHECKPOINTS,
  RatingCheckpointTitle,
  CreatorReward,
} from '@/types';
import { createClient } from '@/lib/supabase/client';
import { EmailService } from './emailService';
import { SupabaseService } from './supabaseService';
import {
  INITIAL_PROFILES,
  INITIAL_HOBBIES,
  INITIAL_SKILLS,
  INITIAL_USER_HOBBIES,
  INITIAL_USER_SKILLS,
  INITIAL_SESSIONS,
  INITIAL_PROJECTS,
  INITIAL_ORGANIZATIONS,
  INITIAL_OPPORTUNITIES,
  INITIAL_CHALLENGES,
  INITIAL_SUBMISSIONS,
  INITIAL_REWARD_EVENTS,
  INITIAL_USER_ACHIEVEMENTS,
  INITIAL_APPLICATIONS,
  INITIAL_SCREEN_TIME_ENTRIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_TALENT_CATEGORIES,
  INITIAL_VIDEOS,
  INITIAL_SAVED_CREATORS,
  INITIAL_CONTACT_REQUESTS,
  INITIAL_SELECTED_WORKS,
  INITIAL_CREATOR_REWARDS,
} from './mockData';
import {
  REWARD_CONFIG,
  DEFAULT_ACHIEVEMENTS,
  canAwardSessionPoints,
  checkNewAchievements,
} from './rewards';

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'sb_current_user_id',
  PROFILES: 'sb_profiles',
  HOBBIES: 'sb_hobbies',
  SKILLS: 'sb_skills',
  USER_HOBBIES: 'sb_user_hobbies',
  USER_SKILLS: 'sb_user_skills',
  SESSIONS: 'sb_sessions',
  PROJECTS: 'sb_projects',
  ORGANIZATIONS: 'sb_organizations',
  OPPORTUNITIES: 'sb_opportunities',
  CHALLENGES: 'sb_challenges',
  SUBMISSIONS: 'sb_submissions',
  REWARD_EVENTS: 'sb_reward_events',
  USER_ACHIEVEMENTS: 'sb_user_achievements',
  APPLICATIONS: 'sb_applications',
  SCREEN_TIME: 'sb_screen_time',
  NOTIFICATIONS: 'sb_notifications',
  VIDEOS: 'sb_videos',
  CATEGORIES: 'sb_categories',
  SAVED_CREATORS: 'sb_saved_creators',
  SELECTED_WORKS: 'sb_selected_works',
  CONTACT_REQUESTS: 'sb_contact_requests',
  CREATOR_REWARDS: 'sb_creator_rewards',
};

const memoryFallback: Record<string, any> = {};

function getStorageItem<T>(key: string, defaultValue: T): T {
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

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    memoryFallback[key] = value;
    return;
  }
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Failed to save to localStorage', err);
  }
}

export class DataStore {
  // Current user management
  static getCurrentUserId(): string {
    return getStorageItem<string>(STORAGE_KEYS.CURRENT_USER_ID, 'usr-student-001');
  }

  static setCurrentUserId(id: string): void {
    setStorageItem(STORAGE_KEYS.CURRENT_USER_ID, id);
  }

  static getCurrentUser(): Profile {
    const userId = this.getCurrentUserId();
    const profiles = this.getProfiles();
    return profiles.find((p) => p.id === userId) || profiles[0] || INITIAL_PROFILES[0];
  }

  static switchRole(role: UserRole): Profile {
    const profiles = this.getProfiles();
    const target = profiles.find((p) => p.role === role);
    if (target) {
      this.setCurrentUserId(target.id);
      return target;
    }
    return this.getCurrentUser();
  }

  // Profiles
  static getProfiles(): Profile[] {
    const rawProfiles = getStorageItem<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    return rawProfiles.map((p) => {
      if (p.role === 'student') {
        const rating = this.getCreatorRating(p.id);
        return {
          ...p,
          consistency_rating: rating.score,
          rating_checkpoint: rating.checkpoint.title,
          upload_streak_days: rating.streak_days,
          last_uploaded_at: rating.last_uploaded_at,
        };
      }
      return p;
    });
  }

  static getProfileById(userId: string): Profile | undefined {
    return this.getProfiles().find((p) => p.id === userId);
  }

  static updateProfile(userId: string, updates: Partial<Profile>): Profile {
    const profiles = this.getProfiles();
    const idx = profiles.findIndex((p) => p.id === userId);
    if (idx === -1) throw new Error('Profile not found');
    const updated = {
      ...profiles[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    profiles[idx] = updated;
    setStorageItem(STORAGE_KEYS.PROFILES, profiles);
    return updated;
  }

  // Hobbies & Skills
  static getHobbies(): Hobby[] {
    return getStorageItem<Hobby[]>(STORAGE_KEYS.HOBBIES, INITIAL_HOBBIES);
  }

  static getSkills(): Skill[] {
    return getStorageItem<Skill[]>(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
  }

  static getUserHobbies(userId: string): UserHobby[] {
    const all = getStorageItem<UserHobby[]>(STORAGE_KEYS.USER_HOBBIES, INITIAL_USER_HOBBIES);
    const hobbies = this.getHobbies();
    return all
      .filter((uh) => uh.user_id === userId)
      .map((uh) => ({
        ...uh,
        hobby: hobbies.find((h) => h.id === uh.hobby_id),
      }));
  }

  static addUserHobby(userId: string, hobbyId: string, dailyTargetMins = 30): UserHobby {
    const all = getStorageItem<UserHobby[]>(STORAGE_KEYS.USER_HOBBIES, INITIAL_USER_HOBBIES);
    const existing = all.find((uh) => uh.user_id === userId && uh.hobby_id === hobbyId);
    if (existing) return existing;

    const hobbies = this.getHobbies();
    const hobby = hobbies.find((h) => h.id === hobbyId);
    const newEntry: UserHobby = {
      id: `uhob-${Date.now()}`,
      user_id: userId,
      hobby_id: hobbyId,
      daily_target_mins: dailyTargetMins,
      weekly_target_mins: dailyTargetMins * 7,
      current_level: 'beginner',
      created_at: new Date().toISOString(),
      hobby,
    };
    all.push(newEntry);
    setStorageItem(STORAGE_KEYS.USER_HOBBIES, all);
    return newEntry;
  }

  static removeUserHobby(userId: string, hobbyId: string): void {
    const all = getStorageItem<UserHobby[]>(STORAGE_KEYS.USER_HOBBIES, INITIAL_USER_HOBBIES);
    const filtered = all.filter((uh) => !(uh.user_id === userId && uh.hobby_id === hobbyId));
    setStorageItem(STORAGE_KEYS.USER_HOBBIES, filtered);
  }

  static getUserSkills(userId: string): UserSkill[] {
    const all = getStorageItem<UserSkill[]>(STORAGE_KEYS.USER_SKILLS, INITIAL_USER_SKILLS);
    const skills = this.getSkills();
    return all
      .filter((us) => us.user_id === userId)
      .map((us) => ({
        ...us,
        skill: skills.find((s) => s.id === us.skill_id),
      }));
  }

  // Focus Sessions
  static getSessions(userId: string): ActivitySession[] {
    const all = getStorageItem<ActivitySession[]>(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
    const hobbies = this.getHobbies();
    return all
      .filter((s) => s.user_id === userId)
      .map((s) => ({
        ...s,
        hobby: hobbies.find((h) => h.id === s.hobby_id),
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static startSession(userId: string, hobbyId: string, durationSeconds: number, goalText?: string): ActivitySession {
    const all = getStorageItem<ActivitySession[]>(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
    const hobbies = this.getHobbies();
    const hobby = hobbies.find((h) => h.id === hobbyId);
    const newSession: ActivitySession = {
      id: `sess-${Date.now()}`,
      user_id: userId,
      hobby_id: hobbyId,
      goal_text: goalText,
      duration_seconds: durationSeconds,
      status: 'started',
      started_at: new Date().toISOString(),
      reward_awarded: false,
      created_at: new Date().toISOString(),
      hobby,
    };
    all.unshift(newSession);
    setStorageItem(STORAGE_KEYS.SESSIONS, all);
    return newSession;
  }

  static completeSession(sessionId: string, notes?: string, evidenceUrl?: string): {
    session: ActivitySession;
    pointsAwarded: number;
    newAchievements: Omit<Achievement, 'id' | 'created_at'>[];
  } {
    const all = getStorageItem<ActivitySession[]>(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
    const idx = all.findIndex((s) => s.id === sessionId);
    if (idx === -1) throw new Error('Session not found');

    const session = all[idx];
    session.status = 'completed';
    session.completed_at = new Date().toISOString();
    session.notes = notes;
    session.evidence_url = evidenceUrl;

    // Calculate points eligibility
    let pointsAwarded = 0;
    if (!session.reward_awarded) {
      const today = new Date().toISOString().slice(0, 10);
      const userRewards = this.getRewardEvents(session.user_id);
      const todaySessionPoints = userRewards
        .filter((r) => r.event_type === 'session_completed' && r.created_at.slice(0, 10) === today)
        .reduce((sum, r) => sum + r.points, 0);

      const check = canAwardSessionPoints(session.duration_seconds, todaySessionPoints);
      if (check.canAward) {
        pointsAwarded = check.points;
        this.addRewardEvent(
          session.user_id,
          pointsAwarded,
          'session_completed',
          session.id,
          `Completed ${Math.round(session.duration_seconds / 60)}-min focused practice session`
        );
        session.reward_awarded = true;
      }
    }

    all[idx] = session;
    setStorageItem(STORAGE_KEYS.SESSIONS, all);

    // Check milestones
    const newAchievements = this.evaluateAchievements(session.user_id);

    return { session, pointsAwarded, newAchievements };
  }

  // Reward Ledger & Achievements
  static getRewardEvents(userId: string): RewardEvent[] {
    const all = getStorageItem<RewardEvent[]>(STORAGE_KEYS.REWARD_EVENTS, INITIAL_REWARD_EVENTS);
    return all
      .filter((r) => r.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static addRewardEvent(
    userId: string,
    points: number,
    eventType: RewardEvent['event_type'],
    referenceId?: string,
    description = ''
  ): RewardEvent {
    const all = getStorageItem<RewardEvent[]>(STORAGE_KEYS.REWARD_EVENTS, INITIAL_REWARD_EVENTS);
    
    // Idempotency check: don't award twice for same reference
    if (referenceId) {
      const existing = all.find((r) => r.user_id === userId && r.reference_id === referenceId && r.event_type === eventType);
      if (existing) return existing;
    }

    const newEvent: RewardEvent = {
      id: `rew-${Date.now()}`,
      user_id: userId,
      points,
      event_type: eventType,
      reference_id: referenceId,
      description,
      created_at: new Date().toISOString(),
    };
    all.unshift(newEvent);
    setStorageItem(STORAGE_KEYS.REWARD_EVENTS, all);
    return newEvent;
  }

  static getCreatorRewards(userId: string): CreatorReward[] {
    const userStorageKey = `${STORAGE_KEYS.CREATOR_REWARDS}_${userId}`;
    const rawRewards = getStorageItem<CreatorReward[]>(userStorageKey, INITIAL_CREATOR_REWARDS);
    const rewards: CreatorReward[] = JSON.parse(JSON.stringify(rawRewards));
    const userRating = this.getCreatorRating(userId);
    const score = userRating.score;

    return rewards.map((r) => {
      if (r.status === 'claimed') return r;
      if (score >= r.minScore) {
        return { ...r, status: 'unlocked' as const };
      }
      return { ...r, status: 'locked' as const };
    });
  }

  static claimCreatorReward(
    userId: string,
    rewardId: string
  ): { success: boolean; reward?: CreatorReward; error?: string } {
    const userStorageKey = `${STORAGE_KEYS.CREATOR_REWARDS}_${userId}`;
    const rawRewards = getStorageItem<CreatorReward[]>(userStorageKey, INITIAL_CREATOR_REWARDS);
    const rewards: CreatorReward[] = JSON.parse(JSON.stringify(rawRewards));
    const index = rewards.findIndex((r) => r.id === rewardId);
    if (index === -1) {
      return { success: false, error: 'Reward not found' };
    }

    const currentReward = rewards[index];
    const userRating = this.getCreatorRating(userId);
    if (userRating.score < currentReward.minScore && currentReward.status !== 'unlocked') {
      return { success: false, error: `Score ${currentReward.minScore} required to claim` };
    }

    const claimCode = `SKILL-${currentReward.category.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const updatedReward: CreatorReward = {
      ...currentReward,
      status: 'claimed',
      claimedAt: new Date().toISOString(),
      claimCode,
    };

    rewards[index] = updatedReward;
    setStorageItem(userStorageKey, rewards);

    // Record reward redemption in Reward Ledger
    this.addRewardEvent(
      userId,
      50,
      'reward_claimed',
      updatedReward.id,
      `Claimed ${updatedReward.title} (Code: ${claimCode})`
    );

    return { success: true, reward: updatedReward };
  }

  static getUserAchievements(userId: string): UserAchievement[] {
    const all = getStorageItem<UserAchievement[]>(STORAGE_KEYS.USER_ACHIEVEMENTS, INITIAL_USER_ACHIEVEMENTS);
    return all.filter((ua) => ua.user_id === userId);
  }

  static evaluateAchievements(userId: string): Omit<Achievement, 'id' | 'created_at'>[] {
    const sessions = this.getSessions(userId).filter((s) => s.status === 'completed');
    const projects = this.getProjects(userId);
    const submissions = this.getSubmissions(userId).filter((s) => s.status === 'accepted');
    const userHobbies = this.getUserHobbies(userId);
    const rewards = this.getRewardEvents(userId);
    const totalPoints = rewards.reduce((sum, r) => sum + r.points, 0);

    const userAchs = this.getUserAchievements(userId);
    const unlockedCodes = userAchs.map((ua) => ua.achievement?.code || '');

    const newUnlocked = checkNewAchievements(unlockedCodes, {
      sessionCount: sessions.length,
      projectCount: projects.length,
      challengeCount: submissions.length,
      categoryCount: new Set(userHobbies.map((uh) => uh.hobby?.category)).size,
      totalPoints,
    });

    if (newUnlocked.length > 0) {
      const allUserAchs = getStorageItem<UserAchievement[]>(STORAGE_KEYS.USER_ACHIEVEMENTS, INITIAL_USER_ACHIEVEMENTS);
      newUnlocked.forEach((ach) => {
        allUserAchs.push({
          id: `uach-${Date.now()}-${ach.code}`,
          user_id: userId,
          achievement_id: `ach-${ach.code}`,
          unlocked_at: new Date().toISOString(),
          achievement: {
            ...ach,
            id: `ach-${ach.code}`,
            created_at: new Date().toISOString(),
          },
        });

        // Add achievement notification
        this.addNotification(
          userId,
          `Achievement Unlocked: ${ach.title}!`,
          ach.description,
          'achievement',
          '/rewards'
        );
      });
      setStorageItem(STORAGE_KEYS.USER_ACHIEVEMENTS, allUserAchs);
    }

    return newUnlocked;
  }

  // Projects
  static getProjects(userId?: string): Project[] {
    const all = getStorageItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const hobbies = this.getHobbies();
    const profiles = this.getProfiles();
    const enriched = all.map((p) => ({
      ...p,
      hobby: hobbies.find((h) => h.id === p.hobby_id),
      author: profiles.find((prof) => prof.id === p.user_id),
    }));

    if (userId) {
      return enriched.filter((p) => p.user_id === userId);
    }
    return enriched;
  }

  static createProject(
    userId: string,
    data: {
      title: string;
      description: string;
      hobby_id: string;
      skills_demonstrated: string[];
      external_url?: string;
      github_url?: string;
      visibility: Project['visibility'];
      media_url?: string;
    }
  ): Project {
    const all = getStorageItem<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const hobbies = this.getHobbies();
    const hobby = hobbies.find((h) => h.id === data.hobby_id);
    const profiles = this.getProfiles();
    const author = profiles.find((p) => p.id === userId);

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      user_id: userId,
      hobby_id: data.hobby_id,
      title: data.title,
      description: data.description,
      skills_demonstrated: data.skills_demonstrated,
      external_url: data.external_url,
      github_url: data.github_url,
      visibility: data.visibility,
      project_date: new Date().toISOString().slice(0, 10),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      hobby,
      author,
      media: data.media_url
        ? [
            {
              id: `pm-${Date.now()}`,
              project_id: `proj-${Date.now()}`,
              media_url: data.media_url,
              media_type: 'image',
              sort_order: 0,
              created_at: new Date().toISOString(),
            },
          ]
        : [],
    };

    all.unshift(newProject);
    setStorageItem(STORAGE_KEYS.PROJECTS, all);

    // Reward points for project creation
    this.addRewardEvent(
      userId,
      REWARD_CONFIG.PROJECT_CREATED,
      'project_created',
      newProject.id,
      `Published new project: "${data.title}"`
    );

    this.evaluateAchievements(userId);

    return newProject;
  }

  // Opportunities
  static getOpportunities(): Opportunity[] {
    const all = getStorageItem<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
    const orgs = this.getOrganizations();
    return all.map((o) => ({
      ...o,
      organization: orgs.find((org) => org.id === o.organization_id),
    }));
  }

  static createOpportunity(
    orgId: string,
    data: Omit<Opportunity, 'id' | 'organization_id' | 'created_at' | 'updated_at' | 'organization'>
  ): Opportunity {
    const orgs = this.getOrganizations();
    const org = orgs.find((o) => o.id === orgId);
    if (!org) throw new Error('Organization not found');
    if (org.verification_status !== 'verified') {
      throw new Error('Only verified organizations can publish opportunities');
    }

    const all = getStorageItem<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES, INITIAL_OPPORTUNITIES);
    const newOpp: Opportunity = {
      ...data,
      id: `opp-${Date.now()}`,
      organization_id: orgId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      organization: org,
    };
    all.unshift(newOpp);
    setStorageItem(STORAGE_KEYS.OPPORTUNITIES, all);
    return newOpp;
  }

  // Organizations
  static getOrganizations(): Organization[] {
    return getStorageItem<Organization[]>(STORAGE_KEYS.ORGANIZATIONS, INITIAL_ORGANIZATIONS);
  }

  static updateOrganizationVerification(
    orgId: string,
    status: Organization['verification_status'],
    adminUserId: string,
    rejectionReason?: string
  ): Organization {
    const all = this.getOrganizations();
    const idx = all.findIndex((o) => o.id === orgId);
    if (idx === -1) throw new Error('Organization not found');

    const updated = {
      ...all[idx],
      verification_status: status,
      verified_at: status === 'verified' ? new Date().toISOString() : undefined,
      verified_by: status === 'verified' ? adminUserId : undefined,
      rejection_reason: status === 'rejected' ? rejectionReason : undefined,
      updated_at: new Date().toISOString(),
    };
    all[idx] = updated;
    setStorageItem(STORAGE_KEYS.ORGANIZATIONS, all);

    this.addNotification(
      updated.user_id,
      `Organization Verification ${status === 'verified' ? 'Approved!' : 'Update'}`,
      status === 'verified'
        ? 'Your organization has been officially verified! You may now publish opportunities and discover talent.'
        : `Your verification request was reviewed: ${rejectionReason || 'Please review required guidelines.'}`,
      'verification',
      '/org-dashboard'
    );

    return updated;
  }

  // Applications
  static getApplications(userId?: string): Application[] {
    const all = getStorageItem<Application[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    const opps = this.getOpportunities();
    const profiles = this.getProfiles();
    const projects = this.getProjects();

    const enriched = all.map((app) => ({
      ...app,
      opportunity: opps.find((o) => o.id === app.opportunity_id),
      applicant: profiles.find((p) => p.id === app.applicant_id),
      projects: (app.project_ids || []).map((pid) => projects.find((p) => p.id === pid)).filter(Boolean) as Project[],
    }));

    if (userId) {
      return enriched.filter((a) => a.applicant_id === userId);
    }
    return enriched;
  }

  static submitApplication(
    applicantId: string,
    opportunityId: string,
    introductionText: string,
    projectIds: string[] = []
  ): Application {
    const all = getStorageItem<Application[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    const existing = all.find((a) => a.applicant_id === applicantId && a.opportunity_id === opportunityId);
    if (existing) throw new Error('You have already applied to this opportunity');

    const opps = this.getOpportunities();
    const opp = opps.find((o) => o.id === opportunityId);
    const profiles = this.getProfiles();
    const applicant = profiles.find((p) => p.id === applicantId);

    const newApp: Application = {
      id: `app-${Date.now()}`,
      opportunity_id: opportunityId,
      applicant_id: applicantId,
      status: 'submitted',
      introduction_text: introductionText,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      opportunity: opp,
      applicant,
      project_ids: projectIds,
    };
    all.unshift(newApp);
    setStorageItem(STORAGE_KEYS.APPLICATIONS, all);

    // Notify organization
    if (opp?.organization?.user_id) {
      this.addNotification(
        opp.organization.user_id,
        'New Opportunity Application',
        `${applicant?.full_name || 'A candidate'} submitted an application for "${opp.title}".`,
        'application',
        '/org-applications'
      );
    }

    return newApp;
  }

  static updateApplicationStatus(
    appId: string,
    status: Application['status'],
    reviewNotes?: string
  ): Application {
    const all = getStorageItem<Application[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
    const idx = all.findIndex((a) => a.id === appId);
    if (idx === -1) throw new Error('Application not found');

    const updated = {
      ...all[idx],
      status,
      review_notes: reviewNotes,
      updated_at: new Date().toISOString(),
    };
    all[idx] = updated;
    setStorageItem(STORAGE_KEYS.APPLICATIONS, all);

    // Notify applicant
    this.addNotification(
      updated.applicant_id,
      `Application Status Update: ${status.replace('_', ' ').toUpperCase()}`,
      `Your application for "${updated.opportunity?.title || 'an opportunity'}" has been updated to ${status}.`,
      'application',
      '/applications'
    );

    return updated;
  }

  // Challenges
  static getChallenges(): Challenge[] {
    return getStorageItem<Challenge[]>(STORAGE_KEYS.CHALLENGES, INITIAL_CHALLENGES);
  }

  static getSubmissions(userId?: string): ChallengeSubmission[] {
    const all = getStorageItem<ChallengeSubmission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
    const challenges = this.getChallenges();
    const profiles = this.getProfiles();
    const enriched = all.map((s) => ({
      ...s,
      challenge: challenges.find((c) => c.id === s.challenge_id),
      author: profiles.find((p) => p.id === s.user_id),
    }));

    if (userId) {
      return enriched.filter((s) => s.user_id === userId);
    }
    return enriched;
  }

  static submitChallenge(
    userId: string,
    challengeId: string,
    title: string,
    description: string,
    evidenceUrl?: string
  ): ChallengeSubmission {
    const all = getStorageItem<ChallengeSubmission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_SUBMISSIONS);
    const challenges = this.getChallenges();
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) throw new Error('Challenge not found');

    const newSub: ChallengeSubmission = {
      id: `sub-${Date.now()}`,
      challenge_id: challengeId,
      user_id: userId,
      title,
      description,
      evidence_url: evidenceUrl,
      status: 'accepted', // Auto-accepted in demonstration mode for immediate reward feedback
      points_awarded: challenge.reward_points,
      created_at: new Date().toISOString(),
      challenge,
    };
    all.unshift(newSub);
    setStorageItem(STORAGE_KEYS.SUBMISSIONS, all);

    // Award challenge reward points
    this.addRewardEvent(
      userId,
      challenge.reward_points,
      'challenge_completed',
      newSub.id,
      `Completed challenge: "${challenge.title}"`
    );

    this.evaluateAchievements(userId);

    return newSub;
  }

  // Screen Time & Habit Entries
  static getScreenTimeEntries(userId: string): ScreenTimeEntry[] {
    const all = getStorageItem<ScreenTimeEntry[]>(STORAGE_KEYS.SCREEN_TIME, INITIAL_SCREEN_TIME_ENTRIES);
    return all
      .filter((e) => e.user_id === userId)
      .sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime());
  }

  static addScreenTimeEntry(
    userId: string,
    entryDate: string,
    baselineMins: number,
    currentMins: number,
    notes?: string
  ): ScreenTimeEntry {
    const all = getStorageItem<ScreenTimeEntry[]>(STORAGE_KEYS.SCREEN_TIME, INITIAL_SCREEN_TIME_ENTRIES);
    const saved = Math.max(0, baselineMins - currentMins);
    const newEntry: ScreenTimeEntry = {
      id: `st-${Date.now()}`,
      user_id: userId,
      entry_date: entryDate,
      baseline_mins: baselineMins,
      current_mins: currentMins,
      saved_mins: saved,
      notes,
      created_at: new Date().toISOString(),
    };
    all.unshift(newEntry);
    setStorageItem(STORAGE_KEYS.SCREEN_TIME, all);
    return newEntry;
  }

  // Notifications
  static getNotifications(userId: string): NotificationItem[] {
    const all = getStorageItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    return all
      .filter((n) => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static markNotificationRead(notifId: string): void {
    const all = getStorageItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const idx = all.findIndex((n) => n.id === notifId);
    if (idx !== -1) {
      all[idx].is_read = true;
      setStorageItem(STORAGE_KEYS.NOTIFICATIONS, all);
    }
  }

  static addNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationItem['type'],
    linkUrl?: string
  ): NotificationItem {
    const all = getStorageItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      user_id: userId,
      title,
      message,
      type,
      link_url: linkUrl,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    all.unshift(newNotif);
    setStorageItem(STORAGE_KEYS.NOTIFICATIONS, all);
    return newNotif;
  }

  // ==========================================
  // TALENT VIDEOS & SIMPLIFIED SOCIAL FEED
  // ==========================================

  static getCategories(): string[] {
    return getStorageItem<string[]>(STORAGE_KEYS.CATEGORIES, INITIAL_TALENT_CATEGORIES);
  }

  static addCategory(categoryName: string): string[] {
    const trimmed = categoryName.trim();
    if (!trimmed) return this.getCategories();
    const categories = this.getCategories();
    if (!categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      categories.push(trimmed);
      setStorageItem(STORAGE_KEYS.CATEGORIES, categories);
    }
    return categories;
  }

  /**
   * Calculates a creator's consistency rating and checkpoint level based on upload intervals.
   * Daily uploads award top Checkpoint 5 (★ 5.0 Daily Master).
   * Infrequent uploads reduce the rating to lower checkpoints.
   */
  static getCreatorRating(creatorId: string): CreatorConsistencyRating {
    const rawProfiles = getStorageItem<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    const profile = rawProfiles.find((p) => p.id === creatorId);
    const rawVideos = getStorageItem<VideoPost[]>(STORAGE_KEYS.VIDEOS, INITIAL_VIDEOS);
    const creatorVideos = rawVideos
      .filter((v) => v.creator_id === creatorId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // If no videos, return default initial rating
    if (creatorVideos.length === 0) {
      const baseScore = profile?.consistency_rating ?? 50;
      const cp =
        RATING_CHECKPOINTS.find((c) => baseScore >= c.minScore) ||
        RATING_CHECKPOINTS[RATING_CHECKPOINTS.length - 1];
      return {
        score: baseScore,
        tier: cp.tier,
        checkpoint: cp,
        streak_days: profile?.upload_streak_days ?? 0,
        last_uploaded_at: profile?.last_uploaded_at ?? new Date(0).toISOString(),
        avg_interval_hours: 168,
        hours_since_last_upload: 999,
        total_uploads: 0,
        is_daily_active: false,
        next_checkpoint_hint: 'Upload daily for 💎 Platinum',
      };
    }

    const latestVideo = creatorVideos[0];
    const latestTime = new Date(latestVideo.created_at).getTime();
    const now = Date.now();
    const hoursSinceLast = Math.max(0, (now - latestTime) / (3600 * 1000));

    // Calculate intervals between consecutive uploads (in hours)
    let avgIntervalHours = 24;
    if (creatorVideos.length > 1) {
      const intervals: number[] = [];
      const sampleSize = Math.min(creatorVideos.length - 1, 5);
      for (let i = 0; i < sampleSize; i++) {
        const t1 = new Date(creatorVideos[i].created_at).getTime();
        const t2 = new Date(creatorVideos[i + 1].created_at).getTime();
        const diff = (t1 - t2) / (3600 * 1000);
        if (diff > 0) intervals.push(diff);
      }
      if (intervals.length > 0) {
        avgIntervalHours = intervals.reduce((acc, curr) => acc + curr, 0) / intervals.length;
      }
    } else {
      avgIntervalHours = Math.max(24, hoursSinceLast);
    }

    // Determine daily streak
    let streakDays = profile?.upload_streak_days ?? 1;
    if (hoursSinceLast > 48) {
      // Streak broken if more than 48 hours without upload
      streakDays = 0;
    }

    // Calculate 0-100 score based on upload interval & recency (DoorDash style)
    let score = 50;
    if (hoursSinceLast <= 24) {
      // Uploaded within the last 24h: active daily creator!
      if (streakDays >= 3 || avgIntervalHours <= 28) {
        score = Math.min(100, 95 + Math.min(5, streakDays)); // 95 - 100: Platinum
      } else if (streakDays >= 1 || avgIntervalHours <= 48) {
        score = Math.min(94, 85 + Math.min(7, streakDays)); // 85 - 94: Gold
      } else if (avgIntervalHours <= 72) {
        score = 75; // Silver
      } else {
        score = 68; // Silver
      }
    } else if (hoursSinceLast <= 48) {
      // Uploaded yesterday
      if (streakDays >= 2 || avgIntervalHours <= 36) {
        score = 88; // Gold
      } else {
        score = 80; // Gold
      }
    } else if (hoursSinceLast <= 72) {
      // 2-3 days interval
      score = 74; // Silver
    } else if (hoursSinceLast <= 168) {
      // 4-7 days interval
      score = 65; // Silver
    } else {
      // > 7 days: rare uploader
      score = Math.max(20, Math.min(60, 60 - Math.round((hoursSinceLast - 168) / 24))); // Bronze (<65)
    }

    // Respect seeded profile consistency rating if available and user is within active period
    if (profile?.consistency_rating && hoursSinceLast <= 36) {
      score = Math.max(score, profile.consistency_rating);
    }

    score = Math.min(100, Math.max(0, Math.round(score)));

    const checkpoint =
      RATING_CHECKPOINTS.find((c) => score >= c.minScore) ||
      RATING_CHECKPOINTS[RATING_CHECKPOINTS.length - 1];

    let nextHint = '';
    if (checkpoint.tier === 'Platinum') {
      nextHint = '💎 Platinum (#1 Priority)';
    } else if (checkpoint.tier === 'Gold') {
      nextHint = 'Upload today for 💎 Platinum';
    } else {
      nextHint = 'Upload daily for 🥇 Gold & 💎 Platinum';
    }

    return {
      score,
      tier: checkpoint.tier,
      checkpoint,
      streak_days: streakDays,
      last_uploaded_at: latestVideo.created_at,
      avg_interval_hours: Math.round(avgIntervalHours),
      hours_since_last_upload: Math.round(hoursSinceLast),
      total_uploads: creatorVideos.length,
      is_daily_active: hoursSinceLast <= 24,
      next_checkpoint_hint: nextHint,
    };
  }

  static getVideos(category?: string, sortByRating = true): VideoPost[] {
    const rawVids = getStorageItem<VideoPost[]>(STORAGE_KEYS.VIDEOS, INITIAL_VIDEOS);
    let mapped = rawVids.map((v) => {
      const rating = this.getCreatorRating(v.creator_id);
      let thumb = v.thumbnail_url;
      if (thumb && thumb.includes('1579783902614')) {
        thumb = 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80';
      }
      return {
        ...v,
        thumbnail_url: thumb,
        creator: {
          ...v.creator,
          consistency_rating: rating.score,
          rating_checkpoint: rating.checkpoint.title,
          upload_streak_days: rating.streak_days,
          last_uploaded_at: rating.last_uploaded_at,
        },
      };
    });

    if (category && category !== 'All') {
      mapped = mapped.filter(
        (v) =>
          v.category.toLowerCase() === category.toLowerCase() ||
          v.creator.categories?.some((c) => c.toLowerCase() === category.toLowerCase())
      );
    }

    if (sortByRating) {
      // Primary sort: Creator Consistency Rating descending (daily uploaders rank at the top)
      // Secondary sort: created_at descending
      mapped.sort((a, b) => {
        const ratingA = a.creator?.consistency_rating ?? 2.0;
        const ratingB = b.creator?.consistency_rating ?? 2.0;
        if (ratingB !== ratingA) {
          return ratingB - ratingA;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
    }

    return mapped;
  }

  static async syncFromSupabase(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    try {
      const supabase = createClient();
      const { data: vids, error: vidErr } = await supabase
        .from('videos')
        .select('*, creator:profiles(*)')
        .order('created_at', { ascending: false });

      if (!vidErr && vids && vids.length > 0) {
        const mapped: VideoPost[] = vids.map((v: any) => ({
          id: v.id,
          creator_id: v.creator_id,
          creator: {
            username: v.creator?.username || 'creator',
            full_name: v.creator?.full_name || 'Creator',
            avatar_url: v.creator?.avatar_url,
            is_verified: !!v.creator?.is_verified,
            bio: v.creator?.bio,
            location: v.creator?.location,
            followers_count: v.creator?.followers_count || 1000,
            following_count: v.creator?.following_count || 50,
            videos_count: 1,
            categories: v.creator?.categories || [v.category],
          },
          video_url: v.video_url,
          thumbnail_url: v.thumbnail_url,
          title: v.title || v.caption,
          caption: v.caption,
          category: v.category,
          duration_formatted: v.duration_formatted || '01:00',
          duration_seconds: v.duration_seconds || 60,
          likes_count: v.likes_count || 0,
          comments_count: v.comments_count || 0,
          shares_count: v.shares_count || 0,
          views_count: v.views_count || 0,
          is_liked: false,
          is_saved: false,
          created_at: v.created_at,
        }));
        setStorageItem(STORAGE_KEYS.VIDEOS, mapped);
      }

      const { data: cats, error: catErr } = await supabase
        .from('talent_categories')
        .select('name');
      if (!catErr && cats && cats.length > 0) {
        const catNames = ['All', ...cats.map((c: any) => c.name)];
        setStorageItem(STORAGE_KEYS.CATEGORIES, catNames);
      }
      return true;
    } catch {
      return false;
    }
  }

  static getVideoById(id: string): VideoPost | undefined {
    return this.getVideos().find((v) => v.id === id);
  }

  static getVideosByCreator(creatorId: string): VideoPost[] {
    return this.getVideos().filter((v) => v.creator_id === creatorId);
  }

  static addVideo(data: {
    creator_id: string;
    caption: string;
    category: string;
    video_url: string;
    thumbnail_url: string;
    title?: string;
    duration_seconds?: number;
  }): VideoPost {
    const rawVideos = getStorageItem<VideoPost[]>(STORAGE_KEYS.VIDEOS, INITIAL_VIDEOS);
    const creatorProfile = this.getProfileById(data.creator_id) || this.getCurrentUser();
    
    // Ensure category exists
    this.addCategory(data.category);

    const nowISO = new Date().toISOString();
    const newStreak = (creatorProfile.upload_streak_days || 0) + 1;

    const newVideo: VideoPost = {
      id: `vid-${Date.now()}`,
      creator_id: data.creator_id,
      creator: {
        username: creatorProfile.username,
        full_name: creatorProfile.full_name,
        email: creatorProfile.email,
        avatar_url: creatorProfile.avatar_url,
        is_verified: true,
        bio: creatorProfile.bio,
        location: creatorProfile.location,
        followers_count: 12400,
        following_count: 256,
        videos_count: (creatorProfile as any).videos_count ? (creatorProfile as any).videos_count + 1 : 1,
        consistency_rating: 98, // Immediately boost to 98 (Platinum) on upload
        rating_checkpoint: 'Platinum',
        upload_streak_days: newStreak,
        last_uploaded_at: nowISO,
      },
      video_url: data.video_url,
      thumbnail_url: data.thumbnail_url,
      title: data.title || data.caption.slice(0, 30),
      caption: data.caption,
      category: data.category,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      views_count: 1,
      duration_seconds: data.duration_seconds || 15,
      is_liked: false,
      is_saved: false,
      created_at: nowISO,
    };

    rawVideos.unshift(newVideo);
    setStorageItem(STORAGE_KEYS.VIDEOS, rawVideos);

    // Save to real Supabase database asynchronously
    SupabaseService.insertVideoPost(newVideo).catch((err) => {
      console.warn('[DataStore] Supabase async insert error:', err);
    });

    // Update creator profile consistency rating & streak
    try {
      this.updateProfile(data.creator_id, {
        consistency_rating: 98,
        rating_checkpoint: 'Platinum',
        upload_streak_days: newStreak,
        last_uploaded_at: nowISO,
      });
    } catch {
      // Ignore if profile update in isolated test environment
    }

    return newVideo;
  }

  static toggleLikeVideo(videoId: string): { isLiked: boolean; likesCount: number } {
    const videos = this.getVideos();
    const video = videos.find((v) => v.id === videoId);
    if (!video) return { isLiked: false, likesCount: 0 };

    video.is_liked = !video.is_liked;
    const currentLikes = video.likes_count ?? 0;
    video.likes_count = video.is_liked ? currentLikes + 1 : Math.max(0, currentLikes - 1);
    setStorageItem(STORAGE_KEYS.VIDEOS, videos);

    // Sync like state to Supabase
    try {
      const currentUser = this.getCurrentUser();
      SupabaseService.syncVideoLike(videoId, currentUser.id, video.is_liked).catch(() => {});
    } catch {}

    return { isLiked: video.is_liked, likesCount: video.likes_count };
  }

  // ==========================================
  // ORGANIZATION WORK SELECTION & EMAIL NOTIFICATION
  // ==========================================

  static getSelectedWorks(orgId?: string): SelectedWork[] {
    const all = getStorageItem<SelectedWork[]>(STORAGE_KEYS.SELECTED_WORKS, INITIAL_SELECTED_WORKS);
    if (!orgId) return all;
    return all.filter((s) => s.org_id === orgId);
  }

  static isWorkSelected(orgId: string, videoId: string): boolean {
    const all = this.getSelectedWorks(orgId);
    return all.some((s) => s.video_id === videoId);
  }

  /**
   * Organization selects or considers work they like.
   * Dispatches an email notification to the creator's account email.
   */
  static selectWork(params: {
    orgId: string;
    orgName: string;
    videoId: string;
    notes?: string;
  }): { selected: boolean; emailSent?: WorkSelectionEmail } {
    const selectedWorks = this.getSelectedWorks();
    const existingIndex = selectedWorks.findIndex(
      (s) => s.org_id === params.orgId && s.video_id === params.videoId
    );

    // If already selected, toggle off
    if (existingIndex >= 0) {
      selectedWorks.splice(existingIndex, 1);
      setStorageItem(STORAGE_KEYS.SELECTED_WORKS, selectedWorks);
      
      // Sync deselection to Supabase
      SupabaseService.syncWorkSelection({
        orgId: params.orgId,
        videoId: params.videoId,
        creatorId: '',
        creatorEmail: '',
        workTitle: '',
        workCategory: '',
        selected: false,
      }).catch(() => {});

      return { selected: false };
    }

    // Lookup video and creator
    const video = this.getVideoById(params.videoId);
    const creatorProfile = video ? this.getProfileById(video.creator_id) : undefined;
    const creatorEmail =
      video?.creator?.email ||
      creatorProfile?.email ||
      EmailService.getRecipientEmail({ username: video?.creator?.username || 'creator' });
    const creatorName = video?.creator?.full_name || creatorProfile?.full_name || 'Creator';
    const creatorId = video?.creator_id || 'usr-student-001';
    const workTitle = video?.title || video?.caption || 'Talent Showcase Video';

    // Sync selection to Supabase
    SupabaseService.syncWorkSelection({
      orgId: params.orgId,
      videoId: params.videoId,
      creatorId,
      creatorEmail,
      workTitle,
      workCategory: video?.category || 'General',
      notes: params.notes,
      selected: true,
    }).catch(() => {});

    // 1. Dispatch official email notification to creator's registered email
    const emailSent = EmailService.sendWorkSelectionEmail({
      creator: {
        id: creatorId,
        full_name: creatorName,
        username: video?.creator?.username || 'creator',
        email: creatorEmail,
      },
      organization: {
        id: params.orgId,
        name: params.orgName,
      },
      work: {
        id: params.videoId,
        title: workTitle,
        caption: video?.caption || '',
        category: video?.category || 'General',
      },
      notes: params.notes,
    });

    // 2. Add an in-app notification for the creator
    this.addNotification(
      creatorId,
      `${params.orgName} selected your work!`,
      `${params.orgName} shortlisted your work "${workTitle}". An email has been sent to your account (${creatorEmail}).`,
      'opportunity',
      '/notifications'
    );

    // 3. Persist into selected works list
    const newSelection: SelectedWork = {
      id: `sel-${Date.now()}`,
      org_id: params.orgId,
      org_name: params.orgName,
      video_id: params.videoId,
      creator_id: creatorId,
      creator_name: creatorName,
      creator_email: creatorEmail,
      work_title: workTitle,
      work_category: video?.category || 'General',
      video_url: video?.video_url || '',
      thumbnail_url: video?.thumbnail_url || '',
      selected_at: new Date().toISOString(),
      email_id: emailSent.id,
      notes: params.notes,
    };

    selectedWorks.unshift(newSelection);
    setStorageItem(STORAGE_KEYS.SELECTED_WORKS, selectedWorks);

    return { selected: true, emailSent };
  }

  static getEmailsForUser(userEmailOrId: string): WorkSelectionEmail[] {
    return EmailService.getEmailsForUser(userEmailOrId);
  }

  // ==========================================
  // SAVED TALENT (Organizations)
  // ==========================================

  static getSavedCreators(orgId?: string): SavedCreator[] {
    const targetOrgId = orgId || this.getCurrentUserId();
    const allSaved = getStorageItem<SavedCreator[]>(STORAGE_KEYS.SAVED_CREATORS, INITIAL_SAVED_CREATORS);
    return allSaved.filter((s) => !orgId || s.org_id === targetOrgId);
  }

  static isCreatorSaved(orgId: string, creatorId: string): boolean {
    const saved = getStorageItem<SavedCreator[]>(STORAGE_KEYS.SAVED_CREATORS, INITIAL_SAVED_CREATORS);
    return saved.some((s) => s.org_id === orgId && s.creator_id === creatorId);
  }

  static toggleSaveCreator(orgId: string, creatorId: string): boolean {
    const saved = getStorageItem<SavedCreator[]>(STORAGE_KEYS.SAVED_CREATORS, INITIAL_SAVED_CREATORS);
    const existingIndex = saved.findIndex((s) => s.org_id === orgId && s.creator_id === creatorId);

    if (existingIndex >= 0) {
      saved.splice(existingIndex, 1);
      setStorageItem(STORAGE_KEYS.SAVED_CREATORS, saved);
      return false; // Removed
    } else {
      const creatorProfile = this.getProfileById(creatorId) || INITIAL_PROFILES[0];
      saved.unshift({
        id: `saved-${Date.now()}`,
        org_id: orgId,
        creator_id: creatorId,
        creator: {
          ...creatorProfile,
          talent_categories: ['Dance', 'Creative Arts'],
          followers_count: 12400,
          videos_count: 42,
        },
        created_at: new Date().toISOString(),
      });
      setStorageItem(STORAGE_KEYS.SAVED_CREATORS, saved);
      return true; // Added
    }
  }

  // ==========================================
  // CONTACT TALENT & OPPORTUNITIES REQUESTS
  // ==========================================

  static getContactRequests(creatorId?: string): ContactRequest[] {
    const all = getStorageItem<ContactRequest[]>(STORAGE_KEYS.CONTACT_REQUESTS, INITIAL_CONTACT_REQUESTS);
    if (!creatorId) return all;
    return all.filter((r) => r.creator_id === creatorId);
  }

  static sendContactRequest(data: {
    org_id: string;
    org_name: string;
    org_avatar?: string;
    creator_id: string;
    opportunity_title: string;
    message: string;
  }): ContactRequest {
    const all = getStorageItem<ContactRequest[]>(STORAGE_KEYS.CONTACT_REQUESTS, INITIAL_CONTACT_REQUESTS);
    const newReq: ContactRequest = {
      id: `cr-${Date.now()}`,
      org_id: data.org_id,
      org_name: data.org_name,
      org_avatar: data.org_avatar,
      creator_id: data.creator_id,
      opportunity_title: data.opportunity_title,
      message: data.message,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    all.unshift(newReq);
    setStorageItem(STORAGE_KEYS.CONTACT_REQUESTS, all);

    // Also trigger in-app notification for the creator
    this.addNotification(
      data.creator_id,
      `${data.org_name} sent you an opportunity!`,
      `"${data.opportunity_title}": ${data.message.slice(0, 80)}...`,
      'opportunity',
      '/notifications'
    );

    return newReq;
  }
}
