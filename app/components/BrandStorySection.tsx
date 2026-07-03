'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function BrandStorySection() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.45,
      },
    },
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number], // easeOutCubic
      },
    },
  };

  // Concentric-ring emblem helpers (image-free right column)
  const ringStyle = (size: string, border: string): React.CSSProperties => ({
    position: 'absolute',
    width: size,
    aspectRatio: '1',
    borderRadius: '50%',
    border,
  });
  const cornerStyle = (pos: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  }): React.CSSProperties => ({
    position: 'absolute',
    width: '34px',
    height: '34px',
    zIndex: 3,
    ...pos,
    borderTop: pos.top !== undefined ? '1px solid rgba(200,164,107,0.55)' : undefined,
    borderBottom: pos.bottom !== undefined ? '1px solid rgba(200,164,107,0.55)' : undefined,
    borderLeft: pos.left !== undefined ? '1px solid rgba(200,164,107,0.55)' : undefined,
    borderRight: pos.right !== undefined ? '1px solid rgba(200,164,107,0.55)' : undefined,
  });

  return (
    <section
      style={{
        background: '#080808',
        color: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        padding: '120px 24px',
        borderTop: '1px solid rgba(200, 164, 107, 0.12)',
        borderBottom: '1px solid rgba(200, 164, 107, 0.12)',
      }}
    >
      {/* Decorative subtle background gradient */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '50%',
          height: '50%',
          background: 'radial-gradient(circle, rgba(200,164,107,0.03) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '50%',
          height: '50%',
          background: 'radial-gradient(circle, rgba(200,164,107,0.03) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '64px',
        }}
        className="lg:grid-cols-2 items-center"
      >
        {/* LEFT COLUMN: TEXT */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Accent small tag */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: 'var(--font-body), Poppins, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#C8A46B',
              margin: '0 0 20px',
              fontWeight: 500,
            }}
          >
            Brand Story
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            style={{
              fontFamily: 'var(--font-display), "Playfair Display", serif',
              fontSize: 'clamp(28px, 4.5vw, 44px)',
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: '#FFFFFF',
              margin: '0 0 48px',
              textTransform: 'capitalize',
            }}
          >
            The Art Of Becoming
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-85px' }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {/* Line 1 */}
            <motion.p
              variants={lineVariants}
              style={{
                fontFamily: 'var(--font-display), "Playfair Display", serif',
                fontSize: 'clamp(18px, 2.5vw, 24px)',
                lineHeight: 1.4,
                color: '#F3F4F6',
                fontStyle: 'italic',
                margin: 0,
              }}
            >
              At YAM-N7, fragrance is more than scent.
            </motion.p>

            {/* Line 2, 3, 4 (Core pillars, styled beautifully) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                paddingLeft: '16px',
                borderLeft: '1px solid rgba(200,164,107,0.2)',
                margin: '12px 0',
              }}
            >
              <motion.span
                variants={lineVariants}
                style={{
                  fontFamily: 'var(--font-display), "Playfair Display", serif',
                  fontSize: 'clamp(20px, 3vw, 28px)',
                  letterSpacing: '0.05em',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                }}
              >
                It is confidence.
              </motion.span>
              <motion.span
                variants={lineVariants}
                style={{
                  fontFamily: 'var(--font-display), "Playfair Display", serif',
                  fontSize: 'clamp(20px, 3vw, 28px)',
                  letterSpacing: '0.05em',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                }}
              >
                It is identity.
              </motion.span>
              <motion.span
                variants={lineVariants}
                style={{
                  fontFamily: 'var(--font-display), "Playfair Display", serif',
                  fontSize: 'clamp(20px, 3vw, 28px)',
                  letterSpacing: '0.05em',
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                }}
              >
                It is presence.
              </motion.span>
            </div>

            {/* Line 5 */}
            <motion.p
              variants={lineVariants}
              style={{
                fontFamily: 'var(--font-body), Poppins, sans-serif',
                fontSize: 'clamp(14px, 1.8vw, 16px)',
                lineHeight: 1.8,
                color: '#9CA3AF',
                margin: '8px 0',
                maxWidth: '540px',
              }}
            >
              Inspired by the symbolism of Nature 7, our creations are designed to reveal the infinite character that exists within every individual.
            </motion.p>

            {/* Line 6 & 7 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '8px 0' }}>
              <motion.p
                variants={lineVariants}
                style={{
                  fontFamily: 'var(--font-body), Poppins, sans-serif',
                  fontSize: 'clamp(15px, 2vw, 18px)',
                  color: '#E5E7EB',
                  margin: 0,
                }}
              >
                Because what defines us is not how we appear.
              </motion.p>
              <motion.p
                variants={lineVariants}
                style={{
                  fontFamily: 'var(--font-body), Poppins, sans-serif',
                  fontSize: 'clamp(15px, 2vw, 18px)',
                  color: '#E5E7EB',
                  margin: 0,
                }}
              >
                It is how we make others feel.
              </motion.p>
            </div>

            {/* Line 8 (Larger, Gold) */}
            <motion.p
              variants={lineVariants}
              style={{
                fontFamily: 'var(--font-display), "Playfair Display", serif',
                fontSize: 'clamp(24px, 3.8vw, 36px)',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: '#C8A46B',
                margin: '24px 0 0',
                textTransform: 'uppercase',
                textShadow: '0 4px 20px rgba(200,164,107,0.15)',
              }}
            >
              Minimal Outside. Infinite Within.
            </motion.p>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: "Nature 7" emblem — image-free */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4/5',
              maxHeight: '620px',
            }}
          >
            {/* Quiet corner brackets — replaces the boxy offset frame */}
            <span aria-hidden className="hidden sm:block" style={cornerStyle({ top: -14, left: -14 })} />
            <span aria-hidden className="hidden sm:block" style={cornerStyle({ top: -14, right: -14 })} />
            <span aria-hidden className="hidden sm:block" style={cornerStyle({ bottom: -14, left: -14 })} />
            <span aria-hidden className="hidden sm:block" style={cornerStyle({ bottom: -14, right: -14 })} />

            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                boxShadow: '0 25px 60px -12px rgba(0,0,0,0.85)',
                border: '1px solid rgba(255,255,255,0.06)',
                background:
                  'radial-gradient(ellipse at center, rgba(30,22,10,0.5) 0%, rgba(8,8,8,0.95) 75%)',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* faint diagonal texture — quiet depth, not sparkle */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.04,
                  backgroundImage:
                    'repeating-linear-gradient(45deg, #C8A46B 0px, #C8A46B 1px, transparent 1px, transparent 28px)',
                }}
              />

              {/* soft gold glow */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  width: '58%',
                  aspectRatio: '1',
                  borderRadius: '50%',
                  background:
                    'radial-gradient(circle, rgba(200,164,107,0.16) 0%, transparent 70%)',
                  filter: 'blur(30px)',
                }}
              />

              {/* single boundary ring */}
              <div aria-hidden style={ringStyle('58%', '1px solid rgba(200,164,107,0.28)')} />

              {/* slow-rotating circular seal text — the one motion accent */}
              <motion.svg
                aria-hidden
                viewBox="0 0 200 200"
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', width: '80%', aspectRatio: '1' }}
              >
                <defs>
                  <path id="natureSevenRing" d="M100,100 m-82,0 a82,82 0 1,1 164,0 a82,82 0 1,1 -164,0" />
                </defs>
                <text
                  fontSize="7.4"
                  letterSpacing="3.4"
                  fill="rgba(200,164,107,0.62)"
                  style={{ fontFamily: 'var(--font-body), Poppins, sans-serif' }}
                >
                  <textPath href="#natureSevenRing" startOffset="0%">
                    NATURE · SEVEN · ARTISAN PARFUM · NATURE · SEVEN · ARTISAN PARFUM ·
                  </textPath>
                </text>
              </motion.svg>

              {/* central emblem */}
              <div style={{ position: 'relative', zIndex: 5, textAlign: 'center' }}>
                <span
                  aria-hidden
                  style={{
                    display: 'block',
                    width: '40px',
                    height: '1px',
                    margin: '0 auto 18px',
                    background: 'linear-gradient(to right, transparent, #C8A46B, transparent)',
                  }}
                />
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-display), "Playfair Display", serif',
                    fontStyle: 'italic',
                    fontSize: 'clamp(120px, 18vw, 200px)',
                    fontWeight: 400,
                    lineHeight: 1,
                    background:
                      'linear-gradient(135deg, #C8A46B 0%, #F3E0B0 45%, #C8A46B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 8px 30px rgba(200,164,107,0.3))',
                  }}
                >
                  7
                </span>
                <span
                  aria-hidden
                  style={{
                    display: 'block',
                    width: '40px',
                    height: '1px',
                    margin: '18px auto 16px',
                    background: 'linear-gradient(to right, transparent, #C8A46B, transparent)',
                  }}
                />
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-body), Poppins, sans-serif',
                    fontSize: '11px',
                    letterSpacing: '0.4em',
                    textTransform: 'uppercase',
                    color: 'rgba(200,164,107,0.75)',
                  }}
                >
                  Nature&nbsp;·&nbsp;Seven
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
