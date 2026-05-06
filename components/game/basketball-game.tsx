"use client";

import { useRef, useEffect, useCallback, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Vec2 { x: number; y: number }

interface Ball {
  pos: Vec2;
  vel: Vec2;
  radius: number;
  spinning: number; // rotation angle
  active: boolean;  // in flight
}

interface Hoop {
  x: number;
  y: number;
  rimRadius: number;
  rimThickness: number;
}

interface GameState {
  ball: Ball;
  hoop: Hoop;
  dragging: boolean;
  dragStart: Vec2 | null;
  dragCurrent: Vec2 | null;
  makes: number;
  misses: number;
  streak: number;
  bestStreak: number;
  phase: "idle" | "aiming" | "flying" | "scored" | "missed";
  swishTimer: number;   // frames to show swish text
  netShake: number;     // frames to animate net
  confetti: Confetti[];
  message: string;
  messageTimer: number;
}

interface Confetti {
  x: number; y: number;
  vx: number; vy: number;
  color: string;
  size: number;
  rotation: number;
  rotSpeed: number;
  life: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const GRAVITY = 0.45;
const MAX_POWER = 22;
const BALL_RADIUS = 18;
const CONFETTI_COLORS = ["#FF5722", "#FFD700", "#39FF14", "#00BFFF", "#FF69B4", "#ffffff"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function spawnConfetti(cx: number, cy: number): Confetti[] {
  return Array.from({ length: 40 }, () => ({
    x: cx, y: cy,
    vx: (Math.random() - 0.5) * 10,
    vy: -(Math.random() * 8 + 2),
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: Math.random() * 7 + 3,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.3,
    life: 1,
  }));
}

function playSound(type: "swish" | "brick" | "bounce") {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === "swish") {
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(); osc.stop(ctx.currentTime + 0.4);
    } else if (type === "brick") {
      osc.frequency.value = 180;
      osc.type = "sawtooth";
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start(); osc.stop(ctx.currentTime + 0.25);
    } else {
      osc.frequency.value = 440;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(); osc.stop(ctx.currentTime + 0.1);
    }
  } catch {}
}

// ─── Drawing helpers ──────────────────────────────────────────────────────────
function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, h * 0.65);
  sky.addColorStop(0, "#87CEEB");
  sky.addColorStop(1, "#B0E0FF");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h * 0.65);

  // Court floor
  const floor = ctx.createLinearGradient(0, h * 0.65, 0, h);
  floor.addColorStop(0, "#E2C28B");
  floor.addColorStop(0.3, "#D4A96A");
  floor.addColorStop(1, "#C8935A");
  ctx.fillStyle = floor;
  ctx.fillRect(0, h * 0.65, w, h * 0.35);

  // Court lines
  ctx.strokeStyle = "rgba(100,40,10,0.5)";
  ctx.lineWidth = 2;
  // Half-court arc
  ctx.beginPath();
  ctx.arc(w / 2, h * 0.65, w * 0.18, Math.PI, 0);
  ctx.stroke();
  // Free throw line
  ctx.beginPath();
  ctx.moveTo(w * 0.25, h * 0.65);
  ctx.lineTo(w * 0.75, h * 0.65);
  ctx.stroke();
}

function drawBackboard(ctx: CanvasRenderingContext2D, hoop: Hoop) {
  const bw = 70, bh = 50;
  const bx = hoop.x - bw / 2;
  const by = hoop.y - bh - 10;

  // Board
  ctx.fillStyle = "#f5f5f5";
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 4);
  ctx.fill();
  ctx.stroke();

  // Inner rectangle (target box)
  ctx.strokeStyle = "#FF5722";
  ctx.lineWidth = 2;
  ctx.strokeRect(bx + 18, by + 12, 34, 22);

  // Pole
  ctx.fillStyle = "#888";
  ctx.fillRect(hoop.x - 4, hoop.y + 10, 8, 80);
}

