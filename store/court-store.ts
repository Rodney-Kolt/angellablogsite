import { create } from "zustand";

export type CourtView = "court" | "post" | "bako" | "music" | "archive";

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
  // Current view / modal
  activeView: CourtView;
  setActiveView: (v: CourtView) => void;

  // Selected post for modal
  selectedPost: PostData | null;
  setSelectedPost: (p: PostData | null) => void;

  // Scoreboard data
  scoreboardData: {
    totalPosts: number;
    totalReactions: number;
    streak: number;
    latestTitle: string;
  };
  setScoreboardData: (d: CourtState["scoreboardData"]) => void;

  // Hoop shake trigger
  hoopShaking: boolean;
  triggerHoopShake: () => void;

  // Sound mute
  muted: boolean;
  toggleMute: () => void;

  // Camera reset trigger
  resetCamera: boolean;
  triggerCameraReset: () => void;
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
}));
