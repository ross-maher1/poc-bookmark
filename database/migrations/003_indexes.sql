-- ============================================================================
-- MINI-APP TEMPLATE - DATABASE INDEXES
-- ============================================================================
-- Performance indexes for common queries.
-- Run this AFTER 002_rls_policies.sql
-- ============================================================================

-- ============================================================================
-- 1. PROFILES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON public.profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- ============================================================================
-- 2. APP-SPECIFIC INDEXES
-- ============================================================================
-- Example:
-- CREATE INDEX IF NOT EXISTS idx_items_user_id ON public.items(user_id);
