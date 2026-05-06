import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { formatDate } from "@/lib/utils";
import { PolaroidGallery } from "@/components/blog/polaroid-gallery";
import { Reactions } from "@/components/blog/reactions";
import { Comments } from "@/components/blog/comments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Lock, Music, Star, Smile, ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post) notFound();

  // Diary lock check
  if (post.isDiaryLock && !isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="text-6xl mb-6 float">🔒</div>
        <h1 className="font-heading text-3xl text-pink-800 mb-3">
          diary lock 🌙
        </h1>
        <p className="font-body text-pink-500 mb-6">
          this entry is only for signed-in readers. sign in to unlock it ✨
        </p>
        <Button asChild>
          <Link href="/login">sign in to read</Link>
        </Button>
      </div>
    );
  }

  // Reaction counts
  const reactionCounts = {
    same: post.reactions.filter((r) => r.type === "same").length,
    feltThat: post.reactions.filter((r) => r.type === "feltThat").length,
    hugs: post.reactions.filter((r) => r.type === "hugs").length,
  };

  const userReactions = {
    same: post.reactions.some(
      (r) => r.userId === currentUserId && r.type === "same"
    ),
    feltThat: post.reactions.some(
      (r) => r.userId === currentUserId && r.type === "feltThat"
    ),
    hugs: post.reactions.some(
      (r) => r.userId === currentUserId && r.type === "hugs"
    ),
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-body text-sm text-pink-400 hover:text-pink-600 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        back to home
      </Link>

      {/* Post header */}
      <article>
        <header className="mb-8">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {post.isDiaryLock && (
              <Badge variant="diary" className="gap-1">
                <Lock className="w-2.5 h-2.5" />
                diary lock
              </Badge>
            )}
            {post.moodEmoji && (
              <span className="text-2xl">{post.moodEmoji}</span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-pink-800 mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Date */}
          <p className="font-body text-sm text-pink-400 mb-6">
            {formatDate(post.createdAt)}
          </p>

          {/* Kiro prompts card */}
          {(post.mood || post.song || post.tinyJoy) && (
            <div className="p-5 rounded-3xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 space-y-3 mb-6">
              {post.mood && (
                <div className="flex items-center gap-2">
                  <Smile className="w-4 h-4 text-pink-400 flex-shrink-0" />
                  <span className="font-body text-sm text-pink-600">
                    <span className="font-semibold">mood:</span> {post.mood}
                  </span>
                </div>
              )}
              {post.song && (
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span className="font-body text-sm text-purple-600">
                    <span className="font-semibold">looping:</span> {post.song}
                    {post.songArtist && (
                      <span className="text-purple-400">
                        {" "}
                        — {post.songArtist}
                      </span>
                    )}
                  </span>
                </div>
              )}
              {post.tinyJoy && (
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  <span className="font-body text-sm text-yellow-700">
                    <span className="font-semibold">tiny joy:</span>{" "}
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
                edit post
              </Link>
            </Button>
          )}
        </header>

        {/* Polaroid gallery */}
        {post.imageUrls && post.imageUrls.length > 0 && (
          <PolaroidGallery images={post.imageUrls} title={post.title} />
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
