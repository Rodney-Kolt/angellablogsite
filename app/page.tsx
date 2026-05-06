import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { PostCard } from "@/components/blog/post-card";
import { Sidebar } from "@/components/layout/sidebar";
import { BasketballHero } from "@/components/3d/basketball-hero";

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
      {/* ── Hero ── */}
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 mb-16 py-8">
        {/* Court line accent top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hoop-orange to-transparent opacity-40" />

        {/* Text side */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-hoop-orange/10 border border-hoop-orange/30 mb-4">
            <span className="w-2 h-2 rounded-full bg-hoop-neon animate-pulse" />
            <span className="font-body text-xs text-hoop-orange uppercase tracking-widest">
              on the court
            </span>
          </div>

          <h1 className="font-heading text-6xl md:text-8xl text-white leading-none mb-3 tracking-widest">
            KIRO{" "}
            <span className="text-hoop-orange" style={{ textShadow: "0 0 30px rgba(249,115,22,0.5)" }}>
              DAILY
            </span>
          </h1>

          <p className="font-body text-slate-400 text-base md:text-lg max-w-md mb-6 leading-relaxed">
            a basketball player&apos;s personal digital court — raw thoughts,
            game recaps, and daily grind 🏀
          </p>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-slate-800 border border-slate-700">
              <span className="text-hoop-neon text-xs font-body font-semibold uppercase tracking-wider">
                #hoopsthoughts
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-slate-800 border border-slate-700">
              <span className="text-hoop-orange text-xs font-body font-semibold uppercase tracking-wider">
                #gamerecap
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-slate-800 border border-slate-700">
              <span className="text-slate-400 text-xs font-body font-semibold uppercase tracking-wider">
                #training
              </span>
            </div>
          </div>
        </div>

        {/* 3D Ball side */}
        <div className="flex-shrink-0">
          <BasketballHero />
        </div>

        {/* Court line accent bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hoop-orange to-transparent opacity-40" />
      </div>

      {/* ── Posts + Sidebar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        {/* Posts grid */}
        <div>
          {/* Section header */}
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-heading text-2xl text-white tracking-widest">
              LATEST ENTRIES
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-hoop-orange/50 to-transparent" />
            <span className="font-body text-xs text-slate-500 uppercase tracking-wider">
              {posts.length} posts
            </span>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 bounce-ball inline-block">🏀</div>
              <p className="font-heading text-2xl text-slate-500 mb-2 tracking-widest">
                NO POSTS YET
              </p>
              <p className="font-body text-slate-600">
                check back soon for new entries
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
