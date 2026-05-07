import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { Lock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Archive" };
export const revalidate = 60;

export default async function ArchivePage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  const posts = await prisma.post.findMany({
    where: { published: true, ...(isLoggedIn ? {} : { isDiaryLock: false }) },
    select: { id: true, title: true, slug: true, isDiaryLock: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const grouped: Record<string, typeof posts> = {};
  for (const post of posts) {
    const key = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long" }).format(new Date(post.createdAt));
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(post);
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="font-serif text-4xl font-semibold text-ink mb-2">Archive</h1>
      <p className="text-slate-500 text-sm mb-10">{posts.length} posts</p>

      {Object.entries(grouped).length === 0 ? (
        <p className="text-slate-400 text-center py-16">Nothing here yet.</p>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([month, monthPosts]) => (
            <div key={month}>
              <h2 className="font-serif text-lg text-blue-600 mb-4">{month}</h2>
              <div className="space-y-1 border-l-2 border-slate-200 pl-5">
                {monthPosts.map((post) => (
                  <Link key={post.id} href={`/posts/${post.slug}`}
                    className="flex items-center gap-2 py-2 group">
                    <span className="flex-1 text-sm text-slate-700 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </span>
                    {post.isDiaryLock && <Lock className="w-3 h-3 text-blue-400 flex-shrink-0" />}
                    <span className="text-xs text-slate-400 flex-shrink-0">
                      {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(post.createdAt))}
                    </span>
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
