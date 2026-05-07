import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { PenLine, Eye, Edit, Plus, BookOpen, MessageCircle, Heart } from "lucide-react";
import Link from "next/link";
import { DeletePostButton } from "@/components/dashboard/delete-post-button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard ✦" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { isOwner: true } });
  if (!user?.isOwner) redirect("/");

  const [posts, totalComments, totalReactions] = await Promise.all([
    prisma.post.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { reactions: true, comments: true } } },
    }),
    prisma.comment.count(),
    prisma.reaction.count(),
  ]);

  const published = posts.filter((p) => p.published).length;
  const drafts = posts.filter((p) => !p.published).length;

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-4xl text-navy mb-1">my dashboard ✦</h1>
          <p className="font-body text-sm text-navy-muted">manage your memories</p>
        </div>
        <Button asChild variant="coral">
          <Link href="/dashboard/new"><Plus className="w-4 h-4" />new memory</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <BookOpen className="w-4 h-4" />, label: "total posts", value: posts.length, color: "bg-aqua-100 border-aqua-200" },
          { icon: <Eye className="w-4 h-4" />, label: "published", value: published, color: "bg-sky-pale border-sky-light" },
          { icon: <PenLine className="w-4 h-4" />, label: "drafts", value: drafts, color: "bg-sand border-sand" },
          { icon: <MessageCircle className="w-4 h-4" />, label: "comments", value: totalComments, color: "bg-coral-50 border-coral-200" },
        ].map((stat) => (
          <div key={stat.label} className={`p-4 rounded-2xl border-2 border-dashed ${stat.color} text-center`}>
            <div className="flex justify-center text-navy-muted mb-1">{stat.icon}</div>
            <p className="font-heading text-2xl text-navy">{stat.value}</p>
            <p className="font-body text-xs text-navy-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Posts list */}
      {posts.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border-2 border-dashed border-aqua-200 bg-white/50">
          <div className="text-5xl mb-4 animate-float">🌊</div>
          <p className="font-heading text-xl text-aqua-400 mb-2">no memories yet~</p>
          <p className="font-body text-navy-muted text-sm mb-6">start writing your first entry!</p>
          <Button asChild variant="coral"><Link href="/dashboard/new">write something ✦</Link></Button>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 border-2 border-dashed border-aqua-200 hover:border-aqua-300 transition-colors">
              <span className="text-xl flex-shrink-0">{post.moodEmoji ?? "🌊"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <h3 className="font-body font-semibold text-navy truncate">{post.title}</h3>
                  {!post.published && <span className="text-xs font-body text-navy-faint bg-sand px-2 py-0.5 rounded-full">draft</span>}
                  {post.isDiaryLock && <span className="text-xs font-body text-aqua-500 bg-aqua-50 px-2 py-0.5 rounded-full">members</span>}
                </div>
                <p className="font-handwriting text-xs text-navy-faint">
                  {formatDate(post.createdAt)} · {post._count.reactions} reactions · {post._count.comments} notes
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button asChild variant="ghost" size="icon"><Link href={`/posts/${post.slug}`}><Eye className="w-4 h-4" /></Link></Button>
                <Button asChild variant="ghost" size="icon"><Link href={`/dashboard/edit/${post.id}`}><Edit className="w-4 h-4" /></Link></Button>
                <DeletePostButton postId={post.id} postTitle={post.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
