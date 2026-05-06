import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { PenLine, Lock, Globe, Edit, Plus, Eye } from "lucide-react";
import Link from "next/link";
import { DeletePostButton } from "@/components/dashboard/delete-post-button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "dashboard" };

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
    include: { _count: { select: { reactions: true, comments: true } } },
  });

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">🏀</span>
            <h1 className="font-heading text-4xl text-white tracking-widest">
              DASHBOARD
            </h1>
          </div>
          <p className="font-body text-xs text-slate-500 uppercase tracking-wider">
            {posts.length} {posts.length === 1 ? "entry" : "entries"} on the board
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/new">
            <Plus className="w-4 h-4" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Court line */}
      <div className="h-px bg-gradient-to-r from-hoop-orange via-hoop-orange/50 to-transparent mb-8" />

      {/* Posts list */}
      {posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 bounce-ball inline-block">🏀</div>
          <p className="font-heading text-2xl text-slate-600 mb-2 tracking-widest">
            NO POSTS YET
          </p>
          <p className="font-body text-slate-700 mb-6 text-sm">
            drop your first entry on the board
          </p>
          <Button asChild>
            <Link href="/dashboard/new">
              <PenLine className="w-4 h-4" />
              Write Something
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 p-4 rounded-sm bg-[#1e293b] border border-slate-800 hover:border-hoop-orange/40 transition-all"
            >
              <span className="text-xl flex-shrink-0">
                {post.moodEmoji ?? "🏀"}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-heading text-sm text-white truncate tracking-wider">
                    {post.title}
                  </h3>
                  {post.isDiaryLock ? (
                    <Badge variant="diary" className="gap-1 flex-shrink-0">
                      <Lock className="w-2.5 h-2.5" />
                      locked
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 flex-shrink-0">
                      <Globe className="w-2.5 h-2.5" />
                      public
                    </Badge>
                  )}
                </div>
                <p className="font-body text-xs text-slate-600">
                  {formatDate(post.createdAt)} · {post._count.reactions} reactions · {post._count.comments} comments
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
  );
}
