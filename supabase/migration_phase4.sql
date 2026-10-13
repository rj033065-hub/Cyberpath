-- ==============================================================================
-- CyberPath — Phase 4 Database Migration: Personalization, Gamification & CTF Discovery
-- ==============================================================================
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Ensure UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. New Schema Tables
-- ==============================================================================

-- 2.1 USER XP LEDGER TABLE (Append-only immutable transaction log)
-- Students cannot manually insert, update, or delete rows.
-- Rewards are issued exclusively through SECURITY DEFINER PostgreSQL functions.
CREATE TABLE IF NOT EXISTS public.user_xp_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL CHECK (action_type IN ('lesson_completed', 'assessment_passed', 'module_completed', 'path_completed')),
    reference_id TEXT NOT NULL,
    xp_amount INTEGER NOT NULL CHECK (xp_amount > 0),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_action_ref UNIQUE (user_id, action_type, reference_id)
);

-- 2.2 USER DAILY ACTIVITY TABLE (Tracks verified activity days for streaks)
CREATE TABLE IF NOT EXISTS public.user_daily_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    activity_count INTEGER NOT NULL DEFAULT 1,
    last_activity_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_activity_date UNIQUE (user_id, activity_date)
);

-- 2.3 RESOURCES CATALOG TABLE (Curated external labs, CTF challenges & guides)
CREATE TABLE IF NOT EXISTS public.resources_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    resource_type TEXT NOT NULL CHECK (resource_type IN ('Guided Lab', 'CTF Challenge', 'Tutorial', 'Documentation')),
    learning_paths TEXT[] NOT NULL DEFAULT '{}',
    topics TEXT[] NOT NULL DEFAULT '{}',
    is_recommended BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. Indexes for Performance & Scalability
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_user_xp_ledger_user ON public.user_xp_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_activity_user_date ON public.user_daily_activity(user_id, activity_date DESC);
CREATE INDEX IF NOT EXISTS idx_resources_catalog_difficulty ON public.resources_catalog(difficulty);

-- ==============================================================================
-- 4. Row-Level Security (RLS) Policies
-- ==============================================================================
ALTER TABLE public.user_xp_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources_catalog ENABLE ROW LEVEL SECURITY;

-- 4.1 XP Ledger: Students can only read their own records; no direct mutation
DROP POLICY IF EXISTS "Users can read own xp ledger" ON public.user_xp_ledger;
CREATE POLICY "Users can read own xp ledger"
    ON public.user_xp_ledger FOR SELECT
    USING (auth.uid() = user_id);

-- Explicitly ensure no INSERT / UPDATE / DELETE policies exist for public/authenticated on user_xp_ledger
DROP POLICY IF EXISTS "Users cannot insert xp ledger" ON public.user_xp_ledger;
DROP POLICY IF EXISTS "Users cannot update xp ledger" ON public.user_xp_ledger;
DROP POLICY IF EXISTS "Users cannot delete xp ledger" ON public.user_xp_ledger;

-- 4.2 Daily Activity: Students can only read their own records; no direct mutation
DROP POLICY IF EXISTS "Users can read own daily activity" ON public.user_daily_activity;
CREATE POLICY "Users can read own daily activity"
    ON public.user_daily_activity FOR SELECT
    USING (auth.uid() = user_id);

-- 4.3 Resources Catalog: Public read access for authenticated & anonymous users
DROP POLICY IF EXISTS "Resources catalog is publicly readable" ON public.resources_catalog;
CREATE POLICY "Resources catalog is publicly readable"
    ON public.resources_catalog FOR SELECT
    USING (true);

-- 4.4 Reinforce Student Badges Security: Prevent manual badge insertion
DROP POLICY IF EXISTS "Users can read own badges" ON public.student_badges;
CREATE POLICY "Users can read own badges"
    ON public.student_badges FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users cannot manually insert badges" ON public.student_badges;

-- ==============================================================================
-- 5. Stored Procedures & Server-Side Security Functions (SECURITY DEFINER)
-- ==============================================================================

