-- ==============================================================================
-- CyberPath — Labs Migration: user_lab_progress table
-- ==============================================================================
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
--
-- This adds a single new table to track per-student lab progress.
-- Existing tables, RLS policies, and triggers are NOT modified.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.user_lab_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lab_slug TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'in_progress'
        CHECK (status IN ('in_progress', 'completed')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    hints_used INTEGER NOT NULL DEFAULT 0 CHECK (hints_used >= 0),
    attempts INTEGER NOT NULL DEFAULT 1 CHECK (attempts >= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_lab UNIQUE (user_id, lab_slug)
);

-- Index for fast lookup by user
CREATE INDEX IF NOT EXISTS idx_user_lab_progress_user_id
    ON public.user_lab_progress(user_id);

-- Auto-update updated_at on row change
-- (Reuse the existing update_updated_at_column function from schema.sql)
CREATE TRIGGER update_user_lab_progress_modtime
    BEFORE UPDATE ON public.user_lab_progress
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================================================
-- Row Level Security
-- ==============================================================================

ALTER TABLE public.user_lab_progress ENABLE ROW LEVEL SECURITY;

-- Students can read only their own lab progress records
DROP POLICY IF EXISTS "Users can read own lab progress" ON public.user_lab_progress;
CREATE POLICY "Users can read own lab progress"
    ON public.user_lab_progress FOR SELECT
    USING (auth.uid() = user_id);

-- Students can insert their own lab progress records
DROP POLICY IF EXISTS "Users can insert own lab progress" ON public.user_lab_progress;
CREATE POLICY "Users can insert own lab progress"
    ON public.user_lab_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Students can update only their own lab progress records
DROP POLICY IF EXISTS "Users can update own lab progress" ON public.user_lab_progress;
CREATE POLICY "Users can update own lab progress"
    ON public.user_lab_progress FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- SECURITY NOTE:
-- No DELETE policy is provided for students.
-- No policy allows students to modify other students' records.
-- XP rewards for labs are awarded via the existing local awardLocalXp utility
-- (idempotent, keyed by userId+lab_completed+labSlug).
-- Authoritative badge issuance for lab completion requires a SECURITY DEFINER
-- PostgreSQL function or a Supabase Edge Function, which is not included in
-- this migration (see FINAL REPORT — Known Limitations).
