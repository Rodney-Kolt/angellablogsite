"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useCourtStore } from "@/store/court-store";

interface ArenaLightingProps {
  isMobile: boolean;
}

export function ArenaLighting({ isMobile }: ArenaLightingProps) {
  const spotRef1 = useRef<THREE.SpotLight>(null);
  const spotRef2 = useRef<THREE.SpotLight>(null);
  const lightMode = useCourtStore((s) => s.lightMode);
  const isNight = lightMode === "night";

  useFrame((state) => {
    // Moving spotlights: desktop night only
    if (isMobile || !isNight) return;
    const t = state.clock.elapsedTime;
    if (spotRef1.current) {
      spotRef1.current.position.x = Math.sin(t * 0.4) * 6;
      spotRef1.current.position.z = Math.cos(t * 0.25) * 4;
    }
    if (spotRef2.current) {
      spotRef2.current.position.x = Math.sin(t * 0.4 + Math.PI) * 6;
      spotRef2.current.position.z = Math.cos(t * 0.25 + Math.PI) * 4;
    }
  });

  // ── DAY MODE ────────────────────────────────────────────────────────────────
  if (!isNight) {
    return (
      <>
        {/* Bright ambient — key to day mode visibility */}
        <ambientLight intensity={1.0} color="#ffffff" />

        {/* Sun / main directional from above-front */}
        <directionalLight
          position={[5, 12, 8]}
          intensity={1.5}
          color="#fff8f0"
          castShadow={!isMobile}
          shadow-mapSize={isMobile ? [256, 256] : [1024, 1024]}
          shadow-camera-near={0.5}
          shadow-camera-far={40}
          shadow-camera-left={-16}
          shadow-camera-right={16}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />

        {/* Fill light from opposite side */}
        <directionalLight position={[-5, 8, -4]} intensity={0.6} color="#e8f4ff" />

        {/* Soft overhead fill */}
        <pointLight position={[0, 10, 0]} intensity={0.8} color="#ffffff" distance={30} />

        {/* Rim accent — subtle orange */}
        <pointLight position={[0, 4, 6]} intensity={0.4} color="#FF8C42" distance={10} />
        <pointLight position={[0, 4, -6]} intensity={0.4} color="#FF8C42" distance={10} />
      </>
    );
  }

  // ── NIGHT MODE ──────────────────────────────────────────────────────────────
  return (
    <>
      {/* Low ambient — deep blue/purple */}
      <ambientLight intensity={0.3} color="#1a0a2e" />

      {/* Mobile: just 2 static lights for performance */}
      {isMobile ? (
        <>
          <pointLight position={[0, 8, 0]} intensity={1.2} color="#9b59b6" distance={20} />
          <pointLight position={[0, 3, 0]} intensity={0.6} color="#FF5722" distance={12} />
        </>
      ) : (
        <>
          {/* Moving purple spotlight */}
          <spotLight
            ref={spotRef1}
            position={[-4, 12, 0]}
            angle={0.25}
            penumbra={0.6}
            intensity={3}
            color="#9b59b6"
            castShadow
            shadow-mapSize={[512, 512]}
          />
          {/* Moving orange spotlight */}
          <spotLight
            ref={spotRef2}
            position={[4, 12, 0]}
            angle={0.25}
            penumbra={0.6}
            intensity={3}
            color="#FF5722"
            castShadow
            shadow-mapSize={[512, 512]}
          />
          {/* Neon green floor accent */}
          <pointLight position={[0, 0.3, 0]} intensity={0.5} color="#39FF14" distance={12} />
          {/* Rim glow */}
          <pointLight position={[0, 3, 6]} intensity={0.8} color="#FF5722" distance={8} />
          <pointLight position={[0, 3, -6]} intensity={0.8} color="#9b59b6" distance={8} />
        </>
      )}
    </>
  );
}
