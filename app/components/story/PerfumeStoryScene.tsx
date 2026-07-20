'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, RoundedBox, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

const TAU = Math.PI * 2;
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const band = (p: number, start: number, end: number) =>
  smoother(clamp01((p - start) / Math.max(0.0001, end - start)));

type Vec3 = [number, number, number];
type CameraKeyframe = { t: number; pos: Vec3; look: Vec3 };

const CAMERA_KEYS: CameraKeyframe[] = [
  { t: 0, pos: [0, 0.35, 9.2], look: [0, 0.05, 0] },
  { t: 0.14, pos: [2.6, 0.5, 7.6], look: [0.15, 0.15, 0] },
  { t: 0.28, pos: [-2.2, 0.1, 6.4], look: [-0.1, 0.1, 0] },
  { t: 0.42, pos: [0.8, -0.05, 4.2], look: [0, 0.3, 0] },
  { t: 0.58, pos: [0, 0.4, 10.5], look: [0, 0, 0] },
  { t: 0.72, pos: [2.0, 0.15, 7.0], look: [0.5, 0.05, 0] },
  { t: 0.86, pos: [-0.4, 0.2, 6.4], look: [0.2, 0.1, 0] },
  { t: 1, pos: [0, 0.25, 7.2], look: [0, 0.1, 0] },
];

function sampleKeyframes(keys: CameraKeyframe[], progress: number): { pos: Vec3; look: Vec3 } {
  const p = clamp01(progress);
  let i = 0;
  while (i < keys.length - 2 && keys[i + 1].t < p) i += 1;
  const a = keys[i];
  const b = keys[Math.min(i + 1, keys.length - 1)];
  const span = Math.max(0.0001, b.t - a.t);
  const u = smoother(clamp01((p - a.t) / span));
  return {
    pos: [lerp(a.pos[0], b.pos[0], u), lerp(a.pos[1], b.pos[1], u), lerp(a.pos[2], b.pos[2], u)],
    look: [lerp(a.look[0], b.look[0], u), lerp(a.look[1], b.look[1], u), lerp(a.look[2], b.look[2], u)],
  };
}

type BottleVariant = {
  line1: string;
  line2: string;
  glass: string;
  liquid: string;
  cap: string;
  emissive: string;
};

const VARIANTS: Record<string, BottleVariant> = {
  signature: {
    line1: 'YAM-N7',
    line2: 'PARFUM',
    glass: '#8a1538',
    liquid: '#7a1030',
    cap: '#E0A98F',
    emissive: '#6d214f',
  },
  elite: {
    line1: 'YAM-N7',
    line2: 'ELITE',
    glass: '#1a2840',
    liquid: '#0f1a2e',
    cap: '#C9B896',
    emissive: '#1a2840',
  },
  identity: {
    line1: 'YAM-N7',
    line2: 'IDENTITY',
    glass: '#3d1528',
    liquid: '#5a1028',
    cap: '#E8B4A0',
    emissive: '#4a1528',
  },
};

function makeLabelTexture(line1: string, line2: string) {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, 512, 512);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#F5D6CE';
  ctx.strokeStyle = '#F5D6CE';
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 8;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(150, 176);
  ctx.lineTo(362, 176);
  ctx.stroke();
  ctx.font = '600 72px Georgia, "Playfair Display", serif';
  ctx.fillText(line1, 256, 248);
  ctx.font = '500 26px Georgia, serif';
  ctx.fillText(line2, 256, 316);
  ctx.beginPath();
  ctx.moveTo(150, 354);
  ctx.lineTo(362, 354);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

const GLASS_PROFILE = [
  [0.0, -1.15],
  [0.62, -1.15],
  [0.72, -1.02],
  [0.74, 0.35],
  [0.72, 0.52],
  [0.52, 0.68],
  [0.28, 0.82],
  [0.22, 1.04],
  [0.27, 1.09],
].map(([x, y]) => new THREE.Vector2(x, y));

