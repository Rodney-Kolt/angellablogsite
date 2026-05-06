"use client";

import { useRef, useMemo, useState, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useCourtStore } from "@/store/court-store";

interface PostData {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  moodEmoji: string | null;
  createdAt: string;
  isDiaryLock: boolean;
}

interface PostCardMeshProps {
  post: PostData;
  position: [number, number, number];
  index: number;
  isMobile: boolean;
  isNight: boolean;
}

function makeCardTexture(post: PostData, isNight: boolean): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 160;
  const ctx = canvas.getContext("2d")!;

  if (isNight) {
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, 256, 160);
    ctx.fillStyle = "#FF5722";
    ctx.fillRect(0, 0, 256, 6);
    ctx.font = "28px serif";
    ctx.fillText(post.moodEmoji ?? "🏀", 12, 44);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Arial";
    ctx.fillText(
      post.title.length > 28 ? post.title.substring(0, 28) + "…" : post.title,
      12, 70
    );
    if (post.excerpt) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px Arial";
      wrapText(ctx, post.excerpt, 12, 92, 232, 16, 130);
    }
    ctx.fillStyle = "#475569";
    ctx.font = "10px Arial";
    ctx.fillText(new Date(post.createdAt).toLocaleDateString(), 12, 150);
  } else {
    // Day: white card, dark text — high contrast
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 256, 160);
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 254, 158);
    ctx.fillStyle = "#FF5722";
    ctx.fillRect(0, 0, 256, 6);
    ctx.font = "28px serif";
    ctx.fillText(post.moodEmoji ?? "🏀", 12, 44);
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 14px Arial";
    ctx.fillText(
      post.title.length > 28 ? post.title.substring(0, 28) + "…" : post.title,
      12, 70
    );
    if (post.excerpt) {
      ctx.fillStyle = "#475569";
      ctx.font = "11px Arial";
      wrapText(ctx, post.excerpt, 12, 92, 232, 16, 130);
    }
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10px Arial";
    ctx.fillText(new Date(post.createdAt).toLocaleDateString(), 12, 150);
  }

  if (post.isDiaryLock) {
    ctx.font = "12px serif";
    ctx.fillText("🔒", 230, 150);
  }

  return new THREE.CanvasTexture(canvas);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxY: number
) {
  const short = text.length > 80 ? text.substring(0, 80) + "…" : text;
  const words = short.split(" ");
  let line = "";
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word + " ";
      y += lineHeight;
      if (y > maxY) return;
    } else {
      line = test;
    }
  }
  if (y <= maxY) ctx.fillText(line, x, y);
}

function PostCardMesh({ post, position, index, isMobile, isNight }: PostCardMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { mouse } = useThree();
  const setSelectedPost = useCourtStore((s) => s.setSelectedPost);

  const texture = useMemo(
    () => makeCardTexture(post, isNight),
    [post, isNight]
  );

  const baseY = position[1];

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = baseY + Math.sin(t * 0.6 + index * 0.8) * 0.12;
    meshRef.current.rotation.y += 0.003;
    if (!isMobile && hovered) {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        mouse.y * 0.2,
        0.08
      );
    }
    const targetScale = hovered ? 1.15 : 1;
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1)
    );
  });

  const handleClick = useCallback(() => {
    setSelectedPost({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      moodEmoji: post.moodEmoji,
      createdAt: post.createdAt,
      isDiaryLock: post.isDiaryLock,
    });
  }, [post, setSelectedPost]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <boxGeometry args={[2.2, 1.4, 0.04]} />
      <meshStandardMaterial
        map={texture}
        roughness={isNight ? 0.3 : 0.15}
        metalness={0.05}
        emissive={hovered ? new THREE.Color("#FF5722") : new THREE.Color("#000000")}
        emissiveIntensity={hovered ? (isNight ? 0.2 : 0.08) : 0}
      />
    </mesh>
  );
}

interface PostCards3DProps {
  posts: PostData[];
  isMobile: boolean;
  maxCards: number;
}

export function PostCards3D({ posts, isMobile, maxCards }: PostCards3DProps) {
  const lightMode = useCourtStore((s) => s.lightMode);
  const isNight = lightMode === "night";
  const visiblePosts = posts.slice(0, maxCards);
  const count = visiblePosts.length;

  const positions = useMemo<[number, number, number][]>(() => {
    return visiblePosts.map((_, i) => {
      const angle = (i / Math.max(count - 1, 1)) * Math.PI - Math.PI / 2;
      const radius = isMobile ? 5 : 7;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius * 0.5 + 2;
      const y = 1.5 + Math.sin((i / count) * Math.PI) * 0.5;
      return [x, y, z];
    });
  }, [visiblePosts, count, isMobile]);

  return (
    <group>
      {visiblePosts.map((post, i) => (
        <PostCardMesh
          key={`${post.id}-${isNight}`}
          post={post}
          position={positions[i]}
          index={i}
          isMobile={isMobile}
          isNight={isNight}
        />
      ))}
    </group>
  );
}
