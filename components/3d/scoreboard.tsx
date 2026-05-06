"use client";

import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useCourtStore } from "@/store/court-store";

function makeScoreboardTexture(data: {
  totalPosts: number;
  totalReactions: number;
  streak: number;
  latestTitle: string;
}): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, 512, 256);

  // Border
  ctx.strokeStyle = "#FF5722";
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, 504, 248);

  // Title
  ctx.fillStyle = "#FF5722";
  ctx.font = "bold 22px 'Arial'";
  ctx.textAlign = "center";
  ctx.fillText("KIRO COURT", 256, 36);

  // Divider
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(20, 48);
  ctx.lineTo(492, 48);
  ctx.stroke();

  // Stats
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 48px 'Arial'";
  ctx.textAlign = "center";
  ctx.fillText(String(data.totalPosts), 128, 110);
  ctx.fillText(String(data.totalReactions), 384, 110);

  ctx.fillStyle = "#aaaaaa";
  ctx.font = "14px 'Arial'";
  ctx.fillText("POSTS", 128, 132);
  ctx.fillText("REACTIONS", 384, 132);

  // Shot clock (streak)
  ctx.fillStyle = "#39FF14";
  ctx.font = "bold 36px 'Arial'";
  ctx.fillText(String(data.streak), 256, 110);
  ctx.fillStyle = "#aaaaaa";
  ctx.font = "12px 'Arial'";
  ctx.fillText("STREAK", 256, 132);

  // Divider
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(20, 148);
  ctx.lineTo(492, 148);
  ctx.stroke();

  // Ticker
  ctx.fillStyle = "#FF5722";
  ctx.font = "13px 'Arial'";
  ctx.textAlign = "center";
  const ticker = data.latestTitle.toUpperCase();
  ctx.fillText(
    ticker.length > 48 ? ticker.substring(0, 48) + "…" : ticker,
    256,
    175
  );
  ctx.fillStyle = "#555";
  ctx.font = "11px 'Arial'";
  ctx.fillText("LATEST POST", 256, 195);

  return new THREE.CanvasTexture(canvas);
}

export function Scoreboard() {
  const scoreboardData = useCourtStore((s) => s.scoreboardData);
  const setScoreboardData = useCourtStore((s) => s.setScoreboardData);
  const meshRef = useRef<THREE.Mesh>(null);

  // Fetch stats every 10 seconds
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setScoreboardData(data);
        }
      } catch {}
    };
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [setScoreboardData]);

  const texture = useMemo(
    () => makeScoreboardTexture(scoreboardData),
    [scoreboardData]
  );

  // Gentle float
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y =
      4.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
  });

  return (
    <group>
      {/* Main board */}
      <mesh ref={meshRef} position={[0, 4.5, -6]}>
        <planeGeometry args={[5.5, 2.75]} />
        <meshStandardMaterial map={texture} emissive="#111" emissiveIntensity={0.3} />
      </mesh>

      {/* Support poles */}
      {[-2.5, 2.5].map((x, i) => (
        <mesh key={i} position={[x, 2.5, -6]}>
          <cylinderGeometry args={[0.06, 0.06, 4, 8]} />
          <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* Rim lights on scoreboard */}
      <pointLight position={[0, 4.5, -5.5]} intensity={0.8} color="#FF5722" distance={6} />
    </group>
  );
}
