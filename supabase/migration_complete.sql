-- CyberPath COMPLETE Migration (Phase 2 + Phase 3 combined)
-- Run this ENTIRE file in Supabase SQL Editor. Do NOT use schema.sql or migration_phase3.sql.
-- Safe to run on a fresh Supabase project.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Safely drop stale triggers/functions (works even on a brand-new project)
DO $safe_drop$
BEGIN
  -- Drop triggers only if their table already exists
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    DROP TRIGGER IF EXISTS update_profiles_modtime ON public.profiles;
  END IF;
  -- Drop functions (safe regardless of whether they exist)
  DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
  DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
  -- Drop auth trigger (auth.users always exists in Supabase)
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
EXCEPTION WHEN OTHERS THEN
  NULL; -- Ignore any errors during cleanup on fresh installs
END;
$safe_drop$;

-- PHASE 2 Base Tables (must exist before Phase 3 tables)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  selected_path TEXT,
  xp_total INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);
CREATE TABLE IF NOT EXISTS public.learning_paths (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL);
CREATE TABLE IF NOT EXISTS public.topics (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), learning_path_id UUID NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE, title TEXT NOT NULL, description TEXT NOT NULL, sequence_order INTEGER NOT NULL, created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL, CONSTRAINT unique_path_topic_sequence UNIQUE (learning_path_id, sequence_order));
CREATE TABLE IF NOT EXISTS public.student_progress (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE, status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','completed')), completed_at TIMESTAMPTZ, created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL, CONSTRAINT unique_user_topic_progress UNIQUE (user_id, topic_id));
CREATE TABLE IF NOT EXISTS public.badges (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL, badge_type TEXT NOT NULL DEFAULT 'track_specialist' CHECK (badge_type IN ('track_specialist','apex_credential','special_achievement')), created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL);
CREATE TABLE IF NOT EXISTS public.student_badges (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE, earned_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL, CONSTRAINT unique_user_badge UNIQUE (user_id, badge_id));

-- PHASE 3 Learning Engine Tables
CREATE TABLE IF NOT EXISTS public.lessons (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), learning_path_id UUID NOT NULL REFERENCES public.learning_paths(id) ON DELETE CASCADE, topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, description TEXT, sequence_order INTEGER NOT NULL, estimated_minutes INTEGER NOT NULL DEFAULT 30, prerequisites TEXT[] DEFAULT '{}', objectives TEXT[] DEFAULT '{}', content_markdown TEXT NOT NULL DEFAULT '', key_takeaways TEXT[] DEFAULT '{}', common_pitfalls TEXT[] DEFAULT '{}', lab_guidance TEXT, created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL, CONSTRAINT unique_path_lesson_sequence UNIQUE (learning_path_id, sequence_order));
CREATE TABLE IF NOT EXISTS public.lesson_resources (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE, title TEXT NOT NULL, resource_type TEXT NOT NULL CHECK (resource_type IN ('lab','documentation','video','practice_platform','tool_guide')), url TEXT NOT NULL, platform_name TEXT, is_recommended BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL);
CREATE TABLE IF NOT EXISTS public.student_lesson_progress (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE, status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('not_started','in_progress','completed')), completed_at TIMESTAMPTZ DEFAULT timezone('utc', now()), created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL, CONSTRAINT unique_user_lesson_progress UNIQUE (user_id, lesson_id));
CREATE TABLE IF NOT EXISTS public.assessments (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL, learning_path_id UUID REFERENCES public.learning_paths(id) ON DELETE CASCADE, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, description TEXT, passing_threshold INTEGER NOT NULL DEFAULT 75, created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL);
CREATE TABLE IF NOT EXISTS public.assessment_questions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE, question_text TEXT NOT NULL, options JSONB NOT NULL, correct_option_id TEXT NOT NULL, explanation TEXT NOT NULL, sequence_order INTEGER NOT NULL, created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL, CONSTRAINT unique_assessment_question_order UNIQUE (assessment_id, sequence_order));
CREATE TABLE IF NOT EXISTS public.assessment_attempts (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE, score INTEGER NOT NULL, passed BOOLEAN NOT NULL, answers JSONB NOT NULL, feedback JSONB, attempt_number INTEGER NOT NULL DEFAULT 1, created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL);
CREATE TABLE IF NOT EXISTS public.badge_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  requirement_type TEXT NOT NULL CHECK (requirement_type IN ('module_completion','path_completion','assessment_pass','all_paths_completion')),
  target_slug TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

