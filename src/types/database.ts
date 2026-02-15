/**
 * Database Types
 *
 * Shared types for the unified user model (profiles table)
 * plus app-specific tables.
 */

// ============================================================================
// PROFILES (shared across all mini-apps)
// ============================================================================

export type SubscriptionTier = "free" | "premium";

export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  full_name: string | null;
  subscription_tier: SubscriptionTier;
  onboarding_completed: boolean;
  preferences: Record<string, unknown> | null;
}

export interface ProfileInsert {
  id: string;
  email: string;
  full_name?: string | null;
  subscription_tier?: SubscriptionTier;
  onboarding_completed?: boolean;
  preferences?: Record<string, unknown> | null;
}

export interface ProfileUpdate {
  email?: string;
  full_name?: string | null;
  subscription_tier?: SubscriptionTier;
  onboarding_completed?: boolean;
  preferences?: Record<string, unknown> | null;
}

// ============================================================================
// BOOKMARKS
// ============================================================================

export interface BookmarkRow {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  url: string;
  title: string;
}

export interface BookmarkInsert {
  user_id: string;
  url: string;
  title: string;
}

export interface BookmarkUpdate {
  url?: string;
  title?: string;
}

// ============================================================================
// DATABASE SCHEMA TYPE
// ============================================================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      bookmarks: {
        Row: BookmarkRow;
        Insert: BookmarkInsert;
        Update: BookmarkUpdate;
      };
    };
  };
}
