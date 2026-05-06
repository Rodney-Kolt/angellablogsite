import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { playlist } from "@/lib/playlist";
import { formatDateShort } from "@/lib/utils";
import { Music2, Clock, Shuffle, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getTimeCapsuleData() {
  const now = new Date();

  // Last year same day
  const lastYear = new Date(now);
  lastYear.setFullYear(lastYear.getFullYear() - 1);
  const lastYearStart = new Date(lastYear);
  lastYearStart.setHours(0, 0, 0, 0);
  const lastYearEnd = new Date(lastYear);
  lastYearEnd.setHours(23, 59, 59, 999);

  const lastYearPost = await prisma.post.findFirst({
    where: {
      published: true,
      isDiaryLock: false,
      createdAt: { gte: lastYearStart, lte: lastYearEnd },
    },
    select: { slug: true, title: true, createdAt: true },
  });

  // Random post
  const count = await prisma.post.count({
    where: { published: true, isDiaryLock: false },
  });
  const randomSkip = count > 1 ? Math.floor(Math.random() * count) : 0;
  const randomPost = await prisma.post.findFirst({
    where: { published: true, isDiaryLock: false },
    skip: randomSkip,
    select: { slug: true, title: true, createdAt: true },
  });

  return { lastYearPost, randomPost };
}

export async function Sidebar() {
  const { lastYearPost, randomPost } = await getTimeCapsuleData();

  return (
    <aside className="space-y-6">
      {/* On Repeat Playlist */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-r from-pink-50 to-purple-50">
          <CardTitle className="flex items-center gap-2 text-base">
            <Music2 className="w-4 h-4 text-pink-500" />
            on repeat 🎵
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <ul className="space-y-2">
            {playlist.map((song, i) => (
              <li key={i}>
                <a
                  href={song.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group p-2 rounded-xl hover:bg-pink-50 transition-colors"
                >
                  <span className="text-base">{song.emoji ?? "🎵"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-body font-semibold text-pink-800 truncate group-hover:text-pink-600">
                      {song.title}
                    </p>
                    <p className="text-xs font-body text-pink-400 truncate">
                      {song.artist}
                    </p>
                  </div>
                  <ExternalLink className="w-3 h-3 text-pink-300 group-hover:text-pink-500 flex-shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Time Capsule */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-r from-lavender-50 to-blue-50">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="w-4 h-4 text-purple-500" />
            time capsule ✨
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 space-y-3">
          {lastYearPost ? (
            <Link
              href={`/posts/${lastYearPost.slug}`}
              className="block p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors group"
            >
              <p className="text-xs font-body text-purple-400 mb-1">
                📅 on this day last year
              </p>
              <p className="text-xs font-body font-semibold text-purple-700 group-hover:text-purple-900 line-clamp-2">
                {lastYearPost.title}
              </p>
              <p className="text-xs font-body text-purple-400 mt-1">
                {formatDateShort(lastYearPost.createdAt)}
              </p>
            </Link>
          ) : (
            <div className="p-3 rounded-xl bg-purple-50">
              <p className="text-xs font-body text-purple-400">
                📅 no posts from last year yet~
              </p>
            </div>
          )}

          {randomPost && (
            <Link
              href={`/posts/${randomPost.slug}`}
              className="flex items-center gap-2 p-3 rounded-xl bg-pink-50 hover:bg-pink-100 transition-colors group"
            >
              <Shuffle className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-body text-pink-400 mb-0.5">
                  random cozy post
                </p>
                <p className="text-xs font-body font-semibold text-pink-700 group-hover:text-pink-900 line-clamp-2">
                  {randomPost.title}
                </p>
              </div>
            </Link>
          )}
        </CardContent>
      </Card>

      {/* Little note */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-pink-50 to-lavender-50 border border-pink-100">
        <p className="font-handwriting text-sm text-pink-500 text-center leading-relaxed">
          "every day is a little story worth telling" 🌸
        </p>
      </div>
    </aside>
  );
}
