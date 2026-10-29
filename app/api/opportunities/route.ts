import { NextResponse } from 'next/server';
import { opportunitySchema } from '@/lib/validation';
import { INITIAL_OPPORTUNITIES } from '@/services/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_OPPORTUNITIES,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = opportunitySchema.parse(body);

    const newOpp = {
      id: `opp-${Date.now()}`,
      organization_id: 'org-01',
      ...validated,
      status: 'published',
      is_demo: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newOpp,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Invalid opportunity payload' },
      { status: 400 }
    );
  }
}
