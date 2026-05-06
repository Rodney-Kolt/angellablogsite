"use client";

import { useEffect } from "react";
import { useCourtStore } from "@/store/court-store";
import { Volume2, VolumeX, RotateCcw, ChevronDown, Sun, Moon } from "lucide-react";

interface CourtHUDProps {
  isMobile: boolean;
}

export function CourtHUD({ isMobile }: CourtHUDProps) {
  const muted = useCourtStore((s) => s.muted);
  const toggleMute = useCourtStore((s) => s.toggleMute);
  const triggerCameraReset = useCourtStore((s) => s.triggerCameraReset);
  const lightMode = useCourtStore((s) => s.lightMode);
  const toggleLightMode = useCourtStore((s) => s.toggleLightMode);

  // Hydrate light mode from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem("courtLightMode");
    if (saved === "night" && lightMode === "day") {
      toggleLightMode();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isNight = lightMode === "night";

  return (
    <>
      {/* Top-right controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={toggleMute}
          className="w-9 h-9 rounded-sm bg-black/60 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-hoop-orange hover:border-hoop-orange/50 transition-all"
          title={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={triggerCameraReset}
          className="w-9 h-9 rounded-sm bg-black/60 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-hoop-orange hover:border-hoop-orange/50 transition-all"
          title="Reset camera"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* ── Day / Night toggle — bottom right FAB ── */}
      <button
        onClick={toggleLightMode}
        title={isNight ? "Switch to Day mode" : "Switch to Night mode"}
        className={`
          absolute bottom-20 right-4 z-20
          w-12 h-12 rounded-full
          flex items-center justify-center
          border-2 transition-all duration-300
          shadow-lg active:scale-95
          ${isNight
            ? "bg-[#1a0a2e] border-purple-500 text-yellow-300 hover:border-yellow-300 hover:shadow-[0_0_12px_rgba(234,179,8,0.5)]"
            : "bg-amber-50 border-amber-400 text-amber-600 hover:border-amber-500 hover:shadow-[0_0_12px_rgba(251,191,36,0.6)]"
          }
        `}
      >
        {isNight
          ? <Sun className="w-5 h-5" />
          : <Moon className="w-5 h-5" />
        }
      </button>

      {/* Mode label */}
      <div
        className={`
          absolute bottom-20 right-[4.5rem] z-20 pointer-events-none
          px-2 py-1 rounded-sm text-xs font-body uppercase tracking-wider
          transition-all duration-300
          ${isNight
            ? "bg-purple-900/70 text-purple-200 border border-purple-700"
            : "bg-amber-50/80 text-amber-700 border border-amber-300"
          }
        `}
      >
        {isNight ? "Night" : "Day"}
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className={`
          flex items-center gap-2 px-3 py-1.5 rounded-sm border
          ${isNight ? "bg-black/50 border-slate-800" : "bg-white/30 border-slate-300"}
        `}>
          <span className={`font-body text-xs uppercase tracking-wider ${isNight ? "text-slate-500" : "text-slate-600"}`}>
            {isMobile
              ? "tap cards to read · pinch to zoom"
              : "drag to orbit · scroll to zoom · click cards to read"}
          </span>
        </div>
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-bounce">
        <ChevronDown className={`w-5 h-5 ${isNight ? "text-hoop-orange/50" : "text-amber-500/60"}`} />
      </div>
    </>
  );
}
