import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['student', 'organization'], {
    message: 'Please select whether you are a Student or Organization',
  }),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const studentOnboardingSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Only letters, numbers, hyphens, and underscores allowed'),
  full_name: z.string().min(2, 'Full name is required'),
  bio: z.string().max(280, 'Bio maximum 280 characters').optional().or(z.literal('')),
  location: z.string().max(100).optional().or(z.literal('')),
  education_level: z.string().optional().or(z.literal('')),
  selected_hobbies: z.array(z.string()).min(1, 'Please select at least 1 hobby'),
  selected_skills: z.array(z.string()).optional(),
  daily_goal_minutes: z.coerce.number().min(15).max(480),
  is_private: z.boolean().default(false),
  is_discoverable: z.boolean().default(true),
  allow_org_contact: z.boolean().default(true),
  baseline_screen_time_mins: z.coerce.number().min(0).max(1440).default(180),
});

export const orgOnboardingSchema = z.object({
  name: z.string().min(2, 'Organization name is required'),
  org_type: z.enum([
    'university',
    'student_club',
    'company',
    'nonprofit',
    'community',
    'other',
  ]),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  official_email: z.string().email('Valid institutional email is required'),
  description: z.string().min(20, 'Please provide a clear description (min 20 chars)'),
  location: z.string().min(2, 'Location is required'),
  contact_name: z.string().min(2, 'Contact person name is required'),
  contact_phone: z.string().optional().or(z.literal('')),
  logo_url: z.string().optional().or(z.literal('')),
});

export const focusSessionStartSchema = z.object({
  hobby_id: z.string().min(1, 'Please select a hobby'),
  duration_seconds: z.coerce.number().min(60, 'Minimum session is 1 minute'),
  goal_text: z.string().max(200).optional().or(z.literal('')),
});

export const focusSessionCompleteSchema = z.object({
  notes: z.string().max(1000).optional().or(z.literal('')),
  evidence_url: z.string().optional().or(z.literal('')),
});

export const projectSchema = z.object({
  title: z.string().min(3, 'Project title is required').max(100),
  hobby_id: z.string().min(1, 'Please select a hobby category'),
  description: z.string().min(10, 'Please describe your project (min 10 characters)'),
  skills_demonstrated: z.array(z.string()).min(1, 'Select or enter at least 1 skill'),
  external_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  github_url: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  visibility: z.enum(['public', 'private', 'discoverable']),
  media_url: z.string().optional().or(z.literal('')),
});

export const challengeSubmissionSchema = z.object({
  challenge_id: z.string().min(1),
  title: z.string().min(3, 'Submission title is required'),
  description: z.string().min(10, 'Describe what you created'),
  evidence_url: z.string().url('Please provide a valid link, image, or repository URL'),
});

export const opportunitySchema = z.object({
  title: z.string().min(5, 'Opportunity title is required').max(120),
  opportunity_type: z.enum([
    'scholarship',
    'internship',
    'mentorship',
    'competition',
    'club_recruitment',
    'paid_project',
    'volunteer',
    'collaboration',
  ]),
  description: z.string().min(30, 'Detailed description is required (min 30 characters)'),
  required_skills: z.array(z.string()).min(1, 'At least 1 required skill must be specified'),
  preferred_experience: z.string().optional().or(z.literal('')),
  eligibility_criteria: z.string().min(5, 'Eligibility criteria are required'),
  location: z.string().min(2, 'Location is required'),
  location_type: z.enum(['remote', 'hybrid', 'in_person']),
  compensation_details: z.string().optional().or(z.literal('')),
  deadline: z.string().min(1, 'Application deadline is required'),
  openings_count: z.coerce.number().min(1, 'Must have at least 1 opening').default(1),
  application_instructions: z.string().optional().or(z.literal('')),
});

export const applicationSubmitSchema = z.object({
  opportunity_id: z.string().min(1),
  introduction_text: z.string().min(20, 'Please write a brief statement of interest (min 20 chars)'),
  project_ids: z.array(z.string()).default([]),
});

export const screenTimeEntrySchema = z.object({
  baseline_mins: z.coerce.number().min(0).max(1440),
  current_mins: z.coerce.number().min(0).max(1440),
  entry_date: z.string().min(1),
  notes: z.string().max(300).optional().or(z.literal('')),
});

export const contentReportSchema = z.object({
  reported_item_type: z.enum(['project', 'profile', 'opportunity', 'organization']),
  reported_item_id: z.string().min(1),
  reason: z.string().min(5, 'Please provide a reason for the report'),
  details: z.string().max(500).optional().or(z.literal('')),
});
