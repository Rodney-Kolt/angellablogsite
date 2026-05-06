"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── Detect mobile once ──────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () =>
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    check();
    window.matchMedia("(max-width: 768px)").addEventListener("change", check);
    return () =>
      window.matchMedia("(max-width: 768px)").removeEventListener("change", check);
  }, []);
  return isMobile;
}

// ─── Basketball geometry with seams ──────────────────────────────────────────
interface BallProps {
  isMobile: boolean;
  isShaking?: boolean;
}

function BasketballGeometry({ isMobile, isShaking }: BallProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();
  const shakeTimer = useRef(0);

  // Segment counts: lower on mobile for performance
  const segments = isMobile ? 24 : 48;
  const torusSegments = isMobile ? 6 : 10;
  const torusTube = isMobile ? 0.02 : 0.016;

  useFrame((state) => {
    if (!groupRef.current) return;

    // Always rotate on Y
    groupRef.current.rotation.y += isMobile ? 0.005 : 0.008;

    // Mouse follow only on desktop
    if (!isMobile) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.y * 0.25,
        0.05
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        -mouse.x * 0.12,
        0.05
      );
    }

    // Float
    groupRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.7) * 0.07;

    // Hoop shake on Swish reaction (desktop only)
    if (isShaking && !isMobile) {
      shakeTimer.current += 0.3;
      groupRef.current.rotation.z =
        Math.sin(shakeTimer.current * 8) * 0.15 * Math.exp(-shakeTimer.current * 0.3);
      if (shakeTimer.current > 3) shakeTimer.current = 0;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main sphere */}
      <mesh>
        <sphereGeometry args={[1, segments, segments]} />
        <meshStandardMaterial
          color="#FF5722"
          roughness={0.72}
          metalness={0.02}
        />
      </mesh>

      {/* Seam: equatorial */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.003, torusTube, torusSegments, 80]} />
        <meshStandardMaterial color="#1a0800" roughness={0.95} />
      </mesh>

      {/* Seam: vertical */}
      <mesh>
        <torusGeometry args={[1.003, torusTube, torusSegments, 80]} />
        <meshStandardMaterial color="#1a0800" roughness={0.95} />
      </mesh>

      {/* Seam: curved left */}
      <mesh rotation={[0.38, 0, Math.PI / 2]}>
        <torusGeometry args={[1.003, torusTube, torusSegments, 80]} />
        <meshStandardMaterial color="#1a0800" roughness={0.95} />
      </mesh>

      {/* Seam: curved right */}
      <mesh rotation={[-0.38, 0, Math.PI / 2]}>
        <torusGeometry args={[1.003, torusTube, torusSegments, 80]} />
        <meshStandardMaterial color="#1a0800" roughness={0.95} />
      </mesh>
    </group>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────
interface Basketball3DProps {
  size?: number;
  className?: string;
  isShaking?: boolean;
}

export function Basketball3D({
  size = 280,
  className = "",
  isShaking = false,
}: Basketball3DProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{ antialias: !isMobile, alpha: true, powerPreference: "low-power" }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
        frameloop="always"
        shadows={false}
      >
        <ambientLight intensity={isMobile ? 0.6 : 0.4} />
        <directionalLight
          position={[4, 5, 4]}
          intensity={isMobile ? 0.8 : 1.2}
          color="#ffffff"
          castShadow={false}
        />
        {!isMobile && (
          <pointLight position={[0, 3, 2]} intensity={0.4} color="#39FF14" />
        )}
        <BasketballGeometry isMobile={isMobile} isShaking={isShaking} />
      </Canvas>
    </div>
  );
}
