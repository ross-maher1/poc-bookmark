"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Bookmark } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const supabase = createClient();

const bookmarkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Enter a valid URL"),
});

type BookmarkFormValues = z.infer<typeof bookmarkSchema>;

export default function BookmarksPage() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookmarkFormValues>({
    resolver: zodResolver(bookmarkSchema),
    defaultValues: { title: "", url: "" },
  });

  const fetchBookmarks = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setBookmarks(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const onSubmit = async (values: BookmarkFormValues) => {
    if (!user) return;
    setError(null);

    const { error } = await supabase.from("bookmarks").insert({
      user_id: user.id,
      title: values.title,
      url: values.url,
    });

    if (error) {
      setError(error.message);
    } else {
      reset();
      fetchBookmarks();
    }
  };

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id);

    if (error) {
      setError(error.message);
    } else {
      fetchBookmarks();
    }
  };

  return (
    <main className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <p className="type-meta">Collection</p>
        <h1 className="type-h1">Bookmarks</h1>
        <p className="type-lead">Save your favourite links.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Add a bookmark</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                {...register("title")}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
                placeholder="My favourite site"
              />
              {errors.title && (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">URL</label>
              <input
                {...register("url")}
                type="url"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
                placeholder="https://example.com"
              />
              {errors.url && (
                <p className="mt-1 text-xs text-rose-600">
                  {errors.url.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800"
              >
                Add bookmark
              </button>
            </div>
          </form>
        </div>

        {/* List */}
        <div className="rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Saved bookmarks</h2>
            <span className="text-xs text-slate-500">
              {bookmarks.length} total
            </span>
          </div>
          {loading ? (
            <p className="mt-4 type-lead">Loading...</p>
          ) : bookmarks.length === 0 ? (
            <p className="mt-4 type-lead">
              No bookmarks yet. Add one to get started.
            </p>
          ) : (
            <div className="mt-4 space-y-2">
              {bookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3"
                >
                  <div className="flex-grow min-w-0">
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-slate-900 hover:underline"
                    >
                      {bookmark.title}
                    </a>
                    <p className="text-xs text-slate-500 truncate">
                      {bookmark.url}
                    </p>
                    <p className="text-xs text-slate-400">
                      Added {formatDate(bookmark.created_at)}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteBookmark(bookmark.id)}
                    className="shrink-0 p-2 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
