"use client";

import { useCourtStore } from "@/store/court-store";
import { Volume2, VolumeX, RotateCcw, ChevronDown } from "lucide-react";

interface CourtHUDProps {
  isMobile: boolean;
}

export function CourtHUD({ isMobile }: CourtHUDProps) {
  const muted = useCourtStore((s) => s.muted);
  const toggleMute = useCourtStore((s) => s.toggleMute);
  const triggerCameraReset = useCourtStore((s) => s.triggerCameraReset);

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

      {/* Bottom hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-black/50 border border-slate-800">
          <span className="font-body text-xs text-slate-500 uppercase tracking-wider">
            {isMobile
              ? "tap cards to read · pinch to zoom"
              : "drag to orbit · scroll to zoom · click cards to read"}
          </span>
        </div>
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-bounce">
        <ChevronDown className="w-5 h-5 text-hoop-orange/50" />
      </div>
    </>
  );
}
