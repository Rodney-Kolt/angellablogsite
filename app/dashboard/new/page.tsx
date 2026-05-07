import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PostForm } from "@/components/blog/post-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "New post" };

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { isOwner: true } });
  if (!user?.isOwner) redirect("/");

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-600 transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Dashboard
      </Link>
      <PostForm />
    </div>
  );
}
