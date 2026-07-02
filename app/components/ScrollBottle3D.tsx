'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Environment, Lightformer } from '@react-three/drei';
import { motion, useScroll, animate, useMotionValue } from 'framer-motion';
import * as THREE from 'three';

/**
 * ScrollBottle3D
 * ──────────────────────────────────────────────────────────────────────────
 * One custom-built 3D perfume flacon (no image, no external model): a slim
 * translucent amber-glass body (procedural LatheGeometry) with a visible
 * liquid level and a chunky rounded gold cap. It lives in a transparent fixed
 * canvas and reacts to scroll.
 *
 * Placement = "background accent":
 *   The homepage sections have full-width OPAQUE backgrounds, so a layer
 *   behind them (lower z-index) would be invisible. Instead the flacon is kept
 *   small, low-opacity and slightly blurred, and travels along the empty SIDE
 *   GUTTERS beside the centred content — so it reads as a recessed backdrop
 *   object, never covering the product cards.
 *
 * Motion = two layers:
 *   1. TRAVEL  — glides between gutter pose stops + scales (lands somewhere new
 *      each section).
 *   2. GESTURE — every section band performs a DIFFERENT move (flip, barrel
 *      roll, extra spin, breathing pulse, sway, tumble, closing nod), built
 *      from (1−cos)/sin curves that are zero at band edges → seamless hand-off.
 *   Plus a slow turntable + idle bob so it stays alive when scrolling pauses.
 *
 * Guards: desktop only (≥1024px), off for prefers-reduced-motion, mounts
 * client-side after gate check, pointer-events none, fades in after the hero.
 * ────────────────────────────────────────────────────────────────────────── */

const TAU = Math.PI * 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10); // smootherstep

/* ── Travel pose stops (world units). Camera at z≈7.
 *    Pose 0/1 = the banner: big flacon on the RIGHT (where the old static
 *    bottle sat). From there it travels the side gutters, alternating sides
 *    and scaling per section. Scales are large now — it's the showpiece.  ── */
type Pose = { x: number; y: number; z: number; s: number };
const POSES: Pose[] = [
  { x: 2.2, y: -0.55, z: 0.0, s: 0.86 }, // 0  BANNER (right, dropped down so
  { x: 2.2, y: -0.55, z: 0.0, s: 0.86 }, // 1  the cap clears the header)
  { x: -2.3, y: 0.15, z: -0.3, s: 0.72 }, // 2
  { x: 2.3, y: -0.15, z: 0.15, s: 0.8 }, // 3
  { x: -2.4, y: 0.2, z: -0.4, s: 0.7 }, // 4
  { x: 2.3, y: 0.0, z: 0.25, s: 0.82 }, // 5
  { x: -2.2, y: -0.2, z: -0.2, s: 0.74 }, // 6
  { x: 2.2, y: 0.15, z: 0.0, s: 0.78 }, // 7
  { x: 1.6, y: 0.0, z: 0.35, s: 0.88 }, // 8  drifts inward for finale
];

/* One gesture per band (POSES.length − 1 bands). */
type Gesture =
  | 'none'
  | 'flipX'
  | 'rollZ'
  | 'spinY'
  | 'breathe'
  | 'sway'
  | 'tumble'
  | 'nod';
const GESTURES: Gesture[] = [
  'none', // 0 hero
  'flipX', // 1
  'rollZ', // 2
  'spinY', // 3
  'breathe', // 4
  'sway', // 5
  'tumble', // 6
  'nod', // 7
];

/* Resolve a band's gesture at local progress u ∈ [0,1] into extra rotation /
 * scale. Every curve is 0 at u=0 and u=1 → seamless band-to-band hand-off. */
function gesture(kind: Gesture, u: number) {
  const full = 1 - Math.cos(u * TAU); // 0 → 2 → 0, zero slope at ends
  const half = Math.sin(u * Math.PI); // 0 → 1 → 0
  const swing = Math.sin(u * TAU); // 0 → +1 → 0 → −1 → 0
  const out = { rx: 0, ry: 0, rz: 0, sx: 0 };
  switch (kind) {
    case 'flipX':
      out.rx = full * Math.PI;
      break;
    case 'rollZ':
      out.rz = full * Math.PI;
      break;
    case 'spinY':
      out.ry = full * Math.PI;
      break;
    case 'breathe':
      out.sx = half * 0.14;
      out.rx = half * 0.26;
      break;
    case 'sway':
      out.rz = swing * 0.5;
      out.ry = half * 0.6;
      break;
    case 'tumble':
      out.rx = half * 0.85;
      out.rz = full * 0.45;
      break;
    case 'nod':
      out.rx = half * 0.38;
      break;
  }
  return out;
}

