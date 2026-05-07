import Link from "next/link";
import { Post, User } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import { Lock } from "lucide-react";

type PostWithAuthor = Post & { author: Pick<User, "name" | "image"> };

interface PostCardProps {
  post: PostWithAuthor;
  isLoggedIn?: boolean;
}

export function PostCard({ post }: PostCardProps) {
  const coverImage = post.imageUrls?.[0];

  return (
    <Link href={`/posts/${post.slug}`} className="group block">
      <article className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 h-full flex flex-col">
        {coverImage && (
          <div className="relative h-44 overflow-hidden flex-shrink-0">
            <img
              src={coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          </div>
        )}

        <div className="p-5 flex flex-col flex-1">
          {/* Tags */}
          {post.isDiaryLock && (
            <div className="flex items-center gap-1 text-xs text-blue-500 mb-2">
              <Lock className="w-3 h-3" />
              <span>Members only</span>
            </div>
          )}

          <h3 className="font-serif text-lg font-semibold text-ink group-hover:text-blue-700 transition-colors mb-2 leading-snug line-clamp-2">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4 flex-1">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-400 mt-auto pt-3 border-t border-slate-100">
            <span>{post.author.name ?? "Author"}</span>
            <span>·</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
