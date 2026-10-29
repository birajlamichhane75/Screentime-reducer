-- SkillBridge PostgreSQL Schema Migration
-- Migration: 20261028000001_initial_schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'organization', 'admin')) DEFAULT 'student',
    full_name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    education_level TEXT,
    daily_goal_minutes INTEGER NOT NULL DEFAULT 30,
    is_private BOOLEAN NOT NULL DEFAULT false,
    is_discoverable BOOLEAN NOT NULL DEFAULT true,
    allow_org_contact BOOLEAN NOT NULL DEFAULT true,
    baseline_screen_time_mins INTEGER NOT NULL DEFAULT 180,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. SKILLS
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. USER_SKILLS
CREATE TABLE IF NOT EXISTS public.user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    experience_level TEXT NOT NULL CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    years_exp NUMERIC(3,1) NOT NULL DEFAULT 0.5,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_skill UNIQUE (user_id, skill_id)
);

-- 4. HOBBIES
CREATE TABLE IF NOT EXISTS public.hobbies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL DEFAULT 'Sparkles',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. USER_HOBBIES
CREATE TABLE IF NOT EXISTS public.user_hobbies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    hobby_id UUID NOT NULL REFERENCES public.hobbies(id) ON DELETE CASCADE,
    daily_target_mins INTEGER NOT NULL DEFAULT 30,
    weekly_target_mins INTEGER NOT NULL DEFAULT 210,
    current_level TEXT NOT NULL CHECK (current_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_hobby UNIQUE (user_id, hobby_id)
);

-- 6. PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    hobby_id UUID NOT NULL REFERENCES public.hobbies(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    skills_demonstrated TEXT[] NOT NULL DEFAULT '{}',
    external_url TEXT,
    github_url TEXT,
    visibility TEXT NOT NULL CHECK (visibility IN ('public', 'private', 'discoverable')) DEFAULT 'public',
    project_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. PROJECT_MEDIA
CREATE TABLE IF NOT EXISTS public.project_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'document')),
    file_size_bytes BIGINT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. CHALLENGES
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
    duration_mins INTEGER NOT NULL DEFAULT 30,
    reward_points INTEGER NOT NULL DEFAULT 50,
    start_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    deadline TIMESTAMPTZ NOT NULL,
    submission_requirements TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'archived')) DEFAULT 'active',
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. ACTIVITY_SESSIONS
CREATE TABLE IF NOT EXISTS public.activity_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    hobby_id UUID NOT NULL REFERENCES public.hobbies(id) ON DELETE RESTRICT,
    goal_text TEXT,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('started', 'paused', 'completed', 'cancelled')) DEFAULT 'started',
    started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ,
    notes TEXT,
    evidence_url TEXT,
    reward_awarded BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. CHALLENGE_SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.challenge_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    evidence_url TEXT,
    status TEXT NOT NULL CHECK (status IN ('submitted', 'under_review', 'accepted', 'rejected')) DEFAULT 'submitted',
    review_notes TEXT,
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    points_awarded INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. REWARD_EVENTS (Immutable Event Ledger)
CREATE TABLE IF NOT EXISTS public.reward_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('session_completed', 'project_created', 'challenge_completed', 'milestone_reached', 'streak_bonus')),
    reference_id UUID,
    reference_type TEXT,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL DEFAULT 'Award',
    category TEXT NOT NULL,
    points_threshold INTEGER NOT NULL DEFAULT 0,
    criteria_type TEXT NOT NULL,
    criteria_value INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. USER_ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_id)
);

-- 14. ORGANIZATIONS
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    org_type TEXT NOT NULL CHECK (org_type IN ('university', 'student_club', 'company', 'nonprofit', 'community', 'other')),
    website TEXT,
    official_email TEXT NOT NULL,
    description TEXT NOT NULL,
    logo_url TEXT,
    location TEXT,
    contact_name TEXT NOT NULL,
    contact_phone TEXT,
    verification_status TEXT NOT NULL CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES public.profiles(id),
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 15. ORGANIZATION_MEMBERS
CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')) DEFAULT 'member',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_org_user UNIQUE (organization_id, user_id)
);

