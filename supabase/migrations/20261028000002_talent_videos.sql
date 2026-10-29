-- ====================================================================
-- SKILLBRIDGE MIGRATION: TALENT VIDEOS & SIMPLE DISCOVERY PLATFORM
-- Safe, additive migration preserving existing tables while enabling
-- TikTok-style video feed, saved talent, and contact requests.
-- ====================================================================

-- 1. Talent Videos Table
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    caption TEXT NOT NULL,
    category TEXT NOT NULL,
    likes_count INTEGER NOT NULL DEFAULT 0,
    comments_count INTEGER NOT NULL DEFAULT 0,
    shares_count INTEGER NOT NULL DEFAULT 0,
    views_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for feed & search performance
CREATE INDEX IF NOT EXISTS idx_videos_category ON public.videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_creator_id ON public.videos(creator_id);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON public.videos(created_at DESC);

-- 2. Video Likes Table
CREATE TABLE IF NOT EXISTS public.video_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(video_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_video_likes_user ON public.video_likes(user_id);

-- 3. Saved Talent (Organizations bookmarking Creators)
CREATE TABLE IF NOT EXISTS public.saved_creators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(org_id, creator_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_creators_org ON public.saved_creators(org_id);

-- 4. Contact Requests (Organizations contacting Creators for Opportunities)
CREATE TABLE IF NOT EXISTS public.contact_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_title TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_requests_creator ON public.contact_requests(creator_id);
CREATE INDEX IF NOT EXISTS idx_contact_requests_org ON public.contact_requests(org_id);

-- 5. Row Level Security Policies
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Videos policies
CREATE POLICY "Public videos are viewable by everyone"
    ON public.videos FOR SELECT USING (true);

CREATE POLICY "Creators can insert their own videos"
    ON public.videos FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own videos"
    ON public.videos FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their own videos"
    ON public.videos FOR DELETE USING (auth.uid() = creator_id);

-- Video likes policies
CREATE POLICY "Video likes viewable by everyone"
    ON public.video_likes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can toggle likes"
    ON public.video_likes FOR ALL USING (auth.uid() = user_id);

-- Saved creators policies
CREATE POLICY "Organizations can manage their saved talent"
    ON public.saved_creators FOR ALL USING (auth.uid() = org_id);

-- Contact requests policies
CREATE POLICY "Creators can view requests sent to them"
    ON public.contact_requests FOR SELECT USING (auth.uid() = creator_id OR auth.uid() = org_id);

CREATE POLICY "Organizations can insert contact requests"
    ON public.contact_requests FOR INSERT WITH CHECK (auth.uid() = org_id);

CREATE POLICY "Creators can update status of requests sent to them"
    ON public.contact_requests FOR UPDATE USING (auth.uid() = creator_id);
