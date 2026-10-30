-- ==============================================================================
-- SKILLBRIDGE: 1-MINUTE SUPABASE DATABASE & STORAGE SETUP
-- Copy & Paste this entire file into your Supabase Dashboard -> SQL Editor -> Click RUN
-- ==============================================================================

-- 1. CREATE STORAGE BUCKET FOR VIDEOS
INSERT INTO storage.buckets (id, name, public) 
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable Public Reading & Uploads for the 'videos' Storage Bucket
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Videos Read' AND tablename = 'objects') THEN
        CREATE POLICY "Public Videos Read" ON storage.objects FOR SELECT USING (bucket_id = 'videos');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Videos Upload' AND tablename = 'objects') THEN
        CREATE POLICY "Public Videos Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'videos');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Videos Update' AND tablename = 'objects') THEN
        CREATE POLICY "Public Videos Update" ON storage.objects FOR UPDATE USING (bucket_id = 'videos');
    END IF;
END $$;

-- 2. CREATE SELECTED WORKS TABLE (Organizations shortlisting videos)
CREATE TABLE IF NOT EXISTS public.selected_works (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    creator_email TEXT NOT NULL,
    work_title TEXT NOT NULL,
    work_category TEXT NOT NULL,
    notes TEXT,
    selected_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(org_id, video_id)
);

ALTER TABLE public.selected_works ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public selected_works viewable' AND tablename = 'selected_works') THEN
        CREATE POLICY "Public selected_works viewable" ON public.selected_works FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow manage selected_works' AND tablename = 'selected_works') THEN
        CREATE POLICY "Allow manage selected_works" ON public.selected_works FOR ALL USING (true);
    END IF;
END $$;

-- 3. ENSURE PERMISSIVE POLICIES FOR PROFILES & VIDEOS
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert profiles' AND tablename = 'profiles') THEN
        CREATE POLICY "Allow insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow update profiles' AND tablename = 'profiles') THEN
        CREATE POLICY "Allow update profiles" ON public.profiles FOR UPDATE USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert videos' AND tablename = 'videos') THEN
        CREATE POLICY "Allow insert videos" ON public.videos FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow update videos' AND tablename = 'videos') THEN
        CREATE POLICY "Allow update videos" ON public.videos FOR UPDATE USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow toggle likes' AND tablename = 'video_likes') THEN
        CREATE POLICY "Allow toggle likes" ON public.video_likes FOR ALL USING (true);
    END IF;
END $$;

