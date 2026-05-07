"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InlinePostForm } from "./inline-post-form";
import { DeletePostButton } from "./delete-post-button";
import { formatDate } from "@/lib/utils";
import { Eye, Edit, BookOpen, MessageCircle, PenLine } from "lucide-react";

interface PostRow {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  isDiaryLock: boolean;
  moodEmoji: string | null;
  createdAt: string;
  reactions: number;
  comments: number;
}

interface DashboardClientProps {
  initialPosts: PostRow[];
  totalComments: number;
}

export function DashboardClient({ initialPosts, totalComments }: DashboardClientProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);

  // After a new post is created, refresh the server data
  const handlePostCreated = () => {
    router.refresh(); // triggers server re-render → new initialPosts
  };

  const published = posts.filter((p) => p.published).length;
  const drafts = posts.filter((p) => !p.published).length;

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl space-y-10">
      {/* Page header */}
      <div>
        <h1 className="font-heading text-4xl text-navy mb-1">my dashboard ✦</h1>
        <p className="font-body text-sm text-navy-muted">
          welcome back, Blackie 🌊
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <BookOpen className="w-4 h-4" />, label: "total posts",  value: posts.length,   color: "bg-aqua-100 border-aqua-200" },
          { icon: <Eye className="w-4 h-4" />,      label: "published",    value: published,       color: "bg-sky-pale border-sky-light" },
          { icon: <PenLine className="w-4 h-4" />,  label: "drafts",       value: drafts,          color: "bg-sand border-sand" },
          { icon: <MessageCircle className="w-4 h-4" />, label: "comments", value: totalComments,  color: "bg-coral-50 border-coral-200" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`p-4 rounded-2xl border-2 border-dashed ${stat.color} text-center`}
          >
            <div className="flex justify-center text-navy-muted mb-1">{stat.icon}</div>
            <p className="font-heading text-2xl text-navy">{stat.value}</p>
            <p className="font-body text-xs text-navy-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Inline post creation form ── */}
      <InlinePostForm onSuccess={handlePostCreated} />

      {/* ── Post list ── */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-heading text-2xl text-navy">your memories ✦</h2>
          <div className="flex-1 h-0 border-t-2 border-dashed border-aqua-200" />
          <span className="font-body text-xs text-navy-faint">{posts.length} entries</span>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border-2 border-dashed border-aqua-200 bg-white/50">
            <div className="text-5xl mb-3 animate-float">🌊</div>
            <p className="font-heading text-xl text-aqua-400 mb-1">no memories yet~</p>
            <p className="font-body text-navy-muted text-sm">
              use the form above to write your first entry!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white/80 border-2 border-dashed border-aqua-200 hover:border-aqua-300 transition-colors"
              >
                <span className="text-xl flex-shrink-0">{post.moodEmoji ?? "🌊"}</span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <h3 className="font-body font-semibold text-navy truncate">
                      {post.title}
                    </h3>
                    {!post.published && (
                      <span className="text-xs font-body text-navy-faint bg-sand px-2 py-0.5 rounded-full flex-shrink-0">
                        draft
                      </span>
                    )}
                    {post.isDiaryLock && (
                      <span className="text-xs font-body text-aqua-500 bg-aqua-50 px-2 py-0.5 rounded-full flex-shrink-0">
                        members
                      </span>
                    )}
                  </div>
                  <p className="font-handwriting text-xs text-navy-faint">
                    {formatDate(post.createdAt)} · {post.reactions} reactions · {post.comments} notes
                  </p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button asChild variant="ghost" size="icon">
                    <Link href={`/posts/${post.slug}`} title="View">
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="icon">
                    <Link href={`/dashboard/edit/${post.id}`} title="Edit">
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <DeletePostButton postId={post.id} postTitle={post.title} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