-- 16. ORGANIZATION_VERIFICATION_REQUESTS
CREATE TABLE IF NOT EXISTS public.organization_verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    requested_by UUID NOT NULL REFERENCES public.profiles(id),
    documents_urls TEXT[] DEFAULT '{}',
    notes TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    reviewer_notes TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 17. OPPORTUNITIES
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    opportunity_type TEXT NOT NULL CHECK (opportunity_type IN ('scholarship', 'internship', 'mentorship', 'competition', 'club_recruitment', 'paid_project', 'volunteer', 'collaboration')),
    required_skills TEXT[] NOT NULL DEFAULT '{}',
    preferred_experience TEXT,
    eligibility_criteria TEXT,
    location TEXT,
    location_type TEXT NOT NULL CHECK (location_type IN ('remote', 'hybrid', 'in_person')) DEFAULT 'remote',
    compensation_details TEXT,
    deadline TIMESTAMPTZ NOT NULL,
    openings_count INTEGER NOT NULL DEFAULT 1,
    application_instructions TEXT,
    status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'closed', 'archived')) DEFAULT 'published',
    is_demo BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 18. OPPORTUNITY_SKILLS
CREATE TABLE IF NOT EXISTS public.opportunity_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
    is_required BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_opportunity_skill UNIQUE (opportunity_id, skill_id)
);

-- 19. APPLICATIONS
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('submitted', 'under_review', 'shortlisted', 'accepted', 'rejected', 'withdrawn')) DEFAULT 'submitted',
    introduction_text TEXT,
    review_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_opportunity_applicant UNIQUE (opportunity_id, applicant_id)
);

-- 20. APPLICATION_PROJECTS
CREATE TABLE IF NOT EXISTS public.application_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_app_project UNIQUE (application_id, project_id)
);

-- 21. SAVED_OPPORTUNITIES
CREATE TABLE IF NOT EXISTS public.saved_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_saved_opp UNIQUE (user_id, opportunity_id)
);

-- 22. TALENT_SHORTLISTS
CREATE TABLE IF NOT EXISTS public.talent_shortlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    talent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_org_talent UNIQUE (organization_id, talent_id)
);

-- 23. ORGANIZATION_INVITATIONS
CREATE TABLE IF NOT EXISTS public.organization_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
    talent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('sent', 'viewed', 'applied', 'declined')) DEFAULT 'sent',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 24. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('achievement', 'opportunity', 'application', 'challenge', 'verification', 'system')),
    link_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 25. NOTIFICATION_PREFERENCES
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    email_notifications BOOLEAN NOT NULL DEFAULT true,
    in_app_notifications BOOLEAN NOT NULL DEFAULT true,
    opportunity_alerts BOOLEAN NOT NULL DEFAULT true,
    challenge_reminders BOOLEAN NOT NULL DEFAULT true,
    marketing_emails BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 26. SCREEN_TIME_ENTRIES
CREATE TABLE IF NOT EXISTS public.screen_time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    baseline_mins INTEGER NOT NULL,
    current_mins INTEGER NOT NULL,
    saved_mins INTEGER GENERATED ALWAYS AS (GREATEST(0, baseline_mins - current_mins)) STORED,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_screen_date UNIQUE (user_id, entry_date)
);

