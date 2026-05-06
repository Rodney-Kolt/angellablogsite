import Link from "next/link";
import Image from "next/image";
import { Post, User } from "@prisma/client";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Lock, Music, Zap } from "lucide-react";

type PostWithAuthor = Post & { author: Pick<User, "name" | "image"> };

interface PostCardProps {
  post: PostWithAuthor;
  isLoggedIn?: boolean;
}

export function PostCard({ post, isLoggedIn }: PostCardProps) {
  const coverImage = post.imageUrls?.[0];

  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <div className="overflow-hidden rounded-sm border border-slate-800 bg-[#1e293b] shadow-court card-tilt hover:border-hoop-orange/50 h-full transition-all duration-300">
        {/* Cover image */}
        {coverImage && (
          <div className="relative h-44 overflow-hidden">
            <Image
              src={coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-transparent to-transparent" />
            {/* Basketball icon overlay */}
            <div className="absolute top-3 right-3 text-2xl opacity-60 group-hover:opacity-100 group-hover:animate-spin-ball transition-all duration-300">
              🏀
            </div>
          </div>
        )}

        {/* No image placeholder */}
        {!coverImage && (
          <div className="h-28 bg-gradient-to-br from-slate-900 via-slate-800 to-[#1e293b] flex items-center justify-center relative overflow-hidden">
            {/* Court line decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-hoop-orange" />
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-hoop-orange" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-hoop-orange" />
            </div>
            <span className="text-4xl group-hover:animate-spin-ball transition-all duration-300 relative z-10">
              {post.moodEmoji ?? "🏀"}
            </span>
          </div>
        )}

        <CardContent className="p-4">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {post.isDiaryLock && (
              <Badge variant="diary" className="gap-1">
                <Lock className="w-2.5 h-2.5" />
                locked
              </Badge>
            )}
            {post.moodEmoji && !coverImage && null}
          </div>

          {/* Title */}
          <h2 className="font-heading text-lg tracking-wider text-white group-hover:text-hoop-orange transition-colors mb-2 line-clamp-2 leading-tight">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="font-body text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="space-y-1">
            {post.mood && (
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-hoop-orange" />
                <span className="font-body text-xs text-slate-500">
                  {post.mood}
                </span>
              </div>
            )}
            {post.song && (
              <div className="flex items-center gap-1.5">
                <Music className="w-3 h-3 text-hoop-neon" />
                <span className="font-body text-xs text-slate-500 truncate">
                  {post.song}
                  {post.songArtist && ` — ${post.songArtist}`}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
            <p className="font-body text-xs text-slate-600">
              {formatDate(post.createdAt)}
            </p>
            <span className="text-hoop-orange text-xs font-body font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
              Read →
            </span>
          </div>
        </CardContent>
      </div>
    </Link>
  );
}
