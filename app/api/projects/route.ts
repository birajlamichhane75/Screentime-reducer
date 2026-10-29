import { NextResponse } from 'next/server';
import { projectSchema } from '@/lib/validation';
import { INITIAL_PROJECTS } from '@/services/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_PROJECTS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = projectSchema.parse(body);

    const newProject = {
      id: `proj-${Date.now()}`,
      user_id: 'usr-student-001',
      title: validated.title,
      description: validated.description,
      hobby_id: validated.hobby_id,
      skills_demonstrated: validated.skills_demonstrated,
      external_url: validated.external_url || null,
      github_url: validated.github_url || null,
      visibility: validated.visibility,
      project_date: new Date().toISOString().slice(0, 10),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newProject,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Invalid project payload' },
      { status: 400 }
    );
  }
}
