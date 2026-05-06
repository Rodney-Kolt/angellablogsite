"use client";

import { useState, useTransition } from "react";
import { createPost, updatePost, uploadImage } from "@/lib/actions";
import { RichEditor } from "@/components/blog/rich-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Lock,
  Globe,
  ImagePlus,
  X,
  Loader2,
  Music,
  Smile,
  Star,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import type { Post } from "@prisma/client";

const MOOD_PRESETS = [
  { emoji: "🌸", label: "soft & hopeful" },
  { emoji: "🌙", label: "dreamy" },
  { emoji: "☁️", label: "cloudy" },
  { emoji: "✨", label: "sparkly" },
  { emoji: "🍵", label: "cozy" },
  { emoji: "🌧️", label: "rainy day" },
  { emoji: "🦋", label: "transforming" },
  { emoji: "💕", label: "in love" },
];

interface PostFormProps {
  post?: Post;
}

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
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const result = await uploadImage(fd);
        if (result?.url) {
          setImageUrls((prev) => [...prev, result.url]);
          toast.success("image uploaded! 🌸");
        }
      }
    } catch (err) {
      toast.error("image upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (url: string) => {
    setImageUrls((prev) => prev.filter((u) => u !== url));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("title is required 🌸");
      return;
    }
    if (!content || content === "<p></p>") {
      toast.error("content is required 🌸");
      return;
    }

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
        if (post) {
          await updatePost(post.id, fd);
        } else {
          await createPost(fd);
        }
        toast.success(post ? "post updated! ✨" : "post published! 🌸");
      } catch (err: unknown) {
        if (err instanceof Error && err.message !== "NEXT_REDIRECT") {
          toast.error("something went wrong 😢");
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-base">
          ✨ title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="what's today's story?"
          className="text-lg font-heading"
          required
        />
      </div>

      {/* Kiro Prompts */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 space-y-4">
        <h3 className="font-heading text-base text-pink-700 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          kiro prompts
        </h3>

        {/* Mood */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <Smile className="w-3.5 h-3.5" />
            mood
          </Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {MOOD_PRESETS.map((preset) => (
              <button
                key={preset.emoji}
                type="button"
                onClick={() => {
                  setMoodEmoji(preset.emoji);
                  setMood(preset.label);
                }}
                className={`
                  flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-body border-2 transition-all
                  ${
                    moodEmoji === preset.emoji
                      ? "border-pink-400 bg-pink-100 text-pink-700"
                      : "border-pink-200 bg-white text-pink-500 hover:border-pink-300"
                  }
                `}
              >
                {preset.emoji} {preset.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={moodEmoji}
              onChange={(e) => setMoodEmoji(e.target.value)}
              placeholder="emoji"
              className="w-20"
              maxLength={4}
            />
            <Input
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="describe your mood..."
              className="flex-1"
            />
          </div>
        </div>

        {/* Song */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5" />
            currently looping
          </Label>
          <div className="flex gap-2">
            <Input
              value={song}
              onChange={(e) => setSong(e.target.value)}
              placeholder="song title"
              className="flex-1"
            />
            <Input
              value={songArtist}
              onChange={(e) => setSongArtist(e.target.value)}
              placeholder="artist"
              className="flex-1"
            />
          </div>
        </div>

        {/* Tiny Joy */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5" />
            today's tiny joy
          </Label>
          <Input
            value={tinyJoy}
            onChange={(e) => setTinyJoy(e.target.value)}
            placeholder="the little thing that made today worth it..."
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Label className="text-base">📝 content</Label>
        <RichEditor
          content={content}
          onChange={setContent}
          placeholder="write your heart out... 🌸"
        />
      </div>

      {/* Images */}
      <div className="space-y-3">
        <Label className="text-base flex items-center gap-2">
          <ImagePlus className="w-4 h-4" />
          polaroid gallery
        </Label>

        {/* Image previews */}
        {imageUrls.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {imageUrls.map((url, i) => (
              <div key={i} className="relative group">
                <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-pink-200">
                  <Image
                    src={url}
                    alt={`Upload ${i + 1}`}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute -top-2 -right-2 bg-red-400 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50/50 cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all">
          {uploading ? (
            <Loader2 className="w-4 h-4 text-pink-400 animate-spin" />
          ) : (
            <ImagePlus className="w-4 h-4 text-pink-400" />
          )}
          <span className="font-body text-sm text-pink-500">
            {uploading ? "uploading..." : "add photos"}
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Privacy */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-purple-50 border border-purple-100">
        <button
          type="button"
          onClick={() => setIsDiaryLock(!isDiaryLock)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full border-2 font-body text-sm transition-all
            ${
              isDiaryLock
                ? "border-purple-400 bg-purple-100 text-purple-700"
                : "border-purple-200 bg-white text-purple-500 hover:border-purple-300"
            }
          `}
        >
          {isDiaryLock ? (
            <Lock className="w-4 h-4" />
          ) : (
            <Globe className="w-4 h-4" />
          )}
          {isDiaryLock ? "diary lock (logged-in only)" : "public post"}
        </button>
        <p className="font-body text-xs text-purple-400">
          {isDiaryLock
            ? "only signed-in readers can see this"
            : "everyone can read this post"}
        </p>
      </div>

      {/* Submit */}
      <div className="flex gap-3 justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={isPending || uploading}
          className="min-w-32"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isPending
            ? "saving..."
            : post
            ? "update post"
            : "publish post"}
        </Button>
      </div>
    </form>
  );
}
