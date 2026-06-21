'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useRef } from 'react';
import { ease } from './motion/reveal';

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[85vh] sm:min-h-[80vh] flex items-center overflow-hidden bg-background border-b border-border"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-surface via-background to-surface-muted/40" />

      <div className="luxury-container relative z-10 w-full py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Editorial copy */}
          <motion.div
            style={{ y: contentY, opacity }}
            className="lg:col-span-5 text-center lg:text-left order-2 lg:order-1"
          >
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.5em' }}
              animate={{ opacity: 1, letterSpacing: '0.32em' }}
              transition={{ duration: 1, delay: 0.2, ease }}
              className="luxury-label mb-4 sm:mb-6"
            >
              Since 2000 · Karachi
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease }}
              className="font-heading text-[2.75rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] leading-[1.05] font-light mb-5 sm:mb-6"
            >
              The Art of
              <span className="block text-gradient-gold font-normal italic mt-1">
                Luxury Fragrance
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease }}
              className="text-muted text-sm sm:text-base md:text-lg leading-relaxed max-w-md mx-auto lg:mx-0 mb-8 sm:mb-10"
            >
              Rare attars, exquisite oud, and signature scents — curated for those who
              understand that fragrance is the final layer of elegance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4"
            >
              <Link href="/shop" className="luxury-btn-primary w-full sm:w-auto group">
                Explore Collection
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/about" className="luxury-btn-outline w-full sm:w-auto">
                Our Story
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="hidden lg:flex items-center gap-8 mt-14 pt-8 border-t border-border/50"
            >
              {[
                { value: '1400+', label: 'Fragrances' },
                { value: '25+', label: 'Years' },
                { value: '10K+', label: 'Clients' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-2xl text-foreground">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-luxury text-muted-subtle mt-0.5">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero imagery */}
          <motion.div
            style={{ y: imageY }}
            className="lg:col-span-7 order-1 lg:order-2 relative"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, filter: 'blur(16px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, ease }}
              className="relative mx-auto max-w-xl lg:max-w-none"
            >
              {/* Decorative frame */}
              <div className="absolute -inset-3 sm:-inset-4 border border-border pointer-events-none" />

              <Link href="/shop" className="block relative overflow-hidden shadow-luxury rounded-sm bg-surface-muted">
                <motion.img
                  src="/banners/New-Banner.jpg"
                  alt="YAM-N7 luxury perfume collection"
                  className="w-full h-auto object-contain"
                  initial={{ scale: 1.04 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.6, ease }}
                  whileHover={{ scale: 1.01 }}
                />
              </Link>

              {/* Floating accent — desktop only, positioned outside image */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -right-4 lg:-right-8 top-8 hidden lg:block bg-surface border border-border px-4 py-3 shadow-luxury z-10"
              >
                <p className="text-[10px] uppercase tracking-luxury text-primary mb-0.5">New</p>
                <p className="font-heading text-lg text-foreground whitespace-nowrap">Elite Series</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-luxury text-muted-subtle">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ChevronDown className="w-4 h-4 text-primary/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}
