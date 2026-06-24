'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
  phase: number;
  driftOffset: number;
  flickerSpeed: number;
  flickerPhase: number;
}

const GOLD = '200,164,107'; // #C8A46B as RGB
const PARTICLE_COUNT = 45;
const MIN_OPACITY = 0.55;
const MAX_OPACITY = 0.9;

function createParticle(w: number, h: number, randomY = true): Particle {
  return {
    x: Math.random() * w,
    y: randomY ? Math.random() * h : h + Math.random() * 60,
    radius: Math.random() * 1.6 + 0.5,   // 0.5–2.1 px core
    opacity: Math.random() * (MAX_OPACITY - MIN_OPACITY) + MIN_OPACITY,
    speed: Math.random() * 0.3 + 0.07,   // slow upward drift
    phase: Math.random() * Math.PI * 2,
    driftOffset: Math.random() * Math.PI * 2,
    flickerSpeed: Math.random() * 0.007 + 0.002,
    flickerPhase: Math.random() * Math.PI * 2,
  };
}

export default function GoldParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    // Hide on narrow / mobile screens only — NOT on touchscreen laptops
    if (window.innerWidth < 1024) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ── Sizing ────────────────────────────────────────────────────────────────
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener('resize', setSize, { passive: true });

    // ── Seed particles scattered across visible area ──────────────────────────
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(canvas.width, canvas.height, true)
    );

    // ── Animation loop ────────────────────────────────────────────────────────
    const tick = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      for (const p of particlesRef.current) {
        // Drift upward
        p.y -= p.speed;

        // Gentle horizontal sway
        p.phase += 0.005;
        p.x += Math.sin(p.phase + p.driftOffset) * 0.15;

        // Subtle opacity flicker
        p.flickerPhase += p.flickerSpeed;
        const flicker = Math.sin(p.flickerPhase) * 0.12;
        const alpha = Math.max(0, Math.min(1, p.opacity + flicker));

        // Respawn quietly at the bottom when off-screen top
        if (p.y < -p.radius * 4) {
          p.y = height + p.radius * 4;
          p.x = Math.random() * width;
        }

        // Soft radial glow — with mix-blend-mode:screen, even moderate
        // opacity creates beautiful luminous dots on dark backgrounds
        const glowR = p.radius * 3;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        grad.addColorStop(0,   `rgba(${GOLD},${alpha})`);
        grad.addColorStop(0.4, `rgba(${GOLD},${alpha * 0.5})`);
        grad.addColorStop(1,   `rgba(${GOLD},0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', setSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        /**
         * mix-blend-mode: screen
         * ────────────────────────────────────────────────────────────────────
         * Screen blending formula: result = 1 - (1 - src)(1 - dst)
         * • On dark backgrounds (#0A0A0A): gold particles glow luminously
         * • On light areas: particles nearly disappear (screen adds light,
         *   near-white + gold ≈ white — invisible). Content is never covered.
         * • Replaces the need for z-index battle with section backgrounds.
         * ────────────────────────────────────────────────────────────────────
         */
        mixBlendMode: 'screen',
        zIndex: 10,           // above section backgrounds, always visible
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
