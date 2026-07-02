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
  const orbitStyle = (size: string): React.CSSProperties => ({
    position: 'absolute',
    width: size,
    aspectRatio: '1',
  });
  const dotStyle: React.CSSProperties = {
    position: 'absolute',
    top: '-4.5px',
    left: '50%',
    width: '9px',
    height: '9px',
    borderRadius: '50%',
    background: '#F3E0B0',
    boxShadow: '0 0 14px rgba(200,164,107,0.9)',
    transform: 'translateX(-50%)',
  };

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

        {/* RIGHT COLUMN: animated "Nature 7" emblem — image-free */}
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
          {/* Luxury frame border */}
          <div
            style={{
              position: 'absolute',
              top: '-16px',
              left: '-16px',
              right: '16px',
              bottom: '16px',
              border: '1px solid rgba(200, 164, 107, 0.25)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
            className="hidden sm:block"
          />

          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4/5',
              maxHeight: '620px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.06)',
              background:
                'radial-gradient(ellipse at center, rgba(30,22,10,0.55) 0%, rgba(8,8,8,0.92) 72%)',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* radial gold glow */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                width: '72%',
                aspectRatio: '1',
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(200,164,107,0.18) 0%, transparent 66%)',
                filter: 'blur(22px)',
              }}
            />

            {/* rotating dashed gold rings */}
            <motion.div
              aria-hidden
              animate={{ rotate: 360 }}
              transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
              style={ringStyle('86%', '1px dashed rgba(200,164,107,0.22)')}
            />
            <motion.div
              aria-hidden
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              style={ringStyle('64%', '1px dashed rgba(200,164,107,0.32)')}
            />
            <motion.div
              aria-hidden
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              style={ringStyle('44%', '1px solid rgba(200,164,107,0.4)')}
            />

            {/* orbiting light dots */}
            <motion.div
              aria-hidden
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
              style={orbitStyle('64%')}
            >
              <span style={dotStyle} />
            </motion.div>
            <motion.div
              aria-hidden
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              style={orbitStyle('44%')}
            >
              <span style={dotStyle} />
            </motion.div>

            {/* central floating "7" */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'relative', zIndex: 5, textAlign: 'center' }}
            >
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-display), "Playfair Display", serif',
                  fontSize: 'clamp(130px, 20vw, 220px)',
                  fontWeight: 400,
                  lineHeight: 1,
                  background:
                    'linear-gradient(135deg, #C8A46B 0%, #F3E0B0 45%, #C8A46B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 8px 30px rgba(200,164,107,0.35))',
                }}
              >
                7
              </span>
              <span
                style={{
                  display: 'block',
                  marginTop: '10px',
                  fontFamily: 'var(--font-body), Poppins, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: 'rgba(200,164,107,0.7)',
                }}
              >
                Nature&nbsp;·&nbsp;Seven
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
