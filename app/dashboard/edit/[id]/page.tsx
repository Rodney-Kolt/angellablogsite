import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { PostForm } from "@/components/blog/post-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps { params: { id: string } }
export const metadata: Metadata = { title: "Edit memory ✦" };

export default async function EditPostPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { isOwner: true } });
  if (!user?.isOwner) redirect("/");
  const post = await prisma.post.findUnique({ where: { id: params.id, authorId: session.user.id } });
  if (!post) notFound();

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 font-body text-sm text-navy-muted hover:text-coral-400 transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        back to dashboard
      </Link>
      <div className="bg-white/80 rounded-2xl border-2 border-dashed border-aqua-200 shadow-polaroid p-8">
        <h1 className="font-heading text-3xl text-navy mb-2">edit memory ✦</h1>
        <p className="font-body text-sm text-navy-muted mb-8">make it even better 🌊</p>
        <PostForm post={post} />
      </div>
    </div>
  );
}
