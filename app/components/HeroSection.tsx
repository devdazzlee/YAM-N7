'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

/* ─── ease curves ──────────────────────────────────────────────── */
const SILK   = [0.25, 0.46, 0.45, 0.94] as const;
const REVEAL = [0.16, 1,    0.3,  1   ] as const;
/* client-spec headline ease — cubic-bezier(0.22, 1, 0.36, 1) */
const SPEC   = [0.22, 1,    0.36, 1   ] as const;

/* ─── smoke layers ─────────────────────────────────────────────── */
const SMOKE = [
  { x: '30%', y: '55%', scale: 1.4, delay: 0,   dur: 14, blur: 60 },
  { x: '60%', y: '45%', scale: 1.1, delay: 3,   dur: 18, blur: 48 },
  { x: '50%', y: '60%', scale: 1.6, delay: 6,   dur: 16, blur: 70 },
];

/* ══════════════════════════════════════════════════════════════ */
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Detect mobile once on mount — disable parallax on small screens
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  /*
   * Parallax speed targets (desktop only):
   *   Background image → 0.35x scroll speed (moves 14% as user scrolls through hero)
   *   Perfume bottle   → 0.25x scroll speed (slightly slower than content)
   *   Text content     → 0.15x scroll speed (barely drifts, grounding effect)
   *   Opacity          → fades out as section exits
   */
  const imageYRaw   = useTransform(scrollYProgress, [0, 1], [0, 14]);
  const bottleYRaw  = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const contentYRaw = useTransform(scrollYProgress, [0, 1], [0, 6]);

  const imageY   = useTransform(imageYRaw, (val) => isDesktop ? `${val}%` : '0%');
  const bottleY  = useTransform(bottleYRaw, (val) => isDesktop ? `${val}%` : '0%');
  const contentY = useTransform(contentYRaw, (val) => isDesktop ? `${val}%` : '0%');
  const overallO = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        background: '#2B0B16',
      }}
    >

      {/* ═══ BACKGROUND LAYER STACK ═══════════════════════════════ */}

      {/* 1 — hero image with parallax.
          Hidden on desktop (lg+): the 3D flacon background shows through the
          transparent hero instead. Kept on mobile, where the flacon is off. */}
      <motion.div
        style={{
          y: imageY,
          willChange: 'transform',
        }}
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1.0 }}
        transition={{ duration: 2.2, ease: SILK }}
        aria-hidden
        className="absolute inset-0 lg:hidden"
      >
        <img
          src="/banners/New-Banner.jpg"
          alt=""
          style={{
            width: '100%',
            height: '115%',
            objectFit: 'cover',
            objectPosition: 'center top',
            transform: 'translateY(-8%)',
            filter: 'brightness(0.28) saturate(0.7)',
          }}
        />
      </motion.div>

      {/* 2 — deep cinematic gradient over image */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          background: `
            linear-gradient(to right,  rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.35) 100%),
            linear-gradient(to bottom, rgba(0,0,0,0.5) 0%,  rgba(0,0,0,0)   40%, rgba(0,0,0,0.8) 100%)
          `,
        }}
      />

      {/* 3 — gold shimmer line (horizontal) */}
      <motion.div
        aria-hidden
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 2.5, delay: 0.8, ease: SILK }}
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(232,180,160,0.12) 30%, rgba(232,180,160,0.06) 70%, transparent)',
          transformOrigin: 'left',
          pointerEvents: 'none',
        }}
      />

      {/* 4 — animated smoke / mist blobs */}
      {SMOKE.map((s, i) => (
        <motion.div
          key={i}
          aria-hidden
          animate={{
            x: ['-2%', '2%', '-1%', '2%'],
            y: ['-2%', '1%', '-2%'],
            scale: [s.scale, s.scale * 1.08, s.scale],
          }}
          transition={{
            duration: s.dur,
            delay: s.delay,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: s.x,
            top:  s.y,
            width: 'clamp(300px, 40vw, 600px)',
            height: 'clamp(300px, 40vw, 600px)',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(232,180,160,0.045) 0%, rgba(232,180,160,0) 70%)`,
            filter: `blur(${s.blur}px)`,
            pointerEvents: 'none',
            mixBlendMode: 'screen',
          }}
        />
      ))}

      {/* 7 — vignette */}
      <div
        aria-hidden
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 45%, rgba(0,0,0,0.65) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ═══ CONTENT ══════════════════════════════════════════════ */}
      <motion.div
        style={{ y: contentY, opacity: overallO }}
        className="relative z-10 w-full"
        aria-label="Hero content"
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: 'clamp(108px, 14vw, 160px) clamp(20px, 6vw, 80px) clamp(80px, 10vw, 120px)',
            display: 'grid',
            gridTemplateColumns: '1fr',
          }}
        >
          <div style={{ maxWidth: '700px' }}>

            {/* ── Label ─────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 12, letterSpacing: '0.5em' }}
              animate={{ opacity: 1, y: 0,  letterSpacing: '0.28em' }}
              transition={{ duration: 1.1, delay: 0.2, ease: SILK }}
              style={{
                display:        'flex',
                alignItems:     'center',
                gap:            '14px',
                marginBottom:   'clamp(20px, 3vw, 32px)',
              }}
            >
              <span style={{
                display: 'block', width: '36px', height: '1px',
                background: 'linear-gradient(to right, transparent, #E8B4A0)',
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily:    'var(--font-body), Poppins, sans-serif',
                fontSize:      'clamp(9px, 1.1vw, 11px)',
                fontWeight:    500,
                color:         '#E8B4A0',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
              }}>
                The Identity Collection
              </span>
            </motion.div>

            {/* ── Headline ──────────────────────────────────────── */}
            <div style={{ overflow: 'hidden', marginBottom: 'clamp(20px, 3vw, 28px)' }}>
              {/* Line 1 — mask reveal + scale-in (0.95 → 1, per client spec) */}
              <motion.div
                initial={{ y: '110%', opacity: 0, scale: 0.95 }}
                animate={{ y: '0%',   opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.4, ease: SPEC }}
                style={{ transformOrigin: 'left bottom' }}
              >
                <h1
                  style={{
                    fontFamily:    'var(--font-display), "Playfair Display", Georgia, serif',
                    fontSize:      'clamp(32px, 5.5vw, 74px)',
                    fontWeight:    400,
                    lineHeight:    1.1,
                    letterSpacing: 'clamp(0.02em, 0.5vw, 0.06em)',
                    color:         '#FFFFFF',
                    margin:        0,
                  }}
                >
                  Discover The Fragrance
                </h1>
              </motion.div>

              {/* Line 2 — italic gold — mask reveal + scale-in (0.95 → 1) */}
              <motion.div
                initial={{ y: '110%', opacity: 0, scale: 0.95 }}
                animate={{ y: '0%',   opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.55, ease: SPEC }}
                style={{ transformOrigin: 'left bottom' }}
              >
                <h1
                  style={{
                    fontFamily:    'var(--font-display), "Playfair Display", Georgia, serif',
                    fontSize:      'clamp(32px, 5.5vw, 74px)',
                    fontWeight:    400,
                    fontStyle:     'italic',
                    lineHeight:    1.1,
                    letterSpacing: 'clamp(0.02em, 0.5vw, 0.06em)',
                    background:    'linear-gradient(135deg, #E8B4A0 0%, #F5D6CE 40%, #E8B4A0 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    margin:        0,
                  }}
                >
                  Behind Your Presence
                </h1>
              </motion.div>
            </div>

            {/* ── Description ───────────────────────────────────── */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ duration: 0.9, delay: 0.85, ease: SILK }}
              style={{
                fontFamily:    'var(--font-body), Poppins, sans-serif',
                fontSize:      'clamp(13px, 1.5vw, 16px)',
                fontWeight:    300,
                lineHeight:    1.85,
                color:         'rgba(255,255,255,0.55)',
                maxWidth:      '480px',
                marginBottom:  'clamp(32px, 4.5vw, 48px)',
              }}
            >
              Every individual carries a story. Every attitude leaves an impression.
              YAM-N7 fragrances are designed to reveal confidence, individuality,
              and the infinite character that exists within.
            </motion.p>

            {/* ── CTAs ──────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ duration: 0.8, delay: 1.05, ease: SILK }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}
            >
              {/* Gold filled */}
              <Link href="/shop" style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ scale: 1.03, boxShadow: '0 0 32px rgba(232,180,160,0.35)' }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display:       'inline-flex',
                    alignItems:    'center',
                    gap:           '10px',
                    padding:       'clamp(12px, 1.5vw, 15px) clamp(24px, 3vw, 36px)',
                    background:    'linear-gradient(135deg, #E8B4A0 0%, #F5D6CE 50%, #E8B4A0 100%)',
                    backgroundSize:'200% 100%',
                    color:         '#2B0B16',
                    fontFamily:    'var(--font-body), Poppins, sans-serif',
                    fontSize:      'clamp(10px, 1.1vw, 12px)',
                    fontWeight:    600,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    cursor:        'pointer',
                    borderRadius:  '1px',
                    transition:    'background-position 0.5s ease',
                    whiteSpace:    'nowrap',
                  }}
                >
                  Explore Collection
                  <ArrowRight size={14} strokeWidth={2} />
                </motion.div>
              </Link>

              {/* Gold outline */}
              <Link href="/about" style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{
                    background: 'rgba(232,180,160,0.08)',
                    borderColor: '#F5D6CE',
                  }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display:       'inline-flex',
                    alignItems:    'center',
                    gap:           '10px',
                    padding:       'clamp(11px, 1.5vw, 14px) clamp(24px, 3vw, 36px)',
                    background:    'transparent',
                    border:        '1px solid rgba(232,180,160,0.55)',
                    color:         '#E8B4A0',
                    fontFamily:    'var(--font-body), Poppins, sans-serif',
                    fontSize:      'clamp(10px, 1.1vw, 12px)',
                    fontWeight:    500,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    cursor:        'pointer',
                    borderRadius:  '1px',
                    transition:    'all 0.3s ease',
                    whiteSpace:    'nowrap',
                  }}
                >
                  Discover Your Identity
                </motion.div>
              </Link>
            </motion.div>

            {/* ── Stats bar ─────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.4 }}
              style={{
                display:        'flex',
                alignItems:     'center',
                gap:            'clamp(24px, 4vw, 48px)',
                marginTop:      'clamp(36px, 5vw, 56px)',
                paddingTop:     'clamp(24px, 3vw, 32px)',
                borderTop:      '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {[
                { value: '1400+', label: 'Fragrances' },
                { value: '25+',   label: 'Years of Craft' },
                { value: '10K+',  label: 'Identities Found' },
              ].map((stat, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  {i > 0 && (
                    <div style={{
                      position: 'absolute', left: `calc(-1 * clamp(12px, 2vw, 24px))`,
                      top: '50%', transform: 'translateY(-50%)',
                      width: '1px', height: '28px',
                      background: 'rgba(232,180,160,0.2)',
                    }} />
                  )}
                  <p style={{
                    fontFamily:    'var(--font-heading), "Cormorant Garamond", serif',
                    fontSize:      'clamp(22px, 2.8vw, 34px)',
                    fontWeight:    400,
                    color:         '#E8B4A0',
                    margin:        0,
                    lineHeight:    1,
                  }}>{stat.value}</p>
                  <p style={{
                    fontFamily:    'var(--font-body), Poppins, sans-serif',
                    fontSize:      'clamp(8px, 0.8vw, 10px)',
                    fontWeight:    400,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color:         'rgba(255,255,255,0.35)',
                    margin:        '5px 0 0',
                  }}>{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── Right side bottle image ───────────────────────────────
          Hidden on desktop: the animated 3D flacon (ScrollBottle3D) now owns
          this space and enters with its own intro animation. Mobile never
          showed this bottle, so it stays hidden everywhere. */}
      <div
        className="hidden"
        style={{
          position: 'absolute',
          right: 'clamp(40px, 8vw, 120px)',
          top:   '50%',
          transform: 'translateY(-50%)',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 40, filter: 'blur(16px)' }}
          animate={{ opacity: 1, scale: 1,   x: 0,  filter: 'blur(0px)' }}
          transition={{ duration: 1.6, delay: 0.6, ease: REVEAL }}
          style={{
            willChange: 'transform',
          }}
        >
          {/* Parallax wrapper — bottle drifts at 0.25x scroll speed on desktop */}
          <motion.div
            style={{
              y: bottleY,
              willChange: 'transform',
            }}
          >

          {/* Reflection glow behind bottle */}
          <div style={{
            position: 'absolute',
            bottom: '-10%',
            left:   '50%',
            transform: 'translateX(-50%)',
            width:  '140%',
            height: '60%',
            background: 'radial-gradient(ellipse, rgba(232,180,160,0.18) 0%, transparent 70%)',
            filter: 'blur(30px)',
            pointerEvents: 'none',
          }} />

          {/* Slow floating animation wrapper */}
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img
              src="/brand-story-bottle.png"
              alt="YAM-N7 Signature fragrance"
              style={{
                height:     'clamp(300px, 38vw, 560px)',
                width:      'auto',
                objectFit:  'contain',
                filter:     'drop-shadow(0 40px 80px rgba(0,0,0,0.8)) drop-shadow(0 0 40px rgba(232,180,160,0.15)) brightness(1.05)',
                display:    'block',
                maxWidth:   '100%',
              }}
            />

            {/* Floor reflection */}
            <div style={{
              width:   '100%',
              height:  '80px',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.04), transparent)',
              transform: 'scaleY(-0.25) scaleX(0.9)',
              transformOrigin: 'top',
              marginTop: '-4px',
              filter:   'blur(8px)',
              opacity:  0.6,
            }}>
              <img
                src="/brand-story-bottle.png"
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.2 }}
              />
            </div>
          </motion.div>

          {/* Floating badge */}
          <motion.div
            animate={{ y: [0, -6, 0], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{
              position:   'absolute',
              top:        '12%',
              left:       '-40px',
              background: 'rgba(43,11,22,0.85)',
              backdropFilter: 'blur(16px)',
              border:     '1px solid rgba(232,180,160,0.25)',
              padding:    '12px 18px',
              borderRadius: '2px',
            }}
          >
            <p style={{
              fontFamily:    'var(--font-body), Poppins, sans-serif',
              fontSize:      '9px',
              letterSpacing: '0.2em',
              color:         '#E8B4A0',
              textTransform: 'uppercase',
              margin:        0,
            }}>New</p>
            <p style={{
              fontFamily: 'var(--font-heading), "Cormorant Garamond", serif',
              fontSize:   '16px',
              color:      '#FFF',
              margin:     '2px 0 0',
              whiteSpace: 'nowrap',
            }}>Elite Series</p>
          </motion.div>
          </motion.div>{/* /parallax bottle wrapper */}
        </motion.div>
      </div>

      {/* ── Scroll indicator ──────────────────────────────────────── */}
      <motion.div
        style={overallO ? { opacity: overallO } : {}}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-[clamp(20px,3vw,36px)] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span style={{
          fontFamily:    'var(--font-body), Poppins, sans-serif',
          fontSize:      '9px',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color:         'rgba(232,180,160,0.5)',
        }}>Scroll</span>

        {/* Animated scroll line */}
        <div style={{ width: '1px', height: '40px', background: 'rgba(232,180,160,0.2)', position: 'relative', overflow: 'hidden' }}>
          <motion.div
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '50%',
              background: 'linear-gradient(to bottom, transparent, #E8B4A0)',
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
