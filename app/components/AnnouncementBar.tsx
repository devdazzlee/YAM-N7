'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const MESSAGES = [
  'FREE SHIPPING ON ORDERS OVER PKR 5000',
  'DISCOVER YOUR SIGNATURE SCENT',
  'CRAFTED FOR EVERY IDENTITY',
  'NEW ARRIVALS NOW LIVE',
  'YOUR ATTITUDE MATTERS',
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      aria-live="polite"
      style={{
        background: '#2B0B16',
        borderBottom: '1px solid rgba(232,180,160, 0.18)',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 60,
        width: '100%',
        flexShrink: 0,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            color: '#E8B4A0',
            fontFamily: 'var(--font-body), Poppins, sans-serif',
            fontSize: 'clamp(9px, 2vw, 10.5px)',
            fontWeight: 500,
            letterSpacing: 'clamp(0.1em, 1vw, 0.22em)',
            textTransform: 'uppercase',
            textAlign: 'center',
            maxWidth: '90vw',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            position: 'absolute',
            userSelect: 'none',
          }}
        >
          {MESSAGES[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
