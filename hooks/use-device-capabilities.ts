"use client";

import { useEffect, useState } from "react";

export interface DeviceCapabilities {
  isMobile: boolean;
  isLowEnd: boolean;
  webglSupported: boolean;
  pixelRatio: number;
  maxCards: number;
  shadowMapSize: number;
  enableBloom: boolean;
  enablePhysics: boolean;
  frameloop: "always" | "demand";
  targetFPS: number;
}

function detectWebGL(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    const ctx =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return !!ctx;
  } catch {
    return false;
  }
}

function detectLowEnd(): boolean {
  if (typeof navigator === "undefined") return false;
  // Hardware concurrency < 4 = likely low-end
  const cores = navigator.hardwareConcurrency ?? 4;
  // Device memory < 4GB (Chrome only)
  const mem = (navigator as { deviceMemory?: number }).deviceMemory ?? 4;
  return cores < 4 || mem < 4;
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [caps, setCaps] = useState<DeviceCapabilities>({
    isMobile: false,
    isLowEnd: false,
    webglSupported: true,
    pixelRatio: 1,
    maxCards: 12,
    shadowMapSize: 1024,
    enableBloom: true,
    enablePhysics: true,
    frameloop: "always",
    targetFPS: 60,
  });

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    const lowEnd = detectLowEnd();
    const webgl = detectWebGL();
    const dpr = Math.min(window.devicePixelRatio ?? 1, mobile ? 1.5 : 2);

    setCaps({
      isMobile: mobile,
      isLowEnd: lowEnd,
      webglSupported: webgl,
      pixelRatio: dpr,
      // Mobile: show 6 cards, low-end: 4, desktop: 12
      maxCards: mobile ? (lowEnd ? 4 : 6) : 12,
      // Shadow map: 256 mobile low-end, 512 mobile, 1024 desktop
      shadowMapSize: mobile ? (lowEnd ? 256 : 512) : 1024,
      // Bloom only on desktop high-end
      enableBloom: !mobile && !lowEnd,
      // Physics only on desktop
      enablePhysics: !mobile,
      // Demand rendering on mobile saves battery
      frameloop: mobile ? "demand" : "always",
      targetFPS: mobile ? 30 : 60,
    });
  }, []);

  return caps;
}
