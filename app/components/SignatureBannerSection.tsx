'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ease } from './motion/reveal';

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
              WebkitTextStroke: '1px rgba(232,180,160,0.35)',
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
              background: 'rgba(232,180,160,0.5)',
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
          background: linear-gradient(90deg, transparent, rgba(245,214,206,0.18) 50%, transparent);
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
              'radial-gradient(ellipse 90% 70% at 50% 45%, rgba(60,15,35,0.72) 0%, rgba(20,5,12,0.94) 70%)',
          }}
        />

        {/* ── Living gold aurora ──────────────────────────────────────── */}
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          {[
            { c: 'rgba(232,180,160,0.16)', x: '18%', y: '30%', s: 60, d: 18 },
            { c: 'rgba(245,214,206,0.12)', x: '80%', y: '62%', s: 70, d: 24 },
            { c: 'rgba(109,33,79,0.22)', x: '55%', y: '20%', s: 55, d: 21 },
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
            <motion.span
              aria-hidden
              className="flex flex-wrap justify-center gap-x-[0.3em]"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-70px' }}
            >
              {HEADLINE.map((word, i) => (
                <span key={i} className="overflow-hidden py-[0.06em]">
                  <motion.span
                    variants={{ hidden: { y: '115%' }, visible: { y: '0%' } }}
                    transition={{ duration: 0.9, delay: 0.12 * i, ease }}
                    className="inline-block"
                    style={{
                      fontSize: 'clamp(2.4rem, 7vw, 5.6rem)',
                      ...(word === 'Signature'
                        ? {
                            fontStyle: 'italic',
                            background:
                              'linear-gradient(135deg, #E8B4A0 0%, #F5D6CE 45%, #E8B4A0 100%)',
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
            </motion.span>
          </h2>

          {/* Drawing divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.35, ease }}
            className="my-7 h-px w-28 origin-center sm:w-40"
            style={{
              background: 'linear-gradient(to right, transparent, #E8B4A0, transparent)',
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
              style={{ border: '1px solid rgba(232,180,160,0.7)', color: '#E8B4A0' }}
            >
              <span
                className="absolute inset-0 -translate-x-full transition-transform duration-500 ease-out group-hover:translate-x-0"
                style={{
                  background:
                    'linear-gradient(135deg, #E8B4A0 0%, #F5D6CE 50%, #E8B4A0 100%)',
                }}
                aria-hidden
              />
              <span className="relative z-10 transition-colors duration-500 group-hover:text-[#2B0B16]">
                Explore Signature Collection
              </span>
              <span className="relative z-10 transition-all duration-500 group-hover:translate-x-1 group-hover:text-[#2B0B16]">
                →
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
