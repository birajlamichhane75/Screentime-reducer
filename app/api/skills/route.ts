import { NextResponse } from 'next/server';
import { INITIAL_SKILLS } from '@/services/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_SKILLS,
  });
}
