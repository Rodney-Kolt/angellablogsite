import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { CourtWrapper } from "@/components/3d/court-wrapper";
import { PostCard } from "@/components/blog/post-card";
import { Sidebar } from "@/components/layout/sidebar";

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

  // Serialize dates for client components
  const serializedPosts = posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    moodEmoji: p.moodEmoji,
    createdAt: p.createdAt.toISOString(),
    isDiaryLock: p.isDiaryLock,
  }));

  // 2D fallback (shown if WebGL fails or during SSR)
  const fallback2D = (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-hoop-orange/10 border border-hoop-orange/30 mb-4">
          <span className="w-2 h-2 rounded-full bg-hoop-neon animate-pulse" />
          <span className="font-body text-xs text-hoop-orange uppercase tracking-widest">
            on the court
          </span>
        </div>
        <h1 className="font-heading text-6xl md:text-8xl text-white leading-none mb-3 tracking-widest">
          KIRO{" "}
          <span className="text-hoop-orange" style={{ textShadow: "0 0 30px rgba(255,87,34,0.5)" }}>
            DAILY
          </span>
        </h1>
        <p className="font-body text-slate-400 text-base md:text-lg max-w-md mx-auto mb-6 leading-relaxed">
          a basketball player&apos;s personal digital court 🏀
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-heading text-2xl text-white tracking-widest">LATEST ENTRIES</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-hoop-orange/50 to-transparent" />
          </div>
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 bounce-ball inline-block">🏀</div>
              <p className="font-heading text-2xl text-slate-500 tracking-widest">NO POSTS YET</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} isLoggedIn={isLoggedIn} />
              ))}
            </div>
          )}
        </div>
        <Sidebar />
      </div>
    </div>
  );

  return (
    <>
      {/* Full 3D court — takes full viewport height */}
      <CourtWrapper posts={serializedPosts} fallback={fallback2D} />

      {/* 2D blog content below the 3D scene */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-heading text-2xl text-white tracking-widest">ALL ENTRIES</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-hoop-orange/50 to-transparent" />
          <span className="font-body text-xs text-slate-500 uppercase tracking-wider">
            {posts.length} posts
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} isLoggedIn={isLoggedIn} />
            ))}
          </div>
          <Sidebar />
        </div>
      </div>
    </>
  );
}
