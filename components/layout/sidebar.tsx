import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { playlist } from "@/lib/playlist";
import { formatDateShort } from "@/lib/utils";
import { Clock, Shuffle, Radio, Trophy } from "lucide-react";
import { MusicSection } from "@/components/music/music-section";

async function getTimeCapsuleData() {
  const now = new Date();
  const lastYear = new Date(now);
  lastYear.setFullYear(lastYear.getFullYear() - 1);
  const lastYearStart = new Date(lastYear);
  lastYearStart.setHours(0, 0, 0, 0);
  const lastYearEnd = new Date(lastYear);
  lastYearEnd.setHours(23, 59, 59, 999);

  const lastYearPost = await prisma.post.findFirst({
    where: { published: true, isDiaryLock: false, createdAt: { gte: lastYearStart, lte: lastYearEnd } },
    select: { slug: true, title: true, createdAt: true },
  });

  const count = await prisma.post.count({ where: { published: true, isDiaryLock: false } });
  const randomSkip = count > 1 ? Math.floor(Math.random() * count) : 0;
  const randomPost = await prisma.post.findFirst({
    where: { published: true, isDiaryLock: false },
    skip: randomSkip,
    select: { slug: true, title: true, createdAt: true },
  });

  // Latest bako moment
  const latestMoment = await prisma.bakoMoment.findFirst({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, momentType: true },
  });

  return { lastYearPost, randomPost, latestMoment };
}

function SidebarSection({
  title,
  icon,
  href,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-sm border border-slate-800 bg-[#1e293b] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/50">
        <span className="text-hoop-orange">{icon}</span>
        {href ? (
          <Link href={href} className="font-heading text-sm tracking-widest text-white hover:text-hoop-orange transition-colors">
            {title}
          </Link>
        ) : (
          <h3 className="font-heading text-sm tracking-widest text-white">{title}</h3>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

const MOMENT_ICONS: Record<string, string> = {
  GAME_WINNER: "🏆",
  FUNNY_MISS: "🤣",
  TRAINING_PR: "💪",
  CROWD_REACTION: "🎉",
};

export async function Sidebar() {
  const { lastYearPost, randomPost, latestMoment } = await getTimeCapsuleData();

  return (
    <aside className="space-y-5">
      {/* Courtside Mixtape */}
      <SidebarSection title="COURTSIDE MIXTAPE" icon={<Radio className="w-4 h-4" />} href="/music">
        <MusicSection songs={playlist} compact />
      </SidebarSection>

      {/* Bako Moments teaser */}
      {latestMoment && (
        <SidebarSection title="BAKO MOMENTS" icon={<Trophy className="w-4 h-4" />} href="/bako-moments">
          <Link
            href="/bako-moments"
            className="flex items-center gap-2 p-2 rounded-sm hover:bg-slate-800 transition-colors group"
          >
            <span className="text-xl">{MOMENT_ICONS[latestMoment.momentType] ?? "🏀"}</span>
            <div className="flex-1 min-w-0">
              <p className="font-body text-xs font-semibold text-slate-300 truncate group-hover:text-hoop-orange transition-colors">
                {latestMoment.title}
              </p>
              <p className="font-body text-xs text-slate-600">latest moment →</p>
            </div>
          </Link>
        </SidebarSection>
      )}

      {/* Time Capsule */}
      <SidebarSection title="TIME CAPSULE" icon={<Clock className="w-4 h-4" />}>
        <div className="space-y-3">
          {lastYearPost ? (
            <Link
              href={`/posts/${lastYearPost.slug}`}
              className="block p-3 rounded-sm bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-hoop-orange/40 transition-all group"
            >
              <p className="text-xs font-body text-hoop-orange mb-1 uppercase tracking-wider">
                📅 this day last year
              </p>
              <p className="text-xs font-body font-semibold text-slate-300 group-hover:text-white line-clamp-2 transition-colors">
                {lastYearPost.title}
              </p>
              <p className="text-xs font-body text-slate-600 mt-1">
                {formatDateShort(lastYearPost.createdAt)}
              </p>
            </Link>
          ) : (
            <div className="p-3 rounded-sm bg-slate-900 border border-slate-800">
              <p className="text-xs font-body text-slate-600">no posts from last year yet</p>
            </div>
          )}

          {randomPost && (
            <Link
              href={`/posts/${randomPost.slug}`}
              className="flex items-center gap-2 p-3 rounded-sm bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-hoop-neon/40 transition-all group"
            >
              <Shuffle className="w-3.5 h-3.5 text-hoop-neon flex-shrink-0" />
              <div>
                <p className="text-xs font-body text-hoop-neon mb-0.5 uppercase tracking-wider">random play</p>
                <p className="text-xs font-body font-semibold text-slate-300 group-hover:text-white line-clamp-2 transition-colors">
                  {randomPost.title}
                </p>
              </div>
            </Link>
          )}
        </div>
      </SidebarSection>

      {/* Court quote */}
      <div className="p-4 rounded-sm border border-hoop-orange/20 bg-hoop-orange/5">
        <p className="font-heading text-sm text-hoop-orange text-center leading-relaxed tracking-wider">
          "HARD WORK BEATS TALENT WHEN TALENT DOESN'T WORK HARD"
        </p>
        <p className="font-body text-xs text-slate-600 text-center mt-2">— Tim Notke</p>
      </div>
    </aside>
  );
}
