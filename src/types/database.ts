/**
 * Database Types
 *
 * Shared types for the unified user model (profiles table).
 * Add your app-specific table types below the profiles section.
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
// DATABASE SCHEMA TYPE (for Supabase typed client)
// ============================================================================
// Add your app-specific tables here.

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      // Add app-specific tables:
      // items: {
      //   Row: Item;
      //   Insert: ItemInsert;
      //   Update: ItemUpdate;
      // };
    };
  };
}
