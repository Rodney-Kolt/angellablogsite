"use client";

import dynamic from "next/dynamic";
import { Suspense, useState, useEffect } from "react";
import { useDeviceCapabilities } from "@/hooks/use-device-capabilities";
import { PostModal } from "./post-modal";
import { CourtHUD } from "./court-hud";

// Dynamically import the heavy 3D scene
const CourtScene = dynamic(
  () => import("./court-scene").then((m) => m.CourtScene),
  { ssr: false }
);

interface PostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  moodEmoji: string | null;
  createdAt: string;
  isDiaryLock: boolean;
}

interface CourtWrapperProps {
  posts: PostData[];
  fallback: React.ReactNode; // 2D fallback
}

function LoadingCourt() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#050a0e]">
      <div className="text-6xl bounce-ball mb-4">🏀</div>
      <p className="font-heading text-hoop-orange tracking-widest text-xl animate-pulse">
        LOADING THE COURT...
      </p>
    </div>
  );
}

export function CourtWrapper({ posts, fallback }: CourtWrapperProps) {
  const caps = useDeviceCapabilities();
  const [webglFailed, setWebglFailed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!caps.webglSupported) setWebglFailed(true);
  }, [caps.webglSupported]);

  // SSR / no-JS: show 2D fallback
  if (!mounted) return <>{fallback}</>;

  // WebGL not supported: show 2D fallback
  if (webglFailed) return <>{fallback}</>;

  return (
    <div className="relative w-full" style={{ height: "100vh" }}>
      <Suspense fallback={<LoadingCourt />}>
        <CourtScene posts={posts} caps={caps} />
      </Suspense>

      {/* HUD overlays */}
      <CourtHUD isMobile={caps.isMobile} />

      {/* Post modal */}
      <PostModal />
    </div>
  );
}
