-- ==============================================================================
-- CyberPath — Phase 2 Database Schema & Row-Level Security
-- ==============================================================================
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Create Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing triggers if running idempotently
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TRIGGER IF EXISTS update_profiles_modtime ON public.profiles;
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- ==============================================================================
-- 3. Tables Definition
-- ==============================================================================

-- 3.1 PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    selected_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.2 LEARNING PATHS TABLE
CREATE TABLE IF NOT EXISTS public.learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.3 TOPICS TABLE
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_path_id UUID NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    sequence_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_path_sequence UNIQUE (learning_path_id, sequence_order)
);

-- 3.4 STUDENT PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_topic_progress UNIQUE (user_id, topic_id)
);

-- 3.5 BADGES TABLE
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    badge_type TEXT NOT NULL DEFAULT 'track_specialist' CHECK (badge_type IN ('track_specialist', 'apex_credential', 'special_achievement')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.6 STUDENT BADGES TABLE
CREATE TABLE IF NOT EXISTS public.student_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_badge UNIQUE (user_id, badge_id)
);

-- ==============================================================================
-- 4. Indexes for Performance
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_topics_learning_path_id ON public.topics(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_user_id ON public.student_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_student_badges_user_id ON public.student_badges(user_id);

-- ==============================================================================
-- 5. Automatic Profile Creation & Timestamp Triggers
-- ==============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, selected_path, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NULL,
        timezone('utc'::text, now()),
        timezone('utc'::text, now())
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 6. Row Level Security (RLS) Policies
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_badges ENABLE ROW LEVEL SECURITY;

-- 6.1 PROFILES POLICIES
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- 6.2 LEARNING PATHS POLICIES (Public read)
DROP POLICY IF EXISTS "Learning paths are publicly readable" ON public.learning_paths;
CREATE POLICY "Learning paths are publicly readable"
    ON public.learning_paths FOR SELECT
    USING (true);

-- 6.3 TOPICS POLICIES (Public read)
DROP POLICY IF EXISTS "Topics are publicly readable" ON public.topics;
CREATE POLICY "Topics are publicly readable"
    ON public.topics FOR SELECT
    USING (true);

-- 6.4 BADGES POLICIES (Public read)
DROP POLICY IF EXISTS "Badges are publicly readable" ON public.badges;
CREATE POLICY "Badges are publicly readable"
    ON public.badges FOR SELECT
    USING (true);

-- 6.5 STUDENT PROGRESS POLICIES
DROP POLICY IF EXISTS "Users can read own progress" ON public.student_progress;
CREATE POLICY "Users can read own progress"
    ON public.student_progress FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON public.student_progress;
CREATE POLICY "Users can insert own progress"
    ON public.student_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON public.student_progress;
CREATE POLICY "Users can update own progress"
    ON public.student_progress FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 6.6 STUDENT BADGES POLICIES
-- Security rule: Users can read only their own earned badges.
DROP POLICY IF EXISTS "Users can read own earned badges" ON public.student_badges;
CREATE POLICY "Users can read own earned badges"
    ON public.student_badges FOR SELECT
    USING (auth.uid() = user_id);

-- CRITICAL SECURITY RULE:
-- NO INSERT, UPDATE, or DELETE policies for authenticated users on student_badges!
-- This strictly prevents users from awarding badges to themselves by tampering with frontend client requests.
-- Badge issuance is reserved for backend trusted service-role processes or verified assessment triggers.

-- ==============================================================================
-- 7. Seed Initial Data
-- ==============================================================================

-- 7.1 Seed Learning Paths
INSERT INTO public.learning_paths (slug, title, description)
VALUES
    ('red-team', 'Red Team', 'Learn ethical hacking, network reconnaissance, and authorized penetration testing workflows.'),
    ('blue-team', 'Blue Team', 'Master defensive security operations, threat telemetry analysis, SIEM monitoring, and incident response.'),
    ('web-security', 'Web Security', 'Explore HTTP mechanics, client-server architectures, OWASP vulnerabilities, and proxy inspection.')
ON CONFLICT (slug) DO UPDATE
SET title = EXCLUDED.title, description = EXCLUDED.description;

-- 7.2 Seed Topics for each Learning Path
DO $$
DECLARE
    red_id UUID;
    blue_id UUID;
    web_id UUID;
BEGIN
    SELECT id INTO red_id FROM public.learning_paths WHERE slug = 'red-team';
    SELECT id INTO blue_id FROM public.learning_paths WHERE slug = 'blue-team';
    SELECT id INTO web_id FROM public.learning_paths WHERE slug = 'web-security';

    -- Red Team Topics
    INSERT INTO public.topics (learning_path_id, title, description, sequence_order)
    VALUES
        (red_id, 'Linux Fundamentals for Hackers', 'Command line fluency, file permissions, and process inspection.', 1),
        (red_id, 'Networking & Host Discovery', 'IP architecture, subnetting, and active network exploration.', 2),
        (red_id, 'Passive & Active Reconnaissance', 'OSINT gathering, subdomain enumeration, and DNS querying.', 3),
        (red_id, 'Scanning with Nmap & Zenmap', 'Port scanning methodologies, service flags, and NSE scripts.', 4),
        (red_id, 'Vulnerability Assessment Basics', 'Mapping discovered services to known CVEs and misconfigurations.', 5),
        (red_id, 'Introduction to Exploitation Frameworks', 'Metasploit fundamentals in safe, authorized lab environments.', 6)
    ON CONFLICT (learning_path_id, sequence_order) DO UPDATE
    SET title = EXCLUDED.title, description = EXCLUDED.description;

    -- Blue Team Topics
    INSERT INTO public.topics (learning_path_id, title, description, sequence_order)
    VALUES
        (blue_id, 'Defensive Security Architecture', 'Core defensive principles, defense-in-depth, and perimeter security.', 1),
        (blue_id, 'Security Telemetry & Event Logging', 'Windows Event Logs, syslog, and central log aggregation.', 2),
        (blue_id, 'Network Intrusion Detection', 'Analyzing packet captures with Wireshark and detecting anomalous traffic.', 3),
        (blue_id, 'SIEM Fundamentals', 'Searching and correlating alerts in a Security Operations Center (SOC).', 4),
        (blue_id, 'Incident Triage & Containment', 'The incident response lifecycle: identification, containment, and eradication.', 5),
        (blue_id, 'Threat Hunting Foundations', 'Proactive hypothesis-driven searches for undetected adversary presence.', 6)
    ON CONFLICT (learning_path_id, sequence_order) DO UPDATE
    SET title = EXCLUDED.title, description = EXCLUDED.description;

    -- Web Security Topics
    INSERT INTO public.topics (learning_path_id, title, description, sequence_order)
    VALUES
        (web_id, 'HTTP/HTTPS Protocol Deep Dive', 'Request/response headers, status codes, cookies, and session handling.', 1),
        (web_id, 'Configuring Burp Suite Proxy', 'Interception, repeater workflows, and browser proxy configuration.', 2),
        (web_id, 'SQL Injection (SQLi) Foundations', 'Understanding SQL queries, error-based, and union-based injection vulnerabilities.', 3),
        (web_id, 'Cross-Site Scripting (XSS) Demystified', 'Reflected, stored, and DOM-based script injection mechanisms.', 4),
        (web_id, 'Authentication & Session Weaknesses', 'Brute-force testing, weak session tokens, and privilege escalation.', 5),
        (web_id, 'Modern API & CORS Security', 'Inspecting REST/JSON endpoints and Cross-Origin Resource Sharing flaws.', 6)
    ON CONFLICT (learning_path_id, sequence_order) DO UPDATE
    SET title = EXCLUDED.title, description = EXCLUDED.description;
END $$;

-- 7.3 Seed Badges
INSERT INTO public.badges (slug, name, description, badge_type)
VALUES
    ('red-team-specialist', 'Red Team Specialist', 'Awarded upon 100% completion of the Red Team curriculum, 8 authorized labs, and passing the offensive fundamentals assessment.', 'track_specialist'),
    ('blue-team-defender', 'Blue Team Defender', 'Awarded upon 100% completion of the Blue Team curriculum, 8 telemetry labs, and resolving 4 simulated threat incidents.', 'track_specialist'),
    ('web-security-expert', 'Web Security Expert', 'Awarded upon 100% completion of the Web Security curriculum, 10 vulnerability labs, and passing the web audit exam.', 'track_specialist'),
    ('cyberpath-master', 'CyberPath Master', 'The highest honor on CyberPath. Awarded only to students who have conquered all three specialization tracks, cleared 30+ labs, and triumphed in the Capstone CTF.', 'apex_credential')
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name, description = EXCLUDED.description, badge_type = EXCLUDED.badge_type;
