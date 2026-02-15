-- ============================================================================
-- MINI-APP TEMPLATE - ROW LEVEL SECURITY POLICIES
-- ============================================================================
-- Ensures users can only access their own data.
-- Run this AFTER 001_initial_schema.sql
-- ============================================================================

-- ============================================================================
-- 1. PROFILES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 2. APP-SPECIFIC RLS POLICIES
-- ============================================================================
-- Example for an items table:
--
-- ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY "items_select_own" ON public.items
--     FOR SELECT USING (auth.uid() = user_id);
--
-- CREATE POLICY "items_insert_own" ON public.items
--     FOR INSERT WITH CHECK (auth.uid() = user_id);
--
-- CREATE POLICY "items_update_own" ON public.items
--     FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
--
-- CREATE POLICY "items_delete_own" ON public.items
--     FOR DELETE USING (auth.uid() = user_id);
