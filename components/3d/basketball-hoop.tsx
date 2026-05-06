"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useCourtStore } from "@/store/court-store";

interface HoopProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

export function BasketballHoop({ position, rotation = [0, 0, 0] }: HoopProps) {
  const groupRef = useRef<THREE.Group>(null);
  const netRef = useRef<THREE.Mesh>(null);
  const hoopShaking = useCourtStore((s) => s.hoopShaking);
  const shakeTimer = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (hoopShaking) {
      shakeTimer.current += delta * 12;
      groupRef.current.rotation.z =
        Math.sin(shakeTimer.current) * 0.08 * Math.exp(-shakeTimer.current * 0.15);
      if (shakeTimer.current > 4) shakeTimer.current = 0;
    } else {
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        0,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Backboard */}
      <mesh position={[0, 0.6, -0.1]}>
        <boxGeometry args={[1.8, 1.05, 0.05]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Backboard inner rectangle */}
      <mesh position={[0, 0.35, -0.07]}>
        <boxGeometry args={[0.6, 0.45, 0.01]} />
        <meshStandardMaterial color="#ff4400" roughness={0.5} />
      </mesh>

      {/* Pole */}
      <mesh position={[0, -2.5, -0.6]}>
        <cylinderGeometry args={[0.06, 0.06, 5, 8]} />
        <meshStandardMaterial color="#888" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Arm connecting pole to backboard */}
      <mesh position={[0, 0.1, -0.35]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
        <meshStandardMaterial color="#888" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Rim */}
      <mesh position={[0, 0, 0.23]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.23, 0.018, 8, 32]} />
        <meshStandardMaterial color="#FF4500" roughness={0.3} metalness={0.6} />
      </mesh>

      {/* Net (simplified cone) */}
      <mesh ref={netRef} position={[0, -0.22, 0.23]}>
        <coneGeometry args={[0.23, 0.44, 12, 1, true]} />
        <meshStandardMaterial
          color="#ffffff"
          wireframe
          opacity={0.7}
          transparent
        />
      </mesh>
    </group>
  );
}
