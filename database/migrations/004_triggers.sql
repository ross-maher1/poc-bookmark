-- ============================================================================
-- MINI-APP TEMPLATE - AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================================
-- When a new user signs up via Supabase Auth, automatically creates a
-- corresponding profile record with their email and name.
--
-- CRITICAL: Without this trigger, signup creates an auth.users record
-- but no profile row, breaking the app's profile fetching.
--
-- Run this AFTER 003_indexes.sql
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NULL)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
-- Note: This trigger is on auth.users which requires SECURITY DEFINER
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
