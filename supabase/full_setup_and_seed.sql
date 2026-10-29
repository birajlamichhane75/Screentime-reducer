-- ==============================================================================
-- SKILLBRIDGE: FULL DATABASE SETUP & SEED SCRIPT
-- Run this in the Supabase Dashboard -> SQL Editor (or via CLI)
-- Safe to re-run: Uses IF NOT EXISTS and ON CONFLICT DO NOTHING
-- ==============================================================================

-- 0. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Supports both authenticating auth.users and demo creators)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'organization', 'admin')),
    bio TEXT,
    categories TEXT[] DEFAULT '{}',
    location TEXT,
    is_verified BOOLEAN DEFAULT false,
    consistency_rating INTEGER DEFAULT 50,
    rating_checkpoint TEXT DEFAULT 'Bronze',
    upload_streak_days INTEGER DEFAULT 0,
    last_uploaded_at TIMESTAMPTZ,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_rating ON public.profiles(consistency_rating DESC);

-- 2. Talent Categories Table
CREATE TABLE IF NOT EXISTS public.talent_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Talent Videos Table (TikTok / Reels style short showcase clips)
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    title TEXT,
    caption TEXT NOT NULL,
    category TEXT NOT NULL,
    duration_formatted TEXT DEFAULT '01:00',
    duration_seconds INTEGER DEFAULT 60,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for lightning fast feed and search queries
CREATE INDEX IF NOT EXISTS idx_videos_category ON public.videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_creator ON public.videos(creator_id);
CREATE INDEX IF NOT EXISTS idx_videos_created ON public.videos(created_at DESC);

-- 4. Video Likes Table
CREATE TABLE IF NOT EXISTS public.video_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(video_id, user_id)
);

-- 5. Selected Works (Organizations selecting/shortlisting student work)
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

-- 6. Sent Email Notifications (Logged when organizations select work)
CREATE TABLE IF NOT EXISTS public.sent_emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_email TEXT NOT NULL,
    recipient_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    org_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    work_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    body_text TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT now(),
    status TEXT DEFAULT 'delivered'
);

-- 7. Saved Talent (Organizations bookmarking Creators)
CREATE TABLE IF NOT EXISTS public.saved_creators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(org_id, creator_id)
);

-- 6. Contact Requests (Organizations offering opportunities to Creators)
CREATE TABLE IF NOT EXISTS public.contact_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_title TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Public read policies (anyone can discover talent)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public profiles viewable by all' AND tablename = 'profiles') THEN
        CREATE POLICY "Public profiles viewable by all" ON public.profiles FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public categories viewable by all' AND tablename = 'talent_categories') THEN
        CREATE POLICY "Public categories viewable by all" ON public.talent_categories FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public videos viewable by all' AND tablename = 'videos') THEN
        CREATE POLICY "Public videos viewable by all" ON public.videos FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public likes viewable by all' AND tablename = 'video_likes') THEN
        CREATE POLICY "Public likes viewable by all" ON public.video_likes FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public contact requests viewable' AND tablename = 'contact_requests') THEN
        CREATE POLICY "Public contact requests viewable" ON public.contact_requests FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public saved creators viewable' AND tablename = 'saved_creators') THEN
        CREATE POLICY "Public saved creators viewable" ON public.saved_creators FOR SELECT USING (true);
    END IF;
END $$;

-- Permissive insert/update policies for demonstration & app functionality
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert videos' AND tablename = 'videos') THEN
        CREATE POLICY "Allow insert videos" ON public.videos FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow update videos' AND tablename = 'videos') THEN
        CREATE POLICY "Allow update videos" ON public.videos FOR UPDATE USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow toggle likes' AND tablename = 'video_likes') THEN
        CREATE POLICY "Allow toggle likes" ON public.video_likes FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow manage saved' AND tablename = 'saved_creators') THEN
        CREATE POLICY "Allow manage saved" ON public.saved_creators FOR ALL USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow insert contact requests' AND tablename = 'contact_requests') THEN
        CREATE POLICY "Allow insert contact requests" ON public.contact_requests FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow update contact requests' AND tablename = 'contact_requests') THEN
        CREATE POLICY "Allow update contact requests" ON public.contact_requests FOR UPDATE USING (true);
    END IF;
END $$;


-- ==============================================================================
-- SEED DATA: CATEGORIES, CREATORS & TALENT VIDEOS
-- ==============================================================================

-- 1. Categories
INSERT INTO public.talent_categories (name, slug) VALUES
('Music', 'music'),
('Dance', 'dance'),
('Drawing', 'drawing'),
('Painting', 'painting'),
('Singing', 'singing'),
('Sports', 'sports'),
('Coding', 'coding'),
('AI', 'ai'),
('Photography', 'photography'),
('Robotics', 'robotics')
ON CONFLICT (name) DO NOTHING;

