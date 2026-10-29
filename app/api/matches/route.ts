import { NextResponse } from 'next/server';
import {
  INITIAL_PROFILES,
  INITIAL_USER_SKILLS,
  INITIAL_PROJECTS,
  INITIAL_SESSIONS,
  INITIAL_OPPORTUNITIES,
} from '@/services/mockData';
import { rankOpportunities } from '@/services/matching';

export async function GET() {
  try {
    const student = INITIAL_PROFILES[0];
    const ranked = rankOpportunities(INITIAL_OPPORTUNITIES, {
      profile: student,
      skills: INITIAL_USER_SKILLS,
      projects: INITIAL_PROJECTS,
      sessions: INITIAL_SESSIONS,
    });

    return NextResponse.json({
      success: true,
      data: ranked,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to calculate matches' },
      { status: 500 }
    );
  }
}
