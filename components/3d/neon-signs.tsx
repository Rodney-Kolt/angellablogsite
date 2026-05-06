"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRouter } from "next/navigation";

interface NeonSignProps {
  label: string;
  href: string;
  position: [number, number, number];
  color: string;
  rotation?: [number, number, number];
}

function NeonSign({ label, href, position, color, rotation = [0, 0, 0] }: NeonSignProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const col = new THREE.Color(color);

  useFrame((state) => {
    if (!meshRef.current) return;
    // Neon flicker
    const flicker = 0.8 + Math.sin(state.clock.elapsedTime * 8 + position[0]) * 0.1;
    (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      hovered ? 1.2 : flicker * 0.6;
    // Hover scale
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, hovered ? 1.1 : 1, 0.1)
    );
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Sign backing */}
      <mesh
        ref={meshRef}
        onClick={() => router.push(href)}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={[label.length * 0.18 + 0.4, 0.5, 0.06]} />
        <meshStandardMaterial
          color="#111"
          emissive={col}
          emissiveIntensity={0.6}
          roughness={0.8}
        />
      </mesh>

      {/* Neon tube border */}
      <mesh>
        <boxGeometry args={[label.length * 0.18 + 0.5, 0.6, 0.03]} />
        <meshStandardMaterial
          color={color}
          emissive={col}
          emissiveIntensity={hovered ? 2 : 1}
          wireframe
        />
      </mesh>

      {/* Point light for glow */}
      <pointLight
        color={color}
        intensity={hovered ? 1.5 : 0.6}
        distance={3}
        position={[0, 0, 0.2]}
      />
    </group>
  );
}

export function NeonSigns() {
  const signs = [
    { label: "HOME", href: "/", color: "#FF5722", position: [-10, 3, -4] as [number, number, number], rotation: [0, 0.4, 0] as [number, number, number] },
    { label: "ARCHIVE", href: "/archive", color: "#39FF14", position: [-10, 2, -1] as [number, number, number], rotation: [0, 0.4, 0] as [number, number, number] },
    { label: "MIXTAPE", href: "/music", color: "#1DB954", position: [10, 3, -4] as [number, number, number], rotation: [0, -0.4, 0] as [number, number, number] },
    { label: "BAKO", href: "/bako-moments", color: "#FFD700", position: [10, 2, -1] as [number, number, number], rotation: [0, -0.4, 0] as [number, number, number] },
  ];

  return (
    <group>
      {signs.map((sign) => (
        <NeonSign key={sign.href} {...sign} />
      ))}
    </group>
  );
}
