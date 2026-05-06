import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 10; // cache for 10 seconds

export async function GET() {
  try {
    const [totalPosts, totalReactions, latestPost] = await Promise.all([
      prisma.post.count({ where: { published: true } }),
      prisma.reaction.count(),
      prisma.post.findFirst({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        select: { title: true, createdAt: true },
      }),
    ]);

    // Streak: consecutive days with posts (simplified: posts in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentPosts = await prisma.post.count({
      where: { published: true, createdAt: { gte: sevenDaysAgo } },
    });

    return NextResponse.json({
      totalPosts,
      totalReactions,
      streak: recentPosts,
      latestTitle: latestPost?.title ?? "KIRO COURT",
    });
  } catch {
    return NextResponse.json({
      totalPosts: 0,
      totalReactions: 0,
      streak: 0,
      latestTitle: "KIRO COURT",
    });
  }
}
