import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, formatDate } from "@/lib/utils";
import { ProfileForm } from "@/components/profile/profile-form";
import { MessageCircle, Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { _count: { select: { comments: true, reactions: true } } },
  });
  if (!user) redirect("/login");

  return (
    <div className="container mx-auto px-4 py-12 max-w-xl">
      <h1 className="font-serif text-3xl font-semibold text-ink mb-8">My profile</h1>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-8 mb-6">
        <div className="flex items-start gap-5 mb-8">
          <Avatar className="w-16 h-16 ring-2 ring-blue-100">
            <AvatarImage src={user.image ?? ""} />
            <AvatarFallback className="text-xl">{getInitials(user.name ?? user.email)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-serif text-xl font-semibold text-ink">{user.name ?? "Anonymous"}</h2>
            <p className="text-sm text-slate-400">{user.email}</p>
            {user.bio && <p className="text-sm text-slate-500 mt-2 leading-relaxed">{user.bio}</p>}
            <p className="text-xs text-slate-400 mt-2">Member since {formatDate(user.createdAt)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="text-center p-4 rounded-xl bg-blue-50 border border-blue-100">
            <Heart className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <p className="font-semibold text-ink text-xl">{user._count.reactions}</p>
            <p className="text-xs text-slate-500">Reactions</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-blue-50 border border-blue-100">
            <MessageCircle className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <p className="font-semibold text-ink text-xl">{user._count.comments}</p>
            <p className="text-xs text-slate-500">Comments</p>
          </div>
        </div>

        <ProfileForm user={{ name: user.name, bio: user.bio }} />
      </div>
    </div>
  );
}
