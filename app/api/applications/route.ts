import { NextResponse } from 'next/server';
import { applicationSubmitSchema } from '@/lib/validation';
import { INITIAL_APPLICATIONS } from '@/services/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_APPLICATIONS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = applicationSubmitSchema.parse(body);

    const newApp = {
      id: `app-${Date.now()}`,
      opportunity_id: validated.opportunity_id,
      applicant_id: 'usr-student-001',
      status: 'submitted',
      introduction_text: validated.introduction_text,
      project_ids: validated.project_ids,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newApp,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Invalid application payload' },
      { status: 400 }
    );
  }
}
