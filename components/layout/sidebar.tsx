import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateShort } from "@/lib/utils";
import { Clock, Shuffle, BookOpen } from "lucide-react";

async function getSidebarData() {
  const now = new Date();
  const lastYear = new Date(now);
  lastYear.setFullYear(lastYear.getFullYear() - 1);
  const lastYearStart = new Date(lastYear);
  lastYearStart.setHours(0, 0, 0, 0);
  const lastYearEnd = new Date(lastYear);
  lastYearEnd.setHours(23, 59, 59, 999);

  const [lastYearPost, count, recentPosts] = await Promise.all([
    prisma.post.findFirst({
      where: { published: true, isDiaryLock: false, createdAt: { gte: lastYearStart, lte: lastYearEnd } },
      select: { slug: true, title: true, createdAt: true },
    }),
    prisma.post.count({ where: { published: true, isDiaryLock: false } }),
    prisma.post.findMany({
      where: { published: true, isDiaryLock: false },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { slug: true, title: true, createdAt: true, moodEmoji: true },
    }),
  ]);

  const randomSkip = count > 1 ? Math.floor(Math.random() * count) : 0;
  const randomPost = await prisma.post.findFirst({
    where: { published: true, isDiaryLock: false },
    skip: randomSkip,
    select: { slug: true, title: true },
  });

  return { lastYearPost, randomPost, recentPosts };
}

function SidebarCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white/80 rounded-2xl border-2 border-dashed border-aqua-200 p-5 shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-aqua-400">{icon}</span>
        <h3 className="font-heading text-base text-navy">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export async function Sidebar() {
  const { lastYearPost, randomPost, recentPosts } = await getSidebarData();

  return (
    <aside className="space-y-5">
      {/* Recent posts */}
      <SidebarCard title="recent memories ✦" icon={<BookOpen className="w-4 h-4" />}>
        <ul className="space-y-2">
          {recentPosts.map((p) => (
            <li key={p.slug}>
              <Link href={`/posts/${p.slug}`} className="flex items-center gap-2 group">
                <span className="text-base">{p.moodEmoji ?? "🌊"}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-xs text-navy group-hover:text-coral-500 transition-colors truncate">{p.title}</p>
                  <p className="font-handwriting text-xs text-aqua-400">{formatDateShort(p.createdAt)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </SidebarCard>

      {/* Time capsule */}
      <SidebarCard title="time capsule ✦" icon={<Clock className="w-4 h-4" />}>
        <div className="space-y-3">
          {lastYearPost ? (
            <Link href={`/posts/${lastYearPost.slug}`} className="block p-3 rounded-xl bg-aqua-50 hover:bg-aqua-100 border border-aqua-200 transition-colors group">
              <p className="font-body text-xs text-aqua-500 mb-1">📅 this day last year</p>
              <p className="font-body text-xs font-semibold text-navy group-hover:text-coral-500 transition-colors line-clamp-2">{lastYearPost.title}</p>
              <p className="font-handwriting text-xs text-aqua-400 mt-1">{formatDateShort(lastYearPost.createdAt)}</p>
            </Link>
          ) : (
            <div className="p-3 rounded-xl bg-aqua-50 border border-aqua-200">
              <p className="font-body text-xs text-aqua-400">no memories from last year yet~</p>
            </div>
          )}

          {randomPost && (
            <Link href={`/posts/${randomPost.slug}`} className="flex items-center gap-2 p-3 rounded-xl bg-coral-50 hover:bg-coral-100 border border-coral-200 transition-colors group">
              <Shuffle className="w-3.5 h-3.5 text-coral-400 flex-shrink-0" />
              <div>
                <p className="font-body text-xs text-coral-400 mb-0.5">random memory</p>
                <p className="font-body text-xs font-semibold text-navy group-hover:text-coral-500 transition-colors line-clamp-2">{randomPost.title}</p>
              </div>
            </Link>
          )}
        </div>
      </SidebarCard>

      {/* Little quote */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-aqua-100 to-sky-pale border-2 border-dashed border-aqua-200">
        <p className="font-handwriting text-sm text-navy text-center leading-relaxed">
          "collect moments, not things" 🌊
        </p>
      </div>
    </aside>
  );
}