-- 2. Creators & Organizations
INSERT INTO public.profiles (id, username, full_name, avatar_url, role, bio, categories, location, is_verified, followers_count, following_count) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'sarahmusic', 'Sarah Johnson', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', 'student', 'Acoustic guitar player & songwriter ✨\nCreating melodies and sharing passion for music.', ARRAY['Music', 'Singing'], 'Nashville, TN', true, 24500, 180),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'emmadance', 'Emma Watson', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80', 'student', 'Contemporary dancer & choreographer. Sharing movement, emotion & routines.', ARRAY['Dance', 'Fitness'], 'New York, NY', true, 18200, 240),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'artbylucas', 'Lucas Vance', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80', 'student', 'Graphite pencil & realistic portraits artist. Obsessed with detail & textures.', ARRAY['Drawing', 'Painting'], 'Los Angeles, CA', true, 31000, 110),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'mikesoccer', 'Mike Sterling', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', 'student', 'Freestyle footballer & agility training drills. Never stop practicing.', ARRAY['Sports', 'Fitness'], 'Miami, FL', true, 14500, 95),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'emmamusic', 'Emma Hayes', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80', 'student', 'Vocalist & piano acoustic covers. Turning classic songs into personal stories.', ARRAY['Singing', 'Music'], 'Austin, TX', true, 22100, 310),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'alexdev', 'Alex Chen', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80', 'student', 'Full-stack builder (React, TypeScript, AI). Sharing rapid prototypes and dev setups.', ARRAY['Coding', 'AI'], 'Seattle, WA', true, 28700, 420),
('00000000-0000-0000-0000-000000000001', 'jamesphoto', 'James Miller', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80', 'student', 'Landscape & golden hour photographer. Chasing light and capturing perspective.', ARRAY['Photography'], 'Denver, CO', true, 19800, 150),
('11111111-1111-1111-1111-111111111111', 'creativearts', 'Creative Arts University', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&auto=format&fit=crop&q=80', 'organization', 'Leading creative institution offering scholarships and performance grants for emerging talent.', ARRAY['Music', 'Dance', 'Drawing'], 'Chicago, IL', true, 89000, 45)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    bio = EXCLUDED.bio,
    categories = EXCLUDED.categories;

-- 3. Talent Videos (Matching Creator Home & Explore Grid Mockups)
INSERT INTO public.videos (id, creator_id, video_url, thumbnail_url, title, caption, category, duration_formatted, duration_seconds, likes_count, comments_count, shares_count, views_count) VALUES
(
    '10000000-0000-0000-0000-000000000001',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&auto=format&fit=crop&q=80',
    'Practicing a new song ✨',
    'Practicing a new song ✨' || E'\n' || 'What do you think?',
    'Music',
    '02:15',
    135,
    2400,
    186,
    92,
    12400
),
(
    '10000000-0000-0000-0000-000000000002',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
    'Contemporary Dance Routine',
    'Contemporary Dance Routine expressing emotion through fluid motion ✨',
    'Dance',
    '00:45',
    45,
    3800,
    94,
    42,
    9800
),
(
    '10000000-0000-0000-0000-000000000003',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80',
    'Realistic Portrait Drawing',
    'Realistic Portrait Drawing in graphite pencil 🎨',
    'Drawing',
    '01:20',
    80,
    8200,
    198,
    65,
    14800
),
(
    '10000000-0000-0000-0000-000000000004',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80',
    'Football Skills Training',
    'Football Skills Training & agility drills ⚽',
    'Sports',
    '00:38',
    38,
    4500,
    112,
    38,
    8900
),
(
    '10000000-0000-0000-0000-000000000005',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    'Cover Song - Someone Like You',
    'Cover Song - Someone Like You (Acoustic Version) 🎤',
    'Music',
    '01:12',
    72,
    6100,
    215,
    88,
    16200
),
(
    '10000000-0000-0000-0000-000000000006',
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    'Building a React Project',
    'Building a React Project with Next.js 16 & TypeScript 💻',
    'Coding',
    '02:10',
    130,
    7400,
    167,
    110,
    18900
),
(
    '10000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000001',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    'Sunset Photography Tips',
    'Sunset Photography Tips: Framing with natural lighting 📸',
    'Photography',
    '00:55',
    55,
    3200,
    89,
    34,
    7600
),
(
    '10000000-0000-0000-0000-000000000008',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?w=800&auto=format&fit=crop&q=80',
    'Kickflip Street Session',
    'Afternoon street skating session! Clean frontside kickflip 🛹',
    'Sports',
    '01:03',
    63,
    5100,
    140,
    72,
    11300
)
ON CONFLICT (id) DO NOTHING;

-- 4. Initial Saved Talent & Contact Request
INSERT INTO public.saved_creators (org_id, creator_id) VALUES
('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
ON CONFLICT (org_id, creator_id) DO NOTHING;

INSERT INTO public.contact_requests (org_id, creator_id, opportunity_title, message, status) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Music Performance Scholarship 2026',
    'We love your acoustic guitar videos! We would love to discuss our upcoming spring performance scholarship and invite you to audition.',
    'pending'
)
ON CONFLICT DO NOTHING;
