import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { formatDate, stripHtml } from "@/lib/utils";
import { Comments } from "@/components/blog/comments";
import { Reactions } from "@/components/blog/reactions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Lock, Edit, ArrowLeft, Clock, Music, Star, Smile } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
        <div className="text-5xl mb-5 animate-float">🔒</div>
        <h1 className="font-heading text-3xl text-navy mb-3">members only ✦</h1>
        <p className="font-body text-navy-muted mb-6">sign in to unlock this memory 🌊</p>
        <Button asChild variant="coral"><Link href="/login">sign in</Link></Button>
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
      <Link href="/" className="inline-flex items-center gap-1.5 font-body text-sm text-navy-muted hover:text-coral-400 transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        back to memories
      </Link>

      <article>
        {/* Header */}
        <header className="mb-8">
          {post.isDiaryLock && (
            <div className="flex items-center gap-1.5 text-xs text-aqua-500 mb-3">
              <Lock className="w-3.5 h-3.5" />
              <span className="font-body">members only</span>
            </div>
          )}

          <h1 className="font-heading text-4xl md:text-5xl text-navy mb-4 leading-tight">
            {post.moodEmoji && <span className="mr-2">{post.moodEmoji}</span>}
            {post.title}
          </h1>

          <div className="flex items-center flex-wrap gap-3 text-sm text-navy-muted mb-5">
            <span className="font-handwriting">{post.author.name ?? "author"}</span>
            <span>·</span>
            <span className="font-handwriting">{formatDate(post.createdAt)}</span>
            <span>·</span>
            <span className="flex items-center gap-1 font-body">
              <Clock className="w-3.5 h-3.5" />
              {mins} min read
            </span>
          </div>

          {/* Scrapbook details */}
          {(post.mood || post.song || post.tinyJoy) && (
            <div className="p-4 rounded-2xl bg-white/70 border-2 border-dashed border-aqua-200 space-y-2 mb-5">
              {post.mood && (
                <div className="flex items-center gap-2">
                  <Smile className="w-3.5 h-3.5 text-aqua-400 flex-shrink-0" />
                  <span className="font-body text-xs text-navy-muted">
                    <span className="font-semibold text-navy">mood:</span> {post.moodEmoji} {post.mood}
                  </span>
                </div>
              )}
              {post.song && (
                <div className="flex items-center gap-2">
                  <Music className="w-3.5 h-3.5 text-coral-400 flex-shrink-0" />
                  <span className="font-body text-xs text-navy-muted">
                    <span className="font-semibold text-navy">playing:</span> {post.song}
                    {post.songArtist && <span className="text-navy-faint"> — {post.songArtist}</span>}
                  </span>
                </div>
              )}
              {post.tinyJoy && (
                <div className="flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                  <span className="font-body text-xs text-navy-muted">
                    <span className="font-semibold text-navy">tiny joy:</span> {post.tinyJoy}
                  </span>
                </div>
              )}
            </div>
          )}

          {isOwner && (
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/edit/${post.id}`}>
                <Edit className="w-3.5 h-3.5" />
                edit memory
              </Link>
            </Button>
          )}
        </header>

        {/* Polaroid gallery */}
        {post.imageUrls && post.imageUrls.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center my-8">
            {post.imageUrls.map((url, i) => {
              const rot = ((i * 37 + 7) % 5 - 2) * 0.8;
              return (
                <div key={i} className="polaroid" style={{ transform: `rotate(${rot}deg)` }}>
                  <div className="relative w-40 h-40 overflow-hidden">
                    <Image src={url} alt={`${post.title} photo ${i + 1}`} fill className="object-cover" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Content */}
        <div className="prose max-w-none mb-10" dangerouslySetInnerHTML={{ __html: post.content }} />

        <Separator className="mb-8" />

        {/* Reactions */}
        <Reactions postId={post.id} counts={reactionCounts} userReactions={userReactions} isLoggedIn={isLoggedIn} />

        <Separator className="my-8" />

        {/* Author */}
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-aqua-50 border-2 border-dashed border-aqua-200 mb-10">
          <div className="w-12 h-12 rounded-full bg-aqua-200 flex items-center justify-center text-navy font-heading text-lg flex-shrink-0">
            {(post.author.name ?? "A")[0].toUpperCase()}
          </div>
          <div>
            <p className="font-heading text-base text-navy mb-1">{post.author.name ?? "author"}</p>
            {post.author.bio && <p className="font-body text-sm text-navy-muted leading-relaxed">{post.author.bio}</p>}
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
