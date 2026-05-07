import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { formatDate, stripHtml } from "@/lib/utils";
import { Comments } from "@/components/blog/comments";
import { Reactions } from "@/components/blog/reactions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Lock, Edit, ArrowLeft, Clock, Share2 } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps { params: { slug: string } }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    select: { title: true, excerpt: true, imageUrls: true },
  });
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.imageUrls?.[0] ? [post.imageUrls[0]] : [],
    },
  };
}

function readingTime(html: string): number {
  const words = stripHtml(html).split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default async function PostPage({ params }: PageProps) {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const currentUserId = session?.user?.id;
  const isOwner = (session?.user as { isOwner?: boolean })?.isOwner;

  const post = await prisma.post.findUnique({
    where: { slug: params.slug, published: true },
    include: {
      author: { select: { name: true, image: true, bio: true } },
      reactions: true,
      comments: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post) notFound();

  if (post.isDiaryLock && !isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-md">
        <Lock className="w-10 h-10 text-blue-300 mx-auto mb-4" />
        <h1 className="font-serif text-2xl text-ink mb-3">Members only</h1>
        <p className="text-slate-500 mb-6">Sign in to read this post.</p>
        <Button asChild><Link href="/login">Sign in</Link></Button>
      </div>
    );
  }

  const reactionCounts = {
    same:     post.reactions.filter((r) => r.type === "same").length,
    feltThat: post.reactions.filter((r) => r.type === "feltThat").length,
    hugs:     post.reactions.filter((r) => r.type === "hugs").length,
  };
  const userReactions = {
    same:     post.reactions.some((r) => r.userId === currentUserId && r.type === "same"),
    feltThat: post.reactions.some((r) => r.userId === currentUserId && r.type === "feltThat"),
    hugs:     post.reactions.some((r) => r.userId === currentUserId && r.type === "hugs"),
  };

  const mins = readingTime(post.content);

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-600 transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back
      </Link>

      <article>
        {/* Header */}
        <header className="mb-10">
          {post.isDiaryLock && (
            <div className="flex items-center gap-1.5 text-xs text-blue-500 mb-3">
              <Lock className="w-3.5 h-3.5" />
              <span>Members only</span>
            </div>
          )}

          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-ink leading-tight mb-5">
            {post.title}
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span className="font-medium text-ink">{post.author.name ?? "Author"}</span>
              <span>·</span>
              <span>{formatDate(post.createdAt)}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {mins} min read
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isOwner && (
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/edit/${post.id}`}>
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={undefined}>
                <Share2 className="w-3.5 h-3.5" />
                Share
              </Button>
            </div>
          </div>
        </header>

        {/* Cover image */}
        {post.imageUrls?.[0] && (
          <div className="mb-10 rounded-2xl overflow-hidden">
            <img src={post.imageUrls[0]} alt={post.title} className="w-full object-cover max-h-[480px]" />
          </div>
        )}

        {/* Content */}
        <div
          className="prose max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <Separator className="mb-8" />

        {/* Reactions */}
        <Reactions
          postId={post.id}
          counts={reactionCounts}
          userReactions={userReactions}
          isLoggedIn={isLoggedIn}
        />

        <Separator className="my-8" />

        {/* Author card */}
        <div className="flex items-start gap-4 p-6 rounded-xl bg-blue-50 border border-blue-100 mb-10">
          <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-semibold text-lg flex-shrink-0">
            {(post.author.name ?? "A")[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-ink mb-1">{post.author.name ?? "Author"}</p>
            {post.author.bio && <p className="text-sm text-slate-500 leading-relaxed">{post.author.bio}</p>}
          </div>
        </div>

        {/* Comments */}
        <Comments
          postId={post.id}
          comments={post.comments}
          currentUserId={currentUserId}
          isOwner={isOwner}
          isLoggedIn={isLoggedIn}
        />
      </article>
    </div>
  );
}
