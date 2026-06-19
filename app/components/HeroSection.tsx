'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ease } from './motion/reveal';

export default function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 1.04, filter: 'blur(12px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1, ease }}
      className="relative w-full overflow-hidden bg-surface-elevated"
    >
      <Link href="/shop" className="block w-full" aria-label="Shop YAM-N7 collection">
        <motion.img
          src="/banners/New-Banner.jpg"
          alt="YAM-N7 - Luxury Perfumes & Fragrances Since 2000."
          className="block h-auto w-full object-cover"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease }}
          whileHover={{ scale: 1.02 }}
        />
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/40 to-transparent"
      />
    </motion.section>
  );
}
