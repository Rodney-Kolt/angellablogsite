import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { PostCard } from "@/components/blog/post-card";
import { Sidebar } from "@/components/layout/sidebar";
import { GameSection } from "@/components/game/game-section";

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
    <div className="container mx-auto px-4 py-8">
      {/* ── Hero header ── */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-hoop-orange/10 border border-hoop-orange/30 mb-3">
          <span className="w-2 h-2 rounded-full bg-hoop-neon animate-pulse" />
          <span className="font-body text-xs text-hoop-orange uppercase tracking-widest">
            kiro&apos;s digital court
          </span>
        </div>
        <h1 className="font-heading text-5xl md:text-7xl text-white leading-none tracking-widest">
          KIRO{" "}
          <span
            className="text-hoop-orange"
            style={{ textShadow: "0 0 24px rgba(255,87,34,0.5)" }}
          >
            DAILY
          </span>
        </h1>
        <p className="font-body text-slate-400 text-sm mt-2 max-w-sm">
          shoot hoops · read thoughts · stay on the court 🏀
        </p>
      </div>

      {/* ── Main layout: game + sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 mb-10">
        {/* Game */}
        <GameSection />

        {/* Sidebar */}
        <Sidebar />
      </div>

      {/* ── Blog posts ── */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <h2 className="font-heading text-2xl text-white tracking-widest">
            LATEST ENTRIES
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-hoop-orange/50 to-transparent" />
          <span className="font-body text-xs text-slate-500 uppercase tracking-wider">
            {posts.length} posts
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4 bounce-ball inline-block">🏀</div>
            <p className="font-heading text-xl text-slate-500 tracking-widest">
              NO POSTS YET
            </p>
            <p className="font-body text-sm text-slate-700 mt-1">
              check back soon for new entries
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
