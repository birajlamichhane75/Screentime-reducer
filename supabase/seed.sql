-- SkillBridge Demonstration Seed Data
-- Clearly labeled demonstration content as specified in Section 26 of requirements

-- 1. HOBBIES
INSERT INTO public.hobbies (id, name, slug, category, description, icon_name, is_active) VALUES
('11111111-1111-1111-1111-111111111101', 'Drawing & Digital Art', 'drawing-digital-art', 'Visual Arts', 'Traditional sketching, character design, and digital illustration practice.', 'Palette', true),
('11111111-1111-1111-1111-111111111102', 'Coding & Technology', 'coding-technology', 'Technology & Code', 'Software development, web apps, game design, and algorithmic problem solving.', 'Code2', true),
('11111111-1111-1111-1111-111111111103', 'Photography', 'photography', 'Visual Arts', 'Framing, composition, natural lighting, and digital image development.', 'Camera', true),
('11111111-1111-1111-1111-111111111104', 'Music & Production', 'music-production', 'Music & Audio', 'Instrument practice, audio engineering, MIDI sequencing, and melody composition.', 'Music', true),
('11111111-1111-1111-1111-111111111105', 'Writing & Storytelling', 'writing-storytelling', 'Writing & Content', 'Creative writing, technical essays, poetry, and narrative screenplay structuring.', 'PenTool', true),
('11111111-1111-1111-1111-111111111106', 'Video Editing & Motion', 'video-editing-motion', 'Design & Media', 'Pacing, color correction, motion graphics, and narrative editing workflows.', 'Video', true),
('11111111-1111-1111-1111-111111111107', 'Graphic Design & Branding', 'graphic-design-branding', 'Design & Media', 'Typography, vector logos, layout aesthetics, and brand identity design.', 'Layers', true),
('11111111-1111-1111-1111-111111111108', 'Robotics & Hardware', 'robotics-hardware', 'Technology & Code', 'Microcontrollers, 3D printing, sensor circuits, and embedded systems.', 'Cpu', true)
ON CONFLICT (id) DO NOTHING;

-- 2. SKILLS
INSERT INTO public.skills (id, name, slug, category, description, is_active) VALUES
('22222222-2222-2222-2222-222222222201', 'React & Next.js', 'react-nextjs', 'Technology & Code', 'Component architecture, hooks, and modern frontend application development.', true),
('22222222-2222-2222-2222-222222222202', 'TypeScript', 'typescript', 'Technology & Code', 'Static typing, generics, and strict JavaScript patterns.', true),
('22222222-2222-2222-2222-222222222203', 'Python Programming', 'python-programming', 'Technology & Code', 'Data scripting, backend automation, and foundational machine learning.', true),
('22222222-2222-2222-2222-222222222204', 'Digital Illustration', 'digital-illustration', 'Visual Arts', 'Character drawing, line art, shading, and digital painting.', true),
('22222222-2222-2222-2222-222222222205', 'Portrait Photography', 'portrait-photography', 'Visual Arts', 'Subject lighting, lens selection, and portrait composition.', true),
('22222222-2222-2222-2222-222222222206', 'Color Grading', 'color-grading', 'Design & Media', 'LUTs, waveform monitoring, and cinematic color curves.', true),
('22222222-2222-2222-2222-222222222207', 'Creative Writing', 'creative-writing', 'Writing & Content', 'Character arcs, descriptive prose, dialogue pacing, and tension.', true),
('22222222-2222-2222-2222-222222222208', 'UI/UX Design', 'ui-ux-design', 'Design & Media', 'Wireframing, accessibility, design systems, and responsive layouts.', true)
ON CONFLICT (id) DO NOTHING;

-- 3. ACHIEVEMENTS
INSERT INTO public.achievements (id, code, title, description, icon_name, category, points_threshold, criteria_type, criteria_value) VALUES
('33333333-3333-3333-3333-333333333301', 'first_step', 'First Step', 'Completed your first focused hobby session', 'Sparkles', 'sessions', 10, 'session_count', 1),
('33333333-3333-3333-3333-333333333302', 'consistent_creator', 'Consistent Creator', 'Completed 5 focused hobby practice sessions', 'Flame', 'sessions', 50, 'session_count', 5),
('33333333-3333-3333-3333-333333333303', 'portfolio_builder', 'Portfolio Builder', 'Published 3 verified creative projects', 'Briefcase', 'projects', 60, 'project_count', 3),
('33333333-3333-3333-3333-333333333304', 'challenge_finisher', 'Challenge Finisher', 'Successfully completed your first platform challenge', 'Trophy', 'challenges', 50, 'challenge_count', 1),
('33333333-3333-3333-3333-333333333305', 'skill_explorer', 'Skill Explorer', 'Practiced skills in 2 or more diverse categories', 'Compass', 'exploration', 40, 'category_count', 2),
('33333333-3333-3333-3333-333333333306', 'centurion', 'Century Milestone', 'Accumulated 100 total achievement points', 'Award', 'points', 100, 'points_total', 100)
ON CONFLICT (id) DO NOTHING;

-- 4. CHALLENGES
INSERT INTO public.challenges (id, title, description, category, difficulty, duration_mins, reward_points, start_date, deadline, submission_requirements, status) VALUES
('44444444-4444-4444-4444-444444444401', '30-Minute Light & Shadow Study', 'Sketch a household object focusing entirely on directional light, specular highlights, and soft cast shadows.', 'Visual Arts', 'beginner', 30, 30, now(), now() + interval '14 days', 'Submit a photo or digital scan of your 30-minute shading study.', 'active'),
('44444444-4444-4444-4444-444444444402', 'Build an Accessible Theme Toggle', 'Construct a clean React or vanilla component providing light/dark mode with proper aria-labels and smooth CSS transitions.', 'Technology & Code', 'intermediate', 45, 50, now(), now() + interval '21 days', 'Submit a link to a live preview or code repository demonstration.', 'active'),
('44444444-4444-4444-4444-444444444403', 'Five Compositions in Golden Hour', 'Take 5 photographs demonstrating different framing styles (leading lines, rule of thirds, framing within frames) during golden hour.', 'Visual Arts', 'beginner', 60, 45, now(), now() + interval '10 days', 'Submit an image gallery link demonstrating all 5 compositions.', 'active'),
('44444444-4444-4444-4444-444444444404', '500-Word Narrative Opening', 'Write a compelling opening scene establishing voice, immediate stakes, and an unforgettable character quirk without exposition dumping.', 'Writing & Content', 'beginner', 40, 40, now(), now() + interval '30 days', 'Submit your 500-word written story text or document link.', 'active')
ON CONFLICT (id) DO NOTHING;
