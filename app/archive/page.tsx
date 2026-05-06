import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { Lock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "archive" };
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
      id: true, title: true, slug: true,
      moodEmoji: true, isDiaryLock: true, createdAt: true,
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
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">📋</span>
        <h1 className="font-heading text-4xl text-white tracking-widest">
          ARCHIVE
        </h1>
      </div>
      <p className="font-body text-xs text-slate-600 mb-8 uppercase tracking-wider">
        {posts.length} entries on the board
      </p>

      {/* Court line */}
      <div className="h-px bg-gradient-to-r from-hoop-orange via-hoop-orange/50 to-transparent mb-8" />

      {Object.entries(grouped).length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 bounce-ball inline-block">🏀</div>
          <p className="font-heading text-2xl text-slate-600 tracking-widest">
            NOTHING HERE YET
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([month, monthPosts]) => (
            <div key={month}>
              <h2 className="font-heading text-lg text-hoop-orange mb-4 flex items-center gap-2 tracking-widest">
                <span className="w-2 h-2 bg-hoop-orange inline-block" />
                {month.toUpperCase()}
              </h2>
              <div className="space-y-1 pl-4 border-l-2 border-slate-800">
                {monthPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    className="flex items-center gap-3 p-3 rounded-sm hover:bg-slate-800/50 transition-colors group"
                  >
                    <span className="text-lg flex-shrink-0">
                      {post.moodEmoji ?? "🏀"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="font-body text-sm font-medium text-slate-400 group-hover:text-hoop-orange transition-colors">
                        {post.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {post.isDiaryLock && (
                        <Lock className="w-3 h-3 text-hoop-neon" />
                      )}
                      <span className="font-body text-xs text-slate-700">
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
