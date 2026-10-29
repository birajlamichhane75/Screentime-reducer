import { Opportunity, Profile, Project, UserSkill, ActivitySession, MatchResult } from '@/types';

export interface MatchingUserContext {
  profile: Profile;
  skills: UserSkill[];
  projects: Project[];
  sessions: ActivitySession[];
}

export const MATCHING_WEIGHTS = {
  SKILL_OVERLAP: 0.4,
  PORTFOLIO_RELEVANCE: 0.3,
  ACTIVITY_EVIDENCE: 0.2,
  PREFERENCE_FIT: 0.1,
};

export function calculateOpportunityMatch(
  opportunity: Opportunity,
  user: MatchingUserContext
): MatchResult {
  const reasons: string[] = [];

  // 1. Skill Overlap (0 - 100)
  const reqSkills = opportunity.required_skills || [];
  const userSkillNames = (user.skills || []).map((s) => (s.skill?.name || '').toLowerCase());
  
  let matchedSkillsCount = 0;
  const matchedSkillNames: string[] = [];

  reqSkills.forEach((req) => {
    const found = userSkillNames.some((uSkill) =>
      uSkill.includes(req.toLowerCase()) || req.toLowerCase().includes(uSkill)
    );
    if (found) {
      matchedSkillsCount++;
      matchedSkillNames.push(req);
    }
  });

  const skillScore = reqSkills.length > 0 ? (matchedSkillsCount / reqSkills.length) * 100 : 70;

  if (matchedSkillNames.length > 0) {
    reasons.push(
      `Matches ${matchedSkillNames.length} of ${reqSkills.length} required skills: ${matchedSkillNames.slice(0, 3).join(', ')}`
    );
  }

  // 2. Portfolio Relevance (0 - 100)
  // Check if student has projects demonstrating these skills or matching hobby
  const userProjects = user.projects || [];
  let relevantProjectsCount = 0;

  userProjects.forEach((proj) => {
    const hasSkillMatch = (proj.skills_demonstrated || []).some((projSkill) =>
      reqSkills.some((req) => req.toLowerCase().includes(projSkill.toLowerCase()) || projSkill.toLowerCase().includes(req.toLowerCase()))
    );
    if (hasSkillMatch) {
      relevantProjectsCount++;
    }
  });

  const portfolioScore = Math.min(100, relevantProjectsCount * 35);
  if (relevantProjectsCount > 0) {
    reasons.push(
      `You have ${relevantProjectsCount} verified portfolio project${relevantProjectsCount > 1 ? 's' : ''} demonstrating required skills`
    );
  }

  // 3. Relevant Activity Evidence (0 - 100)
  // Check completed practice sessions
  const completedSessions = (user.sessions || []).filter((s) => s.status === 'completed');
  const activityScore = Math.min(100, completedSessions.length * 20);

  if (completedSessions.length >= 3) {
    reasons.push(
      `Strong practice consistency with ${completedSessions.length} completed focus sessions`
    );
  }

  // 4. Preference & Location Fit (0 - 100)
  let preferenceScore = 50;
  if (opportunity.location_type === 'remote') {
    preferenceScore = 100;
    reasons.push('Remote opportunity matching all locations');
  } else if (
    user.profile.location &&
    opportunity.location &&
    user.profile.location.toLowerCase().includes(opportunity.location.toLowerCase())
  ) {
    preferenceScore = 100;
    reasons.push(`Location matches your preference (${opportunity.location})`);
  }

  // Calculate Weighted Total Score
  const totalScore = Math.round(
    skillScore * MATCHING_WEIGHTS.SKILL_OVERLAP +
    portfolioScore * MATCHING_WEIGHTS.PORTFOLIO_RELEVANCE +
    activityScore * MATCHING_WEIGHTS.ACTIVITY_EVIDENCE +
    preferenceScore * MATCHING_WEIGHTS.PREFERENCE_FIT
  );

  if (reasons.length === 0) {
    reasons.push('General match based on category and platform interest');
  }

  return {
    opportunity,
    score: Math.min(100, Math.max(0, totalScore)),
    breakdown: {
      skillOverlap: Math.round(skillScore),
      portfolioRelevance: Math.round(portfolioScore),
      activityEvidence: Math.round(activityScore),
      preferenceFit: Math.round(preferenceScore),
    },
    reasons,
  };
}

export function rankOpportunities(
  opportunities: Opportunity[],
  userContext: MatchingUserContext
): MatchResult[] {
  return opportunities
    .filter((opp) => opp.status === 'published')
    .map((opp) => calculateOpportunityMatch(opp, userContext))
    .sort((a, b) => b.score - a.score);
}
