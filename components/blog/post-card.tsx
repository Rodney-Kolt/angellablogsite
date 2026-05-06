import Link from "next/link";
import Image from "next/image";
import { Post, User } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Lock, Music, Smile } from "lucide-react";

type PostWithAuthor = Post & { author: Pick<User, "name" | "image"> };

interface PostCardProps {
  post: PostWithAuthor;
  isLoggedIn?: boolean;
}

export function PostCard({ post, isLoggedIn }: PostCardProps) {
  const coverImage = post.imageUrls?.[0];

  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <Card className="overflow-hidden hover:shadow-girly-lg transition-all duration-300 hover:-translate-y-1 h-full">
        {/* Cover image */}
        {coverImage && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
          </div>
        )}

        {/* No image placeholder */}
        {!coverImage && (
          <div className="h-32 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center">
            <span className="text-4xl">{post.moodEmoji ?? "🌸"}</span>
          </div>
        )}

        <CardContent className="p-5">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {post.isDiaryLock && (
              <Badge variant="diary" className="gap-1">
                <Lock className="w-2.5 h-2.5" />
                diary lock
              </Badge>
            )}
            {post.moodEmoji && (
              <span className="text-sm">{post.moodEmoji}</span>
            )}
          </div>

          {/* Title */}
          <h2 className="font-heading text-lg font-semibold text-pink-800 group-hover:text-pink-600 transition-colors mb-2 line-clamp-2">
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="font-body text-sm text-pink-500 line-clamp-2 mb-3">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="space-y-1.5">
            {post.mood && (
              <div className="flex items-center gap-1.5">
                <Smile className="w-3 h-3 text-pink-300" />
                <span className="font-body text-xs text-pink-400">
                  {post.mood}
                </span>
              </div>
            )}
            {post.song && (
              <div className="flex items-center gap-1.5">
                <Music className="w-3 h-3 text-purple-300" />
                <span className="font-body text-xs text-purple-400 truncate">
                  {post.song}
                  {post.songArtist && ` — ${post.songArtist}`}
                </span>
              </div>
            )}
          </div>

          {/* Date */}
          <p className="font-body text-xs text-pink-300 mt-3">
            {formatDate(post.createdAt)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
