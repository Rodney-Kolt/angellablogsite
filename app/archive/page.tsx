import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { Lock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Archive ✦" };
export const revalidate = 60;

export default async function ArchivePage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  const posts = await prisma.post.findMany({
    where: { published: true, ...(isLoggedIn ? {} : { isDiaryLock: false }) },
    select: { id: true, title: true, slug: true, isDiaryLock: true, createdAt: true, moodEmoji: true },
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
      <h1 className="font-heading text-4xl text-navy mb-2">memory archive ✦</h1>
      <p className="font-body text-sm text-navy-muted mb-10">{posts.length} memories collected 🌊</p>

      {Object.entries(grouped).length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4 animate-float">🌊</div>
          <p className="font-heading text-xl text-aqua-400">nothing here yet~</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([month, monthPosts]) => (
            <div key={month}>
              <h2 className="font-heading text-xl text-coral-400 mb-4">{month}</h2>
              <div className="space-y-1 border-l-2 border-dashed border-aqua-300 pl-5">
                {monthPosts.map((post) => (
                  <Link key={post.id} href={`/posts/${post.slug}`} className="flex items-center gap-2 py-2 group">
                    <span className="text-base">{post.moodEmoji ?? "🌊"}</span>
                    <span className="flex-1 font-body text-sm text-navy group-hover:text-coral-500 transition-colors">{post.title}</span>
                    {post.isDiaryLock && <Lock className="w-3 h-3 text-aqua-400 flex-shrink-0" />}
                    <span className="font-handwriting text-xs text-navy-faint flex-shrink-0">
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