function drawHoop(ctx: CanvasRenderingContext2D, hoop: Hoop, netShake: number) {
  const { x, y, rimRadius, rimThickness } = hoop;

  // Rim
  ctx.beginPath();
  ctx.arc(x, y, rimRadius, 0, Math.PI * 2);
  ctx.strokeStyle = "#FF4500";
  ctx.lineWidth = rimThickness;
  ctx.stroke();

  // Net (10 vertical lines + horizontal curves)
  const netDepth = 28 + Math.sin(netShake * 0.4) * (netShake > 0 ? 6 : 0);
  const netSegments = 8;
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 1;

  for (let i = 0; i <= netSegments; i++) {
    const angle = (i / netSegments) * Math.PI;
    const sx = x - rimRadius * Math.cos(angle);
    const sy = y;
    const ex = x - (rimRadius * 0.4) * Math.cos(angle);
    const ey = y + netDepth;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
  }

  // Horizontal net lines
  for (let row = 1; row <= 3; row++) {
    const t = row / 4;
    const rowY = y + netDepth * t;
    const rowR = rimRadius * (1 - t * 0.55);
    ctx.beginPath();
    ctx.arc(x, rowY, rowR, 0, Math.PI);
    ctx.stroke();
  }
}

function drawBall(ctx: CanvasRenderingContext2D, ball: Ball) {
  const { pos, radius, spinning } = ball;

  ctx.save();
  ctx.translate(pos.x, pos.y);
  ctx.rotate(spinning);

  // Shadow
  ctx.beginPath();
  ctx.ellipse(0, radius + 4, radius * 0.8, radius * 0.25, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.fill();

  // Ball body
  const grad = ctx.createRadialGradient(-radius * 0.3, -radius * 0.3, radius * 0.1, 0, 0, radius);
  grad.addColorStop(0, "#FF8C42");
  grad.addColorStop(0.6, "#FF5722");
  grad.addColorStop(1, "#C2410C");
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Seams
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.lineWidth = 1.5;
  // Equatorial
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();
  // Vertical
  ctx.beginPath();
  ctx.moveTo(0, -radius);
  ctx.bezierCurveTo(radius * 0.5, -radius * 0.5, radius * 0.5, radius * 0.5, 0, radius);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -radius);
  ctx.bezierCurveTo(-radius * 0.5, -radius * 0.5, -radius * 0.5, radius * 0.5, 0, radius);
  ctx.stroke();

  // Highlight
  ctx.beginPath();
  ctx.arc(-radius * 0.3, -radius * 0.3, radius * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fill();

  ctx.restore();
}

function drawAimLine(
  ctx: CanvasRenderingContext2D,
  start: Vec2,
  current: Vec2,
  ballStart: Vec2
) {
  const dx = start.x - current.x;
  const dy = start.y - current.y;
  const power = Math.min(Math.sqrt(dx * dx + dy * dy) / 4, MAX_POWER);
  const angle = Math.atan2(-dy, -dx);

  // Dotted trajectory preview
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 2;
  ctx.beginPath();

  const vx = Math.cos(angle) * power;
  const vy = Math.sin(angle) * power;
  let px = ballStart.x, py = ballStart.y;
  ctx.moveTo(px, py);
  for (let t = 0; t < 30; t++) {
    px += vx;
    py += vy + GRAVITY * t;
    ctx.lineTo(px, py);
    if (py > 600) break;
  }
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawPowerMeter(ctx: CanvasRenderingContext2D, power: number, maxPower: number, w: number, h: number) {
  const barW = 14, barH = 100;
  const bx = w - 36, by = h - barH - 60;
  const pct = power / maxPower;

  // Background
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.roundRect(bx, by, barW, barH, 4);
  ctx.fill();

  // Fill
  const fillH = barH * pct;
  const fillGrad = ctx.createLinearGradient(0, by + barH, 0, by + barH - fillH);
  fillGrad.addColorStop(0, "#39FF14");
  fillGrad.addColorStop(0.5, "#FFD700");
  fillGrad.addColorStop(1, "#FF5722");
  ctx.fillStyle = fillGrad;
  ctx.beginPath();
  ctx.roundRect(bx, by + barH - fillH, barW, fillH, 4);
  ctx.fill();

  // Border
  ctx.strokeStyle = "rgba(255,255,255,0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(bx, by, barW, barH, 4);
  ctx.stroke();

  // Label
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "bold 9px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("PWR", bx + barW / 2, by + barH + 14);
}

function drawScore(ctx: CanvasRenderingContext2D, makes: number, misses: number, streak: number) {
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.roundRect(10, 10, 130, 70, 8);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px Inter, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`🏀 Makes: ${makes}`, 20, 32);
  ctx.fillText(`🧱 Misses: ${misses}`, 20, 52);

  if (streak >= 2) {
    ctx.fillStyle = "#FFD700";
    ctx.fillText(`🔥 Streak: ${streak}`, 20, 72);
  }
}

function drawMessage(ctx: CanvasRenderingContext2D, msg: string, alpha: number, w: number, h: number) {
  if (!msg || alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = "bold 36px 'Bebas Neue', sans-serif";
  ctx.textAlign = "center";
  ctx.strokeStyle = "rgba(0,0,0,0.6)";
  ctx.lineWidth = 4;
  ctx.strokeText(msg, w / 2, h / 2 - 20);
  ctx.fillStyle = msg.includes("SWISH") || msg.includes("STREAK") ? "#FFD700" : "#FF5722";
  ctx.fillText(msg, w / 2, h / 2 - 20);
  ctx.restore();
}

function drawConfetti(ctx: CanvasRenderingContext2D, confetti: Confetti[]) {
  for (const c of confetti) {
    ctx.save();
    ctx.globalAlpha = c.life;
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rotation);
    ctx.fillStyle = c.color;
    ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.5);
    ctx.restore();
  }
}

