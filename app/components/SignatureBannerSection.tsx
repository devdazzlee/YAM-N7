'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ease } from './motion/reveal';

/* ─── Floating gold particle ─────────────────────────────────────────── */
interface Particle {
  id: number;
  x: number;         // % from left
  size: number;      // rem
  duration: number;  // seconds for one full float cycle
  delay: number;     // animation-delay seconds
  opacity: number;
  driftX: number;    // horizontal drift amount (px)
}

const PARTICLES: Particle[] = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  x: (i * 37 + 11) % 100,
  size: 0.18 + (i % 5) * 0.06,
  duration: 8 + (i % 7) * 2,
  delay: -(i * 1.3) % 14,
  opacity: 0.15 + (i % 4) * 0.1,
  driftX: ((i % 3) - 1) * 18,
}));

function GoldParticle({ p }: { p: Particle }) {
  return (
    <span
      className="absolute bottom-0 rounded-full pointer-events-none"
      style={{
        left: `${p.x}%`,
        width: `${p.size}rem`,
        height: `${p.size}rem`,
        background: 'radial-gradient(circle, #C8A46B 0%, rgba(200,164,107,0.3) 60%, transparent 100%)',
        opacity: p.opacity,
        animation: `particleFloat ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
        '--drift-x': `${p.driftX}px`,
      } as React.CSSProperties}
    />
  );
}

/* ─── Main component ─────────────────────────────────────────────────── */
export default function SignatureBannerSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Parallax: background drifts slower than scroll (moves up by 120px total)
  const bgY = useTransform(scrollYProgress, [0, 1], ['0px', '-120px']);
  // Content drifts slightly less (subtle depth)
  const contentY = useTransform(scrollYProgress, [0, 1], ['0px', '-40px']);

  return (
    <>
      {/* ── Keyframe CSS injected once ──────────────────────────────── */}
      <style>{`
        @keyframes particleFloat {
          0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(-110vh) translateX(var(--drift-x)) scale(0.4); opacity: 0; }
        }
        @keyframes shimmerSweep {
          0%   { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(350%) skewX(-15deg); }
        }
        .banner-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(200,164,107,0.07) 40%,
            rgba(200,164,107,0.14) 50%,
            rgba(200,164,107,0.07) 60%,
            transparent 100%
          );
          width: 60%;
          animation: shimmerSweep 7s ease-in-out 2s infinite;
          pointer-events: none;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden"
        style={{ minHeight: '60vh' }}
      >
        {/* ── Parallax background layer ─────────────────────────────── */}
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0 scale-110 origin-center"
          aria-hidden
        >
          {/* Marble base */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 120% 80% at 20% 30%, rgba(28,18,8,0.95) 0%, transparent 60%),
                radial-gradient(ellipse 100% 120% at 80% 70%, rgba(18,10,4,0.9) 0%, transparent 55%),
                radial-gradient(ellipse 80% 60% at 50% 50%, rgba(200,164,107,0.04) 0%, transparent 70%),
                linear-gradient(135deg,
                  #0A0A08 0%,
                  #100C06 15%,
                  #0E0A05 30%,
                  #120E08 45%,
                  #0A0808 60%,
                  #0E0C07 75%,
                  #0A0A08 100%
                )
              `,
            }}
          />

          {/* Marble veins — pure CSS */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  125deg,
                  transparent 0px,
                  transparent 18px,
                  rgba(200,164,107,0.08) 18px,
                  rgba(200,164,107,0.08) 19px,
                  transparent 19px,
                  transparent 54px,
                  rgba(200,164,107,0.04) 54px,
                  rgba(200,164,107,0.04) 55px
                ),
                repeating-linear-gradient(
                  47deg,
                  transparent 0px,
                  transparent 30px,
                  rgba(200,164,107,0.05) 30px,
                  rgba(200,164,107,0.05) 31px,
                  transparent 31px,
                  transparent 72px
                )
              `,
            }}
          />

          {/* Gold foil sheen overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 60% 40% at 50% 50%,
                  rgba(200,164,107,0.06) 0%,
                  rgba(200,164,107,0.02) 40%,
                  transparent 70%
                )
              `,
            }}
          />

          {/* Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.7) 100%)',
            }}
          />
        </motion.div>

        {/* ── Floating particles ────────────────────────────────────── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          {PARTICLES.map((p) => (
            <GoldParticle key={p.id} p={p} />
          ))}
        </div>

        {/* ── Center content ────────────────────────────────────────── */}
        <motion.div
          style={{ y: contentY, minHeight: '60vh' }}
          className="relative z-10 flex flex-col items-center justify-center text-center px-6 sm:px-12"
        >
          {/* Accent label */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.32em' }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease }}
            className="luxury-label mb-6"
          >
            YAM&#8209;N7 Exclusives
          </motion.p>

          {/* Main heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, delay: 0.15, ease }}
            className="banner-shimmer relative font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white uppercase font-normal leading-[1.08] tracking-wide max-w-4xl overflow-hidden"
          >
            The Signature Collection
          </motion.h2>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.35, ease }}
            className="my-7 h-px w-28 sm:w-36 origin-center"
            style={{
              background: 'linear-gradient(to right, transparent, #C8A46B, transparent)',
            }}
          />

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: 0.4, ease }}
            className="font-heading text-base sm:text-xl md:text-2xl text-white/70 font-normal max-w-xl leading-relaxed"
          >
            For those who are remembered long after they leave the room.
          </motion.p>

          {/* CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.55, ease }}
            className="mt-10"
          >
            <Link
              href="/search?q=Signature"
              className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden text-xs font-semibold uppercase tracking-[0.22em] transition-all duration-400"
              style={{
                border: '1px solid rgba(200,164,107,0.7)',
                color: '#C8A46B',
              }}
            >
              {/* Fill layer slides in on hover */}
              <span
                className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out"
                style={{ background: '#C8A46B' }}
                aria-hidden
              />
              {/* Text — turns dark on hover */}
              <span className="relative z-10 group-hover:text-[#0A0A0A] transition-colors duration-400">
                Explore Signature Collection
              </span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Bottom fade to next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent, #0A0A0A)',
          }}
          aria-hidden
        />
      </section>
    </>
  );
}
