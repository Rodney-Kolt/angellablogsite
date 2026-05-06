"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";

export type MomentType = "GAME_WINNER" | "FUNNY_MISS" | "TRAINING_PR" | "CROWD_REACTION";

export async function createBakoMoment(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isOwner: true },
  });
  if (!user?.isOwner) throw new Error("Only the owner can create moments");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const momentType = formData.get("momentType") as MomentType;
  const relatedPostId = (formData.get("relatedPostId") as string) || null;
  const mediaUrl = (formData.get("mediaUrl") as string) || null;
  const mediaType = (formData.get("mediaType") as "IMAGE" | "VIDEO") || "IMAGE";

  if (!title || !description || !momentType) {
    throw new Error("Title, description, and moment type are required");
  }

  await prisma.bakoMoment.create({
    data: {
      title,
      description,
      momentType,
      mediaUrl,
      mediaType,
      relatedPostId: relatedPostId || null,
      userId: session.user.id,
    },
  });

  revalidatePath("/bako-moments");
  redirect("/bako-moments");
}

export async function deleteBakoMoment(momentId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isOwner: true },
  });
  if (!user?.isOwner) throw new Error("Only the owner can delete moments");

  await prisma.bakoMoment.delete({ where: { id: momentId } });
  revalidatePath("/bako-moments");
  return { success: true };
}

export async function uploadMomentMedia(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const isVideo = file.type.startsWith("video/");
  const isImage = file.type.startsWith("image/");
  if (!isVideo && !isImage) throw new Error("File must be an image or video");

  const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error(`File too large (max ${isVideo ? "50MB" : "5MB"})`);
  }

  const blob = await put(`bako/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return { url: blob.url, mediaType: isVideo ? "VIDEO" : "IMAGE" };
}
