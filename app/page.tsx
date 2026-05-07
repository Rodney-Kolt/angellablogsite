import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { PostCard } from "@/components/blog/post-card";
import { Sidebar } from "@/components/layout/sidebar";
import { Waves } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  const posts = await prisma.post.findMany({
    where: {
      published: true,
      ...(isLoggedIn ? {} : { isDiaryLock: false }),
    },
    include: { author: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border-2 border-dashed border-aqua-300 mb-5">
          <Waves className="w-4 h-4 text-aqua-400" />
          <span className="font-body text-sm text-navy-muted">welcome to my little corner 🌊</span>
        </div>
        <h1 className="font-heading text-6xl md:text-7xl text-navy mb-3">
          Coastal Journal
        </h1>
        <p className="font-body text-navy-muted text-base max-w-sm mx-auto leading-relaxed">
          a personal scrapbook of memories, thoughts, and little joys by the sea ✦
        </p>
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-aqua-300" />
          <span className="text-coral-400 text-sm">✦</span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-aqua-300" />
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
        {/* Posts */}
        <div>
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 animate-float">🌊</div>
              <p className="font-heading text-2xl text-aqua-400 mb-2">no memories yet~</p>
              <p className="font-body text-navy-muted text-sm">check back soon for new entries ✦</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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