-- 5.1 Internal XP Award Function (Guarantees idempotency via unique constraints)
CREATE OR REPLACE FUNCTION public.award_xp_internal(
    p_user_id UUID,
    p_action_type TEXT,
    p_reference_id TEXT,
    p_amount INTEGER,
    p_description TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_inserted_id UUID;
BEGIN
    INSERT INTO public.user_xp_ledger (
        user_id,
        action_type,
        reference_id,
        xp_amount,
        description,
        created_at
    )
    VALUES (
        p_user_id,
        p_action_type,
        p_reference_id,
        p_amount,
        p_description,
        timezone('utc'::text, now())
    )
    ON CONFLICT (user_id, action_type, reference_id) DO NOTHING
    RETURNING id INTO v_inserted_id;

    IF v_inserted_id IS NOT NULL THEN
        RETURN p_amount;
    ELSE
        RETURN 0;
    END IF;
END;
$$;

-- 5.2 Daily Activity Recording Procedure
CREATE OR REPLACE FUNCTION public.record_daily_activity(
    p_user_id UUID,
    p_activity_type TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Only allow if called for authenticated user or internally
    IF auth.uid() IS NOT NULL AND auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Unauthorized to record activity for another user';
    END IF;

    INSERT INTO public.user_daily_activity (
        user_id,
        activity_date,
        activity_count,
        last_activity_type,
        updated_at
    )
    VALUES (
        p_user_id,
        CURRENT_DATE,
        1,
        p_activity_type,
        timezone('utc'::text, now())
    )
    ON CONFLICT (user_id, activity_date) DO UPDATE
    SET
        activity_count = public.user_daily_activity.activity_count + 1,
        last_activity_type = EXCLUDED.last_activity_type,
        updated_at = timezone('utc'::text, now());
END;
$$;

-- 5.3 Enhanced complete_lesson function with Phase 4 XP & Streak Integration
CREATE OR REPLACE FUNCTION public.complete_lesson(p_lesson_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_lesson RECORD;
    v_new_badges JSONB := '[]'::JSONB;
    v_total_xp_awarded INTEGER := 0;
    v_step_xp INTEGER := 0;
    v_was_completed BOOLEAN;
    v_topic_total INTEGER;
    v_topic_completed INTEGER;
    v_path_total INTEGER;
    v_path_completed INTEGER;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    -- Fetch lesson details
    SELECT id, slug, title, topic_id, learning_path_id INTO v_lesson
    FROM public.lessons
    WHERE id = p_lesson_id;

    IF v_lesson.id IS NULL THEN
        RAISE EXCEPTION 'Lesson not found';
    END IF;

    -- Check if previously completed
    SELECT EXISTS (
        SELECT 1 FROM public.student_lesson_progress
        WHERE user_id = v_user_id AND lesson_id = p_lesson_id AND status = 'completed'
    ) INTO v_was_completed;

    -- Upsert lesson progress
    INSERT INTO public.student_lesson_progress (
        user_id,
        lesson_id,
        status,
        completed_at
    )
    VALUES (
        v_user_id,
        p_lesson_id,
        'completed',
        timezone('utc'::text, now())
    )
    ON CONFLICT (user_id, lesson_id) DO UPDATE
    SET status = 'completed', completed_at = timezone('utc'::text, now());

    -- Only award XP and record streak activity on FIRST verified completion
    IF NOT v_was_completed THEN
        -- 1. Lesson Completion XP (10 XP)
        v_step_xp := public.award_xp_internal(
            v_user_id,
            'lesson_completed',
            v_lesson.slug,
            10,
            'Completed lesson: ' || v_lesson.title
        );
        v_total_xp_awarded := v_total_xp_awarded + v_step_xp;

        -- 2. Record daily learning activity for streak
        PERFORM public.record_daily_activity(v_user_id, 'lesson_completed');

        -- 3. Check Module Completion (50 XP) if topic_id is present
        IF v_lesson.topic_id IS NOT NULL THEN
            SELECT COUNT(*) INTO v_topic_total
            FROM public.lessons WHERE topic_id = v_lesson.topic_id;

            SELECT COUNT(*) INTO v_topic_completed
            FROM public.student_lesson_progress slp
            JOIN public.lessons l ON l.id = slp.lesson_id
            WHERE slp.user_id = v_user_id AND l.topic_id = v_lesson.topic_id AND slp.status = 'completed';

            IF v_topic_total > 0 AND v_topic_completed >= v_topic_total THEN
                v_step_xp := public.award_xp_internal(
                    v_user_id,
                    'module_completed',
                    v_lesson.topic_id::TEXT,
                    50,
                    'Mastered module milestone'
                );
                v_total_xp_awarded := v_total_xp_awarded + v_step_xp;
            END IF;
        END IF;

        -- 4. Check Learning Path Completion (200 XP)
        SELECT COUNT(*) INTO v_path_total
        FROM public.lessons WHERE learning_path_id = v_lesson.learning_path_id;

        SELECT COUNT(*) INTO v_path_completed
        FROM public.student_lesson_progress slp
        JOIN public.lessons l ON l.id = slp.lesson_id
        WHERE slp.user_id = v_user_id AND l.learning_path_id = v_lesson.learning_path_id AND slp.status = 'completed';

        IF v_path_total > 0 AND v_path_completed >= v_path_total THEN
            v_step_xp := public.award_xp_internal(
                v_user_id,
                'path_completed',
                v_lesson.learning_path_id::TEXT,
                200,
                'Conquered entire specialization learning path'
            );
            v_total_xp_awarded := v_total_xp_awarded + v_step_xp;
        END IF;
    END IF;

    -- Evaluate badge qualification
    v_new_badges := public.evaluate_and_award_badges(v_user_id);

    RETURN jsonb_build_object(
        'success', true,
        'xp_awarded', v_total_xp_awarded,
        'new_badges_awarded', v_new_badges
    );
END;
$$;

-- 5.4 Enhanced submit_assessment function with Phase 4 XP & Streak Integration
CREATE OR REPLACE FUNCTION public.submit_assessment(
    p_assessment_id UUID,
    p_answers JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_assessment RECORD;
    v_total_questions INTEGER := 0;
    v_correct_count INTEGER := 0;
    v_score INTEGER := 0;
    v_passed BOOLEAN := false;
    v_q RECORD;
    v_selected_opt TEXT;
    v_feedback JSONB := '[]'::JSONB;
    v_is_correct BOOLEAN;
    v_attempt_count INTEGER;
    v_attempt_id UUID;
    v_new_badges JSONB := '[]'::JSONB;
    v_had_passed_before BOOLEAN := false;
    v_xp_awarded INTEGER := 0;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to submit assessment';
    END IF;

    -- Fetch assessment details
    SELECT id, slug, title, passing_threshold INTO v_assessment
    FROM public.assessments
    WHERE id = p_assessment_id;

    IF v_assessment.id IS NULL THEN
        RAISE EXCEPTION 'Assessment not found';
    END IF;

    -- Check if user has previously passed this assessment
    SELECT EXISTS (
        SELECT 1 FROM public.assessment_attempts
        WHERE user_id = v_user_id AND assessment_id = p_assessment_id AND passed = true
    ) INTO v_had_passed_before;

    -- Grade questions
    FOR v_q IN
        SELECT id, correct_option_id, explanation, sequence_order
        FROM public.assessment_questions
        WHERE assessment_id = p_assessment_id
        ORDER BY sequence_order ASC
    LOOP
        v_total_questions := v_total_questions + 1;
        v_selected_opt := p_answers->>v_q.id::TEXT;

        v_is_correct := (v_selected_opt IS NOT NULL AND v_selected_opt = v_q.correct_option_id);
        IF v_is_correct THEN
            v_correct_count := v_correct_count + 1;
        END IF;

        v_feedback := v_feedback || jsonb_build_object(
            'question_id', v_q.id,
            'is_correct', v_is_correct,
            'explanation', v_q.explanation
        );
    END LOOP;

    IF v_total_questions > 0 THEN
        v_score := ROUND((v_correct_count::NUMERIC / v_total_questions::NUMERIC) * 100);
    ELSE
        v_score := 100;
    END IF;

    v_passed := (v_score >= v_assessment.passing_threshold);

    -- Get next attempt number
    SELECT COALESCE(MAX(attempt_number), 0) + 1 INTO v_attempt_count
    FROM public.assessment_attempts
    WHERE user_id = v_user_id AND assessment_id = p_assessment_id;

    -- Record attempt in database
    INSERT INTO public.assessment_attempts (
        user_id,
        assessment_id,
        score,
        passed,
        answers,
        feedback,
        attempt_number,
        created_at
    )
    VALUES (
        v_user_id,
        p_assessment_id,
        v_score,
        v_passed,
        p_answers,
        v_feedback,
        v_attempt_count,
        timezone('utc'::text, now())
    )
    RETURNING id INTO v_attempt_id;

    -- If passed for the FIRST time: award 25 XP, record streak, and evaluate badges
    IF v_passed THEN
        IF NOT v_had_passed_before THEN
            v_xp_awarded := public.award_xp_internal(
                v_user_id,
                'assessment_passed',
                v_assessment.slug,
                25,
                'Passed assessment: ' || v_assessment.title || ' (' || v_score || '%)'
            );
            PERFORM public.record_daily_activity(v_user_id, 'assessment_passed');
        END IF;

        v_new_badges := public.evaluate_and_award_badges(v_user_id);
    END IF;

    RETURN jsonb_build_object(
        'attempt_id', v_attempt_id,
        'score', v_score,
        'passed', v_passed,
        'passing_threshold', v_assessment.passing_threshold,
        'feedback', v_feedback,
        'xp_awarded', v_xp_awarded,
        'new_badges_awarded', v_new_badges
    );
END;
$$;

-- ==============================================================================
-- 6. Seed Initial Verified External Resources
-- ==============================================================================
INSERT INTO public.resources_catalog (
    title, description, platform, url, difficulty, resource_type, learning_paths, topics, is_recommended
)
VALUES
    (
        'OverTheWire: Bandit Wargame',
        'Hands-on command-line wargame covering Linux directory traversal, file analysis, permissions, and shell automation level by level.',
        'OverTheWire',
        'https://overthewire.org/wargames/bandit/',
        'Beginner',
        'CTF Challenge',
        ARRAY['red-team', 'blue-team', 'web-security'],
        ARRAY['Linux & Shell'],
        true
    ),
    (
        'TryHackMe: Intro to Cyber Security',
        'Interactive browser-based module introducing offensive security, defensive security, web application security fundamentals, and ethical responsibilities.',
        'TryHackMe',
        'https://tryhackme.com/module/intro-to-cyber-security',
        'Beginner',
        'Guided Lab',
        ARRAY['red-team', 'blue-team', 'web-security'],
        ARRAY['Linux & Shell', 'Networking'],
        true
    ),
    (
        'TryHackMe: Nmap Network Scanning',
        'Practical laboratory covering port scanning techniques, TCP handshake flags, SYN stealth scans, NSE vulnerability scripts, and output parsing.',
        'TryHackMe',
        'https://tryhackme.com/room/furthernmap',
        'Beginner',
        'Guided Lab',
        ARRAY['red-team', 'blue-team'],
        ARRAY['Networking', 'Reconnaissance & Nmap'],
        true
    ),
    (
        'PortSwigger Academy: SQL Injection Labs',
        'World-class interactive web labs practicing UNION attacks, error-based injection, blind SQLi, and defensive mitigation.',
        'PortSwigger Web Security Academy',
        'https://portswigger.net/web-security/sql-injection',
        'Beginner',
        'Guided Lab',
        ARRAY['web-security', 'red-team'],
        ARRAY['Web Security & OWASP'],
        true
    ),
    (
        'PortSwigger Academy: Cross-Site Scripting (XSS)',
        'In-depth labs detailing Reflected, Stored, and DOM-based Cross-Site Scripting vulnerabilities, CSP evaluation, and secure context-aware output encoding.',
        'PortSwigger Web Security Academy',
        'https://portswigger.net/web-security/cross-site-scripting',
        'Intermediate',
        'Guided Lab',
        ARRAY['web-security'],
        ARRAY['Web Security & OWASP'],
        true
    ),
    (
        'pwn.college: Linux Luminarium',
        'Educational initiative by Arizona State University. Solve dozens of interactive Linux environment challenges teaching standard streams and pipes.',
        'pwn.college',
        'https://pwn.college/linux-luminarium/',
        'Beginner',
        'CTF Challenge',
        ARRAY['red-team', 'blue-team', 'web-security'],
        ARRAY['Linux & Shell'],
        true
    ),
    (
        'Hack The Box Academy: Incident Handling & SIEM',
        'Learn defensive triage, querying Splunk search processing language (SPL), detecting beaconing behavior, and constructing defensive detection rules.',
        'Hack The Box Academy',
        'https://academy.hackthebox.com/module/details/125',
        'Advanced',
        'Guided Lab',
        ARRAY['blue-team'],
        ARRAY['Defensive Ops & SIEM', 'Forensics & Log Analysis'],
        true
    )
ON CONFLICT DO NOTHING;