// ─── Main component ───────────────────────────────────────────────────────────
interface BasketballGameProps {
  onStreak?: (streak: number) => void;
  muted?: boolean;
}

export function BasketballGame({ onStreak, muted = false }: BasketballGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const rafRef = useRef<number>(0);
  const [displayMakes, setDisplayMakes] = useState(0);
  const [displayMisses, setDisplayMisses] = useState(0);
  const [displayStreak, setDisplayStreak] = useState(0);

  const initState = useCallback((w: number, h: number): GameState => {
    const hoopX = w * 0.72;
    const hoopY = h * 0.38;
    return {
      ball: {
        pos: { x: w * 0.22, y: h * 0.62 },
        vel: { x: 0, y: 0 },
        radius: BALL_RADIUS,
        spinning: 0,
        active: false,
      },
      hoop: { x: hoopX, y: hoopY, rimRadius: 22, rimThickness: 5 },
      dragging: false,
      dragStart: null,
      dragCurrent: null,
      makes: 0,
      misses: 0,
      streak: 0,
      bestStreak: 0,
      phase: "idle",
      swishTimer: 0,
      netShake: 0,
      confetti: [],
      message: "",
      messageTimer: 0,
    };
  }, []);

  const resetBall = useCallback((state: GameState, w: number, h: number) => {
    state.ball.pos = { x: w * 0.22, y: h * 0.62 };
    state.ball.vel = { x: 0, y: 0 };
    state.ball.active = false;
    state.ball.spinning = 0;
    state.phase = "idle";
    state.dragging = false;
    state.dragStart = null;
    state.dragCurrent = null;
  }, []);

  const shoot = useCallback((state: GameState, dragStart: Vec2, dragEnd: Vec2) => {
    const dx = dragStart.x - dragEnd.x;
    const dy = dragStart.y - dragEnd.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 10) return; // too small a drag

    const power = Math.min(dist / 4, MAX_POWER);
    const angle = Math.atan2(-dy, -dx);

    state.ball.vel.x = Math.cos(angle) * power;
    state.ball.vel.y = Math.sin(angle) * power;
    state.ball.active = true;
    state.phase = "flying";
    state.dragging = false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = Math.min(420, Math.max(300, w * 0.55));
      canvas.width = w;
      canvas.height = h;
      if (!stateRef.current) {
        stateRef.current = initState(w, h);
      } else {
        // Re-position hoop and ball on resize
        const s = stateRef.current;
        s.hoop.x = w * 0.72;
        s.hoop.y = h * 0.38;
        if (!s.ball.active) {
          s.ball.pos = { x: w * 0.22, y: h * 0.62 };
        }
      }
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Game loop ──────────────────────────────────────────────────────────────
    const loop = () => {
      const s = stateRef.current;
      const ctx = canvas.getContext("2d");
      if (!s || !ctx) { rafRef.current = requestAnimationFrame(loop); return; }

      const w = canvas.width, h = canvas.height;

      // ── Physics update ──────────────────────────────────────────────────────
      if (s.ball.active) {
        s.ball.vel.y += GRAVITY;
        s.ball.pos.x += s.ball.vel.x;
        s.ball.pos.y += s.ball.vel.y;
        s.ball.spinning += s.ball.vel.x * 0.04;

        // Check scored: ball passes through hoop
        const hoop = s.hoop;
        const bx = s.ball.pos.x, by = s.ball.pos.y;
        const dx = bx - hoop.x, dy = by - hoop.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (
          s.phase === "flying" &&
          Math.abs(dy) < 12 &&
          dist < hoop.rimRadius - 4 &&
          s.ball.vel.y > 0
        ) {
          // SCORED
          s.makes++;
          s.streak++;
          if (s.streak > s.bestStreak) s.bestStreak = s.streak;
          s.phase = "scored";
          s.netShake = 30;
          s.confetti = spawnConfetti(hoop.x, hoop.y + 20);
          s.message = s.streak >= 3 ? `🔥 ${s.streak}x STREAK!` : "SWISH! 🏀";
          s.messageTimer = 90;
          if (!muted) playSound("swish");
          if ("vibrate" in navigator) navigator.vibrate([80, 30, 80]);
          onStreak?.(s.streak);
          setDisplayMakes(s.makes);
          setDisplayStreak(s.streak);
          setTimeout(() => resetBall(s, w, h), 1200);
        }

        // Rim collision (simplified — bounce off rim)
        const leftRim = { x: hoop.x - hoop.rimRadius, y: hoop.y };
        const rightRim = { x: hoop.x + hoop.rimRadius, y: hoop.y };
        for (const rim of [leftRim, rightRim]) {
          const rdx = bx - rim.x, rdy = by - rim.y;
          const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
          if (rdist < s.ball.radius + hoop.rimThickness / 2) {
            // Bounce
            const nx = rdx / rdist, ny = rdy / rdist;
            const dot = s.ball.vel.x * nx + s.ball.vel.y * ny;
            s.ball.vel.x = (s.ball.vel.x - 2 * dot * nx) * 0.5;
            s.ball.vel.y = (s.ball.vel.y - 2 * dot * ny) * 0.5;
            if (!muted) playSound("bounce");
          }
        }

        // Out of bounds → miss
        if (
          s.phase === "flying" &&
          (s.ball.pos.y > h + 40 || s.ball.pos.x < -40 || s.ball.pos.x > w + 40)
        ) {
          s.misses++;
          s.streak = 0;
          s.phase = "missed";
          s.message = "BRICK 🧱";
          s.messageTimer = 70;
          if (!muted) playSound("brick");
          setDisplayMisses(s.misses);
          setDisplayStreak(0);
          setTimeout(() => resetBall(s, w, h), 900);
        }
      }

      // Timers
      if (s.netShake > 0) s.netShake--;
      if (s.messageTimer > 0) s.messageTimer--;
      if (s.swishTimer > 0) s.swishTimer--;

      // Confetti physics
      s.confetti = s.confetti
        .map((c) => ({
          ...c,
          x: c.x + c.vx,
          y: c.y + c.vy,
          vy: c.vy + 0.25,
          rotation: c.rotation + c.rotSpeed,
          life: c.life - 0.018,
        }))
        .filter((c) => c.life > 0);

      // ── Draw ────────────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, w, h);
      drawBackground(ctx, w, h);
      drawBackboard(ctx, s.hoop);
      drawHoop(ctx, s.hoop, s.netShake);

      // Aim line while dragging
      if (s.dragging && s.dragStart && s.dragCurrent) {
        const dx = s.dragStart.x - s.dragCurrent.x;
        const dy = s.dragStart.y - s.dragCurrent.y;
        const power = Math.min(Math.sqrt(dx * dx + dy * dy) / 4, MAX_POWER);
        drawAimLine(ctx, s.dragStart, s.dragCurrent, s.ball.pos);
        drawPowerMeter(ctx, power, MAX_POWER, w, h);
      }

      drawBall(ctx, s.ball);
      drawConfetti(ctx, s.confetti);
      drawScore(ctx, s.makes, s.misses, s.streak);

      if (s.messageTimer > 0) {
        const alpha = Math.min(1, s.messageTimer / 20);
        drawMessage(ctx, s.message, alpha, w, h);
      }

      // Idle hint
      if (s.phase === "idle" && s.makes === 0 && s.misses === 0) {
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.font = "13px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Drag ball ↙ to aim & shoot", w / 2, h - 16);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    // ── Input helpers ──────────────────────────────────────────────────────────
    const getPos = (e: MouseEvent | Touch): Vec2 => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clientX = "clientX" in e ? e.clientX : (e as Touch).clientX;
      const clientY = "clientY" in e ? e.clientY : (e as Touch).clientY;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    };

    const isOnBall = (pos: Vec2): boolean => {
      const s = stateRef.current;
      if (!s || s.ball.active) return false;
      const dx = pos.x - s.ball.pos.x;
      const dy = pos.y - s.ball.pos.y;
      return Math.sqrt(dx * dx + dy * dy) < s.ball.radius * 2.5;
    };

    // Mouse
    const onMouseDown = (e: MouseEvent) => {
      const s = stateRef.current;
      if (!s || s.ball.active) return;
      const pos = getPos(e);
      if (isOnBall(pos)) {
        s.dragging = true;
        s.dragStart = { ...s.ball.pos };
        s.dragCurrent = pos;
        s.phase = "aiming";
      }
    };
    const onMouseMove = (e: MouseEvent) => {
      const s = stateRef.current;
      if (!s || !s.dragging) return;
      s.dragCurrent = getPos(e);
    };
    const onMouseUp = (e: MouseEvent) => {
      const s = stateRef.current;
      if (!s || !s.dragging || !s.dragStart) return;
      shoot(s, s.dragStart, getPos(e));
    };

    // Touch
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const s = stateRef.current;
      if (!s || s.ball.active) return;
      const pos = getPos(e.touches[0]);
      if (isOnBall(pos)) {
        s.dragging = true;
        s.dragStart = { ...s.ball.pos };
        s.dragCurrent = pos;
        s.phase = "aiming";
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const s = stateRef.current;
      if (!s || !s.dragging) return;
      s.dragCurrent = getPos(e.touches[0]);
    };
    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      const s = stateRef.current;
      if (!s || !s.dragging || !s.dragStart) return;
      const pos = e.changedTouches[0] ? getPos(e.changedTouches[0]) : s.dragCurrent!;
      shoot(s, s.dragStart, pos);
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd, { passive: false });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [initState, resetBall, shoot, muted, onStreak]);

  return (
    <div className="relative w-full select-none">
      <canvas
        ref={canvasRef}
        className="w-full rounded-sm cursor-crosshair touch-none"
        style={{ display: "block", background: "#87CEEB" }}
        aria-label="Basketball shooting game"
      />
      {/* React-rendered score overlay (for accessibility) */}
      <div className="sr-only" aria-live="polite">
        Makes: {displayMakes}, Misses: {displayMisses}, Streak: {displayStreak}
      </div>
    </div>
  );
}