-- Gamification tables
CREATE TABLE IF NOT EXISTS public.xp_rules (
  rule_name TEXT PRIMARY KEY,
  xp_amount INTEGER NOT NULL CHECK (xp_amount >= 0)
);

INSERT INTO public.xp_rules (rule_name, xp_amount) VALUES
  ('lesson_completed', 10),
  ('assessment_passed_first', 25),
  ('module_completed', 50),
  ('path_completed', 200)
ON CONFLICT (rule_name) DO UPDATE SET xp_amount = EXCLUDED.xp_amount;

CREATE TABLE IF NOT EXISTS public.xp_reward_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  reference_id UUID,
  xp_amount INTEGER NOT NULL CHECK (xp_amount >= 0),
  created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
  UNIQUE (user_id, event_type, reference_id)
);

CREATE TABLE IF NOT EXISTS public.daily_activity (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  PRIMARY KEY (user_id, activity_date)
);

CREATE TABLE IF NOT EXISTS public.resource_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('guided_lab','ctf_challenge','tutorial','documentation')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner','intermediate','advanced')),
  learning_path_slug TEXT,
  topic_slug TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

-- Secure function to award XP and update profile & daily activity
CREATE OR REPLACE FUNCTION public.award_xp(p_user_id UUID, p_event_type TEXT, p_reference_id UUID DEFAULT NULL) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_xp INTEGER;
  v_today DATE := timezone('utc'::text, now())::date;
  v_last DATE;
  v_streak INTEGER;
BEGIN
  -- Verify rule exists
  SELECT xp_amount INTO v_xp FROM public.xp_rules WHERE rule_name = p_event_type;
  IF v_xp IS NULL THEN
    RAISE EXCEPTION 'XP rule % not found', p_event_type;
  END IF;

  -- Insert reward event if not duplicate
  INSERT INTO public.xp_reward_events (user_id, event_type, reference_id, xp_amount)
  VALUES (p_user_id, p_event_type, p_reference_id, v_xp)
  ON CONFLICT (user_id, event_type, reference_id) DO NOTHING;

  -- Update profile XP and level (linear 100 XP per level)
  UPDATE public.profiles
  SET xp_total = xp_total + v_xp,
      level = FLOOR((xp_total + v_xp) / 100) + 1,
      last_active_at = now()
  WHERE id = p_user_id;

  -- Record daily activity
  INSERT INTO public.daily_activity (user_id, activity_date)
  VALUES (p_user_id, v_today)
  ON CONFLICT DO NOTHING;

  -- Update streak: count consecutive days up to today
  SELECT activity_date INTO v_last FROM public.daily_activity
    WHERE user_id = p_user_id
    ORDER BY activity_date DESC LIMIT 1 OFFSET 1; -- previous day record
  IF v_last = v_today - INTERVAL '1 day' THEN
    SELECT COUNT(*) INTO v_streak FROM public.daily_activity
      WHERE user_id = p_user_id AND activity_date >= v_today - INTERVAL '7 days';
  ELSE
    v_streak := 1;
  END IF;
  UPDATE public.profiles SET streak = v_streak WHERE id = p_user_id;
END;
$$;

-- RLS policies (service role only for writes)
ALTER TABLE public.xp_reward_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_insert" ON public.xp_reward_events FOR INSERT TO service_role USING (true);
CREATE POLICY "user_select_own" ON public.xp_reward_events FOR SELECT TO authenticated USING (auth.uid() = user_id);

ALTER TABLE public.daily_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_insert_daily" ON public.daily_activity FOR INSERT TO service_role USING (true);
CREATE POLICY "user_select_own_daily" ON public.daily_activity FOR SELECT TO authenticated USING (auth.uid() = user_id);

ALTER TABLE public.resource_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON public.resource_catalog FOR SELECT USING (true);

-- Allow service role to call award_xp
GRANT EXECUTE ON FUNCTION public.award_xp(UUID, TEXT, UUID) TO service_role;


