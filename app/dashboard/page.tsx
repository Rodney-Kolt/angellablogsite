import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { PenLine, Lock, Globe, Edit, Trash2, Plus, Eye } from "lucide-react";
import Link from "next/link";
import { DeletePostButton } from "@/components/dashboard/delete-post-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isOwner: true },
  });

  if (!user?.isOwner) redirect("/");

  const posts = await prisma.post.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { reactions: true, comments: true } },
    },
  });

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-4xl font-bold text-pink-800 mb-1">
            dashboard ✨
          </h1>
          <p className="font-body text-pink-400">
            {posts.length} {posts.length === 1 ? "entry" : "entries"} so far
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/new">
            <Plus className="w-4 h-4" />
            new post
          </Link>
        </Button>
      </div>

      {/* Posts list */}
      {posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 float">📝</div>
          <p className="font-heading text-2xl text-pink-400 mb-2">
            no posts yet~
          </p>
          <p className="font-body text-pink-300 mb-6">
            write your first entry! ✨
          </p>
          <Button asChild>
            <Link href="/dashboard/new">
              <PenLine className="w-4 h-4" />
              write something
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 border border-pink-100 shadow-girly hover:shadow-girly-lg transition-all"
            >
              {/* Emoji */}
              <span className="text-2xl flex-shrink-0">
                {post.moodEmoji ?? "📝"}
              </span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-heading text-base text-pink-800 truncate">
                    {post.title}
                  </h3>
                  {post.isDiaryLock ? (
                    <Badge variant="diary" className="gap-1 flex-shrink-0">
                      <Lock className="w-2.5 h-2.5" />
                      diary lock
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 flex-shrink-0">
                      <Globe className="w-2.5 h-2.5" />
                      public
                    </Badge>
                  )}
                </div>
                <p className="font-body text-xs text-pink-400">
                  {formatDate(post.createdAt)} ·{" "}
                  {post._count.reactions} reactions ·{" "}
                  {post._count.comments} notes
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button asChild variant="ghost" size="icon">
                  <Link href={`/posts/${post.slug}`} title="View post">
                    <Eye className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="icon">
                  <Link href={`/dashboard/edit/${post.id}`} title="Edit post">
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
  );
}
