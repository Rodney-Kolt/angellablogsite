"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import to avoid SSR issues with Three.js
const Basketball3D = dynamic(
  () => import("./basketball").then((m) => m.Basketball3D),
  { ssr: false }
);

function BallFallback() {
  return (
    <div className="w-[280px] h-[280px] flex items-center justify-center">
      <div className="text-8xl animate-bounce-ball select-none">🏀</div>
    </div>
  );
}

export function BasketballHero() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Glow ring behind ball */}
      <div
        className="absolute rounded-full opacity-20 blur-3xl"
        style={{
          width: 320,
          height: 320,
          background: "radial-gradient(circle, #F97316 0%, transparent 70%)",
        }}
      />
      <Suspense fallback={<BallFallback />}>
        <Basketball3D size={280} />
      </Suspense>
    </div>
  );
}
