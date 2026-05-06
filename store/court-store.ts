import { create } from "zustand";

export type CourtView = "court" | "post" | "bako" | "music" | "archive";
export type LightMode = "day" | "night";

interface PostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  moodEmoji: string | null;
  createdAt: string;
  isDiaryLock: boolean;
}

interface CourtState {
  activeView: CourtView;
  setActiveView: (v: CourtView) => void;

  selectedPost: PostData | null;
  setSelectedPost: (p: PostData | null) => void;

  scoreboardData: {
    totalPosts: number;
    totalReactions: number;
    streak: number;
    latestTitle: string;
  };
  setScoreboardData: (d: CourtState["scoreboardData"]) => void;

  hoopShaking: boolean;
  triggerHoopShake: () => void;

  muted: boolean;
  toggleMute: () => void;

  resetCamera: boolean;
  triggerCameraReset: () => void;

  // ── Light mode ──────────────────────────────────────────────────────────────
  lightMode: LightMode;
  toggleLightMode: () => void;
}

function getInitialLightMode(): LightMode {
  if (typeof window === "undefined") return "day";
  return (localStorage.getItem("courtLightMode") as LightMode) ?? "day";
}

export const useCourtStore = create<CourtState>((set) => ({
  activeView: "court",
  setActiveView: (v) => set({ activeView: v }),

  selectedPost: null,
  setSelectedPost: (p) => set({ selectedPost: p }),

  scoreboardData: {
    totalPosts: 0,
    totalReactions: 0,
    streak: 0,
    latestTitle: "KIRO COURT",
  },
  setScoreboardData: (d) => set({ scoreboardData: d }),

  hoopShaking: false,
  triggerHoopShake: () => {
    set({ hoopShaking: true });
    setTimeout(() => set({ hoopShaking: false }), 800);
  },

  muted: false,
  toggleMute: () => set((s) => ({ muted: !s.muted })),

  resetCamera: false,
  triggerCameraReset: () => {
    set({ resetCamera: true });
    setTimeout(() => set({ resetCamera: false }), 100);
  },

  lightMode: "day", // always start day; hydrated in CourtWrapper
  toggleLightMode: () =>
    set((s) => {
      const next: LightMode = s.lightMode === "day" ? "night" : "day";
      if (typeof window !== "undefined") {
        localStorage.setItem("courtLightMode", next);
      }
      return { lightMode: next };
    }),
}));
