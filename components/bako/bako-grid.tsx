"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { deleteBakoMoment } from "@/lib/bako-actions";
import { Trash2, X, ExternalLink, Play } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

type MomentType = "GAME_WINNER" | "FUNNY_MISS" | "TRAINING_PR" | "CROWD_REACTION";
type MediaType = "IMAGE" | "VIDEO";

interface BakoMomentData {
  id: string;
  title: string;
  description: string;
  mediaUrl: string | null;
  mediaType: MediaType;
  momentType: MomentType;
  createdAt: Date;
  relatedPost: { title: string; slug: string } | null;
}

const MOMENT_META: Record<MomentType, { icon: string; label: string; color: string }> = {
  GAME_WINNER: { icon: "🏆", label: "Game Winner", color: "text-yellow-400" },
  FUNNY_MISS:  { icon: "🤣", label: "Funny Miss",  color: "text-slate-400" },
  TRAINING_PR: { icon: "💪", label: "Training PR",  color: "text-hoop-neon" },
  CROWD_REACTION: { icon: "🎉", label: "Crowd Reaction", color: "text-hoop-orange" },
};

interface BakoGridProps {
  moments: BakoMomentData[];
  isOwner: boolean;
}

export function BakoGrid({ moments, isOwner }: BakoGridProps) {
  const [selected, setSelected] = useState<BakoMomentData | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        await deleteBakoMoment(id);
        toast.success("moment deleted");
        if (selected?.id === id) setSelected(null);
      } catch {
        toast.error("couldn't delete moment");
      }
    });
  };

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {moments.map((moment) => {
          const meta = MOMENT_META[moment.momentType];
          return (
            <div
              key={moment.id}
              className="group relative rounded-sm border border-slate-800 bg-[#1e293b] overflow-hidden cursor-pointer card-tilt hover:border-hoop-orange/50 transition-all"
              onClick={() => setSelected(moment)}
            >
              {/* Media preview */}
              {moment.mediaUrl ? (
                <div className="relative h-44 overflow-hidden bg-slate-900">
                  {moment.mediaType === "VIDEO" ? (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900">
                      <video
                        src={moment.mediaUrl}
                        className="w-full h-full object-cover brightness-75"
                        preload="metadata"
                        playsInline
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-sm bg-hoop-orange/90 flex items-center justify-center">
                          <Play className="w-5 h-5 text-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={moment.mediaUrl}
                      alt={moment.title}
                      fill
                      className="object-cover brightness-75 group-hover:brightness-90 transition-all duration-300"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-transparent to-transparent" />
                </div>
              ) : (
                <div className="h-32 bg-slate-900 flex items-center justify-center">
                  <span className="text-5xl">{meta.icon}</span>
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">{meta.icon}</span>
                  <span className={`font-body text-xs font-semibold uppercase tracking-wider ${meta.color}`}>
                    {meta.label}
                  </span>
                </div>
                <h3 className="font-heading text-base text-white tracking-wider line-clamp-1 group-hover:text-hoop-orange transition-colors">
                  {moment.title}
                </h3>
                <p className="font-body text-xs text-slate-600 mt-1">
                  {formatDate(moment.createdAt)}
                </p>
              </div>

              {/* Delete button (owner only) */}
              {isOwner && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(moment.id); }}
                  disabled={isPending}
                  className="absolute top-2 right-2 p-1.5 rounded-sm bg-slate-900/80 text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  aria-label="Delete moment"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#1e293b] rounded-sm border border-slate-700 overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-sm bg-slate-900/80 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Media */}
            {selected.mediaUrl && (
              <div className="relative w-full bg-black">
                {selected.mediaType === "VIDEO" ? (
                  <video
                    src={selected.mediaUrl}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-full max-h-80 object-contain"
                  />
                ) : (
                  <div className="relative w-full h-72">
                    <Image
                      src={selected.mediaUrl}
                      alt={selected.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {/* Type badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{MOMENT_META[selected.momentType].icon}</span>
                <span className={`font-body text-xs font-semibold uppercase tracking-wider ${MOMENT_META[selected.momentType].color}`}>
                  {MOMENT_META[selected.momentType].label}
                </span>
                <span className="font-body text-xs text-slate-700 ml-auto">
                  {formatDate(selected.createdAt)}
                </span>
              </div>

              <h2 className="font-heading text-2xl text-white tracking-wider mb-3">
                {selected.title}
              </h2>

              <p className="font-body text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
                {selected.description}
              </p>

              {/* Related post */}
              {selected.relatedPost && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <p className="font-body text-xs text-slate-600 uppercase tracking-wider mb-2">
                    Related Post
                  </p>
                  <Link
                    href={`/posts/${selected.relatedPost.slug}`}
                    className="flex items-center gap-2 text-hoop-orange hover:underline font-body text-sm"
                    onClick={() => setSelected(null)}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {selected.relatedPost.title}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
