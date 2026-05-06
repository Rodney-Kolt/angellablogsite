"use client";

import { useEffect } from "react";
import { useCourtStore } from "@/store/court-store";
import { X, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export function PostModal() {
  const selectedPost = useCourtStore((s) => s.selectedPost);
  const setSelectedPost = useCourtStore((s) => s.setSelectedPost);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPost(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setSelectedPost]);

  if (!selectedPost) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={() => setSelectedPost(null)}
    >
      <div
        className="relative w-full max-w-lg bg-[#1e293b] rounded-sm border border-hoop-orange/40 p-6 shadow-orange"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp 0.2s ease-out" }}
      >
        {/* Close */}
        <button
          onClick={() => setSelectedPost(null)}
          className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Emoji + lock */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-3xl">{selectedPost.moodEmoji ?? "🏀"}</span>
          {selectedPost.isDiaryLock && (
            <span className="flex items-center gap-1 text-xs text-hoop-neon font-body uppercase tracking-wider">
              <Lock className="w-3 h-3" /> locked
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="font-heading text-2xl text-white tracking-wider mb-2 leading-tight">
          {selectedPost.title}
        </h2>

        {/* Date */}
        <p className="font-body text-xs text-slate-600 uppercase tracking-wider mb-4">
          {formatDate(selectedPost.createdAt)}
        </p>

        {/* Excerpt */}
        {selectedPost.excerpt && (
          <p className="font-body text-sm text-slate-400 leading-relaxed mb-6">
            {selectedPost.excerpt}
          </p>
        )}

        {/* CTA */}
        <div className="flex gap-3">
          <Button asChild>
            <Link href={`/posts/${selectedPost.slug}`} onClick={() => setSelectedPost(null)}>
              <ArrowRight className="w-4 h-4" />
              Read Full Post
            </Link>
          </Button>
          <Button variant="outline" onClick={() => setSelectedPost(null)}>
            Back to Court
          </Button>
        </div>
      </div>
    </div>
  );
}
