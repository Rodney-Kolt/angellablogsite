"use client";

import { useState, useTransition } from "react";
import { toggleReaction } from "@/lib/actions";
import { REACTION_LABELS, type ReactionType } from "@/lib/utils";
import toast from "react-hot-toast";

interface ReactionCounts {
  same: number;
  feltThat: number;
  hugs: number;
}

interface UserReactions {
  same: boolean;
  feltThat: boolean;
  hugs: boolean;
}

interface ReactionsProps {
  postId: string;
  counts: ReactionCounts;
  userReactions: UserReactions;
  isLoggedIn: boolean;
}

export function Reactions({
  postId,
  counts,
  userReactions,
  isLoggedIn,
}: ReactionsProps) {
  const [localCounts, setLocalCounts] = useState(counts);
  const [localUserReactions, setLocalUserReactions] = useState(userReactions);
  const [isPending, startTransition] = useTransition();

  const handleReaction = (type: ReactionType) => {
    if (!isLoggedIn) {
      toast("sign in to leave a reaction 🌸", { icon: "✨" });
      return;
    }

    // Optimistic update
    const wasActive = localUserReactions[type];
    setLocalUserReactions((prev) => ({ ...prev, [type]: !wasActive }));
    setLocalCounts((prev) => ({
      ...prev,
      [type]: wasActive ? prev[type] - 1 : prev[type] + 1,
    }));

    startTransition(async () => {
      const result = await toggleReaction(postId, type);
      if (result?.error) {
        // Revert
        setLocalUserReactions((prev) => ({ ...prev, [type]: wasActive }));
        setLocalCounts((prev) => ({
          ...prev,
          [type]: wasActive ? prev[type] + 1 : prev[type] - 1,
        }));
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-3 my-6">
      <p className="w-full font-body text-sm text-pink-400 mb-1">
        vibe check ✨
      </p>
      {(Object.keys(REACTION_LABELS) as ReactionType[]).map((type) => {
        const { emoji, label } = REACTION_LABELS[type];
        const isActive = localUserReactions[type];
        const count = localCounts[type];

        return (
          <button
            key={type}
            onClick={() => handleReaction(type)}
            disabled={isPending}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full border-2 font-body text-sm
              transition-all duration-200 hover:scale-105 active:scale-95
              disabled:opacity-70 disabled:cursor-not-allowed
              ${
                isActive
                  ? "border-pink-400 bg-pink-50 text-pink-700 shadow-girly"
                  : "border-pink-200 bg-white/80 text-pink-500 hover:border-pink-300 hover:bg-pink-50"
              }
            `}
            aria-label={`React with ${label}`}
            aria-pressed={isActive}
          >
            <span className="text-base">{emoji}</span>
            <span>{label}</span>
            {count > 0 && (
              <span
                className={`
                text-xs font-semibold px-1.5 py-0.5 rounded-full
                ${isActive ? "bg-pink-200 text-pink-700" : "bg-pink-100 text-pink-500"}
              `}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
