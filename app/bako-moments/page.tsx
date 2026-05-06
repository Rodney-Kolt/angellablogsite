import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { BakoGrid } from "@/components/bako/bako-grid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Trophy } from "lucide-react";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";

export const metadata: Metadata = {
  title: "Bako Moments",
  description: "Personal basketball highlights and memorable court moments",
};

export const revalidate = 60;

// Derive the exact type that includes the relatedPost relation
export type BakoMomentWithPost = Prisma.BakoMomentGetPayload<{
  include: { relatedPost: { select: { title: true; slug: true } } };
}>;

export default async function BakoMomentsPage() {
  const session = await auth();
  const isOwner = (session?.user as { isOwner?: boolean })?.isOwner;

  let moments: BakoMomentWithPost[] = [];
  try {
    moments = await prisma.bakoMoment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        relatedPost: { select: { title: true, slug: true } },
      },
    });
  } catch {
    // Table not yet migrated — silently skip
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Trophy className="w-7 h-7 text-hoop-orange" />
          <h1 className="font-heading text-4xl text-white tracking-widest">
            BAKO MOMENTS
          </h1>
        </div>
        {isOwner && (
          <Button asChild size="sm">
            <Link href="/bako-moments/new">
              <Plus className="w-4 h-4" />
              Add Moment
            </Link>
          </Button>
        )}
      </div>
      <p className="font-body text-xs text-slate-600 mb-8 uppercase tracking-wider">
        personal highlights · game wins · court memories
      </p>

      {/* Court line */}
      <div className="h-px bg-gradient-to-r from-hoop-orange via-hoop-orange/50 to-transparent mb-8" />

      {moments.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4 bounce-ball inline-block">🏆</div>
          <p className="font-heading text-2xl text-slate-600 tracking-widest mb-2">
            NO MOMENTS YET
          </p>
          <p className="font-body text-sm text-slate-700 mb-6">
            start logging your basketball highlights
          </p>
          {isOwner && (
            <Button asChild>
              <Link href="/bako-moments/new">
                <Plus className="w-4 h-4" />
                Add First Moment
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <BakoGrid moments={moments} isOwner={!!isOwner} />
      )}
    </div>
  );
}
