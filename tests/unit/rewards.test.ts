import { describe, it, expect } from 'vitest';
import {
  canAwardSessionPoints,
  calculateTotalPoints,
  checkNewAchievements,
  REWARD_CONFIG,
} from '@/services/rewards';
import { RewardEvent } from '@/types';

describe('Rewards & Achievements Engine', () => {
  it('awards points for valid session duration above minimum', () => {
    const result = canAwardSessionPoints(1800, 0); // 30 mins
    expect(result.canAward).toBe(true);
    expect(result.points).toBe(REWARD_CONFIG.SESSION_COMPLETED);
  });

  it('rejects points for session under minimum duration', () => {
    const result = canAwardSessionPoints(30, 0); // 30 seconds
    expect(result.canAward).toBe(false);
    expect(result.points).toBe(0);
    expect(result.reason).toContain('minimum requirement');
  });

  it('enforces daily reward ceiling to prevent point farming abuse', () => {
    const result = canAwardSessionPoints(1800, REWARD_CONFIG.MAX_DAILY_SESSION_POINTS);
    expect(result.canAward).toBe(false);
    expect(result.points).toBe(0);
    expect(result.reason).toContain('limit');
  });

  it('correctly calculates total ledger points from immutable events', () => {
    const events: RewardEvent[] = [
      { id: '1', user_id: 'u1', points: 10, event_type: 'session_completed', description: '', created_at: '' },
      { id: '2', user_id: 'u1', points: 20, event_type: 'project_created', description: '', created_at: '' },
      { id: '3', user_id: 'u1', points: 50, event_type: 'challenge_completed', description: '', created_at: '' },
    ];
    expect(calculateTotalPoints(events)).toBe(80);
  });

  it('detects milestone achievement unlocks accurately', () => {
    const newAchs = checkNewAchievements([], {
      sessionCount: 5,
      projectCount: 3,
      challengeCount: 1,
      categoryCount: 2,
      totalPoints: 120,
    });

    const codes = newAchs.map((a) => a.code);
    expect(codes).toContain('first_step');
    expect(codes).toContain('consistent_creator');
    expect(codes).toContain('portfolio_builder');
    expect(codes).toContain('challenge_finisher');
    expect(codes).toContain('centurion');
  });
});
