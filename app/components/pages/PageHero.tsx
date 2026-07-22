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
    <section className="relative overflow-hidden page-banner page-offset">
      {/* Soft brand wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% -10%, rgba(255,255,255,0.65) 0%, transparent 55%), linear-gradient(135deg, rgb(var(--color-background)) 0%, rgb(var(--color-champagne)) 45%, rgb(var(--color-primary) / 0.18) 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="luxury-container relative z-10 py-10 sm:py-12 md:py-14 lg:py-16">
        <div className={`grid gap-10 lg:gap-16 items-center ${image ? 'lg:grid-cols-2' : ''}`}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className={image ? '' : 'max-w-3xl mx-auto text-center'}
          >
            <p className="luxury-label mb-3">{label}</p>
            <h1 className="font-display tracking-wide uppercase text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-3">
              {title}
            </h1>
            {subtitle && (
              <p className={`text-foreground/70 text-base sm:text-lg leading-relaxed ${image ? 'max-w-xl' : 'max-w-2xl mx-auto'}`}>
                {subtitle}
              </p>
            )}
            {children && <div className={`mt-7 ${image ? '' : 'flex justify-center'}`}>{children}</div>}
          </motion.div>

          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease }}
              className="relative"
            >
              <div className="relative overflow-hidden border border-foreground/10 bg-surface shadow-sm">
                <img src={image} alt={imageAlt} className="w-full h-auto object-contain" />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
