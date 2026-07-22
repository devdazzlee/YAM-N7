'use client';

import { Text, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/Perfume-bottle.gltf');

const scentColors = {
  lemonLime: '#A9CF54',
  grape: '#6C3FA0',
  blackCherry: '#8C1F3D',
  strawberryLemonade: '#E8608F',
  watermelon: '#F2836B',
};

const capMaterial = new THREE.MeshStandardMaterial({
  roughness: 0.25,
  metalness: 1,
  color: '#D4AF37',
});

const glassMaterials = Object.fromEntries(
  Object.entries(scentColors).map(([scent, color]) => [
    scent,
    new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.05,
      metalness: 0,
      transmission: 0.85,
      thickness: 0.4,
      ior: 1.45,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    }),
  ]),
) as Record<keyof typeof scentColors, THREE.MeshPhysicalMaterial>;

export type PerfumeBottleProps = {
  scent?: keyof typeof scentColors;
  scale?: number;
};

export function PerfumeBottle({ scent = 'blackCherry', scale = 2, ...props }: PerfumeBottleProps) {
  const { nodes } = useGLTF('/Perfume-bottle.gltf');

  return (
    <group {...props} dispose={null} scale={scale} rotation={[0, -Math.PI, 0]}>
      {/*
        The geometry isn't vertically symmetric about the origin, so it's
        re-centered here with a fixed offset instead of a runtime bounding-box
        measurement: the brand text below loads its glyph geometry
        asynchronously, and a bounding box taken before that finishes would
        make anything auto-centered on it visibly jump once the font arrives.
      */}
      <group position={[0, -0.0695, 0]}>
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.vessel as THREE.Mesh).geometry}
          material={capMaterial}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.vessel_1 as THREE.Mesh).geometry}
          material={glassMaterials[scent]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={(nodes.Cap as THREE.Mesh).geometry}
          material={capMaterial}
        />
        <Text
          position={[0, -0.05, -0.128]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.034}
          letterSpacing={0.05}
          font="/fonts/Alpino-Variable.woff"
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          YAM-N7
        </Text>
        <Text
          position={[0, -0.05, 0.128]}
          fontSize={0.034}
          letterSpacing={0.05}
          font="/fonts/Alpino-Variable.woff"
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          YAM-N7
        </Text>
      </group>
    </group>
  );
}
