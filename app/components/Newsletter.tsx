'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <section
      style={{
        background: '#090909',
        color: '#FFFFFF',
        padding: '120px 24px',
        borderTop: '1px solid rgba(200, 164, 107, 0.12)',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Abstract light rays in background */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(200,164,107,0.025) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div
        style={{
          maxWidth: '680px',
          width: '100%',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Centered Icon */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '52px',
              height: '52px',
              border: '1px solid rgba(200, 164, 107, 0.25)',
              background: 'rgba(200, 164, 107, 0.04)',
              borderRadius: '2px',
              marginBottom: '28px',
            }}
          >
            <Mail size={22} style={{ color: '#C8A46B' }} strokeWidth={1.5} />
          </div>

          {/* Subheading tag */}
          <p
            style={{
              fontFamily: 'var(--font-body), Poppins, sans-serif',
              fontSize: '11px',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#C8A46B',
              margin: '0 0 16px',
              fontWeight: 500,
            }}
          >
            Newsletter
          </p>

          {/* Heading */}
          <h2
            style={{
              fontFamily: 'var(--font-display), "Playfair Display", serif',
              fontSize: 'clamp(26px, 4.5vw, 40px)',
              fontWeight: 400,
              letterSpacing: '0.06em',
              color: '#FFFFFF',
              margin: '0 0 18px',
              textTransform: 'uppercase',
            }}
          >
            Join The Inner Circle
          </h2>

          {/* Description */}
          <p
            style={{
              fontFamily: 'var(--font-body), Poppins, sans-serif',
              fontSize: 'clamp(13px, 1.8vw, 15px)',
              lineHeight: 1.8,
              color: 'rgba(255, 255, 255, 0.65)',
              margin: '0 auto 40px',
              maxWidth: '520px',
            }}
          >
            Receive exclusive launches, limited editions, private offers, and luxury fragrance insights before anyone else.
          </p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                  background: 'rgba(200, 164, 107, 0.05)',
                  border: '1px solid rgba(200, 164, 107, 0.35)',
                  padding: '24px 32px',
                  borderRadius: '2px',
                  display: 'inline-block',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-display), "Playfair Display", serif',
                    fontSize: '22px',
                    color: '#C8A46B',
                    margin: 0,
                    letterSpacing: '0.04em',
                  }}
                >
                  You're in the circle.
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-body), Poppins, sans-serif',
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    margin: '6px 0 0',
                  }}
                >
                  We will share our exclusive creations with you soon.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  maxWidth: '480px',
                  margin: '0 auto',
                  width: '100%',
                }}
                className="sm:flex-row sm:gap-3"
              >
                <div style={{ position: 'relative', flex: 1 }}>
                  <Mail
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: isFocused ? '#C8A46B' : 'rgba(255, 255, 255, 0.4)',
                      transition: 'color 0.3s ease',
                    }}
                    strokeWidth={1.5}
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Email Address"
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: isFocused ? '1px solid #C8A46B' : '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '2px',
                      padding: '14px 16px 14px 44px',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontFamily: 'var(--font-body), Poppins, sans-serif',
                      outline: 'none',
                      boxShadow: isFocused ? '0 0 14px rgba(200, 164, 107, 0.3)' : 'none',
                      transition: 'all 0.35s ease',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{
                    background: isHovered ? '#C8A46B' : 'transparent',
                    color: isHovered ? '#0A0A0A' : '#C8A46B',
                    border: '1px solid #C8A46B',
                    borderRadius: '2px',
                    padding: '14px 28px',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-body), Poppins, sans-serif',
                    cursor: 'pointer',
                    transition: 'all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Join The Circle
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p
            style={{
              fontFamily: 'var(--font-body), Poppins, sans-serif',
              fontSize: '10px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              marginTop: '28px',
            }}
          >
            No spam. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
