'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────────
   TIMING MAP  (all values in seconds)
   0.00  – black screen fully opaque
   0.30  – particle dot appears
   0.75  – particle expands + glow blooms
   1.30  – logo fades up from particle origin
   1.85  – shimmer light sweeps left → right through logo
   2.30  – tagline 1 fades in
   2.70  – tagline 2 fades in
   3.10  – whole preloader starts fading out
   3.60  – unmount / reveal site
───────────────────────────────────────────────────────────────── */

/* Ease curves */
const EASE_SILK   = [0.25, 0.46, 0.45, 0.94] as const;
const EASE_REVEAL = [0.16, 1,    0.3,  1   ] as const;

export default function BrandPreloader() {
  const [show,       setShow]       = useState(false);
  const [mounted,    setMounted]    = useState(false);
  const audioRef                    = useRef<HTMLAudioElement | null>(null);

  /* ── Always show on every page load ── */
  useEffect(() => {
    setMounted(true);
    setShow(true);
  }, []);

  /* ── Optional ambient sound (drop an audio file at /sounds/intro.mp3) ── */
  useEffect(() => {
    if (!show) return;
    try {
      const audio = new Audio('/sounds/intro.mp3');
      audio.volume = 0.18;
      audio.play().catch(() => { /* browsers may block autoplay – silent fail */ });
      audioRef.current = audio;
    } catch {
      /* no file present – ignore */
    }
    return () => {
      audioRef.current?.pause();
    };
  }, [show]);

  /* ── Auto-dismiss after 3.6 s ── */
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setShow(false), 3600);
    return () => clearTimeout(t);
  }, [show]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE_SILK, delay: 3.05 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#000000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
          aria-hidden="true"
        >
          {/* ── 1. PARTICLE + GLOW ─────────────────────────────────── */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            {/* Outer glow ring – blooms as particle expands */}
            <motion.div
              initial={{ opacity: 0, scale: 0.1 }}
              animate={{ opacity: [0, 0.18, 0.10], scale: [0.1, 6, 8] }}
              transition={{ duration: 1.6, delay: 0.35, ease: EASE_REVEAL }}
              style={{
                position: 'absolute',
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(200,164,107,0.55) 0%, rgba(200,164,107,0) 70%)',
                filter: 'blur(28px)',
                pointerEvents: 'none',
              }}
            />

            {/* Second softer glow ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.1 }}
              animate={{ opacity: [0, 0.10, 0.06], scale: [0.1, 10, 14] }}
              transition={{ duration: 2.0, delay: 0.5, ease: EASE_REVEAL }}
              style={{
                position: 'absolute',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(216,196,160,0.35) 0%, rgba(216,196,160,0) 70%)',
                filter: 'blur(40px)',
                pointerEvents: 'none',
              }}
            />

            {/* The particle dot itself */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.5] }}
              transition={{ duration: 1.1, delay: 0.28, ease: EASE_REVEAL, times: [0, 0.4, 1] }}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#C8A46B',
                boxShadow: '0 0 12px 4px rgba(200,164,107,0.9)',
                position: 'absolute',
                zIndex: 2,
              }}
            />

            {/* ── 2. LOGO ─────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.82, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 1.25, ease: EASE_REVEAL }}
              style={{ position: 'relative', zIndex: 3 }}
            >
              {/* Logo image */}
              <img
                src="/YAM-N7-Logo.png"
                alt="YAM-N7"
                style={{
                  height: 'clamp(72px, 12vw, 120px)',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  filter: 'brightness(1.15)',
                }}
              />

              {/* ── 3. SHIMMER SWEEP ──────────────────────────────── */}
              <motion.div
                initial={{ x: '-115%', opacity: 0.9 }}
                animate={{ x: '115%',  opacity: 0  }}
                transition={{ duration: 0.72, delay: 1.88, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, rgba(216,196,160,0.3) 52%, transparent 70%)',
                  mixBlendMode: 'screen',
                  pointerEvents: 'none',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              />
            </motion.div>
          </div>

          {/* ── 4. TAGLINES ─────────────────────────────────────────── */}
          <div
            style={{
              marginTop: '36px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {/* Tagline 1 */}
            <motion.p
              initial={{ opacity: 0, y: 14, letterSpacing: '0.3em' }}
              animate={{ opacity: 1, y: 0,  letterSpacing: '0.24em' }}
              transition={{ duration: 0.85, delay: 2.28, ease: EASE_SILK }}
              style={{
                fontFamily:   "'Cormorant Garamond', Georgia, serif",
                fontSize:     'clamp(10px, 1.5vw, 14px)',
                fontWeight:   400,
                color:        '#C8A46B',
                textTransform:'uppercase',
                letterSpacing:'0.24em',
                textAlign:    'center',
                margin:        0,
              }}
            >
              Minimal Outside. Infinite Within.
            </motion.p>

            {/* Tagline 2 */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ duration: 0.75, delay: 2.72, ease: EASE_SILK }}
              style={{
                fontFamily:   "'Poppins', system-ui, sans-serif",
                fontSize:     'clamp(9px, 1.2vw, 11px)',
                fontWeight:   300,
                color:        'rgba(192,192,192,0.65)',
                letterSpacing:'0.18em',
                textTransform:'uppercase',
                textAlign:    'center',
                margin:        0,
              }}
            >
              Your Attitude Matters.
            </motion.p>
          </div>

          {/* Subtle vignette overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.65) 100%)',
              pointerEvents: 'none',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
