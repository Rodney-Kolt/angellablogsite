import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PostForm } from "@/components/blog/post-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "new post",
};

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isOwner: true },
  });

  if (!user?.isOwner) redirect("/");

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 font-body text-sm text-pink-400 hover:text-pink-600 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        back to dashboard
      </Link>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-pink-100 shadow-girly p-8">
        <h1 className="font-heading text-3xl font-bold text-pink-800 mb-2">
          new entry ✨
        </h1>
        <p className="font-body text-sm text-pink-400 mb-8">
          what's on your mind today? 🌸
        </p>
        <PostForm />
      </div>
    </div>
  );
}
