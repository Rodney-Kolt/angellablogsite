"use client";

import { useRef, useState, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useCourtStore } from "@/store/court-store";
import toast from "react-hot-toast";

interface ShootBallProps {
  postId: string;
  position: [number, number, number];
  isMobile: boolean;
  onSwish: () => void;
}

// Hoop position in world space
const HOOP_POS = new THREE.Vector3(0, 3.05, -6.5);

export function ShootBall({ postId, position, isMobile, onSwish }: ShootBallProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [shooting, setShooting] = useState(false);
  const [power, setPower] = useState(0);
  const [holding, setHolding] = useState(false);
  const velRef = useRef(new THREE.Vector3());
  const posRef = useRef(new THREE.Vector3(...position));
  const triggerHoopShake = useCourtStore((s) => s.triggerHoopShake);
  const muted = useCourtStore((s) => s.muted);
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startHold = useCallback(() => {
    if (shooting) return;
    setHolding(true);
    setPower(0);
    holdTimer.current = setInterval(() => {
      setPower((p) => Math.min(p + 5, 100));
    }, 50);
  }, [shooting]);

  const release = useCallback(async () => {
    if (!holding) return;
    setHolding(false);
    if (holdTimer.current) clearInterval(holdTimer.current);

    const currentPower = power;
    setPower(0);
    setShooting(true);

    // Calculate velocity toward hoop
    const start = new THREE.Vector3(...position);
    const target = HOOP_POS.clone();
    const dir = target.clone().sub(start).normalize();
    const speed = 0.08 + (currentPower / 100) * 0.12;
    velRef.current.copy(dir.multiplyScalar(speed));
    velRef.current.y += 0.06; // arc
    posRef.current.copy(start);
  }, [holding, power, position]);

  useFrame(() => {
    if (!meshRef.current || !shooting) return;

    // Apply gravity
    velRef.current.y -= 0.003;
    posRef.current.add(velRef.current);
    meshRef.current.position.copy(posRef.current);
    meshRef.current.rotation.x += 0.1;

    // Check if near hoop
    const dist = posRef.current.distanceTo(HOOP_POS);
    if (dist < 0.4) {
      // SWISH!
      triggerHoopShake();
      onSwish();
      if (!muted) {
        // Simple beep via AudioContext
        try {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 880;
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        } catch {}
      }
      if (isMobile && "vibrate" in navigator) navigator.vibrate([100, 50, 100]);
      toast.success("🏀 SWISH! Reaction counted!", { icon: "🔥" });
      resetBall();
    }

    // Out of bounds / missed
    if (
      posRef.current.y < -2 ||
      Math.abs(posRef.current.x) > 15 ||
      Math.abs(posRef.current.z) > 15
    ) {
      if (!muted) {
        try {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 220;
          osc.type = "sawtooth";
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
          osc.start();
          osc.stop(ctx.currentTime + 0.2);
        } catch {}
      }
      toast("🧱 Brick! Try again.", { icon: "😅" });
      resetBall();
    }
  });

  const resetBall = () => {
    setShooting(false);
    posRef.current.set(...position);
    velRef.current.set(0, 0, 0);
    if (meshRef.current) {
      meshRef.current.position.set(...position);
      meshRef.current.rotation.set(0, 0, 0);
    }
  };

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        onPointerDown={startHold}
        onPointerUp={release}
        onPointerLeave={release}
      >
        <sphereGeometry args={[0.15, isMobile ? 8 : 16, isMobile ? 8 : 16]} />
        <meshStandardMaterial color="#FF5722" roughness={0.7} />
      </mesh>

      {/* Power meter (mobile hold indicator) */}
      {holding && power > 0 && (
        <mesh position={[position[0], position[1] + 0.4, position[2]]}>
          <boxGeometry args={[(power / 100) * 0.6, 0.06, 0.02]} />
          <meshStandardMaterial
            color={power > 70 ? "#39FF14" : power > 40 ? "#FFD700" : "#FF5722"}
            emissive={new THREE.Color(power > 70 ? "#39FF14" : "#FF5722")}
            emissiveIntensity={0.8}
          />
        </mesh>
      )}
    </group>
  );
}
