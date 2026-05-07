"use client";

import { useState, useTransition } from "react";
import { createPost, updatePost, uploadImage } from "@/lib/actions";
import { RichEditor } from "@/components/blog/rich-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, Loader2, X, Globe, Lock } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import type { Post } from "@prisma/client";

interface PostFormProps { post?: Post }

export function PostForm({ post }: PostFormProps) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [isDiaryLock, setIsDiaryLock] = useState(post?.isDiaryLock ?? false);
  const [imageUrls, setImageUrls] = useState<string[]>(post?.imageUrls ?? []);
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const result = await uploadImage(fd);
        if (result?.url) setImageUrls((p) => [...p, result.url]);
      }
      toast.success("Image uploaded");
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); e.target.value = ""; }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error("Title is required"); return; }
    if (!content || content === "<p></p>") { toast.error("Content is required"); return; }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("content", content);
    fd.append("mood", "");
    fd.append("moodEmoji", "");
    fd.append("song", "");
    fd.append("songArtist", "");
    fd.append("tinyJoy", "");
    fd.append("isDiaryLock", String(isDiaryLock));
    fd.append("imageUrls", JSON.stringify(imageUrls));

    startTransition(async () => {
      try {
        if (post) await updatePost(post.id, fd);
        else await createPost(fd);
        toast.success(post ? "Post updated" : "Post published");
      } catch (err: unknown) {
        if (err instanceof Error && err.message !== "NEXT_REDIRECT") toast.error("Something went wrong");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Your post title…"
          className="w-full font-serif text-3xl font-semibold text-ink placeholder:text-slate-300 border-none outline-none bg-transparent resize-none leading-tight"
          required
        />
        <div className="h-px bg-slate-200" />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label>Content</Label>
        <RichEditor content={content} onChange={setContent} placeholder="Tell your story…" />
      </div>

      {/* Cover image */}
      <div className="space-y-3">
        <Label>Cover image</Label>
        {imageUrls.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {imageUrls.map((url, i) => (
              <div key={i} className="relative group">
                <div className="w-28 h-20 rounded-lg overflow-hidden border border-slate-200">
                  <Image src={url} alt="" width={112} height={80} className="object-cover w-full h-full" />
                </div>
                <button type="button" onClick={() => setImageUrls((p) => p.filter((_, j) => j !== i))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-slate-300 bg-slate-50 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all w-fit">
          {uploading ? <Loader2 className="w-4 h-4 text-blue-400 animate-spin" /> : <ImagePlus className="w-4 h-4 text-slate-400" />}
          <span className="text-sm text-slate-500">{uploading ? "Uploading…" : "Add cover image"}</span>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {/* Visibility */}
      <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <button type="button" onClick={() => setIsDiaryLock(!isDiaryLock)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
            isDiaryLock ? "border-blue-400 bg-blue-50 text-blue-700" : "border-slate-300 bg-white text-slate-600 hover:border-blue-300"
          }`}>
          {isDiaryLock ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
          {isDiaryLock ? "Members only" : "Public"}
        </button>
        <p className="text-sm text-slate-400">
          {isDiaryLock ? "Only signed-in readers can see this." : "Visible to everyone."}
        </p>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button type="submit" size="lg" disabled={isPending || uploading}>
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {isPending ? "Saving…" : post ? "Update post" : "Publish"}
        </Button>
      </div>
    </form>
  );
}