/* Liquid column geometry — a straight amber cylinder that sits in the lower,
 * straight-walled part of the body and scales up from the base to "fill". */
const LIQ_BOTTOM = -1.08; // interior floor
const LIQ_HEIGHT = 1.36; // full-fill height → surface lands ~⅔ up the body

/* ── Procedural glass flacon ─────────────────────────────────────────────── */
function Flacon({ progress }: { progress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const liquid = useRef<THREE.Group>(null);
  const smoothed = useRef(0);

  // Slim, elegant silhouette: flat base → straight body → soft shoulder →
  // narrow neck + lip. Round (lathe) but proportioned to read as perfume.
  const glassProfile = useMemo(
    () =>
      [
        [0.0, -1.15],
        [0.6, -1.15],
        [0.7, -1.02],
        [0.72, 0.35],
        [0.7, 0.5],
        [0.5, 0.66],
        [0.26, 0.8],
        [0.2, 1.02],
        [0.25, 1.07],
      ].map(([x, y]) => new THREE.Vector2(x, y)),
    []
  );

  // Brand label — drawn to a canvas (fully offline, transparent) and printed
  // on the front of the glass so it rotates into view as the flacon turns.
  const labelTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');
    if (!ctx) return null;

    const gold = '#f3e0b0';
    ctx.clearRect(0, 0, 512, 512);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = gold;
    ctx.strokeStyle = gold;
    // soft dark shadow lifts the gold off the amber glass for legibility
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = 8;

    // top flourish
    ctx.globalAlpha = 0.85;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(150, 176);
    ctx.lineTo(362, 176);
    ctx.stroke();

    // brand wordmark — spacing/size tuned to sit well inside the 512 canvas
    ctx.globalAlpha = 1;
    ctx.letterSpacing = '6px';
    ctx.font = '600 78px Georgia, "Playfair Display", serif';
    ctx.fillText('YAM-N7', 256, 250);

    // tagline
    ctx.letterSpacing = '14px';
    ctx.globalAlpha = 0.82;
    ctx.font = '500 28px Georgia, serif';
    ctx.fillText('PARFUM', 263, 316);

    // bottom flourish
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.moveTo(150, 354);
    ctx.lineTo(362, 354);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 8;
    tex.needsUpdate = true;
    return tex;
  }, []);

  const bands = POSES.length - 1;

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;

    const target = clamp01(progress.current);
    smoothed.current += (target - smoothed.current) * Math.min(1, dt * 4.5);
    const s = smoothed.current;
    const t = state.clock.elapsedTime;

    // Banner ENTRANCE: on load the flacon drops in from above, spinning and
    // scaling up, then settles into pose 0 over ~1.6s. intro 0→1.
    const intro = smoother(clamp01(t / 1.6));

    const f = s * bands;
    const i = Math.min(Math.floor(f), bands - 1);
    const u = clamp01(f - i);
    const a = POSES[i];
    const b = POSES[i + 1];
    const e = u * u * (3 - 2 * u); // smoothstep travel

    const gs = gesture(GESTURES[i], u);
    const scaleBase = lerp(a.s, b.s, e) + gs.sx;

    // TRAVEL (gutter to gutter) + entrance drop from above
    g.position.x = lerp(a.x, b.x, e);
    g.position.y =
      lerp(a.y, b.y, e) + Math.sin(t * 0.8) * 0.05 + (1 - intro) * 5.5;
    g.position.z = lerp(a.z, b.z, e);

    // SCALE — springs up from near-zero during the entrance
    g.scale.setScalar(scaleBase * lerp(0.04, 1, intro));

    // ROTATION.
    // The label lives on the +z face; rotation.y = 0 points it at the camera.
    // On the banner (s = 0) the entrance spin unwinds to 0 and there's only a
    // gentle sway — so the flacon SETTLES showing its "YAM-N7" front, readable.
    // Scrolling (s) then turns it fully through the sections.
    g.rotation.y =
      s * TAU * 2.2 + Math.sin(t * 0.5) * 0.12 + gs.ry + (1 - intro) * TAU * 2;
    g.rotation.x = 0.1 + Math.sin(t * 0.6) * 0.05 + gs.rx;
    g.rotation.z = Math.sin(t * 0.5) * 0.04 + gs.rz + (1 - intro) * 0.5;

    // LIQUID FILL — the perfume pours in: the amber column scales up from the
    // base (starting ~0.5s after load, over ~2s) with a soft settle, plus a
    // tiny surface ripple so it reads as liquid, not a solid block.
    const liq = liquid.current;
    if (liq) {
      const raw = clamp01((t - 0.5) / 2.0);
      const settle = 1 + Math.sin(raw * Math.PI) * 0.04; // gentle overfill/settle
      const fill = smoother(raw) * settle;
      liq.scale.y = Math.max(0.0001, fill) + Math.sin(t * 2.2) * 0.006 * raw;
    }
  });

  return (
    <group ref={group}>
      {/* translucent amber glass */}
      <mesh>
        <latheGeometry args={[glassProfile, 80]} />
        <meshPhysicalMaterial
          color="#e6a94f"
          roughness={0.05}
          metalness={0}
          transmission={0.92}
          thickness={0.7}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.04}
          transparent
          opacity={0.62}
          emissive="#c9772a"
          emissiveIntensity={0.06}
          envMapIntensity={1.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* brand label — sits just IN FRONT of the glass bulge (z 0.78 > body
          radius 0.72) so every letter clears the curved surface; a flat plane
          at the surface would let the round body occlude the middle (the M). */}
      {labelTexture && (
        <mesh position={[0, -0.12, 0.78]} renderOrder={2}>
          <planeGeometry args={[1.0, 1.0]} />
          <meshBasicMaterial
            map={labelTexture}
            transparent
            toneMapped={false}
            opacity={1}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* amber liquid — a group pivoted at the interior floor so scaling y
          grows the column UPWARD from the base (see LIQUID FILL in useFrame).
          The cylinder's flat top cap doubles as the liquid surface. */}
      <group ref={liquid} position={[0, LIQ_BOTTOM, 0]} scale={[1, 0.0001, 1]}>
        <mesh position={[0, LIQ_HEIGHT / 2, 0]}>
          <cylinderGeometry args={[0.58, 0.56, LIQ_HEIGHT, 48]} />
          <meshStandardMaterial
            color="#b56a15"
            roughness={0.16}
            metalness={0.1}
            emissive="#7a3d0c"
            emissiveIntensity={0.32}
            envMapIntensity={1.2}
          />
        </mesh>
      </group>

      {/* gold neck collar */}
      <mesh position={[0, 1.03, 0]}>
        <cylinderGeometry args={[0.26, 0.22, 0.12, 48]} />
        <meshStandardMaterial
          color="#C8A46B"
          metalness={1}
          roughness={0.2}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* chunky rounded gold cap — the clearest "this is perfume" cue */}
      <RoundedBox
        args={[0.62, 0.6, 0.62]}
        radius={0.07}
        smoothness={4}
        position={[0, 1.42, 0]}
      >
        <meshStandardMaterial
          color="#CBA76E"
          metalness={1}
          roughness={0.22}
          emissive="#3a2a10"
          emissiveIntensity={0.1}
          envMapIntensity={1.5}
        />
      </RoundedBox>
    </group>
  );
}

