-- ==============================================================================
-- CyberPath — Phase 3 Database Migration: Learning Engine & Student Progress
-- ==============================================================================
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Ensure UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. New Schema Tables
-- ==============================================================================

-- 2.1 LESSONS TABLE
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    learning_path_id UUID NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    sequence_order INTEGER NOT NULL,
    estimated_minutes INTEGER NOT NULL DEFAULT 30,
    prerequisites TEXT[] DEFAULT '{}',
    objectives TEXT[] DEFAULT '{}',
    content_markdown TEXT NOT NULL,
    key_takeaways TEXT[] DEFAULT '{}',
    common_pitfalls TEXT[] DEFAULT '{}',
    lab_guidance TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_path_lesson_sequence UNIQUE (learning_path_id, sequence_order)
);

-- 2.2 LESSON RESOURCES TABLE
CREATE TABLE IF NOT EXISTS public.lesson_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('lab', 'documentation', 'video', 'practice_platform', 'tool_guide')),
    url TEXT NOT NULL,
    platform_name TEXT,
    is_recommended BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.3 STUDENT LESSON PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.student_lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_lesson_progress UNIQUE (user_id, lesson_id)
);

-- 2.4 ASSESSMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    learning_path_id UUID REFERENCES public.learning_paths(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    passing_threshold INTEGER NOT NULL DEFAULT 75, -- percentage (e.g. 75%)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.5 ASSESSMENT QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.assessment_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- array of { id, text }
    correct_option_id TEXT NOT NULL,
    explanation TEXT NOT NULL,
    sequence_order INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_assessment_question_order UNIQUE (assessment_id, sequence_order)
);

-- 2.6 ASSESSMENT ATTEMPTS TABLE
CREATE TABLE IF NOT EXISTS public.assessment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    score INTEGER NOT NULL, -- 0-100 percentage
    passed BOOLEAN NOT NULL,
    answers JSONB NOT NULL, -- { [question_id]: option_id }
    feedback JSONB, -- per question result array
    attempt_number INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.7 BADGE REQUIREMENTS TABLE
