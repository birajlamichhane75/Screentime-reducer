import { RewardEvent, RewardEventType, Achievement } from '@/types';

export const REWARD_CONFIG = {
  SESSION_COMPLETED: 10,
  PROJECT_CREATED: 20,
  CHALLENGE_COMPLETED: 50,
  PORTFOLIO_MILESTONE: 100,
  MIN_SESSION_DURATION_SECONDS: 60, // Minimum for points
  MAX_DAILY_SESSION_POINTS: 80, // Anti-farming limit
};

export const DEFAULT_ACHIEVEMENTS: Omit<Achievement, 'id' | 'created_at'>[] = [
  {
    code: 'first_step',
    title: 'First Step',
    description: 'Completed your first focused hobby session',
    icon_name: 'Sparkles',
    category: 'sessions',
    points_threshold: 10,
    criteria_type: 'session_count',
    criteria_value: 1,
  },
  {
    code: 'consistent_creator',
    title: 'Consistent Creator',
    description: 'Completed 5 focused hobby practice sessions',
    icon_name: 'Flame',
    category: 'sessions',
    points_threshold: 50,
    criteria_type: 'session_count',
    criteria_value: 5,
  },
  {
    code: 'portfolio_builder',
    title: 'Portfolio Builder',
    description: 'Published 3 verified creative projects',
    icon_name: 'Briefcase',
    category: 'projects',
    points_threshold: 60,
    criteria_type: 'project_count',
    criteria_value: 3,
  },
  {
    code: 'challenge_finisher',
    title: 'Challenge Finisher',
    description: 'Successfully submitted and completed your first platform challenge',
    icon_name: 'Trophy',
    category: 'challenges',
    points_threshold: 50,
    criteria_type: 'challenge_count',
    criteria_value: 1,
  },
  {
    code: 'skill_explorer',
    title: 'Skill Explorer',
    description: 'Practiced and logged skills in 2 or more different categories',
    icon_name: 'Compass',
    category: 'exploration',
    points_threshold: 40,
    criteria_type: 'category_count',
    criteria_value: 2,
  },
  {
    code: 'centurion',
    title: 'Century Milestone',
    description: 'Accumulated 100 total achievement points',
    icon_name: 'Award',
    category: 'points',
    points_threshold: 100,
    criteria_type: 'points_total',
    criteria_value: 100,
  },
];

export function calculateTotalPoints(events: RewardEvent[]): number {
  return events.reduce((sum, e) => sum + e.points, 0);
}

export function canAwardSessionPoints(
  durationSeconds: number,
  todayTotalSessionPoints: number
): { canAward: boolean; points: number; reason?: string } {
  if (durationSeconds < REWARD_CONFIG.MIN_SESSION_DURATION_SECONDS) {
    return {
      canAward: false,
      points: 0,
      reason: `Practice session was under ${REWARD_CONFIG.MIN_SESSION_DURATION_SECONDS}s minimum requirement.`,
    };
  }

  if (todayTotalSessionPoints >= REWARD_CONFIG.MAX_DAILY_SESSION_POINTS) {
    return {
      canAward: false,
      points: 0,
      reason: `Daily practice reward limit (${REWARD_CONFIG.MAX_DAILY_SESSION_POINTS} pts) reached for today.`,
    };
  }

  const pointsToAward = Math.min(
    REWARD_CONFIG.SESSION_COMPLETED,
    REWARD_CONFIG.MAX_DAILY_SESSION_POINTS - todayTotalSessionPoints
  );

  return { canAward: true, points: pointsToAward };
}

export function checkNewAchievements(
  currentAchievements: string[],
  stats: {
    sessionCount: number;
    projectCount: number;
    challengeCount: number;
    categoryCount: number;
    totalPoints: number;
  }
): Omit<Achievement, 'id' | 'created_at'>[] {
  const newAchievements: Omit<Achievement, 'id' | 'created_at'>[] = [];

  for (const ach of DEFAULT_ACHIEVEMENTS) {
    if (currentAchievements.includes(ach.code)) continue;

    let unlocked = false;
    switch (ach.criteria_type) {
      case 'session_count':
        unlocked = stats.sessionCount >= ach.criteria_value;
        break;
      case 'project_count':
        unlocked = stats.projectCount >= ach.criteria_value;
        break;
      case 'challenge_count':
        unlocked = stats.challengeCount >= ach.criteria_value;
        break;
      case 'category_count':
        unlocked = stats.categoryCount >= ach.criteria_value;
        break;
      case 'points_total':
        unlocked = stats.totalPoints >= ach.criteria_value;
        break;
    }

    if (unlocked) {
      newAchievements.push(ach);
    }
  }

  return newAchievements;
}
