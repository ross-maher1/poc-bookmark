-- ============================================================================
-- MINI-APP TEMPLATE - INITIAL SCHEMA
-- ============================================================================
-- Creates the shared profiles table and updated_at trigger.
-- Run this in your Supabase SQL Editor:
-- Dashboard > SQL Editor > New Query > Paste & Run
-- ============================================================================

-- ============================================================================
-- 1. PROFILES TABLE (shared across all mini-apps)
-- ============================================================================
-- Extends Supabase auth.users with application-specific user data.
-- Every authenticated user gets a profile record via the trigger in 004.

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    email TEXT NOT NULL,
    full_name TEXT,
    subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    preferences JSONB DEFAULT '{}'::jsonb
);

COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON COLUMN public.profiles.subscription_tier IS 'User subscription level: free or premium';
COMMENT ON COLUMN public.profiles.preferences IS 'JSON object storing user preferences';

-- ============================================================================
-- 2. APP-SPECIFIC TABLES
-- ============================================================================
-- Add your app's tables below. Every table should reference profiles.id
-- as a foreign key so data is scoped to a user and cascades on delete.
--
-- Example:
--
-- CREATE TABLE IF NOT EXISTS public.items (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
--     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--     updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--     title TEXT NOT NULL,
--     description TEXT
-- );

-- ============================================================================
-- 3. UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
-- Automatically updates the updated_at column on row changes.

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to profiles
CREATE TRIGGER set_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Apply to app-specific tables:
-- CREATE TRIGGER set_updated_at_items
--     BEFORE UPDATE ON public.items
--     FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
