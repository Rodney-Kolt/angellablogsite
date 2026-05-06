import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, formatDate } from "@/lib/utils";
import { ProfileForm } from "@/components/profile/profile-form";
import { MessageCircle, Heart, Target } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "profile" };

// Generate a jersey number from user id (deterministic)
function getJerseyNumber(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  return String(Math.abs(hash) % 99 + 1).padStart(2, "0");
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: { select: { comments: true, reactions: true } },
    },
  });
  if (!user) redirect("/login");

  const jerseyNumber = getJerseyNumber(user.id);

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">👤</span>
        <h1 className="font-heading text-4xl text-white tracking-widest">
          MY PROFILE
        </h1>
      </div>

      <div className="bg-[#1e293b] rounded-sm border border-slate-800 p-8 mb-6">
        {/* Player card header */}
        <div className="flex items-start gap-6 mb-8">
          <div className="relative">
            <Avatar className="w-20 h-20 ring-2 ring-hoop-orange/60">
              <AvatarImage src={user.image ?? ""} />
              <AvatarFallback className="text-2xl font-heading tracking-wider">
                {getInitials(user.name ?? user.email)}
              </AvatarFallback>
            </Avatar>
            {/* Jersey number badge */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-sm bg-hoop-orange flex items-center justify-center shadow-orange-sm">
              <span className="font-heading text-xs text-white tracking-wider">
                #{jerseyNumber}
              </span>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="font-heading text-2xl text-white tracking-widest">
              {user.name ?? "ANONYMOUS PLAYER"}
            </h2>
            <p className="font-body text-xs text-slate-500 uppercase tracking-wider">
              {user.email}
            </p>
            {user.bio && (
              <p className="font-body text-sm text-slate-400 mt-2">{user.bio}</p>
            )}
            <p className="font-body text-xs text-slate-700 mt-2 uppercase tracking-wider">
              on the court since {formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-3 rounded-sm bg-slate-900 border border-slate-800">
            <Heart className="w-4 h-4 text-hoop-orange mx-auto mb-1" />
            <p className="font-heading text-2xl text-white">{user._count.reactions}</p>
            <p className="font-body text-xs text-slate-600 uppercase tracking-wider">reactions</p>
          </div>
          <div className="text-center p-3 rounded-sm bg-slate-900 border border-slate-800">
            <MessageCircle className="w-4 h-4 text-hoop-neon mx-auto mb-1" />
            <p className="font-heading text-2xl text-white">{user._count.comments}</p>
            <p className="font-body text-xs text-slate-600 uppercase tracking-wider">comments</p>
          </div>
          <div className="text-center p-3 rounded-sm bg-slate-900 border border-slate-800">
            <Target className="w-4 h-4 text-slate-400 mx-auto mb-1" />
            <p className="font-heading text-2xl text-hoop-orange">#{jerseyNumber}</p>
            <p className="font-body text-xs text-slate-600 uppercase tracking-wider">jersey</p>
          </div>
        </div>

        {/* Edit form */}
        <ProfileForm user={{ name: user.name, bio: user.bio }} />
      </div>
    </div>
  );
}
