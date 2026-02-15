"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const supabase = createClient();

export default function HomePage() {
  const { user } = useAuth();
  const [bookmarkCount, setBookmarkCount] = useState(0);

  const fetchCount = useCallback(async () => {
    if (!user) return;
    const { count } = await supabase
      .from("bookmarks")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    setBookmarkCount(count || 0);
  }, [user]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return (
    <main className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <p className="type-meta">Dashboard</p>
        <h1 className="type-h1">Bookmarks</h1>
        <p className="type-lead">
          Save your favourite links. Data is stored in Supabase.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Link
          href="/bookmarks"
          className="group rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Bookmarks</h2>
            <span className="text-2xl font-bold text-slate-900">
              {bookmarkCount}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">Saved links</p>
        </Link>

        <Link
          href="/settings"
          className="group rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Settings</h2>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Account and preferences
          </p>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/bookmarks"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800"
          >
            Add Bookmark
          </Link>
          <Link
            href="/settings"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-400"
          >
            Settings
          </Link>
        </div>
      </div>
    </main>
  );
}
