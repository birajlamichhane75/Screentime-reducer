import { describe, it, expect } from 'vitest';
import { calculateOpportunityMatch, MATCHING_WEIGHTS } from '@/services/matching';
import { Opportunity, Profile, UserSkill, Project, ActivitySession } from '@/types';

describe('Opportunity Matching Engine', () => {
  const dummyProfile: Profile = {
    id: 'user-test-1',
    role: 'student',
    full_name: 'Jordan Test',
    username: 'jordan_test',
    daily_goal_minutes: 30,
    is_private: false,
    is_discoverable: true,
    allow_org_contact: true,
    baseline_screen_time_mins: 180,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const dummySkills: UserSkill[] = [
    {
      id: 'us-1',
      user_id: 'user-test-1',
      skill_id: 's-1',
      experience_level: 'intermediate',
      years_exp: 1.0,
      created_at: new Date().toISOString(),
      skill: {
        id: 's-1',
        name: 'Digital Painting',
        slug: 'digital-painting',
        category: 'Visual Arts',
        is_active: true,
        created_at: new Date().toISOString(),
      },
    },
  ];

  const dummyProjects: Project[] = [
    {
      id: 'p-1',
      user_id: 'user-test-1',
      hobby_id: 'h-1',
      title: 'Neon Concept Art',
      description: 'Digital study',
      skills_demonstrated: ['Digital Painting'],
      visibility: 'public',
      project_date: '2026-10-20',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const dummySessions: ActivitySession[] = [
    {
      id: 'sess-1',
      user_id: 'user-test-1',
      hobby_id: 'h-1',
      duration_seconds: 1800,
      status: 'completed',
      started_at: new Date().toISOString(),
      reward_awarded: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'sess-2',
      user_id: 'user-test-1',
      hobby_id: 'h-1',
      duration_seconds: 1800,
      status: 'completed',
      started_at: new Date().toISOString(),
      reward_awarded: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'sess-3',
      user_id: 'user-test-1',
      hobby_id: 'h-1',
      duration_seconds: 1800,
      status: 'completed',
      started_at: new Date().toISOString(),
      reward_awarded: true,
      created_at: new Date().toISOString(),
    },
  ];

  const sampleOpportunity: Opportunity = {
    id: 'opp-sample',
    organization_id: 'org-test',
    title: 'Visual Arts Fellowship',
    description: '10-week summer digital arts fellowship',
    opportunity_type: 'scholarship',
    required_skills: ['Digital Painting'],
    location: 'Remote',
    location_type: 'remote',
    deadline: '2026-12-01',
    openings_count: 2,
    status: 'published',
    is_demo: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  it('calculates high match score when student has matching skills and portfolio evidence', () => {
    const result = calculateOpportunityMatch(sampleOpportunity, {
      profile: dummyProfile,
      skills: dummySkills,
      projects: dummyProjects,
      sessions: dummySessions,
    });

    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.breakdown.skillOverlap).toBe(100);
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.reasons.some((r) => r.includes('Digital Painting'))).toBe(true);
  });

  it('generates transparent explanation when skills do not match', () => {
    const nonMatchingOpp: Opportunity = {
      ...sampleOpportunity,
      required_skills: ['Robotics Hardware', 'Embedded C++'],
    };

    const result = calculateOpportunityMatch(nonMatchingOpp, {
      profile: dummyProfile,
      skills: dummySkills,
      projects: dummyProjects,
      sessions: dummySessions,
    });

    expect(result.breakdown.skillOverlap).toBe(0);
    expect(result.score).toBeLessThan(60);
  });
});
