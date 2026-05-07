import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { PenLine, Eye, Edit, Plus } from "lucide-react";
import Link from "next/link";
import { DeletePostButton } from "@/components/dashboard/delete-post-button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { isOwner: true } });
  if (!user?.isOwner) redirect("/");

  const posts = await prisma.post.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { reactions: true, comments: true } } },
  });

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-ink">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">{posts.length} {posts.length === 1 ? "post" : "posts"}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/new"><Plus className="w-4 h-4" />New post</Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border border-dashed border-slate-300">
          <PenLine className="w-10 h-10 text-slate-300 mx-auto mb-4" />
          <p className="font-serif text-xl text-slate-400 mb-2">No posts yet</p>
          <p className="text-slate-400 text-sm mb-6">Start writing your first story.</p>
          <Button asChild><Link href="/dashboard/new">Write something</Link></Button>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-200 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-medium text-ink truncate">{post.title}</h3>
                  {!post.published && <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Draft</span>}
                  {post.isDiaryLock && <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">Members</span>}
                </div>
                <p className="text-xs text-slate-400">
                  {formatDate(post.createdAt)} · {post._count.reactions} reactions · {post._count.comments} comments
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
