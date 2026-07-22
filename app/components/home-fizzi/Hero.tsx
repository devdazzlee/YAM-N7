'use client';

import Image from 'next/image';
import Link from 'next/link';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { View } from '@react-three/drei';

import { Bounded } from './Bounded';
import { TextSplitter } from './TextSplitter';
import HeroScene from './HeroScene';
import { Bubbles } from './Bubbles';
import { useSceneReady } from './useSceneReady';
import { useMediaQuery } from './useMediaQuery';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Hero() {
  const ready = useSceneReady((state) => state.ready);
  const isDesktop = useMediaQuery('(min-width: 768px)', true);

  useGSAP(
    () => {
      if (!ready && isDesktop) return;

      const introTL = gsap.timeline();

      introTL
        .set('.hero', { opacity: 1 })
        .from('.hero-header-word', {
          scale: 4,
          opacity: 0,
          ease: 'power4.in',
          delay: 0.3,
          stagger: 0.8,
        })
        .from('.hero-subheading', { opacity: 0, y: 30 }, '+=.8')
        .from('.hero-body', { opacity: 0, y: 10 })
        .from('.hero-button', { opacity: 0, y: 10, duration: 0.6 });

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        },
      });

      scrollTl
        .fromTo(
          'body',
          { backgroundColor: '#FDE047' },
          { backgroundColor: '#D9F99D', overwrite: 'auto' },
          1.5,
        )
        .from('.text-side-heading .split-char', {
          scale: 1.3,
          y: 40,
          rotate: -25,
          opacity: 0,
          stagger: 0.1,
          ease: 'back.out(3)',
          duration: 0.5,
        })
        .from('.text-side-body', { y: 20, opacity: 0 });
    },
    { dependencies: [ready, isDesktop] },
  );

  return (
    <Bounded className="hero opacity-0">
      {isDesktop && (
        <View className="hero-scene pointer-events-none sticky top-0 z-50 -mt-[100vh] hidden h-screen w-screen md:block">
          <HeroScene />
          <Bubbles speed={2} />
        </View>
      )}

      <div className="grid">
        <div className="grid h-screen place-content-center">
          <div className="grid auto-rows-min place-items-center text-center">
            <h1 className="hero-header text-7xl font-black uppercase leading-[.8] text-orange-500 md:text-[9rem] lg:text-[13rem]">
              <TextSplitter text="Pure Scent" wordDisplayStyle="block" className="hero-header-word" />
            </h1>

            <div className="hero-subheading mt-12 text-5xl font-semibold text-sky-950 lg:text-6xl">
              <p>Perfume, Perfected</p>
            </div>

            <div className="hero-body text-2xl font-normal text-sky-950">
              <p>
                Five signature scents crafted with fine fragrance oils, long-lasting, skin-safe,
                never harsh.
              </p>
            </div>

            <Link
              href="/shop"
              className="hero-button mt-12 rounded-xl bg-orange-600 px-5 py-4 text-center text-xl font-bold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-orange-700 md:text-2xl"
            >
              Shop Now
            </Link>
          </div>
        </div>
        <div className="text-side relative z-[80] grid h-screen items-center gap-4 md:grid-cols-2">
          <div>
            <Image
              src="/brand-story-bottle.png"
              alt="YAM-N7 perfume bottle"
              width={800}
              height={800}
              className="w-full md:hidden"
            />
            <h2 className="text-side-heading text-balance text-6xl font-black uppercase text-sky-950 lg:text-8xl">
              <TextSplitter text="Discover All Five Scents" />
            </h2>
            <div className="text-side-body mt-4 max-w-xl text-balance text-xl font-normal text-slate-950">
              <p>
                Our fragrances are blended with premium natural extracts and a touch of rare
                botanicals. We never use harsh synthetic fillers. Explore all five scents and
                find the one that feels like you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Bounded>
  );
}
