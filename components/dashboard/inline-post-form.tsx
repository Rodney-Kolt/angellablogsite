"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPostInline, uploadImage } from "@/lib/actions";
import { RichEditor } from "@/components/blog/rich-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ImagePlus, Loader2, X, Globe, Lock,
  ChevronDown, ChevronUp, Smile, Music, Star,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

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

interface InlinePostFormProps {
  onSuccess: () => void; // called after publish/draft to refresh list
}

export function InlinePostForm({ onSuccess }: InlinePostFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Core fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isDiaryLock, setIsDiaryLock] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Scrapbook extras — collapsed by default
  const [showExtras, setShowExtras] = useState(false);
  const [mood, setMood] = useState("");
  const [moodEmoji, setMoodEmoji] = useState("");
  const [song, setSong] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [tinyJoy, setTinyJoy] = useState("");

  const formRef = useRef<HTMLFormElement>(null);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setIsDiaryLock(false);
    setImageUrls([]);
    setMood("");
    setMoodEmoji("");
    setSong("");
    setSongArtist("");
    setTinyJoy("");
    setShowExtras(false);
  };

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
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = (publishNow: boolean) => {
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
    fd.append("published", String(publishNow));
    fd.append("imageUrls", JSON.stringify(imageUrls));

    startTransition(async () => {
      const result = await createPostInline(fd);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      if (publishNow) {
        toast.success("Memory published! 🌊✦");
      } else {
        toast.success("Draft saved ✦");
      }
      resetForm();
      onSuccess();
      // Optionally navigate to the post
      if (publishNow && result.slug) {
        router.push(`/posts/${result.slug}`);
      }
    });
  };

  return (
    <div className="bg-white/80 rounded-2xl border-2 border-dashed border-aqua-300 shadow-polaroid overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-aqua-50 border-b-2 border-dashed border-aqua-200">
        <h2 className="font-heading text-2xl text-navy">
          ✦ write a new scrapbook entry
        </h2>
        <p className="font-body text-xs text-navy-muted mt-0.5">
          capture a memory, thought, or little joy 🌊
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Title */}
        <div className="space-y-1.5">
          <Label htmlFor="post-title">Title *</Label>
          <Input
            id="post-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="what's this memory called?"
            className="font-heading text-lg"
            disabled={isPending}
          />
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <Label>Content *</Label>
          <RichEditor
            content={content}
            onChange={setContent}
            placeholder="write your memory here... 🌊"
          />
        </div>

        {/* Featured image */}
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5">
            <ImagePlus className="w-3.5 h-3.5" />
            Featured image
          </Label>
          {imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {imageUrls.map((url, i) => (
                <div key={i} className="relative group">
                  <div className="w-24 h-20 rounded-xl overflow-hidden border-2 border-aqua-200 bg-white p-1">
                    <Image
                      src={url}
                      alt=""
                      width={88}
                      height={72}
                      className="object-cover w-full h-full rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setImageUrls((p) => p.filter((_, j) => j !== i))}
                    className="absolute -top-2 -right-2 bg-coral-400 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-aqua-300 bg-aqua-50 cursor-pointer hover:border-aqua-400 hover:bg-aqua-100 transition-all w-fit">
            {uploading
              ? <Loader2 className="w-4 h-4 text-aqua-400 animate-spin" />
              : <ImagePlus className="w-4 h-4 text-aqua-400" />
            }
            <span className="font-body text-sm text-navy-muted">
              {uploading ? "uploading..." : "add photo"}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading || isPending}
            />
          </label>
        </div>

        {/* Scrapbook extras — collapsible */}
        <div className="rounded-xl border-2 border-dashed border-aqua-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowExtras(!showExtras)}
            className="w-full flex items-center justify-between px-4 py-3 bg-aqua-50 hover:bg-aqua-100 transition-colors"
          >
            <span className="font-body text-sm font-semibold text-navy">
              ✦ scrapbook details (mood, song, tiny joy)
            </span>
            {showExtras
              ? <ChevronUp className="w-4 h-4 text-navy-muted" />
              : <ChevronDown className="w-4 h-4 text-navy-muted" />
            }
          </button>

          {showExtras && (
            <div className="p-4 space-y-4 bg-white/60">
              {/* Mood */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Smile className="w-3.5 h-3.5" /> mood of the day
                </Label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {MOOD_PRESETS.map((p) => (
                    <button
                      key={p.emoji}
                      type="button"
                      onClick={() => { setMoodEmoji(p.emoji); setMood(p.label); }}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-body border-2 transition-all ${
                        moodEmoji === p.emoji
                          ? "border-coral-300 bg-coral-50 text-coral-600"
                          : "border-dashed border-aqua-300 bg-white text-navy-muted hover:border-aqua-400"
                      }`}
                    >
                      {p.emoji} {p.label}
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
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5" /> currently playing
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

              {/* Tiny joy */}
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5" /> tiny joy today
                </Label>
                <Input
                  value={tinyJoy}
                  onChange={(e) => setTinyJoy(e.target.value)}
                  placeholder="the little thing that made today worth it..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Visibility toggle */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setIsDiaryLock(!isDiaryLock)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-body text-sm transition-all ${
              isDiaryLock
                ? "border-coral-300 bg-coral-50 text-coral-600"
                : "border-dashed border-aqua-300 bg-white text-navy-muted hover:border-aqua-400"
            }`}
          >
            {isDiaryLock ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
            {isDiaryLock ? "members only" : "public"}
          </button>
          <span className="font-body text-xs text-navy-faint">
            {isDiaryLock
              ? "only signed-in readers can see this"
              : "visible to everyone"}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 flex-wrap pt-2 border-t-2 border-dashed border-aqua-100">
          <Button
            type="button"
            variant="outline"
            disabled={isPending || uploading}
            onClick={() => handleSubmit(false)}
            className="flex-1 sm:flex-none"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Save Draft
          </Button>
          <Button
            type="button"
            variant="coral"
            disabled={isPending || uploading}
            onClick={() => handleSubmit(true)}
            className="flex-1 sm:flex-none"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>✦</span>}
            Publish Memory
          </Button>
          {(title || content !== "") && (
            <button
              type="button"
              onClick={resetForm}
              className="font-body text-xs text-navy-faint hover:text-coral-400 transition-colors ml-auto"
            >
              clear form
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
