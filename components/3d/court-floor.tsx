"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";

interface CourtFloorProps {
  isMobile: boolean;
}

export function CourtFloor({ isMobile }: CourtFloorProps) {
  // Build court texture procedurally (no external file needed)
  const texture = useMemo(() => {
    const size = isMobile ? 512 : 1024;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // Wood base — warm maple color
    const grad = ctx.createLinearGradient(0, 0, size, 0);
    grad.addColorStop(0, "#C8935A");
    grad.addColorStop(0.15, "#D4A574");
    grad.addColorStop(0.3, "#C8935A");
    grad.addColorStop(0.5, "#D9AA7A");
    grad.addColorStop(0.7, "#C8935A");
    grad.addColorStop(0.85, "#D4A574");
    grad.addColorStop(1, "#C8935A");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Wood grain lines
    ctx.strokeStyle = "rgba(160,100,50,0.25)";
    ctx.lineWidth = 1;
    for (let i = 0; i < size; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + Math.random() * 6 - 3, size);
      ctx.stroke();
    }

    // Court lines (white)
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.lineWidth = isMobile ? 3 : 4;

    const cx = size / 2;
    const cy = size / 2;

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.12, 0, Math.PI * 2);
    ctx.stroke();

    // Half-court line
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(size, cy);
    ctx.stroke();

    // Three-point arcs (simplified)
    ctx.beginPath();
    ctx.arc(cx, size * 0.1, size * 0.35, 0, Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, size * 0.9, size * 0.35, Math.PI, Math.PI * 2);
    ctx.stroke();

    // Paint (key) areas
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.strokeRect(cx - size * 0.12, 0, size * 0.24, size * 0.22);
    ctx.strokeRect(cx - size * 0.12, size * 0.78, size * 0.24, size * 0.22);

    // Free throw circles
    ctx.beginPath();
    ctx.arc(cx, size * 0.22, size * 0.08, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, size * 0.78, size * 0.08, 0, Math.PI * 2);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
    return tex;
  }, [isMobile]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[28, 15]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.4}
        metalness={0.05}
      />
    </mesh>
  );
}
