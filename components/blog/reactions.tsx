"use client";

import { useState, useTransition, useRef } from "react";
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

// Map old reaction keys to basketball labels
const BASKETBALL_LABELS: Record<ReactionType, { emoji: string; label: string; color: string }> = {
  same: { emoji: "🏀", label: "Swish", color: "hoop-orange" },
  feltThat: { emoji: "🔥", label: "Heat Check", color: "red-500" },
  hugs: { emoji: "🧱", label: "Brick", color: "slate-400" },
};

export function Reactions({
  postId,
  counts,
  userReactions,
  isLoggedIn,
}: ReactionsProps) {
  const [localCounts, setLocalCounts] = useState(counts);
  const [localUserReactions, setLocalUserReactions] = useState(userReactions);
  const [isPending, startTransition] = useTransition();
  const [shakingHoop, setShakingHoop] = useState(false);
  const hoopRef = useRef<HTMLSpanElement>(null);

  const handleReaction = (type: ReactionType) => {
    if (!isLoggedIn) {
      toast("sign in to react 🏀", { icon: "🔒" });
      return;
    }

    // Shake hoop on Swish
    if (type === "same") {
      setShakingHoop(true);
      setTimeout(() => setShakingHoop(false), 600);
    }

    const wasActive = localUserReactions[type];
    setLocalUserReactions((prev) => ({ ...prev, [type]: !wasActive }));
    setLocalCounts((prev) => ({
      ...prev,
      [type]: wasActive ? prev[type] - 1 : prev[type] + 1,
    }));

    startTransition(async () => {
      const result = await toggleReaction(postId, type);
      if (result?.error) {
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
    <div className="my-6">
      {/* Section header with hoop */}
      <div className="flex items-center gap-3 mb-4">
        <span className="font-heading text-sm text-slate-400 uppercase tracking-widest">
          Vibe Check
        </span>
        <div className="flex-1 h-px bg-slate-800" />
        {/* Hoop that shakes on Swish */}
        <span
          ref={hoopRef}
          className={`text-xl select-none transition-transform ${shakingHoop ? "hoop-shake" : ""}`}
          title="Hoop"
        >
          🏀
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {(Object.keys(BASKETBALL_LABELS) as ReactionType[]).map((type) => {
          const { emoji, label } = BASKETBALL_LABELS[type];
          const isActive = localUserReactions[type];
          const count = localCounts[type];

          return (
            <button
              key={type}
              onClick={() => handleReaction(type)}
              disabled={isPending}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-sm border font-body text-xs font-semibold uppercase tracking-wider
                transition-all duration-200 hover:scale-105 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  isActive
                    ? type === "same"
                      ? "border-hoop-orange bg-hoop-orange/20 text-hoop-orange shadow-orange-sm"
                      : type === "feltThat"
                      ? "border-red-500 bg-red-500/20 text-red-400"
                      : "border-slate-500 bg-slate-700 text-slate-300"
                    : "border-slate-700 bg-slate-900 text-slate-500 hover:border-hoop-orange/50 hover:text-slate-300"
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
                    text-xs font-bold px-1.5 py-0.5 rounded-sm
                    ${isActive ? "bg-white/10" : "bg-slate-800"}
                  `}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
