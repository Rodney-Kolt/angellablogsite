"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useCourtStore } from "@/store/court-store";

interface CourtFloorProps {
  isMobile: boolean;
}

function buildFloorTexture(isMobile: boolean, isNight: boolean): THREE.CanvasTexture {
  const size = isMobile ? 512 : 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  if (isNight) {
    // ── Night: darker maple, neon orange lines ──────────────────────────────
    const grad = ctx.createLinearGradient(0, 0, size, 0);
    grad.addColorStop(0, "#7A4A28");
    grad.addColorStop(0.2, "#9B6A42");
    grad.addColorStop(0.5, "#8A5A32");
    grad.addColorStop(0.8, "#9B6A42");
    grad.addColorStop(1, "#7A4A28");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Grain
    ctx.strokeStyle = "rgba(80,40,10,0.3)";
    ctx.lineWidth = 1;
    for (let i = 0; i < size; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + Math.random() * 6 - 3, size);
      ctx.stroke();
    }

    // Neon orange lines
    ctx.strokeStyle = "rgba(255,102,0,0.9)";
    ctx.shadowColor = "#FF6600";
    ctx.shadowBlur = 8;
    ctx.lineWidth = isMobile ? 3 : 4;
    drawCourtLines(ctx, size);
  } else {
    // ── Day: bright light maple, dark red/brown lines ───────────────────────
    const grad = ctx.createLinearGradient(0, 0, size, 0);
    grad.addColorStop(0, "#D4A96A");
    grad.addColorStop(0.15, "#E2C28B");
    grad.addColorStop(0.3, "#D4A96A");
    grad.addColorStop(0.5, "#EAC87A");
    grad.addColorStop(0.7, "#D4A96A");
    grad.addColorStop(0.85, "#E2C28B");
    grad.addColorStop(1, "#D4A96A");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Grain
    ctx.strokeStyle = "rgba(140,80,30,0.2)";
    ctx.lineWidth = 1;
    for (let i = 0; i < size; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + Math.random() * 6 - 3, size);
      ctx.stroke();
    }

    // Dark brown/red lines — high contrast on light floor
    ctx.strokeStyle = "rgba(100,30,10,0.9)";
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.lineWidth = isMobile ? 3 : 5;
    drawCourtLines(ctx, size);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 1);
  return tex;
}

function drawCourtLines(ctx: CanvasRenderingContext2D, size: number) {
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

  // Three-point arcs
  ctx.beginPath();
  ctx.arc(cx, size * 0.1, size * 0.35, 0, Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, size * 0.9, size * 0.35, Math.PI, Math.PI * 2);
  ctx.stroke();

  // Paint areas
  ctx.strokeRect(cx - size * 0.12, 0, size * 0.24, size * 0.22);
  ctx.strokeRect(cx - size * 0.12, size * 0.78, size * 0.24, size * 0.22);

  // Free throw circles
  ctx.beginPath();
  ctx.arc(cx, size * 0.22, size * 0.08, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, size * 0.78, size * 0.08, 0, Math.PI * 2);
  ctx.stroke();
}

export function CourtFloor({ isMobile }: CourtFloorProps) {
  const lightMode = useCourtStore((s) => s.lightMode);
  const isNight = lightMode === "night";

  const texture = useMemo(
    () => buildFloorTexture(isMobile, isNight),
    [isMobile, isNight]
  );

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[28, 15]} />
      <meshStandardMaterial
        map={texture}
        roughness={isNight ? 0.6 : 0.35}
        metalness={isNight ? 0.02 : 0.08}
      />
    </mesh>
  );
}