function FlaconMesh({
  variant,
  labelTexture,
  liquidRef,
}: {
  variant: BottleVariant;
  labelTexture: THREE.CanvasTexture | null;
  liquidRef?: React.RefObject<THREE.Group | null>;
}) {
  return (
    <group>
      <mesh>
        <latheGeometry args={[GLASS_PROFILE, 80]} />
        <meshPhysicalMaterial
          color={variant.glass}
          roughness={0.04}
          metalness={0}
          transmission={0.94}
          thickness={0.75}
          ior={1.52}
          clearcoat={1}
          clearcoatRoughness={0.03}
          transparent
          opacity={0.66}
          emissive={variant.emissive}
          emissiveIntensity={0.08}
          envMapIntensity={1.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {labelTexture && (
        <mesh position={[0, -0.1, 0.8]} renderOrder={2}>
          <planeGeometry args={[1.02, 1.02]} />
          <meshBasicMaterial map={labelTexture} transparent toneMapped={false} depthWrite={false} />
        </mesh>
      )}

      <group ref={liquidRef} position={[0, -1.08, 0]} scale={[1, 1, 1]}>
        <mesh position={[0, 0.68, 0]}>
          <cylinderGeometry args={[0.58, 0.56, 1.36, 48]} />
          <meshStandardMaterial
            color={variant.liquid}
            roughness={0.14}
            metalness={0.12}
            emissive={variant.liquid}
            emissiveIntensity={0.34}
            envMapIntensity={1.3}
          />
        </mesh>
      </group>

      <mesh position={[0, 1.03, 0]}>
        <cylinderGeometry args={[0.26, 0.22, 0.12, 48]} />
        <meshStandardMaterial color="#E8B4A0" metalness={0.88} roughness={0.28} envMapIntensity={2.5} />
      </mesh>

      <RoundedBox args={[0.64, 0.62, 0.64]} radius={0.08} smoothness={4} position={[0, 1.44, 0]}>
        <meshStandardMaterial
          color={variant.cap}
          metalness={0.9}
          roughness={0.3}
          emissive={variant.emissive}
          emissiveIntensity={0.2}
          envMapIntensity={2.5}
        />
      </RoundedBox>
    </group>
  );
}

function HeroBottle({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const liquid = useRef<THREE.Group>(null);
  const labelTexture = useMemo(() => makeLabelTexture('YAM-N7', 'PARFUM'), []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const p = progressRef.current;
    const time = state.clock.elapsedTime;
    const intro = band(p, 0, 0.12);
    const craft = band(p, 0.36, 0.48);
    const fadeTrio = band(p, 0.52, 0.62);

    const visible = 1 - fadeTrio * 0.92;
    g.visible = visible > 0.04;

    g.position.x = lerp(-1.6, 0, smoother(intro)) + Math.sin(time * 0.45) * 0.05 * visible;
    g.position.y = lerp(-1.2, 0, smoother(intro)) + Math.sin(time * 0.65) * 0.04 * visible;
    g.position.z = lerp(-0.6, 0.2, smoother(clamp01(p * 1.4)));

    g.rotation.y = p * TAU * 1.8 + craft * 0.6 + Math.sin(time * 0.35) * 0.06;
    g.rotation.x = lerp(0.22, -0.06, craft) + Math.sin(time * 0.5) * 0.04;
    g.rotation.z = Math.sin(time * 0.42) * 0.04;

    const scale = lerp(0.55, 1.12, smoother(intro)) * lerp(1, 0.85, fadeTrio);
    g.scale.setScalar(scale * visible);

    const liq = liquid.current;
    if (liq) {
      const fill = smoother(clamp01((p - 0.04) / 0.28));
      liq.scale.y = Math.max(0.001, fill + Math.sin(time * 2.1) * 0.012);
    }
  });

  return (
    <group ref={group}>
      <FlaconMesh variant={VARIANTS.signature} labelTexture={labelTexture} liquidRef={liquid} />
    </group>
  );
}

type EnsembleSlot = {
  key: string;
  variant: BottleVariant;
  baseX: number;
  baseY: number;
  baseZ: number;
  phase: number;
};

const ENSEMBLE: EnsembleSlot[] = [
  { key: 'sig', variant: VARIANTS.signature, baseX: -1.35, baseY: -0.15, baseZ: 0.1, phase: 0 },
  { key: 'elite', variant: VARIANTS.elite, baseX: 0, baseY: 0.05, baseZ: 0.35, phase: 0.35 },
  { key: 'id', variant: VARIANTS.identity, baseX: 1.35, baseY: -0.15, baseZ: 0.1, phase: 0.7 },
];

function CollectionTrio({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const labels = useMemo(
    () => ({
      sig: makeLabelTexture('YAM-N7', 'PARFUM'),
      elite: makeLabelTexture('YAM-N7', 'ELITE'),
      identity: makeLabelTexture('YAM-N7', 'IDENTITY'),
    }),
    [],
  );

  const bottleRefs = useRef<Array<THREE.Group | null>>([]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const p = progressRef.current;
    const reveal = band(p, 0.5, 0.64);
    const exit = band(p, 0.78, 0.88);
    const time = state.clock.elapsedTime;

    g.visible = reveal > 0.02 && exit < 0.98;

    ENSEMBLE.forEach((slot, idx) => {
      const b = bottleRefs.current[idx];
      if (!b) return;
      const stagger = smoother(clamp01((reveal - slot.phase * 0.25) / 0.75));
      const lift = stagger * (1 - exit);

      b.position.x = slot.baseX * stagger;
      b.position.y = slot.baseY + lift * 0.4 + Math.sin(time * 0.55 + slot.phase) * 0.035 * lift;
      b.position.z = slot.baseZ * stagger;
      b.rotation.y = slot.phase * 0.8 + time * 0.18 * lift + p * 0.4;
      b.rotation.x = Math.sin(time * 0.4 + slot.phase) * 0.06 * lift;
      b.scale.setScalar(lerp(0.15, idx === 1 ? 0.95 : 0.82, stagger) * (1 - exit * 0.5));
    });
  });

  return (
    <group ref={group}>
      {ENSEMBLE.map((slot, idx) => (
        <group
          key={slot.key}
          ref={(node) => {
            bottleRefs.current[idx] = node;
          }}
        >
          <FlaconMesh
            variant={slot.variant}
            labelTexture={labels[slot.key as keyof typeof labels] ?? null}
          />
        </group>
      ))}
    </group>
  );
}

const NOTE_ORBS = [
  { label: 'Rose', color: '#f2b6c8', emissive: '#8f2f4f', angle: 0 },
  { label: 'Jasmine', color: '#fff5e8', emissive: '#c9a86c', angle: 1.2 },
  { label: 'Amber', color: '#e8a860', emissive: '#8a5010', angle: 2.4 },
  { label: 'Cedar', color: '#8b6914', emissive: '#4a3810', angle: 3.6 },
  { label: 'Iris', color: '#c8b8e8', emissive: '#6a5090', angle: 4.8 },
];

function IngredientOrbs({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const orbRefs = useRef<Array<THREE.Mesh | null>>([]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const p = progressRef.current;
    const bloom = band(p, 0.22, 0.36);
    const fade = band(p, 0.36, 0.44);
    const intensity = bloom * (1 - fade);
    const time = state.clock.elapsedTime;

    g.visible = intensity > 0.02;

    NOTE_ORBS.forEach((orb, idx) => {
      const mesh = orbRefs.current[idx];
      if (!mesh) return;
      const stagger = smoother(clamp01((bloom - idx * 0.08) / 0.65));
      const radius = 2.4 + stagger * 0.5;
      const angle = orb.angle + time * 0.22;
      mesh.position.x = Math.cos(angle) * radius * stagger;
      mesh.position.y = Math.sin(time * 0.5 + idx) * 0.35 * stagger + 0.2;
      mesh.position.z = Math.sin(angle) * radius * 0.35 * stagger - 0.5;
      mesh.scale.setScalar(lerp(0.05, 0.28, stagger) * intensity);
    });
  });

  return (
    <group ref={group}>
      {NOTE_ORBS.map((orb, idx) => (
        <mesh
          key={orb.label}
          ref={(node) => {
            orbRefs.current[idx] = node;
          }}
        >
          <sphereGeometry args={[1, 20, 20]} />
          <meshStandardMaterial
            color={orb.color}
            emissive={orb.emissive}
            emissiveIntensity={0.45}
            roughness={0.35}
            transparent
            opacity={0.88}
          />
        </mesh>
      ))}
    </group>
  );
}

function FlowerCluster({ progressRef, side }: { progressRef: React.MutableRefObject<number>; side: 'left' | 'right' }) {
  const group = useRef<THREE.Group>(null);
  const sign = side === 'left' ? -1 : 1;

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const p = progressRef.current;
    const bloom = band(p, 0.1, 0.26);
    const fade = band(p, 0.26, 0.34);
    const life = bloom * (1 - fade);
    const drift = band(p, 0.12, 0.32);
    const time = state.clock.elapsedTime;

    g.visible = life > 0.02;
    g.position.x = sign * lerp(3.6, 2.3, drift);
    g.position.y = lerp(-2.0, 0.1, bloom) + Math.sin(time * 0.6) * 0.05 * life;
    g.position.z = lerp(-1.4, 0.3, drift);
    g.rotation.z = sign * lerp(0.5, -0.15, drift) * life;
    g.scale.setScalar(lerp(0.1, 1, bloom) * life);
  });

  const petals = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        x: Math.cos((i / 8) * TAU) * 0.36,
        z: Math.sin((i / 8) * TAU) * 0.36,
        ry: (i / 8) * TAU,
      })),
    [],
  );

  return (
    <group ref={group}>
      {petals.map((petal, idx) => (
        <mesh key={idx} position={[petal.x, 0, petal.z]} rotation={[0.4, petal.ry, 0.2]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#f2b6c8" emissive="#8f2f4f" emissiveIntensity={0.25} roughness={0.45} />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#ffd9c8" emissive="#a64d67" emissiveIntensity={0.35} />
      </mesh>
    </group>
  );
}

function LuxuryPackage({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const p = progressRef.current;
    const reveal = band(p, 0.72, 0.84);
    const hold = 1 - band(p, 0.88, 0.96);

    g.visible = reveal > 0.02;
    g.position.x = lerp(3.4, 1.6, reveal);
    g.position.y = lerp(-1.6, -0.15, reveal);
    g.position.z = lerp(-1.0, 0.25, reveal);
    g.rotation.y = lerp(-0.9, 0.25, reveal);
    g.scale.setScalar(lerp(0.2, 1, reveal) * hold);
  });

  return (
    <group ref={group}>
      <RoundedBox args={[1.35, 1.85, 0.42]} radius={0.06} smoothness={4}>
        <meshStandardMaterial
          color="#4a1528"
          metalness={0.55}
          roughness={0.42}
          emissive="#2a0816"
          emissiveIntensity={0.2}
        />
      </RoundedBox>
      <mesh position={[0, 0, 0.22]}>
        <planeGeometry args={[1.1, 1.45]} />
        <meshStandardMaterial
          color="#E8B4A0"
          metalness={0.75}
          roughness={0.35}
          emissive="#6d214f"
          emissiveIntensity={0.15}
        />
      </mesh>
      <RoundedBox args={[0.5, 0.55, 0.5]} radius={0.05} smoothness={4} position={[-0.55, 0.1, 0.35]}>
        <meshStandardMaterial color="#8a1538" metalness={0.3} roughness={0.4} emissive="#4a0818" emissiveIntensity={0.15} />
      </RoundedBox>
    </group>
  );
}

function MistLayers({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const mistA = useRef<THREE.Mesh>(null);
  const mistB = useRef<THREE.Mesh>(null);
  const mistC = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const p = progressRef.current;
    const intensity = lerp(0.1, 0.48, smoother(clamp01((p - 0.06) / 0.55)));
    const time = state.clock.elapsedTime;

    const layers = [
      { ref: mistA, speed: 0.25, scaleBoost: 0.35, opacityMul: 1 },
      { ref: mistB, speed: 0.2, scaleBoost: 0.28, opacityMul: 0.75 },
      { ref: mistC, speed: 0.15, scaleBoost: 0.22, opacityMul: 0.55 },
    ];

    layers.forEach(({ ref, speed, scaleBoost, opacityMul }, idx) => {
      const mesh = ref.current;
      if (!mesh) return;
      mesh.position.x = Math.sin(time * speed + idx) * 0.45;
      mesh.position.y = Math.cos(time * speed * 0.7 + idx) * 0.15;
      mesh.scale.set(1 + p * scaleBoost, 1 + p * (scaleBoost * 0.6), 1);
      (mesh.material as THREE.MeshBasicMaterial).opacity = intensity * opacityMul;
    });
  });

  return (
    <group>
      <mesh ref={mistA} position={[0, 0.2, -1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[9, 5.5]} />
        <meshBasicMaterial color="#ffd5c5" transparent opacity={0.2} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={mistB} position={[0.4, -0.3, 0.6]} rotation={[-Math.PI / 2.2, 0.2, 0]}>
        <planeGeometry args={[7, 4.5]} />
        <meshBasicMaterial color="#f7b9c8" transparent opacity={0.16} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={mistC} position={[-0.6, 0.5, -0.3]} rotation={[-Math.PI / 2.5, -0.15, 0]}>
        <planeGeometry args={[6, 3.5]} />
        <meshBasicMaterial color="#e8c4a0" transparent opacity={0.12} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

function CinematicCamera({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const { pos, look } = sampleKeyframes(CAMERA_KEYS, progressRef.current);
    const breathe = Math.sin(state.clock.elapsedTime * 0.35) * 0.04;
    camera.position.set(pos[0], pos[1] + breathe, pos[2]);
    lookAt.set(look[0], look[1], look[2]);
    camera.lookAt(lookAt);
  });

  return null;
}

function StoryWorld({
  progressRef,
  particleCount,
}: {
  progressRef: React.MutableRefObject<number>;
  particleCount: number;
}) {
  return (
    <>
      <CinematicCamera progressRef={progressRef} />
      <color attach="background" args={['#12040b']} />
      <fog attach="fog" args={['#12040b', 6.5, 17]} />

      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3.0} position={[3, 3, 4]} scale={[5, 5, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2.3} position={[-4, 1, -3]} scale={[4, 4, 1]} color="#E8B4A0" />
        <Lightformer form="ring" intensity={1.9} position={[0, -3, 3]} scale={3} color="#F5D6CE" />
        <Lightformer form="rect" intensity={1.5} position={[0, 4, -4]} scale={[6, 6, 1]} color="#F5D6CE" />
      </Environment>

      <ambientLight intensity={0.68} />
      <directionalLight position={[4, 6, 5]} intensity={2.0} />
      <directionalLight position={[-5, 2, -3]} intensity={1.15} color="#E8B4A0" />
      <pointLight position={[0, -2, 4]} intensity={0.95} color="#F5D6CE" />
      <pointLight position={[3, 2, 2]} intensity={0.6} color="#f2b6c8" />

      <Sparkles count={particleCount} size={2.4} scale={[9, 5.5, 7]} speed={0.28} opacity={0.6} color="#ffd0bc" />
      <Sparkles count={Math.floor(particleCount * 0.5)} size={1.5} scale={[7, 4.5, 5.5]} speed={0.38} opacity={0.38} color="#f2a6bf" />

      <MistLayers progressRef={progressRef} />
      <FlowerCluster progressRef={progressRef} side="left" />
      <FlowerCluster progressRef={progressRef} side="right" />
      <IngredientOrbs progressRef={progressRef} />
      <HeroBottle progressRef={progressRef} />
      <CollectionTrio progressRef={progressRef} />
      <LuxuryPackage progressRef={progressRef} />
    </>
  );
}

type PerfumeStorySceneProps = {
  progressRef: React.MutableRefObject<number>;
  isMobile: boolean;
};

export default function PerfumeStoryScene({ progressRef, isMobile }: PerfumeStorySceneProps) {
  return (
    <Canvas
      gl={{ alpha: false, antialias: !isMobile, powerPreference: 'high-performance' }}
      dpr={isMobile ? [1, 1.35] : [1, 1.85]}
      camera={{ position: [0, 0.35, 9.2], fov: 32 }}
      className="absolute inset-0"
    >
      <StoryWorld progressRef={progressRef} particleCount={isMobile ? 90 : 180} />
    </Canvas>
  );
}
