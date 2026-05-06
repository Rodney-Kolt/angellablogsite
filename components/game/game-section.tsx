"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Volume2, VolumeX, Flame, RefreshCw } from "lucide-react";

// Load game only on client — no SSR
const BasketballGame = dynamic(
  () => import("./basketball-game").then((m) => m.BasketballGame),
  { ssr: false, loading: () => <GameSkeleton /> }
);

function GameSkeleton() {
  return (
    <div
      className="w-full rounded-sm flex items-center justify-center"
      style={{ height: 360, background: "linear-gradient(180deg, #87CEEB 65%, #D4A96A 35%)" }}
    >
      <div className="text-center">
        <div className="text-5xl bounce-ball inline-block mb-3">🏀</div>
        <p className="font-heading text-white tracking-widest text-lg">LOADING COURT...</p>
      </div>
    </div>
  );
}

export function GameSection() {
  const [muted, setMuted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [gameKey, setGameKey] = useState(0); // increment to reset game

  const handleStreak = useCallback((s: number) => {
    setStreak(s);
  }, []);

  return (
    <div className="rounded-sm border border-slate-700 overflow-hidden bg-[#0d1117]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏀</span>
          <span className="font-heading text-sm text-white tracking-widest">SHOOT YOUR SHOT</span>
          {streak >= 2 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-sm bg-orange-500/20 border border-orange-500/40">
              <Flame className="w-3 h-3 text-orange-400" />
              <span className="font-heading text-xs text-orange-400 tracking-wider">
                {streak}x STREAK
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setGameKey((k) => k + 1)}
            className="w-7 h-7 rounded-sm bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 hover:text-white hover:border-slate-600 transition-all"
            title="Reset game"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setMuted((m) => !m)}
            className="w-7 h-7 rounded-sm bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 hover:text-white hover:border-slate-600 transition-all"
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Game canvas */}
      <div className="p-0">
        <BasketballGame
          key={gameKey}
          muted={muted}
          onStreak={handleStreak}
        />
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2 bg-slate-900/50 border-t border-slate-800 flex items-center justify-between">
        <span className="font-body text-xs text-slate-600 uppercase tracking-wider">
          drag the ball to aim · release to shoot
        </span>
        <span className="font-body text-xs text-slate-700 uppercase tracking-wider hidden sm:block">
          mobile: touch &amp; drag
        </span>
      </div>
    </div>
  );
}
