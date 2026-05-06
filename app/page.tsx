import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { PostCard } from "@/components/blog/post-card";
import { Sidebar } from "@/components/layout/sidebar";
import { Sparkles } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...(isLoggedIn ? {} : { isDiaryLock: false }),
    },
    include: {
      author: { select: { name: true, image: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-pink-200 shadow-girly mb-4">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span className="font-body text-sm text-pink-500">
            welcome to my little corner ✨
          </span>
        </div>
        <h1 className="font-heading text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-400 bg-clip-text text-transparent mb-4">
          kiro daily
        </h1>
        <p className="font-body text-pink-500 text-lg max-w-md mx-auto">
          a dreamy digital scrapbook — daily thoughts, tiny joys, and soft
          moments 🌸
        </p>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        {/* Posts grid */}
        <div>
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 float">🌸</div>
              <p className="font-heading text-2xl text-pink-400 mb-2">
                no posts yet~
              </p>
              <p className="font-body text-pink-300">
                check back soon for new entries ✨
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} isLoggedIn={isLoggedIn} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <Sidebar />
      </div>
    </div>
  );
}
