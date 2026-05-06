"use client";

import { useRef, useEffect, Suspense } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Environment } from "@react-three/drei";
import * as THREE from "three";
import { CourtFloor } from "./court-floor";
import { BasketballHoop } from "./basketball-hoop";
import { Scoreboard } from "./scoreboard";
import { PostCards3D } from "./post-cards-3d";
import { NeonSigns } from "./neon-signs";
import { ArenaLighting } from "./arena-lighting";
import { useCourtStore } from "@/store/court-store";
import type { DeviceCapabilities } from "@/hooks/use-device-capabilities";

interface PostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  moodEmoji: string | null;
  createdAt: string;
  isDiaryLock: boolean;
}

// ─── Auto-rotate camera when idle ────────────────────────────────────────────
function AutoRotateCamera({ isMobile }: { isMobile: boolean }) {
  const { camera } = useThree();
  const idleTimer = useRef(0);
  const lastInteraction = useRef(Date.now());
  const resetCamera = useCourtStore((s) => s.resetCamera);

  useEffect(() => {
    const onInteract = () => { lastInteraction.current = Date.now(); };
    window.addEventListener("mousemove", onInteract);
    window.addEventListener("touchstart", onInteract);
    return () => {
      window.removeEventListener("mousemove", onInteract);
      window.removeEventListener("touchstart", onInteract);
    };
  }, []);

  useFrame((_, delta) => {
    if (isMobile) return; // No auto-rotate on mobile

    const idle = (Date.now() - lastInteraction.current) / 1000;
    if (idle > 5) {
      // Cinematic orbit
      const angle = Date.now() * 0.0001;
      camera.position.x = Math.sin(angle) * 14;
      camera.position.z = Math.cos(angle) * 14;
      camera.lookAt(0, 1, 0);
    }
  });

  // Camera reset
  useEffect(() => {
    if (resetCamera) {
      camera.position.set(0, 6, 12);
      camera.lookAt(0, 1, 0);
    }
  }, [resetCamera, camera]);

  return null;
}

// ─── Stands (low-poly bleachers) ─────────────────────────────────────────────
function Stands() {
  return (
    <group>
      {/* Left stand */}
      <mesh position={[-14, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[12, 4, 2]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.9} />
      </mesh>
      {/* Right stand */}
      <mesh position={[14, 1, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[12, 4, 2]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.9} />
      </mesh>
      {/* Back stand */}
      <mesh position={[0, 1, -8]}>
        <boxGeometry args={[28, 4, 2]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.9} />
      </mesh>
      {/* Ceiling/roof suggestion */}
      <mesh position={[0, 12, 0]}>
        <boxGeometry args={[32, 0.5, 20]} />
        <meshStandardMaterial color="#0d0d1a" roughness={1} />
      </mesh>
    </group>
  );
}

// ─── Trophy case (Bako Moments) ───────────────────────────────────────────────
function TrophyCase() {
  const router_ref = useRef<{ push: (url: string) => void } | null>(null);
  const [hovered, setHovered] = useState(false);

  // Dynamic import to avoid SSR issues
  useEffect(() => {
    import("next/navigation").then(({ useRouter }) => {
      // Can't use hooks here, use window.location instead
    });
  }, []);

  return (
    <group
      position={[-8, 0, 4]}
      onClick={() => { window.location.href = "/bako-moments"; }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Case base */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.5, 0.6, 0.8]} />
        <meshStandardMaterial color="#2d1b00" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Glass case */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[1.4, 1.4, 0.7]} />
        <meshStandardMaterial
          color="#88ccff"
          transparent
          opacity={0.15}
          roughness={0}
          metalness={0.1}
        />
      </mesh>
      {/* Trophy */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.1, 0.2, 0.6, 8]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Glow */}
      <pointLight
        color="#FFD700"
        intensity={hovered ? 1.5 : 0.5}
        distance={3}
        position={[0, 1.5, 0]}
      />
    </group>
  );
}

// ─── Jukebox (Music) ──────────────────────────────────────────────────────────
function Jukebox() {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      position={[8, 0, 4]}
      onClick={() => { window.location.href = "/music"; }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Body */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[1.2, 1.6, 0.7]} />
        <meshStandardMaterial color="#1a0a2e" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 1.1, 0.36]}>
        <boxGeometry args={[0.8, 0.6, 0.02]} />
        <meshStandardMaterial
          color="#1DB954"
          emissive={new THREE.Color("#1DB954")}
          emissiveIntensity={hovered ? 1.5 : 0.8}
        />
      </mesh>
      {/* Speaker grille */}
      <mesh position={[0, 0.4, 0.36]}>
        <boxGeometry args={[0.9, 0.5, 0.02]} />
        <meshStandardMaterial color="#333" wireframe />
      </mesh>
      {/* Glow */}
      <pointLight
        color="#1DB954"
        intensity={hovered ? 2 : 0.8}
        distance={4}
        position={[0, 1, 0.5]}
      />
    </group>
  );
}

// Need useState import
import { useState } from "react";

// ─── Main scene ───────────────────────────────────────────────────────────────
interface CourtSceneInnerProps {
  posts: PostData[];
  caps: DeviceCapabilities;
}

function CourtSceneInner({ posts, caps }: CourtSceneInnerProps) {
  return (
    <>
      <AutoRotateCamera isMobile={caps.isMobile} />
      <ArenaLighting isMobile={caps.isMobile} />

      {/* Stars skybox */}
      <Stars
        radius={50}
        depth={30}
        count={caps.isMobile ? 500 : 2000}
        factor={3}
        fade
      />

      {/* Court */}
      <CourtFloor isMobile={caps.isMobile} />
      <Stands />

      {/* Hoops */}
      <BasketballHoop position={[0, 3.05, -6.5]} />
      <BasketballHoop position={[0, 3.05, 6.5]} rotation={[0, Math.PI, 0]} />

      {/* Scoreboard */}
      <Scoreboard />

      {/* Neon nav signs */}
      {!caps.isMobile && <NeonSigns />}

      {/* Floating post cards */}
      <PostCards3D
        posts={posts}
        isMobile={caps.isMobile}
        maxCards={caps.maxCards}
      />

      {/* Trophy case + Jukebox */}
      <TrophyCase />
      <Jukebox />

      {/* OrbitControls */}
      <OrbitControls
        enablePan={!caps.isMobile}
        enableZoom
        enableRotate
        minDistance={4}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2.1}
        touches={{
          ONE: caps.isMobile ? THREE.TOUCH.ROTATE : THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN,
        }}
      />
    </>
  );
}

// ─── Exported component ───────────────────────────────────────────────────────
interface CourtSceneProps {
  posts: PostData[];
  caps: DeviceCapabilities;
}

export function CourtScene({ posts, caps }: CourtSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 6, 12], fov: caps.isMobile ? 70 : 60 }}
      gl={{
        antialias: !caps.isMobile,
        alpha: false,
        powerPreference: caps.isMobile ? "low-power" : "high-performance",
        shadowMap: { enabled: !caps.isMobile, type: THREE.PCFSoftShadowMap } as unknown as boolean,
      }}
      dpr={[1, caps.pixelRatio]}
      frameloop={caps.frameloop}
      shadows={!caps.isMobile}
      style={{ background: "#050a0e" }}
    >
      <Suspense fallback={null}>
        <CourtSceneInner posts={posts} caps={caps} />
      </Suspense>
    </Canvas>
  );
}
