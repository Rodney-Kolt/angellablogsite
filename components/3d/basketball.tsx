"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function BasketballMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    // Slow Y rotation
    meshRef.current.rotation.y += 0.008;
    // Subtle mouse tilt
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      mouse.y * 0.3,
      0.05
    );
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      -mouse.x * 0.15,
      0.05
    );
    // Gentle float
    meshRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <mesh ref={meshRef} castShadow={false}>
      <sphereGeometry args={[1, 64, 64]} />
      {/* Orange base material */}
      <meshStandardMaterial
        color="#F97316"
        roughness={0.7}
        metalness={0.05}
      />
    </mesh>
  );
}

// Basketball seam lines drawn as torus geometries
function BasketballSeams() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.008;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      mouse.y * 0.3,
      0.05
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -mouse.x * 0.15,
      0.05
    );
    groupRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  const seamMaterial = (
    <meshStandardMaterial color="#1a0a00" roughness={0.9} metalness={0} />
  );

  return (
    <group ref={groupRef}>
      {/* Main body */}
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#F97316" roughness={0.75} metalness={0.02} />
      </mesh>

      {/* Equatorial seam */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.002, 0.018, 8, 100]} />
        {seamMaterial}
      </mesh>

      {/* Vertical seam */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[1.002, 0.018, 8, 100]} />
        {seamMaterial}
      </mesh>

      {/* Curved seam 1 */}
      <mesh rotation={[0.4, 0, Math.PI / 2]}>
        <torusGeometry args={[1.002, 0.018, 8, 100]} />
        {seamMaterial}
      </mesh>

      {/* Curved seam 2 */}
      <mesh rotation={[-0.4, 0, Math.PI / 2]}>
        <torusGeometry args={[1.002, 0.018, 8, 100]} />
        {seamMaterial}
      </mesh>
    </group>
  );
}

interface Basketball3DProps {
  size?: number;
  className?: string;
}

export function Basketball3D({ size = 280, className = "" }: Basketball3DProps) {
  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        frameloop="always"
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-3, -2, -3]} intensity={0.3} color="#F97316" />
        <pointLight position={[0, 3, 2]} intensity={0.5} color="#39FF14" />
        <BasketballSeams />
      </Canvas>
    </div>
  );
}

// Mini spinning ball for cards / inline use (no Canvas overhead)
export function BasketballIcon({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block text-2xl select-none ${className}`}
      style={{ display: "inline-block" }}
      aria-hidden="true"
    >
      🏀
    </span>
  );
}
