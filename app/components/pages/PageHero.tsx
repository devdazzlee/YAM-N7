'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { ease } from '../motion/reveal';

interface PageHeroProps {
  label: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  image?: string;
  imageAlt?: string;
}

export default function PageHero({
  label,
  title,
  subtitle,
  children,
  image,
  imageAlt = '',
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-surface border-b border-border">
      <div className="absolute inset-0 bg-gradient-to-br from-surface-muted/50 via-surface to-background" />

      <div className="luxury-container relative z-10 py-14 sm:py-16 md:py-20 lg:py-24">
        <div className={`grid gap-10 lg:gap-16 items-center ${image ? 'lg:grid-cols-2' : ''}`}>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className={image ? '' : 'max-w-3xl mx-auto text-center'}
          >
            <p className="luxury-label mb-4">{label}</p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-light text-foreground leading-tight mb-4">
              {title}
            </h1>
            {subtitle && (
              <p className={`text-muted text-base sm:text-lg leading-relaxed ${image ? 'max-w-xl' : 'max-w-2xl mx-auto'}`}>
                {subtitle}
              </p>
            )}
            {children && <div className={`mt-8 ${image ? '' : 'flex justify-center'}`}>{children}</div>}
          </motion.div>

          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.15, ease }}
              className="relative"
            >
              <div className="absolute -inset-3 border border-border hidden sm:block" />
              <div className="relative overflow-hidden shadow-luxury rounded-sm bg-surface-muted">
                <img src={image} alt={imageAlt} className="w-full h-auto object-contain" />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
