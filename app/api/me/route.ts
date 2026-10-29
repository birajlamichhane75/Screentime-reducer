import { NextResponse } from 'next/server';
import { INITIAL_PROFILES } from '@/services/mockData';

export async function GET() {
  try {
    // In demo mode or server environment, return default active profile
    const profile = INITIAL_PROFILES[0];
    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch current user' },
      { status: 500 }
    );
  }
}
