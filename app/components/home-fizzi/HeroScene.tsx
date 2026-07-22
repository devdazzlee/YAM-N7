'use client';

import { Environment } from '@react-three/drei';
import { useRef } from 'react';
import { Group } from 'three';
import ScrollTrigger from 'gsap/ScrollTrigger';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import FloatingBottle from './FloatingBottle';
import { useSceneReady } from './useSceneReady';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HeroScene() {
  const isReady = useSceneReady((state) => state.isReady);

  const bottle1Ref = useRef<Group>(null);
  const bottle2Ref = useRef<Group>(null);
  const bottle3Ref = useRef<Group>(null);
  const bottle4Ref = useRef<Group>(null);
  const bottle5Ref = useRef<Group>(null);

  const bottle1GroupRef = useRef<Group>(null);
  const bottle2GroupRef = useRef<Group>(null);

  const groupRef = useRef<Group>(null);

  const FLOAT_SPEED = 1.5;

  useGSAP(() => {
    if (
      !bottle1Ref.current ||
      !bottle2Ref.current ||
      !bottle3Ref.current ||
      !bottle4Ref.current ||
      !bottle5Ref.current ||
      !bottle1GroupRef.current ||
      !bottle2GroupRef.current ||
      !groupRef.current
    )
      return;

    isReady();

    gsap.set(bottle1Ref.current.position, { x: -1.5 });
    gsap.set(bottle1Ref.current.rotation, { z: -0.5 });

    gsap.set(bottle2Ref.current.position, { x: 1.5 });
    gsap.set(bottle2Ref.current.rotation, { z: 0.5 });

    gsap.set(bottle3Ref.current.position, { y: 5, z: 2 });
    gsap.set(bottle4Ref.current.position, { x: 2, y: 4, z: 2 });
    gsap.set(bottle5Ref.current.position, { y: -5 });

    const introTl = gsap.timeline({
      defaults: {
        duration: 3,
        ease: 'back.out(1.4)',
      },
    });

    if (window.scrollY < 20) {
      introTl
        .from(bottle1GroupRef.current.position, { y: -5, x: 1 }, 0)
        .from(bottle1GroupRef.current.rotation, { z: 3 }, 0)
        .from(bottle2GroupRef.current.position, { y: 5, x: 1 }, 0)
        .from(bottle2GroupRef.current.rotation, { z: 3 }, 0);
    }

    const scrollTl = gsap.timeline({
      defaults: {
        duration: 2,
      },
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    });

    scrollTl
      .to(groupRef.current.rotation, { y: Math.PI * 2 })
      .to(bottle1Ref.current.position, { x: -0.2, y: -0.7, z: -2 }, 0)
      .to(bottle1Ref.current.rotation, { z: 0.3 }, 0)
      .to(bottle2Ref.current.position, { x: 1, y: -0.2, z: -1 }, 0)
      .to(bottle2Ref.current.rotation, { z: 0 }, 0)
      .to(bottle3Ref.current.position, { x: -0.3, y: 0.5, z: -1 }, 0)
      .to(bottle3Ref.current.rotation, { z: -0.1 }, 0)
      .to(bottle4Ref.current.position, { x: 0, y: -0.3, z: 0.5 }, 0)
      .to(bottle4Ref.current.rotation, { z: 0.3 }, 0)
      .to(bottle5Ref.current.position, { x: 0.3, y: 0.5, z: -0.5 }, 0)
      .to(bottle5Ref.current.rotation, { z: -0.25 }, 0)
      .to(groupRef.current.position, { x: 1, duration: 3, ease: 'sign.inOut' }, 1.3);
  });

  return (
    <group ref={groupRef}>
      <group ref={bottle1GroupRef}>
        <FloatingBottle ref={bottle1Ref} scent="blackCherry" floatSpeed={FLOAT_SPEED} />
      </group>

      <group ref={bottle2GroupRef}>
        <FloatingBottle ref={bottle2Ref} scent="lemonLime" floatSpeed={FLOAT_SPEED} />
      </group>

      <FloatingBottle ref={bottle3Ref} scent="grape" floatSpeed={FLOAT_SPEED} />
      <FloatingBottle ref={bottle4Ref} scent="strawberryLemonade" floatSpeed={FLOAT_SPEED} />
      <FloatingBottle ref={bottle5Ref} scent="watermelon" floatSpeed={FLOAT_SPEED} />

      <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
    </group>
  );
}
