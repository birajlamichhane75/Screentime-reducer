import { NextResponse } from 'next/server';
import { focusSessionStartSchema } from '@/lib/validation';
import { INITIAL_SESSIONS } from '@/services/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_SESSIONS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = focusSessionStartSchema.parse(body);

    const newSession = {
      id: `sess-${Date.now()}`,
      user_id: 'usr-student-001',
      hobby_id: validated.hobby_id,
      goal_text: validated.goal_text,
      duration_seconds: validated.duration_seconds,
      status: 'started',
      started_at: new Date().toISOString(),
      reward_awarded: false,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newSession,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Invalid session payload' },
      { status: 400 }
    );
  }
}
