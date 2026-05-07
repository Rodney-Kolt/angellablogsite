import Link from "next/link";
import Image from "next/image";
import { Post, User } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import { Lock } from "lucide-react";

type PostWithAuthor = Post & { author: Pick<User, "name" | "image"> };

// Deterministic rotation from post id
function getRotation(id: string): string {
  const n = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
  const deg = ((n % 5) - 2) * 0.6; // -1.2 to 1.2 deg
  return `rotate(${deg}deg)`;
}

const MOOD_COLORS: Record<string, string> = {
  "🌊": "bg-sky-light",
  "☀️": "bg-yellow-50",
  "🌸": "bg-pink-50",
  "🌿": "bg-green-50",
  "🌙": "bg-indigo-50",
};

interface PostCardProps {
  post: PostWithAuthor;
  isLoggedIn?: boolean;
}

export function PostCard({ post }: PostCardProps) {
  const coverImage = post.imageUrls?.[0];
  const rotation = getRotation(post.id);
  const moodBg = post.moodEmoji ? (MOOD_COLORS[post.moodEmoji] ?? "bg-aqua-50") : "bg-aqua-50";

  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <div
        className="polaroid overflow-hidden transition-all duration-300 group-hover:shadow-polaroid-hover"
        style={{ transform: rotation }}
      >
        {/* Image area */}
        {coverImage ? (
          <div className="relative h-44 overflow-hidden mb-3">
            <Image
              src={coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        ) : (
          <div className={`h-32 ${moodBg} flex items-center justify-center mb-3 rounded-sm`}>
            <span className="text-4xl">{post.moodEmoji ?? "🌊"}</span>
          </div>
        )}

        {/* Polaroid caption area */}
        <div className="px-1 pb-1">
          {post.isDiaryLock && (
            <div className="flex items-center gap-1 text-xs text-aqua-500 mb-1">
              <Lock className="w-3 h-3" />
              <span className="font-body">members only</span>
            </div>
          )}

          <h3 className="font-heading text-lg text-navy group-hover:text-coral-500 transition-colors leading-snug line-clamp-2 mb-1">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="font-body text-xs text-navy-muted line-clamp-2 mb-2 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between">
            <p className="font-handwriting text-xs text-aqua-500">
              {formatDate(post.createdAt)}
            </p>
            {post.mood && (
              <span className="font-body text-xs text-navy-faint">{post.mood}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
