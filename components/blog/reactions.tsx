"use client";

import { useState, useTransition } from "react";
import { toggleReaction } from "@/lib/actions";
import type { ReactionType } from "@/lib/utils";
import toast from "react-hot-toast";

const LABELS: Record<ReactionType, { emoji: string; label: string }> = {
  same:     { emoji: "👏", label: "Relate" },
  feltThat: { emoji: "💙", label: "Love this" },
  hugs:     { emoji: "🤗", label: "Warm" },
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
    if (!isLoggedIn) { toast("Sign in to react"); return; }
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
      <p className="w-full text-sm text-slate-400 mb-1">Did this resonate?</p>
      {(Object.keys(LABELS) as ReactionType[]).map((type) => {
        const { emoji, label } = LABELS[type];
        const active = localActive[type];
        const count = localCounts[type];
        return (
          <button
            key={type}
            onClick={() => handle(type)}
            disabled={isPending}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-150 hover:scale-105 active:scale-95 disabled:opacity-50 ${
              active
                ? "border-blue-400 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            <span>{emoji}</span>
            <span>{label}</span>
            {count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
