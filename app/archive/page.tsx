import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Lock, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "archive",
};

export const revalidate = 60;

export default async function ArchivePage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...(isLoggedIn ? {} : { isDiaryLock: false }),
    },
    select: {
      id: true,
      title: true,
      slug: true,
      moodEmoji: true,
      isDiaryLock: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Group by year/month
  const grouped: Record<string, typeof posts> = {};
  for (const post of posts) {
    const key = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
    }).format(new Date(post.createdAt));
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(post);
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="w-6 h-6 text-pink-400" />
        <h1 className="font-heading text-4xl font-bold text-pink-800">
          archive 📚
        </h1>
      </div>
      <p className="font-body text-pink-400 mb-10">
        all {posts.length} entries, sorted by date ✨
      </p>

      {Object.entries(grouped).length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 float">📖</div>
          <p className="font-heading text-2xl text-pink-400">
            nothing here yet~
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([month, monthPosts]) => (
            <div key={month}>
              <h2 className="font-heading text-xl text-pink-600 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-400 inline-block" />
                {month}
              </h2>
              <div className="space-y-2 pl-4 border-l-2 border-pink-100">
                {monthPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/60 transition-colors group"
                  >
                    <span className="text-lg flex-shrink-0">
                      {post.moodEmoji ?? "🌸"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="font-body text-sm font-medium text-pink-700 group-hover:text-pink-500 transition-colors">
                        {post.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {post.isDiaryLock && (
                        <Lock className="w-3 h-3 text-purple-400" />
                      )}
                      <span className="font-body text-xs text-pink-300">
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                        }).format(new Date(post.createdAt))}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
