import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, formatDate } from "@/lib/utils";
import { ProfileForm } from "@/components/profile/profile-form";
import { MessageCircle, Heart, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "profile",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: {
        select: { comments: true, reactions: true },
      },
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="font-heading text-4xl font-bold text-pink-800 mb-8">
        my profile 🌸
      </h1>

      {/* Profile card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-pink-100 shadow-girly p-8 mb-6">
        <div className="flex items-start gap-6 mb-8">
          <Avatar className="w-20 h-20 ring-4 ring-pink-200">
            <AvatarImage src={user.image ?? ""} />
            <AvatarFallback className="text-2xl">
              {getInitials(user.name ?? user.email)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-heading text-2xl text-pink-800">
              {user.name ?? "anonymous reader"}
            </h2>
            <p className="font-body text-sm text-pink-400">{user.email}</p>
            {user.bio && (
              <p className="font-body text-sm text-pink-600 mt-2">{user.bio}</p>
            )}
            <p className="font-body text-xs text-pink-300 mt-2">
              reader since {formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-3 rounded-2xl bg-pink-50">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Heart className="w-4 h-4 text-pink-400" />
            </div>
            <p className="font-heading text-2xl text-pink-700">
              {user._count.reactions}
            </p>
            <p className="font-body text-xs text-pink-400">reactions</p>
          </div>
          <div className="text-center p-3 rounded-2xl bg-purple-50">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MessageCircle className="w-4 h-4 text-purple-400" />
            </div>
            <p className="font-heading text-2xl text-purple-700">
              {user._count.comments}
            </p>
            <p className="font-body text-xs text-purple-400">notes left</p>
          </div>
          <div className="text-center p-3 rounded-2xl bg-blue-50">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BookOpen className="w-4 h-4 text-blue-400" />
            </div>
            <p className="font-heading text-2xl text-blue-700">✨</p>
            <p className="font-body text-xs text-blue-400">reader</p>
          </div>
        </div>

        {/* Edit form */}
        <ProfileForm user={{ name: user.name, bio: user.bio }} />
      </div>
    </div>
  );
}
