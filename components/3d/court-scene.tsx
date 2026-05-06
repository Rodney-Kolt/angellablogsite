"use client";

import { useRef, useEffect, Suspense, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
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

  useFrame(() => {
    if (isMobile) return;
    const idle = (Date.now() - lastInteraction.current) / 1000;
    if (idle > 5) {
      const angle = Date.now() * 0.0001;
      camera.position.x = Math.sin(angle) * 14;
      camera.position.z = Math.cos(angle) * 14;
      camera.lookAt(0, 1, 0);
    }
  });

  useEffect(() => {
    if (resetCamera) {
      camera.position.set(0, 6, 12);
      camera.lookAt(0, 1, 0);
    }
  }, [resetCamera, camera]);

  return null;
}

// ─── Stands — color reacts to light mode ─────────────────────────────────────
function Stands() {
  const lightMode = useCourtStore((s) => s.lightMode);
  const isNight = lightMode === "night";

  const standColor = isNight ? "#0d0d1a" : "#c8c8d8";
  const ceilColor  = isNight ? "#050510" : "#d0d8e8";

  return (
    <group>
      <mesh position={[-14, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[12, 4, 2]} />
        <meshStandardMaterial color={standColor} roughness={0.9} />
      </mesh>
      <mesh position={[14, 1, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <boxGeometry args={[12, 4, 2]} />
        <meshStandardMaterial color={standColor} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1, -8]}>
        <boxGeometry args={[28, 4, 2]} />
        <meshStandardMaterial color={standColor} roughness={0.9} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, 12, 0]}>
        <boxGeometry args={[32, 0.5, 20]} />
        <meshStandardMaterial color={ceilColor} roughness={1} />
      </mesh>

      {/* Night: tiny phone-light dots on stands */}
      {isNight && (
        <>
          {Array.from({ length: 20 }).map((_, i) => (
            <mesh
              key={i}
              position={[
                (Math.random() - 0.5) * 24,
                0.5 + Math.random() * 3,
                i % 2 === 0 ? -7.5 : (i % 4 === 1 ? -13.5 : 13.5),
              ]}
            >
              <sphereGeometry args={[0.04, 4, 4]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive={new THREE.Color("#88aaff")}
                emissiveIntensity={1.5}
              />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
}

// ─── Trophy case ──────────────────────────────────────────────────────────────
function TrophyCase() {
  const [hovered, setHovered] = useState(false);
  return (
    <group
      position={[-8, 0, 4]}
      onClick={() => { window.location.href = "/bako-moments"; }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.5, 0.6, 0.8]} />
        <meshStandardMaterial color="#2d1b00" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[1.4, 1.4, 0.7]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.15} roughness={0} metalness={0.1} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.1, 0.2, 0.6, 8]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
      </mesh>
      <pointLight color="#FFD700" intensity={hovered ? 1.5 : 0.5} distance={3} position={[0, 1.5, 0]} />
    </group>
  );
}

// ─── Jukebox ──────────────────────────────────────────────────────────────────
function Jukebox() {
  const [hovered, setHovered] = useState(false);
  return (
    <group
      position={[8, 0, 4]}
      onClick={() => { window.location.href = "/music"; }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[1.2, 1.6, 0.7]} />
        <meshStandardMaterial color="#1a0a2e" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 1.1, 0.36]}>
        <boxGeometry args={[0.8, 0.6, 0.02]} />
        <meshStandardMaterial
          color="#1DB954"
          emissive={new THREE.Color("#1DB954")}
          emissiveIntensity={hovered ? 1.5 : 0.8}
        />
      </mesh>
      <mesh position={[0, 0.4, 0.36]}>
        <boxGeometry args={[0.9, 0.5, 0.02]} />
        <meshStandardMaterial color="#333" wireframe />
      </mesh>
      <pointLight color="#1DB954" intensity={hovered ? 2 : 0.8} distance={4} position={[0, 1, 0.5]} />
    </group>
  );
}

// ─── Scene background synced to light mode ────────────────────────────────────
function SceneBackground() {
  const { scene } = useThree();
  const lightMode = useCourtStore((s) => s.lightMode);

  useEffect(() => {
    scene.background = new THREE.Color(lightMode === "day" ? "#87CEEB" : "#050a0e");
  }, [lightMode, scene]);

  return null;
}

// ─── Main scene inner ─────────────────────────────────────────────────────────
interface CourtSceneInnerProps {
  posts: PostData[];
  caps: DeviceCapabilities;
}

function CourtSceneInner({ posts, caps }: CourtSceneInnerProps) {
  const lightMode = useCourtStore((s) => s.lightMode);
  const isNight = lightMode === "night";

  return (
    <>
      <SceneBackground />
      <AutoRotateCamera isMobile={caps.isMobile} />
      <ArenaLighting isMobile={caps.isMobile} />

      {/* Stars: always in night, hidden in day */}
      {isNight && (
        <Stars
          radius={50}
          depth={30}
          count={caps.isMobile ? 500 : 2000}
          factor={3}
          fade
        />
      )}

      {/* Court */}
      <CourtFloor isMobile={caps.isMobile} />
      <Stands />

      {/* Hoops */}
      <BasketballHoop position={[0, 3.05, -6.5]} />
      <BasketballHoop position={[0, 3.05, 6.5]} rotation={[0, Math.PI, 0]} />

      {/* Scoreboard */}
      <Scoreboard />

      {/* Neon nav signs — always visible, brighter in night */}
      {!caps.isMobile && <NeonSigns />}

      {/* Floating post cards */}
      <PostCards3D posts={posts} isMobile={caps.isMobile} maxCards={caps.maxCards} />

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
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN,
        }}
      />
    </>
  );
}

// ─── Exported Canvas ──────────────────────────────────────────────────────────
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
      }}
      dpr={[1, caps.pixelRatio]}
      frameloop={caps.frameloop}
      shadows={!caps.isMobile}
    >
      <Suspense fallback={null}>
        <CourtSceneInner posts={posts} caps={caps} />
      </Suspense>
    </Canvas>
  );
}