-- Indexes
CREATE INDEX IF NOT EXISTS idx_topics_path ON public.topics(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_user ON public.student_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_student_badges_user ON public.student_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_lessons_path ON public.lessons(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_lessons_topic ON public.lessons(topic_id);
CREATE INDEX IF NOT EXISTS idx_slp_user ON public.student_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_aa_user ON public.assessment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_aa_assessment ON public.assessment_attempts(assessment_id);
CREATE INDEX IF NOT EXISTS idx_aq_assessment ON public.assessment_questions(assessment_id);

-- Triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER LANGUAGE plpgsql AS $func$ BEGIN NEW.updated_at = timezone('utc', now()); RETURN NEW; END; $func$;
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $func$ BEGIN INSERT INTO public.profiles (id, full_name, selected_path, created_at, updated_at) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NULL, timezone('utc', now()), timezone('utc', now())) ON CONFLICT (id) DO NOTHING; RETURN NEW; END; $func$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badge_requirements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles; CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles; CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles; CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "Learning paths are publicly readable" ON public.learning_paths; CREATE POLICY "Learning paths are publicly readable" ON public.learning_paths FOR SELECT USING (true);
DROP POLICY IF EXISTS "Topics are publicly readable" ON public.topics; CREATE POLICY "Topics are publicly readable" ON public.topics FOR SELECT USING (true);
DROP POLICY IF EXISTS "Badges are publicly readable" ON public.badges; CREATE POLICY "Badges are publicly readable" ON public.badges FOR SELECT USING (true);
DROP POLICY IF EXISTS "Lessons are publicly readable" ON public.lessons; CREATE POLICY "Lessons are publicly readable" ON public.lessons FOR SELECT USING (true);
DROP POLICY IF EXISTS "Lesson resources are publicly readable" ON public.lesson_resources; CREATE POLICY "Lesson resources are publicly readable" ON public.lesson_resources FOR SELECT USING (true);
DROP POLICY IF EXISTS "Assessments are publicly readable" ON public.assessments; CREATE POLICY "Assessments are publicly readable" ON public.assessments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Questions are publicly readable" ON public.assessment_questions; CREATE POLICY "Questions are publicly readable" ON public.assessment_questions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Badge requirements are publicly readable" ON public.badge_requirements; CREATE POLICY "Badge requirements are publicly readable" ON public.badge_requirements FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can read own progress" ON public.student_progress; CREATE POLICY "Users can read own progress" ON public.student_progress FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own progress" ON public.student_progress; CREATE POLICY "Users can insert own progress" ON public.student_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own progress" ON public.student_progress; CREATE POLICY "Users can update own progress" ON public.student_progress FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can read own lesson progress" ON public.student_lesson_progress; CREATE POLICY "Users can read own lesson progress" ON public.student_lesson_progress FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own lesson progress" ON public.student_lesson_progress; CREATE POLICY "Users can insert own lesson progress" ON public.student_lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own lesson progress" ON public.student_lesson_progress; CREATE POLICY "Users can update own lesson progress" ON public.student_lesson_progress FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can read own assessment attempts" ON public.assessment_attempts; CREATE POLICY "Users can read own assessment attempts" ON public.assessment_attempts FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can insert own assessment attempts" ON public.assessment_attempts; CREATE POLICY "Users can insert own assessment attempts" ON public.assessment_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
-- student_badges: NO insert/update/delete for users. Only security-definer functions award badges.
DROP POLICY IF EXISTS "Users can read own earned badges" ON public.student_badges; CREATE POLICY "Users can read own earned badges" ON public.student_badges FOR SELECT USING (auth.uid() = user_id);

-- Server Functions
CREATE OR REPLACE FUNCTION public.evaluate_and_award_badges(p_user_id UUID) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $func$
DECLARE v_new_badges JSONB := '[]'::JSONB; v_badge RECORD; v_qualifies BOOLEAN; v_completed_count INTEGER; v_total_count INTEGER;
BEGIN
  FOR v_badge IN SELECT * FROM public.badges LOOP
    IF EXISTS (SELECT 1 FROM public.student_badges WHERE user_id = p_user_id AND badge_id = v_badge.id) THEN CONTINUE; END IF;
    v_qualifies := FALSE;
    IF v_badge.slug = 'linux-explorer' THEN SELECT (EXISTS (SELECT 1 FROM public.student_lesson_progress slp JOIN public.lessons l ON l.id = slp.lesson_id WHERE slp.user_id = p_user_id AND l.slug = 'linux-fundamentals' AND slp.status = 'completed') AND EXISTS (SELECT 1 FROM public.assessment_attempts aa JOIN public.assessments a ON a.id = aa.assessment_id WHERE aa.user_id = p_user_id AND a.slug = 'quiz-linux' AND aa.passed = true)) INTO v_qualifies;
    ELSIF v_badge.slug = 'network-navigator' THEN SELECT (EXISTS (SELECT 1 FROM public.student_lesson_progress slp JOIN public.lessons l ON l.id = slp.lesson_id WHERE slp.user_id = p_user_id AND l.slug = 'networking-fundamentals' AND slp.status = 'completed') AND EXISTS (SELECT 1 FROM public.assessment_attempts aa JOIN public.assessments a ON a.id = aa.assessment_id WHERE aa.user_id = p_user_id AND a.slug = 'quiz-networking' AND aa.passed = true)) INTO v_qualifies;
    ELSIF v_badge.slug = 'web-apprentice' THEN SELECT (EXISTS (SELECT 1 FROM public.student_lesson_progress slp JOIN public.lessons l ON l.id = slp.lesson_id WHERE slp.user_id = p_user_id AND l.slug = 'how-websites-work' AND slp.status = 'completed') AND EXISTS (SELECT 1 FROM public.assessment_attempts aa JOIN public.assessments a ON a.id = aa.assessment_id WHERE aa.user_id = p_user_id AND a.slug = 'quiz-auth-sessions' AND aa.passed = true)) INTO v_qualifies;
    ELSIF v_badge.slug = 'recon-specialist' THEN SELECT (EXISTS (SELECT 1 FROM public.student_lesson_progress slp JOIN public.lessons l ON l.id = slp.lesson_id WHERE slp.user_id = p_user_id AND l.slug = 'nmap-fundamentals' AND slp.status = 'completed') AND EXISTS (SELECT 1 FROM public.assessment_attempts aa JOIN public.assessments a ON a.id = aa.assessment_id WHERE aa.user_id = p_user_id AND a.slug = 'quiz-nmap' AND aa.passed = true)) INTO v_qualifies;
    ELSIF v_badge.slug = 'red-team-specialist' THEN
      SELECT COUNT(DISTINCT l.id) INTO v_total_count FROM public.lessons l JOIN public.learning_paths lp ON lp.id = l.learning_path_id WHERE lp.slug = 'red-team';
      SELECT COUNT(DISTINCT slp.lesson_id) INTO v_completed_count FROM public.student_lesson_progress slp JOIN public.lessons l ON l.id = slp.lesson_id JOIN public.learning_paths lp ON lp.id = l.learning_path_id WHERE slp.user_id = p_user_id AND lp.slug = 'red-team' AND slp.status = 'completed';
      v_qualifies := (v_total_count > 0 AND v_completed_count >= v_total_count);
    ELSIF v_badge.slug = 'blue-team-defender' THEN
      SELECT COUNT(DISTINCT l.id) INTO v_total_count FROM public.lessons l JOIN public.learning_paths lp ON lp.id = l.learning_path_id WHERE lp.slug = 'blue-team';
      SELECT COUNT(DISTINCT slp.lesson_id) INTO v_completed_count FROM public.student_lesson_progress slp JOIN public.lessons l ON l.id = slp.lesson_id JOIN public.learning_paths lp ON lp.id = l.learning_path_id WHERE slp.user_id = p_user_id AND lp.slug = 'blue-team' AND slp.status = 'completed';
      v_qualifies := (v_total_count > 0 AND v_completed_count >= v_total_count);
    ELSIF v_badge.slug = 'web-security-expert' THEN
      SELECT COUNT(DISTINCT l.id) INTO v_total_count FROM public.lessons l JOIN public.learning_paths lp ON lp.id = l.learning_path_id WHERE lp.slug = 'web-security';
      SELECT COUNT(DISTINCT slp.lesson_id) INTO v_completed_count FROM public.student_lesson_progress slp JOIN public.lessons l ON l.id = slp.lesson_id JOIN public.learning_paths lp ON lp.id = l.learning_path_id WHERE slp.user_id = p_user_id AND lp.slug = 'web-security' AND slp.status = 'completed';
      v_qualifies := (v_total_count > 0 AND v_completed_count >= v_total_count);
    ELSIF v_badge.slug = 'cyberpath-master' THEN
      SELECT COUNT(DISTINCT id) INTO v_total_count FROM public.lessons;
      SELECT COUNT(DISTINCT slp.lesson_id) INTO v_completed_count FROM public.student_lesson_progress slp WHERE slp.user_id = p_user_id AND slp.status = 'completed';
      v_qualifies := (v_total_count > 0 AND v_completed_count >= v_total_count);
    END IF;
    IF v_qualifies THEN
      INSERT INTO public.student_badges (user_id, badge_id, earned_at) VALUES (p_user_id, v_badge.id, timezone('utc', now())) ON CONFLICT (user_id, badge_id) DO NOTHING;
      v_new_badges := v_new_badges || jsonb_build_object('badge_id', v_badge.id, 'slug', v_badge.slug, 'name', v_badge.name, 'description', v_badge.description);
    END IF;
  END LOOP;
  RETURN v_new_badges;
END; $func$;

CREATE OR REPLACE FUNCTION public.submit_assessment(p_assessment_id UUID, p_answers JSONB) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $func$
DECLARE v_user_id UUID; v_threshold INTEGER; v_total INTEGER := 0; v_correct INTEGER := 0; v_score INTEGER := 0; v_passed BOOLEAN := false; v_q RECORD; v_sel TEXT; v_feedback JSONB := '[]'::JSONB; v_is_correct BOOLEAN; v_attempt_count INTEGER; v_attempt_id UUID; v_new_badges JSONB := '[]'::JSONB;
BEGIN
  v_user_id := auth.uid(); IF v_user_id IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  SELECT passing_threshold INTO v_threshold FROM public.assessments WHERE id = p_assessment_id; IF v_threshold IS NULL THEN RAISE EXCEPTION 'Assessment not found'; END IF;
  FOR v_q IN SELECT id, correct_option_id, explanation, sequence_order FROM public.assessment_questions WHERE assessment_id = p_assessment_id ORDER BY sequence_order LOOP
    v_total := v_total + 1; v_sel := p_answers->>v_q.id::TEXT; v_is_correct := (v_sel IS NOT NULL AND v_sel = v_q.correct_option_id);
    IF v_is_correct THEN v_correct := v_correct + 1; END IF;
    v_feedback := v_feedback || jsonb_build_object('question_id', v_q.id, 'is_correct', v_is_correct, 'explanation', v_q.explanation);
  END LOOP;
  IF v_total > 0 THEN v_score := ROUND((v_correct::NUMERIC / v_total::NUMERIC) * 100); ELSE v_score := 100; END IF;
  v_passed := (v_score >= v_threshold);
  SELECT COALESCE(MAX(attempt_number), 0) + 1 INTO v_attempt_count FROM public.assessment_attempts WHERE user_id = v_user_id AND assessment_id = p_assessment_id;
  INSERT INTO public.assessment_attempts (user_id, assessment_id, score, passed, answers, feedback, attempt_number, created_at) VALUES (v_user_id, p_assessment_id, v_score, v_passed, p_answers, v_feedback, v_attempt_count, timezone('utc', now())) RETURNING id INTO v_attempt_id;
  IF v_passed THEN v_new_badges := public.evaluate_and_award_badges(v_user_id); END IF;
  RETURN jsonb_build_object('attempt_id', v_attempt_id, 'score', v_score, 'passed', v_passed, 'passing_threshold', v_threshold, 'feedback', v_feedback, 'new_badges_awarded', v_new_badges);
END; $func$;

CREATE OR REPLACE FUNCTION public.complete_lesson(p_lesson_id UUID) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $func$
DECLARE v_user_id UUID; v_new_badges JSONB := '[]'::JSONB;
BEGIN
  v_user_id := auth.uid(); IF v_user_id IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  INSERT INTO public.student_lesson_progress (user_id, lesson_id, status, completed_at) VALUES (v_user_id, p_lesson_id, 'completed', timezone('utc', now())) ON CONFLICT (user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = timezone('utc', now());
  v_new_badges := public.evaluate_and_award_badges(v_user_id);
  RETURN jsonb_build_object('success', true, 'new_badges_awarded', v_new_badges);
END; $func$;

-- Seed
INSERT INTO public.learning_paths (slug, title, description) VALUES ('red-team','Red Team','Learn ethical hacking, network reconnaissance, and authorized penetration testing.'), ('blue-team','Blue Team','Master defensive security, threat analysis, SIEM monitoring, and incident response.'), ('web-security','Web Security','Explore HTTP mechanics, OWASP vulnerabilities, and secure web application testing.') ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

DO $anon$
DECLARE red_id UUID; blue_id UUID; web_id UUID;
BEGIN
  SELECT id INTO red_id FROM public.learning_paths WHERE slug = 'red-team';
  SELECT id INTO blue_id FROM public.learning_paths WHERE slug = 'blue-team';
  SELECT id INTO web_id FROM public.learning_paths WHERE slug = 'web-security';
  INSERT INTO public.topics (learning_path_id, title, description, sequence_order) VALUES
    (red_id,'Foundations & Mindset','Core principles, ethics, and legal basics.',1),
    (red_id,'Safe Lab Setup & Tooling','Build your own safe hacking lab environment.',2),
    (red_id,'Web Vulnerabilities','SQL injection, XSS, and common web attack surfaces.',3),
    (red_id,'Practical Exercises','Guided labs and beginner CTF challenges.',4),
    (blue_id,'Defense Foundations','Security architecture, OS hardening, networking defense.',1),
    (blue_id,'Detection & Monitoring','Log analysis, threat detection, and SIEM fundamentals.',2),
    (blue_id,'Operations & Response','Incident response, SIEM operations, and exercises.',3),
    (web_id,'Web Architecture','HTTP/HTTPS, cookies, same-origin policy.',1),
    (web_id,'Core Vulnerabilities','Access control, SQLi, XSS, CSRF.',2),
    (web_id,'Advanced Attacks & Labs','File uploads, path traversal, PortSwigger labs.',3)
  ON CONFLICT (learning_path_id, sequence_order) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;
END $anon$;

INSERT INTO public.badges (slug, name, description, badge_type) VALUES
  ('linux-explorer','Linux Explorer','Complete Linux fundamentals and pass the Linux assessment.','special_achievement'),
  ('network-navigator','Network Navigator','Complete networking fundamentals and pass the networking assessment.','special_achievement'),
  ('web-apprentice','Web Apprentice','Complete web basics and pass the HTTP and protocols assessment.','special_achievement'),
  ('recon-specialist','Recon Specialist','Complete reconnaissance and Nmap lessons and pass the Nmap assessment.','special_achievement'),
  ('red-team-specialist','Red Team Specialist','Complete all 12 Red Team lessons and required assessments.','track_specialist'),
  ('blue-team-defender','Blue Team Defender','Complete all 9 Blue Team lessons and required assessments.','track_specialist'),
  ('web-security-expert','Web Security Expert','Complete all 10 Web Security lessons and OWASP assessments.','track_specialist'),
  ('cyberpath-master','CyberPath Master','Conquer all three specialization tracks (31 total lessons).','apex_credential')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, badge_type = EXCLUDED.badge_type;

-- ==============================================================================
-- PHASE 4: GAMIFICATION, STREAKS & CTF DISCOVERY TABLES & RPCS
-- ==============================================================================

-- 4.1 User XP Ledger Table (Immutable rewards transaction ledger)
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

-- 4.2 User Daily Activity Table (Streaks calculation)
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

-- 4.3 Resources Catalog Table (Curated external lab explorer)
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

-- 4.4 Performance Indexes
CREATE INDEX IF NOT EXISTS idx_user_xp_ledger_user ON public.user_xp_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_user_daily_activity_user_date ON public.user_daily_activity(user_id, activity_date DESC);
CREATE INDEX IF NOT EXISTS idx_resources_catalog_difficulty ON public.resources_catalog(difficulty);

-- 4.5 RLS Policies
ALTER TABLE public.user_xp_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources_catalog ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own xp ledger" ON public.user_xp_ledger;
CREATE POLICY "Users can read own xp ledger" ON public.user_xp_ledger FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own daily activity" ON public.user_daily_activity;
CREATE POLICY "Users can read own daily activity" ON public.user_daily_activity FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Resources catalog is publicly readable" ON public.resources_catalog;
CREATE POLICY "Resources catalog is publicly readable" ON public.resources_catalog FOR SELECT USING (true);

-- 4.6 Procedures (SECURITY DEFINER)
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
        user_id, action_type, reference_id, xp_amount, description, created_at
    )
    VALUES (
        p_user_id, p_action_type, p_reference_id, p_amount, p_description, timezone('utc'::text, now())
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

CREATE OR REPLACE FUNCTION public.record_daily_activity(
    p_user_id UUID,
    p_activity_type TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF auth.uid() IS NOT NULL AND auth.uid() != p_user_id THEN
        RAISE EXCEPTION 'Unauthorized';
    END IF;

    INSERT INTO public.user_daily_activity (
        user_id, activity_date, activity_count, last_activity_type, updated_at
    )
    VALUES (
        p_user_id, CURRENT_DATE, 1, p_activity_type, timezone('utc'::text, now())
    )
    ON CONFLICT (user_id, activity_date) DO UPDATE
    SET activity_count = public.user_daily_activity.activity_count + 1,
        last_activity_type = EXCLUDED.last_activity_type,
        updated_at = timezone('utc'::text, now());
END;
$$;