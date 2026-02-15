/**
 * App constants and configuration.
 *
 * Define all constants, enums, and configuration values here.
 * Avoid hardcoding values in components.
 *
 * Example:
 *
 * export const CATEGORIES = ["work", "personal", "urgent"] as const;
 * export type Category = (typeof CATEGORIES)[number];
 *
 * export const STATUS_LABELS: Record<string, string> = {
 *   pending: "Pending",
 *   complete: "Complete",
 * };
 */

export const APP_NAME = "Bookmarks";

export const STORAGE_KEYS = {
  items: "bookmark_app_items",
  settings: "bookmark_app_settings",
} as const;
