import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { formatDate } from "@/lib/utils";
import { ImageGallery } from "@/components/blog/image-gallery";
import { Reactions } from "@/components/blog/reactions";
import { Comments } from "@/components/blog/comments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Lock, Music, Star, Zap, ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    select: { title: true, excerpt: true, imageUrls: true },
  });
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: {
      title: `${post.title} | kiro daily`,
      description: post.excerpt ?? undefined,
      images: post.imageUrls?.[0] ? [post.imageUrls[0]] : [],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const currentUserId = session?.user?.id;
  const isOwner = (session?.user as { isOwner?: boolean })?.isOwner;

  const post = await prisma.post.findUnique({
    where: { slug: params.slug, published: true },
    include: {
      author: { select: { name: true, image: true } },
      reactions: true,
      comments: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post) notFound();

  // Diary lock check
  if (post.isDiaryLock && !isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="text-6xl mb-6 float inline-block">🔒</div>
        <h1 className="font-heading text-3xl text-white mb-3 tracking-widest">
          LOCKED POST
        </h1>
        <p className="font-body text-slate-500 mb-6 text-sm">
          this entry is only for signed-in readers. step on the court to unlock it.
        </p>
        <Button asChild>
          <Link href="/login">Sign In to Read</Link>
        </Button>
      </div>
    );
  }

  const reactionCounts = {
    same: post.reactions.filter((r) => r.type === "same").length,
    feltThat: post.reactions.filter((r) => r.type === "feltThat").length,
    hugs: post.reactions.filter((r) => r.type === "hugs").length,
  };

  const userReactions = {
    same: post.reactions.some((r) => r.userId === currentUserId && r.type === "same"),
    feltThat: post.reactions.some((r) => r.userId === currentUserId && r.type === "feltThat"),
    hugs: post.reactions.some((r) => r.userId === currentUserId && r.type === "hugs"),
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-body text-xs text-slate-500 hover:text-hoop-orange transition-colors mb-8 group uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Court
      </Link>

      <article>
        <header className="mb-8">
          {/* Top accent line */}
          <div className="h-0.5 bg-gradient-to-r from-hoop-orange to-transparent mb-6" />

          {/* Badges */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {post.isDiaryLock && (
              <Badge variant="diary" className="gap-1">
                <Lock className="w-2.5 h-2.5" />
                locked
              </Badge>
            )}
            {post.moodEmoji && (
              <span className="text-2xl">{post.moodEmoji}</span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-heading text-4xl md:text-5xl text-white mb-3 leading-tight tracking-wider">
            {post.title}
          </h1>

          {/* Date + author */}
          <div className="flex items-center gap-3 mb-6">
            <p className="font-body text-xs text-slate-600 uppercase tracking-wider">
              {formatDate(post.createdAt)}
            </p>
            {post.author.name && (
              <>
                <span className="text-slate-700">·</span>
                <p className="font-body text-xs text-slate-600 uppercase tracking-wider">
                  {post.author.name}
                </p>
              </>
            )}
          </div>

          {/* Game day stats card */}
          {(post.mood || post.song || post.tinyJoy) && (
            <div className="p-4 rounded-sm bg-slate-900 border border-slate-800 space-y-2 mb-6">
              <p className="font-heading text-xs text-hoop-orange tracking-widest mb-3">
                GAME DAY STATS
              </p>
              {post.mood && (
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-hoop-orange flex-shrink-0" />
                  <span className="font-body text-xs text-slate-400">
                    <span className="text-slate-300 font-semibold">vibe:</span>{" "}
                    {post.moodEmoji} {post.mood}
                  </span>
                </div>
              )}
              {post.song && (
                <div className="flex items-center gap-2">
                  <Music className="w-3.5 h-3.5 text-hoop-neon flex-shrink-0" />
                  <span className="font-body text-xs text-slate-400">
                    <span className="text-slate-300 font-semibold">locker room track:</span>{" "}
                    {post.song}
                    {post.songArtist && (
                      <span className="text-slate-600"> — {post.songArtist}</span>
                    )}
                  </span>
                </div>
              )}
              {post.tinyJoy && (
                <div className="flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                  <span className="font-body text-xs text-slate-400">
                    <span className="text-slate-300 font-semibold">win of the day:</span>{" "}
                    {post.tinyJoy}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Edit button for owner */}
          {isOwner && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/edit/${post.id}`}>
                <Edit className="w-3.5 h-3.5" />
                Edit Post
              </Link>
            </Button>
          )}
        </header>

        {/* Image gallery */}
        {post.imageUrls && post.imageUrls.length > 0 && (
          <ImageGallery images={post.imageUrls} title={post.title} />
        )}

        {/* Content */}
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <Separator className="my-8" />

        {/* Reactions */}
        <Reactions
          postId={post.id}
          counts={reactionCounts}
          userReactions={userReactions}
          isLoggedIn={isLoggedIn}
        />

        <Separator className="my-8" />

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