export default function ScrollBottle3D() {
  const [enabled, setEnabled] = useState(false);
  const progress = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia(
      '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'
    );
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const { scrollYProgress } = useScroll();
  useEffect(
    () => scrollYProgress.on('change', (v) => (progress.current = v)),
    [scrollYProgress]
  );

  // Visible from the banner onward (the flacon plays its own 3D entrance).
  // A gentle fade-in on mount, then it stays present the whole scroll.
  const opacity = useMotionValue(0);
  useEffect(() => {
    if (!enabled) return;
    const controls = animate(opacity, 0.9, { duration: 1.0, ease: 'easeOut' });
    return () => controls.stop();
  }, [enabled, opacity]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1, // BEHIND all page content + navbar — a true background layer
        pointerEvents: 'none',
        opacity,
      }}
    >
      <Canvas
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.7]}
        camera={{ position: [0, 0, 7], fov: 30 }}
        style={{ background: 'transparent' }}
      >
        {/* Offline procedural reflections (no HDR fetch) — gives the glass &
            gold real highlights so it reads as premium, not plastic. */}
        <Environment resolution={256} frames={1}>
          <Lightformer
            form="rect"
            intensity={2.2}
            position={[3, 3, 4]}
            scale={[5, 5, 1]}
            color="#ffffff"
          />
          <Lightformer
            form="rect"
            intensity={1.4}
            position={[-4, 1, -3]}
            scale={[4, 4, 1]}
            color="#C8A46B"
          />
          <Lightformer
            form="ring"
            intensity={1.1}
            position={[0, -3, 3]}
            scale={3}
            color="#E8C68A"
          />
        </Environment>

        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 6, 5]} intensity={1.7} />
        <directionalLight position={[-5, 2, -3]} intensity={0.8} color="#C8A46B" />
        <pointLight position={[0, -2, 4]} intensity={0.7} color="#E8C68A" />
        <Flacon progress={progress} />
      </Canvas>
    </motion.div>
  );
}
