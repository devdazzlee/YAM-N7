'use client';

import { Environment } from '@react-three/drei';
import { useRef } from 'react';
import { Group } from 'three';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FloatingBottle from './FloatingBottle';
import { useMediaQuery } from './useMediaQuery';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function AlternatingTextScene() {
  const bottleRef = useRef<Group>(null);

  const bgColors = ['#FFA6B5', '#E9CFF6', '#CBEF9A'];

  const isDesktop = useMediaQuery('(min-width: 768px)', true);

  useGSAP(
    () => {
      if (!bottleRef.current) return;

      const sections = gsap.utils.toArray('.alternating-section');

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.alternating-text-view',
          endTrigger: '.alternating-text-container',
          pin: true,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });

      sections.forEach((_, index) => {
        if (!bottleRef.current) return;

        if (index === 0) return;

        const isOdd = index % 2 !== 0;

        const xPosition = isDesktop ? (isOdd ? '-1' : '1') : 0;
        const yRotation = isDesktop ? (isOdd ? '.4' : '-.4') : 0;

        scrollTl
          .to(bottleRef.current.position, {
            x: xPosition,
            ease: 'circ.inOut',
            delay: 0.5,
          })
          .to(
            bottleRef.current.rotation,
            {
              y: yRotation,
              ease: 'back.inOut',
            },
            '<',
          )
          .to('.alternating-text-container', {
            backgroundColor: gsap.utils.wrap(bgColors, index),
          });
      });
    },
    { dependencies: [isDesktop] },
  );

  return (
    <group ref={bottleRef} position-x={isDesktop ? 1 : 0} rotation-y={isDesktop ? -0.3 : 0}>
      <FloatingBottle scent="strawberryLemonade" ref={bottleRef} />
      <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
    </group>
  );
}
