import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// One-time route to make the currently logged-in user the owner.
// Visit /api/make-owner while signed in to grant yourself owner access.
// This route is safe — it only works if you're already authenticated.
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Not signed in. Sign in first, then visit this URL." },
      { status: 401 }
    );
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { isOwner: true },
  });

  return NextResponse.json({
    success: true,
    message: `✅ ${session.user.email} is now the owner. You can now access /dashboard.`,
    nextStep: "Go to /dashboard",
  });
}
