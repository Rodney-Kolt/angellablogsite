import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BakoForm } from "@/components/bako/bako-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add Bako Moment" };

export default async function NewBakoMomentPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isOwner: true },
  });
  if (!user?.isOwner) redirect("/bako-moments");

  // Fetch posts for the related post dropdown
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <Link
        href="/bako-moments"
        className="inline-flex items-center gap-1.5 font-body text-xs text-slate-500 hover:text-hoop-orange transition-colors mb-8 group uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Moments
      </Link>

      <div className="bg-[#1e293b] rounded-sm border border-slate-800 p-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🏆</span>
          <h1 className="font-heading text-3xl text-white tracking-widest">
            ADD MOMENT
          </h1>
        </div>
        <p className="font-body text-xs text-slate-600 mb-8 uppercase tracking-wider">
          log a basketball highlight
        </p>
        <BakoForm posts={posts} />
      </div>
    </div>
  );
}
