"use client";

import { useState, useTransition } from "react";
import { createPost, updatePost, uploadImage } from "@/lib/actions";
import { RichEditor } from "@/components/blog/rich-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, Loader2, X, Globe, Lock, Music, Smile, Star } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import type { Post } from "@prisma/client";

const MOOD_PRESETS = [
  { emoji: "🌊", label: "coastal" },
  { emoji: "☀️", label: "sunny" },
  { emoji: "🌸", label: "blooming" },
  { emoji: "🌿", label: "grounded" },
  { emoji: "🌙", label: "dreamy" },
  { emoji: "🐚", label: "nostalgic" },
  { emoji: "🦋", label: "free" },
  { emoji: "💙", label: "peaceful" },
];

interface PostFormProps { post?: Post }

export function PostForm({ post }: PostFormProps) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [mood, setMood] = useState(post?.mood ?? "");
  const [moodEmoji, setMoodEmoji] = useState(post?.moodEmoji ?? "");
  const [song, setSong] = useState(post?.song ?? "");
  const [songArtist, setSongArtist] = useState(post?.songArtist ?? "");
  const [tinyJoy, setTinyJoy] = useState(post?.tinyJoy ?? "");
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
      toast.success("Photo added! 📸");
    } catch { toast.error("Upload failed"); }
    finally { setUploading(false); e.target.value = ""; }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error("Title is required ✦"); return; }
    if (!content || content === "<p></p>") { toast.error("Content is required ✦"); return; }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("content", content);
    fd.append("mood", mood);
    fd.append("moodEmoji", moodEmoji);
    fd.append("song", song);
    fd.append("songArtist", songArtist);
    fd.append("tinyJoy", tinyJoy);
    fd.append("isDiaryLock", String(isDiaryLock));
    fd.append("imageUrls", JSON.stringify(imageUrls));

    startTransition(async () => {
      try {
        if (post) await updatePost(post.id, fd);
        else await createPost(fd);
        toast.success(post ? "Memory updated ✦" : "Memory saved! 🌊");
      } catch (err: unknown) {
        if (err instanceof Error && err.message !== "NEXT_REDIRECT") toast.error("Something went wrong");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title ✦</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="what's this memory called?"
          className="font-heading text-xl"
          required
        />
      </div>

      {/* Scrapbook prompts */}
      <div className="p-5 rounded-2xl bg-white/60 border-2 border-dashed border-aqua-300 space-y-4">
        <h3 className="font-heading text-lg text-navy flex items-center gap-2">
          <span>✦</span> scrapbook details
        </h3>

        {/* Mood */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5"><Smile className="w-3.5 h-3.5" /> mood of the day</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {MOOD_PRESETS.map((p) => (
              <button key={p.emoji} type="button"
                onClick={() => { setMoodEmoji(p.emoji); setMood(p.label); }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-body border-2 transition-all ${
                  moodEmoji === p.emoji
                    ? "border-coral-300 bg-coral-50 text-coral-600"
                    : "border-dashed border-aqua-300 bg-white text-navy-muted hover:border-aqua-400"
                }`}>
                {p.emoji} {p.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={moodEmoji} onChange={(e) => setMoodEmoji(e.target.value)} placeholder="emoji" className="w-20" maxLength={4} />
            <Input value={mood} onChange={(e) => setMood(e.target.value)} placeholder="describe your mood..." className="flex-1" />
          </div>
        </div>

        {/* Song */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5"><Music className="w-3.5 h-3.5" /> currently playing</Label>
          <div className="flex gap-2">
            <Input value={song} onChange={(e) => setSong(e.target.value)} placeholder="song title" className="flex-1" />
            <Input value={songArtist} onChange={(e) => setSongArtist(e.target.value)} placeholder="artist" className="flex-1" />
          </div>
        </div>

        {/* Tiny joy */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> tiny joy today</Label>
          <Input value={tinyJoy} onChange={(e) => setTinyJoy(e.target.value)} placeholder="the little thing that made today worth it..." />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label>Content ✦</Label>
        <RichEditor content={content} onChange={setContent} placeholder="write your memory here... 🌊" />
      </div>

      {/* Images */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2"><ImagePlus className="w-4 h-4" /> polaroid gallery</Label>
        {imageUrls.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {imageUrls.map((url, i) => (
              <div key={i} className="relative group">
                <div className="polaroid w-24 h-24 overflow-hidden">
                  <Image src={url} alt="" width={96} height={96} className="object-cover w-full h-full" />
                </div>
                <button type="button" onClick={() => setImageUrls((p) => p.filter((_, j) => j !== i))}
                  className="absolute -top-2 -right-2 bg-coral-400 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-aqua-300 bg-white/60 cursor-pointer hover:border-aqua-400 hover:bg-aqua-50 transition-all w-fit">
          {uploading ? <Loader2 className="w-4 h-4 text-aqua-400 animate-spin" /> : <ImagePlus className="w-4 h-4 text-aqua-400" />}
          <span className="font-body text-sm text-navy-muted">{uploading ? "uploading..." : "add photos"}</span>
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {/* Visibility */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 border-2 border-dashed border-aqua-300">
        <button type="button" onClick={() => setIsDiaryLock(!isDiaryLock)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-body text-sm transition-all ${
            isDiaryLock
              ? "border-coral-300 bg-coral-50 text-coral-600"
              : "border-dashed border-aqua-300 bg-white text-navy-muted hover:border-aqua-400"
          }`}>
          {isDiaryLock ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
          {isDiaryLock ? "members only" : "public memory"}
        </button>
        <p className="font-body text-xs text-navy-muted">
          {isDiaryLock ? "only signed-in readers can see this" : "everyone can read this"}
        </p>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button type="submit" variant="coral" size="lg" disabled={isPending || uploading}>
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>✦</span>}
          {isPending ? "saving..." : post ? "update memory" : "save memory"}
        </Button>
      </div>
    </form>
  );
}
