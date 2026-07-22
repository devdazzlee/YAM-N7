'use client';

import { useRef, useState } from 'react';
import { Environment, View } from '@react-three/drei';
import { Group } from 'three';
import clsx from 'clsx';
import gsap from 'gsap';

import FloatingBottle from './FloatingBottle';
import { PerfumeBottleProps } from './PerfumeBottle';
import { ArrowIcon } from './ArrowIcon';
import { WavyCircles } from './WavyCircles';

const SPINS_ON_CHANGE = 8;

const SCENTS: { scent: PerfumeBottleProps['scent']; color: string; name: string }[] = [
  { scent: 'blackCherry', color: '#710523', name: 'Black Cherry Noir' },
  { scent: 'grape', color: '#572981', name: 'Velvet Grape' },
  { scent: 'lemonLime', color: '#164405', name: 'Citrus Bloom' },
  { scent: 'strawberryLemonade', color: '#690B3D', name: 'Strawberry Musk' },
  { scent: 'watermelon', color: '#4B7002', name: 'Watermelon Mist' },
];

export default function Carousel() {
  const [currentScentIndex, setCurrentScentIndex] = useState(0);

  const bottleRef = useRef<Group>(null);

  function changeScent(index: number) {
    if (!bottleRef.current) return;
    const nextIndex = (index + SCENTS.length) % SCENTS.length;

    const tl = gsap.timeline();

    tl.to(
      bottleRef.current.rotation,
      {
        y:
          index > currentScentIndex
            ? `-=${Math.PI * 2 * SPINS_ON_CHANGE}`
            : `+=${Math.PI * 2 * SPINS_ON_CHANGE}`,
        ease: 'power2.inOut',
        duration: 1,
      },
      0,
    )
      .to(
        '.background, .wavy-circles-outer, .-wavy-circles-inner',
        {
          backgroundColor: SCENTS[nextIndex].color,
          fill: SCENTS[nextIndex].color,
          ease: 'power2.inOut',
          duration: 1,
        },
        0,
      )
      .to('.text-wrapper', { duration: 0.2, y: -10, opacity: 0 }, 0)
      .to({}, { onStart: () => setCurrentScentIndex(nextIndex) }, 0.5)
      .to('.text-wrapper', { duration: 0.2, y: 0, opacity: 1 }, 0.7);
  }

  return (
    <section
      id="shop"
      className="carousel grid-rows-[auto, 4fr, auto] relative grid h-screen scroll-mt-24 justify-center overflow-hidden bg-white py-12 text-white"
    >
      <div className="background pointer-events-none absolute inset-0 bg-[#710523] opacity-50" />

      <WavyCircles className="absolute left-1/2 top-1/2 h-[120vmin] -translate-x-1/2 -translate-y-1/2 text-[#710523]" />

      <h2 className="relative text-center text-5xl font-bold">Find Your Signature Scent</h2>

      <div className="grid grid-cols-[auto,auto,auto] items-center">
        <ArrowButton
          onClick={() => changeScent(currentScentIndex - 1)}
          direction="left"
          label="Previous Scent"
        ></ArrowButton>

        <View className="aspect-square h-[70vmin] min-h-40">
          <group position={[0, 0, 1.5]}>
            <FloatingBottle
              floatIntensity={0.3}
              rotationIntensity={1}
              scent={SCENTS[currentScentIndex].scent}
              ref={bottleRef}
            />
          </group>
          <Environment
            files="/hdr/lobby.hdr"
            environmentIntensity={0.6}
            environmentRotation={[0, 3, 0]}
          />

          <directionalLight intensity={6} position={[0, 1, 1]} />
        </View>

        <ArrowButton
          onClick={() => changeScent(currentScentIndex + 1)}
          direction="right"
          label="Next Scent"
        ></ArrowButton>
      </div>

      <div className="text-area relative mx-auto text-center">
        <div className="text-wrapper text-4xl font-medium">
          <p>{SCENTS[currentScentIndex].name}</p>
        </div>

        <div className="mt-2 text-2xl font-normal opacity-90">
          <p>50ml Eau de Parfum, PKR 19,000</p>
        </div>
      </div>
    </section>
  );
}

type ArrowButtonProps = {
  direction?: 'right' | 'left';
  label: string;
  onClick: () => void;
};

function ArrowButton({ label, direction = 'right', onClick }: ArrowButtonProps) {
  return (
    <button
      onClick={onClick}
      className="size-12 rounded-full border-2 border-white bg-white/10 p-3 opacity-85 ring-white focus:outline-none focus-visible:opacity-100 focus-visible:ring-4 md:size-16 lg:size-20"
    >
      <ArrowIcon className={clsx(direction === 'right' && '-scale-x-100')} />
      <span className="sr-only">{label}</span>
    </button>
  );
}
