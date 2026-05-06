"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ArenaLightingProps {
  isMobile: boolean;
}

export function ArenaLighting({ isMobile }: ArenaLightingProps) {
  const spotRef1 = useRef<THREE.SpotLight>(null);
  const spotRef2 = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    if (isMobile) return; // Static lights on mobile
    const t = state.clock.elapsedTime;
    if (spotRef1.current) {
      spotRef1.current.position.x = Math.sin(t * 0.3) * 3;
    }
    if (spotRef2.current) {
      spotRef2.current.position.x = Math.sin(t * 0.3 + Math.PI) * 3;
    }
  });

  return (
    <>
      {/* Ambient */}
      <ambientLight intensity={isMobile ? 0.5 : 0.3} color="#1a1a2e" />

      {/* Main arena overhead lights */}
      <pointLight position={[0, 8, 0]} intensity={isMobile ? 1.5 : 1} color="#fff5e0" distance={20} />
      <pointLight position={[-8, 6, 0]} intensity={0.6} color="#fff5e0" distance={15} />
      <pointLight position={[8, 6, 0]} intensity={0.6} color="#fff5e0" distance={15} />

      {/* Rim lights (orange accent) */}
      <pointLight position={[0, 3, 6]} intensity={0.8} color="#FF5722" distance={8} />
      <pointLight position={[0, 3, -6]} intensity={0.8} color="#FF5722" distance={8} />

      {/* Moving spotlights (desktop only) */}
      {!isMobile && (
        <>
          <spotLight
            ref={spotRef1}
            position={[-4, 10, 0]}
            angle={0.3}
            penumbra={0.5}
            intensity={2}
            color="#ffffff"
            castShadow
            shadow-mapSize={[512, 512]}
          />
          <spotLight
            ref={spotRef2}
            position={[4, 10, 0]}
            angle={0.3}
            penumbra={0.5}
            intensity={2}
            color="#FF5722"
            castShadow
            shadow-mapSize={[512, 512]}
          />
        </>
      )}

      {/* Neon green accent from floor */}
      <pointLight position={[0, 0.5, 0]} intensity={0.3} color="#39FF14" distance={10} />
    </>
  );
}
