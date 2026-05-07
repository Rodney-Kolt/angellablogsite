import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, formatDate } from "@/lib/utils";
import { ProfileForm } from "@/components/profile/profile-form";
import { MessageCircle, Heart, Waves } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Profile ✦" };

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
      <h1 className="font-heading text-4xl text-navy mb-8">my profile ✦</h1>

      <div className="bg-white/80 rounded-2xl border-2 border-dashed border-aqua-200 shadow-polaroid p-8 mb-6">
        <div className="flex items-start gap-5 mb-8">
          <Avatar className="w-16 h-16 ring-2 ring-aqua-200">
            <AvatarImage src={user.image ?? ""} />
            <AvatarFallback className="text-xl">{getInitials(user.name ?? user.email)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-heading text-xl text-navy">{user.name ?? "anonymous"}</h2>
            <p className="font-body text-sm text-navy-muted">{user.email}</p>
            {user.bio && <p className="font-body text-sm text-navy-muted mt-2 leading-relaxed">{user.bio}</p>}
            <p className="font-handwriting text-xs text-aqua-400 mt-2">here since {formatDate(user.createdAt)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="text-center p-4 rounded-2xl bg-aqua-50 border-2 border-dashed border-aqua-200">
            <Heart className="w-4 h-4 text-coral-400 mx-auto mb-1" />
            <p className="font-heading text-2xl text-navy">{user._count.reactions}</p>
            <p className="font-body text-xs text-navy-muted">reactions</p>
          </div>
          <div className="text-center p-4 rounded-2xl bg-aqua-50 border-2 border-dashed border-aqua-200">
            <MessageCircle className="w-4 h-4 text-aqua-400 mx-auto mb-1" />
            <p className="font-heading text-2xl text-navy">{user._count.comments}</p>
            <p className="font-body text-xs text-navy-muted">notes left</p>
          </div>
        </div>

        <ProfileForm user={{ name: user.name, bio: user.bio }} />
      </div>
    </div>
  );
}
