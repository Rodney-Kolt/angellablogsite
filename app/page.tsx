import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { PostCard } from "@/components/blog/post-card";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

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

  const [featured, ...rest] = posts;

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero */}
      <div className="text-center mb-14">
        <h1 className="font-serif text-5xl md:text-6xl font-semibold text-ink mb-4 leading-tight">
          Bako
        </h1>
        <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
          A place for thoughts worth keeping.
        </p>
        <div className="mt-6 h-px w-16 bg-blue-300 mx-auto" />
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-serif text-2xl text-slate-400 mb-2">Nothing here yet.</p>
          <p className="text-slate-400 text-sm">Check back soon for new stories.</p>
        </div>
      ) : (
        <>
          {/* Featured post */}
          {featured && (
            <div className="mb-12">
              <Link href={`/posts/${featured.slug}`} className="group block">
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-200">
                  {featured.imageUrls?.[0] && (
                    <div className="relative h-64 md:h-80 overflow-hidden">
                      <img
                        src={featured.imageUrls[0]}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">Featured</span>
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold text-ink mb-3 group-hover:text-blue-700 transition-colors leading-snug">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-slate-500 text-base leading-relaxed mb-4 line-clamp-2">
                        {featured.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span>{featured.author.name ?? "Author"}</span>
                      <span>·</span>
                      <span>{formatDate(featured.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Post grid */}
          {rest.length > 0 && (
            <>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="font-serif text-xl text-ink">More stories</h2>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((post) => (
                  <PostCard key={post.id} post={post} isLoggedIn={isLoggedIn} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
