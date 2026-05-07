import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const metadata: Metadata = { title: "Dashboard · Blackie" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isOwner: true },
  });
  if (!user?.isOwner) redirect("/");

  const [posts, totalComments] = await Promise.all([
    prisma.post.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { reactions: true, comments: true } } },
    }),
    prisma.comment.count(),
  ]);

  const serialized = posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    published: p.published,
    isDiaryLock: p.isDiaryLock,
    moodEmoji: p.moodEmoji,
    createdAt: p.createdAt.toISOString(),
    reactions: p._count.reactions,
    comments: p._count.comments,
  }));

  return (
    <DashboardClient
      initialPosts={serialized}
      totalComments={totalComments}
    />
  );
}
