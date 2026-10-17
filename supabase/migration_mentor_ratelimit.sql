-- ==============================================================================
-- CyberPath — AI Lab Mentor Migration: Rate Limiting & Audit Trail
-- ==============================================================================
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
--
-- This migration provisions:
-- 1. `mentor_requests` table to track AI mentor API requests per user.
-- 2. Performance indexes for efficient sliding-window queries.
-- 3. Row Level Security (RLS) with least privilege (users can only see their own requests).
-- 4. An atomic PostgreSQL stored procedure (RPC) `check_and_record_mentor_request`
--    using transaction-level advisory locks to prevent race conditions across
--    concurrent Supabase Edge Function instances.
-- ==============================================================================

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.mentor_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lab_id TEXT,
    mode TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Indexes for fast per-user sliding window lookups
CREATE INDEX IF NOT EXISTS idx_mentor_requests_user_window
    ON public.mentor_requests (user_id, created_at DESC);

-- 3. Row Level Security
ALTER TABLE public.mentor_requests ENABLE ROW LEVEL SECURITY;

-- Students can read only their own request records
DROP POLICY IF EXISTS "Users can read own mentor requests" ON public.mentor_requests;
CREATE POLICY "Users can read own mentor requests"
    ON public.mentor_requests FOR SELECT
    USING (auth.uid() = user_id);

-- Students can insert their own request records
DROP POLICY IF EXISTS "Users can insert own mentor requests" ON public.mentor_requests;
CREATE POLICY "Users can insert own mentor requests"
    ON public.mentor_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- No UPDATE or DELETE policies for students (immutable audit log)

-- 4. Atomic RPC function for concurrency-safe sliding-window rate limiting
CREATE OR REPLACE FUNCTION public.check_and_record_mentor_request(
    p_user_id UUID,
    p_lab_id TEXT DEFAULT NULL,
    p_mode TEXT DEFAULT NULL,
    p_max_per_minute INTEGER DEFAULT 5,
    p_max_per_day INTEGER DEFAULT 100
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_minute_count INTEGER;
    v_day_count INTEGER;
    v_now TIMESTAMP WITH TIME ZONE := timezone('utc'::text, now());
BEGIN
    -- Advisory lock per user_id to ensure atomicity across concurrent function instances
    PERFORM pg_advisory_xact_lock(hashtext(p_user_id::text));

    -- Count requests in the last 60 seconds
    SELECT count(*) INTO v_minute_count
    FROM public.mentor_requests
    WHERE user_id = p_user_id
      AND created_at >= (v_now - INTERVAL '1 minute');

    IF v_minute_count >= p_max_per_minute THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'reason', 'rate_limit_minute',
            'error', 'Too many requests. Please wait a minute before asking another question.',
            'retry_after', 60
        );
    END IF;

    -- Count requests in the last 24 hours
    SELECT count(*) INTO v_day_count
    FROM public.mentor_requests
    WHERE user_id = p_user_id
      AND created_at >= (v_now - INTERVAL '24 hours');

    IF v_day_count >= p_max_per_day THEN
        RETURN jsonb_build_object(
            'allowed', false,
            'reason', 'rate_limit_day',
            'error', 'Daily AI mentor request limit reached (100 requests/day). Please continue tomorrow.',
            'retry_after', 86400
        );
    END IF;

    -- Insert request record atomically
    INSERT INTO public.mentor_requests (user_id, lab_id, mode, created_at)
    VALUES (p_user_id, p_lab_id, p_mode, v_now);

    RETURN jsonb_build_object(
        'allowed', true,
        'requests_last_minute', v_minute_count + 1,
        'requests_last_day', v_day_count + 1
    );
END;
$$;

-- Grant execution permission to authenticated users and service_role
REVOKE ALL ON FUNCTION public.check_and_record_mentor_request(UUID, TEXT, TEXT, INTEGER, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_and_record_mentor_request(UUID, TEXT, TEXT, INTEGER, INTEGER) TO authenticated, service_role;