-- 27. CONTENT_REPORTS
CREATE TABLE IF NOT EXISTS public.content_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id),
    reported_item_type TEXT NOT NULL CHECK (reported_item_type IN ('project', 'profile', 'opportunity', 'organization')),
    reported_item_id UUID NOT NULL,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')) DEFAULT 'pending',
    action_taken TEXT,
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 28. AUDIT_LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id UUID,
    ip_address TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_skills_user ON public.user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_hobbies_user ON public.user_hobbies(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_visibility ON public.projects(visibility);
CREATE INDEX IF NOT EXISTS idx_activity_sessions_user ON public.activity_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_events_user ON public.reward_events(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_org ON public.opportunities(organization_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant ON public.applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applications_opp ON public.applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_shortlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screen_time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Base RLS Policies
-- Profiles: everyone can view non-private or own, users update their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (NOT is_private OR auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Skills & Hobbies: everyone can view active
CREATE POLICY "Active skills viewable by everyone" ON public.skills
    FOR SELECT USING (is_active = true);

CREATE POLICY "Active hobbies viewable by everyone" ON public.hobbies
    FOR SELECT USING (is_active = true);

-- User skills & User hobbies: user owns them
CREATE POLICY "Users can manage own user_skills" ON public.user_skills
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own user_hobbies" ON public.user_hobbies
    FOR ALL USING (auth.uid() = user_id);

-- Projects: public / discoverable or owned
CREATE POLICY "View projects policy" ON public.projects
    FOR SELECT USING (
        visibility = 'public' 
        OR (visibility = 'discoverable' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('organization', 'admin')))
        OR auth.uid() = user_id
    );

CREATE POLICY "Users manage own projects" ON public.projects
    FOR ALL USING (auth.uid() = user_id);

-- Activity sessions: private to user
CREATE POLICY "Users manage own sessions" ON public.activity_sessions
    FOR ALL USING (auth.uid() = user_id);

-- Reward events: readable by user, inserted via server functions
CREATE POLICY "Users view own reward events" ON public.reward_events
    FOR SELECT USING (auth.uid() = user_id);

-- Opportunities: published visible to all, draft/archived visible to owning organization
CREATE POLICY "View opportunities policy" ON public.opportunities
    FOR SELECT USING (
        status = 'published' 
        OR EXISTS (
            SELECT 1 FROM public.organizations org 
            WHERE org.id = opportunities.organization_id AND org.user_id = auth.uid()
        )
    );

CREATE POLICY "Organizations manage own opportunities" ON public.opportunities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.organizations org 
            WHERE org.id = opportunities.organization_id AND org.user_id = auth.uid()
        )
    );

-- Applications: applicant and opportunity organization can view
CREATE POLICY "Applications view policy" ON public.applications
    FOR SELECT USING (
        auth.uid() = applicant_id 
        OR EXISTS (
            SELECT 1 FROM public.opportunities opp
            JOIN public.organizations org ON org.id = opp.organization_id
            WHERE opp.id = applications.opportunity_id AND org.user_id = auth.uid()
        )
    );

CREATE POLICY "Applicant can submit applications" ON public.applications
    FOR INSERT WITH CHECK (auth.uid() = applicant_id);

-- Notifications: user reads and updates own notifications
CREATE POLICY "Users view own notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

-- Screen time entries: user manages own
CREATE POLICY "Users manage own screen time" ON public.screen_time_entries
    FOR ALL USING (auth.uid() = user_id);

-- TRIGGER FUNCTION: Handle New User Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, username, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1) || '_' || substr(NEW.id::text, 1, 6)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    );
    INSERT INTO public.notification_preferences (user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRANSACTIONAL FUNCTION: Award Points Idempotently
CREATE OR REPLACE FUNCTION public.award_points_transaction(
    p_user_id UUID,
    p_points INTEGER,
    p_event_type TEXT,
    p_ref_id UUID,
    p_ref_type TEXT,
    p_description TEXT
) RETURNS JSONB AS $$
DECLARE
    v_event_id UUID;
    v_total_points INTEGER;
BEGIN
    -- Check for duplicate reward event on same reference
    IF p_ref_id IS NOT NULL THEN
        IF EXISTS (
            SELECT 1 FROM public.reward_events 
            WHERE user_id = p_user_id 
              AND reference_id = p_ref_id 
              AND event_type = p_event_type
        ) THEN
            RETURN jsonb_build_object('success', false, 'error', 'Reward already granted for this activity');
        END IF;
    END IF;

    -- Insert into immutable ledger
    INSERT INTO public.reward_events (user_id, points, event_type, reference_id, reference_type, description)
    VALUES (p_user_id, p_points, p_event_type, p_ref_id, p_ref_type, p_description)
    RETURNING id INTO v_event_id;

    -- Calculate current total
    SELECT COALESCE(SUM(points), 0) INTO v_total_points FROM public.reward_events WHERE user_id = p_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'event_id', v_event_id,
        'points_awarded', p_points,
        'total_points', v_total_points
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
