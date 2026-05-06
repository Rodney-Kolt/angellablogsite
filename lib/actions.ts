"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateSlug, stripHtml, truncate } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";

// ─── Post Actions ────────────────────────────────────────────────────────────

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isOwner: true },
  });
  if (!user?.isOwner) throw new Error("Only the blog owner can create posts");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const mood = formData.get("mood") as string;
  const moodEmoji = formData.get("moodEmoji") as string;
  const song = formData.get("song") as string;
  const songArtist = formData.get("songArtist") as string;
  const tinyJoy = formData.get("tinyJoy") as string;
  const isDiaryLock = formData.get("isDiaryLock") === "true";
  const imageUrlsRaw = formData.get("imageUrls") as string;
  const imageUrls = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : [];

  if (!title || !content) throw new Error("Title and content are required");

  const slug = generateSlug(title);
  const plainText = stripHtml(content);
  const excerpt = truncate(plainText, 160);

  const post = await prisma.post.create({
    data: {
      title,
      content,
      excerpt,
      mood,
      moodEmoji,
      song,
      songArtist,
      tinyJoy,
      isDiaryLock,
      imageUrls,
      slug,
      authorId: session.user.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect(`/posts/${post.slug}`);
}

export async function updatePost(postId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.authorId !== session.user.id)
    throw new Error("Not authorized to edit this post");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const mood = formData.get("mood") as string;
  const moodEmoji = formData.get("moodEmoji") as string;
  const song = formData.get("song") as string;
  const songArtist = formData.get("songArtist") as string;
  const tinyJoy = formData.get("tinyJoy") as string;
  const isDiaryLock = formData.get("isDiaryLock") === "true";
  const imageUrlsRaw = formData.get("imageUrls") as string;
  const imageUrls = imageUrlsRaw ? JSON.parse(imageUrlsRaw) : [];

  const plainText = stripHtml(content);
  const excerpt = truncate(plainText, 160);

  await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      content,
      excerpt,
      mood,
      moodEmoji,
      song,
      songArtist,
      tinyJoy,
      isDiaryLock,
      imageUrls,
    },
  });

  revalidatePath("/");
  revalidatePath(`/posts/${post.slug}`);
  revalidatePath("/dashboard");
  redirect(`/posts/${post.slug}`);
}

export async function deletePost(postId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.authorId !== session.user.id)
    throw new Error("Not authorized to delete this post");

  await prisma.post.delete({ where: { id: postId } });

  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

// ─── Reaction Actions ─────────────────────────────────────────────────────────

export async function toggleReaction(
  postId: string,
  type: "same" | "feltThat" | "hugs"
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please sign in to react" };

  const existing = await prisma.reaction.findUnique({
    where: {
      postId_userId_type: {
        postId,
        userId: session.user.id,
        type,
      },
    },
  });

  if (existing) {
    await prisma.reaction.delete({ where: { id: existing.id } });
  } else {
    await prisma.reaction.create({
      data: { postId, userId: session.user.id, type },
    });
  }

  revalidatePath(`/posts/[slug]`, "page");
  return { success: true };
}

// ─── Comment Actions ──────────────────────────────────────────────────────────

export async function addComment(postId: string, content: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Please sign in to comment" };

  if (!content.trim()) return { error: "Comment cannot be empty" };
  if (content.length > 1000)
    return { error: "Comment is too long (max 1000 chars)" };

  await prisma.comment.create({
    data: {
      postId,
      userId: session.user.id,
      content: content.trim(),
    },
  });

  revalidatePath(`/posts/[slug]`, "page");
  return { success: true };
}

export async function deleteComment(commentId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });
  if (!comment) throw new Error("Comment not found");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isOwner: true },
  });

  if (comment.userId !== session.user.id && !user?.isOwner) {
    throw new Error("Not authorized to delete this comment");
  }

  await prisma.comment.delete({ where: { id: commentId } });
  revalidatePath(`/posts/[slug]`, "page");
  return { success: true };
}

// ─── Profile Actions ──────────────────────────────────────────────────────────

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, bio },
  });

  revalidatePath("/profile");
  return { success: true };
}

// ─── Image Upload ─────────────────────────────────────────────────────────────

export async function uploadImage(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  // Check file type
  if (!file.type.startsWith("image/")) throw new Error("File must be an image");

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) throw new Error("File too large (max 5MB)");

  const blob = await put(`posts/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return { url: blob.url };
}
