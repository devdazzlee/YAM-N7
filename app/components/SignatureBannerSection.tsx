'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ease } from './motion/reveal';

/* ─── Floating gold particle ─────────────────────────────────────────── */
interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  driftX: number;
}

const PARTICLES: Particle[] = Array.from({ length: 26 }, (_, i) => ({
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
      style={
        {
          left: `${p.x}%`,
          width: `${p.size}rem`,
          height: `${p.size}rem`,
          background:
            'radial-gradient(circle, #C8A46B 0%, rgba(200,164,107,0.3) 60%, transparent 100%)',
          opacity: p.opacity,
          animation: `particleFloat ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          '--drift-x': `${p.driftX}px`,
        } as React.CSSProperties
      }
    />
  );
}

/* ─── Kinetic headline: each word masks up on view ───────────────────── */
const HEADLINE = ['The', 'Signature', 'Collection'];

/* ─── Marquee content — signature scents drifting behind the headline ── */
const SCENTS = [
  'Oud Royale',
  'Noir Elixir',
  'Amber Supreme',
  'Velvet Saffron',
  'Midnight Musk',
  'Rose Absolute',
  'White Agarwood',
  'Golden Aura',
];

function Marquee({ reverse = false }: { reverse?: boolean }) {
  const row = [...SCENTS, ...SCENTS];
  return (
    <div
      className="flex w-max whitespace-nowrap"
      style={{
        animation: `${reverse ? 'marqueeRight' : 'marqueeLeft'} 46s linear infinite`,
      }}
    >
      {row.map((s, i) => (
        <span key={i} className="flex items-center">
          <span
            className="font-display uppercase leading-none"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 6rem)',
              letterSpacing: '0.04em',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(200,164,107,0.35)',
            }}
          >
            {s}
          </span>
          <span
            aria-hidden
            className="mx-8 inline-block rounded-full"
            style={{
              width: '10px',
              height: '10px',
              transform: 'rotate(45deg)',
              background: 'rgba(200,164,107,0.5)',
            }}
          />
        </span>
      ))}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────── */
export default function SignatureBannerSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <>
      <style>{`
        @keyframes particleFloat {
          0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(-110vh) translateX(var(--drift-x)) scale(0.4); opacity: 0; }
        }
        @keyframes marqueeLeft  { from { transform: translateX(0); }     to { transform: translateX(-50%); } }
        @keyframes marqueeRight { from { transform: translateX(-50%); }  to { transform: translateX(0); } }
        @keyframes auroraDrift {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(4%, -3%) scale(1.12); }
          100% { transform: translate(-3%, 2%) scale(1); }
        }
        @keyframes shimmerSweep {
          0%   { transform: translateX(-120%) skewX(-16deg); }
          100% { transform: translateX(420%)  skewX(-16deg); }
        }
        .sig-shimmer::after {
          content: '';
          position: absolute; inset: 0;
          width: 55%;
          background: linear-gradient(90deg, transparent, rgba(255,240,210,0.16) 50%, transparent);
          animation: shimmerSweep 7s ease-in-out 1.5s infinite;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .sig-marquee, .sig-aurora { animation: none !important; }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden flex items-center"
        style={{ minHeight: '78vh' }}
      >
        {/* ── Grounding backdrop (child div, so it survives the homepage
              transparent-section rule) ─────────────────────────────────── */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 90% 70% at 50% 45%, rgba(20,14,6,0.72) 0%, rgba(6,6,6,0.94) 70%)',
          }}
        />

        {/* ── Living gold aurora ──────────────────────────────────────── */}
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          {[
            { c: 'rgba(200,164,107,0.16)', x: '18%', y: '30%', s: 60, d: 18 },
            { c: 'rgba(216,196,160,0.12)', x: '80%', y: '62%', s: 70, d: 24 },
            { c: 'rgba(160,120,60,0.14)', x: '55%', y: '20%', s: 55, d: 21 },
          ].map((b, i) => (
            <div
              key={i}
              className="sig-aurora absolute rounded-full"
              style={{
                left: b.x,
                top: b.y,
                width: 'clamp(340px, 42vw, 680px)',
                height: 'clamp(340px, 42vw, 680px)',
                transform: 'translate(-50%,-50%)',
                background: `radial-gradient(circle, ${b.c} 0%, transparent 68%)`,
                filter: `blur(${b.s}px)`,
                animation: `auroraDrift ${b.d}s ease-in-out ${i * 2}s infinite alternate`,
                mixBlendMode: 'screen',
              }}
            />
          ))}
        </div>

        {/* ── Ghost-text marquee drifting behind the headline ─────────── */}
        <div
          aria-hidden
          className="sig-marquee absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{ opacity: 0.16 }}
        >
          <div className="mb-2">
            <Marquee />
          </div>
          <div>
            <Marquee reverse />
          </div>
        </div>

        {/* ── Floating particles ──────────────────────────────────────── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          {PARTICLES.map((p) => (
            <GoldParticle key={p.id} p={p} />
          ))}
        </div>

        {/* ── Center content ──────────────────────────────────────────── */}
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 text-center sm:px-12">
          {/* Accent label */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.55em', y: 10 }}
            whileInView={{ opacity: 1, letterSpacing: '0.34em', y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease }}
            className="luxury-label mb-7"
          >
            YAM&#8209;N7 Exclusives
          </motion.p>

          {/* Kinetic headline — words mask up + stagger */}
          <h2 className="sig-shimmer relative font-display uppercase font-normal leading-[1.02] tracking-wide text-white">
            <span className="sr-only">The Signature Collection</span>
            <span aria-hidden className="flex flex-wrap justify-center gap-x-[0.3em]">
              {HEADLINE.map((word, i) => (
                <span key={i} className="overflow-hidden py-[0.06em]">
                  <motion.span
                    initial={{ y: '115%' }}
                    whileInView={{ y: '0%' }}
                    viewport={{ once: true, margin: '-70px' }}
                    transition={{ duration: 0.9, delay: 0.12 * i, ease }}
                    className="inline-block"
                    style={{
                      fontSize: 'clamp(2.4rem, 7vw, 5.6rem)',
                      ...(word === 'Signature'
                        ? {
                            fontStyle: 'italic',
                            background:
                              'linear-gradient(135deg, #C8A46B 0%, #F3E0B0 45%, #C8A46B 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }
                        : {}),
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </span>
          </h2>

          {/* Drawing divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.35, ease }}
            className="my-7 h-px w-28 origin-center sm:w-40"
            style={{
              background: 'linear-gradient(to right, transparent, #C8A46B, transparent)',
            }}
          />

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: 0.45, ease }}
            className="font-heading max-w-xl text-base font-normal leading-relaxed text-white/70 sm:text-xl md:text-2xl"
          >
            For those who are remembered long after they leave the room.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.58, ease }}
            className="mt-10"
          >
            <Link
              href="/search?q=Signature"
              className="group relative inline-flex items-center justify-center gap-3 overflow-hidden px-10 py-4 text-xs font-semibold uppercase tracking-[0.22em] transition-all duration-500"
              style={{ border: '1px solid rgba(200,164,107,0.7)', color: '#C8A46B' }}
            >
              <span
                className="absolute inset-0 -translate-x-full transition-transform duration-500 ease-out group-hover:translate-x-0"
                style={{
                  background:
                    'linear-gradient(135deg, #C8A46B 0%, #F3E0B0 50%, #C8A46B 100%)',
                }}
                aria-hidden
              />
              <span className="relative z-10 transition-colors duration-500 group-hover:text-[#0A0A0A]">
                Explore Signature Collection
              </span>
              <span className="relative z-10 transition-all duration-500 group-hover:translate-x-1 group-hover:text-[#0A0A0A]">
                →
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Top & bottom fades to blend with neighbours */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, #0A0A0A, transparent)' }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #0A0A0A, transparent)' }}
        />
      </section>
    </>
  );
}