CREATE TABLE IF NOT EXISTS public.badge_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    requirement_type TEXT NOT NULL CHECK (requirement_type IN ('module_completion', 'path_completion', 'assessment_pass', 'all_paths_completion')),
    target_slug TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. Performance Indexes
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_lessons_path_id ON public.lessons(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_lessons_topic_id ON public.lessons(topic_id);
CREATE INDEX IF NOT EXISTS idx_student_lesson_progress_user ON public.student_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_user ON public.assessment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_assessment ON public.assessment_attempts(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_assessment ON public.assessment_questions(assessment_id);

-- ==============================================================================
-- 4. Row-Level Security (RLS) Policies
-- ==============================================================================
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badge_requirements ENABLE ROW LEVEL SECURITY;

-- 4.1 Lessons & Resources (Public Read)
DROP POLICY IF EXISTS "Lessons are publicly readable" ON public.lessons;
CREATE POLICY "Lessons are publicly readable" ON public.lessons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Lesson resources are publicly readable" ON public.lesson_resources;
CREATE POLICY "Lesson resources are publicly readable" ON public.lesson_resources FOR SELECT USING (true);

-- 4.2 Assessments & Questions (Public Read)
DROP POLICY IF EXISTS "Assessments are publicly readable" ON public.assessments;
CREATE POLICY "Assessments are publicly readable" ON public.assessments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Questions are publicly readable" ON public.assessment_questions;
CREATE POLICY "Questions are publicly readable" ON public.assessment_questions FOR SELECT USING (true);

-- 4.3 Badge Requirements (Public Read)
DROP POLICY IF EXISTS "Badge requirements are publicly readable" ON public.badge_requirements;
CREATE POLICY "Badge requirements are publicly readable" ON public.badge_requirements FOR SELECT USING (true);

-- 4.4 Student Lesson Progress (Isolated to owner)
DROP POLICY IF EXISTS "Users can read own lesson progress" ON public.student_lesson_progress;
CREATE POLICY "Users can read own lesson progress"
    ON public.student_lesson_progress FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own lesson progress" ON public.student_lesson_progress;
CREATE POLICY "Users can insert own lesson progress"
    ON public.student_lesson_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own lesson progress" ON public.student_lesson_progress;
CREATE POLICY "Users can update own lesson progress"
    ON public.student_lesson_progress FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4.5 Assessment Attempts (Isolated to owner)
DROP POLICY IF EXISTS "Users can read own assessment attempts" ON public.assessment_attempts;
CREATE POLICY "Users can read own assessment attempts"
    ON public.assessment_attempts FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own assessment attempts" ON public.assessment_attempts;
CREATE POLICY "Users can insert own assessment attempts"
    ON public.assessment_attempts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 5. Stored Procedures & Server-Side Security Functions
-- ==============================================================================

-- 5.1 Function to evaluate and award earned badges
CREATE OR REPLACE FUNCTION public.evaluate_and_award_badges(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_new_badges JSONB := '[]'::JSONB;
    v_badge RECORD;
    v_req RECORD;
    v_qualifies BOOLEAN;
    v_completed_count INTEGER;
    v_total_count INTEGER;
    v_passed_quiz BOOLEAN;
BEGIN
    FOR v_badge IN SELECT * FROM public.badges LOOP
        -- Skip if user already earned this badge
        IF EXISTS (SELECT 1 FROM public.student_badges WHERE user_id = p_user_id AND badge_id = v_badge.id) THEN
            CONTINUE;
        END IF;

        v_qualifies := FALSE;

        -- Rule A: Linux Explorer (completed linux lesson and passed its quiz)
        IF v_badge.slug = 'linux-explorer' THEN
            SELECT EXISTS (
                SELECT 1 FROM public.student_lesson_progress slp
                JOIN public.lessons l ON l.id = slp.lesson_id
                WHERE slp.user_id = p_user_id AND l.slug = 'linux-fundamentals' AND slp.status = 'completed'
            ) AND EXISTS (
                SELECT 1 FROM public.assessment_attempts aa
                JOIN public.assessments a ON a.id = aa.assessment_id
                WHERE aa.user_id = p_user_id AND a.slug = 'quiz-linux' AND aa.passed = true
            ) INTO v_qualifies;

        -- Rule B: Network Navigator (completed networking lesson and passed its quiz)
        ELSIF v_badge.slug = 'network-navigator' THEN
            SELECT EXISTS (
                SELECT 1 FROM public.student_lesson_progress slp
                JOIN public.lessons l ON l.id = slp.lesson_id
                WHERE slp.user_id = p_user_id AND l.slug = 'networking-fundamentals' AND slp.status = 'completed'
            ) AND EXISTS (
                SELECT 1 FROM public.assessment_attempts aa
                JOIN public.assessments a ON a.id = aa.assessment_id
                WHERE aa.user_id = p_user_id AND a.slug = 'quiz-networking' AND aa.passed = true
            ) INTO v_qualifies;

        -- Rule C: Web Apprentice (completed web basics and passed quiz)
        ELSIF v_badge.slug = 'web-apprentice' THEN
            SELECT EXISTS (
                SELECT 1 FROM public.student_lesson_progress slp
                JOIN public.lessons l ON l.id = slp.lesson_id
                WHERE slp.user_id = p_user_id AND l.slug = 'how-websites-work' AND slp.status = 'completed'
            ) AND EXISTS (
                SELECT 1 FROM public.assessment_attempts aa
                JOIN public.assessments a ON a.id = aa.assessment_id
                WHERE aa.user_id = p_user_id AND a.slug = 'quiz-auth-sessions' AND aa.passed = true
            ) INTO v_qualifies;

        -- Rule D: Recon Specialist (completed reconnaissance & nmap lessons + quiz)
        ELSIF v_badge.slug = 'recon-specialist' THEN
            SELECT EXISTS (
                SELECT 1 FROM public.student_lesson_progress slp
                JOIN public.lessons l ON l.id = slp.lesson_id
                WHERE slp.user_id = p_user_id AND l.slug = 'nmap-fundamentals' AND slp.status = 'completed'
            ) AND EXISTS (
                SELECT 1 FROM public.assessment_attempts aa
                JOIN public.assessments a ON a.id = aa.assessment_id
                WHERE aa.user_id = p_user_id AND a.slug = 'quiz-nmap' AND aa.passed = true
            ) INTO v_qualifies;

        -- Rule E: Red Team Specialist (completed all 12 Red Team lessons)
        ELSIF v_badge.slug = 'red-team-specialist' THEN
            SELECT COUNT(DISTINCT l.id) INTO v_total_count
            FROM public.lessons l
            JOIN public.learning_paths lp ON lp.id = l.learning_path_id
            WHERE lp.slug = 'red-team';

            SELECT COUNT(DISTINCT slp.lesson_id) INTO v_completed_count
            FROM public.student_lesson_progress slp
            JOIN public.lessons l ON l.id = slp.lesson_id
            JOIN public.learning_paths lp ON lp.id = l.learning_path_id
            WHERE slp.user_id = p_user_id AND lp.slug = 'red-team' AND slp.status = 'completed';

            IF v_total_count > 0 AND v_completed_count >= v_total_count THEN
                v_qualifies := TRUE;
            END IF;

        -- Rule F: Blue Team Defender (completed all 9 Blue Team lessons)
        ELSIF v_badge.slug = 'blue-team-defender' THEN
            SELECT COUNT(DISTINCT l.id) INTO v_total_count
            FROM public.lessons l
            JOIN public.learning_paths lp ON lp.id = l.learning_path_id
            WHERE lp.slug = 'blue-team';

            SELECT COUNT(DISTINCT slp.lesson_id) INTO v_completed_count
            FROM public.student_lesson_progress slp
            JOIN public.lessons l ON l.id = slp.lesson_id
            JOIN public.learning_paths lp ON lp.id = l.learning_path_id
            WHERE slp.user_id = p_user_id AND lp.slug = 'blue-team' AND slp.status = 'completed';

            IF v_total_count > 0 AND v_completed_count >= v_total_count THEN
                v_qualifies := TRUE;
            END IF;

        -- Rule G: Web Security Expert (completed all 10 Web Security lessons)
        ELSIF v_badge.slug = 'web-security-expert' THEN
            SELECT COUNT(DISTINCT l.id) INTO v_total_count
            FROM public.lessons l
            JOIN public.learning_paths lp ON lp.id = l.learning_path_id
            WHERE lp.slug = 'web-security';

            SELECT COUNT(DISTINCT slp.lesson_id) INTO v_completed_count
            FROM public.student_lesson_progress slp
            JOIN public.lessons l ON l.id = slp.lesson_id
            JOIN public.learning_paths lp ON lp.id = l.learning_path_id
            WHERE slp.user_id = p_user_id AND lp.slug = 'web-security' AND slp.status = 'completed';

            IF v_total_count > 0 AND v_completed_count >= v_total_count THEN
                v_qualifies := TRUE;
            END IF;

        -- Rule H: CyberPath Master (completed all 3 tracks)
        ELSIF v_badge.slug = 'cyberpath-master' THEN
            SELECT COUNT(DISTINCT l.id) INTO v_total_count FROM public.lessons l;
            SELECT COUNT(DISTINCT slp.lesson_id) INTO v_completed_count
            FROM public.student_lesson_progress slp
            WHERE slp.user_id = p_user_id AND slp.status = 'completed';

            IF v_total_count > 0 AND v_completed_count >= v_total_count THEN
                v_qualifies := TRUE;
            END IF;
        END IF;

        -- Award badge if qualified
        IF v_qualifies THEN
            INSERT INTO public.student_badges (user_id, badge_id, earned_at)
            VALUES (p_user_id, v_badge.id, timezone('utc'::text, now()))
            ON CONFLICT (user_id, badge_id) DO NOTHING;

            v_new_badges := v_new_badges || jsonb_build_object(
                'badge_id', v_badge.id,
                'slug', v_badge.slug,
                'name', v_badge.name,
                'description', v_badge.description
            );
        END IF;
    END LOOP;

    RETURN v_new_badges;
END;
$$;

-- 5.2 Server-side secure assessment submission
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
    v_threshold INTEGER;
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
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required to submit assessment';
    END IF;

    -- Fetch passing threshold
    SELECT passing_threshold INTO v_threshold
    FROM public.assessments
    WHERE id = p_assessment_id;

    IF v_threshold IS NULL THEN
        RAISE EXCEPTION 'Assessment not found';
    END IF;

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

    v_passed := (v_score >= v_threshold);

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

    -- If passed, check badge qualifications
    IF v_passed THEN
        v_new_badges := public.evaluate_and_award_badges(v_user_id);
    END IF;

    RETURN jsonb_build_object(
        'attempt_id', v_attempt_id,
        'score', v_score,
        'passed', v_passed,
        'passing_threshold', v_threshold,
        'feedback', v_feedback,
        'new_badges_awarded', v_new_badges
    );
END;
$$;

-- 5.3 Function to mark lesson complete & evaluate progress
CREATE OR REPLACE FUNCTION public.complete_lesson(p_lesson_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_new_badges JSONB := '[]'::JSONB;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

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

    -- Trigger badge check
    v_new_badges := public.evaluate_and_award_badges(v_user_id);

    RETURN jsonb_build_object(
        'success', true,
        'new_badges_awarded', v_new_badges
    );
END;
$$;

-- ==============================================================================
-- 6. Seed Complete Badges Definition (8 Total Badges)
-- ==============================================================================
INSERT INTO public.badges (slug, name, description, badge_type)
VALUES
    ('linux-explorer', 'Linux Explorer', 'Awarded upon completing the Linux fundamentals module and passing the Linux assessment.', 'special_achievement'),
    ('network-navigator', 'Network Navigator', 'Awarded upon completing networking fundamentals and passing the networking assessment.', 'special_achievement'),
    ('web-apprentice', 'Web Apprentice', 'Awarded upon completing web basics and passing the HTTP and protocol assessment.', 'special_achievement'),
    ('recon-specialist', 'Recon Specialist', 'Awarded upon completing the reconnaissance and Nmap scanning fundamentals.', 'special_achievement'),
    ('red-team-specialist', 'Red Team Specialist', 'Awarded upon 100% completion of all 12 Red Team curriculum milestones and assessments.', 'track_specialist'),
    ('blue-team-defender', 'Blue Team Defender', 'Awarded upon 100% completion of all 9 Blue Team defensive modules, event monitoring, and SIEM labs.', 'track_specialist'),
    ('web-security-expert', 'Web Security Expert', 'Awarded upon 100% completion of all 10 Web Security lessons and OWASP assessments.', 'track_specialist'),
    ('cyberpath-master', 'CyberPath Master', 'The highest honor on CyberPath. Awarded only to elite students who conquer all three specialization tracks (31 lessons total).', 'apex_credential')
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name, description = EXCLUDED.description, badge_type = EXCLUDED.badge_type;
