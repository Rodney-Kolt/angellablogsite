"use client";

import { useState, useTransition } from "react";
import { createBakoMoment, uploadMomentMedia } from "@/lib/bako-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

type MomentType = "GAME_WINNER" | "FUNNY_MISS" | "TRAINING_PR" | "CROWD_REACTION";

const MOMENT_TYPES: { value: MomentType; icon: string; label: string }[] = [
  { value: "GAME_WINNER",    icon: "🏆", label: "Game Winner" },
  { value: "FUNNY_MISS",     icon: "🤣", label: "Funny Miss" },
  { value: "TRAINING_PR",    icon: "💪", label: "Training PR" },
  { value: "CROWD_REACTION", icon: "🎉", label: "Crowd Reaction" },
];

interface Post { id: string; title: string }

interface BakoFormProps {
  posts: Post[];
}

export function BakoForm({ posts }: BakoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [momentType, setMomentType] = useState<MomentType>("GAME_WINNER");
  const [relatedPostId, setRelatedPostId] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"IMAGE" | "VIDEO">("IMAGE");
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const result = await uploadMomentMedia(fd);
      setMediaUrl(result.url);
      setMediaType(result.mediaType as "IMAGE" | "VIDEO");
      toast.success("media uploaded 🏀");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("title and description are required");
      return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("momentType", momentType);
    fd.append("relatedPostId", relatedPostId);
    fd.append("mediaUrl", mediaUrl);
    fd.append("mediaType", mediaType);

    startTransition(async () => {
      try {
        await createBakoMoment(fd);
        toast.success("moment logged 🏆");
      } catch (err: unknown) {
        if (err instanceof Error && err.message !== "NEXT_REDIRECT") {
          toast.error("something went wrong");
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="what happened?"
          required
        />
      </div>

      {/* Moment type */}
      <div className="space-y-2">
        <Label>Moment Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {MOMENT_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setMomentType(type.value)}
              className={`
                flex items-center gap-2 px-3 py-2.5 rounded-sm border text-left transition-all
                ${momentType === type.value
                  ? "border-hoop-orange bg-hoop-orange/15 text-hoop-orange"
                  : "border-slate-700 bg-slate-900 text-slate-500 hover:border-slate-600"
                }
              `}
            >
              <span className="text-lg">{type.icon}</span>
              <span className="font-body text-xs font-semibold uppercase tracking-wider">
                {type.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="describe the moment..."
          rows={4}
          required
        />
      </div>

      {/* Media upload */}
      <div className="space-y-3">
        <Label>Photo or Video</Label>

        {mediaUrl ? (
          <div className="relative group inline-block">
            {mediaType === "IMAGE" ? (
              <div className="relative w-40 h-40 rounded-sm overflow-hidden border border-slate-700">
                <Image src={mediaUrl} alt="preview" fill className="object-cover" />
              </div>
            ) : (
              <div className="relative w-40 h-40 rounded-sm overflow-hidden border border-slate-700 bg-slate-900 flex items-center justify-center">
                <span className="text-4xl">🎬</span>
                <p className="absolute bottom-2 text-xs text-slate-500 font-body">video uploaded</p>
              </div>
            )}
            <button
              type="button"
              onClick={() => { setMediaUrl(""); setMediaType("IMAGE"); }}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-sm p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <label className="flex items-center gap-2 px-4 py-3 rounded-sm border border-dashed border-slate-700 bg-slate-900 cursor-pointer hover:border-hoop-orange/50 transition-all">
            {uploading
              ? <Loader2 className="w-4 h-4 text-hoop-orange animate-spin" />
              : <ImagePlus className="w-4 h-4 text-slate-500" />
            }
            <span className="font-body text-sm text-slate-500 uppercase tracking-wider">
              {uploading ? "uploading..." : "add photo or video (max 50MB)"}
            </span>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {/* Related post */}
      {posts.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="relatedPost">Related Post (optional)</Label>
          <select
            id="relatedPost"
            value={relatedPostId}
            onChange={(e) => setRelatedPostId(e.target.value)}
            className="w-full h-10 rounded-sm border border-slate-700 bg-slate-900 px-3 text-sm font-body text-slate-300 focus:outline-none focus:ring-2 focus:ring-hoop-orange focus:border-hoop-orange"
          >
            <option value="">— no related post —</option>
            {posts.map((post) => (
              <option key={post.id} value={post.id}>
                {post.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending || uploading} size="lg">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>🏆</span>}
          {isPending ? "Saving..." : "Log Moment"}
        </Button>
      </div>
    </form>
  );
}
