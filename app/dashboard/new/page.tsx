import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PostForm } from "@/components/blog/post-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New memory ✦" };

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { isOwner: true } });
  if (!user?.isOwner) redirect("/");

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 font-body text-sm text-navy-muted hover:text-coral-400 transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        back to dashboard
      </Link>
      <div className="bg-white/80 rounded-2xl border-2 border-dashed border-aqua-200 shadow-polaroid p-8">
        <h1 className="font-heading text-3xl text-navy mb-2">new memory ✦</h1>
        <p className="font-body text-sm text-navy-muted mb-8">what do you want to remember today? 🌊</p>
        <PostForm />
      </div>
    </div>
  );
}
