"use client";

import { useState, useTransition } from "react";
import { toggleReaction } from "@/lib/actions";
import type { ReactionType } from "@/lib/utils";
import toast from "react-hot-toast";

const COASTAL_LABELS: Record<ReactionType, { emoji: string; label: string }> = {
  same:     { emoji: "🫧", label: "Save to memory" },
  feltThat: { emoji: "📖", label: "Loved this" },
  hugs:     { emoji: "💬", label: "Relatable" },
};

interface ReactionsProps {
  postId: string;
  counts: Record<ReactionType, number>;
  userReactions: Record<ReactionType, boolean>;
  isLoggedIn: boolean;
}

export function Reactions({ postId, counts, userReactions, isLoggedIn }: ReactionsProps) {
  const [localCounts, setLocalCounts] = useState(counts);
  const [localActive, setLocalActive] = useState(userReactions);
  const [isPending, startTransition] = useTransition();

  const handle = (type: ReactionType) => {
    if (!isLoggedIn) { toast("Sign in to react 🌊"); return; }
    const was = localActive[type];
    setLocalActive((p) => ({ ...p, [type]: !was }));
    setLocalCounts((p) => ({ ...p, [type]: was ? p[type] - 1 : p[type] + 1 }));
    startTransition(async () => {
      const res = await toggleReaction(postId, type);
      if (res?.error) {
        setLocalActive((p) => ({ ...p, [type]: was }));
        setLocalCounts((p) => ({ ...p, [type]: was ? p[type] + 1 : p[type] - 1 }));
        toast.error(res.error);
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-3 my-6">
      <p className="w-full font-handwriting text-base text-navy-muted mb-1">
        how did this make you feel? ✦
      </p>
      {(Object.keys(COASTAL_LABELS) as ReactionType[]).map((type) => {
        const { emoji, label } = COASTAL_LABELS[type];
        const active = localActive[type];
        const count = localCounts[type];
        return (
          <button
            key={type}
            onClick={() => handle(type)}
            disabled={isPending}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 font-body text-sm transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 ${
              active
                ? "border-coral-300 bg-coral-50 text-coral-600"
                : "border-dashed border-aqua-300 bg-white/80 text-navy-muted hover:border-aqua-400 hover:bg-aqua-50"
            }`}
          >
            <span>{emoji}</span>
            <span>{label}</span>
            {count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? "bg-coral-100 text-coral-600" : "bg-aqua-100 text-navy-muted"}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
