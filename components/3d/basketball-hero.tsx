"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const Basketball3D = dynamic(
  () => import("./basketball").then((m) => m.Basketball3D),
  { ssr: false }
);

function BallFallback() {
  return (
    <div className="w-[260px] h-[260px] flex items-center justify-center">
      <span className="text-8xl bounce-ball select-none">🏀</span>
    </div>
  );
}

interface BasketballHeroProps {
  isShaking?: boolean;
}

export function BasketballHero({ isShaking = false }: BasketballHeroProps) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Glow ring */}
      <div
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{
          width: 300,
          height: 300,
          background: "radial-gradient(circle, rgba(255,87,34,0.25) 0%, transparent 70%)",
        }}
      />
      <Suspense fallback={<BallFallback />}>
        <Basketball3D size={260} isShaking={isShaking} />
      </Suspense>
    </div>
  );
}
