'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hoverType, setHoverType] = useState<'none' | 'link' | 'image'>('none');

  // Core coordinates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Springs for smooth magnetic lag on outer ring
  const springConfig = { damping: 40, stiffness: 280, mass: 0.6 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  // Springs for spotlight glow lag
  const glowX = useSpring(cursorX, { damping: 50, stiffness: 120 });
  const glowY = useSpring(cursorY, { damping: 50, stiffness: 120 });

  // Enable only on desktop devices with hover support
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkDevice = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isLargeScreen = window.innerWidth >= 1024;
      setEnabled(!isTouch && isLargeScreen);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Update mouse positions
  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled, isVisible, cursorX, cursorY]);

  // Window enter/leave listeners
  useEffect(() => {
    if (!enabled) return;

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled]);

  // Detect hover targets globally
  useEffect(() => {
    if (!enabled) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isLinkOrBtn = target.closest('a, button, [role="button"], label, summary');
      const isImageOrProduct = target.closest('img, [data-hover="image"], [class*="product-card"], [class*="ProductCard"]');

      if (isLinkOrBtn) {
        setHoverType('link');
      } else if (isImageOrProduct) {
        setHoverType('image');
      } else {
        setHoverType('none');
      }
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Hide native browser cursor on desktop hoverable elements */}
      <style>{`
        @media (hover: hover) and (pointer: fine) {
          body, 
          a, 
          button, 
          [role="button"], 
          label,
          summary,
          img,
          [class*="product-card"],
          [class*="ProductCard"] {
            cursor: none !important;
          }
        }
      `}</style>

      {/* 1. Dynamic Spotlight Glow Layer */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(234,88,12,0.05) 0%, rgba(234,88,12,0.01) 45%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
          zIndex: 1, // Sit in background
          x: glowX,
          y: glowY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* 2. Custom Gold Cursor Core Dot */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#EA580C',
          pointerEvents: 'none',
          zIndex: 99999, // Overlay above most contents
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
          scale: hoverType === 'link' ? 0.5 : 1,
          transition: 'opacity 0.3s ease, scale 0.25s ease',
        }}
      />

      {/* 3. Custom Gold Cursor Outer Lag Ring */}
      <motion.div
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: hoverType === 'link' ? 52 : hoverType === 'image' ? 64 : 32,
          height: hoverType === 'link' ? 52 : hoverType === 'image' ? 64 : 32,
          borderRadius: '50%',
          border: '1px solid #EA580C',
          pointerEvents: 'none',
          zIndex: 99998,
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          background: hoverType === 'image' ? 'rgba(234,88,12, 0.08)' : 'transparent',
          borderColor: hoverType === 'link' ? '#FFFFFF' : '#EA580C',
          opacity: isVisible ? 1 : 0,
          transition: 'width 0.25s ease, height 0.25s ease, background-color 0.25s ease, border-color 0.25s ease, opacity 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AnimatePresence>
          {hoverType === 'image' && (
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                fontFamily: 'var(--font-body), Poppins, sans-serif',
                fontSize: '8px',
                color: '#EA580C',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                pointerEvents: 'none',
              }}
            >
              View
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
